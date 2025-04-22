<script setup lang="ts">
defineOptions({ name: 'CocktailDetails' });
import { computed, nextTick, onBeforeMount, onMounted, ref } from 'vue';

import type { Cocktail } from '@/application/cocktails/domain/types.ts';
import LazyImage from '@/shared/ui/image/LazyImage.vue';
import LazyLoad from '@/shared/ui/lazy/LazyLoad.vue';

const props = defineProps<{ cocktail: Cocktail; isPivot?: boolean }>();
const measuresMap = ref(new Map());
const ingredientSpans = ref<HTMLElement[]>([]);

const thumb = `url(${props.cocktail.strDrinkThumb}/small)`;
const ingredients = computed(() => {
  const list: { ingredient: string; measure: string }[] = [];

  for (const key in props.cocktail) {
    if (!key.startsWith('strIngredient')) continue;
    if (!isCocktailKey(key)) continue;
    const index = +key.replace('strIngredient', '');
    const measureKey = `strMeasure${index}`;
    if (!isCocktailKey(measureKey)) continue;

    const measure = props.cocktail[measureKey] || 'by hand';
    const ingredient = props.cocktail[key];

    if (typeof ingredient === 'string' && ingredient.trim().length) {
      list.push({ ingredient, measure });
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

function isCocktailKey(key: string): key is keyof Cocktail {
  return key in props.cocktail;
}

async function init() {
  await nextTick();
  ingredientSpans.value.forEach((node) => {
    const measure = node.innerText;
    const width = node.getBoundingClientRect().width;
    measuresMap.value.set(measure, width);
  });
}

function preloadLCPImage() {
  if (!props.isPivot) return;
  const bgPreload = new Image();
  const imagePreload = new Image();

  bgPreload.src = props.cocktail.strDrinkThumb + '/small';
  imagePreload.src = props.cocktail.strDrinkThumb + '/medium';

  bgPreload.onload = () => {
    bgPreload.remove();
  };

  imagePreload.onload = () => {
    imagePreload.remove();
  };
}

onBeforeMount(preloadLCPImage);
onMounted(init);
</script>

<template>
  <div :class="s.wrapper">
    <h2 :class="s.header">
      {{ cocktail.strDrink }}
    </h2>

    <lazy-load :class="s.imageCell">
      <div :class="s.imageWrapper">
        <LazyImage
          :src="cocktail.strDrinkThumb + '/medium'"
          :alt="cocktail.strDrink"
          width="200"
          height="200"
          fetch-priority="high"
        />
      </div>
    </lazy-load>

    <div :class="[s.description, s.text]">
      <span>{{ cocktail.strCategory }}</span>
      <span>{{ cocktail.strAlcoholic }}</span>
      <span>{{ cocktail.strGlass }}</span>
    </div>

    <div :class="[s.instructions, s.section]">
      <h3>Instructions:</h3>
      <span :class="s.text">{{ cocktail.strInstructions }}</span>
    </div>

    <div :class="[s.ingredients, s.section]">
      <h3>List of ingredients:</h3>
      <ul>
        <li
          v-for="{ ingredient, measure } in ingredients"
          :key="ingredient"
          :class="[s.ingredientGroup, s.text]"
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
  gap: var(--spacing-item-y) var(--spacing-base);
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

.text {
  font-size: var(--font-size-regular);
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

.imageCell {
  grid-area: image;
}

.imageWrapper {
  position: relative;
  overflow: hidden;

  display: flex;
  height: 200px;
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
