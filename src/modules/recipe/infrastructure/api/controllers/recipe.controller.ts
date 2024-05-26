import RecipeDomain from "../../../domain/recipe.domain";
import RecipeApplication from "../../../application/recipe.application";
import IResponse from "../../../../../shared/interface/Iresponse";

export default class RecipeController {
  private RecipeApplication: RecipeApplication;

  constructor(RecipeApplication: RecipeApplication) {
    this.RecipeApplication = RecipeApplication;
  }

  public async create(recipe: RecipeDomain): Promise<IResponse> {
    try {
      return await this.RecipeApplication.create(recipe);
    } catch (error: any) {
      return error;
    }
  }

  public async get(params: any): Promise<IResponse> {
    try {
      return await this.RecipeApplication.get(params);
    } catch (error: any) {
      return error;
    }
  }

  public async patch(id: number, recipe: RecipeDomain): Promise<IResponse> {
    try {
      return await this.RecipeApplication.patch(id, recipe);
    } catch (error: any) {
      return error;
    }
  }

  public async delete(id: number): Promise<IResponse> {
    try {
      return await this.RecipeApplication.delete(id);
    } catch (error: any) {
      return error;
    }
  }
}
