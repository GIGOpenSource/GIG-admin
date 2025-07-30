<template>
  <t-dialog v-model:visible="visible" :width="600" header="用户详情" confirm-btn="保存" @cancel="onCancel">
    <t-form ref="formRef" :model="data" label-align="left" label-width="80px">
      <h3 style="margin-bottom: 16px">用户资料</h3>
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
      <h3 style="margin-bottom: 16px">用户状态</h3>
      <t-form-item label="VIP状态" name="username">
        <t-input v-model="data.name" class="form-item-content" placeholder="请输入用户名" />
      </t-form-item>
      <t-form-item label="用户状态" name="username">
        <t-input v-model="data.name" class="form-item-content" placeholder="请输入用户名" />
      </t-form-item>
      <t-form-item label="设备" name="email">
        <t-input v-model="data.type" class="form-item-content" placeholder="请输入邮箱" />
      </t-form-item>
      <t-form-item label="IP" name="email">
        <t-input v-model="data.type" class="form-item-content" placeholder="请输入邮箱" />
      </t-form-item>
      <h3 style="margin-bottom: 16px">用户账户</h3>
      <t-form-item label="手机号" name="username">
        <t-input v-model="data.name" class="form-item-content" placeholder="请输入用户名" />
      </t-form-item>
      <t-form-item label="渠道码" name="username">
        <t-input v-model="data.name" class="form-item-content" placeholder="请输入用户名" />
      </t-form-item>
      <t-form-item label="用户类型" name="email">
        <t-input v-model="data.type" class="form-item-content" placeholder="请输入邮箱" />
      </t-form-item>
      <t-form-item label="金币余额" name="email">
        <t-input v-model="data.type" class="form-item-content" placeholder="请输入邮箱" />
      </t-form-item>
      <h3 style="margin-bottom: 16px">用户标签</h3>
      <t-form-item label="手机号" name="username">
        <t-input v-model="data.name" class="form-item-content" placeholder="请输入用户名" />
      </t-form-item>
    </t-form>
  </t-dialog>
</template>
<script lang="ts" setup>
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

const open = (detail: FormData) => {
  console.log('🚀 ~ detail:', detail);
  data.value = { ...detail };
  visible.value = true;
};

const onCancel = () => {
  visible.value = false;
};

defineExpose({
  open,
});
</script>
<style lang="scss" scoped></style>
