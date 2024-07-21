import { IBaseModel } from "../../../shared/interfaces/Ibase.model";

// ~ Base
export interface FeatureModel extends IBaseModel {
  name: string;
  description: string;
  isActive: boolean;
}

export interface FeatureCountModel {
  count: number;
  features: FeatureModel[];
}
