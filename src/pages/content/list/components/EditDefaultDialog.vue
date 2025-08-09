<template>
  <!-- 常规内容编辑 -->
  <t-dialog v-model:visible="visible" :width="600" :header="title" confirm-btn="保存" @confirm="onConfirm" @cancel="onCancel">
    <t-form ref="formRef" :model="data" label-width="80px" label-align="left">
      <t-form-item label="主标题" name="title">
        <t-input v-model="data.title" placeholder="输入主标题"  />
      </t-form-item>
      <t-form-item label="正文" name="description">
        <t-input v-model="data.description" placeholder="输入正文"  />
      </t-form-item>
      <t-form-item label="标签" name="tag">
        <t-input v-model="data.tag" placeholder="添加标签"  />
      </t-form-item>
      <t-form-item label="上传媒体文件" name="email">
        <t-input v-model="data.type" placeholder="输入邮箱" />
      </t-form-item>
    </t-form>
  </t-dialog>
</template>
<script setup lang="ts">
import type { DialogProps } from 'tdesign-vue-next';
import { ref } from 'vue';

interface FormData {
  title: string;
  description: string;
  tag: string;
}

const title = ref('内容创建')

const visible = ref(false);

const data = ref<FormData>({
  title: '',
  description: '',
  tag: '',
});

const open = (row?: any) => {
  console.log('🚀 ~ row:', row);
  title.value = row?.id ? '内容编辑' : '内容创建';

  visible.value = true;
};

const onConfirm: DialogProps['onConfirm'] = () => {
  visible.value = false;
};
const onCancel: DialogProps['onCancel'] = () => {
  visible.value = false;
};

defineExpose({
  open,
});
</script>
<style lang="less" scoped></style>
