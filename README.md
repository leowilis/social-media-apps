# Sociality

A modern social media web application built with **Next.js 14**, **TypeScript**, and **Tailwind CSS**. Sociality allows users to share posts, follow others, like and comment on content, and save posts — all with a clean, responsive UI for both desktop and mobile.

---

## ✨ Features

### Authentication & Session
- Register & Login with JWT token
- Token persisted to `localStorage` + cookie (middleware auth guard)
- Redirect to intended page after login (`returnTo` param)
- Auto logout on `401` response via Axios interceptor

### Feed
- Infinite scroll feed (self + following)
- Optimistic UI for like & save — no double-count on rapid clicks
- Rollback on API failure

### Posts
- Create post with image upload + caption
- Delete post (owner only)
- Post detail page — desktop modal + mobile full page

### Likes
- Like / Unlike (idempotent)
- View who liked a post (Liked By sheet)
- My Likes page

### Comments
- View, add, and delete comments
- Optimistic add — appears instantly, syncs with server
- Delete only for comment owner

### Follow / Unfollow
- Follow / Unfollow from profile or user card (idempotent)
- Followers & Following pages

### Saves (Bookmarks)
- Save / Unsave post
- Saved Posts page

### Profile
- My Profile — avatar, bio, stats (posts, followers, following)
- Edit Profile (PATCH /me)
- Public Profile — viewable without login, private actions hidden

### Search
- Debounced user search
- Empty state when no results

### Navigation
- Responsive Navbar — desktop sidebar + mobile bottom nav
- Mobile sidebar drawer with user info
- SSR-safe auth state (no hydration mismatch)

---

## 🛠️ Tech Stack

| Category | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript (strict, zero `any`) |
| Styling | Tailwind CSS |
| UI Components | shadcn/ui |
| Client State | Redux Toolkit |
| Server State | TanStack Query (React Query) |
| Forms | React Hook Form + Zod |
| HTTP Client | Axios (centralized instance) |
| Date Formatting | Day.js |
| Icons | React Icons (Ionicons) |

---

## 📁 Project Structure

```
src/
├── app/
│   ├── (auth)/                  # Login, Register pages
│   │   ├── hooks/
│   │   │   ├── useAuth.ts       # Login, register, logout actions
│   │   │   ├── useLogout.ts     # Logout + query cache clear
│   │   │   └── useIsLoggedIn.ts # SSR-safe auth state
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   │
│   ├── (profile)/               # My profile, edit profile, add post
│   │   ├── myProfile/
│   │   │   ├── hooks/
│   │   │   │   ├── useMyPost.ts
│   │   │   │   └── useMyProfile.ts
│   │   │   └── page.tsx
│   │   ├── editprofile/
│   │   │   ├── hooks/useEditProfile.ts
│   │   │   └── page.tsx
│   │   └── addpost/
│   │
│   ├── (site)/                  # Feed, Search, Post detail
│   │   ├── feed/
│   │   ├── search/
│   │   ├── post/[id]/
│   │   └── layout.tsx
│   │
│   ├── provider/
│   │   └── index.tsx            # Redux Provider + QueryClientProvider
│   └── layout.tsx               # Root layout
│
├── components/
│   ├── features/
│   │   └── likes/               # LikesSheet, LikeContext
│   ├── site/
│   │   ├── header/
│   │   │   ├── hooks/
│   │   │   │   ├── useHeader.ts
│   │   │   │   └── useMe.ts
│   │   │   ├── Navbar.tsx
│   │   │   ├── SidebarMenu.tsx
│   │   │   ├── DesktopUserDropdown.tsx
│   │   │   └── SearchBar.tsx
│   │   ├── bottom/
│   │   │   └── BottomNav.tsx
│   │   ├── post/
│   │   │   ├── hooks/
│   │   │   │   ├── usePostDetail.ts
│   │   │   │   ├── usePostActions.ts
│   │   │   │   └── usePosts.ts
│   │   │   └── ui/
│   │   │       ├── PostCard.tsx
│   │   │       ├── PostDetail.tsx
│   │   │       ├── PostList.tsx
│   │   │       ├── PostActionBar.tsx
│   │   │       ├── CommentSection.tsx
│   │   │       ├── DeleteDialog.tsx
│   │   │       └── PostMenuButton.tsx
│   │   ├── myProfile/
│   │   │   ├── hooks/useMyProfile.ts
│   │   │   └── ProfilePage.tsx
│   │   ├── userProfile/
│   │   │   ├── api/api.ts
│   │   │   ├── hooks/useUserProfile.ts
│   │   │   ├── types/userProfile.ts
│   │   │   └── UserProfile.tsx
│   │   └── search/
│   │       └── SearchOverlay.tsx
│   └── ui/                      # shadcn/ui + custom primitives
│       ├── skeleton.tsx          # All skeleton components
│       ├── emptyState.tsx
│       ├── errorState.tsx
│       ├── spinner.tsx
│       └── ...
│
├── store/
│   ├── authSlice.ts             # Redux auth slice (client state)
│   ├── store.ts                 # Redux store
│   └── hooks.ts                 # useAppDispatch, useAppSelector
│
├── lib/
│   ├── axios.ts                 # Centralized Axios instance
│   ├── utils.ts
│   └── validations/
│       └── auth.ts              # Zod schemas
│
├── config/
│   └── routes.ts                # Route constants
│
└── middleware.ts                 # Next.js auth guard (route protection)
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Backend API running (see backend repo)

### Installation

```bash
# Clone the repository
git clone https://github.com/leowilis/social-media-apps.git
cd social-media-apps

