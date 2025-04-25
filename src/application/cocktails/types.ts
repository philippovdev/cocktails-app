export const COCKTAILS = ['margarita', 'mojito', 'a1', 'kir'] as const;

export type CocktailSlug = (typeof COCKTAILS)[number];

type Slot = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15;
type LocaleSuffix = '' | 'ES' | 'DE' | 'FR' | 'IT' | 'ZH-HANS' | 'ZH-HANT';

type IngredientKey = `strIngredient${Slot}`;
type MeasureKey = `strMeasure${Slot}`;
type InstrKey = `strInstructions${LocaleSuffix}`;
type DateModifiedString =
  `${number}-${number}-${number} ${number}:${number}:${number}`;

export type Cocktail = {
  idDrink: string;
  strDrink: string;
  strDrinkAlternate: string | null;
  strTags: string | null;
  strVideo: string | null;
  strCategory: string;
  strIBA: string | null;
  strAlcoholic: 'Alcoholic' | 'Non alcoholic' | string;
  strGlass: string;
  strDrinkThumb: string;
  strImageSource: string | null;
  strImageAttribution: string | null;
  strCreativeCommonsConfirmed: 'Yes' | 'No';
  dateModified: DateModifiedString;
} & Record<IngredientKey, string | null> &
  Record<MeasureKey, string | null> &
  Record<InstrKey, string | null>;

export type Ingredient = {
  ingredient: string;
  measure: string;
};

export type CocktailWithIngredients = Cocktail & {
  ingredients: Ingredient[];
};

export type DrinksResponse = {
  drinks: Cocktail[];
};
