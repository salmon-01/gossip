import { signOut } from '@/app/login/actions';

function SignOutBtn() {
  return (
    <form action={signOut}>
      <button className="bg-slate-600 px-2 py-4">
        Sign Out
      </button>
    </form>
  );
}

export default SignOutBtn;
