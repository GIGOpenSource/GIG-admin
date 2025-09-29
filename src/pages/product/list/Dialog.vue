<template>
  <t-dialog
    v-model:visible="visible"
    :header="title"
    :confirm-btn="confirmBtn"
    :cancel-btn="cancelBtn"
    width="500px"
    @confirm="handleConfirm"
    @close="handleClose"
  >
    <t-form :data="formData" :label-width="100">
      <t-form-item label="策略名称场景" name="strategyScene">
        <t-input v-model="formData.strategyScene" placeholder="输入策略名称" />
      </t-form-item>
      <t-form-item label="商品描述" name="promotion_text">
        <t-input v-model="formData.promotion_text" placeholder="输入商品描述" />
      </t-form-item>
      <t-form-item label="价格" name="pay_price">
        <t-input v-model="formData.pay_price" placeholder="输入价格" />
      </t-form-item>
      <t-form-item label="商品类型" name="pay_channel">
        <t-select v-model="formData.pay_channel" :options="packageOptions" placeholder="商品类型" clearable />
      </t-form-item>
      <t-form-item label="商品名称" name="pay_name">
        <t-input v-model="formData.pay_name" placeholder="输入商品名称" />
      </t-form-item>
    </t-form>
  </t-dialog>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { MessagePlugin } from 'tdesign-vue-next';

import { createGoods, updateGoods } from '@/api/goods';
const emit = defineEmits(['confirm']);
const visible = ref(false);
const title = ref('创建策略');

const formData = ref({
  strategyScene: '',
  promotion_text: '',
  pay_price: '',
  pay_channel: '',
  pay_name: '',
  is_active: false,
});
const packageOptions = [
  { label: '金币', value: 'gold' },
  { label: '商品', value: 'goods' },
  { label: 'VIP', value: 'vip' },
  { label: '内容', value: 'content' },
];

const confirmBtn = '确认';
const cancelBtn = '取消';

const open = (data?: any) => {
  title.value = data?.id ? '编辑策略' : '创建策略';
  if (data.id) {
    formData.value = data;
  } else {
    formData.value = {
      strategyScene: '',
      promotion_text: '',
      pay_price: '',
      pay_channel: '',
      pay_name: '',
      is_active: false,
    };
  }
  visible.value = true;
};

const handleConfirm = async () => {
  // if (!formData.value.strategyScene) return MessagePlugin.error('请输入策略名称场景');
  // if (!formData.value.promotion_text) return MessagePlugin.error('请输入商品描述');
  // if (!formData.value.pay_price) return MessagePlugin.error('请输入商品价格');
  // if (!formData.value.pay_channel) return MessagePlugin.error('请选择商品类型');
  // if (!formData.value.pay_name) return MessagePlugin.error('请输入商品名称');
  // 提交逻辑
  const fn = title.value == '编辑策略' ? updateGoods : createGoods;
  const res = await fn(formData.value);
  MessagePlugin.success(res.message);
  visible.value = false;
  emit('confirm');
};

const handleClose = () => {
  visible.value = false;
};

defineExpose({
  open,
});
</script>
