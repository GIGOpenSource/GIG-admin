<template>
  <t-dialog
    v-model:visible="visible"
    header="编辑VIP特权配置"
    :confirm-btn="confirmBtn"
    :cancel-btn="cancelBtn"
    width="500px"
    @confirm="handleConfirm"
    @close="handleClose"
  >
    <t-form :data="formData" :label-width="100" label-align="left">
      <t-form-item label="特权文案" name="powerName">
        <t-input v-model="formData.powerName" placeholder="输入特权文案" />
      </t-form-item>
      <t-form-item label="附件" name="scene">
        <t-input v-model="formData.scene" placeholder="上传附件" />
      </t-form-item>
      <t-form-item label="VIP类型" name="userTags">
        <t-select placeholder="选择VIP类型" v-model="formData.userTags">
          <t-option value="1" label="VIP类型1"></t-option>
          <t-option value="2" label="VIP类型2"></t-option>
        </t-select>
      </t-form-item>
      <t-form-item label="备注" name="promotionCopy">
        <t-input v-model="formData.promotionCopy" placeholder="输入备注" />
      </t-form-item>
      <t-form-item label="优先级" name="price">
        <t-input v-model="formData.price" placeholder="输入优先级" />
      </t-form-item>
    </t-form>
  </t-dialog>
</template>
<script lang="ts" setup>
import { ref } from 'vue';

const visible = ref(false);

const formData = ref({
  powerName: '',
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
