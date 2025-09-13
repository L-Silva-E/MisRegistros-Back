import { assignStepNumbers } from "../utils/recipe.utils";
import { RecipeStepInput } from "../models/recipe.model";

describe("Recipe Utils", () => {
  describe("assignStepNumbers", () => {
    it("should return undefined for empty or undefined steps", () => {
      // Act & Assert
      expect(assignStepNumbers(undefined)).toBeUndefined();
      expect(assignStepNumbers([])).toBeUndefined();
    });

    it("should assign sequential numbers to steps without numbers", () => {
      // Arrange
      const steps: RecipeStepInput[] = [
        { instruction: "First step" },
        { instruction: "Second step" },
        { instruction: "Third step" },
      ];

      // Act
      const result = assignStepNumbers(steps);

      // Assert
      expect(result).toHaveLength(3);
      expect(result![0]).toEqual({ instruction: "First step", number: 1 });
      expect(result![1]).toEqual({ instruction: "Second step", number: 2 });
      expect(result![2]).toEqual({ instruction: "Third step", number: 3 });
    });

    it("should preserve existing valid numbers", () => {
      // Arrange
      const steps: RecipeStepInput[] = [
        { instruction: "First step", number: 1 },
        { instruction: "Third step", number: 3 },
        { instruction: "Second step" },
      ];

      // Act
      const result = assignStepNumbers(steps);

      // Assert
      expect(result).toHaveLength(3);
      // Result should be sorted by number
      expect(result![0]).toEqual({ instruction: "First step", number: 1 });
      expect(result![1]).toEqual({ instruction: "Second step", number: 2 });
      expect(result![2]).toEqual({ instruction: "Third step", number: 3 });
    });

    it("should fill gaps in numbering", () => {
      // Arrange
      const steps: RecipeStepInput[] = [
        { instruction: "First step", number: 1 },
        { instruction: "Fourth step", number: 4 },
        { instruction: "Missing step 2" },
        { instruction: "Missing step 3" },
      ];

      // Act
      const result = assignStepNumbers(steps);

      // Assert
      expect(result).toHaveLength(4);
      expect(result![0]).toEqual({ instruction: "First step", number: 1 });
      expect(result![1]).toEqual({ instruction: "Missing step 2", number: 2 });
      expect(result![2]).toEqual({ instruction: "Missing step 3", number: 3 });
      expect(result![3]).toEqual({ instruction: "Fourth step", number: 4 });
    });

    it("should ignore invalid numbers (zero or negative)", () => {
      // Arrange
      const steps: RecipeStepInput[] = [
        { instruction: "First step", number: 0 }, // Invalid
        { instruction: "Second step", number: -1 }, // Invalid
        { instruction: "Third step", number: 2 }, // Valid
        { instruction: "Fourth step" }, // No number
      ];

      // Act
      const result = assignStepNumbers(steps);

      // Assert
      expect(result).toHaveLength(4);
      expect(result![0]).toEqual({ instruction: "First step", number: 1 });
      expect(result![1]).toEqual({ instruction: "Third step", number: 2 });
      expect(result![2]).toEqual({ instruction: "Second step", number: 3 });
      expect(result![3]).toEqual({ instruction: "Fourth step", number: 4 });
    });

    it("should handle null numbers", () => {
      // Arrange
      const steps: RecipeStepInput[] = [
        { instruction: "First step", number: null as any },
        { instruction: "Second step", number: 1 },
        { instruction: "Third step" },
      ];

      // Act
      const result = assignStepNumbers(steps);

      // Assert
      expect(result).toHaveLength(3);
      expect(result![0]).toEqual({ instruction: "Second step", number: 1 });
      expect(result![1]).toEqual({ instruction: "First step", number: 2 });
      expect(result![2]).toEqual({ instruction: "Third step", number: 3 });
    });

    it("should handle duplicate numbers by keeping both", () => {
      // Arrange
      const steps: RecipeStepInput[] = [
        { instruction: "First step", number: 1 },
        { instruction: "Duplicate number", number: 1 }, // Will also get number 1
        { instruction: "Third step", number: 3 },
      ];

      // Act
      const result = assignStepNumbers(steps);

      // Assert
      expect(result).toHaveLength(3);
      // Both steps with number 1 will be kept, and when sorted, both will have number 1
      expect(result![0]).toEqual({ instruction: "First step", number: 1 });
      expect(result![1]).toEqual({
        instruction: "Duplicate number",
        number: 1,
      });
      expect(result![2]).toEqual({ instruction: "Third step", number: 3 });
    });

    it("should handle large numbers correctly", () => {
      // Arrange
      const steps: RecipeStepInput[] = [
        { instruction: "First step", number: 100 },
        { instruction: "Second step" },
        { instruction: "Third step" },
      ];

      // Act
      const result = assignStepNumbers(steps);

      // Assert
      expect(result).toHaveLength(3);
      expect(result![0]).toEqual({ instruction: "Second step", number: 1 });
      expect(result![1]).toEqual({ instruction: "Third step", number: 2 });
      expect(result![2]).toEqual({ instruction: "First step", number: 100 });
    });

    it("should handle mixed valid and invalid numbers", () => {
      // Arrange
      const steps: RecipeStepInput[] = [
        { instruction: "Valid number", number: 5 },
        { instruction: "Invalid zero", number: 0 },
        { instruction: "Invalid negative", number: -5 },
        { instruction: "Another valid", number: 2 },
        { instruction: "No number" },
        { instruction: "Invalid null", number: null as any },
      ];

      // Act
      const result = assignStepNumbers(steps);

      // Assert
      expect(result).toHaveLength(6);
      expect(result![0]).toEqual({ instruction: "Invalid zero", number: 1 });
      expect(result![1]).toEqual({ instruction: "Another valid", number: 2 });
      expect(result![2]).toEqual({
        instruction: "Invalid negative",
        number: 3,
      });
      expect(result![3]).toEqual({ instruction: "No number", number: 4 });
      expect(result![4]).toEqual({ instruction: "Valid number", number: 5 });
      expect(result![5]).toEqual({ instruction: "Invalid null", number: 6 });
    });

    it("should sort result by step number", () => {
      // Arrange
      const steps: RecipeStepInput[] = [
        { instruction: "Step 10", number: 10 },
        { instruction: "Step 1", number: 1 },
        { instruction: "Step 5", number: 5 },
        { instruction: "Step without number" },
      ];

      // Act
      const result = assignStepNumbers(steps);

      // Assert
      expect(result).toHaveLength(4);
      expect(result![0].number).toBe(1);
      expect(result![1].number).toBe(2);
      expect(result![2].number).toBe(5);
      expect(result![3].number).toBe(10);
    });
  });
});
