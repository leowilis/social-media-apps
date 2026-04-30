'use client';


import {
  useMutation,
  useInfiniteQuery,
  useQueryClient,
  InfiniteData,
} from '@tanstack/react-query';
import { commentsApi, type Comment, type CommentsResponse } from '@/lib/api/comment';


// Types

type CommentsPage = CommentsResponse['data'];
type CommentsCache = InfiniteData<CommentsPage>;

// Query Keys

const commentKeys = {
  list: (postId: number) => ['posts', postId, 'comments'] as const,
  post: (postId: number) => ['posts', postId] as const,
};

// Hooks

// Fetches paginated comments for a post using infinite scroll
export function useComments(postId: number) {
  return useInfiniteQuery({
    queryKey: commentKeys.list(postId),
    queryFn: async ({ pageParam = 1 }) => {
      const res = await commentsApi.getComments(postId, pageParam as number);
      return res.data.data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage: CommentsPage) => {
      const { page, totalPages } = lastPage.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    enabled: !!postId,
  });
}

/**
 * Adds a comment to a post with optimistic update.
 * Reverts on error and invalidates cache on settle.
 */
export function useAddComment(postId: number, currentUser: Comment['author']) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (text: string) => commentsApi.addComment(postId, text),

    onMutate: async (text: string) => {
      await queryClient.cancelQueries({ queryKey: commentKeys.list(postId) });
      const previous = queryClient.getQueryData<CommentsCache>(
        commentKeys.list(postId),
      );

      const optimistic: Comment = {
        id: Date.now(),
        text,
        createdAt: new Date().toISOString(),
        postId,
        author: currentUser,
      };

      queryClient.setQueryData<CommentsCache>(
        commentKeys.list(postId),
        (old) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page, i) =>
              i === 0
                ? { ...page, comments: [optimistic, ...page.comments] }
                : page,
            ),
          };
        },
      );

      queryClient.setQueryData<{ commentCount: number }>(
        commentKeys.post(postId),
        (old) =>
          old ? { ...old, commentCount: (old.commentCount ?? 0) + 1 } : old,
      );

      return { previous };
    },

    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(commentKeys.list(postId), context.previous);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: commentKeys.list(postId) });
      queryClient.invalidateQueries({ queryKey: commentKeys.post(postId) });
    },
  });
}

/**
 * Deletes a comment with optimistic update.
 * Reverts on error and invalidates cache on settle.
 */
export function useDeleteComment(postId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: number) => commentsApi.deleteComment(commentId),

    onMutate: async (commentId: number) => {
      await queryClient.cancelQueries({ queryKey: commentKeys.list(postId) });
      const previous = queryClient.getQueryData<CommentsCache>(
        commentKeys.list(postId),
      );

      queryClient.setQueryData<CommentsCache>(
        commentKeys.list(postId),
        (old) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              comments: page.comments.filter((c) => c.id !== commentId),
            })),
          };
        },
      );

      queryClient.setQueryData<{ commentCount: number }>(
        commentKeys.post(postId),
        (old) =>
          old
            ? { ...old, commentCount: Math.max((old.commentCount ?? 1) - 1, 0) }
            : old,
      );

      return { previous };
    },

    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(commentKeys.list(postId), context.previous);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: commentKeys.list(postId) });
      queryClient.invalidateQueries({ queryKey: commentKeys.post(postId) });
    },
  });
}
