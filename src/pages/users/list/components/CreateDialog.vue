<template>
  <t-dialog v-model:visible="visible" :width="600" header="新建用户" @cancel="onCancel">
    <t-form ref="formRef" :model="data">
      <t-form-item label="用户名" name="username">
        <t-input v-model="data.name" class="form-item-content" placeholder="请输入用户名" />
      </t-form-item>
      <t-form-item label="手机号" name="username">
        <t-input v-model="data.name" class="form-item-content" placeholder="请输入用户名" />
      </t-form-item>
      <t-form-item label="渠道码" name="email">
        <t-input v-model="data.type" class="form-item-content" placeholder="请输入邮箱" />
      </t-form-item>
      <t-form-item label="所属APP" name="email">
        <t-input v-model="data.type" class="form-item-content" placeholder="请输入邮箱" />
      </t-form-item>
    </t-form>
  </t-dialog>
</template>
<script lang="ts" setup>
import type { DialogProps } from 'tdesign-vue-next';
import { ref } from 'vue';

interface FormData {
  name: string;
  type: string;
}

const data = ref<FormData>({
  name: '',
  type: '',
});

const visible = ref(false);

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
<style lang="scss" scoped></style>
