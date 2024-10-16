'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchFavourites } from '@/app/api/favourites';
import { useSessionContext } from '@/app/context/SessionContext';
import { HiArrowLongLeft } from 'react-icons/hi2';
import PostComponent from '@/app/ui/Post';
import Link from 'next/link';

export default function FavouritesPage() {
  const { data: session } = useSessionContext();
  const currentUserId = session?.user.id;
  const username = session?.profile.username;

  const {
    data: favourites = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['favourites', currentUserId],
    queryFn: () => fetchFavourites(currentUserId as string),
    enabled: !!currentUserId,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    staleTime: 0,
  });

  if (isLoading) {
    return <div className="space-y-4">Loading followers...</div>;
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <p className="text-red-800">
          Error loading favourites: {(error as Error).message}
        </p>
      </div>
    );
  }

  if (!favourites || favourites.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-gray-500">No favourites found</p>
      </div>
    );
  }

  const sortedFavourites = [...favourites].sort((a, b) => {
    const dateA = new Date(a.created_at).getTime();
    const dateB = new Date(b.created_at).getTime();

    return dateB - dateA;
  });

  return (
    <>
      <div className="fixed top-0 z-40 flex w-full items-center justify-center pb-1 pl-4 pt-4 dark:bg-darkModePrimaryBackground">
        <div className="ml-3 flex w-full font-bold dark:text-darkModeParaText">
          <Link href={`/${username}`}>
            <button className="hover:text-darkModePrimaryBtn dark:hover:text-darkModePrimaryBtn ml-5 rounded dark:bg-darkModePurpleBtn dark:text-darkModeHeader">
              <HiArrowLongLeft size={25} strokeWidth={0.5} />
            </button>
          </Link>
          <div>
            <p className="ml-2 text-xl">Favourites</p>
          </div>
        </div>
      </div>
      <div className="mb-10 flex min-h-screen w-full justify-center bg-white pt-20 dark:bg-darkModePrimaryBackground max-sm:pt-8">
        <div className="mx-auto w-full p-4 lg:w-9/12">
          {sortedFavourites.map((favourite) => (
            <PostComponent
              key={favourite.post_id}
              post={favourite.posts}
              user={favourite.posts.profiles}
              favourites={favourites}
            />
          ))}
        </div>
      </div>
    </>
  );
}
