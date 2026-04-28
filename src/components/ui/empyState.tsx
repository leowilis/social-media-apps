import { IoSearchOutline } from "react-icons/io5";

interface EmptyStateProps {
  /** Main heading text. */
  title: string;
  /** Supporting description below the title. */
  description?: string;
  /** Icon rendered inside the box. Defaults to a search icon. */
  icon?: React.ReactNode;
}

/**
 * Reusable empty state UI.
 * Used when a list or page has no data to show.
 */
export function EmptyState({ title, description, icon }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-2 text-center px-6">
      <div
        className="flex items-center justify-center size-16 rounded-2xl mb-2"
        style={{ background: "rgba(124,92,252,0.08)", border: "1px solid rgba(124,92,252,0.15)" }}
      >
        {icon ?? <IoSearchOutline className="size-7 text-[#7c5cfc]" />}
      </div>
      <p className="text-neutral-300 text-sm font-semibold">{title}</p>
      {description && <p className="text-neutral-600 text-xs">{description}</p>}
    </div>
  );
}