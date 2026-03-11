"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { IoSendSharp, IoCloseOutline, IoHappyOutline, IoEllipsisVertical, IoTrashOutline } from "react-icons/io5";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useComments, Comment } from "./hooks/useComments";

const EMOJIS = [
  "😀","😂","🥰","😍","🤩","😎","🥳","😭","😤","🤔",
  "👍","👎","❤️","🔥","✨","🎉","💯","🙏","👏","😮",
  "🤣","😊","😘","🥺","😅","😜","🤯","💀","😇","🫶",
];

function timeAgo(dateStr: string): string {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60) return `${diff}s`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d`;
  return `${Math.floor(diff / 604800)}w`;
}

function CommentItem({
  comment, currentUserId, onDelete,
}: {
  comment: Comment;
  currentUserId?: number;
  onDelete: (id: number) => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const isOwner = currentUserId === comment.author.id;

  return (
    <div className="flex gap-3 relative group">
      <Link href={`/profile/${comment.author.username}`} className="shrink-0 mt-0.5">
        <Avatar className="size-9 ring-1 ring-[rgba(124,92,252,0.2)] ring-offset-1 ring-offset-[#0e0e13]">
          <AvatarImage src={comment.author.avatarUrl ?? ""} alt={comment.author.name} />
          <AvatarFallback className="text-xs bg-[#1a1a2e] text-[#a78bff]">{comment.author.name[0]}</AvatarFallback>
        </Avatar>
      </Link>

      <div className="flex-1 min-w-0">
        <div
          className="rounded-2xl rounded-tl-sm px-3 py-2"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.05)" }}
        >
          <div className="flex items-baseline gap-2 mb-0.5">
            <Link href={`/profile/${comment.author.username}`}>
              <span className="text-xs font-bold text-white hover:text-[#a78bff] transition-colors">{comment.author.name}</span>
            </Link>
            <span className="text-[10px] text-neutral-600">{timeAgo(comment.createdAt)}</span>
          </div>
          <p className="text-sm text-neutral-200 leading-relaxed break-words">{comment.content}</p>
        </div>
      </div>

      {isOwner && (
        <div className="relative shrink-0 self-start pt-1">
          <button
            onClick={() => setMenuOpen((p) => !p)}
            className="opacity-0 group-hover:opacity-100 text-neutral-600 hover:text-white transition-all p-1 rounded-lg hover:bg-white/5"
          >
            <IoEllipsisVertical className="size-4" />
          </button>

          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div
                className="absolute right-0 top-7 z-20 rounded-2xl overflow-hidden min-w-[130px]"
                style={{
                  background: "linear-gradient(160deg, rgba(26,26,40,0.99) 0%, rgba(15,15,25,1) 100%)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
                }}
              >
                <button
                  onClick={() => { onDelete(comment.id); setMenuOpen(false); }}
                  className="flex items-center gap-2.5 w-full px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors font-medium"
                >
                  <IoTrashOutline className="size-4" />
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

interface Props {
  postId: number | string;
  currentUserId?: number;
  onClose?: () => void;
  inline?: boolean;
  onCommentAdded?: () => void;
  onCommentDeleted?: () => void;
  onDeleteRequest?: (commentId: number) => void;
}

export function CommentSection({ postId, currentUserId, onClose, inline = false, onCommentAdded, onCommentDeleted, onDeleteRequest }: Props) {
  const { comments, isLoading, isSending, hasMore, loadMore, addComment, deleteComment } = useComments(postId);
  const [text, setText]           = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  useEffect(() => {
    const handler = (e: Event) => {
      const id = (e as CustomEvent<number>).detail;
      deleteComment(id);
      onCommentDeleted?.();
    };
    window.addEventListener("confirm-delete-comment", handler);
    return () => window.removeEventListener("confirm-delete-comment", handler);
  }, [deleteComment, onCommentDeleted]);

  const insertEmoji = (emoji: string) => {
    const input = inputRef.current;
    if (input) {
      const start = input.selectionStart ?? text.length;
      const end   = input.selectionEnd   ?? text.length;
      const newText = text.slice(0, start) + emoji + text.slice(end);
      setText(newText);
      setTimeout(() => {
        input.focus();
        input.setSelectionRange(start + emoji.length, start + emoji.length);
      }, 0);
    } else {
      setText((prev) => prev + emoji);
    }
  };

  const handleSend = () => {
    if (!text.trim()) return;
    addComment(text.trim());
    setText("");
    setShowEmoji(false);
    onCommentAdded?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSend();
  };

  const content = (
    <div
      className="flex flex-col h-full text-white"
      style={{ background: "linear-gradient(180deg, #0d0d18 0%, #080810 100%)" }}
    >
      {/* Handle bar */}
      <div className="flex justify-center pt-3 pb-1 shrink-0 md:hidden">
        <div className="w-10 h-1 rounded-full bg-white/10" />
      </div>

      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-3 shrink-0"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold tracking-wide">Comments</span>
          {comments.length > 0 && (
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-full text-[#a78bff]"
              style={{ background: "rgba(124,92,252,0.15)" }}
            >
              {comments.length}
            </span>
          )}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="flex items-center justify-center size-7 rounded-full text-neutral-500 hover:text-white transition-colors"
            style={{ background: "rgba(255,255,255,0.06)" }}
          >
            <IoCloseOutline className="size-4" />
          </button>
        )}
      </div>

      {/* Comment List */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {isLoading && comments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="size-8 rounded-full border-2 border-[#7c5cfc] border-t-transparent animate-spin" />
            <p className="text-xs text-neutral-600">Loading comments...</p>
          </div>
        ) : comments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-2 text-center">
            <div className="text-3xl mb-1">💬</div>
            <p className="text-sm font-semibold text-neutral-300">No comments yet</p>
            <p className="text-xs text-neutral-600">Be the first to say something</p>
          </div>
        ) : (
          <>
            {comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                currentUserId={currentUserId}
                onDelete={(id) => {
                  if (onDeleteRequest) {
                    onDeleteRequest(id);
                  } else {
                    deleteComment(id);
                    onCommentDeleted?.();
                  }
                }}
              />
            ))}
            {hasMore && (
              <button
                onClick={loadMore}
                disabled={isLoading}
                className="w-full text-xs text-[#a78bff] py-2 hover:underline transition-opacity disabled:opacity-50"
              >
                {isLoading ? "Loading..." : "Load more comments"}
              </button>
            )}
          </>
        )}
      </div>

      {/* Emoji Picker */}
      {showEmoji && (
        <div
          className="mx-3 mb-2 p-3 rounded-2xl grid grid-cols-10 gap-1"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          {EMOJIS.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onMouseDown={(e) => { e.preventDefault(); insertEmoji(emoji); }}
              className="text-lg hover:scale-125 active:scale-95 transition-transform leading-none p-0.5 rounded"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      {/* Input Row */}
      <div
        className="flex items-center gap-2.5 px-3 py-3 shrink-0"
        style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
      >
        <button
          type="button"
          onClick={() => setShowEmoji((prev) => !prev)}
          className={`shrink-0 size-9 flex items-center justify-center rounded-full transition-all ${
            showEmoji
              ? "text-[#a78bff] bg-[rgba(124,92,252,0.15)]"
              : "text-neutral-500 hover:text-white hover:bg-white/5"
          }`}
        >
          <IoHappyOutline className="size-5" />
        </button>

        <div className="flex-1 relative">
          <input
            ref={inputRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Write a comment..."
            className="w-full rounded-2xl px-4 py-2.5 text-sm text-white placeholder:text-neutral-600 outline-none transition-all"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
            onFocus={(e) => {
              e.target.style.border = "1px solid rgba(124,92,252,0.4)";
              e.target.style.background = "rgba(255,255,255,0.07)";
            }}
            onBlur={(e) => {
              e.target.style.border = "1px solid rgba(255,255,255,0.07)";
              e.target.style.background = "rgba(255,255,255,0.05)";
            }}
          />
        </div>

        <button
          type="button"
          onClick={handleSend}
          disabled={!text.trim() || isSending}
          className="shrink-0 size-9 flex items-center justify-center rounded-full transition-all disabled:opacity-30 active:scale-90"
          style={{
            background: text.trim()
              ? "linear-gradient(135deg, #9b7dff 0%, #7c5cfc 100%)"
              : "rgba(255,255,255,0.06)",
            boxShadow: text.trim() ? "0 2px 12px rgba(124,92,252,0.4)" : "none",
          }}
        >
          {isSending ? (
            <div className="size-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
          ) : (
            <IoSendSharp className="size-4 text-white" />
          )}
        </button>
      </div>
    </div>
  );

  if (inline) return content;

  return (
    <>
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden" onClick={onClose} />
      <div
        className="fixed bottom-0 left-0 right-0 z-50 h-[72vh] md:hidden"
        style={{
          borderRadius: "24px 24px 0 0",
          overflow: "hidden",
          boxShadow: "0 -8px 40px rgba(0,0,0,0.6), 0 -1px 0 rgba(255,255,255,0.05)",
        }}
      >
        {content}
      </div>
      <div className="hidden md:flex md:flex-col md:h-full md:w-full">
        {content}
      </div>
    </>
  );
}