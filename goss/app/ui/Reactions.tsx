'use client';

import { createClient } from '@/utils/supabase/client';
import { useSessionContext } from '../context/SessionContext';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { addReaction, removeReaction } from '../api/reactions';
import { Post, Reaction } from '../types';

const supabase = createClient();

interface ReactionsProps {
  postAuthorId: string;
  post: Post | null;
}

const Reactions: React.FC<ReactionsProps> = ({ postAuthorId, post }) => {
  const { data: session } = useSessionContext();
  const queryClient = useQueryClient();
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const availableEmojis = ['😀', '😢', '❤️', '🔥', '👍', '👎', '🎉', '😮'];

  if (!post) {
    return <div>Loading reactions...</div>;
  }

  const postId = post.id;
  const reactionsData = post.reactions || [];

  const reactionsMap: { [key: string]: Reaction } = {};

  reactionsData.forEach((item: any) => {
    const { reaction: emoji, user_id } = item;

    if (!reactionsMap[emoji]) {
      reactionsMap[emoji] = {
        reaction: emoji,
        count: 0,
        userHasReacted: false,
      };
    }
    reactionsMap[emoji].count += 1;
    if (session && user_id === session.user.id) {
      reactionsMap[emoji].userHasReacted = true;
    }
  });

  const reactions = Object.values(reactionsMap);

  const addReactionMutation = useMutation({
    mutationFn: (reaction: string) =>
      addReaction(postId, session!.user.id, reaction, postAuthorId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      console.log(postId);
      queryClient.invalidateQueries({ queryKey: ['posts', postAuthorId] });
      queryClient.invalidateQueries({ queryKey: ['post', postId.toString()] });
    },
  });

  const removeReactionMutation = useMutation({
    mutationFn: (reaction: string) =>
      removeReaction(postId, session!.user.id, reaction),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      console.log(postId);
      queryClient.invalidateQueries({ queryKey: ['posts', postAuthorId] });
      queryClient.invalidateQueries({
        queryKey: ['post', postId.toString()],
      });
    },
  });

  const handleToggleReaction = (reaction: string) => {
    const userHasReacted = reactionsMap[reaction]?.userHasReacted;
    if (userHasReacted) {
      removeReactionMutation.mutate(reaction);
    } else {
      addReactionMutation.mutate(reaction);
    }
    setShowEmojiPicker(false);
  };

  return (
    <div className="flex items-center space-x-2">
      {reactions.map((reaction) => (
        <button
          key={reaction.reaction}
          onClick={() => handleToggleReaction(reaction.reaction)}
          className={`flex items-center rounded-xl px-1 py-px dark:bg-darkModePrimaryBackground ${
            reaction.userHasReacted
              ? 'bg-darkModePrimaryBtn dark:bg-gray-600 dark:text-white'
              : 'bg-gray-200'
          }`}
        >
          <span className="text-xl">{reaction.reaction}</span>
          <span
            className={`ml-1 text-sm ${
              reaction.userHasReacted ? 'text-white' : 'text-black dark:text-white'
            } `}
          >
            {reaction.count}
          </span>
        </button>
      ))}

      {reactions.length < availableEmojis.length && (
        <div className="relative">
          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="rounded-xl bg-gray-200 px-2 py-1 dark:bg-darkModePrimaryBackground dark:text-white"
          >
            ...
          </button>
          {showEmojiPicker && (
            <div className="absolute z-10 mt-2 flex space-y-1 rounded-xl border bg-white shadow-lg dark:bg-darkModePrimaryBackground">
              {availableEmojis
                .filter((emoji) => !reactionsMap[emoji])
                .map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => handleToggleReaction(emoji)}
                    className="rounded-xl px-2 py-1 hover:bg-gray-100"
                  >
                    <span className="text-xl">{emoji}</span>
                  </button>
                ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Reactions;
