import {
  IoPersonOutline,
  IoBookmarkOutline,
  IoSettingsOutline,
} from 'react-icons/io5';

export const DROPDOWN_ITEMS = [
  { href: '/myProfile', label: 'My Profile', icon: IoPersonOutline },
  { href: '/myProfile?tab=saved', label: 'Saved Posts', icon: IoBookmarkOutline },
  { href: '/editprofile', label: 'Edit Profile', icon: IoSettingsOutline },
] as const;
