import { Component, input } from '@angular/core';
import { DcuplList } from '@dcupl/core';
import { TextFilterComponent } from '../text-filter/text-filter.component';
import { CheckboxFilterComponent } from '../checkbox-filter/checkbox-filter.component';
import { FilterDefinition } from '../../filters';

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
