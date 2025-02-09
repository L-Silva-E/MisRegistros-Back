import { Score } from "../../../enums";

const dataRecipes = [
  {
    name: "Fideos con salsa de tomate",
    description:
      "Fideos con salsa de tomate y carne, una deliciosa combinación de fideos N°77 acompañados de una salsa casera preparada con cebolla, zanahoria, carne molida y tomate. La carne se cocina lentamente junto con las verduras, creando una salsa robusta que realza el sabor de los fideos al dente. Perfecto para una comida reconfortante y satisfactoria.",
    category: "Almuerzo",
    origin: "Italiana",
    score: Score.EXCELLENT,
    thumbnail: "https://i.blogs.es/927bbe/salsa-pasta/840_560.jpg",
    ingredients: [
      { name: "Fideos N°77", quantity: 0.5 },
      { name: "Cebolla", quantity: 1 },
      { name: "Zanahoria", quantity: 1 },
      { name: "Aceite Vegetal", quantity: 0.1 },
      { name: "Carne Molida", quantity: 250 },
      { name: "Tomate", quantity: 1 },
      { name: "Salsa de Tomate", quantity: 150 },
    ],
    steps: [
      "Picar cebolla y zanahoria, para luego sofreír en aceite caliente.",
      "Agregar la carne picada y cocinar hasta dorar.",
      "Incorporar los tomates y cocinar a fuego lento.",
      "Cocinar los fideos en agua hirviendo con sal.",
      "Servir los fideos con la salsa de tomate.",
    ],
  },
  {
    name: "Empanadas de Carne",
    description:
      "Clásicas empanadas rellenas de carne, preparadas con una masa crujiente y un relleno sabroso de carne picada, cebolla, aceitunas y huevo duro sazonados con comino y pimentón. Horneadas hasta dorar, estas empanadas son ideales como un tentempié o plato principal en cualquier ocasión.",
    category: "Snack",
    origin: "Argentina",
    score: Score.GOOD,
    thumbnail: "https://assets.megamediaradios.fm/sites/2/2022/09/dadino.jpg",
    ingredients: [
      { name: "Masa de Empanadas", quantity: 4 },
      { name: "Carne Picada", quantity: 300 },
      { name: "Cebolla", quantity: 1 },
      { name: "Huevo Duro", quantity: 2 },
      { name: "Aceitunas", quantity: 100 },
      { name: "Comino Molido", quantity: 5 },
      { name: "Pimentón Rojo", quantity: 1 },
      { name: "Aceite Vegetal", quantity: 0.2 },
    ],
    steps: [
      "Picar la cebolla y sofreír en aceite caliente.",
      "Agregar la carne picada, comino y pimentón. Cocinar hasta dorar.",
      "Incorporar las aceitunas picadas y los huevos duros picados.",
      "Rellenar las empanadas con la mezcla y hornear hasta dorar.",
      "Servir calientes.",
    ],
  },
  {
    name: "Paella Española",
    description:
      "Paella española con mariscos y chorizo, un plato tradicional que combina arroz con langostinos, calamar y chorizo español, aromatizado con ajo, cebolla y pimentón rojo. El azafrán y el caldo de pescado complementan los sabores, creando una paella con una textura perfecta y un sabor profundo que evoca la cocina mediterránea.",
    category: "Almuerzo",
    origin: "Española",
    score: Score.EXCELLENT,
    thumbnail:
      "https://i0.wp.com/imag.bonviveur.com/paella-mixta.jpg?resize=1150%2C764&ssl=1",
    ingredients: [
      { name: "Arroz", quantity: 1 },
      { name: "Langostinos", quantity: 500 },
      { name: "Calamar", quantity: 300 },
      { name: "Chorizo Español", quantity: 200 },
      { name: "Pimentón Rojo", quantity: 2 },
      { name: "Cebolla", quantity: 1 },
      { name: "Ajo", quantity: 3 },
      { name: "Caldo de Pescado", quantity: 1 },
      { name: "Azafrán", quantity: 1 },
    ],
    steps: [
      "Picar la cebolla, los pimientos y el ajo finamente.",
      "Sofreír el chorizo en una paellera con aceite caliente.",
      "Agregar la cebolla, los pimientos y el ajo. Cocinar hasta que estén dorados.",
      "Añadir los calamares y los langostinos, cocinar por unos minutos.",
      "Agregar el arroz y el azafrán, mezclar bien.",
      "Incorporar el caldo de pescado caliente y cocinar a fuego medio hasta que el arroz esté cocido y el líquido se haya absorbido.",
      "Dejar reposar unos minutos antes de servir.",
    ],
  },
  {
    name: "Ensalada César",
    description:
      "Ensalada clásica con aderezo cremoso, hecha con lechuga romana fresca, pollo asado, crujientes cubos de pan tostado y queso parmesano. El aderezo César se mezcla delicadamente para realzar el sabor de los ingredientes frescos, creando una ensalada ligera pero satisfactoria.",
    category: "Almuerzo",
    origin: "Americana",
    score: Score.GREAT,
    thumbnail:
      "https://lacocinadefrabisa.lavozdegalicia.es/wp-content/uploads/2016/04/ensalada-cesar.jpg",
    ingredients: [
      { name: "Lechuga Romana", quantity: 1 },
      { name: "Pollo Asado", quantity: 200 },
      { name: "Pan Tostado", quantity: 50 },
      { name: "Queso Parmesano", quantity: 50 },
      { name: "Aderezo César", quantity: 50 },
    ],
    steps: [
      "Lavar y cortar la lechuga en trozos grandes.",
      "Cortar el pollo asado en tiras finas.",
      "Cortar el pan tostado en cubos pequeños.",
      "Mezclar la lechuga, pollo, pan tostado y queso parmesano en un tazón grande.",
      "Agregar el aderezo César y mezclar bien.",
      "Servir inmediatamente.",
    ],
  },
  {
    name: "Desayuno Completo",
    description:
      "Desayuno nutritivo con huevos, aguacate y tostadas, que incluye huevos cocinados al gusto, aguacate fresco en rodajas, tostadas crujientes y tomates cherry. Un plato equilibrado que proporciona energía para empezar el día, con un toque saludable y delicioso.",
    category: "Desayuno",
    origin: "Americana",
    score: Score.EXCELLENT,
    thumbnail:
      "https://img-global.cpcdn.com/recipes/7167956f2eac5fc1/680x482cq70/tostadas-de-aguacate-y-huevo-foto-principal.jpg",
    ingredients: [
      { name: "Huevo", quantity: 2 },
      { name: "Aguacate", quantity: 1 },
      { name: "Pan Tostado", quantity: 2 },
      { name: "Tomate Cherry", quantity: 6 },
      { name: "Aceite de Oliva", quantity: 10 },
      { name: "Sal", quantity: 1 },
      { name: "Pimienta", quantity: 1 },
    ],
    steps: [
      "Cortar el aguacate en rodajas finas.",
      "Calentar el aceite de oliva en una sartén a fuego medio.",
      "Cocinar los huevos al gusto (revueltos, fritos, etc.).",
      "Tostar las rebanadas de pan.",
      "Servir los huevos con aguacate, tostadas y tomates cherry.",
      "Condimentar con sal y pimienta al gusto.",
    ],
  },
  {
    name: "Pisco Sour",
    description:
      "Cóctel peruano refrescante con pisco y limón, elaborado con una mezcla de pisco, jugo de limón fresco, jarabe de goma y clara de huevo. Servido con hielo y unas gotas de amargo de Angostura, este cóctel es un equilibrio perfecto entre dulce y ácido, ideal para celebrar o disfrutar en cualquier ocasión.",
    category: "Trago",
    origin: "Peruana",
    score: Score.EXCELLENT,
    thumbnail:
      "https://ombligoparao.cl/wp-content/uploads/2023/10/Receta-de-Pisco-Sour.jpg",
    ingredients: [
      { name: "Pisco", quantity: 60 },
      { name: "Jugo de Limón", quantity: 30 },
      { name: "Jarabe de Goma", quantity: 20 },
      { name: "Clara de Huevo", quantity: 1 },
      { name: "Gotas de Amargo de Angostura", quantity: 2 },
      { name: "Hielo", quantity: 100 },
    ],
    steps: [
      "En una coctelera, mezclar el pisco, jugo de limón, jarabe de goma y clara de huevo.",
      "Agregar hielo y agitar vigorosamente durante unos segundos.",
      "Colar la mezcla en un vaso bajo con hielo.",
      "Agregar las gotas de amargo de angostura sobre la espuma.",
      "Servir inmediatamente.",
    ],
  },
  {
    name: "Margarita",
    description:
      "Cóctel mexicano con tequila blanco, triple sec y jugo de lima, adornado con una elegante rodaja de lima en el borde. Esta bebida refrescante se prepara agitando los ingredientes con hielo en una coctelera y se sirve con un toque de sal en el borde del vaso. Perfecta para disfrutar en cualquier ocasión con su equilibrio único entre dulzura y acidez.",
    category: "Trago",
    origin: "Mexicana",
    score: Score.GOOD,
    thumbnail:
      "https://www.finedininglovers.com/es/sites/g/files/xknfdk1706/files/styles/recipes_1200_800_fallback/public/2023-03/margarita%C2%A9iStock.jpg?itok=Ir0T3tYT",
    ingredients: [
      { name: "Tequila Blanco", quantity: 60 },
      { name: "Triple Sec", quantity: 30 },
      { name: "Jugo de Lima", quantity: 30 },
      { name: "Sal", quantity: 5 },
      { name: "Hielo", quantity: 100 },
    ],
    steps: [
      "Rellenar la mitad del borde de un vaso con sal.",
      "En una coctelera, mezclar el tequila, triple sec y jugo de lima con hielo.",
      "Agitar bien y colar en el vaso preparado con hielo.",
      "Decorar con una rodaja de lima.",
      "Servir inmediatamente.",
    ],
  },
  {
    name: "Palomitas de maíz dulces",
    description:
      "Snack de palomitas de maíz cubiertas de caramelo, una delicia dulce y crujiente. Las palomitas se mezclan con una mezcla de mantequilla derretida y azúcar que se carameliza delicadamente, luego se sazona con una pizca de sal para equilibrar los sabores. Ideal para una tarde de cine en casa o cualquier celebración informal.",
    category: "Snack",
    origin: "Americana",
    score: Score.GREAT,
    thumbnail:
      "https://mellerware.com/cdn/shop/articles/blog-palomitas-1_1024x.jpg?v=1638448364",
    ingredients: [
      { name: "Maíz para Palomitas", quantity: 50 },
      { name: "Azúcar Blanca", quantity: 30 },
      { name: "Mantequilla", quantity: 20 },
      { name: "Sal", quantity: 1 },
    ],
    steps: [
      "Preparar las palomitas de maíz según las instrucciones del paquete.",
      "En una olla, derretir la mantequilla a fuego medio.",
      "Agregar el azúcar y mezclar hasta que se disuelva y comience a caramelizar.",
      "Incorporar las palomitas de maíz y mezclar bien para cubrirlas con el caramelo.",
      "Espolvorear con sal al gusto y dejar enfriar antes de servir.",
    ],
  },
  {
    name: "Guacamole con nachos",
    description:
      "Delicioso guacamole casero preparado con aguacates maduros, tomate, cebolla morada y cilantro fresco, todo sazonado con limón y sal. Se sirve con Tostitos crujientes para disfrutar como aperitivo o acompañamiento. La combinación de sabores frescos y la textura cremosa del guacamole hacen de este plato una opción siempre popular.",
    category: "Snack",
    origin: "Mexicana",
    score: Score.EXCELLENT,
    thumbnail:
      "https://www.panchovilla.cl/wp-content/uploads/2022/07/Nachos-con-guacamole.jpg",
    ingredients: [
      { name: "Palta", quantity: 2 },
      { name: "Tomate", quantity: 1 },
      { name: "Cebolla Morada", quantity: 1 },
      { name: "Cilantro", quantity: 10 },
      { name: "Limón", quantity: 1 },
      { name: "Sal", quantity: 2 },
      { name: "Tostitos", quantity: 100 },
    ],
    steps: [
      "Pelar y machacar los aguacates en un tazón.",
      "Picar finamente el tomate, la cebolla roja y el cilantro.",
      "Agregar el tomate, la cebolla y el cilantro al tazón de aguacate.",
      "Exprimir el jugo de limón sobre la mezcla y sazonar con sal.",
      "Mezclar bien hasta obtener una consistencia uniforme.",
      "Servir con los tostitos para acompañar.",
    ],
  },
  {
    name: "Mini Pizzas",
    description:
      "Pequeñas pizzas individuales con salsa de tomate, queso mozzarella derretido y rodajas de pepperoni, todo sobre panecillos de pizza crujientes. Horneadas hasta que el queso se derrite y la masa esté dorada, estas mini pizzas son perfectas para fiestas infantiles o como un rápido almuerzo satisfactorio.",
    category: "Snack",
    origin: "Italiana",
    score: Score.GOOD,
    thumbnail:
      "https://i.pinimg.com/736x/db/51/06/db5106c288e26e8d02f94d58e75cf3bf.jpg",
    ingredients: [
      { name: "Panecillos de Pizza", quantity: 6 },
      { name: "Salsa de Tomate", quantity: 50 },
      { name: "Queso Mozzarella", quantity: 100 },
      { name: "Pepperoni", quantity: 50 },
      { name: "Orégano", quantity: 2 },
    ],
    steps: [
      "Precalentar el horno a la temperatura indicada en los panecillos de pizza.",
      "Cubrir cada panecillo con salsa de tomate.",
      "Agregar queso mozzarella rallado y pepperoni en rodajas.",
      "Espolvorear con orégano al gusto.",
      "Hornear según las instrucciones del paquete o hasta que el queso se derrita y la masa esté dorada.",
      "Servir calientes.",
    ],
  },
  {
    name: "Ensalada de atún",
    description:
      "Ensalada fresca de atún con lechuga crujiente, pepino, pimentón rojo y huevo cocido, todo mezclado en un tazón. Perfecta para una comida ligera y nutritiva, esta ensalada se prepara con ingredientes simples pero sabrosos que se combinan a la perfección.",
    category: "Almuerzo",
    origin: "Americana",
    score: Score.GOOD,
    thumbnail:
      "https://www.deliciosi.com/images/200/215/ensalada-de-atun-light.jpg",
    ingredients: [
      { name: "Huevo", quantity: 2 },
      { name: "Lechuga", quantity: 1 },
      { name: "Pepino", quantity: 1 },
      { name: "Pimentón Rojo", quantity: 1 },
      { name: "Atún en Lata", quantity: 200 },
    ],
    steps: [
      "Cocinar los huevos en agua hirviendo.",
      "Cortar la lechuga, el pepino y el pimentón en trozos.",
      "Mezclar los ingredientes en un bol.",
      "Servir la ensalada con el atún y los huevos.",
    ],
  },
  {
    name: "Arroz con pollo",
    description:
      "Arroz con pollo y verduras, una receta reconfortante donde el pollo se cocina con cebolla y zanahoria en aceite caliente, luego se mezcla con arroz y se cocina lentamente hasta que esté listo. Esta comida abundante se sirve con pollo tierno y arroz aromático, perfecta para una comida familiar satisfactoria.",
    category: "Almuerzo",
    origin: "Española",
    score: Score.GREAT,
    thumbnail:
      "https://myplate-prod.azureedge.us/sites/default/files/styles/recipe_525_x_350_/public/2021-01/MeetingYourMyPlateGoalsOnABudget_0_Page_26_0.jpg?itok=z88eO-eY",
    ingredients: [
      { name: "Pollo", quantity: 500 },
      { name: "Arroz", quantity: 1 },
      { name: "Cebolla", quantity: 1 },
      { name: "Zanahoria", quantity: 1 },
      { name: "Aceite Vegetal", quantity: 0.1 },
      { name: "Agua", quantity: 500 },
    ],
    steps: [
      "Picar cebolla y zanahoria, para luego sofreír en aceite caliente.",
      "Agregar el pollo y cocinar hasta dorar.",
      "Incorporar el arroz y cocinar a fuego lento.",
      "Agregar agua y cocinar hasta que el arroz esté listo.",
      "Servir el arroz con el pollo y las verduras.",
    ],
  },
  {
    name: "Tarta de manzana",
    description:
      "Deliciosa tarta de manzana con un toque de canela, preparada con rodajas finas de manzana sobre una base de masa de empanadas. Se espolvorea con azúcar y canela, se añaden trozos de mantequilla y se hornea hasta que la superficie esté dorada y las manzanas estén tiernas. Ideal para disfrutar como postre o acompañamiento.",
    category: "Postre",
    origin: "Americana",
    score: Score.GOOD,
    thumbnail:
      "https://img-global.cpcdn.com/recipes/b58f260e56bd4a11/680x482cq70/tarta-de-manzana-con-canela-en-licuadora-bolo-de-maca-com-casca-e-pedacos-foto-principal.jpg",
    ingredients: [
      { name: "Manzana", quantity: 3 },
      { name: "Masa de Empanadas", quantity: 1 },
      { name: "Mantequilla", quantity: 100 },
      { name: "Azúcar Blanca", quantity: 100 },
      { name: "Canela Molida", quantity: 5 },
    ],
    steps: [
      "Pelar y cortar las manzanas en rodajas finas.",
      "Forrar un molde con la masa de empanadas.",
      "Colocar las manzanas en el molde y espolvorear con azúcar y canela.",
      "Agregar trozos de mantequilla y hornear hasta dorar.",
      "Servir la tarta caliente.",
    ],
  },
  {
    name: "Sopa de verduras",
    description:
      "Reconfortante sopa de verduras con fideos, preparada con cebolla, zanahoria, puerro y apio, todos sofritos en aceite caliente antes de añadir agua y cocinar a fuego lento. Se agregan fideos que se cocinan hasta alcanzar la textura deseada. Perfecta para días fríos o como plato reconfortante en cualquier momento.",
    category: "Cena",
    origin: "Alemana",
    score: Score.GOOD,
    thumbnail:
      "https://imag.bonviveur.com/sopa-de-fideos-con-verduras-en-el-plato.jpg",
    ingredients: [
      { name: "Cebolla", quantity: 1 },
      { name: "Zanahoria", quantity: 1 },
      { name: "Puerro", quantity: 1 },
      { name: "Apio", quantity: 1 },
      { name: "Fideos N°5", quantity: 0.5 },
      { name: "Aceite Vegetal", quantity: 0.1 },
      { name: "Agua", quantity: 500 },
    ],
    steps: [
      "Picar cebolla, zanahoria, puerro y apio, para luego sofreír en aceite caliente.",
      "Agregar agua y cocinar a fuego lento.",
      "Incorporar los fideos y cocinar hasta que estén listos.",
      "Servir la sopa caliente.",
    ],
  },
  {
    name: "Tarta de espinaca",
    description:
      "Tarta de espinaca con queso, elaborada con espinacas y cebolla sofritas en aceite caliente, mezcladas con una preparación de harina, manteca y agua. Se hornea en un molde hasta que la masa esté dorada y la superficie de la tarta, con el relleno de espinacas y queso, esté deliciosamente gratinada.",
    category: "Cena",
    origin: "Francesa",
    score: Score.GOOD,
    thumbnail:
      "https://www.paulinacocina.net/wp-content/uploads/2015/08/1-P1090553.jpg",
    ingredients: [
      { name: "Espinacas", quantity: 200 },
      { name: "Cebolla", quantity: 1 },
      { name: "Masa de Empanadas", quantity: 1 },
      { name: "Mantequilla", quantity: 100 },
      { name: "Agua", quantity: 50 },
    ],
    steps: [
      "Picar cebolla y espinaca, para luego sofreír en aceite caliente.",
      "Mezclar la harina, la manteca y el agua.",
      "Forrar un molde con la masa y cocinar en horno.",
      "Agregar las espinacas cocidas y cocinar hasta dorar.",
    ],
  },
  {
    name: "Lentejas",
    description:
      "Sopa de lentejas nutritiva y sabrosa, preparada con cebolla, zanahoria, puerro y apio sofritos en aceite caliente, luego cocidos lentamente con agua hasta que las lentejas estén tiernas y el caldo espeso. Ideal para una comida completa y reconfortante, especialmente en días frescos.",
    category: "Cena",
    origin: "Española",
    score: Score.GOOD,
    thumbnail: "https://i.ytimg.com/vi/Q3GXmHJCcgg/maxresdefault.jpg",
    ingredients: [
      { name: "Cebolla", quantity: 1 },
      { name: "Zanahoria", quantity: 1 },
      { name: "Puerro", quantity: 1 },
      { name: "Apio", quantity: 1 },
      { name: "Lentejas", quantity: 200 },
      { name: "Aceite Vegetal", quantity: 0.1 },
      { name: "Agua", quantity: 500 },
    ],
    steps: [
      "Picar cebolla, zanahoria, puerro y apio, para luego sofreír en aceite caliente.",
      "Agregar agua y cocinar a fuego lento.",
      "Incorporar las lentejas y cocinar hasta que estén listas.",
      "Servir la sopa de lentejas caliente.",
    ],
  },
  {
    name: "Tarta de choclo",
    description:
      "Tarta de choclo con cebolla y queso, donde el choclo y la cebolla se sofríen en aceite caliente antes de ser combinados con una mezcla de harina, manteca y agua. La masa se hornea hasta dorar y se rellena con la mezcla de choclo, cebolla y queso, creando una combinación sabrosa y gratinada.",
    category: "Cena",
    origin: "Argentina",
    score: Score.GOOD,
    thumbnail:
      "https://cocinaderestauranteencasa.com/wp-content/uploads/2023/03/TARTA-DE-CHOCLO-C-scaled.jpg",
    ingredients: [
      { name: "Choclo", quantity: 1 },
      { name: "Cebolla", quantity: 1 },
      { name: "Masa de Empanadas", quantity: 1 },
      { name: "Mantequilla", quantity: 100 },
      { name: "Agua", quantity: 50 },
    ],
    steps: [
      "Picar cebolla y choclo, para luego sofreír en aceite caliente.",
      "Mezclar la harina, la manteca y el agua.",
      "Forrar un molde con la masa y cocinar en horno.",
      "Agregar el choclo cocido y cocinar hasta dorar.",
    ],
  },
  {
    name: "Sopa de Arvejas",
    description:
      "Sopa de arvejas reconfortante con verduras y arroz, preparada con cebolla, zanahoria, puerro y apio sofritos en aceite caliente, seguidos de agua, arvejas y arroz. Cocinada a fuego lento hasta que los ingredientes estén tiernos y el caldo haya desarrollado sabores profundos. Perfecta para una comida nutritiva y satisfactoria.",
    category: "Cena",
    origin: "Alemana",
    score: Score.GOOD,
    thumbnail:
      "https://www.recetasnestle.com.ar/sites/default/files/srh_recipes/22f58d55aa4622dfabedbed545dff876.jpg",
    ingredients: [
      { name: "Cebolla", quantity: 1 },
      { name: "Zanahoria", quantity: 1 },
      { name: "Puerro", quantity: 1 },
      { name: "Apio", quantity: 1 },
      { name: "Arvejas", quantity: 200 },
      { name: "Aceite Vegetal", quantity: 0.1 },
      { name: "Agua", quantity: 500 },
      { name: "Arroz", quantity: 0.5 },
    ],
    steps: [
      "Picar cebolla, zanahoria, puerro y apio, para luego sofreír en aceite caliente.",
      "Agregar agua y cocinar a fuego lento.",
      "Incorporar las arvejas y el arroz, cocinar hasta que estén listos.",
      "Servir la sopa de arvejas caliente.",
    ],
  },
];

export default dataRecipes;
