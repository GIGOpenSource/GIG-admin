<template>
  <t-dialog
    v-model:visible="visible"
    header="编辑策略"
    :confirm-btn="confirmBtn"
    :cancel-btn="cancelBtn"
    width="500px"
    @confirm="handleConfirm"
    @close="handleClose"
  >
    <t-form :data="formData" :label-width="100">
      <t-form-item label="策略名称" name="strategyName">
        <t-input v-model="formData.strategyName" placeholder="请输入策略名称" />
      </t-form-item>
      <t-form-item label="场景" name="scene">
        <t-input v-model="formData.scene" placeholder="请输入场景" />
      </t-form-item>
      <t-form-item label="用户浏览标签" name="userTags">
        <t-input v-model="formData.userTags" placeholder="请输入用户浏览标签" />
      </t-form-item>
      <t-form-item label="促销文案" name="promotionCopy">
        <t-input v-model="formData.promotionCopy" placeholder="请输入促销文案" />
      </t-form-item>
      <t-form-item label="价格" name="price">
        <t-input v-model="formData.price" placeholder="请输入价格" />
      </t-form-item>
      <t-form-item label="商品名称" name="productName">
        <t-input v-model="formData.productName" placeholder="请输入商品名称" />
      </t-form-item>
      <t-form-item label="包名" name="package">
        <t-input v-model="formData.package" placeholder="请输入包名" />
      </t-form-item>
      <t-form-item label="优先级" name="priority">
        <t-input v-model="formData.priority" placeholder="请输入优先级" />
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
  productName: '',
  package: '',
  priority: '',
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
    formData.value.productName = data.productName ?? '';
    formData.value.package = data.package ?? '';
    formData.value.priority = data.priority ?? '';
  } else {
    formData.value.strategyName = '';
    formData.value.scene = '';
    formData.value.userTags = '';
    formData.value.promotionCopy = '';
    formData.value.price = '';
    formData.value.productName = '';
    formData.value.package = '';
    formData.value.priority = '';
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
