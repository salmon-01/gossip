import Feed from '@/app/ui/Feed';
import SignOutBtn from '@/app/ui/signOutBtn';

export default async function Homepage() {
  return (
    <div className="dark:bg-darkModePrimaryBackground flex min-h-screen w-full items-center justify-center bg-white">
      <main className="w-full items-center justify-center align-middle">
        <Feed />
        <SignOutBtn />
      </main>
    </div>
  );
}
