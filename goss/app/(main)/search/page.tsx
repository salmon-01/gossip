'use client';

import { useQuery } from '@tanstack/react-query';

export default function TestQuery() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['test'],
    queryFn: async () => {
      return ['Hello', 'World'];
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error fetching data.</div>;
  }

  return (
    <div>
      <h1>Test Query</h1>
      {data.map((item, index) => (
        <p key={index}>{item}</p>
      ))}
    </div>
  );
}
