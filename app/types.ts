/** Row shape from API/JSON – no originalValue; parent value is computed from children. */
export interface HierarchicalRowFromApi {
  id: string;
  label: string;
  value: number;
  children?: HierarchicalRowFromApi[];
}

/** API response shape. */
export interface RowsResponse {
  rows: HierarchicalRowFromApi[];
}

/** Internal row with originalValue (set when loading, used for variance). */
export interface HierarchicalRow extends HierarchicalRowFromApi {
  originalValue: number;
  children?: HierarchicalRow[];
}

export interface FlattenedRow {
  row: HierarchicalRow;
  level: number;
}
