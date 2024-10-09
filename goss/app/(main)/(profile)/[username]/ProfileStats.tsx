import React from 'react';

export default function ProfileStats(user) {
  return (
    <div className="mx-auto my-3 mt-4 w-11/12">
      <span>{user.user.follower_count}</span>
      <span className="mr-3 text-gray-600"> Followers</span>
      <span>5 </span>
      <span className="text-gray-600">Following</span>
    </div>
  );
}
