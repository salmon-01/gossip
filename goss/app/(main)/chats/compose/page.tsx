"use client"
import React from 'react';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import ProfileCard from '@/app/ui/ProfileCard';
import LoadingSpinner from '@/app/ui/LoadingSpinner';
import { createClient } from '@/utils/supabase/client';

const supabase = createClient();

interface Profile {
  user_id: string;
  display_name: string;
}

export default function Page() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Profile[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null); // Create a ref for the input field

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const searchData = async (query: string): Promise<Profile[]> => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .ilike('display_name', `%${query}%`);

    if (error) {
      console.error('Error searching profiles:', error);
      throw error;
    }
    return data || [];
  }

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
        const results = await searchData(searchQuery);
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
  }, [searchQuery]);

  return (
    <>
      <div className='flex items-center justify-start px-4 py-6'>
        <Link href="/chats" className='text-2xl'>{'\u2190'}</Link>
        <h2 className='font-bold text-2xl ml-4'>New message</h2>
      </div>

      <form className='px-4'>
        <input
          type='search'
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder='Search people'
          className='w-full p-3 border rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500'
        />
      </form>

      <div className="mt-6 w-full">
        {isSearching ? (
          <LoadingSpinner size={30} color="#3B82F6" bgColor="" />
        ) : searchResults.length > 0 ? (
          searchResults.map((result) => (
            <Link href="/chats">
              <div key={result.user_id} className="flex items-center p-3 bg-white shadow-sm rounded-lg w-11/12 mx-auto mb-3 hover:bg-purple-100">
                <img
                  src={result.profile_img}
                  alt={result.display_name}
                  className='w-14 h-14 rounded-full mr-4'
                />
                <div>
                  <p className='font-semibold text-lg'>{result.display_name}</p>
                  <p className='text-gray-500'>@{result.username}</p>
                </div>
              </div>

            </Link>
          ))
        ) : (
          <div className="dark:text-darkModeParaText mt-8 text-center text-gray-500">
            {!hasSearched
              ? `Enter a name to search`
              : searchQuery.trim() !== ''
                ? `No profile found`
                : `Enter a name to search`}
          </div>
        )}
      </div>
    </>
  );
}
