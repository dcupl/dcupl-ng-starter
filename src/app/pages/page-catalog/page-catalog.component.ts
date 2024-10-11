import { Component, OnInit } from '@angular/core';
import { DcuplService } from '../../services/dcupl.service';
import { ProductTableComponent } from '../../components/product-table/product-table.component';
import { FilterBarComponent } from '../../components/filter-bar/filter-bar.component';
import { DcuplList } from '@dcupl/core';

@Component({
  selector: 'app-page-catalog',
  templateUrl: './page-catalog.component.html',
  styleUrls: ['./page-catalog.component.css'],
  standalone: true,

  imports: [ProductTableComponent, FilterBarComponent],
})
export class PageCatalogComponent implements OnInit {
  public loading = true;
  public list!: DcuplList;

  public visibleColumns: string[] = [];
  constructor(public dcuplService: DcuplService) {}

  ngOnInit(): void {
    this.init();
  }

  private async init() {
    await this.dcuplService.init();

    this.list = this.dcuplService.dcupl.lists.create({
      modelKey: 'Article',
    });

    const meta = await this.list.catalog.fn.metadata();

    this.visibleColumns = meta.attributes.map((attr) => attr.key);
    this.visibleColumns.unshift('key');

    this.loading = false;
  }
}
