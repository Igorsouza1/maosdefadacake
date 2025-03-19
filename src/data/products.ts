// Adicione esta interface para a configuração de quantidade
export interface QuantityConfig {
  minQuantity: number
  maxQuantity?: number
  defaultQuantity?: number
}

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
  dependsOn?: {
    type: string
    value: string
  }
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
  quantityConfig?: QuantityConfig
  freeDelivery?: boolean // Nova propriedade para entrega gratuita
  freeTopper?: boolean // Nova propriedade para topper gratuito
}

// Opções de personalização comuns que podem ser reutilizadas
const cakeBaseOptions: ProductOption[] = [
  { id: "amanteigada", name: "Amanteigada", price: 0 },
  { id: "chocolate", name: "Chocolate", price: 0 },
  { id: "paodelo", name: "Pão de ló", price: 0 },
]

const cakeBaseAndar: ProductOption[] = [
  { id: "amanteigada", name: "Amanteigada", price: 0 },
  { id: "chocolate", name: "Chocolate", price: 0 },
]

const cakeBasePiscina: ProductOption[] = [
  { id: "cenoura", name: "Cenoura", price: 0 },
  { id: "chocolate", name: "Chocolate", price: 0 },
  { id: "baunilha", name: "Baunilha", price: 0 },
]

const cakeCoberturaPiscina: ProductOption[] = [
  { id: "leiteninho", name: "Leite Ninho", price: 0 },
  { id: "chocolate", name: "Chocolate", price: 0 },
  { id: "maracuja", name: "Mousse de Maracujá", price: 0 },
]


const cakesizeRedondo: ProductOption[] = [
  { id: "17", name: "17cm (13 a 15 Fatias)", price: 110 },
  { id: "23", name: "23cm (23 a 25 Fatias)", price: 180 },
  { id: "28", name: "28cm (40 a 45 Fatias)", price: 270 },
  { id: "33", name: "33cm (45 a 50 Fatias)", price: 300 },
  { id: "40", name: "40cm (60 a 65 Fatias)", price: 320 },
]

const cakeSizeRetangular: ProductOption[] = [
  { id: "small", name: "25x20cm (20 a 25 fatias)", price: 200 },
  { id: "medium", name: "33x25 (30 a 35 fatias", price: 300 },
  { id: "large", name: "40x25 (40 a 45 fatias)", price: 350 },
]

const cakeSizeMetro: ProductOption[] = [
  { id: "meiometro", name: "Meio Metro (100 a 110 fatias", price: 600 },
  { id: "ummetro", name: "Um metro (200 fatias)", price: 900 },
]

const cakeSizeAndar: ProductOption[] = [
  { id: "doisandares", name: "2 Andares (65 a 70 fatias", price: 450 },
  { id: "tresandares", name: "3 Andares (100 Fatias)", price: 750 },
]

