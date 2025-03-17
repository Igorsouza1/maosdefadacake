export interface ProductOption {
  id: string
  name: string
  price: number
}

export interface ProductCustomizationOption {
  type: string
  label: string
  required?: boolean
  multiple?: boolean
  options: ProductOption[]
}

export interface Product {
  id: string
  name: string
  price: number
  category: string
  description: string
  imageUrl: string
  isFeatured?: boolean
  customizationOptions?: ProductCustomizationOption[]
}

// Opções de personalização comuns que podem ser reutilizadas
const cakeBaseOptions: ProductOption[] = [
  { id: "amanteigada", name: "Amanteigada", price: 0 },
  { id: "chocolate", name: "Chocolate", price: 0 },
  { id: "paodelo", name: "Pão de ló", price: 0 },
]

const cakeSizeOptions: ProductOption[] = [
  { id: "small", name: "Pequeno (15cm)", price: -10 },
  { id: "medium", name: "Médio (20cm)", price: 0 },
  { id: "large", name: "Grande (25cm)", price: 20 },
  { id: "xlarge", name: "Extra Grande (30cm)", price: 40 },
]

const cakesizeRedondo: ProductOption[] = [
  { id: "17", name: "17cm (13 a 15 Fatias)", price: 110 },
  { id: "23", name: "23cm (23 a 25 Fatias)", price: 180 },
  { id: "25", name: "25cm (25 a 30 Fatias)", price: 200 },
  { id: "28", name: "28cm (40 a 45 Fatias)", price: 270 },
  { id: "33", name: "33cm (45 a 50 Fatias)", price: 300 },
  { id: "40", name: "40cm (60 a 65 Fatias)", price: 320 },
]

const fillingLayersOptions: ProductOption[] = [
  { id: "one", name: "1 Camada", price: 0 },
  { id: "two", name: "2 Camadas", price: 10 },
]

const simpleFillingOptions: ProductOption[] = [
  { id: "4leites", name: "4 Leites", price: 0 },
  { id: "brigadeiro", name: "Brigadeiro", price: 0 },
  { id: "leiteninho", name: "Leite Ninho", price: 0 },
  { id: "chocolate", name: "Chocolate", price: 0 },
  { id: "morangoaoleite", name: "Morango ao Leite", price: 0 },
  { id: "maracujaaoleite", name: "Moracujá ao Leite", price: 0 },
]

const gourmetFillingOptions: ProductOption[] = [
  { id: "4leitescomabacaxi", name: "4 Leites com Abacaxi", price: 20 },
  { id: "brigadeirotradicional", name: "Brigadeiro Tradicional com Morango Fresco", price: 25 },
  { id: "leiteninhomorango", name: "Leite Ninho com Morango Fresco", price: 25 },
  { id: "doceleiteameixa", name: "Doce de leite com Ameixa", price: 30 },
  { id: "prestigio", name: "Prestígio", price: 20 },
  { id: "leiteninhonutella", name: "Leite Ninho com Nutella", price: 25 },
  { id: "nozes", name: "Nozes", price: 25 },
  { id: "recheiobombom", name: "Recheio de Bombom", price: 30 },
  { id: "ganachemeioamargo", name: "Ganache Meio Amargo", price: 30 },
  { id: "ferreroroche", name: "Ferrero Roche", price: 30 },
  { id: "ganache", name: "Ganache", price: 30 },
  { id: "ourobranco", name: "Ouro Branco", price: 20 },
]

const topperOptions: ProductOption[] = [
  { id: "none", name: "Sem Topper", price: 0 },
  { id: "simple", name: "Topper Simples", price: 20 },
  { id: "3d", name: "Topper 3D", price: 35 },
]

const additionalOptions: ProductOption[] = [
  { id: "perolas", name: "Pérolas", price: 10 },
  { id: "brigadeiros", name: "Brigadeiros", price: 20 },
  { id: "morangos", name: "Morangos", price: 20 },
  { id: "glitter", name: "Glitter", price: 20 },
  { id: "brilho", name: "Brilho", price: 20 },
]

