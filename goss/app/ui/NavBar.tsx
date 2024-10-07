import Link from 'next/link';
import { HiOutlineHome } from 'react-icons/hi2';
import { HiMagnifyingGlass } from 'react-icons/hi2';
import { HiOutlineCog6Tooth } from 'react-icons/hi2';
import { HiOutlineBell } from 'react-icons/hi2';

function NavBar() {
  return (
    <nav className="fixed bottom-0 w-full bg-gray-50 drop-shadow-sm">
      <div className="flex justify-around py-5">
        <Link href="/home">
          <HiOutlineHome color="#5b21b6" size={32} />
        </Link>
        {/* <Link href="/feed">Feed</Link> */}
        <Link href="/search">
          <HiMagnifyingGlass color="#5b21b6" size={32} />
        </Link>
        <Link href="notifications">
          <HiOutlineBell color="#5b21b6" size={32} />
        </Link>
        <Link href="/settings">
          <HiOutlineCog6Tooth color="#5b21b6" size={32} />
        </Link>
      </div>
    </nav>
  );
}

export default NavBar;
