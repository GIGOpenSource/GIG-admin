<template>
  <t-dialog v-model:visible="visible" :width="600" header="产品功能编辑" @cancel="onCancel" confirm-btn="保存">
    <t-form :model="data" ref="formRef" label-width="120px" label-align="left">
      <t-form-item label="选择菜单级别" name="username">
        <t-select v-model="data.type" placeholder="请选择用户标签">
          <t-option label="一级" />
          <t-option label="二/三级" />
        </t-select>
      </t-form-item>
      <t-form-item label="选择父级" name="username">
        <t-input v-model="data.name" class="form-item-content" placeholder="请输入用户名" />
      </t-form-item>
      <t-form-item label="选择模版" name="username">
        <t-input v-model="data.name" class="form-item-content" placeholder="请输入用户名" />
      </t-form-item>
      <t-form-item label="用户标签(多选)" name="email">
        <t-select v-model="data.type" :options="userTags" placeholder="请选择用户标签" multiple />
      </t-form-item>
      <t-form-item label="内容标签(多选)" name="email">
        <t-input v-model="data.type" class="form-item-content" placeholder="请输入邮箱" />
      </t-form-item>
      <t-form-item label="选择APP" name="email">
        <t-input v-model="data.type" class="form-item-content" placeholder="请输入邮箱" />
      </t-form-item>
      <t-form-item label="用户ID范围" name="email">
        <t-range-input v-model="data.range" class="form-item-content" placeholder="请输入邮箱" />
      </t-form-item>
      <t-form-item label="排序" name="email">
        <t-input v-model="data.type" class="form-item-content" placeholder="从左到右/从上到下，数字小靠前" />
      </t-form-item>
      <t-form-item label="优先级" name="email">
        <t-input v-model="data.type" class="form-item-content" placeholder="数字大优先级高" />
      </t-form-item>
    </t-form>
  </t-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { SelectProps } from 'tdesign-vue-next';

import { DialogProps } from 'tdesign-vue-next';

interface FormData {
  name: string;
  type: string;
  range: Array<string | number>;
}
const visible = ref(false);
const data = ref<FormData>({
  name: '',
  type: '',
  range: ['', ''],
});

// 用户标签数据
const userTags = ref<SelectProps['options']>([
  {
    label: '全选',
    checkAll: true,
  },
  {
    label: '架构云',
    value: '1',
  },
  {
    label: '大数据',
    value: '2',
  },
  {
    label: '区块链',
    value: '3',
  },
  {
    label: '物联网',
    value: '4',
    disabled: true,
  },
  {
    label: '人工智能',
    value: '5',
  },
]);
// 内容标签数据

const open = () => {
  visible.value = true;
};

const onCancel: DialogProps['onCancel'] = () => {
  visible.value = false;
};

defineExpose({
  open,
});
</script>

<style lang="less" scoped></style>
