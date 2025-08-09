<template>
  <t-dialog v-model:visible="visible" :width="600" header="新建用户" @cancel="onCancel" @confirm="onConfirm">
    <t-form ref="formRef" :model="data" label-width="80px">
      <t-form-item label="用户名" name="username">
        <t-input v-model="data.username" placeholder="输入用户名" />
      </t-form-item>
      <t-form-item label="手机号" name="phone">
        <t-input v-model="data.phone" placeholder="输入手机号" />
      </t-form-item>
      <!-- <t-form-item label="渠道码" name="email">
        <t-input v-model="data.type" placeholder="输入邮箱" />
      </t-form-item> -->
      <!-- <t-form-item label="所属APP" name="app">
        <t-input v-model="data.app" placeholder="输入APP" />
      </t-form-item> -->
    </t-form>
  </t-dialog>
</template>
<script lang="ts" setup>
import type { DialogProps } from 'tdesign-vue-next';
import { ref } from 'vue';
import { createUser } from '@/api/user';

interface FormData {
  username: string;
  phone: string;
  app: string;
}

const data = ref<FormData>({
  username: '',
  phone: '',
  app:''
});

const visible = ref(false);

const open = () => {
  visible.value = true;
};

const onConfirm: DialogProps['onConfirm'] = async () => {
  const res = await createUser(data.value);
  console.log("🚀 ~ res:", res)
};

const onCancel: DialogProps['onCancel'] = () => {
  visible.value = false;
};

defineExpose({
  open,
});
</script>
<style lang="scss" scoped></style>
