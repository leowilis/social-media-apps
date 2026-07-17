export interface UsePostActionsProps {
  postId: number;
  initialLiked: boolean;
  initialLikeCount: number;
  initialSaved: boolean;
}

export interface ToastState {
  message: string;
  show: boolean;
}