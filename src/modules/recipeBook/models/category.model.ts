import { IBaseModel } from "../../../shared/interfaces/Ibase.model";

// ~ Base
export interface CategoryModel extends IBaseModel {
  name: string;
}

export interface CategoryCountModel {
  count: number;
  categories: CategoryModel[];
}
