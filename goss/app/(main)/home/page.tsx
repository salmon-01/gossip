import Feed from '@/app/ui/Feed';
import SignOutBtn from '@/app/ui/signOutBtn';

export default async function Homepage() {
  return (

    <div className="flex min-h-screen items-center justify-center w-full">
      <main className="p-4 w-full">
        <Feed />
        <SignOutBtn />
      </main>
    </div>
  );
}
