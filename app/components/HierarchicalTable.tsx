"use client";

import { useCallback, useMemo, useState } from "react";
import type { HierarchicalRow } from "../types";
import {
  deepClone,
  findNode,
  flattenRows,
  setRowValue,
  getGrandTotal,
} from "../utils/treeUtils";
import { TableRow } from "./TableRow";

interface HierarchicalTableProps {
  initialRows: HierarchicalRow[];
}

export function HierarchicalTable({ initialRows }: HierarchicalTableProps) {
  const [rows, setRows] = useState<HierarchicalRow[]>(() =>
    deepClone(initialRows),
  );
  const [inputValues, setInputValues] = useState<Record<string, string>>({});

  const flattened = useMemo(() => flattenRows(rows), [rows]);
  const grandTotal = useMemo(() => getGrandTotal(rows), [rows]);

  const getInput = useCallback(
    (id: string) => inputValues[id] ?? "",
    [inputValues],
  );
  const setInput = useCallback((id: string, value: string) => {
    setInputValues((prev) => ({ ...prev, [id]: value }));
  }, []);

  const handleAllocationPct = useCallback(
    (id: string) => {
      const node = findNode(rows, id);
      if (!node) return;
      const raw = inputValues[id]?.trim().replace(/%$/, "") ?? "";
      const pct = parseFloat(raw);
      if (Number.isNaN(pct)) return;
      const newValue = node.value * (1 + pct / 100);
      setRows((prev) => setRowValue(prev, id, newValue));
    },
    [rows, inputValues],
  );

  const handleAllocationVal = useCallback(
    (id: string) => {
      const raw = inputValues[id]?.trim() ?? "";
      const val = parseFloat(raw);
      if (Number.isNaN(val)) return;
      setRows((prev) => setRowValue(prev, id, val));
    },
    [inputValues],
  );

  return (
    <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
      <table className="w-full min-w-[720px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-zinc-200 bg-zinc-100/80 dark:border-zinc-700 dark:bg-zinc-800/80">
            <th className="py-3 pl-4 pr-4 font-semibold text-zinc-900 dark:text-zinc-100">
              Label
            </th>
            <th className="py-3 px-4 font-semibold text-zinc-900 dark:text-zinc-100">
              Value
            </th>
            <th className="py-3 px-4 font-semibold text-zinc-900 dark:text-zinc-100">
              Input
            </th>
            <th className="py-3 px-4 font-semibold text-zinc-900 dark:text-zinc-100">
              Allocation %
            </th>
            <th className="py-3 px-4 font-semibold text-zinc-900 dark:text-zinc-100">
              Allocation Val
            </th>
            <th className="py-3 px-4 font-semibold text-zinc-900 dark:text-zinc-100">
              Variance %
            </th>
          </tr>
        </thead>
        <tbody>
          {flattened.map(({ row, level }) => (
            <TableRow
              key={row.id}
              row={row}
              level={level}
              inputValue={getInput(row.id)}
              onInputChange={(v) => setInput(row.id, v)}
              onAllocationPct={() => handleAllocationPct(row.id)}
              onAllocationVal={() => handleAllocationVal(row.id)}
            />
          ))}
          <tr className="border-t-2 border-zinc-300 bg-zinc-100/60 font-semibold dark:border-zinc-600 dark:bg-zinc-800/60">
            <td className="py-3 pl-4 pr-4 text-zinc-900 dark:text-zinc-100">
              Grand Total
            </td>
            <td className="py-3 px-4 tabular-nums text-zinc-900 dark:text-zinc-100">
              {grandTotal.toFixed(2)}
            </td>
            <td colSpan={4} className="py-3 px-4" />
          </tr>
        </tbody>
      </table>
    </div>
  );
}
