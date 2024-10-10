'use client';

import { createClient } from '@/utils/supabase/client';
import { useSessionContext } from '../context/SessionContext';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

const supabase = createClient();

interface Reaction {
  reaction: string;
  count: number;
  userHasReacted: boolean;
}

interface ReactionsProps {
  postId: string;
}

const Reactions: React.FC<ReactionsProps> = ({ postId }) => {
  const { data: session } = useSessionContext();
  const queryClient = useQueryClient();
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const availableEmojis = ['😀', '😢', '❤️', '🔥', '👍', '👎', '🎉', '😮'];

  const { data: reactionsData = [] } = useQuery({
    queryKey: ['reactions', postId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reactions')
        .select('reaction, user_id')
        .eq('post_id', postId);

      if (error) {
        throw error;
      }
      return data;
    },
  });

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
    mutationFn: async (reaction: string) => {
      const { error } = await supabase.from('reactions').insert({
        post_id: postId,
        user_id: session!.user.id,
        reaction,
      });
      if (error) {
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['reactions', postId]);
    },
  });

  const removeReactionMutation = useMutation({
    mutationFn: async (reaction: string) => {
      const { error } = await supabase.from('reactions').delete().match({
        post_id: postId,
        user_id: session!.user.id,
        reaction,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['reactions', postId]);
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
          className={`flex items-center rounded-xl px-2 py-1 ${
            reaction.userHasReacted ? 'bg-purple-600 text-white' : 'bg-gray-200'
          }`}
        >
          <span className="text-xl">{reaction.reaction}</span>
          <span className="ml-1 text-sm">{reaction.count}</span>
        </button>
      ))}

      {reactions.length < availableEmojis.length && (
        <div className="relative">
          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="rounded-xl bg-gray-300 px-2 py-1"
          >
            ...
          </button>
          {showEmojiPicker && (
            <div className="absolute z-10 mt-2 flex space-y-1 rounded-xl border bg-white shadow-lg">
              {availableEmojis
                .filter((emoji) => !reactionsMap[emoji])
                .map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => handleToggleReaction(emoji)}
                    className="px-2 py-1 hover:bg-gray-100"
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
