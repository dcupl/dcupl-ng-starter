import { Component, OnInit, Input } from '@angular/core';
import { ListItem, ListMetadata } from '@dcupl/common';
import { DcuplList } from '@dcupl/core';

@Component({
  selector: 'app-product-table',
  templateUrl: './product-table.component.html',
  styleUrls: ['./product-table.component.css'],
  standalone: true,
})
export class ProductTableComponent implements OnInit {
  @Input({ required: true }) list!: DcuplList;
  @Input({ required: true }) visibleColumns!: string[];

  public data: ListItem[] = [];
  public meta: ListMetadata | undefined;

  constructor() {}

  ngOnInit() {
    this.setInitialQueryOptions();
    this.queryData();
    this.listenOnListUpdates();
  }

  private setInitialQueryOptions() {
    this.list.catalog.query.applyOptions(
      {
        start: 0,
        count: 10,
        projection: { $: true, vendorId: { $: true } },
      },
      { skipProcessing: true }
    );
  }

  private listenOnListUpdates() {
    this.list.on((msg) => {
      if (msg.action === 'update') {
        this.queryData();
        this.setInitialQueryOptions();
      }
    });
  }

  public queryData() {
    this.data = this.list.catalog.query.execute();
    this.meta = this.list.catalog.fn.metadata();
  }

  public getCellValue(item: ListItem, column: string) {
    const value = item[column];

    if (column === 'key') {
      return item.key;
    } else if (column === 'vendorId') {
      return `${value.contactName} (${value.companyName})`;
    } else if (typeof value === 'object') {
      return JSON.stringify(item);
    } else {
      return value;
    }
  }

  public next() {
    const currentStart = this.meta?.appliedQuery?.start || 0;
    const currentCount = this.meta?.appliedQuery?.count || 10;

    this.list.catalog.query.applyOptions({
      start: currentStart + currentCount,
    });
  }

  public previous() {
    const currentStart = this.meta?.appliedQuery?.start || 0;
    const currentCount = this.meta?.appliedQuery?.count || 10;

    this.list.catalog.query.applyOptions({
      start: currentStart - currentCount,
    });
  }

  public isPreviousButtonDisabled() {
    const currentStart = this.meta?.appliedQuery?.start || 0;
    return currentStart <= 0;
  }

  public isNextButtonDisabled() {
    const currentStart = this.meta?.appliedQuery?.start || 0;
    const currentCount = this.meta?.appliedQuery?.count || 10;
    const currentSize = this.meta?.currentSize || 0;
    return currentStart + currentCount >= currentSize;
  }
}
