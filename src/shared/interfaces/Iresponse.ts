import { HttpStatusCode } from "../types.environment";

export default interface IResponse {
  code: HttpStatusCode;
  message: string;
  data: any;
  stackError?: any;
}
