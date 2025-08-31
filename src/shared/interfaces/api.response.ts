export interface CollectionResponse<T> {
  count: number;
  data: T[];
}

export interface ItemResponse<T> {
  data: T;
}

export interface DeleteResponse {
  deleted: boolean;
  id: number;
}

//~ For errors (keep minimal structure)
export interface ErrorResponse {
  error: string;
  details?: string;
  validation?: Array<{
    path: string;
    code: string;
    expected?: any;
    received?: any;
    message: string;
  }>;
}

//~ For internal error handling with HTTP codes
export interface ErrorWithCode {
  code: number;
  response: ErrorResponse;
}
