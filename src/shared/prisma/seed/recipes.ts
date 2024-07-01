import { Score } from "../../enums";

const dataRecipes = [
  {
    idCategory: 2,
    idOrigin: 15,
    name: "Fideos con salsa de tomate",
    description: "Fideos con salsa de tomate y carne",
    score: Score.EXCELLENT,
    thumbnail:
      "https://locosxlaparrilla.com/wp-content/uploads/2015/02/Receta-recetas-locos-x-la-parrilla-locosxlaparrilla-espaguetis-a-la-bolo%C3%B1esa-receta-espaguetis-receta-espaguetis-a-la-bolo%C3%B1esa-espaguetis-3.jpg",
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
    thumbnail: "https://i.ytimg.com/vi/zl6HSCJ6JeE/maxresdefault.jpg",
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
    thumbnail:
      "https://myplate-prod.azureedge.us/sites/default/files/styles/recipe_525_x_350_/public/2021-01/MeetingYourMyPlateGoalsOnABudget_0_Page_26_0.jpg?itok=z88eO-eY",
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
  {
    name: "Tarta de manzana",
    description: "Tarta de manzana con canela",
    idCategory: 3,
    idOrigin: 10,
    score: Score.GOOD,
    thumbnail:
      "https://img-global.cpcdn.com/recipes/b58f260e56bd4a11/680x482cq70/tarta-de-manzana-con-canela-en-licuadora-bolo-de-maca-com-casca-e-pedacos-foto-principal.jpg",
    ingredients: [
      {
        id: 1,
        quantity: 1,
      },
      {
        id: 3,
        quantity: 1,
      },
      {
        id: 4,
        quantity: 1,
      },
      {
        id: 5,
        quantity: 1,
      },
      {
        id: 6,
        quantity: 50,
      },
      {
        id: 7,
        quantity: 50,
      },
      {
        id: 8,
        quantity: 100,
      },
      {
        id: 9,
        quantity: 50,
      },
      {
        id: 15,
        quantity: 1,
      },
    ],
    steps: [
      {
        number: 1,
        instruction:
          "Pelar y cortar las manzanas en rodajas, para luego cocinarlas con azúcar y canela.",
      },
      {
        number: 2,
        instruction: "Mezclar la harina, la manteca y el azúcar.",
      },
      {
        number: 3,
        instruction: "Forrar un molde con la masa y cocinar en horno.",
      },
      {
        number: 4,
        instruction: "Agregar las manzanas cocidas y cocinar hasta dorar.",
      },
    ],
  },
  {
    name: "Sopa de verduras",
    description: "Sopa de verduras con fideos",
    idCategory: 1,
    idOrigin: 15,
    score: Score.GOOD,
    thumbnail:
      "https://imag.bonviveur.com/sopa-de-fideos-con-verduras-en-el-plato.jpg",
    ingredients: [
      {
        id: 1,
        quantity: 1,
      },
      {
        id: 2,
        quantity: 1,
      },
      {
        id: 3,
        quantity: 1,
      },
      {
        id: 4,
        quantity: 1,
      },
      {
        id: 5,
        quantity: 1,
      },
      {
        id: 6,
        quantity: 50,
      },
      {
        id: 7,
        quantity: 50,
      },
      {
        id: 8,
        quantity: 100,
      },
      {
        id: 9,
        quantity: 50,
      },
      {
        id: 16,
        quantity: 1,
      },
    ],
    steps: [
      {
        number: 1,
        instruction:
          "Picar cebolla, zanahoria, puerro y apio, para luego sofreír en aceite caliente.",
      },
      {
        number: 2,
        instruction: "Agregar agua y cocinar a fuego lento.",
      },
      {
        number: 3,
        instruction: "Incorporar los fideos y cocinar hasta que estén listos.",
      },
      {
        number: 4,
        instruction: "Servir la sopa caliente.",
      },
    ],
  },
  {
    name: "Tarta de espinaca",
    description: "Tarta de espinaca con queso",
    idCategory: 3,
    idOrigin: 15,
    score: Score.GOOD,
    thumbnail:
      "https://www.paulinacocina.net/wp-content/uploads/2015/08/1-P1090553.jpg",
    ingredients: [
      {
        id: 1,
        quantity: 1,
      },
      {
        id: 3,
        quantity: 1,
      },
      {
        id: 4,
        quantity: 1,
      },
      {
        id: 5,
        quantity: 1,
      },
      {
        id: 6,
        quantity: 50,
      },
      {
        id: 7,
        quantity: 50,
      },
      {
        id: 8,
        quantity: 100,
      },
      {
        id: 9,
        quantity: 50,
      },
      {
        id: 17,
        quantity: 1,
      },
    ],
    steps: [
      {
        number: 1,
        instruction:
          "Picar cebolla y espinaca, para luego sofreír en aceite caliente.",
      },
      {
        number: 2,
        instruction: "Mezclar la harina, la manteca y el agua.",
      },
      {
        number: 3,
        instruction: "Forrar un molde con la masa y cocinar en horno.",
      },
      {
        number: 4,
        instruction: "Agregar las espinacas cocidas y cocinar hasta dorar.",
      },
    ],
  },
  {
    name: "Sopa de lentejas",
    description: "Sopa de lentejas con panceta",
    idCategory: 1,
    idOrigin: 15,
    score: Score.GOOD,
    thumbnail: "https://i.ytimg.com/vi/Q3GXmHJCcgg/maxresdefault.jpg",
    ingredients: [
      {
        id: 1,
        quantity: 1,
      },
      {
        id: 2,
        quantity: 1,
      },
      {
        id: 3,
        quantity: 1,
      },
      {
        id: 4,
        quantity: 1,
      },
      {
        id: 5,
        quantity: 1,
      },
      {
        id: 6,
        quantity: 50,
      },
      {
        id: 7,
        quantity: 50,
      },
      {
        id: 8,
        quantity: 100,
      },
      {
        id: 9,
        quantity: 50,
      },
      {
        id: 21,
        quantity: 1,
      },
    ],
    steps: [
      {
        number: 1,
        instruction:
          "Picar cebolla, zanahoria, puerro y apio, para luego sofreír en aceite caliente.",
      },
      {
        number: 2,
        instruction: "Agregar agua y cocinar a fuego lento.",
      },
      {
        number: 3,
        instruction:
          "Incorporar las lentejas y cocinar hasta que estén listas.",
      },
      {
        number: 4,
        instruction: "Servir la sopa caliente con panceta.",
      },
    ],
  },
  {
    name: "Tarta de zapallitos",
    description: "Tarta de zapallitos con queso",
    idCategory: 3,
    idOrigin: 15,
    score: Score.GOOD,
    thumbnail:
      "https://resizer.glanacion.com/resizer/v2/tarta-o-pastel-de-zapallitos-K4YSGZEASZEDRC26ACGGG3EZO4.jpeg?auth=8a91c6faf71a742520bc81181db76d90e30c540d32d55fb3f1a31ad214b2f06c&width=768&height=512&quality=70&smart=true",
    ingredients: [
      {
        id: 1,
        quantity: 1,
      },
      {
        id: 3,
        quantity: 1,
      },
      {
        id: 4,
        quantity: 1,
      },
      {
        id: 5,
        quantity: 1,
      },
      {
        id: 6,
        quantity: 50,
      },
      {
        id: 7,
        quantity: 50,
      },
      {
        id: 8,
        quantity: 100,
      },
      {
        id: 9,
        quantity: 50,
      },
      {
        id: 22,
        quantity: 1,
      },
    ],
    steps: [
      {
        number: 1,
        instruction:
          "Picar cebolla y zapallitos, para luego sofreír en aceite caliente.",
      },
      {
        number: 2,
        instruction: "Mezclar la harina, la manteca y el agua.",
      },
      {
        number: 3,
        instruction: "Forrar un molde con la masa y cocinar en horno.",
      },
      {
        number: 4,
        instruction: "Agregar los zapallitos cocidos y cocinar hasta dorar.",
      },
    ],
  },
  {
    name: "Sopa de calabaza",
    description: "Sopa de calabaza con queso",
    idCategory: 1,
    idOrigin: 15,
    score: Score.GOOD,
    thumbnail: "https://i.ytimg.com/vi/SjFVZX2wPe0/maxresdefault.jpg",
    ingredients: [
      {
        id: 1,
        quantity: 1,
      },
      {
        id: 2,
        quantity: 1,
      },
      {
        id: 3,
        quantity: 1,
      },
      {
        id: 4,
        quantity: 1,
      },
      {
        id: 5,
        quantity: 1,
      },
      {
        id: 6,
        quantity: 50,
      },
      {
        id: 7,
        quantity: 50,
      },
      {
        id: 8,
        quantity: 100,
      },
      {
        id: 9,
        quantity: 50,
      },
      {
        id: 23,
        quantity: 1,
      },
    ],
    steps: [
      {
        number: 1,
        instruction:
          "Picar cebolla, zanahoria, puerro y apio, para luego sofreír en aceite caliente.",
      },
      {
        number: 2,
        instruction: "Agregar agua y cocinar a fuego lento.",
      },
      {
        number: 3,
        instruction: "Incorporar la calabaza y cocinar hasta que esté lista.",
      },
      {
        number: 4,
        instruction: "Servir la sopa caliente con queso.",
      },
    ],
  },
  {
    name: "Tarta de choclo",
    description: "Tarta de choclo con queso",
    idCategory: 3,
    idOrigin: 15,
    score: Score.GOOD,
    thumbnail:
      "https://cocinaderestauranteencasa.com/wp-content/uploads/2023/03/TARTA-DE-CHOCLO-C-scaled.jpg",
    ingredients: [
      {
        id: 1,
        quantity: 1,
      },
      {
        id: 3,
        quantity: 1,
      },
      {
        id: 4,
        quantity: 1,
      },
      {
        id: 5,
        quantity: 1,
      },
      {
        id: 6,
        quantity: 50,
      },
      {
        id: 7,
        quantity: 50,
      },
      {
        id: 8,
        quantity: 100,
      },
      {
        id: 9,
        quantity: 50,
      },
    ],
    steps: [
      {
        number: 1,
        instruction:
          "Picar cebolla y choclo, para luego sofreír en aceite caliente.",
      },
      {
        number: 2,
        instruction: "Mezclar la harina, la manteca y el agua.",
      },
      {
        number: 3,
        instruction: "Forrar un molde con la masa y cocinar en horno.",
      },
      {
        number: 4,
        instruction: "Agregar el choclo cocido y cocinar hasta dorar.",
      },
    ],
  },
  {
    name: "Sopa de arvejas",
    description: "Sopa de arvejas con panceta",
    idCategory: 1,
    idOrigin: 15,
    score: Score.GOOD,
    thumbnail:
      "https://www.recetasnestle.com.ar/sites/default/files/srh_recipes/22f58d55aa4622dfabedbed545dff876.jpg",
    ingredients: [
      {
        id: 1,
        quantity: 1,
      },
      {
        id: 2,
        quantity: 1,
      },
      {
        id: 3,
        quantity: 1,
      },
      {
        id: 4,
        quantity: 1,
      },
      {
        id: 5,
        quantity: 1,
      },
      {
        id: 6,
        quantity: 50,
      },
      {
        id: 7,
        quantity: 50,
      },
      {
        id: 8,
        quantity: 100,
      },
      {
        id: 9,
        quantity: 50,
      },
    ],
    steps: [
      {
        number: 1,
        instruction:
          "Picar cebolla, zanahoria, puerro y apio, para luego sofreír en aceite caliente.",
      },
      {
        number: 2,
        instruction: "Agregar agua y cocinar a fuego lento.",
      },
      {
        number: 3,
        instruction: "Incorporar las arvejas y cocinar hasta que estén listas.",
      },
      {
        number: 4,
        instruction: "Servir la sopa caliente con panceta.",
      },
    ],
  },
];

export default dataRecipes;
