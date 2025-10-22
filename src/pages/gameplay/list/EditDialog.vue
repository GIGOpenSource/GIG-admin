<template>
  <t-dialog
    v-model:visible="visible"
    :header="isEdit ? '编辑玩法' : '新建玩法'"
    width="600px"
    :confirm-btn="isEdit ? '更新' : '创建'"
    @confirm="handleConfirm"
    @cancel="handleCancel"
  >
    <t-form ref="formRef" :data="formData" :rules="rules" :label-width="100">
      <t-form-item label="玩法名称" name="name">
        <t-input v-model="formData.name" placeholder="请输入玩法名称" />
      </t-form-item>

      <t-form-item label="玩法类型" name="type">
        <t-select v-model="formData.type" placeholder="请选择玩法类型">
          <t-option key="daily" value="daily" label="日常玩法" />
          <t-option key="event" value="event" label="活动玩法" />
          <t-option key="special" value="special" label="特殊玩法" />
        </t-select>
      </t-form-item>

      <t-form-item label="玩法状态" name="status">
        <t-radio-group v-model="formData.status">
          <t-radio value="active">启用</t-radio>
          <t-radio value="inactive">禁用</t-radio>
        </t-radio-group>
      </t-form-item>

      <t-form-item label="玩法描述" name="description">
        <t-textarea v-model="formData.description" placeholder="请输入玩法描述" :maxlength="500" />
      </t-form-item>

      <t-form-item label="参与条件" name="conditions">
        <t-textarea v-model="formData.conditions" placeholder="请输入参与条件" :maxlength="200" />
      </t-form-item>

      <t-form-item label="奖励设置" name="rewards">
        <t-textarea v-model="formData.rewards" placeholder="请输入奖励设置" :maxlength="200" />
      </t-form-item>
    </t-form>
  </t-dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { MessagePlugin } from 'tdesign-vue-next';
import { createGameplay, updateGameplay } from '@/api/gameplay';

interface FormData {
  id?: number;
  name: string;
  type: string;
  status: string;
  description: string;
  conditions: string;
  rewards: string;
}

const visible = ref(false);
const isEdit = ref(false);
const formRef = ref();

const formData = reactive<FormData>({
  name: '',
  type: '',
  status: 'active',
  description: '',
  conditions: '',
  rewards: '',
});

const rules = {
  name: [{ required: true, message: '请输入玩法名称', type: 'error' }],
  type: [{ required: true, message: '请选择玩法类型', type: 'error' }],
  status: [{ required: true, message: '请选择玩法状态', type: 'error' }],
  description: [{ required: true, message: '请输入玩法描述', type: 'error' }],
};

const open = (data?: FormData) => {
  visible.value = true;
  isEdit.value = !!data;

  if (data) {
    Object.assign(formData, data);
  } else {
    resetForm();
  }
};

const resetForm = () => {
  Object.assign(formData, {
    name: '',
    type: '',
    status: 'active',
    description: '',
    conditions: '',
    rewards: '',
  });
};

const handleConfirm = async () => {
  const valid = await formRef.value?.validate();
  if (!valid) return;

  try {
    if (isEdit.value) {
      await updateGameplay(formData);
      MessagePlugin.success('更新成功');
    } else {
      await createGameplay(formData);
      MessagePlugin.success('创建成功');
    }

    visible.value = false;
    emit('confirm');
  } catch (error) {
    console.error('操作失败:', error);
    MessagePlugin.error(isEdit.value ? '更新失败' : '创建失败');
  }
};

const handleCancel = () => {
  visible.value = false;
  resetForm();
};

const emit = defineEmits<{
  confirm: [];
}>();

defineExpose({
  open,
});
</script>
