import { Component, DestroyRef, OnInit, computed, inject, input, signal } from '@angular/core';
import { ListItem, ListMetadata } from '@dcupl/common';
import { DcuplList } from '@dcupl/core';

const PAGE_SIZE = 10;

@Component({
  selector: 'app-product-table',
  templateUrl: './product-table.component.html',
  styleUrls: ['./product-table.component.css'],
})
export class ProductTableComponent implements OnInit {
  public readonly list = input.required<DcuplList>();
  public readonly visibleColumns = input.required<string[]>();

  public readonly data = signal<ListItem[]>([]);
  public readonly meta = signal<ListMetadata | undefined>(undefined);

  private readonly start = computed(() => this.meta()?.appliedQuery?.start ?? 0);
  private readonly count = computed(() => this.meta()?.appliedQuery?.count ?? PAGE_SIZE);
  public readonly previousDisabled = computed(() => this.start() <= 0);
  public readonly nextDisabled = computed(
    () => this.start() + this.count() >= (this.meta()?.currentSize ?? 0),
  );

  private readonly destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.resetPaging();
    this.queryData();
    const unsubscribe = this.list().onResultChange(() => {
      this.queryData();
      // the next filter change starts again at the first page
      this.resetPaging();
    });
    this.destroyRef.onDestroy(unsubscribe);
  }

  private resetPaging(): void {
    this.list().catalog.query.applyOptions(
      { start: 0, count: PAGE_SIZE, projection: { $: true, vendorId: { $: true } } },
      { skipProcessing: true },
    );
  }

  private queryData(): void {
    this.data.set(this.list().catalog.query.items());
    this.meta.set(this.list().catalog.fn.metadata());
  }

  public getCellValue(item: ListItem, column: string): unknown {
    const value = item[column];
    if (column === 'key') {
      return item.key;
    } else if (column === 'vendorId') {
      return `${value.contactName} (${value.companyName})`;
    } else if (typeof value === 'object') {
      return JSON.stringify(item);
    }
    return value;
  }

  public next(): void {
    this.list().catalog.query.applyOptions({ start: this.start() + this.count() });
  }

  public previous(): void {
    this.list().catalog.query.applyOptions({ start: this.start() - this.count() });
  }
}
