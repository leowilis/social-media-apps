type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export default function DeleteDialog({ open, onClose, onConfirm }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white p-4 rounded">
        <p>Are you sure?</p>
        <div className="flex gap-2 mt-2">
          <button onClick={onConfirm}>Yes</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}