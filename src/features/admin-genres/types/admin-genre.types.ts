export interface AdminGenreDto {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  isActive?: boolean;
  storyCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateGenreRequestDto {
  name: string;
  slug?: string;
  description?: string;
  isActive?: boolean;
}

export interface UpdateGenreRequestDto {
  name?: string;
  slug?: string;
  description?: string;
  isActive?: boolean;
}
