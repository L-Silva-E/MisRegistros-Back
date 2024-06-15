import { IBaseModel } from "../../../shared/interfaces/Ibase.model";

// ~ Base
export interface StepModel extends IBaseModel {
  idRecipe: number;
  number: number;
  instruction: string;
}

export interface StepCountModel {
  count: number;
  steps: StepModel[];
}

// ~ Extra
export interface RecipeStepModel {
  number: number;
  instruction: string;
}
