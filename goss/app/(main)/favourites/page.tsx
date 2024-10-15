'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchFavourites } from '@/app/api/favourites';
import { useSessionContext } from '@/app/context/SessionContext';
import { HiArrowLongLeft } from "react-icons/hi2";
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
    return (
      <div className="space-y-4">
        Loading followers...
      </div>
    );
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
    <div className='flex fixed max-w-[430px] w-full top-0 z-40 justify-center items-center bg-white dark:bg-darkModePrimaryBackground pb-1 pl-4 pt-4'>
        <div className="flex max-w-[430px] w-full text-purple-700 dark:text-darkModeParaText font-bold">
          <Link href={`/${username}`}>
            <button className='bg-purple-700 dark:bg-darkModePurpleBtn rounded px-1 text-white mr-3 hover:bg-purple-500'>
              <HiArrowLongLeft size={25} strokeWidth={0.5}/>
            </button>
          </Link>
          <div>
            Saved
          </div>
        </div>
    </div>
    <div className="flex min-h-screen w-full justify-center mt-8 bg-white dark:bg-darkModePrimaryBackground">
      <div className="space-y-4 w-full p-4">
        {sortedFavourites.map((favourite) => (
              <PostComponent key={favourite.post_id} post={favourite.posts} user={favourite.posts.profiles} favourites={favourites} />
            ))}
      </div>
    </div>
    </>
  );
}
