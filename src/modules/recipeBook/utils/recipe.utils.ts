import { RecipeStepInput, RecipeStepModel } from "../models/recipe.model";

export function assignStepNumbers(
  steps?: RecipeStepInput[]
): RecipeStepModel[] | undefined {
  if (!steps || steps.length === 0) {
    return undefined;
  }

  const usedNumbers = new Set<number>();
  let nextAvailableNumber = 1;

  // First pass: collect all explicitly provided numbers
  steps.forEach((step) => {
    if (step.number !== undefined && step.number !== null && step.number > 0) {
      usedNumbers.add(step.number);
    }
  });

  // Second pass: assign numbers, respecting existing ones
  const stepsWithNumbers = steps.map((step): RecipeStepModel => {
    if (step.number !== undefined && step.number !== null && step.number > 0) {
      // Keep the existing number if it's valid
      return { ...step, number: step.number };
    } else {
      // Find the next available number
      while (usedNumbers.has(nextAvailableNumber)) {
        nextAvailableNumber++;
      }
      usedNumbers.add(nextAvailableNumber);
      return { ...step, number: nextAvailableNumber++ };
    }
  });

  return stepsWithNumbers.sort((a, b) => a.number - b.number);
}
