import { IBaseModel } from "../../../shared/interfaces/Ibase.model";

// ~ Base
export interface OriginModel extends IBaseModel {
  name: string;
}

export interface OriginCountModel {
  count: number;
  origins: OriginModel[];
}
