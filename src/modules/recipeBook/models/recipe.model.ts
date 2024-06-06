export interface RecipeModel {
  id: number;
  name: string;
  description: string;
  score: number;
}

export interface RecipeCountModel {
  count: number;
  recipes: RecipeModel[];
}
