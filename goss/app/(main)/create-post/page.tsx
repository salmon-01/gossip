'use client';

import CreatePost from '@/app/ui/CreatePost';
import TextToSpeech from '@/app/ui/TextToSpeech';
import { useRouter } from 'next/navigation';

export default function Create() {
  const router = useRouter();

  const handlePostCreated = () => {
    // Navigate to home after post creation
    router.push('/home');
  };

  return (
    <div className="pb-16">
      <main className="p-4">
        <h1 className="mb-4 text-2xl font-bold dark:text-darkModeHeader">
          Create Post
        </h1>
        <CreatePost onPostCreated={handlePostCreated} />
        {/* <TextToSpeech /> */}
      </main>
    </div>
  );
}
