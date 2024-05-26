import RecipeDomain from "../domain/recipe.domain";
import IBaseRepository from "../../../shared/interface/Ibase.repository";

export default class RecipeApplication {
  private repository: IBaseRepository;
  constructor(repository: IBaseRepository) {
    this.repository = repository;
  }

  public async create(recipe: RecipeDomain) {
    return this.repository.create(recipe);
  }

  public async get(params: any) {
    return this.repository.get(params);
  }

  public async patch(id: number, recipe: RecipeDomain) {
    return this.repository.patch(id, recipe);
  }

  public async delete(id: number) {
    return this.repository.delete(id);
  }
}
