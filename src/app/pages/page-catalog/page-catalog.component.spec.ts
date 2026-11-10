import { TestBed } from '@angular/core/testing';
import { Dcupl } from '@dcupl/core';
import { DcuplService } from '../../services/dcupl.service';
import { PageCatalogComponent } from './page-catalog.component';

/**
 * The whole catalog page against a real dcupl instance. Only the console load is replaced:
 * the models and their data are set in memory, so the spec runs offline.
 */

// 25 articles, 10 per page, so three pages: 5 red balls, 8 blue shoes, 12 green shirts.
const articles = Array.from({ length: 25 }, (_, index) => {
  const n = index + 1;
  const [productName, color] = n <= 5 ? ['Ball', 'Red'] : n <= 13 ? ['Shoe', 'Blue'] : ['Shirt', 'Green'];
  return {
    key: `a${n}`,
    productName: n === 1 ? 'Ball (Pro)' : `${productName} ${n}`,
    category: `${productName}s`,
    color,
    price: n,
    inStock: n * 10,
    // the last article has no vendor
    vendorId: n === 25 ? undefined : n % 2 ? 'v1' : 'v2',
  };
});

async function createDcupl(): Promise<Dcupl> {
  const dcupl = new Dcupl();
  dcupl.models.set({
    key: 'Vendor',
    properties: [
      { key: 'contactName', type: 'string' },
      { key: 'companyName', type: 'string' },
    ],
    data: [
      { key: 'v1', contactName: 'John Doe', companyName: 'SportWorld' },
      { key: 'v2', contactName: 'Mia Wilson', companyName: 'ProAthleticWear' },
    ],
  });
  dcupl.models.set({
    key: 'Article',
    properties: [
      { key: 'productName', type: 'string' },
      { key: 'category', type: 'string' },
      { key: 'color', type: 'string', filter: true },
      { key: 'price', type: 'float' },
      { key: 'inStock', type: 'int' },
    ],
    references: [{ key: 'vendorId', type: 'singleValued', model: 'Vendor' }],
    data: articles,
  });
  await dcupl.init();
  return dcupl;
}

