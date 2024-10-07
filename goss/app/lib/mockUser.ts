import { UUID } from 'crypto';

export interface User {
  user_id: string;
  username: string;
  badge: string;
  profile_img: string;
  bio: string;
  created_at: Date;
  updated_at: Date;
  display_name: string;
  email: string;
  phone: number;

}

export const mockUser: User = {
  user_id: 'ae12',
  username: 'MockyBoy',
  badge: 'badge',
  profile_img: '/dogface.jpg',
  bio: '',
  created_at: new Date,
  updated_at: new Date,
  display_name: 'MockyMan',
  email: 'mocker@mock.com',
  phone: 7888888
}