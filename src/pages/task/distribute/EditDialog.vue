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
      <t-form-item label="任务类型" name="task_template_type">
        <t-select v-model="data.task_template_type" placeholder="选择任务类型" class="form-item-content">
          <t-option key="daily" value="daily" label="激活" />
          <t-option key="checkin" value="checkin" label="未激活" />
          <t-option key="novice" value="novice" label="未激活" />
        </t-select>
      </t-form-item>
      <t-form-item label="任务名称" name="task_template_name">
        <t-input v-model="data.task_template_name" class="form-item-content" placeholder="输入任务名称" />
      </t-form-item>
      <t-form-item label="任务描述" name="description">
        <t-textarea
          v-model="data.description"
          class="form-item-content"
          placeholder="输入任务描述"
          :autosize="{ minRows: 3, maxRows: 6 }"
        />
      </t-form-item>
      <t-form-item label="模板状态" name="is_active">
        <t-select v-model="data.is_active" placeholder="选择模板状态" class="form-item-content">
          <t-option key="true" :value="true" label="激活" />
          <t-option key="false" :value="false" label="未激活" />
        </t-select>
      </t-form-item>

      <t-form-item label="模板类型" name="type">
        <t-select v-model="data.type" placeholder="选择模板类型" class="form-item-content">
          <t-option key="daily" value="daily" label="每日任务" />
          <t-option key="checkin" value="checkin" label="签到任务" />
          <t-option key="novice" value="novice" label="新手任务" />
        </t-select>
      </t-form-item>
    </t-form>
  </t-dialog>
</template>

<script setup lang="ts">
import type { DialogProps } from 'tdesign-vue-next';
import { MessagePlugin } from 'tdesign-vue-next';
import { ref, computed } from 'vue';
import { updateTask, createTask, updateRewardTask } from '@/api/task';

const emit = defineEmits(['confirm']);

interface FormData {
  task_template_name: string;
  task_template_type: string;
  description: string;
  is_active: boolean;
  type: string;
}

const visible = ref(false);
const isEdit = ref(false);
const data = ref<FormData>({
  task_template_name: '',
  task_template_type: '',
  description: '',
  is_active: false,
  type: '',
});

// 动态标题
const title = computed(() => (isEdit.value ? '任务编辑' : '新增任务'));

const open = (row?: any) => {
  isEdit.value = !!row;
  if (row) {
    // 编辑模式：深拷贝，避免弹窗内修改影响table原数据
    data.value = JSON.parse(JSON.stringify(row));
  } else {
    // 新增模式：重置表单数据
    data.value = {
      task_template_name: '',
      task_template_type: '',
      description: '',
      is_active: false,
      type: '',
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
      MessagePlugin.error('请输入任务名称');
      return;
    }
    if (!data.value.type) {
      MessagePlugin.error('请选择模板类型');
      return;
    }

    const params = {
      ...data.value,
    };
    const res = isEdit.value ? await updateRewardTask(params) : await createTask(params);
    visible.value = false;
    MessagePlugin.success(res.message);
    emit('confirm');
  } catch (error) {
    MessagePlugin.error(isEdit.value ? '编辑失败，请重试' : '新增失败，请重试');
  }
};

defineExpose({
  open,
});
</script>

<style lang="less" scoped>
.form-item-content {
  width: 100%;
}
</style>
