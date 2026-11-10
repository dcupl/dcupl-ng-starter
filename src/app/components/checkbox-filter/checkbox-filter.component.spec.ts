import { TestBed } from '@angular/core/testing';
import { DcuplList } from '@dcupl/core';
import { CheckboxFilterComponent } from './checkbox-filter.component';

describe('CheckboxFilterComponent', () => {
  function setup() {
    const facets = [
      { key: 'Blue', value: 'Blue', size: 3, selected: false, enabled: true },
      { key: 'Red', value: 'Red', size: 2, selected: false, enabled: true },
    ];
    const query = { addCondition: vi.fn(), removeCondition: vi.fn() };
    const list = {
      catalog: { query, fn: { facets: vi.fn(() => facets) } },
      onResultChange: vi.fn(() => () => undefined),
    } as unknown as DcuplList;
    const fixture = TestBed.createComponent(CheckboxFilterComponent);
    fixture.componentRef.setInput('list', list);
    fixture.componentRef.setInput('definition', {
      attribute: 'color',
      label: 'Color',
      type: 'checkbox',
    });
    fixture.detectChanges();
    return { element: fixture.nativeElement as HTMLElement, query };
  }

  it('links each label to its own checkbox', () => {
    const { element } = setup();

    const labels = Array.from(element.querySelectorAll('label'));
    const ids = labels.map((label) => label.htmlFor);

    expect(new Set(ids).size).toBe(labels.length);
    for (const id of ids) {
      expect(element.querySelector(`input[type="checkbox"][id="${id}"]`)).not.toBeNull();
    }
  });

  it('adds the facet condition when its label is clicked', () => {
    const { element, query } = setup();

    element.querySelectorAll('label')[1].click();

    expect(query.addCondition).toHaveBeenCalledWith({
      attribute: 'color',
      operator: 'eq',
      value: 'Red',
    });
  });
});
