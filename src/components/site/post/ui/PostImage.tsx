'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import type { Post } from '@/types/post';

interface PostImageProps {
  post: Post;
  liked: boolean;
  saved: boolean;
}

export default function PostImage({ post, liked, saved }: PostImageProps) {
  const router = useRouter();

  const handleDesktopClick = () => {
    router.push(
      `?postId=${post.id}&liked=${liked}&likeCount=${post.likeCount}&saved=${saved}`,
      {
        scroll: false,
      },
    );
  };

  return (
    <div className='w-full select-none'>
      {/* Mobile */}
      <Link
        href={`/post/${post.id}?liked=${liked}&likeCount=${post.likeCount}&saved=${saved}`}
        className='md:hidden'
      >
        <div className='relative aspect-square w-full overflow-hidden rounded-3xl'>
          <Image
            src={post.imageUrl}
            alt={post.caption ?? 'Social media image entry'}
            fill
            className='object-cover'
            sizes='100vw'
            priority={post.id < 5}
          />
        </div>
      </Link>

      {/* Desktop */}
      <button
        type='button'
        aria-label={`Open post by ${post.author.name}`}
        onClick={handleDesktopClick}
        className='relative hidden aspect-square w-full overflow-hidden rounded-md md:block'
      >
        <Image
          src={post.imageUrl}
          alt={post.caption ?? 'Social media image entry'}
          fill
          className='object-cover'
          sizes='(min-width:768px) 600px,100vw'
        />
      </button>
    </div>
  );
}
