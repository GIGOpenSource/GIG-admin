<template>
  <t-dialog
    v-model:visible="visible"
    header="编辑通知"
    :confirm-btn="confirmBtn"
    :cancel-btn="cancelBtn"
    width="500px"
    @confirm="handleConfirm"
    @close="handleClose"
  >
    <t-form :data="formData" :label-width="100">
      <t-form-item label="所属APP" name="strategyName">
        <t-input v-model="formData.strategyName" placeholder="输入策略名称" />
      </t-form-item>
      <t-form-item label="类型关系" name="scene">
        <t-input v-model="formData.scene" placeholder="输入场景" />
      </t-form-item>
      <t-form-item label="用户类型" name="userTags">
        <t-input v-model="formData.userTags" placeholder="输入用户浏览标签" />
      </t-form-item>
      <t-form-item label="通知内容" name="promotionCopy">
        <t-input v-model="formData.promotionCopy" placeholder="输入促销文案" />
      </t-form-item>
      <t-form-item label="发送时间" name="price">
        <t-input v-model="formData.price" placeholder="输入价格" />
      </t-form-item>
    </t-form>
  </t-dialog>
</template>
<script lang="ts" setup>
import { ref } from 'vue';

const visible = ref(false);

const formData = ref({
  strategyName: '',
  scene: '',
  userTags: '',
  promotionCopy: '',
  price: '',
});

const confirmBtn = '确认';
const cancelBtn = '取消';

const open = (data?: any) => {
  if (data) {
    formData.value.strategyName = data.strategyName ?? '';
    formData.value.scene = data.scene ?? '';
    formData.value.userTags = data.userTags ?? '';
    formData.value.promotionCopy = data.promotionCopy ?? '';
    formData.value.price = data.price ?? '';
  } else {
    formData.value.strategyName = '';
    formData.value.scene = '';
    formData.value.userTags = '';
    formData.value.promotionCopy = '';
    formData.value.price = '';
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
