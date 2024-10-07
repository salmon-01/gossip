import React from 'react'
import ProfileHeader from './ProfileHeader'
import ProfileStats from './ProfileStats'
import ProfileContent from './ProfileContent'
import ProfileNav from './profileNav'

const profileData = {
  user: {
    username: 'john_doe',
    displayName: 'John Doe',
    bio: 'Just a regular guy who loves podcasts and sharing thoughts through voice notes.',
    profileImage: 'https://example.com/images/john_doe.jpg',
    location: 'San Francisco, CA',
    website: 'https://johndoe.com',
    followersCount: 120,
    followingCount: 75,
    postsCount: 45,
  },
  voiceNotes: [
    {
      id: 'vn1',
      title: 'Morning Thoughts',
      audioUrl: 'https://example.com/audio/morning_thoughts.mp3',
      createdAt: '2024-10-01T08:30:00Z',
      likes: 15,
      repliesCount: 2,
    },
    {
      id: 'vn2',
      title: 'Weekend Plans',
      audioUrl: 'https://example.com/audio/weekend_plans.mp3',
      createdAt: '2024-10-02T10:00:00Z',
      likes: 20,
      repliesCount: 5,
    },
  ],
};

const anotherProfileData = {
  user: {
    username: 'jane_smith',
    displayName: 'Jane Smith',
    bio: 'Tech enthusiast and aspiring voice-over artist. Let’s connect!',
    profileImage: 'https://example.com/images/jane_smith.jpg',
    location: 'New York, NY',
    website: 'https://janesmith.com',
    followersCount: 300,
    followingCount: 150,
    postsCount: 80,
  },
  voiceNotes: [
    {
      id: 'vn3',
      title: 'Tech Trends 2024',
      audioUrl: 'https://example.com/audio/tech_trends_2024.mp3',
      createdAt: '2024-10-03T14:00:00Z',
      likes: 50,
      repliesCount: 10,
    },
    {
      id: 'vn4',
      title: 'Voice Acting Tips',
      audioUrl: 'https://example.com/audio/voice_acting_tips.mp3',
      createdAt: '2024-10-04T16:00:00Z',
      likes: 30,
      repliesCount: 7,
    },
  ],
};

export default function page({params}) {

  const {username} = params

  // fetch data ased on username
//const profileData = getProfileData(username);
const loggedInUser = 'john_doe';

const profileDataToUse = username ===loggedInUser? profileData : anotherProfileData;
  return (
    <>
      <ProfileHeader user={profileDataToUse.user} loggedInUser={loggedInUser} />
      <ProfileStats user={profileDataToUse.user} />
  
      <ProfileContent voiceNotes={profileDataToUse.voiceNotes} user={profileDataToUse.user} />
    </>
  )
}
