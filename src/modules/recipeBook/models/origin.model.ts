import { BaseEntity } from "../../../shared/interfaces/base.entity";

// ~ Base
export interface OriginModel extends BaseEntity {
  name: string;
}

export interface OriginCountModel {
  count: number;
  origins: OriginModel[];
}
