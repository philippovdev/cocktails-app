<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue';

import type { Cocktail } from '@/application/cocktails/domain/types.ts';
import LazyImage from '@/shared/ui/image/presentation/components/LazyImage.vue';

const props = defineProps<{ cocktail: Cocktail }>();
const thumb = `url(${props.cocktail.strDrinkThumb})`;
const measuresMap = ref(new Map());
const ingredientSpans = ref<HTMLElement[]>([]);

const ingredients = computed(() => {
  const list: { ingredient: string; measure: string }[] = [];

  for (const key in props.cocktail) {
    if (!key.startsWith('strIngredient')) continue;
    if (!isCocktailKey(key)) continue;
    const index = +key.replace('strIngredient', '');
    const measureKey = `strMeasure${index}`;
    if (!isCocktailKey(measureKey)) continue;
    const measure = props.cocktail[measureKey];

    const val = props.cocktail[key];

    if (typeof val === 'string' && val.trim().length) {
      list.push({
        ingredient: val,
        measure: measure || 'by hand',
      });
    }
  }

  return list;
});

const getLongestMeasure = computed(() => {
  let longest = 0;

  for (const value of measuresMap.value.values()) {
    if (value > longest) {
      longest = value;
    }
  }

  return longest + 'px';
});

function registerSpan(el: HTMLElement) {
  if (el && !ingredientSpans.value.includes(el)) {
    ingredientSpans.value.push(el);
  }
}

function isCocktailKey(k: string): k is keyof Cocktail {
  return k in props.cocktail;
}

async function init() {
  await nextTick();
  ingredientSpans.value.forEach((node) => {
    const measure = node.innerText;
    const width = node.getBoundingClientRect().width;
    measuresMap.value.set(measure, width);
  });
}

onMounted(init);
</script>

<template>
  <div :class="s.wrapper">
    <h2 :class="s.header">
      {{ cocktail.strDrink }}
    </h2>

    <div :class="s.imageWrapper">
      <LazyImage
        :src="cocktail.strDrinkThumb"
        :alt="cocktail.strDrink"
        width="200"
        height="200"
      />
    </div>

    <div :class="s.description">
      <span>{{ cocktail.strCategory }}</span>
      <span>{{ cocktail.strAlcoholic }}</span>
      <span>{{ cocktail.strGlass }}</span>
    </div>

    <div :class="[s.instructions, s.section]">
      <h3>Instructions:</h3>
      {{ cocktail.strInstructions }}
    </div>

    <div :class="[s.ingredients, s.section]">
      <h3>List of ingredients:</h3>
      <ul>
        <li
          v-for="{ ingredient, measure } in ingredients"
          :key="ingredient"
          :class="s.ingredientGroup"
        >
          <span
            :ref="(node) => registerSpan(node as HTMLElement)"
            :style="{ minWidth: getLongestMeasure }"
          >
            {{ measure }}
          </span>

          {{ ingredient }}
        </li>
      </ul>
    </div>
  </div>
</template>

<style module="s">
.wrapper {
  display: grid;
  width: 100%;
  padding: var(--spacing-item-y);
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto auto auto auto;
  grid-template-areas:
    'header      image'
    'description image'
    'instructions image'
    'ingredients  .    ';
  gap: var(--spacing-item-y) var(--spacing-item-x);
}

@media (max-width: 768px) {
  .wrapper {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto auto auto auto;
    grid-template-areas:
      'header'
      'image'
      'description'
      'instructions'
      'ingredients';
  }
}

.header {
  grid-area: header;
}

.description {
  grid-area: description;
  display: flex;
  flex-direction: column;
}

.section {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-item-y);
}

.instructions {
  grid-area: instructions;
}

.ingredients {
  grid-area: ingredients;
}

.ingredients ul {
  list-style: none;
}

.imageWrapper {
  grid-area: image;
  position: relative;
  overflow: hidden;

  display: flex;
  max-height: 200px;
  align-items: center;
  justify-content: center;
}

.imageWrapper::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: v-bind(thumb);
  background-size: cover;
  background-position: center;
  filter: blur(10px) saturate(1.2);
  transform: scale(1.1);
  z-index: 0;
}

.imageWrapper img {
  position: relative;
  width: auto;
  max-height: 200px;
}

.ingredientGroup {
  display: flex;
  gap: var(--spacing-base);
}
</style>
