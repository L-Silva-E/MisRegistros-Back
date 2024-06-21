import StepService from "../services/step.service";
let stepService: StepService;

import {
  Context,
  MockContext,
  createMockContext,
} from "../../../shared/jest/context";

let mockCtx: MockContext;
let ctx: Context;
const currentDate = new Date();

beforeEach(() => {
  mockCtx = createMockContext();
  ctx = mockCtx as unknown as Context;
  stepService = new StepService();
});

test("Create - Step", async () => {
  const step = {
    id: 1,
    idRecipe: 1,
    number: 1,
    instruction: "Do this",
    createdAt: currentDate,
    updatedAt: currentDate,
  };
  mockCtx.prisma.step.create.mockResolvedValue(step);

  await expect(stepService.create(step, ctx)).resolves.toEqual({
    id: 1,
    idRecipe: 1,
    number: 1,
    instruction: "Do this",
    createdAt: currentDate,
    updatedAt: currentDate,
  });
});

test("Get - Step", async () => {
  const query = {
    where: { idRecipe: 1 },
  };
  const steps = [
    {
      id: 1,
      idRecipe: 1,
      number: 1,
      instruction: "Do this",
      createdAt: currentDate,
      updatedAt: currentDate,
    },
  ];
  const count = 1;
  mockCtx.prisma.$transaction.mockResolvedValue([steps, count]);

  await expect(stepService.get(query, ctx)).resolves.toEqual({
    count: 1,
    steps: [
      {
        id: 1,
        idRecipe: 1,
        number: 1,
        instruction: "Do this",
        createdAt: currentDate,
        updatedAt: currentDate,
      },
    ],
  });
});

test("Patch - Step", async () => {
  const step = {
    id: 1,
    idRecipe: 1,
    number: 1,
    instruction: "Do this",
    createdAt: currentDate,
    updatedAt: currentDate,
  };
  mockCtx.prisma.step.update.mockResolvedValue(step);

  await expect(stepService.patch(1, step, ctx)).resolves.toEqual({
    id: 1,
    idRecipe: 1,
    number: 1,
    instruction: "Do this",
    createdAt: currentDate,
    updatedAt: currentDate,
  });
});

test("Delete - Step", async () => {
  const step = {
    id: 1,
    idRecipe: 1,
    number: 1,
    instruction: "Do this",
    createdAt: currentDate,
    updatedAt: currentDate,
  };
  mockCtx.prisma.step.delete.mockResolvedValue(step);

  await expect(stepService.delete(1, ctx)).resolves.toEqual({
    id: 1,
    idRecipe: 1,
    number: 1,
    instruction: "Do this",
    createdAt: currentDate,
    updatedAt: currentDate,
  });
});
