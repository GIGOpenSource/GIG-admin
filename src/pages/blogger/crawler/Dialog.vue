<template>
  <t-dialog
    v-model:visible="visible"
    :header="title"
    :confirm-btn="confirmBtn"
    :cancel-btn="cancelBtn"
    width="400px"
    @confirm="handleConfirm"
    @close="handleClose"
  >
    <t-form :data="formData" :label-width="80">
      <t-form-item label="博主UID" name="uid">
        <t-input v-model="formData.uid" placeholder="输入博主UID" />
      </t-form-item>
      <t-form-item label="主页地址" name="homepage">
        <t-input v-model="formData.homepage" placeholder="输入主页地址" />
      </t-form-item>
    </t-form>
  </t-dialog>
</template>
<script lang="ts" setup>
import { ref } from 'vue';

const title = ref('创建任务');

const visible = ref(false);

const formData = ref({
  uid: '',
  homepage: '',
});

const confirmBtn = '确认';
const cancelBtn = '取消';

const open = (data?: any) => {
  if (data) {
    formData.value.uid = data.uid ?? '';
    formData.value.homepage = data.homepage ?? '';
  } else {
    formData.value.uid = '';
    formData.value.homepage = '';
  }
  visible.value = true;
};

const handleConfirm = () => {
  // 提交逻辑
  visible.value = false;
};

const handleClose = () => {
  visible.value = false;
};

defineExpose({
  open,
});
</script>
