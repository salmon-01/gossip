import { useSessionContext } from '@/app/context/SessionContext';
import moment from 'moment';

export default function CommentSection({ comments, isLoading }) {
  if (isLoading) return <p>Loading comments...</p>;

  const { data: session, error } = useSessionContext();
  const user = session?.profile;

  console.log(comments);

  console.log(user);

  return (
    <div className="mt-4">
      <h3 className="mb-2 text-lg font-semibold">Comments</h3>
      {comments && comments.length > 0 ? (
        comments.map((comment) => (
          <div key={comment.id} className="mb-4 rounded bg-gray-100 p-3">
            <div className="mb-2 flex items-center">
              <img
                src={user.profile_img}
                alt={`${user.display_name}'s profile`}
                className="mr-2 h-8 w-8 rounded-full"
              />
              <div>
                <p className="font-semibold">{user.display_name}</p>
                <p className="text-xs text-gray-500">
                  {moment.utc(comment.created_at).local().fromNow()}
                </p>
              </div>
            </div>
            <p>{comment.content}</p>
          </div>
        ))
      ) : (
        <p>No comments yet. Be the first to comment!</p>
      )}
    </div>
  );
}
