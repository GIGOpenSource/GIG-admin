<template>
  <t-dialog v-model:visible="visible" :width="600" header="产品包编辑" confirm-btn="保存" @cancel="onCancel">
    <t-form ref="formRef" :model="data" label-width="120px" label-align="left">
      <t-form-item label="产品名" name="username">
        <t-input v-model="data.name" class="form-item-content" placeholder="输入用户名" />
      </t-form-item>
      <t-form-item label="包名" name="username">
        <t-input v-model="data.name" class="form-item-content" placeholder="输入用户名" />
      </t-form-item>
      <t-form-item label="强制更新版本" name="email">
        <t-input v-model="data.type" class="form-item-content" placeholder="输入邮箱" />
      </t-form-item>
      <t-form-item label="提醒更新版本" name="email">
        <t-input v-model="data.type" class="form-item-content" placeholder="输入邮箱" />
      </t-form-item>
      <t-form-item label="下载链接" name="email">
        <t-input v-model="data.type" class="form-item-content" placeholder="输入邮箱" />
      </t-form-item>
      <t-form-item label="用户ID范围" name="email">
        <t-range-input v-model="data.range" class="form-item-content" placeholder="输入邮箱" />
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

const open = () => {
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
