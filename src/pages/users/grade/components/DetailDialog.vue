<template>
  <t-dialog v-model:visible="visible" :width="600" header="等级详情" confirm-btn="保存" @cancel="onCancel">
    <t-form ref="formRef" :model="data" label-width="120px" label-align="left">
      <t-form-item label="等级标识" name="username">
        <t-input v-model="data.name" class="form-item-content" placeholder="请输入用户名" />
      </t-form-item>
      <t-form-item label="等级最小消费金额" name="username">
        <t-input v-model="data.name" class="form-item-content" placeholder="请输入用户名" />
      </t-form-item>
      <t-form-item label="等级最大消费金额" name="email">
        <t-input v-model="data.type" class="form-item-content" placeholder="请输入邮箱" />
      </t-form-item>
      <t-form-item label="所属APP" name="email">
        <select-app v-model="data.name" @click="handleChangeApp" />
      </t-form-item>
    </t-form>
  </t-dialog>
</template>
<script setup lang="ts">
import type { DialogProps, SelectProps } from 'tdesign-vue-next';
import { ref } from 'vue';

interface FormData {
  name: string;
  type: string;
}
const visible = ref(false);
const data = ref<FormData>({
  name: '',
  type: '',
});

const open = () => {
  visible.value = true;
};

const onCancel: DialogProps['onCancel'] = () => {
  visible.value = false;
};
// 切换APP
const handleChangeApp: SelectProps['onChange'] = (ctx) => {
  console.log('Selected app:', ctx);
  // 这里可以添加处理逻辑，比如更新图表或列表数据
};

defineExpose({
  open,
});
</script>
<style lang="less" scoped></style>
