import { useQuery } from '@tanstack/react-query';

import { usersApi } from '@/lib/api/users';
import { userKeys } from './key';

export function useSearchUsers(query: string, page = 1, limit = 20) {
  return useQuery({
    queryKey: userKeys.search(query, page, limit),
    queryFn: () => usersApi.searchUsers(query, page, limit),
    select: (response) => response.data.data.users,
    enabled: query.trim().length > 0,
    staleTime: 1000 * 60 * 5,
  });
}
