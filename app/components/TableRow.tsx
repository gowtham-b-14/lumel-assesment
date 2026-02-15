"use client";

import type { HierarchicalRow } from "../types";
import { getVariance } from "../utils/treeUtils";

interface TableRowProps {
  row: HierarchicalRow;
  level: number;
  inputValue: string;
  onInputChange: (value: string) => void;
  onAllocationPct: () => void;
  onAllocationVal: () => void;
}

export function TableRow({
  row,
  level,
  inputValue,
  onInputChange,
  onAllocationPct,
  onAllocationVal,
}: TableRowProps) {
  const variance = getVariance(row.value, row.originalValue);
  const indent = level > 0 ? `${"  ".repeat(level)}-- ` : "";

  return (
    <tr className="border-b border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/50">
      <td className="py-2.5 pr-4 pl-4 font-medium text-zinc-900 dark:text-zinc-100">
        {indent}
        {row.label}
      </td>
      <td className="py-2.5 px-4 tabular-nums text-zinc-700 dark:text-zinc-300">
        {row.value.toFixed(2)}
      </td>
      <td className="py-2.5 px-4">
        <input
          type="text"
          inputMode="decimal"
          placeholder="Value or %"
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
          className="w-28 rounded border border-zinc-300 bg-white px-2.5 py-1.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500"
        />
      </td>
      <td className="py-2.5 px-4">
        <button
          type="button"
          onClick={onAllocationPct}
          className="rounded bg-amber-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-900"
        >
          Allocation %
        </button>
      </td>
      <td className="py-2.5 px-4">
        <button
          type="button"
          onClick={onAllocationVal}
          className="rounded bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-900"
        >
          Allocation Val
        </button>
      </td>
      <td className="py-2.5 px-4 tabular-nums text-zinc-600 dark:text-zinc-400">
        {variance >= 0 ? "+" : ""}
        {variance}%
      </td>
    </tr>
  );
}
