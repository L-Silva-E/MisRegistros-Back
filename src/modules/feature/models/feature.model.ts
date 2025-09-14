import { BaseEntity } from "../../../shared/interfaces/base.entity";

//~ Base
export interface FeatureModel extends BaseEntity {
  name: string;
  description: string;
  isActive: boolean;
}

export interface FeatureCountModel {
  count: number;
  features: FeatureModel[];
}
