import React from 'react';

export default function ProfilePost() {
  return <div>Profile Post</div>;
}

// const fetchUserPosts = async (user_id) => {
//   const supabase = createClient();
//   const { data, error } = await supabase
//     .from('posts')
//     .select('*')
//     .eq('user_id', user_id)
//     .single();

//   if (error) throw error;
//   return data;
// };

//     // Query for posts by the logged-in user
//     const {
//       data: postsData,
//       isLoading: isLoadingPosts,
//       error: postsError,
//     } = useQuery({
//       queryKey: ['posts', session?.profile.user_id],
//       queryFn: () => fetchUserPosts(session?.profile.user_id),
//       enabled: !!profileData?.user_id, // Only run query if user_id is available
//     });
// console.log(postsData)
//   // Loading states
//   if (isLoadingUser || isLoadingProfile) {
//     return <div>Loading...</div>;
//   }

// if (postsError) {
//   return <div>Error loading posts: {postsError.message}</div>;
// }
