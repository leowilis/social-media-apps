type Props = {
  onLike: () => void;
  onSave: () => void;
  onDelete: () => void;
  loading?: {
    like?: boolean;
    save?: boolean;
    delete?: boolean;
  };
};

export default function PostActionsBar({
  onLike,
  onSave,
  onDelete,
  loading,
}: Props) {
  return (
    <div className="flex gap-2">
      <button onClick={onLike} disabled={loading?.like}>
        Like
      </button>
      <button onClick={onSave} disabled={loading?.save}>
        Save
      </button>
      <button onClick={onDelete} disabled={loading?.delete}>
        Delete
      </button>
    </div>
  );
}