const cakeSizeAcetato: ProductOption[] = [
  { id: "17", name: "17cm (13 a 15 fatias)", price: 110 },
  { id: "23", name: "23cm (23 a 25 fatias)", price: 180 },
  { id: "28", name: "28cm (40 a 45 fatias)", price: 270 },
  { id: "33", name: "33cm (45 a 50 fatias)", price: 300 },
  { id: "40", name: "40cm (60 a 65 fatias)", price: 320 },
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

const topperAndar: ProductOption[] = [
  { id: "simple", name: "Topper Simples (Gratuito)", price: 0 },
  { id: "3d", name: "Topper 3D (Gratuito)", price: 0 },
]

const additionalOptions: ProductOption[] = [
  { id: "perolas", name: "Pérolas", price: 10 },
  { id: "brigadeiros", name: "Brigadeiros", price: 20 },
  { id: "morangos", name: "Morangos", price: 20 },
  { id: "glitter", name: "Glitter", price: 20 },
  { id: "brilho", name: "Brilho", price: 20 },
]

// Opções de recheio para cupcake
const cupcakeFillingOptions: ProductOption[] = [
  { id: "docedeleite", name: "Doce de Leite", price: 0 },
  { id: "leiteninho", name: "Leite Ninho", price: 0 },
  { id: "brigadeiro", name: "Brigadeiro", price: 0 },
  { id: "morangoaoleite", name: "Morango ao Leite", price: 0 },
]

// Atualize os produtos que precisam de quantidade mínima
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
        type: "cakeSize",
        label: "Escolha o Tamanho",
        required: true,
        options: cakeSizeRetangular,
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
        type: "cakeSize",
        label: "Escolha o Tamanho",
        required: true,
        options: cakeSizeMetro,
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
        options: cakeBaseAndar,
      },

      {
        type: "cakeSize",
        label: "Escolha o Tamanho",
        required: true,
        options: cakeSizeAndar,
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
        label: "Topper (Gratuito)",
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
        options: cakeSizeAcetato,
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
        type: "additional",
        label: "Adicionais (Opcional)",
        multiple: true,
        options: additionalOptions,
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
        options: cakeBasePiscina,
      },
      {
        type: "simpleFilling",
        label: "Escolha de Cobertura",
        required: true,
        options: cakeCoberturaPiscina,
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
        type: "cakeSize",
        label: "Escolha o Tamanho",
        required: true,
        options: [
          { id: "tradicional", name: "Tradicional (Rende de 15 a 20 fatias)", price: 45 },
          { id: "gigante", name: "Gigante (Rende de 20 a 25 fatias)", price: 80 },
        ],
      },
      {
        type: "cakeBase",
        label: "Escolha a Massa",
        required: true,
        options: cakeBasePiscina,
      },
      {
        type: "filling",
        label: "Escolha o Recheio",
        required: true,
        options: [
          { id: "leiteninho", name: "Leite Ninho", price: 0 },
          { id: "brigadeiro", name: "Brigadeiro", price: 0 },
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
    quantityConfig: {
      minQuantity: 10,
      defaultQuantity: 10,
    },
    customizationOptions: [
      {
        type: "cakeType",
        label: "Escolha o Tipo",
        required: true,
        options: [
          { id: "simples", name: "Simples", price: 3.5 },
          { id: "recheado", name: "Recheado", price: 4.0 },
        ],
      },
      {
        type: "filling",
        label: "Escolha o Recheio",
        required: true,
        options: cupcakeFillingOptions,
        dependsOn: {
          type: "cakeType",
          value: "recheado",
        },
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
    freeDelivery: true, // Entrega gratuita
    freeTopper: true, // Topper gratuito
    customizationOptions: [
      {
        type: "cakeBase",
        label: "Escolha a Massa",
        required: true,
        options: cakeBaseAndar,
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
        label: "Topper (Gratuito)",
        required: true,
        options: topperAndar,
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
    id: "10",
    name: "Bolo Marmita",
    price: 8.0,
    category: "Bolo",
    description: "Porção individual de bolo em formato de marmita, prática e perfeita para pequenas comemorações.",
    imageUrl: "/bolo-marmita.jpeg",
    quantityConfig: {
      minQuantity: 10,
      defaultQuantity: 10,
    },
    customizationOptions: [
      {
        type: "cakeBase",
        label: "Escolha a Massa",
        required: true,
        options: cakeBasePiscina,
      },
      {
        type: "cobertura",
        label: "Escolha a Cobertura",
        required: true,
        options: [
          { id: "brigadeiro", name: "Brigadeiro", price: 0 },
          { id: "leiteninho", name: "Leite Ninho", price: 0 },
          { id: "chocolate", name: "Chocolate", price: 0 },
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
        multiple: false,
        options: [
          { id: "brigadeiro", name: "Brigadeiro", price: 0 },
          { id: "beijinho", name: "Beijinho", price: 0 },
          { id: "amores", name: "2 Amores", price: 0 },
          { id: "ninhonutella", name: "Ninho com Nutella", price: 20 },
        ],
      },
      {
        type: "quantidade",
        label: "Quantidade",
        required: true,
        options: [
          { id: "50", name: "50 Docinhos", price: 70 },
          { id: "100", name: "100 Docinhos", price: 140 },
          { id: "200", name: "200 Docinhos", price: 210 },
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

