'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchFavourites } from '@/app/api/favourites';
import { useSessionContext } from '@/app/context/SessionContext';
import PostComponent from '@/app/ui/Post';

export default function FavouritesPage() {

  const { data: session } = useSessionContext();
  const currentUserId = session?.user.id;

  const {
    data: favourites = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['favourites', currentUserId],
    queryFn: () => fetchFavourites(currentUserId as string),
    enabled: !!currentUserId,
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
    <div className="fixed left-0 top-0 z-40 flex w-full items-center bg-white pb-2 pl-4 pt-4 mb-2 text-base text-purple-500 font-bold">
      Favourites
    </div>
    <div className="flex min-h-screen w-full items-center justify-center mt-4 bg-white">
      <div className="space-y-4 w-full p-4">
        {sortedFavourites.map((favourite) => (
              <PostComponent key={favourite.post_id} post={favourite.posts} user={favourite.posts.profiles} favourites={favourites} />
            ))}
      </div>
    </div>
    </>
  );
}
