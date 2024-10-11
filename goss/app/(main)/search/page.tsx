'use client';

import ProfileCard from '@/app/ui/ProfileCard';
import { createClient } from '@/utils/supabase/client';
import PostCard from '@/app/ui/PostCard';
import React, { useState, useEffect } from 'react';

const supabase = createClient();

interface Profile {
  user_id: string;
  display_name: string;
}

interface Post {
  id: string;
  caption: string;
  profiles: {
    display_name: string;
    profile_img: string;
    username: string;
  };
}

type SearchType = 'profiles' | 'captions';

const searchData = async (
  query: string,
  type: SearchType
): Promise<Profile[] | Post[]> => {
  if (type === 'profiles') {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .ilike('display_name', `%${query}%`);

    if (error) {
      console.error('Error searching profiles:', error);
      throw error;
    }
    return data || [];
  } else {
    const { data, error } = await supabase
      .from('posts')
      .select(
        `
        *,
        profiles:user_id (
          display_name,
          profile_img,
          username
        )
      `
      )
      .ilike('caption', `%${query}%`);

    if (error) {
      console.error('Error searching posts:', error);
      throw error;
    }
    return data || [];
  }
};

export default function TestQuery() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<SearchType>('profiles');
  const [searchResults, setSearchResults] = useState<Profile[] | Post[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    const handleSearch = async () => {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        setHasSearched(false);
        return;
      }

      setIsSearching(true);
      setHasSearched(true);

      try {
        const results = await searchData(searchQuery, searchType);
        setSearchResults(results);
      } catch (error) {
        console.error('Error searching:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    const debounceTimeout = setTimeout(() => {
      handleSearch();
    }, 300);

    return () => clearTimeout(debounceTimeout);
  }, [searchQuery, searchType]);

  const TabButton: React.FC<{ type: SearchType; label: string }> = ({
    type,
    label,
  }) => (
    <button
      onClick={() => setSearchType(type)}
      className={`px-4 py-2 font-semibold ${
        searchType === type
          ? 'bg-blue-500 text-white'
          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
      } rounded-t-lg transition duration-200`}
    >
      {label}
    </button>
  );

  return (
    <div className="flex min-h-screen w-full flex-col items-center bg-gray-50 p-8">
      <div className="w-full max-w-md">
        <div className="mb-4 flex">
          <TabButton type="profiles" label="Profiles" />
          <TabButton type="captions" label="Captions" />
        </div>
        <input
          type="text"
          placeholder={`Search for ${searchType === 'profiles' ? 'a profile' : 'a caption'}...`}
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
        ) : searchResults.length > 0 ? (
          searchResults.map((result) =>
            searchType === 'profiles' ? (
              <ProfileCard
                key={(result as Profile).user_id}
                user={result as Profile}
              />
            ) : (
              <PostCard key={(result as Post).id} post={result as Post} />
            )
          )
        ) : (
          <div className="col-span-full mt-8 text-center text-gray-500">
            {!hasSearched
              ? `Enter a ${searchType === 'profiles' ? 'name' : 'caption'} to search`
              : searchQuery.trim() !== ''
                ? `No ${searchType} found`
                : `Enter a ${searchType === 'profiles' ? 'name' : 'caption'} to search`}
          </div>
        )}
      </div>
    </div>
  );
}
