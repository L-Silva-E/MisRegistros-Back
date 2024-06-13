export interface StepModel {
  id: number;
  idRecipe: number;
  number: number;
  instruction: string;
}

export interface StepCountModel {
  count: number;
  steps: StepModel[];
}

export interface RecipeStepModel {
  number: number;
  instruction: string;
}
