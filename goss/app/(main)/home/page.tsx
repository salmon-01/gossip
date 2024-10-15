import Feed from '@/app/ui/Feed';
import SignOutBtn from '@/app/ui/signOutBtn';

export default async function Homepage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-white dark:bg-darkModePrimaryBackground">
      <main className="w-full">
        <Feed />
        <SignOutBtn />
      </main>
    </div>
  );
}
