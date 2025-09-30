<template>
  <!-- 常规内容编辑 -->
  <t-dialog
    v-model:visible="visible"
    :width="600"
    :header="title"
    confirm-btn="保存"
    @confirm="onConfirm"
    @cancel="onCancel"
  >
    <t-form ref="formRef" :model="data" label-width="80px" label-align="left">
      <t-form-item label="内容标题" name="title">
        <t-input v-model="data.title" placeholder="输入内容标题" />
      </t-form-item>
      <t-form-item label="内容描述" name="description">
        <t-textarea v-model="data.description" placeholder="输入内容描述" :autosize="{ minRows: 3, maxRows: 6 }" />
      </t-form-item>
      <t-form-item label="内容类型" name="type">
        <t-select v-model="data.type" placeholder="选择内容类型">
          <t-option key="long" value="long" label="长视频" />
          <t-option key="short" value="short" label="短视频" />
        </t-select>
      </t-form-item>
      <t-form-item label="是否VIP" name="is_vip">
        <t-select v-model="data.is_vip" placeholder="选择是否VIP">
          <t-option key="true" :value="true" label="是" />
          <t-option key="false" :value="false" label="否" />
        </t-select>
      </t-form-item>
      <t-form-item label="视频地址" name="data">
        <t-input v-model="data.data" placeholder="输入视频地址" />
      </t-form-item>
      <t-form-item label="封面地址" name="cover_url">
        <t-input v-model="data.cover_url" placeholder="输入封面地址" />
      </t-form-item>
      <!-- 标签列表 -->
      <div class="diversity-list">
        <t-row
          v-for="(item, index) in data.tags"
          :key="index"
          align="middle"
          :gutter="16"
          :style="{ marginTop: 'var(--td-comp-margin-xxl)' }"
        >
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
      <!-- <t-button theme="primary" :style="{ marginTop: 'var(--td-comp-margin-xxl)' }" @click="addtages"
        >添加标签</t-button
      > -->
    </t-form>
  </t-dialog>
</template>
<script setup lang="ts">
import { type DialogProps, MessagePlugin } from 'tdesign-vue-next';
import { ref } from 'vue';
import { updateContent } from '@/api/content';
const emit = defineEmits(['confirm']);
interface FormData {
  id: string;
  title: string;
  description: string;
  type: string;
  is_vip: boolean;
  data: string;
  cover_url: string;
  tags: Array<string | number>;
}

const title = ref('内容创建');

const visible = ref(false);

const data = ref<FormData>({
  id: '',
  title: '',
  description: '',
  type: '',
  is_vip: false,
  data: '',
  cover_url: '',
  tags: [],
});

const open = (row?: any) => {
  console.log('🚀 ~ row:', row);
  title.value = row?.id ? '内容编辑' : '内容创建';

  if (row) {
    // 编辑模式：深拷贝，避免弹窗内修改影响table原数据
    data.value = {
      id: row.id || '',
      title: row.title || '',
      description: row.description || '',
      type: row.type || '',
      is_vip: row.is_vip || false,
      data: row.data || '',
      cover_url: row.cover_url || '',
      tags: row.tags || [],
    };
  } else {
    // 新增模式：重置表单数据
    data.value = {
      id: '',
      title: '',
      description: '',
      type: '',
      is_vip: false,
      data: '',
      cover_url: '',
      tags: [],
    };
  }

  visible.value = true;
};

const onConfirm: DialogProps['onConfirm'] = async () => {
  if (!data.value.title) return MessagePlugin.error('请输入内容标题');
  if (!data.value.description) return MessagePlugin.error('请输入内容描述');
  if (!data.value.type) return MessagePlugin.error('请选择内容类型');

  try {
    let params = {
      ...data.value,
    };
    const res = await updateContent(params);
    MessagePlugin.success(res.message);
    visible.value = false;
    emit('confirm');
  } catch (error) {
    console.error('操作失败:', error);
    MessagePlugin.error('操作失败，请重试');
  }
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
  data.value.tags.splice(key, 1);
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
