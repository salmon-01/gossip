import { signOut } from '@/app/login/actions';
import { HiArrowRightOnRectangle } from 'react-icons/hi2';

function SignOutBtn() {
  return (
    <div>
      <form action={signOut}>
        <button className="flex h-16 w-16 cursor-pointer items-center justify-center rounded-full border border-white bg-slate-600 drop-shadow-2xl">
          <HiArrowRightOnRectangle className="text-white" size={28} />
        </button>
      </form>
    </div>
  );
}

export default SignOutBtn;
