<template>
  <t-dialog v-model:visible="visible" :header="title" :confirm-btn="confirmBtn" :cancel-btn="cancelBtn" width="500px"
    @confirm="handleConfirm" @close="handleClose">
    <t-form :data="formData" :label-width="100">
      <t-form-item label="商品类型" name="package">
        <t-select v-model="formData.goodsType" :options="packageOptions" placeholder="商品类型" clearable />
      </t-form-item>
      <t-form-item label="策略名称场景" name="strategyScene">
        <t-input v-model="formData.strategyScene" placeholder="输入策略名称" />
      </t-form-item>
      <t-form-item label="用户浏览标签" name="browserTag">
        <t-input v-model="formData.browserTag" placeholder="输入用户浏览标签" />
      </t-form-item>
      <t-form-item label="商品描述" name="promotionCopy">
        <t-input type="number" v-model="formData.description" placeholder="输入促销文案" />
      </t-form-item>
      <t-form-item label="价格" name="price">
        <t-input v-model="formData.price" placeholder="输入价格" />
      </t-form-item>
      <t-form-item label="商品名称" name="name">
        <t-input v-model="formData.name" placeholder="输入商品名称" />
      </t-form-item>
      <t-form-item label="包名" name="packageName">
        <t-input v-model="formData.packageName" placeholder="输入包名" />
      </t-form-item>
      <t-form-item label="优先级" name="sortOrder">
        <t-input type="number" v-model="formData.sortOrder" placeholder="输入优先级" />
      </t-form-item>
    </t-form>
  </t-dialog>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { MessagePlugin } from 'tdesign-vue-next';

import { createGoods, updateGoods } from '@/api/goods';
const emit = defineEmits(['confirm'])
const visible = ref(false);
const title = ref('创建策略');

const formData = ref({
  strategyScene: '',
  // scene: '',
  browserTag: '',
  description: '',
  price: '',
  name: '',
  packageName: '',
  sortOrder: '',
   goodsType:'',
   status:"N"
});
const packageOptions = [
  { label: '金币', value: 'coin' },
  { label: '商品', value: 'goods' },
  { label: '订阅', value: 'subscription' },
  { label: '内容', value: 'content' }
];

const confirmBtn = '确认';
const cancelBtn = '取消';

const open = (data?: any) => {
  title.value = data?.id ? '编辑策略' : '创建策略';
  if (data.id) {
    formData.value = data
  } else {
    formData.value = {
      strategyScene: '',
      // scene: '',
      browserTag: '',
      description: '',
      price: '',
      name: '',
      packageName: '',
      sortOrder: '',
      goodsType:'',
      status:"N"
    }

  }
  visible.value = true;
};

const handleConfirm = async () => {
if (!formData.value.goodsType) return MessagePlugin.error('请选择商品类型')
if (!formData.value.strategyScene) return MessagePlugin.error('请输入策略名称场景')
if (!formData.value.browserTag) return MessagePlugin.error('请输入用户浏览标签')
if (!formData.value.description) return MessagePlugin.error('请输入商品描述')
if (!formData.value.name) return MessagePlugin.error('请输入商品名称')
if (!formData.value.price) return MessagePlugin.error('请输入商品价格')
if (!formData.value.packageName) return MessagePlugin.error('请输入包名')
if (!formData.value.sortOrder) return MessagePlugin.error('请输入优先级')
  // 提交逻辑
  const fn = title.value == '编辑策略' ? updateGoods : createGoods
  const res = await fn(formData.value)
  MessagePlugin.success(res.message)
  visible.value = false;
  emit('confirm')
};

const handleClose = () => {
  visible.value = false;
};

defineExpose({
  open,
});
</script>
