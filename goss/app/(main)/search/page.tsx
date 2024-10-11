'use client';

import { useSessionContext } from '@/app/context/SessionContext';
import ProfileCard from '@/app/ui/ProfileCard';
import { createClient } from '@/utils/supabase/client';
import { useState, useEffect } from 'react';
const supabase = createClient();

type Profile = {
  user_id: string;
  display_name: string;
};

export default function TestQuery() {
  const { data: session, isLoading, error } = useSessionContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    const handleSearch = async () => {
      if (!searchQuery.trim()) {
        setProfiles([]);
        setHasSearched(false);
        return;
      }

      setIsSearching(true);
      setHasSearched(true);

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .ilike('display_name', `%${searchQuery}%`);

      if (error) {
        console.error(error);
      } else {
        setProfiles(data);
      }

      setIsSearching(false);
    };

    const debounceTimeout = setTimeout(() => {
      handleSearch();
    }, 300);

    return () => clearTimeout(debounceTimeout);
  }, [searchQuery]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!session) return <div>Not logged in</div>;

  return (
    <div className="flex min-h-screen w-full flex-col items-center bg-gray-50 p-8">
      <div className="w-full max-w-md">
        <input
          type="text"
          placeholder="Search for a profile..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-lg border border-gray-300 p-4 shadow-sm transition duration-200 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mt-6 grid w-full max-w-3xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {isSearching ? (
          <div className="col-span-full mt-8 text-center text-gray-500">
            Searching...
          </div>
        ) : profiles.length > 0 ? (
          profiles.map((profile) => (
            <ProfileCard key={profile.user_id} user={profile} />
          ))
        ) : (
          <div className="col-span-full mt-8 text-center text-gray-500">
            {!hasSearched
              ? 'Enter a name to search for profiles'
              : searchQuery.trim() !== ''
                ? 'No profiles found'
                : 'Enter a name to search for profiles'}
          </div>
        )}
      </div>
    </div>
  );
}
