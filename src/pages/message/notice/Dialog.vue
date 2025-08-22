<template>
  <t-dialog
    v-model:visible="visible"
   :header=title
    :confirm-btn="confirmBtn"
    :cancel-btn="cancelBtn"
    width="500px"
    @confirm="handleConfirm"
    @close="handleClose"
  >
    <t-form :data="formData" :label-width="100">
      <t-form-item label="所属APP" name="appName">
        <t-select v-model="formData.appName" :options="appNameOptions" placeholder="输入所属APP" clearable />

      </t-form-item>
      <t-form-item label="类型关系" name="typeRelation">
        <t-select v-model="formData.typeRelation" :options="typeRelationOptions" placeholder="商品类型" clearable />

      </t-form-item>
      <t-form-item label="用户类型" name="userType">
        <t-select v-model="formData.userType" :options="userTypeOptions" placeholder="商品类型" clearable />

      </t-form-item>
      <t-form-item label="通知内容" name="notificationContent">
        <t-textarea v-model="formData.notificationContent" placeholder="输入通知内容" :autosize="{ minRows: 3, maxRows: 6 }" />
      </t-form-item>
      <t-form-item label="发送时间" name="sendTime">
        <t-date-picker
          v-model="formData.sendTime"
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
import type { DateRangePickerProps, PrimaryTableCol, TableRowData,DatePickerProps } from 'tdesign-vue-next';

const emit = defineEmits(['confirm'])

import { ref } from 'vue';
import { createInforms ,updateInforms } from '@/api/message';

const visible = ref(false);

import type { DateRangeValue,DateValue } from 'tdesign-vue-next';

const formData = ref<{
  appName: string;
  typeRelation: string;
  userType: string;
  notificationContent: string;
  sendTime: DateRangeValue | DateValue[] | string;
}>({
  appName: '',
  typeRelation: '',
  userType: '',
  notificationContent: '',
  sendTime: '',
});
const appNameOptions = [
  { label: '商场应用', value: 'mall_app' },
  { label: '社交应用', value: 'social_app' },
  { label: '支付应用', value: 'pay_app' },
  { label: '教育应用', value: 'edu_app' },
  { label: '游戏应用', value: 'game_app' },
  { label: '办公应用', value: 'office_app' },
  { label: '医疗应用', value: 'medical_app' },
  { label: '新闻应用', value: 'news_app' }
];
const typeRelationOptions = [
  { label: '订单更新', value: 'order_update' },
  { label: '好友请求', value: 'friend_request' },
  { label: '账单', value: 'bill_reminder' },
  { label: '开始课程', value: 'course_start' },
  { label: '活动通知', value: 'activity_notice' },
  { label: '会议', value: 'meeting_reminder' },
  { label: '日程提醒', value: 'appointment_reminder' },
  { label: '信息推送', value: 'info_push' }
];

const userTypeOptions = [
  { label: '买者', value: 'buyer' },
  { label: '用户', value: 'user' },
  { label: '成员', value: 'member' },
  { label: '学生', value: 'student' },    
  { label: '玩家', value: 'palyer' },
  { label: '采访人员', value: 'emplyee' },
  { label: '病人', value: 'patient' },
  { label: '读者', value: 'reader' }
];
const title = ref('新建分类');

const confirmBtn = '确认';
const cancelBtn = '取消';
const onPick: DateRangePickerProps['onPick'] = (value, context) => console.log('onPick:', value, context);
const onChange: DateRangePickerProps['onChange'] = (value, context) => {
  console.log('onChange:', value, context);
  formData.value.sendTime = value;

};
const open = (data?: any) => {
  console.log(data,'datat');
  title.value = data?.id ? '编辑通知' : '新建通知';
  if (data && data.id) {
    // 深拷贝，避免弹窗内修改影响table原数据
    formData.value = JSON.parse(JSON.stringify(data));
  } else {
    formData.value = {
      appName: '',
      typeRelation: '',
      userType: '',
      notificationContent: '',
      sendTime: '',
    }
  }
  visible.value = true;
};

const handleConfirm = async () => {
  // 校验必填项（除发送时间）
  if (!formData.value.appName) return MessagePlugin.error('请选择所属APP');
  if (!formData.value.typeRelation) return MessagePlugin.error('请选择类型关系');
  if (!formData.value.userType) return MessagePlugin.error('请选择用户类型');
  if (!formData.value.notificationContent) return MessagePlugin.error('请输入通知内容');
  // 提交逻辑
  
  const fn = title.value == '编辑通知' ? updateInforms : createInforms;
  const res = await fn(formData.value);
  MessagePlugin.success(res.message);
  visible.value = false;
  emit('confirm');
};

const handleClose = () => {
  visible.value = false;
};

defineExpose({
  open,
});
</script>
-