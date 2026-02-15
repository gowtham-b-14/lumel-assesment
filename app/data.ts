import type {
  HierarchicalRow,
  HierarchicalRowFromApi,
  RowsResponse,
} from "./types";
import { computeParentValuesFromChildren } from "./utils/treeUtils";

export const initialData: RowsResponse = {
  rows: [
    {
      id: "electronics",
      label: "Electronics",
      value: 1400, // computed from children (800+700)
      children: [
        { id: "phones", label: "Phones", value: 800 },
        { id: "laptops", label: "Laptops", value: 700 },
      ],
    },
    {
      id: "furniture",
      label: "Furniture",
      value: 1000, // computed from children (300+700)
      children: [
        { id: "tables", label: "Tables", value: 300 },
        { id: "chairs", label: "Chairs", value: 700 },
      ],
    },
  ],
};

function fromApiRow(row: HierarchicalRowFromApi): HierarchicalRow {
  const hasChildren = Boolean(row.children?.length);
  const children = row.children?.map(fromApiRow);
  return {
    id: row.id,
    label: row.label,
    value: hasChildren ? 0 : row.value,
    originalValue: hasChildren ? 0 : row.value,
    ...(children?.length ? { children } : {}),
  };
}

export function getInitialData(): HierarchicalRow[] {
  const rows = initialData.rows.map(fromApiRow);
  computeParentValuesFromChildren(rows);
  return rows;
}
