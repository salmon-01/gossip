import Link from 'next/link';
import { HiOutlineMicrophone } from 'react-icons/hi2';

function RecordPost() {
  return (
    <div>
      <Link href="/create-post">
        <div className="dark:bg-darkModePrimaryBtn bg-darkModeSecondaryBtn flex h-16 w-16 cursor-pointer items-center justify-center rounded-full border border-white drop-shadow-2xl dark:border-none lg:h-auto lg:w-auto lg:border-none lg:bg-inherit lg:py-4 lg:dark:bg-inherit">
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
