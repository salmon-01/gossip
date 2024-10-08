import SignOutBtn from '@/app/ui/signOutBtn';

export default async function Homepage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <main className="p-4 text-center">
        <h1 className="mb-4 text-2xl font-bold">Home</h1>
        <p>Welcome to your Goss home page!</p>
        <div className="flex">
          <SignOutBtn />
        </div>
      </main>
    </div>
  );
}
