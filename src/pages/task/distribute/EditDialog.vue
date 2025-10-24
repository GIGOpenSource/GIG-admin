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
      <t-form-item label="任务类型" name="task_template">
        <t-select v-model="data.task_template" placeholder="选择任务类型" class="form-item-content">
          <t-option key="1" :value="1" label="每日任务" />
          <t-option key="2" :value="2" label="签到任务" />
          <t-option key="3" :value="3" label="新手任务" />
        </t-select>
      </t-form-item>
      <t-form-item label="任务领取人" name="user">
        <t-select v-model="data.user" placeholder="选择任务领取人" class="form-item-content" :options="userList" />
      </t-form-item>
      <t-form-item label="任务名称" name="name">
        <t-input v-model="data.name" class="form-item-content" placeholder="输入任务名称" />
      </t-form-item>
      <template v-if="data.task_template == '1' || data.task_template == '3'">
        <t-form-item label="任务状态" name="status">
          <t-select v-model="data.status" placeholder="选择任务状态" class="form-item-content">
            <t-option key="pending" value="pending" label="等待领取" />
            <t-option key="claimed" value="claimed" label="已领取" />
          </t-select>
        </t-form-item>
        <t-form-item label="任务介绍" name="description">
          <t-textarea
            v-model="data.description"
            placeholder="输入任务介绍"
            class="form-item-content"
            :autosize="{ minRows: 3, maxRows: 6 }"
          />
        </t-form-item>
      </template>
    </t-form>
  </t-dialog>
</template>

<script setup lang="ts">
import type { DialogProps } from 'tdesign-vue-next';
import { MessagePlugin } from 'tdesign-vue-next';
import { ref, computed } from 'vue';
import { updateTask, createTask, updateRewardTask } from '@/api/task';
import { getUserList } from '@/api/user';

const emit = defineEmits(['confirm']);

interface FormData {
  name: string;
  task_template: string;
  description: string;
  status: string;
  user: number;
}

const visible = ref(false);
const isEdit = ref(false);
const userList = ref([]);
const data = ref<FormData>({
  name: '',
  task_template: '',
  description: '',
  status: '',
  user: 0,
});

// 动态标题
const title = computed(() => (isEdit.value ? '任务编辑' : '新增任务'));

// 获取用户列表
const fetchUserList = async () => {
  try {
    const res = await getUserList({});
    userList.value = res.data.results.map((item: any) => ({
      label: item.user_nickname || item.username,
      value: item.id,
    }));
  } catch (error) {
    console.error('获取用户列表失败:', error);
  }
};

const open = (row?: any) => {
  isEdit.value = !!row;
  fetchUserList(); // 获取用户列表
  if (row) {
    // 编辑模式：深拷贝，避免弹窗内修改影响table原数据
    data.value = JSON.parse(JSON.stringify(row));
  } else {
    // 新增模式：重置表单数据
    data.value = {
      name: '',
      task_template: '',
      description: '',
      status: 'pending',
      user: 0,
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
    if (!data.value.task_template) {
      MessagePlugin.error('请选择任务类型');
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
