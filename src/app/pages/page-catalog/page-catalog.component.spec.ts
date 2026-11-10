import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Dcupl } from '@dcupl/core';
import { DcuplService } from '../../services/dcupl.service';
import { PageCatalogComponent } from './page-catalog.component';

describe('PageCatalogComponent', () => {
  function fakeDcupl() {
    const list = {
      catalog: { fn: { metadata: vi.fn(() => ({ attributes: [{ key: 'productName' }] })) } },
      destroy: vi.fn(),
    };
    const dcupl = { lists: { create: vi.fn(() => list) } } as unknown as Dcupl;
    return { dcupl, list };
  }

  function setup(init: () => Promise<Dcupl>) {
    TestBed.configureTestingModule({
      providers: [{ provide: DcuplService, useValue: { init: vi.fn(init) } }],
    });
    // the child components are covered by their own specs
    TestBed.overrideComponent(PageCatalogComponent, {
      set: { imports: [], schemas: [NO_ERRORS_SCHEMA] },
    });
    const fixture = TestBed.createComponent(PageCatalogComponent);
    fixture.detectChanges();
    return { fixture, element: fixture.nativeElement as HTMLElement };
  }

  it('destroys its list when the page is destroyed', async () => {
    const { dcupl, list } = fakeDcupl();
    const { fixture } = setup(() => Promise.resolve(dcupl));
    await vi.waitFor(() => expect(fixture.componentInstance.list()).toBe(list));

    fixture.destroy();

    expect(list.destroy).toHaveBeenCalledTimes(1);
  });

  it('shows the load error and loads again on retry', async () => {
    const { dcupl, list } = fakeDcupl();
    const init = vi
      .fn<() => Promise<Dcupl>>()
      .mockRejectedValueOnce(new Error('offline'))
      .mockResolvedValueOnce(dcupl);
    const { fixture, element } = setup(init);
    await vi.waitFor(() => expect(fixture.componentInstance.error()).toBe('offline'));
    fixture.detectChanges();
    expect(element.textContent).toContain('Could not load data');

    element.querySelector('button')!.click();

    await vi.waitFor(() => expect(fixture.componentInstance.list()).toBe(list));
    expect(fixture.componentInstance.error()).toBeUndefined();
  });
});
