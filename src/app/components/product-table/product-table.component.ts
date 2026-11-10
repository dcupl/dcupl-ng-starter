import { Component, DestroyRef, OnInit, computed, inject, input, signal } from '@angular/core';
import { ListItem, ListMetadata } from '@dcupl/common';
import { DcuplList } from '@dcupl/core';

/** An article as the list returns it: the projection resolves the vendor reference to its fields. */
type Article = ListItem & {
  productName?: string;
  category?: string;
  price?: number;
  inStock?: number;
  color?: string;
  vendorId?: { contactName: string; companyName: string };
};

type Column = {
  label: string;
  /** The cell value; a missing one renders "—". */
  value: (article: Article) => string | number | undefined;
};

@Component({
  selector: 'app-product-table',
  templateUrl: './product-table.component.html',
  styleUrls: ['./product-table.component.css'],
})
export class ProductTableComponent implements OnInit {
  public readonly list = input.required<DcuplList>();

  public readonly columns: Column[] = [
    { label: 'Key', value: (article) => article.key },
    { label: 'Product name', value: (article) => article.productName },
    {
      label: 'Vendor',
      value: ({ vendorId: vendor }) =>
        vendor ? `${vendor.contactName} (${vendor.companyName})` : undefined,
    },
    { label: 'Category', value: (article) => article.category },
    { label: 'Price', value: (article) => article.price },
    { label: 'In stock', value: (article) => article.inStock },
    { label: 'Color', value: (article) => article.color },
  ];

  public readonly data = signal<Article[]>([]);
  public readonly meta = signal<ListMetadata | undefined>(undefined);

  // the page lives in the list's query: page-catalog sets count, next() and previous() move start,
  // the filters reset start; without a count the whole result is one page
  private readonly start = computed(() => this.meta()?.appliedQuery?.start ?? 0);
  private readonly count = computed(() => this.meta()?.appliedQuery?.count ?? Infinity);
  public readonly previousDisabled = computed(() => this.start() <= 0);
  public readonly nextDisabled = computed(
    () => this.start() + this.count() >= (this.meta()?.currentSize ?? 0),
  );
  public readonly page = computed(() => Math.floor(this.start() / this.count()) + 1);
  public readonly pageCount = computed(() =>
    Math.max(1, Math.ceil((this.meta()?.currentSize ?? 0) / this.count())),
  );

  private readonly destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.readPage();
    const unsubscribe = this.list().onResultChange(() => this.readPage());
    this.destroyRef.onDestroy(unsubscribe);
  }

  private readPage(): void {
    this.data.set(this.list().catalog.query.items<Article>());
    this.meta.set(this.list().catalog.fn.metadata());
  }

  public next(): void {
    this.list().catalog.query.applyOptions({ start: this.start() + this.count() });
  }

  public previous(): void {
    this.list().catalog.query.applyOptions({ start: this.start() - this.count() });
  }
}
