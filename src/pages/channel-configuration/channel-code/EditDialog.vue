<template>
  <t-dialog v-model:visible="visible" :width="600" header="渠道码编辑" confirm-btn="保存" @cancel="onCancel">
    <t-form ref="formRef" :model="data" label-width="80px" label-align="left">
      <t-form-item label="渠道码链接" name="username">
        <t-input v-model="data.name" class="form-item-content" placeholder="输入用户名" />
      </t-form-item>
      <t-form-item label="渠道码编码" name="username">
        <t-input v-model="data.name" class="form-item-content" placeholder="输入用户名" />
      </t-form-item>
      <t-form-item label="输入素材名" name="email">
        <t-input v-model="data.type" class="form-item-content" placeholder="输入邮箱" />
      </t-form-item>
      <t-form-item label="所属APP" name="email">
        <t-input v-model="data.type" class="form-item-content" placeholder="输入邮箱" />
      </t-form-item>
      <t-form-item label="备注" name="email">
        <t-input v-model="data.type" class="form-item-content" placeholder="输入邮箱" />
      </t-form-item>
      <t-form-item label="截图上传" name="email">
        <t-input v-model="data.type" class="form-item-content" placeholder="输入邮箱" />
      </t-form-item>
      <t-form-item label="选择标签" name="email">
        <t-input v-model="data.type" class="form-item-content" placeholder="输入邮箱" />
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
}
const visible = ref(false);
const data = ref<FormData>({
  name: '',
  type: '',
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
