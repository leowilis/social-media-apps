import type { UserProfile } from '@/types/user';
import SearchUserCard from './SearchUserCard';

interface SearchResultsProps {
  users: UserProfile[];
  onSelectUser?: () => void;
  onToggleFollow?: (
    e: React.MouseEvent,
    username: string,
    isFollowing: boolean,
  ) => void;
}

export default function SearchResults({
  users,
  onSelectUser,
  onToggleFollow,
}: SearchResultsProps) {
  return (
    <div role='listbox' className='space-y-1 select-none'>
      {users.map((user) => (
        <SearchUserCard
          key={user.id}
          user={user}
          onSelectUser={onSelectUser}
          onToggleFollow={onToggleFollow ?? (() => {})}
        />
      ))}
    </div>
  );
}
