import { Component, input } from '@angular/core';
import { DcuplList } from '@dcupl/core';
import { TextFilterComponent } from '../text-filter/text-filter.component';
import { CheckboxFilterComponent } from '../checkbox-filter/checkbox-filter.component';

/**
 * Call before a filter changes the list's conditions, so the new result starts at page 1.
 * skipProcessing only stores start; the condition change right after it recomputes the result once.
 */
export function startAtFirstPage(list: DcuplList): void {
  list.catalog.query.applyOptions({ start: 0 }, { skipProcessing: true });
}

export type FilterDefinitionType = 'text' | 'checkbox';

export type FilterDefinition = {
  attribute: string;
  label: string;
  type: FilterDefinitionType;
};

@Component({
  selector: 'app-filter-bar',
  templateUrl: './filter-bar.component.html',
  imports: [TextFilterComponent, CheckboxFilterComponent],
})
export class FilterBarComponent {
  public readonly list = input.required<DcuplList>();

  public readonly filterDefinitions: FilterDefinition[] = [
    { attribute: 'productName', label: 'Product Name', type: 'text' },
    { attribute: 'color', label: 'Color', type: 'checkbox' },
  ];
}
