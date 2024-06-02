export interface QueryParams {
  from?: string;
  to?: string;
  orderByField?: string;
  orderBy?: "asc" | "desc";
  page?: number;
  limit?: number;
  relations?: { [key: string]: boolean };
  createdAt?: {
    gte?: string;
    lt?: string;
  };
  [key: string]: any;
}
