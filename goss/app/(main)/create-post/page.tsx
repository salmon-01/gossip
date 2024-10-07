import CreatePost from '@/app/ui/CreatePost';
import Post from '@/app/ui/Post';

export default function Create() {
  return (
    <div className="pb-16">
      <main className="p-4">
        <h1 className="mb-4 text-2xl font-bold">Create Post</h1>
        <CreatePost />
      </main>
    </div>
  );
}