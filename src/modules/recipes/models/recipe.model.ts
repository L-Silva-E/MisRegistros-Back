export default interface RecipeModel {
  id: number;
  title: string;
  description?: string | null;
  ingredients: string;
  directions: string;
}
