import { ref } from 'vue';

export const useCommonStore = () => {
  const servingType = ref<'meals' | 'cocktails'>('cocktails');

  function setServingType(type: 'meals' | 'cocktails') {
    servingType.value = type;
  }

  return { servingType, setServingType };
};
