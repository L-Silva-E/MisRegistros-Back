import { BaseEntity } from "../../../shared/interfaces/base.entity";

//~ Base
export interface StepModel extends BaseEntity {
  idRecipe: number;
  number: number;
  instruction: string;
}

export interface StepCountModel {
  count: number;
  steps: StepModel[];
}
