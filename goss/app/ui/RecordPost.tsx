import Link from 'next/link';
import { HiOutlineMicrophone } from 'react-icons/hi2';

function RecordPost() {
  return (
    <div>
      <Link href="/create-post">
        <div className="flex h-16 w-16 cursor-pointer items-center justify-center rounded-full border border-white bg-purple-600 drop-shadow-2xl">
          <HiOutlineMicrophone
            className="text-white"
            size={28}
            style={{ strokeWidth: 2 }}
          />
        </div>
      </Link>
    </div>
  );
}

export default RecordPost;
