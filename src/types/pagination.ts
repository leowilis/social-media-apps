/** Pagination metadata returned by paginated API endpoints. */
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// Generic wrapper for paginated API responses
export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}
