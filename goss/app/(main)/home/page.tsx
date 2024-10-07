import SignOutBtn from "@/app/ui/signOutBtn";

export default async function Homepage() {

  return (
    <div className="pb-16">
      <main className="p-4">
        <h1 className="mb-4 text-2xl font-bold">Home</h1>
        <p>Welcome to your Goss home page!</p>
        <SignOutBtn />
      </main>
    </div>
  );
}
