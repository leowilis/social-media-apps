import Link from "next/link";
import { IoSearchOutline, IoCloseOutline } from "react-icons/io5";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SearchResultsSkeleton } from "@/components/ui/skeletons";

// Types

export interface SearchUser {
  id: number;
  username: string;
  name: string;
  avatarUrl?: string;
}

interface SearchBarProps {
  /** "desktop" renders inline inside the Navbar. "mobile" is not used here — mobile is inlined in Navbar. */
  variant: "desktop";
  query: string;
  users: SearchUser[];
  loading: boolean;
  showResults: boolean;
  onQueryChange: (value: string) => void;
  onFocus: () => void;
  onClear: () => void;
  onSelectUser: () => void;
}

// Component

/**
 * Desktop inline search bar with results dropdown.
 * Results show only when `showResults` is true (query is non-empty and input focused).
 */
export function SearchBar({
  query,
  users,
  loading,
  showResults,
  onQueryChange,
  onFocus,
  onClear,
  onSelectUser,
}: SearchBarProps) {
  return (
    <div className="relative w-full max-w-[490px] mx-8">
      {/* Input */}
      <div
        className="flex items-center gap-2 h-12 px-4 rounded-full border bg-neutral-950 transition-colors"
        style={{
          borderColor:
            showResults && query
              ? "rgba(124,92,252,0.4)"
              : "rgb(23,23,23)",
        }}
      >
        <IoSearchOutline className="size-[18px] shrink-0 text-neutral-500" />
        <input
          value={query}
          onFocus={onFocus}
          onChange={(e) => onQueryChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Escape") onClear();
          }}
          placeholder="Search users..."
          aria-label="Search users"
          className="flex-1 bg-transparent text-sm text-white placeholder:text-neutral-500 outline-none"
        />
        {query && (
          <button
            type="button"
            onClick={onClear}
            aria-label="Clear search"
          >
            <IoCloseOutline className="size-4 text-neutral-500" />
          </button>
        )}
      </div>

      {/* Results dropdown */}
      {showResults && (
        <>
          {/* Backdrop to close on outside click */}
          <div
            className="fixed inset-0 z-30"
            onClick={onClear}
            aria-hidden="true"
          />
          <div
            className="absolute top-14 left-0 right-0 z-40 rounded-2xl overflow-hidden"
            style={{
              background: "rgba(10,10,18,0.98)",
              border: "1px solid rgba(255,255,255,0.07)",
              boxShadow: "0 16px 40px rgba(0,0,0,0.6)",
            }}
          >
            {loading ? (
              <SearchResultsSkeleton count={4} />
            ) : users.length === 0 ? (
              <div className="flex flex-col items-center py-8 gap-1">
                <p className="text-sm font-semibold text-neutral-400">
                  No results found
                </p>
                <p className="text-xs text-neutral-600">Try a different keyword</p>
              </div>
            ) : (
              <div className="px-2 py-2 space-y-0.5 max-h-80 overflow-y-auto">
                {users.map((user) => (
                  <Link
                    key={user.id}
                    href={`/profile/${user.username}`}
                    onClick={onSelectUser}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/[0.05] transition-colors"
                  >
                    <Avatar
                      className="size-9 shrink-0"
                      style={{ border: "1.5px solid rgba(124,92,252,0.2)" }}
                    >
                      <AvatarImage src={user.avatarUrl ?? ""} alt={user.name} />
                      <AvatarFallback
                        className="text-sm font-bold"
                        style={{ background: "#1a1a2e", color: "#a78bff" }}
                      >
                        {user.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-white truncate">
                        {user.name}
                      </p>
                      <p className="text-xs text-neutral-500 truncate">
                        @{user.username}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}