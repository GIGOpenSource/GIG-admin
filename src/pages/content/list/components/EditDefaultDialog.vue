<template>
  <!-- 常规内容编辑 -->
  <t-dialog v-model:visible="visible" :width="600" :header="title" confirm-btn="保存" @confirm="onConfirm"
    @cancel="onCancel">
    <t-form ref="formRef" :model="data" label-width="80px" label-align="left">
      <t-form-item label="主标题" name="title">
        <t-input v-model="data.title" placeholder="输入主标题" />
      </t-form-item>
      <t-form-item label="正文" name="description">
        <t-input v-model="data.content" placeholder="输入正文" />
      </t-form-item>
      <t-form-item label="上传文件" name="email">
        <t-input v-model="data.mediaFiles" placeholder="输入邮箱" />
      </t-form-item>
      <!-- 标签列表 -->
      <div class="diversity-list">
        <t-row v-for="(item, index) in data.tags" :key="index" align="middle" :gutter="16"
          :style="{ marginTop: 'var(--td-comp-margin-xxl)' }">
          <t-col :span="8">
            <t-form-item label="标签" name="description">
              <t-input v-model="data.tags[index]" class="form-item-content" placeholder="请输入标签" />
            </t-form-item>
          </t-col>
          <t-col :span="1">
            <t-link theme="danger" @click="handleDeletTages(index)">删除</t-link>
          </t-col>
        </t-row>
      </div>
      <t-button theme="primary" :style="{ marginTop: 'var(--td-comp-margin-xxl)' }" @click="addtages">添加标签</t-button>
    </t-form>

  </t-dialog>
</template>
<script setup lang="ts">
import { type DialogProps, MessagePlugin } from 'tdesign-vue-next';
import { ref } from 'vue';
import { createContent } from '@/api/content';
const emit = defineEmits(['confirm'])
interface FormData {
  title: string;
  content: string;
  tags: Array<string | number>,
  mediaFiles: Array<string | number>
}

const title = ref('内容创建')

const visible = ref(false);

const data = ref<FormData>({
  title: '',
  content: '',
  tags: [],
  mediaFiles: ['1111']
});

const open = (row?: any) => {
  console.log('🚀 ~ row:', row);
  title.value = row?.id ? '内容编辑' : '内容创建';

  visible.value = true;
};

const onConfirm: DialogProps['onConfirm'] = async () => {
  let params = {
    operationType: "CREATE_ARTICLE",
    contentData: {
      ...data.value,
      contentType: "ARTICLE",
    }

  }
  const res = await createContent(params)
  data.value.tags = []
  data.value.content = ''
  data.value.title = ''
  data.value.mediaFiles = ['1111']
  MessagePlugin.success(res.message);
  visible.value = false;
  emit('confirm')
};
const onCancel: DialogProps['onCancel'] = () => {
  visible.value = false;
};
// 添加标签
const addtages = () => {
  data.value.tags.push('');
};
// 删除标签
const handleDeletTages = (key: number) => {
  data.value.tags.splice(key, 1)
};
defineExpose({
  open,
});
</script>
<style lang="less" scoped>
.diversity-list {
  margin-top: var(--td-comp-margin-xxl);
  max-height: 100%;
  overflow: hidden auto;
  padding-right: 5px;
}
</style>