export const products: Product[] = [
  {
    id: "1",
    name: "Bolo Redondo",
    price: 110.0,
    category: "Bolo",
    description: "Bolo redondo tradicional, perfeito para aniversários e comemorações especiais.",
    imageUrl: "/redondo-17.jpeg",
    isFeatured: true,
    customizationOptions: [
      {
        type: "cakeBase",
        label: "Escolha a Massa",
        required: true,
        options: cakeBaseOptions,
      },
      {
        type: "cakeSize",
        label: "Escolha o Tamanho",
        required: true,
        options: cakesizeRedondo,
      },
      {
        type: "fillingLayers",
        label: "Quantidade de Recheio",
        required: true,
        options: fillingLayersOptions,
      },
      {
        type: "simpleFilling",
        label: "Escolha de Recheio Simples",
        required: true,
        options: simpleFillingOptions,
      },
      {
        type: "gourmetFilling",
        label: "Escolha de Recheio Gourmet (Opcional)",
        options: gourmetFillingOptions,
      },
      {
        type: "topper",
        label: "Topper",
        required: true,
        options: topperOptions,
      },
      {
        type: "additional",
        label: "Adicionais (Opcional)",
        multiple: true,
        options: additionalOptions,
      },
    ],
  },
  {
    id: "2",
    name: "Bolo Retangular",
    price: 200.0,
    category: "Bolo",
    description: "Bolo retangular ideal para festas maiores, com mais porções e espaço para decoração.",
    imageUrl: "/retangular-25.jpeg",
    customizationOptions: [
      {
        type: "cakeBase",
        label: "Escolha a Massa",
        required: true,
        options: cakeBaseOptions,
      },
      {
        type: "fillingLayers",
        label: "Quantidade de Recheio",
        required: true,
        options: fillingLayersOptions,
      },
      {
        type: "simpleFilling",
        label: "Escolha de Recheio Simples",
        required: true,
        options: simpleFillingOptions,
      },
      {
        type: "gourmetFilling",
        label: "Escolha de Recheio Gourmet (Opcional)",
        options: gourmetFillingOptions,
      },
      {
        type: "topper",
        label: "Topper",
        required: true,
        options: topperOptions,
      },
      {
        type: "additional",
        label: "Adicionais (Opcional)",
        multiple: true,
        options: additionalOptions,
      },
    ],
  },
  {
    id: "3",
    name: "Bolo de Metro",
    price: 600.0,
    category: "Bolo",
    description: "Bolo comprido com um metro de extensão, perfeito para grandes eventos e celebrações.",
    imageUrl: "/um-metro.jpeg",
    isFeatured: true,
    customizationOptions: [
      {
        type: "cakeBase",
        label: "Escolha a Massa",
        required: true,
        options: cakeBaseOptions,
      },
      {
        type: "simpleFilling",
        label: "Escolha de Recheio Simples",
        required: true,
        options: simpleFillingOptions,
      },
      {
        type: "gourmetFilling",
        label: "Escolha de Recheio Gourmet (Opcional)",
        options: gourmetFillingOptions,
      },
      {
        type: "additional",
        label: "Adicionais (Opcional)",
        multiple: true,
        options: additionalOptions,
      },
    ],
  },
  {
    id: "4",
    name: "Bolo de Andar",
    price: 450.0,
    category: "Bolo",
    description: "Bolo elegante com múltiplos andares, ideal para casamentos e ocasiões formais.",
    imageUrl: "/bolo-andar-1.jpeg",
    isFeatured: true,
    customizationOptions: [
      {
        type: "cakeBase",
        label: "Escolha a Massa",
        required: true,
        options: cakeBaseOptions,
      },
      {
        type: "simpleFilling",
        label: "Escolha de Recheio Simples",
        required: true,
        options: simpleFillingOptions,
      },
      {
        type: "gourmetFilling",
        label: "Escolha de Recheio Gourmet (Opcional)",
        options: gourmetFillingOptions,
      },
      {
        type: "topper",
        label: "Topper",
        required: true,
        options: topperOptions,
      },
      {
        type: "additional",
        label: "Adicionais (Opcional)",
        multiple: true,
        options: additionalOptions,
      },
    ],
  },
  {
    id: "5",
    name: "Bolo de Acetato",
    price: 120.0,
    category: "Bolo",
    description: "Bolo envolvido em acetato transparente, revelando camadas decorativas e recheios.",
    imageUrl: "/bolo-acetato.jpeg",
    customizationOptions: [
      {
        type: "cakeBase",
        label: "Escolha a Massa",
        required: true,
        options: cakeBaseOptions,
      },
      {
        type: "cakeSize",
        label: "Escolha o Tamanho",
        required: true,
        options: cakeSizeOptions,
      },
      {
        type: "simpleFilling",
        label: "Escolha de Recheio Simples",
        required: true,
        options: simpleFillingOptions,
      },
      {
        type: "gourmetFilling",
        label: "Escolha de Recheio Gourmet (Opcional)",
        options: gourmetFillingOptions,
      },
    ],
  },
  {
    id: "6",
    name: "Bolo Piscina",
    price: 40.0,
    category: "Bolo",
    description: "Bolo temático com formato de piscina, perfeito para festas de verão e pool parties.",
    imageUrl: "/bolo-piscina.jpeg",
    customizationOptions: [
      {
        type: "cakeBase",
        label: "Escolha a Massa",
        required: true,
        options: cakeBaseOptions,
      },
      {
        type: "simpleFilling",
        label: "Escolha de Recheio Simples",
        required: true,
        options: simpleFillingOptions,
      },
      {
        type: "additional",
        label: "Adicionais (Opcional)",
        multiple: true,
        options: [
          { id: "candles", name: "Velas", price: 5 },
          { id: "sparkles", name: "Velas Sparkle", price: 8 },
          { id: "figures", name: "Bonecos para Piscina", price: 15 },
        ],
      },
    ],
  },
  {
    id: "7",
    name: "Bolo Vulcão",
    price: 45.0,
    category: "Bolo",
    description: "Bolo especial com calda que escorre como um vulcão quando servido, surpreendendo a todos.",
    imageUrl: "/bolo-vulcao-1.jpeg",
    customizationOptions: [
      {
        type: "cakeBase",
        label: "Escolha a Massa",
        required: true,
        options: [
          { id: "chocolate", name: "Chocolate", price: 0 },
          { id: "vanilla", name: "Baunilha", price: 0 },
        ],
      },
      {
        type: "filling",
        label: "Escolha o Recheio",
        required: true,
        options: [
          { id: "chocolate", name: "Chocolate", price: 0 },
          { id: "dulcedeleche", name: "Doce de Leite", price: 0 },
          { id: "nutella", name: "Nutella", price: 5 },
        ],
      },
      {
        type: "additional",
        label: "Adicionais (Opcional)",
        multiple: true,
        options: [
          { id: "candles", name: "Velas", price: 5 },
          { id: "sparkles", name: "Velas Sparkle", price: 8 },
        ],
      },
    ],
  },
  {
    id: "8",
    name: "Cupcake",
    price: 3.5,
    category: "Cupcake",
    description: "Deliciosos cupcakes individuais com cobertura cremosa e decorações personalizadas.",
    imageUrl: "/cupcake.jpeg",
    customizationOptions: [
      {
        type: "cakeBase",
        label: "Escolha a Massa",
        required: true,
        options: [
          { id: "vanilla", name: "Baunilha", price: 0 },
          { id: "chocolate", name: "Chocolate", price: 0 },
          { id: "redvelvet", name: "Red Velvet", price: 1 },
        ],
      },
      {
        type: "topping",
        label: "Escolha a Cobertura",
        required: true,
        options: [
          { id: "buttercream", name: "Buttercream", price: 0 },
          { id: "chocolate", name: "Chocolate", price: 0 },
          { id: "cream_cheese", name: "Cream Cheese", price: 1 },
        ],
      },
      {
        type: "decoration",
        label: "Decoração (Opcional)",
        options: [
          { id: "sprinkles", name: "Granulado", price: 0.5 },
          { id: "fruits", name: "Frutas", price: 1 },
          { id: "chocolate_chips", name: "Gotas de Chocolate", price: 0.5 },
        ],
      },
    ],
  },
  {
    id: "9",
    name: "Bolo Aquário",
    price: 750.0,
    category: "Bolo",
    description: "Bolo artístico com design de aquário, incluindo elementos decorativos que imitam a vida marinha.",
    imageUrl: "/bolo-aquario-1.jpeg",
    isFeatured: true,
    customizationOptions: [
      {
        type: "cakeBase",
        label: "Escolha a Massa",
        required: true,
        options: cakeBaseOptions,
      },
      {
        type: "simpleFilling",
        label: "Escolha de Recheio Simples",
        required: true,
        options: simpleFillingOptions,
      },
      {
        type: "gourmetFilling",
        label: "Escolha de Recheio Gourmet (Opcional)",
        options: gourmetFillingOptions,
      },
      {
        type: "decoration",
        label: "Decoração Temática",
        required: true,
        options: [
          { id: "basic", name: "Básica (Peixes e Algas)", price: 0 },
          { id: "advanced", name: "Avançada (Peixes, Algas e Corais)", price: 50 },
          { id: "premium", name: "Premium (Peixes, Algas, Corais e Personagens)", price: 100 },
        ],
      },
    ],
  },
  {
    id: "10",
    name: "Bolo Marmita",
    price: 8.0,
    category: "Bolo",
    description: "Porção individual de bolo em formato de marmita, prática e perfeita para pequenas comemorações.",
    imageUrl: "/bolo-marmita.jpeg",
    customizationOptions: [
      {
        type: "cakeBase",
        label: "Escolha a Massa",
        required: true,
        options: [
          { id: "vanilla", name: "Baunilha", price: 0 },
          { id: "chocolate", name: "Chocolate", price: 0 },
          { id: "carrot", name: "Cenoura", price: 0 },
        ],
      },
      {
        type: "topping",
        label: "Escolha a Cobertura",
        required: true,
        options: [
          { id: "none", name: "Sem Cobertura", price: 0 },
          { id: "chocolate", name: "Chocolate", price: 1 },
          { id: "condensed_milk", name: "Leite Condensado", price: 1 },
        ],
      },
    ],
  },
  {
    id: "11",
    name: "Docinhos (cento)",
    price: 70.0,
    category: "Docinho",
    description: "Cento de docinhos variados, incluindo brigadeiros, beijinhos e outros sabores tradicionais.",
    imageUrl: "/docinho-1.jpeg",
    customizationOptions: [
      {
        type: "flavors",
        label: "Escolha os Sabores",
        required: true,
        multiple: true,
        options: [
          { id: "brigadeiro", name: "Brigadeiro", price: 0 },
          { id: "beijinho", name: "Beijinho", price: 0 },
          { id: "casadinho", name: "Casadinho", price: 0 },
          { id: "churros", name: "Churros", price: 5 },
          { id: "nutella", name: "Nutella", price: 10 },
          { id: "ninho", name: "Ninho", price: 5 },
        ],
      },
      {
        type: "decoration",
        label: "Decoração",
        required: true,
        options: [
          { id: "sprinkles", name: "Granulado", price: 0 },
          { id: "sugar", name: "Açúcar", price: 0 },
          { id: "custom", name: "Personalizada", price: 10 },
        ],
      },
    ],
  },
]

export const categories = ["Todos", "Bolo", "Cupcake", "Docinho"]

export function getProductsByCategory(category: string): Product[] {
  if (category === "Todos") {
    return products
  }
  return products.filter((product) => product.category === category)
}

export function getProductById(id: string): Product | undefined {
  return products.find((product) => product.id === id)
}

