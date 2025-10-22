<template>
  <t-dialog
    v-model:visible="visible"
    :header="isEdit ? '编辑规则' : '新建规则'"
    width="700px"
    :confirm-btn="isEdit ? '更新' : '创建'"
    @confirm="handleConfirm"
    @cancel="handleCancel"
  >
    <t-form ref="formRef" :data="formData" :rules="rules" :label-width="100">
      <t-form-item label="规则名称" name="name">
        <t-input v-model="formData.name" placeholder="请输入规则名称" />
      </t-form-item>

      <t-form-item label="规则类型" name="type">
        <t-select v-model="formData.type" placeholder="请选择规则类型">
          <t-option key="participation" value="participation" label="参与规则" />
          <t-option key="reward" value="reward" label="奖励规则" />
          <t-option key="penalty" value="penalty" label="惩罚规则" />
          <t-option key="special" value="special" label="特殊规则" />
        </t-select>
      </t-form-item>

      <t-form-item label="适用玩法" name="gameplay_id">
        <t-select v-model="formData.gameplay_id" placeholder="请选择适用玩法" clearable>
          <t-option
            v-for="gameplay in gameplayList"
            :key="gameplay.id"
            :value="gameplay.id"
            :label="gameplay.name"
          />
        </t-select>
      </t-form-item>

      <t-form-item label="规则状态" name="status">
        <t-radio-group v-model="formData.status">
          <t-radio value="active">启用</t-radio>
          <t-radio value="inactive">禁用</t-radio>
        </t-radio-group>
      </t-form-item>

      <t-form-item label="规则内容" name="content">
        <t-textarea
          v-model="formData.content"
          placeholder="请输入规则内容"
          :maxlength="2000"
          :autosize="{ minRows: 4, maxRows: 8 }"
        />
      </t-form-item>

      <t-form-item label="规则说明" name="description">
        <t-textarea
          v-model="formData.description"
          placeholder="请输入规则说明"
          :maxlength="500"
        />
      </t-form-item>

      <t-form-item label="优先级" name="priority">
        <t-input-number v-model="formData.priority" :min="1" :max="100" placeholder="数字越小优先级越高" />
      </t-form-item>

      <t-form-item label="生效条件" name="conditions">
        <t-textarea
          v-model="formData.conditions"
          placeholder="请输入生效条件（可选）"
          :maxlength="500"
        />
      </t-form-item>
    </t-form>
  </t-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { MessagePlugin } from 'tdesign-vue-next';
import { createGameplayRule, updateGameplayRule, getGameplayList } from '@/api/gameplay';

interface FormData {
  id?: number;
  name: string;
  type: string;
  gameplay_id: number | null;
  status: string;
  content: string;
  description: string;
  priority: number;
  conditions: string;
}

interface GameplayItem {
  id: number;
  name: string;
}

const visible = ref(false);
const isEdit = ref(false);
const formRef = ref();
const gameplayList = ref<GameplayItem[]>([]);

const formData = reactive<FormData>({
  name: '',
  type: '',
  gameplay_id: null,
  status: 'active',
  content: '',
  description: '',
  priority: 1,
  conditions: '',
});

const rules = {
  name: [{ required: true, message: '请输入规则名称', type: 'error' }],
  type: [{ required: true, message: '请选择规则类型', type: 'error' }],
  status: [{ required: true, message: '请选择规则状态', type: 'error' }],
  content: [{ required: true, message: '请输入规则内容', type: 'error' }],
  priority: [{ required: true, message: '请输入优先级', type: 'error' }],
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
    gameplay_id: null,
    status: 'active',
    content: '',
    description: '',
    priority: 1,
    conditions: '',
  });
};

const handleConfirm = async () => {
  const valid = await formRef.value?.validate();
  if (!valid) return;

  try {
    if (isEdit.value) {
      await updateGameplayRule(formData);
      MessagePlugin.success('更新成功');
    } else {
      await createGameplayRule(formData);
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

const loadGameplayList = async () => {
  try {
    const res = await getGameplayList({ pageSize: 1000 });
    gameplayList.value = res.data.results;
  } catch (error) {
    console.error('加载玩法列表失败:', error);
  }
};

const emit = defineEmits<{
  confirm: [];
}>();

defineExpose({
  open,
});

onMounted(() => {
  loadGameplayList();
});
</script>
