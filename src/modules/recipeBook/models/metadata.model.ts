export interface MetadataItemWithUsage {
  id: number;
  name: string;
  usageCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IngredientWithUsage extends MetadataItemWithUsage {
  unit: string;
}

export interface CategoryWithUsage extends MetadataItemWithUsage {}

export interface OriginWithUsage extends MetadataItemWithUsage {}

export interface MetadataWithUsageResponse {
  ingredients: IngredientWithUsage[];
  categories: CategoryWithUsage[];
  origins: OriginWithUsage[];
}
