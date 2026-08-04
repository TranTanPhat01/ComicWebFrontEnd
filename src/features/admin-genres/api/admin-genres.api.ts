import { browserDelete, browserGet, browserPost, browserPut } from "@/lib/api/browser-api-client";
import { API_ROUTES } from "@/constants/api-routes";
import type { ApiResponse } from "@/lib/api/api-response";
import type { AdminGenreDto, CreateGenreRequestDto, UpdateGenreRequestDto } from "../types/admin-genre.types";

export async function getAdminGenres(accessToken?: string): Promise<ApiResponse<AdminGenreDto[]>> {
  return browserGet(API_ROUTES.admin.genres.list, undefined, { accessToken });
}

export async function createAdminGenre(
  payload: CreateGenreRequestDto,
  accessToken?: string
): Promise<ApiResponse<AdminGenreDto>> {
  return browserPost(API_ROUTES.admin.genres.create, payload, { accessToken });
}

export async function updateAdminGenre(
  genreId: number,
  payload: UpdateGenreRequestDto,
  accessToken?: string
): Promise<ApiResponse<AdminGenreDto>> {
  return browserPut(API_ROUTES.admin.genres.update(genreId), payload, { accessToken });
}

export async function deleteAdminGenre(
  genreId: number,
  accessToken?: string
): Promise<ApiResponse<void>> {
  return browserDelete(API_ROUTES.admin.genres.delete(genreId), { accessToken });
}
