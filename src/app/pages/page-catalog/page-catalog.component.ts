import { Component, OnInit, inject, signal } from '@angular/core';
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

  public readonly list = signal<DcuplList | undefined>(undefined);
  public readonly visibleColumns = signal<string[]>([]);

  async ngOnInit(): Promise<void> {
    const dcupl = await this.dcuplService.init();
    const list = dcupl.lists.create({ modelKey: 'Article' });
    const meta = list.catalog.fn.metadata();

    this.visibleColumns.set(['key', ...meta.attributes.map((attr) => attr.key)]);
    this.list.set(list);
  }
}
