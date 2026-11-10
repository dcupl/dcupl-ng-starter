import { Component, input } from '@angular/core';
import { DcuplList } from '@dcupl/core';
import { escapeRegExp } from '@dcupl/common';
import { FilterDefinition } from '../../filters';
import { startAtFirstPage } from '../../paging';

@Component({
  selector: 'app-text-filter',
  templateUrl: './text-filter.component.html',
})
export class TextFilterComponent {
  public readonly list = input.required<DcuplList>();
  public readonly definition = input.required<FilterDefinition>();

  public applyQuery(queryValue: string): void {
    const { attribute } = this.definition();
    startAtFirstPage(this.list());
    if (!queryValue) {
      this.list().catalog.query.removeGroup(attribute);
      return;
    }
    this.list().catalog.query.setCondition({
      attribute,
      operator: 'find',
      value: `/${escapeRegExp(queryValue)}/`,
      options: { transform: ['lowercase'] },
    });
  }
}
