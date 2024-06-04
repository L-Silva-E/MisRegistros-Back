import { HttpStatusCode } from "../types.environment";

export default interface IResponse {
  code: HttpStatusCode;
  message: string;
  count?: number;
  data: any;
  stackError?: any;
}
