'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { createClient } from '../../utils/supabase/server';

export async function login(formData: FormData) {
  const supabase = createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    redirect('/error');
  }

  revalidatePath('/', 'layout');
  redirect('/home');
}

export async function signup(formData: FormData) {
  const supabase = createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  const { error } = await supabase.auth.signUp(data);

  console.log(error);

  if (error) {
    redirect('/error');
  }

  revalidatePath('/', 'layout');
  redirect('/home');
}

export async function signOut() {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect('/login');
}

export async function populateUser(formData: FormData) {
  const supabase = createClient();

  const profile_img = formData.get('profile_img') as string;
  const username = formData.get('username') as string;
  const display_name = formData.get('display_name') as string;
  const badge = formData.get('badge') as string;
  const bio = formData.get('bio') as string;

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error('Error fetching user:', userError);
    redirect('/error');
  }

  const userId = user.id;

  const { error: profileError } = await supabase.from('profiles').upsert({
    user_id: userId,
    display_name,
    username,
    profile_img,
    badge,
    bio,
  });

  if (profileError) {
    console.error('Error inserting/updating profile data:', profileError);
    redirect('/error');
  }

  revalidatePath('/');
  redirect('/home');
}

export async function createPost(formData: FormData) {
  const supabase = createClient();
  const caption = formData.get('caption') as string;

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error('Error fetching user:', userError);
    redirect('/error');
  }

  const userId = user.id;

  const { error: postError } = await supabase.from('posts').upsert({
    user_id: userId,
    caption,
  });

  if (postError) {
    console.error('Error creating post:', postError);
    redirect('/error');
  }

  revalidatePath('/');
  redirect('/home');
}
