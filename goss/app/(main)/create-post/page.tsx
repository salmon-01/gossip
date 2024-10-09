'use client';

import CreatePost from '@/app/ui/CreatePost';
import { useRouter } from 'next/navigation'; // Change to next/navigation

export default function Create() {
  const router = useRouter();

  const handlePostCreated = () => {
    // Navigate to home after post creation
    router.push('/home');
  };

  return (
    <div className="pb-16">
      <main className="p-4">
        <h1 className="mb-4 text-2xl font-bold">Create Post</h1>
        <CreatePost onPostCreated={handlePostCreated} />
      </main>
    </div>
  );
}
