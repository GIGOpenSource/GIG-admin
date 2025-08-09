<template>
  <t-select
    v-model="innerValue"
    :options="appOptions"
    placeholder="选择APP"
    @change="handleChangeApp"
  />
</template>

<script setup lang="ts">
import type { SelectProps } from 'tdesign-vue-next';
import { ref, watch } from 'vue';

const props = defineProps<{
  modelValue?: string;
}>();
const emit = defineEmits(['update:modelValue', 'change']);

const innerValue = ref(props.modelValue ?? '');

watch(
  () => props.modelValue,
  (val) => {
    innerValue.value = val ?? '';
  }
);

const appOptions = ref<SelectProps['options']>([
  { label: '抖音', value: 'DY' },
  { label: 'GIG', value: 'GIG' },
  { label: '快手', value: 'KS' },
  { label: '微信', value: 'WX' },
  { label: '小红书', value: 'YX' },
  { label: 'TDesign', value: 'TDesign' },
  { label: '其他', value: 'Other' },
]);

const handleChangeApp: SelectProps['onChange'] = (val) => {
  emit('update:modelValue', val);
  emit('change', val);
};
</script>

