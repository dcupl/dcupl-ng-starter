import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { DcuplList } from '@dcupl/core';
import { DcuplService } from '../../services/dcupl.service';
import { ProductTableComponent } from '../../components/product-table/product-table.component';
import { FilterBarComponent } from '../../components/filter-bar/filter-bar.component';

@Component({
  selector: 'app-page-catalog',
  templateUrl: './page-catalog.component.html',
  styleUrls: ['./page-catalog.component.css'],
  imports: [ProductTableComponent, FilterBarComponent],
})
export class PageCatalogComponent implements OnInit {
  private readonly dcuplService = inject(DcuplService);
  private destroyed = false;

  public readonly list = signal<DcuplList | undefined>(undefined);
  public readonly error = signal<string | undefined>(undefined);

  constructor() {
    // a list lives until it is destroyed: free it when the page goes away
    inject(DestroyRef).onDestroy(() => {
      this.destroyed = true;
      this.list()?.destroy();
    });
  }

  ngOnInit(): void {
    void this.load();
  }

  public async load(): Promise<void> {
    this.error.set(undefined);
    try {
      const dcupl = await this.dcuplService.init();
      if (this.destroyed) {
        return;
      }
      this.list.set(dcupl.lists.create({ modelKey: 'Article' }));
    } catch (err) {
      this.error.set(err instanceof Error ? err.message : String(err));
    }
  }
}
