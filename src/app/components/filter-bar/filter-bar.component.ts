import { Component, input } from '@angular/core';
import { DcuplList } from '@dcupl/core';
import { TextFilterComponent } from '../text-filter/text-filter.component';
import { CheckboxFilterComponent } from '../checkbox-filter/checkbox-filter.component';

export type FilterDefinitionType = 'text' | 'checkbox';

export type FilterDefinition = {
  attribute: string;
  label: string;
  type: FilterDefinitionType;
};

@Component({
  selector: 'app-filter-bar',
  templateUrl: './filter-bar.component.html',
  styleUrls: ['./filter-bar.component.css'],
  imports: [TextFilterComponent, CheckboxFilterComponent],
})
export class FilterBarComponent {
  public readonly list = input.required<DcuplList>();

  public readonly filterDefinitions: FilterDefinition[] = [
    { attribute: 'productName', label: 'Product Name', type: 'text' },
    { attribute: 'color', label: 'Color', type: 'checkbox' },
  ];
}
