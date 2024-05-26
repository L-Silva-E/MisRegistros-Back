class RecipeDomain {
  id: number;
  title: string;
  description: string;
  ingredients: string;
  directions: string;

  constructor(recipe: RecipeDomain) {
    this.id = recipe.id;
    this.title = recipe.title;
    this.description = recipe.description;
    this.ingredients = recipe.ingredients;
    this.directions = recipe.directions;
  }

  public toJSON() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      ingredients: this.ingredients,
      directions: this.directions,
    };
  }
}

export default RecipeDomain;
