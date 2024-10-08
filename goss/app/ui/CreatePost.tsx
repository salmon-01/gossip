'use client';
import AudioRecorder from '@/app/ui/AudioRecorder';
import { mockUsers } from '@/mocks/mockUsers';
import { createPost } from '../login/actions';

export default function CreatePost() {
  return (
    <>
      <form>
        <div className="flex flex-col rounded-md bg-gray-200 px-2 pb-4 pt-2">
          <div className="flex h-8 w-full items-center">
            <img
              src={mockUsers[0].profile_img}
              alt="Profile picture"
              className="mr-3 h-8 w-8 rounded-full bg-black shadow-md"
            />
            <input
              type="text"
              name="caption"
              placeholder="Write a caption"
              className="w-full rounded-md px-1"
            />
          </div>
        </div>
        <div>
          <AudioRecorder />
        </div>
        <div className="mt-2 flex justify-center">
          <button
            type="submit"
            formAction={createPost}
            className="rounded-xl bg-purple-400 px-4 py-1 text-white"
          >
            Post
          </button>
        </div>
      </form>
    </>
  );
}
