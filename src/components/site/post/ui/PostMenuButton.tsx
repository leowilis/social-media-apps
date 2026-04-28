import { useState } from "react";
import { IoEllipsisVertical, IoTrashOutline } from "react-icons/io5";

interface PostMenuButtonProps {
  onDeleteClick: () => void;
  /** `sm` for the desktop header row, `md` for the overlay on top of the image (mobile). */
  size?: "sm" | "md";
}

/**
 * Three-dot menu button (⋮) with a dropdown for post owner actions.
 * Only rendered when the current user is the post owner.
 */
export function PostMenuButton({ onDeleteClick, size = "md" }: PostMenuButtonProps) {
  const [open, setOpen] = useState(false);

  const btnSize  = size === "sm" ? "size-8" : "size-9";
  const iconSize = size === "sm" ? "size-4" : "size-5";

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((p) => !p)}
        className={`flex items-center justify-center ${btnSize} rounded-full text-neutral-400 hover:text-white hover:bg-white/5 transition-colors`}
        style={size === "md"
          ? { background: "rgba(10,10,18,0.65)", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(8px)" }
          : undefined
        }
      >
        <IoEllipsisVertical className={iconSize} />
      </button>

      {open && (
        <>
          {/* Transparent overlay to close on outside click */}
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div
            className="absolute right-0 top-11 z-20 rounded-2xl overflow-hidden min-w-[140px]"
            style={{
              background: "linear-gradient(160deg, rgba(26,26,40,0.99) 0%, rgba(15,15,25,1) 100%)",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
            }}
          >
            <button
              onClick={() => { setOpen(false); onDeleteClick(); }}
              className="flex items-center gap-2.5 w-full px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors font-medium"
            >
              <IoTrashOutline className="size-4" />
              Delete Post
            </button>
          </div>
        </>
      )}
    </div>
  );
}