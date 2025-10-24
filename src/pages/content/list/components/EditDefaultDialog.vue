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
    <t-form ref="formRef" :model="data" label-width="100px" label-align="left">
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
      <t-form-item label="是否免费" name="is_free">
        <t-space>
          <t-select v-model="data.is_free" placeholder="选择是否免费" style="width: 120px">
            <t-option key="true" :value="true" label="免费" />
            <t-option key="false" :value="false" label="不免费" />
          </t-select>
          <t-input
            v-if="!data.is_free"
            v-model="data.price"
            type="number"
            placeholder="输入金币数量"
            style="width: 200px"
          />
        </t-space>
      </t-form-item>
      <t-form-item label="标签" name="tags">
        <t-select
          v-model="data.tags"
          placeholder="请选择标签"
          multiple
          clearable
          :options="tagOptions"
          :loading="tagLoading"
        />
      </t-form-item>
    </t-form>
  </t-dialog>
</template>
<script setup lang="ts">
import { type DialogProps, MessagePlugin } from 'tdesign-vue-next';
import { ref, onMounted } from 'vue';
import { updateContent } from '@/api/content';
import { getTagList } from '@/api/recommend';
const emit = defineEmits(['confirm']);
interface FormData {
  id: string;
  title: string;
  description: string;
  type: string;
  is_vip: boolean;
  data: string;
  cover_url: string;
  is_free: boolean;
  price: number;
  tags: Array<number>;
}

const title = ref('内容创建');

const visible = ref(false);

// 标签相关
const tagOptions = ref([]);
const tagLoading = ref(false);

const data = ref<FormData>({
  id: '',
  title: '',
  description: '',
  type: '',
  is_vip: false,
  data: '',
  cover_url: '',
  is_free: true,
  price: 0,
  tags: [],
});

const open = (row?: any) => {
  console.log('🚀 ~ row:', row);
  console.log('🚀 ~ row.tags:', row?.tags);
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
      is_free: row.is_free !== undefined ? row.is_free : true,
      price: row.price || 0,
      tags: row.tags
        ? Array.isArray(row.tags)
          ? row.tags.map((tag: any) => (typeof tag === 'object' ? tag.id : tag))
          : []
        : [],
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
      is_free: true,
      price: 0,
      tags: [],
    };
  }

  visible.value = true;
  // 获取标签列表
  fetchTagList();
};

const onConfirm: DialogProps['onConfirm'] = async () => {
  if (!data.value.title) return MessagePlugin.error('请输入内容标题');
  if (!data.value.description) return MessagePlugin.error('请输入内容描述');
  if (!data.value.type) return MessagePlugin.error('请选择内容类型');
  if (!data.value.is_free && (!data.value.price || data.value.price <= 0)) {
    return MessagePlugin.error('请输入有效的金币数量');
  }

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
// 获取标签列表
const fetchTagList = async () => {
  try {
    tagLoading.value = true;
    const res = await getTagList({ status: 'activate' }); // 只获取激活状态的标签
    console.log('标签API返回数据:', res);
    // 根据API返回的数据结构，使用 res.data.results 而不是 res.data
    tagOptions.value = res.data.results.map((item: any) => ({
      label: item.name,
      value: item.id,
    }));
    console.log('处理后的标签选项:', tagOptions.value);
  } catch (error) {
    console.error('获取标签列表失败:', error);
    MessagePlugin.error('获取标签列表失败');
  } finally {
    tagLoading.value = false;
  }
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
