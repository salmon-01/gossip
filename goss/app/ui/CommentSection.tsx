import { useSessionContext } from '../../app/context/SessionContext';
import moment from 'moment';
import { useState } from 'react';
import { BsThreeDots } from 'react-icons/bs';

interface Comment {
  id: string;
  content: string;
  created_at: string;
  post_id: string;
  profiles: any | null;
  user_id: string | null;
}

interface CommentSectionProps {
  comments: Comment[];
  onDeleteComment: (commentId: string) => void;
}

export default function CommentSection({
  comments,
  onDeleteComment,
}: CommentSectionProps) {
  console.log(comments);

  const [menuOpen, setMenuOpen] = useState<Record<string, boolean>>({});

  const toggleMenu = (id: string) => {
    setMenuOpen((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const { data: session, isLoading, error } = useSessionContext();
  const user = session?.profile;

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!session) return <div>Not logged in</div>;

  return (
    <div className="mt-4 lg:max-w-6xl">
      <h3 className="mb-2 text-lg font-semibold text-gray-700 dark:text-gray-200">
        Comments
      </h3>
      {comments && comments.length > 0 ? (
        comments
          .slice() // Create a copy of the array to avoid mutating the original one
          .sort(
            (a, b) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
          )
          .map((comment) => (
            <div
              key={comment.id}
              className="relative mb-4 rounded bg-gray-100 p-3 dark:bg-darkModeSecondaryBackground"
            >
              {/* Three dots menu in the top-right corner of each individual comment */}
              {user?.user_id === comment.user_id && (
                <div className="absolute right-2 top-2">
                  <button
                    onClick={() => toggleMenu(comment.id)}
                    className="text-gray-500 focus:outline-none"
                  >
                    <BsThreeDots className="h-6 w-6" />
                  </button>
                  {menuOpen[comment.id] && (
                    <div className="absolute right-0 w-32 rounded border border-gray-300 bg-white shadow-lg">
                      <button
                        onClick={() => onDeleteComment(comment.id)}
                        className="block w-full px-4 py-2 text-left text-red-500 hover:bg-gray-100"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              )}
              <div className="mb-2 flex items-center">
                {comment.profiles?.profile_img ? (
                  <img
                    src={comment.profiles.profile_img}
                    alt={`${comment.profiles.display_name}'s profile`}
                    className="mr-2 h-8 w-8 rounded-full"
                    onError={(e) => {
                      e.currentTarget.src = '';
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-gray-300 text-white">
                    {comment.profiles?.display_name
                      ? comment.profiles.display_name
                          .split(' ')
                          .map((n: string) => n[0])
                          .join('')
                          .substring(0, 2)
                      : '??'}
                  </div>
                )}
                <div>
                  <p className="font-semibold dark:text-gray-200">
                    {comment.profiles?.display_name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {moment.utc(comment.created_at).local().fromNow()}
                  </p>
                </div>
              </div>
              <p className="dark:text-gray-200">{comment.content}</p>
            </div>
          ))
      ) : (
        <p className="text-gray-600 dark:text-white">
          No comments yet. Be the first to comment!
        </p>
      )}
    </div>
  );
}
