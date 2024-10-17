"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { fetchConversationProfile } from "../api/MessagesData";
import { useQuery } from "@tanstack/react-query";
import Loading from "../(main)/loading";
import { ChatMessagesProps } from "../types";
import { createClient } from '@/utils/supabase/client';


const supabase = createClient();

export default function ChatHeader({ conversationId, loggedInUserId }: ChatMessagesProps) {
  const [isOnline, setIsOnline] = useState(false); // Track online status

  // Fetch profile data using React Query
  const {
    data: profileData,
    isLoading: isLoadingProfile,
    error: profileError,
  } = useQuery({
    queryKey: ["conversationProfile", loggedInUserId, conversationId],
    queryFn: () => fetchConversationProfile(loggedInUserId, conversationId),
    enabled: !!loggedInUserId && !!conversationId,
  });

  // Subscribe to presence (online/offline status) using Supabase
  useEffect(() => {
    if (profileData?.id) {
      const channel = supabase.channel(`presence-${profileData.id}`);

      // Listen for presence sync
      channel.on("presence", { event: "sync" }, () => {
        const state = channel.presenceState();
        setIsOnline(!!state[profileData.id]); 
      });

      // Join the presence channel
      channel.subscribe();

      // Cleanup on unmount
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [profileData?.id]);

  if (profileError) {
    return <div>Error loading profile: {profileError.message}</div>;
  }
  if (isLoadingProfile) {
    return <Loading />;
  }

  return (
    <div className="p-3 sticky top-0 flex items-center shadow dark:shadow-xl bg-white dark:bg-darkModePrimaryBackground z-20">
      <Link
        href="/chats"
        className="flex items-center text-lg font-bold text-gray-700 hover:text-gray-900 transition duration-200"
      >
        <span className="text-3xl mb-1 mr-2 dark:text-darkModeHeader dark:hover:text-darkhoverBackground">
          {"\u2190"}
        </span>
      </Link>

      <div className="flex items-center ml-4">
        <Link href={`/${profileData?.username}`}>
          <img
            src={profileData?.profile_img}
            className="w-10 h-10 rounded-full mr-2"
            alt="Profile"
          />
        </Link>
        <div>
          <h2 className="text-lg font-bold text-black dark:text-darkModeParaText">
            {profileData?.display_name}
            {/* Online status indicator */}
          </h2>
          <p className="text-sm text-gray-500 dark:text-darkModeParaText">
            @{profileData?.username}
          </p>
          <div
              className={`ml-2 w-2 h-2 rounded-full ${
                isOnline ? "bg-green-500" : "bg-gray-400"
              }`}
              title={isOnline ? "Online" : "Offline"}
            ></div>
        </div>
      </div>
    </div>
  );
}
