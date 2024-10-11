import { Component, Input, OnInit } from '@angular/core';
import { DcuplList } from '@dcupl/core';
import { FilterDefinition } from '../filter-bar/filter-bar.component';
import { escapeRegExp } from '@dcupl/common';

@Component({
  selector: 'app-text-filter',
  templateUrl: './text-filter.component.html',
  styleUrls: ['./text-filter.component.css'],
  standalone: true,
})
export class TextFilterComponent implements OnInit {
  @Input({ required: true }) list!: DcuplList;
  @Input({ required: true }) definition!: FilterDefinition;

  constructor() {}

  ngOnInit() {}

  public applyQuery(queryValue: string) {
    if (!queryValue) {
      this.list?.catalog.query.remove({ groupKey: this.definition.attribute });
    } else {
      const escapedQueryValue = escapeRegExp(queryValue.toLowerCase());

      if (this.list) {
        console.time('apply query');
        this.list.catalog.query.apply(
          {
            attribute: this.definition.attribute,
            operator: 'find',
            value: `/${escapedQueryValue}/`,
            options: {
              transform: ['lowercase'],
            },
          },
          { mode: 'set' }
        );
        console.timeEnd('apply query');
      }
    }
  }
}
