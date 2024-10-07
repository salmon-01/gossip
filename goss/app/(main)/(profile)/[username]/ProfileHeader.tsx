import React from 'react'



export default function ProfileHeader({ user, loggedInUser }) {

  // console.log("Logged-in user:", loggedInUser);
  // console.log("Viewing user:", user.user_id);
  return (
    <>
      <div className="flex items-center justify-between w-11/12 mx-auto">
        <div className="flex items-center">
          <img src='https://example.com/images/john_doe.jpg' className="rounded-full w-16 h-16 bg-black" alt="Profile" />

          <div className="ml-4">
            <div className="font-bold">{user.badge}</div>
            <p className="text-sm text-gray-500">@{user.username}</p>
          </div>
        </div>

        {/* Follow button */}
        {user.user_id === loggedInUser ? (
          <div>
            <button className="border border-gray-400 py-1 px-3 rounded-xl hover:bg-violet-700 hover:text-white">
              Edit profile
            </button>
          </div>
        ) :
          (
            <div>
              <button className="border border-gray-400 py-1 px-3 rounded-xl hover:bg-violet-700 hover:text-white">
                Follow
              </button>
            </div>
          )
        }

      </div>


    </>
  )
}
