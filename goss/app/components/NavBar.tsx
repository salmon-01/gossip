import Link from 'next/link';

function NavBar() {
  return (
    <nav className="fixed bottom-0 w-full border-t bg-white">
      <div className="flex justify-around py-2">
        <Link href="/home">Home</Link>
        <Link href="/feed">Feed</Link>
        <Link href="/search">Search</Link>
        <Link href="/settings">Settings</Link>
      </div>
    </nav>
  );
}

export default NavBar;
