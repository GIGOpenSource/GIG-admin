<template>
  <t-dialog v-model:visible="visible" :width="600" header="标签编辑" confirm-btn="保存" @cancel="onCancel" @confirm="onConfirm">
    <t-form ref="formRef" :model="data" label-width="80px" label-align="left">
      <t-form-item label="标签名" name="name">
        <t-input v-model="data.name" class="form-item-content" placeholder="输入标签名" readonly />
      </t-form-item>
      <t-form-item label="标签类型" name="tagType">
        <!-- <t-input v-model="data.tagType" class="form-item-content" placeholder="输入标签类型" readonly /> -->
        <t-select v-model="data.tagType" placeholder="选择标签类型"  readonly>
           <t-option v-for="val in tagTypeOptions" :key="val.value" :value="val.value" :label="val.label"  />
        </t-select>
      </t-form-item>
      <t-form-item label="标签等级" name="tagType">
        <!-- <t-input v-model="data.tagType" class="form-item-content" placeholder="输入标签等级" readonly /> -->
        <t-select v-model="data.tagType" placeholder="选择标签等级"  readonly>
           <t-option v-for="val in tagTypeOptions" :key="val.value" :value="val.value" :label="val.label"  />
        </t-select>
      </t-form-item>
      <t-form-item label="标签说明" name="description">
        <t-input v-model="data.description" class="form-item-content" placeholder="输入标签说明" />
      </t-form-item>
    </t-form>
  </t-dialog>
</template>
<script setup lang="ts">
import type { DialogProps } from 'tdesign-vue-next';
import {
  MessagePlugin,
} from 'tdesign-vue-next';
import { ref } from 'vue';
import { updateTag } from '@/api/recommend';
const emit = defineEmits(['confirm'])
interface FormData {
  name: string;
  tagType: string;
  description: string;
}
const visible = ref(false);
const data = ref<FormData>({
  name: '',
  tagType: '',
  description:'',
});
const tagTypeOptions = [
  { label: '内容', value: 'content' },
  { label: '兴趣', value: 'interest' },
  { label: '系统', value: 'system' },
];
const open = (row: any) => {
  console.log('🚀 ~ row:', row);
  // 深拷贝，避免弹窗内修改影响table原数据
  data.value = JSON.parse(JSON.stringify(row));
  visible.value = true;
};

const onCancel: DialogProps['onCancel'] = () => {
  visible.value = false;
};
const onConfirm: DialogProps['onConfirm'] = async () => {
  const params = {
    ...data.value,
  };

  const res = await updateTag(params)

  visible.value = false;
  MessagePlugin.success(res.message);
  emit('confirm')

};
defineExpose({
  open,
});
</script>
<style lang="less" scoped></style>
