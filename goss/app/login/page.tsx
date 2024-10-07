import { login, signup } from './actions';

export default function LoginPage() {
  return (
    <form className="flex w-1/3 flex-col">
      <label htmlFor="email">Email:</label>
      <input
        id="email"
        name="email"
        type="email"
        className="text-black"
        required
      />
      <label htmlFor="password">Password:</label>
      <input
        id="password"
        name="password"
        type="password"
        className="text-black"
        required
      />
      <button formAction={login} className="mt-2 bg-slate-600 p-2">
        Log in
      </button>
      <button formAction={signup} className="mt-2 bg-slate-400 p-2">
        Sign up
      </button>
    </form>
  );
}
