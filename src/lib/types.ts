export type ApiSuccess<T> = {
  success: boolean;
  data: T;
  message?: string;
  errors?: Record<string, string>;
};

export type Media = {
  id: string;
  filename?: string;
  originalName?: string;
  mimeType?: string;
  publicUrl?: string | null;
};

export type EducationRecord = {
  institution: string;
  credential?: string | null;
  start?: string | null;
  end?: string | null;
  detail?: string | null;
  location?: string | null;
};

export type AchievementRecord = {
  title: string;
  detail?: string | null;
  project?: string | null;
};

export type StrengthRecord = {
  title: string;
  detail?: string | null;
};

export type VolunteerRecord = {
  role: string;
  organization: string;
  start?: string | null;
  end?: string | null;
  detail?: string | null;
};

export type ProfileData = {
  education?: EducationRecord[];
  achievements?: AchievementRecord[];
  strengths?: StrengthRecord[];
  volunteering?: VolunteerRecord[];
};

export type About = {
  id: string;
  headline?: string | null;
  shortBio?: string | null;
  longBio?: string | null;
  profileImageId?: string | null;
  profileImage?: Media | null;
  location?: string | null;
  email?: string | null;
  phone?: string | null;
  resumeUrl?: string | null;
  socialLinks?: Record<string, string | null> | null;
  profileData?: ProfileData | null;
};

export type Skill = {
  id: string;
  name: string;
  category?: string | null;
  proficiency?: number | null;
  icon?: string | null;
  displayOrder?: number;
  active?: boolean;
};

export type Project = {
  id: string;
  title: string;
  slug: string;
  shortDescription?: string | null;
  description?: string | null;
  featured?: boolean;
  published?: boolean;
  projectUrl?: string | null;
  githubUrl?: string | null;
  stack?: string[];
  coverImage?: Media | null;
  displayOrder?: number;
  createdAt?: string;
  updatedAt?: string;
};

export type Blog = {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  content: string;
  coverImage?: Media | null;
  published?: boolean;
  publishedAt?: string | null;
  createdAt?: string;
};

export type Experience = {
  id: string;
  company: string;
  role: string;
  location?: string | null;
  employmentType?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  current?: boolean;
  description?: string | null;
  displayOrder?: number;
};

export type Testimonial = {
  id: string;
  name: string;
  role?: string | null;
  company?: string | null;
  content: string;
  avatarImage?: Media | null;
  published?: boolean;
  displayOrder?: number;
};

export type Service = {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  icon?: string | null;
  displayOrder?: number;
  active?: boolean;
};

export type HomeContent = {
  about: About | null;
  skills: Skill[];
  projects: Project[];
  blogs: Blog[];
  experience: Experience[];
  testimonials: Testimonial[];
  services: Service[];
  failed: string[];
};
