import { getInitialData } from "./data";
import { HierarchicalTable } from "./components/HierarchicalTable";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-950 py-10 px-4">
      <main className="mx-auto max-w-5xl">
        <h1 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          Hierarchical Table
        </h1>
        <p className="mb-6 text-zinc-600 dark:text-zinc-400">
          Use the input and &quot;Allocation %&quot; or &quot;Allocation
          Val&quot; buttons to update row values. Parent rows update from
          children; changing a parent distributes to its children by
          contribution ratio.
        </p>
        <HierarchicalTable initialRows={getInitialData()} />
      </main>
    </div>
  );
}
