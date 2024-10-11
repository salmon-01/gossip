import Link from 'next/link'; // Assuming you're using Next.js

const PostCard: React.FC<{ post: Post }> = ({ post }) => {
  const user = post.profiles; // Assuming post contains user profile data
  const isFollowing = false; // Placeholder for follow state logic

  const handleFollowToggle = () => {
    // Add follow/unfollow logic here
    console.log('Toggle follow');
  };

  return (
    <div className="m-4 flex items-center justify-between rounded-lg bg-white p-4 shadow">
      <div className="flex items-center">
        <img
          src={user.profile_img} // Assuming profile_img is part of post.profiles
          alt={`${user.display_name}'s profile`}
          className="h-16 w-16 rounded-full"
        />
        <Link href={`/${user.username}`}>
          <div className="ml-3 flex flex-col">
            <p className="font-semibold">{user.display_name}</p>
            <p className="text-gray-500">@{user.username}</p>
          </div>
        </Link>
      </div>
      <div className="rounded-full bg-blue-500 px-3 py-1 text-white">
        <button onClick={handleFollowToggle}>
          {isFollowing ? 'Followed' : 'Follow'}
        </button>
      </div>
    </div>
  );
};

export default PostCard;
