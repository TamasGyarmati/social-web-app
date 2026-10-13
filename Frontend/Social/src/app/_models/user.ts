export interface User {
  id: string;
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  avatarUrl: string | null;
  followerCount: number;
  followingCount: number;
  followerUsernames: string[];
  followingUsernames: string[];
  isFollowing: boolean;
}
