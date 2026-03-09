export interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  tags: string[];
  link: string;
  github: string;
}

export interface Profile {
  name: string;
  role: string;
  bio: string;
  email: string;
  location: string;
  avatar: string;
}

export interface Skill {
  id: number;
  name: string;
  category: string;
  level: number;
}
