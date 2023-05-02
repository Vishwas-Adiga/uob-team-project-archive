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
  course?: Course;
  accommodation?: Accommodation;
  mutualConnections: number[];
  similarityScore: number;
}

export interface Portfolio {
  userId: number;
  name: string;
  profilePicture: string;
  profileBanner: string;
  privacy: "Public" | "Local" | "Private";
  ownPortfolio: boolean;
  Accommodation?: Accommodation;
  Course?: Course;
}

export interface User extends Portfolio {
  email: string;
  admin: boolean;
}
