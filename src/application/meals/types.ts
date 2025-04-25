export const MEALS = ['lamb', 'pork', 'potato', 'onion'] as const;

export type MealSlug = (typeof MEALS)[number];

type Slot = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15;
type LocaleSuffix = '' | 'ES' | 'DE' | 'FR' | 'IT' | 'ZH-HANS' | 'ZH-HANT';

type IngredientKey = `strIngredient${Slot}`;
type MeasureKey = `strMeasure${Slot}`;
type InstrKey = `strInstructions${LocaleSuffix}`;
type DateModifiedString =
  `${number}-${number}-${number} ${number}:${number}:${number}`;

export type Meal = {
  idMeal: string;
  strMeal: string;
  strMealAlternate: string | null;
  strTags: string | null;
  strVideo: string | null;
  strCategory: string;
  strIBA: string | null;
  strAlcoholic: 'Alcoholic' | 'Non alcoholic' | string;
  strGlass: string;
  strMealThumb: string;
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

export type MealWithIngredients = Meal & {
  ingredients: Ingredient[];
};

export type MealsResponse = {
  meals: Meal[];
};
