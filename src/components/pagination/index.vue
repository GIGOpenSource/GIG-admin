<template>
  <div class="pagination-container">
    <t-pagination
      v-model="innerCurrent"
      :page-size="innerPageSize"
      :total="total"
      :size="size"
      :total-content="totalContent"
      show-first-and-last-page-btn
      @change="handleChange"
      @page-size-change="handlePageSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>
<script setup lang="ts">
import type { TdPaginationProps } from 'tdesign-vue-next';
import { ref, watch } from 'vue';

const props = defineProps<{
  modelValue?: number; // 当前页
  pageSize?: number;
  total: number;
  size?: 'small' | 'medium';
  totalContent?: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', val: number): void;
  (e: 'change', pageInfo: any): void;
  (e: 'page-size-change', size: number): void;
  (e: 'current-change', index: number, pageInfo: any): void;
}>();

// 当前页
const innerCurrent = ref(props.modelValue ?? 1);
// 每页条数
const innerPageSize = ref(props.pageSize ?? 10);

watch(
  () => props.modelValue,
  (val) => {
    if (val !== undefined) innerCurrent.value = val;
  },
);
watch(
  () => props.pageSize,
  (val) => {
    if (val !== undefined) innerPageSize.value = val;
  },
);

const handleChange: TdPaginationProps['onChange'] = (pageInfo) => {
  emit('change', pageInfo);
  emit('update:modelValue', pageInfo.current);
};
const handlePageSizeChange: TdPaginationProps['onPageSizeChange'] = (size) => {
  innerPageSize.value = size;
  emit('page-size-change', size);
};
const handleCurrentChange: TdPaginationProps['onCurrentChange'] = (index, pageInfo) => {
  emit('current-change', index, pageInfo);
  emit('update:modelValue', index);
};
</script>
<style>
.pagination-container {
  margin-top: 16px;
}

.t-pagination {
  justify-content: center;
}
</style>
