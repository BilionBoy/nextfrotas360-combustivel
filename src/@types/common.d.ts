export interface Pagy {
  current_page: number;
  total_pages: number;
  total_count: number;
  per_page: number;
}

export interface PaginatedResponse<T> {
  pagy: Pagy;
  items: T[];
}
