'use client';

import { useSessionContext } from '@/app/context/SessionContext';

export default function TestQuery() {
  const { data: session, isLoading, error } = useSessionContext();
  const user = session?.profile;

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!session) return <div>Not logged in</div>;

  console.log(session);

  return (
    <div className="min-h-screen w-full">
      {/* <img
        src={
          session.profile.profile_img || '/placeholder.svg?height=40&width=40'
        }
        alt={session.profile.username}
        className="h-10 w-10 rounded-full"
      /> */}
      <span className="font-semibold">{user.username}</span>
      <img src={user.profile_img} />
    </div>
  );
}
