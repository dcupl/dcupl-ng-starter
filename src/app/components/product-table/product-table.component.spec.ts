import { TestBed } from '@angular/core/testing';
import { DcuplList } from '@dcupl/core';
import { ProductTableComponent } from './product-table.component';

describe('ProductTableComponent', () => {
  /** A list stand-in that keeps the applied start/count like the SDK does. */
  function setup(currentSize: number) {
    let applied = { start: 0, count: 10 };
    let resultChanged: () => void = () => undefined;
    const query = {
      applyOptions: vi.fn((options: { start?: number; count?: number }) => {
        applied = {
          start: options.start ?? applied.start,
          count: options.count ?? applied.count,
        };
      }),
      items: vi.fn(() => [{ key: '1' }]),
    };
    const list = {
      catalog: {
        query,
        fn: { metadata: vi.fn(() => ({ appliedQuery: { ...applied }, currentSize })) },
      },
      onResultChange: vi.fn((callback: () => void) => {
        resultChanged = callback;
        return () => undefined;
      }),
    } as unknown as DcuplList;

    const fixture = TestBed.createComponent(ProductTableComponent);
    fixture.componentRef.setInput('list', list);
    fixture.componentRef.setInput('visibleColumns', ['key']);
    fixture.detectChanges();
    return { component: fixture.componentInstance, query, resultChanged: () => resultChanged() };
  }

  it('starts on the first page with 10 items per page', () => {
    const { component, query } = setup(25);

    expect(query.applyOptions.mock.calls[0][0]).toMatchObject({ start: 0, count: 10 });
    expect(component.previousDisabled()).toBe(true);
    expect(component.nextDisabled()).toBe(false);
  });

  it('next() and previous() move one page', () => {
    const { component, query, resultChanged } = setup(25);

    component.next();
    expect(query.applyOptions).toHaveBeenLastCalledWith({ start: 10 });
    resultChanged();
    expect(component.previousDisabled()).toBe(false);

    component.previous();
    expect(query.applyOptions).toHaveBeenLastCalledWith({ start: 0 });
  });

  it('a filter change after paging shows the first page again', () => {
    const { component, resultChanged } = setup(25);
    component.next();
    resultChanged(); // the page change itself
    expect(component.previousDisabled()).toBe(false);

    resultChanged(); // a filter change

    expect(component.previousDisabled()).toBe(true);
  });

  it('reports the current page and the page count', () => {
    const { component, resultChanged } = setup(25);
    expect(component.page()).toBe(1);
    expect(component.pageCount()).toBe(3);

    component.next();
    resultChanged();

    expect(component.page()).toBe(2);
  });

  it('counts one page when nothing matches', () => {
    const { component } = setup(0);

    expect(component.page()).toBe(1);
    expect(component.pageCount()).toBe(1);
  });

  it('disables next on the last page', () => {
    const { component } = setup(8);

    expect(component.nextDisabled()).toBe(true);
  });
});
