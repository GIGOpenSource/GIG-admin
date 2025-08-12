<template>
  <t-dialog v-model:visible="visible" :header="title" :confirm-btn="confirmBtn" :cancel-btn="cancelBtn" width="400px"
    @confirm="handleConfirm" @close="handleClose">
    <t-form :data="formData" :label-width="80">
      <t-form-item label="博主UID" name="bloggerUid">
        <t-input v-model="formData.bloggerUid" placeholder="输入博主UID" />
      </t-form-item>

      <t-form-item label="博主昵称" name="bloggerNickname">
        <t-input v-model="formData.bloggerNickname" placeholder="输入博主昵称" />
      </t-form-item>
      <t-form-item label="主页地址" name="homepageUrl">
        <t-input v-model="formData.homepageUrl" placeholder="输入主页地址" />
      </t-form-item>
    </t-form>
  </t-dialog>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { MessagePlugin, type DialogProps } from 'tdesign-vue-next';
import { createBlogCrawler, updateBlogCrawler } from '@/api/blogger';
const emit = defineEmits(['confirm'])
const title = ref('创建任务');

const visible = ref(false);

const formData = ref({
  bloggerUid: '',
  homepageUrl: '',
  bloggerNickname: ''
});

const confirmBtn = '确认';
const cancelBtn = '取消';

const open = (data?: any) => {
  title.value = data?.id ? '编辑任务' : '新建任务';
  if (data) {
    formData.value = data
  } else {
    formData.value.bloggerUid = '';
    formData.value.homepageUrl = '';
    formData.value.bloggerNickname = '';
  }
  visible.value = true;
};

const handleConfirm = async () => {
  if (!formData.value.bloggerUid) return MessagePlugin.error('请输入博主uid')
  if (!formData.value.bloggerNickname) return MessagePlugin.error('请输入博主名称')
  if (!formData.value.homepageUrl) return MessagePlugin.error('请输入主页地址')
  // 提交逻辑
  const fn = title.value == '编辑任务' ? updateBlogCrawler : createBlogCrawler
  const res = await fn(formData.value)
  MessagePlugin.success(res.message)
  visible.value = false;
  emit('confirm')
};

const handleClose = () => {
  visible.value = false;
};

defineExpose({
  open,
});
</script>
