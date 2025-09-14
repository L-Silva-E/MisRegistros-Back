import { BaseEntity } from "../../../shared/interfaces/base.entity";

//~ Base
export interface CategoryModel extends BaseEntity {
  name: string;
}

export interface CategoryCountModel {
  count: number;
  categories: CategoryModel[];
}
