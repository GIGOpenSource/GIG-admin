<template>
  <t-dialog
    v-model:visible="visible"
    :header="title"
    :confirm-btn="confirmBtn"
    :cancel-btn="cancelBtn"
    width="500px"
    @confirm="handleConfirm"
    @close="handleClose"
  >
    <t-form :data="formData" :label-width="100">
      <t-form-item label="所属APP" name="app_name">
        <t-input v-model="formData.app_name" placeholder="所属APP" clearable />
      </t-form-item>
      <t-form-item label="类型关系" name="type">
        <t-input v-model="formData.type" placeholder="商品类型" clearable />
      </t-form-item>
      <t-form-item v-if="!isEdit" label="选择用户" name="user_ids">
        <t-select
          v-model="formData.user_ids"
          :options="userOptions"
          placeholder="选择用户"
          multiple
          clearable
          :max="10"
        />
      </t-form-item>
      <t-form-item label="通知内容" name="content">
        <t-textarea v-model="formData.content" placeholder="输入通知内容" :autosize="{ minRows: 3, maxRows: 6 }" />
      </t-form-item>
      <t-form-item label="发送时间" name="send_time">
        <t-date-picker
          v-model="formData.send_time"
          enable-time-picker
          allow-input
          clearable
          placeholder="选择发送时间"
          class="form-item-content"
          :style="{ width: '100%' }"
          @pick="onPick"
          @change="onChange"
        />
      </t-form-item>
    </t-form>
  </t-dialog>
</template>
<script lang="ts" setup>
import { MessagePlugin, type DialogProps } from 'tdesign-vue-next';
import type { DateRangePickerProps, PrimaryTableCol, TableRowData, DatePickerProps } from 'tdesign-vue-next';

const emit = defineEmits(['confirm']);

import { ref, computed } from 'vue';
import { createInforms, updateInforms } from '@/api/message';
import { getUserList } from '@/api/user';

const visible = ref(false);
const isEdit = ref(false);

import type { DateRangeValue, DateValue } from 'tdesign-vue-next';

const formData = ref<{
  app_name: string;
  type: string;
  user_ids: number[];
  content: string;
  send_time: DateRangeValue | DateValue[] | string;
}>({
  app_name: '',
  type: '',
  user_ids: [],
  content: '',
  send_time: '',
});
const appNameOptions = [
  { label: '商场应用', value: 'mall_app' },
  { label: '社交应用', value: 'social_app' },
  { label: '支付应用', value: 'pay_app' },
  { label: '教育应用', value: 'edu_app' },
  { label: '游戏应用', value: 'game_app' },
  { label: '办公应用', value: 'office_app' },
  { label: '医疗应用', value: 'medical_app' },
  { label: '新闻应用', value: 'news_app' },
];
const typeRelationOptions = [
  { label: '订单更新', value: 'order_update' },
  { label: '好友请求', value: 'friend_request' },
  { label: '账单', value: 'bill_reminder' },
  { label: '开始课程', value: 'course_start' },
  { label: '活动通知', value: 'activity_notice' },
  { label: '会议', value: 'meeting_reminder' },
  { label: '日程提醒', value: 'appointment_reminder' },
  { label: '信息推送', value: 'info_push' },
];

const userTypeOptions = [
  { label: 'VIP', value: true },
  { label: '普通用户', value: false },
];
const title = ref('新建分类');

const confirmBtn = '确认';
const cancelBtn = '取消';
const onPick = (value: any, context?: any) => console.log('onPick:', value, context);
const onChange = (value: any, context?: any) => {
  console.log('onChange:', value, context);
  formData.value.send_time = value;
};
const open = async (data?: any) => {
  console.log(data, 'datat');
  isEdit.value = !!data?.id;
  title.value = isEdit.value ? '编辑通知' : '新建通知';

  // 只有在新建时才获取用户数据
  if (!isEdit.value) {
    await getUserListData();
  }

  if (data && data.id) {
    // 深拷贝，避免弹窗内修改影响table原数据
    formData.value = JSON.parse(JSON.stringify(data));
  } else {
    formData.value = {
      app_name: '',
      type: '',
      user_ids: [],
      content: '',
      send_time: '',
    };
  }
  visible.value = true;
};
const userList = ref([]);

// 将用户数据转换为下拉选项
const userOptions = computed(() => {
  return userList.value.map((user: any) => ({
    label: user.user_nickname,
    value: user.id,
  }));
});

async function getUserListData() {
  const res = await getUserList({});
  console.log(res, 'res');
  userList.value = res.data.results;
  console.log(userList.value, 'userList');
}

const handleConfirm = async () => {
  // 校验必填项（除发送时间）
  if (!formData.value.app_name) return MessagePlugin.error('请输入所属APP');
  if (!formData.value.type) return MessagePlugin.error('请输入类型关系');
  if (!isEdit.value && (!formData.value.user_ids || formData.value.user_ids.length === 0)) {
    return MessagePlugin.error('请选择用户');
  }
  if (!formData.value.content) return MessagePlugin.error('请输入通知内容');

  try {
    // 提交逻辑
    const fn = isEdit.value ? updateInforms : createInforms;

    // 准备提交数据，编辑时不包含 user_ids
    const submitData = { ...formData.value };
    if (isEdit.value) {
      delete submitData.user_ids;
    }

    const res = await fn(submitData);
    MessagePlugin.success(res.message);
    visible.value = false;
    emit('confirm');
  } catch (error) {
    console.error('提交失败:', error);
    MessagePlugin.error('提交失败，请重试');
  }
};

const handleClose = () => {
  visible.value = false;
};

defineExpose({
  open,
});
</script>
-
