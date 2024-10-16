'use client';

import ProfileCard from '@/app/ui/ProfileCard';
import { createClient } from '@/utils/supabase/client';
import PostCard from '@/app/ui/PostCard';
import React, { useState, useEffect, useRef } from 'react';
import LoadingSpinner from '@/app/ui/LoadingSpinner';

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

export default function Search() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<SearchType>('profiles');
  const [searchResults, setSearchResults] = useState<Profile[] | Post[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

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
      onClick={() => {
        setSearchType(type);
        inputRef.current?.focus();
      }}
      className={`rounded-t-md px-6 py-3 text-sm font-medium transition-all duration-300 ease-in-out ${
        searchType === type
          ? 'bg-darkModeSecondaryBtn dark:bg-darkModePrimaryBtn text-white shadow-md'
          : 'bg-gray-200 text-gray-600 hover:bg-gray-300 dark:bg-gray-500 dark:text-white'
      } lg:mt-6 lg:px-12 lg:py-4 lg:text-base`}
    >
      {label}
    </button>
  );

  return (
    <div className="flex min-h-screen w-full flex-col items-center bg-gray-50 p-8 dark:bg-darkModePrimaryBackground">
      <div className="w-full max-w-md">
        <div className="mb-4 flex">
          <TabButton type="profiles" label="Profiles" />
          <TabButton type="captions" label="Captions" />
        </div>
        <input
          ref={inputRef}
          type="text"
          placeholder={`Search for ${searchType === 'profiles' ? 'a profile' : 'a caption'}...`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-lg border border-gray-300 bg-slate-100 p-4 shadow-sm transition duration-200 focus:border-slate-500 focus:outline-none focus:ring-slate-500 dark:border-gray-500 dark:bg-darkModePrimaryBackground dark:text-white dark:focus:border-slate-300"
        />
      </div>
      <div className="mt-6 grid w-full max-w-3xl grid-cols-1 gap-6 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1">
        {isSearching ? (
          <LoadingSpinner size={30} color="#3B82F6" bgColor="" />
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
          <div className="col-span-full mt-8 text-center text-gray-500 dark:text-darkModeParaText">
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
