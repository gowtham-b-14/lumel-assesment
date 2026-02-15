import type { HierarchicalRow, FlattenedRow } from "../types";

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function deepClone(rows: HierarchicalRow[]): HierarchicalRow[] {
  return rows.map((r) => ({
    ...r,
    value: r.value,
    originalValue: r.originalValue,
    children: r.children ? deepClone(r.children) : undefined,
  }));
}

export function findNode(
  rows: HierarchicalRow[],
  id: string,
): HierarchicalRow | null {
  for (const row of rows) {
    if (row.id === id) return row;
    if (row.children) {
      const found = findNode(row.children, id);
      if (found) return found;
    }
  }
  return null;
}

export function recalculateTree(rows: HierarchicalRow[]): void {
  for (const row of rows) {
    if (row.children && row.children.length > 0) {
      recalculateTree(row.children);
      row.value = row.children.reduce((s, c) => s + c.value, 0);
    }
  }
}
export function computeParentValuesFromChildren(rows: HierarchicalRow[]): void {
  for (const row of rows) {
    if (row.children && row.children.length > 0) {
      computeParentValuesFromChildren(row.children);
      row.value = row.children.reduce((s, c) => s + c.value, 0);
      row.originalValue = row.children.reduce((s, c) => s + c.originalValue, 0);
    }
  }
}

function distributeToChildren(node: HierarchicalRow, newValue: number): void {
  if (!node.children || node.children.length === 0) return;
  const total = node.children.reduce((s, c) => s + c.value, 0);
  if (total === 0) return;
  let allocated = 0;
  const lastIndex = node.children.length - 1;
  node.children.forEach((child, i) => {
    if (i === lastIndex) {
      child.value = round2(newValue - allocated);
    } else {
      const v = round2((child.value / total) * newValue);
      child.value = v;
      allocated += v;
    }
  });
}

export function setRowValue(
  rows: HierarchicalRow[],
  id: string,
  newValue: number,
): HierarchicalRow[] {
  const next = deepClone(rows);
  const node = findNode(next, id);
  if (!node) return rows;

  if (node.children && node.children.length > 0) {
    distributeToChildren(node, newValue);
  } else {
    node.value = newValue;
  }
  recalculateTree(next);
  return next;
}

export function flattenRows(
  rows: HierarchicalRow[],
  level = 0,
): FlattenedRow[] {
  const result: FlattenedRow[] = [];
  for (const row of rows) {
    result.push({ row, level });
    if (row.children && row.children.length > 0) {
      result.push(...flattenRows(row.children, level + 1));
    }
  }
  return result;
}

export function getVariance(value: number, originalValue: number): number {
  if (originalValue === 0) return 0;
  return round2(((value - originalValue) / originalValue) * 100);
}

export function getGrandTotal(rows: HierarchicalRow[]): number {
  return rows.reduce((s, r) => s + r.value, 0);
}
