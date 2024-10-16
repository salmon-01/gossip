"use client"; // Add this at the very top to specify that this is a client-side component

import React, { useState, useEffect, useRef, ChangeEvent } from 'react';
import Link from 'next/link';
import LoadingSpinner from '@/app/ui/LoadingSpinner';
import { createClient } from '@/utils/supabase/client';
import { useSessionContext } from '@/app/context/SessionContext';
import { createConversation } from '@/app/api/MessagesData';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { searchData } from '@/app/api/searchData';

const supabase = createClient();

interface Profile {
  user_id: string;
  display_name: string;
  username: string;
  profile_img: string;
}

export default function Page() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Profile[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [clickedUser, setClickedUser] = useState('');
  const { data: session } = useSessionContext();
  const loggedInUserId = session?.user.id;

  const router = useRouter();

  // Picks a user by userId
  function pick(userId:string) {
    setClickedUser(userId);
  }

  // Handle search input change
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Handle search with debounce effect
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

  // Mutation to create a conversation
  const { mutate: createConversationMutation } = useMutation({
    mutationFn: () => createConversation(loggedInUserId, clickedUser),
    onSuccess: (conversationData) => {
      if (conversationData && conversationData.id) {
        router.push(`/chats/${conversationData.id}`);
      }
    },
    onError: (error) => {
      console.error('Error creating conversation:', error);
    },
  });

  // Check if conversation can be created
  useEffect(() => {
    if (clickedUser && loggedInUserId) {
      createConversationMutation();
    }
  }, [clickedUser, loggedInUserId]);

  return (
    <>
      <div className="flex items-center justify-start px-4 py-6 dark:text-darkModeHeader">
        <Link href="/chats" className="text-2xl">{'\u2190'}</Link>
        <h2 className="font-bold text-2xl ml-4">New message</h2>
      </div>

      <form className="px-4">
        <input
          type="search"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search people"
          className="w-full p-3 border rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-darkModeSecondaryBtn dark:text-darkModeParaText"
        />
      </form>

      <div className="mt-6 w-full">
        {isSearching ? (
          <LoadingSpinner size={30} color="#3B82F6" bgColor="" />
        ) : searchResults.length > 0 ? (
          searchResults.map((result) => (
            <div
              key={result.user_id}
              onClick={() => pick(result.user_id)}
              className="flex items-center p-3 bg-white shadow-sm rounded-lg w-11/12 
              mx-auto mb-3 hover:bg-darkModeParaText dark:hover:bg-darkhoverBackground dark:bg-darkModeSecondaryBackground dark:text-darkModeHeader cursor-pointer"
            >
              <img
                src={result.profile_img || '/default-avatar.png'} // Fallback image
                alt={result.display_name}
                className="w-14 h-14 rounded-full mr-4"
              />
              <div>
                <p className="font-semibold text-lg">{result.display_name}</p>
                <p className="text-gray-500 dark:text-darkModeParaText">@{result.username}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="dark:text-darkModeParaText mt-8 text-center text-gray-500">
            {!hasSearched
              ? 'Enter a name to search'
              : searchQuery.trim() !== ''
              ? 'No profile found'
              : 'Enter a name to search'}
          </div>
        )}
      </div>
    </>
  );
}
