<template>
  <t-dialog v-model:visible="visible" :header="title" :confirm-btn="confirmBtn" :cancel-btn="cancelBtn" width="400px"
    @confirm="handleConfirm" @close="handleClose">
    <t-form :data="formData" :label-width="80" >
      <!-- <t-form-item label="博主UID" name="bloggerUid">
        <t-input v-model="formData.bloggerUid" placeholder="输入博主UID" />
      </t-form-item> -->

      <t-form-item label="选择博主" name="bloggerNickname">
         <t-select v-model="formData.bloggerUid" :options="bloggerList"
         placeholder="选择博主"  clearable @change="(value, label) => handleChange(value,label)"/>
      </t-form-item>
      <t-form-item label="主页地址" name="homepageUrl">
        <t-input type="text" v-model="formData.homepageUrl" placeholder="输入主页地址" />
      </t-form-item>
    </t-form>
  </t-dialog>
  
</template>
<script lang="ts" setup>
import { ref, reactive } from 'vue';
import { MessagePlugin, type DialogProps} from 'tdesign-vue-next';
import { createBlogCrawler, updateBlogCrawler,getBlogAll} from '@/api/blogger';
const emit = defineEmits(['confirm'])
const title = ref('创建任务');
const visible = ref(false);

const formData = ref({
  bloggerUid: '',
  homepageUrl: '',
  bloggerNickname: ''
});
const bloggerList = ref([])

const confirmBtn = '确认';
const cancelBtn = '取消';

const open = (data?: any) => {
  console.log('3333');
  
  fetchDataList()
  title.value = data?.id ? '编辑任务' : '新建任务';
  if (data) {
    formData.value = data
  } else {
    formData.value = {
  bloggerUid: '',
  homepageUrl: '',
  bloggerNickname: ''
}
  }
  visible.value = true;
};

const fetchDataList = async () => {
  const res = await getBlogAll({});
  bloggerList.value = res.data.map((item:any) => {
    return {
      label:item.bloggerNickname,
      value:item.id
    }
  })
  
};


const handleConfirm = async () => {


  if (!formData.value.bloggerUid) return MessagePlugin.error('请选择博主')
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

const handleChange = (e:any,value:any) => {
  formData.value.bloggerUid = value.option.value
  formData.value.bloggerNickname =   value.option.label
};
defineExpose({
  open,
});
</script>
