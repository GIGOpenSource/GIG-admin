<template>
  <t-dialog v-model:visible="visible" :header=title :confirm-btn="confirmBtn" :cancel-btn="cancelBtn" width="400px"
    @confirm="handleConfirm" @close="handleClose">
    <t-form :data="formData" :label-width="80" label-align="left">
      <t-form-item label="uid" name="bloggerUid">
        <t-input v-model="formData.bloggerUid" placeholder="输入博主id" />
      </t-form-item>
      <t-form-item label="昵称" name="bloggerNickname">
        <t-input v-model="formData.bloggerNickname" placeholder="输入博主昵称" />
      </t-form-item>
      <t-form-item label="头像" name="avatar">
        <t-input v-model="formData.avatar" placeholder="输入头像" />
      </t-form-item>
      <t-form-item label="手机号" name="phone">
        <t-input v-model="formData.phone" placeholder="输入手机号" />
      </t-form-item>
      <t-form-item label="标签" name="tags">
        <t-input v-model="formData.tags" placeholder="输入标签" />
      </t-form-item>
      <t-form-item label="签名" name="bloggerSignature">
        <t-input v-model="formData.bloggerSignature" placeholder="输入签名" />
      </t-form-item>
      <t-form-item label="账户" name="account">
        <t-input v-model="formData.account" placeholder="输入账户" />
      </t-form-item>
      <!-- <t-form-item label="类型" name="homepage">
        <t-input v-model="formData.homepage" placeholder="输入主页地址" />
      </t-form-item> -->
    </t-form>
  </t-dialog>
</template>
<script lang="ts" setup>
import { MessagePlugin, type DialogProps } from 'tdesign-vue-next';
const emit = defineEmits(['confirm'])
import { ref } from 'vue';
import { getBlogList, createBlog, updateBlog, delBlog } from '@/api/blogger';
const visible = ref(false);
const formData = ref({
  bloggerUid: '',
  bloggerNickname: '',
  homepageUrl: '',
  bloggerSignature: '',
  avatar: '',
  tags: '',
  isEnter: "N",
  phone: '',
  account: '',
  type: 'tech'
});
const title = ref('新建分类');
const confirmBtn = '确认';
const cancelBtn = '取消';

const open = (data?: any) => {
  console.log(data,'datat');
  
  title.value = data?.id ? '编辑博主' : '新建博主';
  if (data.id) {
    formData.value = data
  } else {
    formData.value = {
      bloggerUid: '',
      bloggerNickname: '',
      homepageUrl: '',
      bloggerSignature: '',
      avatar: '',
      tags: '',
      isEnter: "N",
      phone: '',
      account: '',
      type: 'tech'
    }
  }
  visible.value = true;
};

const handleConfirm = async () => {
  if(!formData.value.bloggerNickname) return   MessagePlugin.error('请输入博主昵称')
  const fn = title.value == '编辑博主' ? updateBlog : createBlog
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
