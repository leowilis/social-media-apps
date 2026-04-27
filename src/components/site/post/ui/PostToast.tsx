import { IoCheckmark } from "react-icons/io5";

interface PostToastProps {
  message: string;
  show: boolean;
}

export function PostToast({ message, show }: PostToastProps) {
  return (
    <div
      className="fixed top-5 left-1/2 z-[999] flex items-center gap-2 px-4 py-2.5 rounded-2xl pointer-events-none"
      style={{
        transform: `translateX(-50%) translateY(${show ? 0 : -20}px)`,
        opacity: show ? 1 : 0,
        transition: "all 0.35s cubic-bezier(0.34,1.56,0.64,1)",
        background: "linear-gradient(135deg, rgba(26,26,40,0.98) 0%, rgba(15,15,25,0.98) 100%)",
        border: "1px solid rgba(124,92,252,0.3)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(124,92,252,0.1)",
        backdropFilter: "blur(16px)",
        whiteSpace: "nowrap",
      }}
    >
      <div
        className="flex items-center justify-center size-5 rounded-full shrink-0"
        style={{ background: "linear-gradient(135deg, #9b7dff, #7c5cfc)" }}
      >
        <IoCheckmark className="size-3 text-white" />
      </div>
      <span className="text-sm font-semibold text-white">{message}</span>
    </div>
  );
}