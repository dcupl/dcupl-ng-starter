import { TestBed } from '@angular/core/testing';
import { DcuplList } from '@dcupl/core';
import { TextFilterComponent } from './text-filter.component';

describe('TextFilterComponent', () => {
  function setup() {
    const query = { apply: vi.fn(), remove: vi.fn() };
    const list = { catalog: { query } } as unknown as DcuplList;
    const fixture = TestBed.createComponent(TextFilterComponent);
    fixture.componentRef.setInput('list', list);
    fixture.componentRef.setInput('definition', {
      attribute: 'productName',
      label: 'Product Name',
      type: 'text',
    });
    fixture.detectChanges();
    return { component: fixture.componentInstance, query };
  }

  it('sets an escaped, case-insensitive find condition on the attribute', () => {
    const { component, query } = setup();

    component.applyQuery('Ball (Pro)');

    expect(query.apply).toHaveBeenCalledWith(
      {
        attribute: 'productName',
        operator: 'find',
        value: '/ball \\(pro\\)/',
        options: { transform: ['lowercase'] },
      },
      { mode: 'set' },
    );
  });

  it('removes the attribute group when the input is cleared', () => {
    const { component, query } = setup();

    component.applyQuery('');

    expect(query.remove).toHaveBeenCalledWith({ groupKey: 'productName' });
    expect(query.apply).not.toHaveBeenCalled();
  });
});
