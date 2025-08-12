<template>
  <t-dialog v-model:visible="visible" :header="title" :confirm-btn="confirmBtn" :cancel-btn="cancelBtn" width="500px"
    @confirm="handleConfirm" @close="handleClose">
    <t-form :data="formData" :label-width="100" label-align="left">
      <t-form-item label="特权文案" name="powerName">
        <t-input v-model="formData.powerName" placeholder="输入特权文案" />
      </t-form-item>
      <t-form-item label="附件" name="scene">
        <t-input v-model="formData.attachment" placeholder="上传附件" />
      </t-form-item>
      <t-form-item label="VIP类型" name="userTags">
        <t-select placeholder="选择VIP类型" v-model="formData.vipName">
          <t-option value="VIP类型1" label="VIP类型1"></t-option>
          <t-option value="VIP类型2" label="VIP类型2"></t-option>
        </t-select>
      </t-form-item>
      <t-form-item label="备注" name="promotionCopy">
        <t-input v-model="formData.remark" placeholder="输入备注" />
      </t-form-item>
      <t-form-item label="优先级" name="price">
        <t-input v-model="formData.priority" placeholder="输入优先级" />
      </t-form-item>
    </t-form>
  </t-dialog>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { updateVip, createVip } from '@/api/goods';
import { MessagePlugin } from 'tdesign-vue-next';
const emit = defineEmits(['confirm'])
const visible = ref(false);
const title = ref('新增VIP特权配置');
const formData = ref({
  powerName: '',
  attachment: '',
  vipName: '',
  remark: '',
  priority: '',
});

const confirmBtn = '确认';
const cancelBtn = '取消';

const open = (data?: any) => {
  title.value = data?.id ? '编辑VIP特权配置' : '新增VIP特权配置';
  if (data) {
    formData.value = data
  } else {
    formData.value.powerName = ''
    formData.value.attachment = ''
    formData.value.vipName = ''
    formData.value.remark = ''
    formData.value.priority = ''
  }
  visible.value = true;
};

const handleConfirm = async () => {
  if (!formData.value.powerName) return MessagePlugin.error('请输入特权文案')
  if (!formData.value.attachment) return MessagePlugin.error('请上传附件')
  if (!formData.value.vipName) return MessagePlugin.error('请选择vip类型')
  if (!formData.value.remark) return MessagePlugin.error('请输入备注')
  if (!formData.value.priority) return MessagePlugin.error('请输入优先级')
  // 提交逻辑
  const fn = title.value == '编辑VIP特权配置' ? updateVip : createVip
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
