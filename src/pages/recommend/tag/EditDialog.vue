<template>
  <t-dialog
    v-model:visible="visible"
    :width="600"
    :header="title"
    confirm-btn="保存"
    @cancel="onCancel"
    @confirm="onConfirm"
  >
    <t-form ref="formRef" :model="data" label-width="80px" label-align="left">
      <t-form-item label="标签名" name="name">
        <t-input v-model="data.name" class="form-item-content" placeholder="输入标签名" />
      </t-form-item>
      <t-form-item label="标签状态" name="status">
        <t-select v-model="data.status" placeholder="选择标签状态">
          <t-option key="activate" value="activate" label="激活" />
          <t-option key="deactivate" value="deactivate" label="未激活" />
        </t-select>
      </t-form-item>
      <t-form-item label="标签描述" name="description">
        <t-input v-model="data.description" class="form-item-content" placeholder="输入标签描述" />
      </t-form-item>
      <t-form-item label="标签归属" name="type">
        <t-select v-model="data.type" placeholder="请选择标签归属">
          <t-option key="content_found" value="content_found" label="发现" />
          <t-option key="content_sift" value="content_sift" label="精选" />
          <t-option key="content_game" value="content_game" label="游戏" />
        </t-select>
      </t-form-item>
    </t-form>
  </t-dialog>
</template>
<script setup lang="ts">
import type { DialogProps } from 'tdesign-vue-next';
import { MessagePlugin } from 'tdesign-vue-next';
import { ref, computed } from 'vue';
import { updateTag, createTag } from '@/api/recommend';
const emit = defineEmits(['confirm']);
interface FormData {
  name: string;
  status: string;
  description: string;
  type: string;
}
const visible = ref(false);
const isEdit = ref(false);
const data = ref<FormData>({
  name: '',
  status: '',
  description: '',
  type: '',
});

// 动态标题
const title = computed(() => (isEdit.value ? '标签编辑' : '新增标签'));
const open = (row?: any) => {
  console.log('🚀 ~ row:', row);
  isEdit.value = !!row;

  if (row) {
    // 编辑模式：深拷贝，避免弹窗内修改影响table原数据
    data.value = JSON.parse(JSON.stringify(row));
  } else {
    // 新增模式：重置表单数据
    data.value = {
      name: '',
      status: 'activate', // 默认激活状态
      description: '',
      type: 'content_found', // 默认发现类型
    };
  }
  visible.value = true;
};

const onCancel: DialogProps['onCancel'] = () => {
  visible.value = false;
};
const onConfirm: DialogProps['onConfirm'] = async () => {
  try {
    // 表单校验
    if (!data.value.name) {
      MessagePlugin.error('请输入标签名');
      return;
    }
    if (!data.value.status) {
      MessagePlugin.error('请选择标签状态');
      return;
    }
    if (!data.value.type) {
      MessagePlugin.error('请选择标签归属');
      return;
    }

    const params = {
      ...data.value,
    };

    console.log('提交数据:', params);
    const res = isEdit.value ? await updateTag(params) : await createTag(params);
    console.log('接口返回:', res);

    visible.value = false;
    MessagePlugin.success(res.message);
    emit('confirm');
  } catch (error) {
    console.error('操作失败:', error);
    MessagePlugin.error(isEdit.value ? '编辑失败，请重试' : '新增失败，请重试');
  }
};
defineExpose({
  open,
});
</script>
<style lang="less" scoped></style>
