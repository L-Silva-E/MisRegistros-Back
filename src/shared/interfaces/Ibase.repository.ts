import IResponse from "./Iresponse";

export default interface IBaseRepository {
  create: (data: any) => Promise<IResponse>;
  get: (params: any) => Promise<IResponse>;
  patch: (id: number, data: any) => Promise<IResponse>;
  delete: (id: number) => Promise<IResponse>;
}
