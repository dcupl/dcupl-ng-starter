export type FilterDefinitionType = 'text' | 'checkbox';

/** One filter in the filter bar: the attribute it filters, its label and how it filters. */
export type FilterDefinition = {
  attribute: string;
  label: string;
  type: FilterDefinitionType;
};