# Install dependencies
npm install
```

### Environment Variables

Create a `.env.local` file in the root:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Running the App

```bash
# Development
npm run dev

# Build for production
npm run build
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔐 Authentication Flow

```
User submits login form
        │
        ▼
useAuth → POST /api/auth/login
        │
        ▼ onSuccess
Redux setAuth (token + user saved to localStorage + cookie)
        │
        ▼
Redirect to /feed (or returnTo param)
        │
        ▼
Axios interceptor automatically attaches token to every request
        │
        ▼
On 401 → Redux clearAuth → redirect /login
```

---

## 🗄️ State Management

| State Type | Tool | Examples |
|---|---|---|
| Client state | Redux Toolkit | Auth session, isLoggedIn |
| Server state | TanStack Query | Posts, feed, profile, comments |
| Form state | React Hook Form | Login, register, edit profile, create post |

**Rule:** Never duplicate server state into Redux. TanStack Query is the single source of truth for all API data.

---

## ⚡ Optimistic UI

Like, Unlike, Save, Unsave, and Comment actions update the UI instantly before the server responds:

1. `onMutate` — snapshot current cache, apply optimistic update
2. `onError` — rollback to snapshot if request fails
3. `onSettled` — invalidate related queries to sync with server

---

## 🧱 Key Patterns

### Centralized Permission Check
```ts
const isOwner = (currentUserId?: number, authorId?: number): boolean =>
  currentUserId !== undefined && authorId !== undefined && currentUserId === authorId;
```

### Standardized UI States
Every page handles three states consistently:
```tsx
if (isLoading) return <PostCardSkeleton />;
if (isError)   return <ErrorState onRetry={refetch} />;
if (!data)     return <EmptyState />;
```

### Feature-Based Hook Structure
Each feature folder has its own `hooks/` directory:
```
app/(auth)/hooks/useAuth.ts
app/(profile)/myProfile/hooks/useMyProfile.ts
components/site/header/hooks/useMe.ts
components/site/post/hooks/usePostActions.ts
```

---

## 📱 Responsive Design

| Breakpoint | Layout |
|---|---|
| Mobile (`< md`) | Bottom navigation bar, sidebar drawer, full-screen post detail |
| Desktop (`≥ md`) | Fixed sidebar navbar, inline comments, modal post detail |

---

## 🔗 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| GET | `/api/me` | Get my profile |
| PATCH | `/api/me` | Update my profile |
| GET | `/api/feed` | Get feed (self + following) |
| POST | `/api/posts` | Create post |
| GET | `/api/posts/:id` | Get post detail |
| DELETE | `/api/posts/:id` | Delete post (owner only) |
| POST | `/api/posts/:id/like` | Like post |
| DELETE | `/api/posts/:id/like` | Unlike post |
| GET | `/api/posts/:id/likes` | Get users who liked |
| GET | `/api/posts/:id/comments` | Get comments |
| POST | `/api/posts/:id/comments` | Add comment |
| DELETE | `/api/comments/:id` | Delete comment (owner only) |
| POST | `/api/follow/:username` | Follow user |
| DELETE | `/api/follow/:username` | Unfollow user |
| POST | `/api/posts/:id/save` | Save post |
| DELETE | `/api/posts/:id/save` | Unsave post |
| GET | `/api/me/saved` | Get saved posts |
| GET | `/api/users/search` | Search users |
| GET | `/api/users/:username` | Get public profile |

---

## 👤 Author

**Leo Wilis**
GitHub: [@leowilis](https://github.com/leowilis)