import CreatePost from '@/app/ui/CreatePost';
import { mockUsers } from '@/mocks/mockUsers';


export default function Create() {
  return (
    <div className="pb-16">
      <main className="p-4">
        <h1 className="mb-4 text-2xl font-bold">Create Post</h1>
        <CreatePost user={mockUsers[0]}/>
      </main>
    </div>
  );
}