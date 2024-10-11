import { Component, Input, OnInit } from '@angular/core';
import { DcuplList } from '@dcupl/core';
import { FilterDefinition } from '../filter-bar/filter-bar.component';
import { DcuplFacet } from '@dcupl/common';

@Component({
  selector: 'app-checkbox-filter',
  templateUrl: './checkbox-filter.component.html',
  styleUrls: ['./checkbox-filter.component.css'],
  standalone: true,
})
export class CheckboxFilterComponent implements OnInit {
  @Input({ required: true }) list!: DcuplList;
  @Input({ required: true }) definition!: FilterDefinition;

  public facets: DcuplFacet[] = [];
  constructor() {}

  ngOnInit() {
    this.listenOnListUpdates();
    this.initFacets();
  }

  private listenOnListUpdates() {
    this.list.on((msg) => {
      if (msg.action === 'update') {
        this.initFacets();
      }
    });
  }

  private initFacets() {
    this.facets = this.list.catalog.fn.facets({
      attribute: this.definition.attribute,
      excludeZeros: false,
    });
  }

  public toggle(item: DcuplFacet) {
    if (item.selected) {
      this.list!.catalog.query.remove({
        attribute: this.definition.attribute,
        operator: 'eq',
        value: item.value,
      });
    } else {
      this.list!.catalog.query.apply(
        {
          attribute: this.definition.attribute,
          operator: 'eq',
          value: item.value,
        },
        { mode: 'add' }
      );
    }
  }
}
