<template>
  <t-dialog v-model:visible="visible" :width="600" :header="title" confirm-btn="保存" @confirm="onConfirm" @cancel="onCancel">
    <t-form ref="formRef" :model="data" label-width="80px">
      <t-form-item label="分类名称" name="name">
        <t-input v-model="data.name" placeholder="输入分类名称"  />
      </t-form-item>
      <t-form-item label="分类级别" name="description">
        <t-input v-model="data.description" placeholder="输入分类级别"  />
      </t-form-item>
      <t-form-item label="父级" name="parentId">
        <t-input v-model="data.parentId" placeholder="输入父级"  />
      </t-form-item>
      <t-form-item label="分类icon" name="iconUrl">
        <t-input v-model="data.iconUrl" placeholder="输入分类icon" />
      </t-form-item>
    </t-form>
  </t-dialog>
</template>
<script setup lang="ts">
import type { DialogProps } from 'tdesign-vue-next';
import { ref } from 'vue';

import { createCategory, updateCategory } from '@/api/content'

interface FormData {
  name: string;
  description: string;
  iconUrl: string;
  parentId: string;
}
const visible = ref(false);

const id = ref(0)
const title = ref('新建分类');

const data = ref<FormData>({
  name: '',
  description: '',
  iconUrl: '',
  parentId: '',
});

const open = (row: any) => {
  console.log('🚀 ~ row:', row);
  row.id && (id.value = row.id)
  title.value = row?.id ? '编辑分类' : '新建分类';
  visible.value = true;
};

const onConfirm: DialogProps['onConfirm'] = async () => {
  const fn = id.value > 0 ? updateCategory : createCategory
  
  const res = await fn(data.value)
  console.log("🚀 ~ onConfirm ~ res:", res)

  visible.value = false;
};
const onCancel: DialogProps['onCancel'] = () => {
  visible.value = false;
};

defineExpose({
  open,
});
</script>
<style lang="less" scoped></style>
