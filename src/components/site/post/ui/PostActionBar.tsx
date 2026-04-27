import { IoHeartOutline, IoHeart, IoChatbubbleOutline, IoBookmarkOutline, IoBookmark } from "react-icons/io5";

interface PostActionsBarProps {
  liked: boolean;
  likeCount: number;
  saved: boolean;
  commentCount: number;
  isPendingLike: boolean;
  isPendingSave: boolean;
  onLike: () => void;
  onSave: () => void;
  onLikeCountClick: () => void;
  onCommentClick?: () => void;
  showCommentButton?: boolean;
}

export function PostActionsBar({
  liked,
  likeCount,
  saved,
  commentCount,
  isPendingLike,
  isPendingSave,
  onLike,
  onSave,
  onLikeCountClick,
  onCommentClick,
  showCommentButton = true,
}: PostActionsBarProps) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-[rgba(255,255,255,0.06)]">
      <div className="flex items-center gap-4">
        {/* Like */}
        <div className="flex items-center gap-1">
          <button
            onClick={onLike}
            disabled={isPendingLike}
            className="text-white disabled:opacity-60 transition-opacity"
          >
            {liked
              ? <IoHeart className="size-6 text-red-500" />
              : <IoHeartOutline className="size-6" />
            }
          </button>
          <button onClick={onLikeCountClick} className="text-sm text-white min-w-[16px] text-left">
            {likeCount}
          </button>
        </div>

        {/* Comment */}
        {showCommentButton && (
          <button
            onClick={onCommentClick}
            className="flex items-center gap-1 text-white"
          >
            <IoChatbubbleOutline className="size-6" />
            <span className="text-sm">{commentCount}</span>
          </button>
        )}
      </div>

      {/* Save */}
      <button
        onClick={onSave}
        disabled={isPendingSave}
        className="text-white transition-transform active:scale-90 disabled:opacity-60"
      >
        {saved
          ? <IoBookmark className="size-6" style={{ color: "#a78bff", filter: "drop-shadow(0 0 6px rgba(167,139,255,0.7))" }} />
          : <IoBookmarkOutline className="size-6" />
        }
      </button>
    </div>
  );
}