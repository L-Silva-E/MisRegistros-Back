import { Score } from "../../enums";

const dataRecipes = [
  {
    idCategory: 2,
    idOrigin: 15,
    name: "Fideos con salsa de tomate",
    description: "Fideos con salsa de tomate y carne",
    score: Score.EXCELLENT,
    ingredients: [
      {
        id: 1,
        quantity: 3,
      },
      {
        id: 2,
        quantity: 1,
      },
      {
        id: 4,
        quantity: 3,
      },
      {
        id: 6,
        quantity: 20,
      },
      {
        id: 7,
        quantity: 5,
      },
      {
        id: 12,
        quantity: 1,
      },
      {
        id: 14,
        quantity: 300,
      },
      {
        id: 20,
        quantity: 250,
      },
    ],
    steps: [
      {
        number: 1,
        instruction:
          "Picar cebolla y zanahoria, para luego sofreír en aceite caliente.",
      },
      {
        number: 2,
        instruction: "Agregar la carne picada y cocinar hasta dorar.",
      },
      {
        number: 3,
        instruction: "Incorporar los tomates y cocinar a fuego lento.",
      },
      {
        number: 4,
        instruction: "Cocinar los fideos en agua hirviendo con sal.",
      },
      {
        number: 5,
        instruction: "Servir los fideos con la salsa de tomate.",
      },
    ],
  },
  {
    name: "Ensalada de atún",
    description: "Ensalada de atún con lechuga y huevo",
    idCategory: 2,
    idOrigin: 10,
    score: Score.GOOD,
    ingredients: [
      {
        id: 10,
        quantity: 2,
      },
      {
        id: 11,
        quantity: 1,
      },
      {
        id: 12,
        quantity: 150,
      },
      {
        id: 14,
        quantity: 1,
      },
      {
        id: 3,
        quantity: 1,
      },
    ],
    steps: [
      {
        number: 1,
        instruction: "Cocinar los huevos en agua hirviendo.",
      },
      {
        number: 2,
        instruction: "Cortar la lechuga, el pepino y el pimentón en trozos.",
      },
      {
        number: 3,
        instruction: "Mezclar los ingredientes en un bol.",
      },
      {
        number: 4,
        instruction: "Servir la ensalada con el atún y los huevos.",
      },
    ],
  },
  {
    name: "Arroz con pollo",
    description: "Arroz con pollo y verduras",
    idCategory: 2,
    idOrigin: 15,
    score: Score.GREAT,
    ingredients: [
      {
        id: 2,
        quantity: 1,
      },
      {
        id: 13,
        quantity: 1,
      },
      {
        id: 18,
        quantity: 200,
      },
      {
        id: 19,
        quantity: 250,
      },
    ],
    steps: [
      {
        number: 1,
        instruction:
          "Picar cebolla y zanahoria, para luego sofreír en aceite caliente.",
      },
      {
        number: 2,
        instruction: "Agregar el pollo y cocinar hasta dorar.",
      },
      {
        number: 3,
        instruction: "Incorporar el arroz y cocinar a fuego lento.",
      },
      {
        number: 4,
        instruction: "Agregar agua y cocinar hasta que el arroz esté listo.",
      },
      {
        number: 5,
        instruction: "Servir el arroz con el pollo y las verduras.",
      },
    ],
  },
];

export default dataRecipes;
