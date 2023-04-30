export interface Course {
  courseId: number;
  name: string;
}

export interface Accommodation {
  accommId: number;
  name: string;
  latitude: number;
  longitude: number;
}

export interface RecommendedUser {
  userId: number;
  name: string;
  profilePicture: string;
  course: Course;
  accommodation: Accommodation;
  mutualConnections: { userId: number; profilePicture: string }[];
  similarityScore: number;
}

export interface Portfolio {
  name: string;
  profilePicture: string;
  profileBanner: string;
}

export interface User {
  userId: number;
  email: string;
  admin: boolean;
  privacy: "Public" | "Local" | "Private";
  name: string;
  profilePicture: string;
  profileBanner: string;
  Accommodation: Accommodation;
  Course: Course;
}
