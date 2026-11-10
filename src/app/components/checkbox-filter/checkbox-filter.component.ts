import { Component, DestroyRef, OnInit, inject, input, signal } from '@angular/core';
import { DcuplList } from '@dcupl/core';
import { DcuplFacet } from '@dcupl/common';
import { FilterDefinition } from '../../filters';
import { startAtFirstPage } from '../../paging';

@Component({
  selector: 'app-checkbox-filter',
  templateUrl: './checkbox-filter.component.html',
  host: { class: 'block' },
})
export class CheckboxFilterComponent implements OnInit {
  public readonly list = input.required<DcuplList>();
  public readonly definition = input.required<FilterDefinition>();

  public readonly facets = signal<DcuplFacet[]>([]);
  private readonly destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.loadFacets();
    const unsubscribe = this.list().onResultChange(() => this.loadFacets());
    this.destroyRef.onDestroy(unsubscribe);
  }

  private loadFacets(): void {
    this.facets.set(
      this.list().catalog.fn.facets({
        attribute: this.definition().attribute,
        excludeZeros: false,
      }),
    );
  }

  public toggle(item: DcuplFacet): void {
    const condition = {
      attribute: this.definition().attribute,
      operator: 'eq' as const,
      value: item.value,
    };
    startAtFirstPage(this.list());
    if (item.selected) {
      this.list().catalog.query.removeCondition(condition);
    } else {
      this.list().catalog.query.addCondition(condition);
    }
  }
}
