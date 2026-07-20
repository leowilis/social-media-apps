'use client';

import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
  type InfiniteData,
} from '@tanstack/react-query';

import {
  commentsApi,
  type Comment,
  type CommentsResponse,
} from '@/lib/api/comment';

import type { User } from '@/types/user';
import type { Post } from '@/types/post';

// Types
type CommentsPage = CommentsResponse['data'];
type CommentsCache = InfiniteData<CommentsPage>;

// Query Keys
const commentKeys = {
  list: (postId: number) => ['posts', postId, 'comments'] as const,
  post: (postId: number) => ['posts', postId] as const,
};

// Fetch Comments
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

// Add Comment
export function useAddComment(postId: number, currentUser?: User) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (text: string) => commentsApi.addComment(postId, text),

    onMutate: async (text: string) => {
      if (!currentUser) {
        throw new Error('User not found');
      }

      await queryClient.cancelQueries({
        queryKey: commentKeys.list(postId),
      });

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
            pages: old.pages.map((page, index) =>
              index === 0
                ? {
                    ...page,
                    comments: [optimistic, ...page.comments],
                  }
                : page,
            ),
          };
        },
      );

      queryClient.setQueryData<Post>(commentKeys.post(postId), (old) => {
        if (!old) return old;

        return {
          ...old,
          commentCount: old.commentCount + 1,
        };
      });

      return { previous };
    },

    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(commentKeys.list(postId), context.previous);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: commentKeys.list(postId),
      });
    },
  });
}

// Delete Comment
export function useDeleteComment(postId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: number) => commentsApi.deleteComment(commentId),

    onMutate: async (commentId: number) => {
      await queryClient.cancelQueries({
        queryKey: commentKeys.list(postId),
      });

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
              comments: page.comments.filter(
                (comment) => comment.id !== commentId,
              ),
            })),
          };
        },
      );

      queryClient.setQueryData<Post>(commentKeys.post(postId), (old) => {
        if (!old) return old;

        return {
          ...old,
          commentCount: Math.max(old.commentCount - 1, 0),
        };
      });

      return { previous };
    },

    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(commentKeys.list(postId), context.previous);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: commentKeys.list(postId),
      });
    },
  });
}
