<template>
  <t-dialog v-model:visible="visible" :width="600" header="内容分类编辑" confirm-btn="保存" @cancel="onCancel">
    <t-form ref="formRef" :model="data" label-width="80px" label-align="left">
      <t-form-item label="分类名称" name="email">
        <t-input v-model="data.type" class="form-item-content" placeholder="请输入邮箱" readonly />
      </t-form-item>
      <t-form-item label="分类级别" name="email">
        <t-input v-model="data.type" class="form-item-content" placeholder="请输入邮箱" readonly />
      </t-form-item>
      <t-form-item label="父级" name="email">
        <t-input v-model="data.type" class="form-item-content" placeholder="请输入邮箱" readonly />
      </t-form-item>
      <t-form-item label="分类icon" name="email">
        <t-input v-model="data.type" class="form-item-content" placeholder="请输入邮箱" />
      </t-form-item>
    </t-form>
  </t-dialog>
</template>
<script setup lang="ts">
import type { DialogProps } from 'tdesign-vue-next';
import { ref } from 'vue';

interface FormData {
  name: string;
  type: string;
  range: Array<string | number>;
}
const visible = ref(false);
const data = ref<FormData>({
  name: '',
  type: '',
  range: ['', ''],
});

const open = (row: any) => {
  console.log('🚀 ~ row:', row);
  visible.value = true;
};

const onCancel: DialogProps['onCancel'] = () => {
  visible.value = false;
};

defineExpose({
  open,
});
</script>
<style lang="less" scoped></style>