describe('PageCatalogComponent with a real dcupl instance', () => {
  let dcupl: Dcupl;

  beforeEach(async () => {
    dcupl = await createDcupl();
  });

  afterEach(() => {
    dcupl.destroy();
  });

  async function render(init: () => Promise<Dcupl> = () => Promise.resolve(dcupl)) {
    TestBed.configureTestingModule({
      providers: [{ provide: DcuplService, useValue: { init: vi.fn(init) } }],
    });
    const fixture = TestBed.createComponent(PageCatalogComponent);
    const element = fixture.nativeElement as HTMLElement;

    const settle = async (): Promise<void> => {
      await fixture.whenStable();
      fixture.detectChanges();
    };
    const button = (name: string): HTMLButtonElement =>
      Array.from(element.querySelectorAll('button')).find((b) => b.textContent?.trim() === name)!;
    const click = async (name: string): Promise<void> => {
      button(name).click();
      await settle();
    };
    const tickColor = async (color: string): Promise<void> => {
      const labels = Array.from(element.querySelectorAll('fieldset label'));
      (labels.find((label) => label.textContent?.includes(color)) as HTMLElement).click();
      await settle();
    };
    const searchProductName = async (value: string): Promise<void> => {
      element.querySelector<HTMLInputElement>('input[type="text"]')!.value = value;
      await click('Apply');
    };

    const text = (el: Element | null): string => el?.textContent?.replace(/\s+/g, ' ').trim() ?? '';
    const rows = (): string[][] =>
      Array.from(element.querySelectorAll('tbody tr')).map((row) =>
        Array.from(row.querySelectorAll('td')).map(text),
      );
    const rowKeys = (): string[] => rows().map((cells) => cells[0]);
    const pageLabel = (): string => text(element.querySelector('nav[aria-label="Pagination"] p'));
    const facetCounts = (): Record<string, string> =>
      Object.fromEntries(
        Array.from(element.querySelectorAll('fieldset label')).map((label) => {
          const [name, count] = Array.from(label.querySelectorAll('span')).map(text);
          return [name, count];
        }),
      );

    fixture.detectChanges();
    await vi.waitFor(() => expect(fixture.componentInstance.list() ?? fixture.componentInstance.error()).toBeDefined());
    await settle();

    return {
      fixture,
      element,
      button,
      click,
      tickColor,
      searchProductName,
      rows,
      rowKeys,
      pageLabel,
      facetCounts,
    };
  }

  it('shows the first page of ten articles', async () => {
    const { rowKeys, pageLabel, button } = await render();

    expect(rowKeys()).toEqual(['a1', 'a2', 'a3', 'a4', 'a5', 'a6', 'a7', 'a8', 'a9', 'a10']);
    expect(pageLabel()).toBe('Page 1 of 3');
    expect(button('Previous').disabled).toBe(true);
    expect(button('Next').disabled).toBe(false);
  });

  it('shows the chosen columns, with the vendor resolved to its contact and company', async () => {
    const { element, rows } = await render();

    const headers = Array.from(element.querySelectorAll('thead th')).map((th) => th.textContent?.trim());
    expect(headers).toEqual(['Key', 'Product name', 'Vendor', 'Category', 'Price', 'In stock', 'Color']);
    expect(rows()[0]).toEqual(['a1', 'Ball (Pro)', 'John Doe (SportWorld)', 'Balls', '1', '10', 'Red']);
  });

  it('a row without a vendor shows "—" in the vendor column', async () => {
    const { searchProductName, rows } = await render();

    await searchProductName('shirt 25');

    expect(rows()).toEqual([['a25', 'Shirt 25', '—', 'Shirts', '25', '250', 'Green']]);
  });

  it('next and previous move one page', async () => {
    const { click, rowKeys, pageLabel, button } = await render();

    await click('Next');
    expect(pageLabel()).toBe('Page 2 of 3');
    expect(rowKeys()[0]).toBe('a11');

    await click('Next');
    expect(pageLabel()).toBe('Page 3 of 3');
    expect(rowKeys()).toEqual(['a21', 'a22', 'a23', 'a24', 'a25']);
    expect(button('Next').disabled).toBe(true);

    await click('Previous');
    expect(pageLabel()).toBe('Page 2 of 3');
  });

  it('a colour filter on page 2 starts again at page 1', async () => {
    const { click, tickColor, rowKeys, pageLabel } = await render();
    await click('Next');

    await tickColor('Green');

    expect(pageLabel()).toBe('Page 1 of 2');
    expect(rowKeys()[0]).toBe('a14');
  });

  it('a product-name search on page 2 starts again at page 1', async () => {
    const { click, searchProductName, pageLabel } = await render();
    await click('Next');

    await searchProductName('shirt');

    expect(pageLabel()).toBe('Page 1 of 2');
  });

  it('the product-name search ignores case and matches regex characters literally', async () => {
    const { searchProductName, rowKeys } = await render();

    await searchProductName('BALL (PRO)');

    expect(rowKeys()).toEqual(['a1']);
  });

  it('the colour facets count the articles and follow the other filters', async () => {
    const { searchProductName, facetCounts } = await render();
    expect(facetCounts()).toEqual({ Red: '5', Blue: '8', Green: '12' });

    await searchProductName('ball');

    expect(facetCounts()).toEqual({ Red: '5', Blue: '0', Green: '0' });
  });

  it('destroys its list when the page is destroyed', async () => {
    const { fixture } = await render();
    const destroy = vi.spyOn(fixture.componentInstance.list()!, 'destroy');

    fixture.destroy();

    expect(destroy).toHaveBeenCalledTimes(1);
  });

  it('shows the load error and loads again on retry', async () => {
    const init = vi
      .fn<() => Promise<Dcupl>>()
      .mockRejectedValueOnce(new Error('offline'))
      .mockResolvedValueOnce(dcupl);
    const { fixture, element, click, rowKeys } = await render(init);
    expect(element.textContent).toContain('Could not load data');
    expect(element.textContent).toContain('offline');

    await click('Retry');

    await vi.waitFor(() => expect(fixture.componentInstance.list()).toBeDefined());
    fixture.detectChanges();
    expect(rowKeys()).toHaveLength(10);
  });
});
