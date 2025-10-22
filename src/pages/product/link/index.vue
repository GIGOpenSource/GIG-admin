<template>
  <div class="product-config-list-container">
    <!-- 操作栏 -->
    <t-row :style="{ marginBottom: 'var(--td-comp-margin-xxl)' }">
      <t-button theme="primary" @click="handleCreate">新建</t-button>
      <t-form :data="formData" :label-width="80">
        <t-row>
          <t-col :span="10">
            <t-row :gutter="[24, 24]">
              <t-col :span="4">
                <t-form-item label="链接名称" name="name">
                  <t-input
                    v-model="formData.name"
                    type="search"
                    placeholder="输入链接名称"
                    :style="{ minWidth: '134px' }"
                  />
                </t-form-item>
              </t-col>
              <t-col :span="4">
                <t-form-item label="类型" name="type">
                  <t-select v-model="formData.type" placeholder="选择类型" clearable>
                    <t-option value="">全部</t-option>
                    <t-option value="app">App</t-option>
                    <t-option value="game">游戏</t-option>
                    <t-option value="game_ads">游戏广告</t-option>
                    <t-option value="string">字符串</t-option>
                    <t-option value="vip">VIP</t-option>
                    <t-option value="welcome">欢迎页</t-option>
                    <t-option value="welcome_icon">欢迎图标</t-option>
                  </t-select>
                </t-form-item>
              </t-col>
            </t-row>
          </t-col>
          <t-col :span="2" class="operation-container">
            <t-button theme="primary" @click="handleQuery">查询</t-button>
            <t-button theme="default" @click="handleReset">重置</t-button>
          </t-col>
        </t-row>
      </t-form>

    </t-row>

    <!-- 数据表格 -->
    <t-table
      :data="linkList"
      :columns="columns"
      :loading="loading"
      row-key="id"
      :pagination="pagination"
      @page-change="handlePageChange"
    >
      <template #operation="{ row }">
        <t-link theme="primary" hover="color" @click="handleEdit(row)">编辑</t-link>
        <t-popconfirm content="确认删除该链接吗？" @confirm="handleDelete(row)">
          <t-link theme="danger" hover="color" style="margin-left: var(--td-comp-margin-s)">删除</t-link>
        </t-popconfirm>
      </template>
    </t-table>

    <!-- 编辑/创建弹窗 -->
    <t-dialog
      v-model:visible="formVisible"
      :header="dialogTitle"
      @confirm="handleConfirm"
      @cancel="handleCancel"
      :width="dialogWidth"
    >
      <t-form ref="formRef" :data="formData" :rules="formRules" @submit="onSubmit">
        <t-form-item label="链接名称" name="name">
          <t-input v-model="formData.name" placeholder="请输入链接名称" />
        </t-form-item>

        <t-form-item label="标题" name="title">
          <t-input v-model="formData.title" placeholder="请输入标题" />
        </t-form-item>

        <t-form-item label="描述" name="description">
          <t-textarea v-model="formData.description" placeholder="请输入描述" />
        </t-form-item>
        <t-form-item label="链接类型" name="type">
          <t-select v-model="formData.type" placeholder="请选择链接类型">
            <t-option value="app">App</t-option>
            <t-option value="game">游戏</t-option>
            <t-option value="game_ads">游戏广告</t-option>
            <t-option value="string">字符串</t-option>
            <t-option value="vip">VIP</t-option>
            <t-option value="welcome">欢迎页</t-option>
            <t-option value="welcome_icon">欢迎图标</t-option>
          </t-select>
        </t-form-item>
        <t-form-item label="图片地址" name="image_url">
          <t-input v-model="formData.image_url" placeholder="请输入图片地址" />
        </t-form-item>

        <t-form-item label="点击地址" name="click_url">
          <t-input v-model="formData.click_url" placeholder="请输入点击地址" />
        </t-form-item>

        <t-form-item label="替代文本" name="alt_text">
          <t-input v-model="formData.alt_text" placeholder="请输入替代文本" />
        </t-form-item>
      </t-form>
    </t-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import { MessagePlugin, type TdBaseTableProps } from 'tdesign-vue-next';
import { getLinkList, createLink, updateLink, deleteLink } from '@/api/goods';
import { DEFAULT_PAGE_PARAMS } from '@/constants';

interface ExternalLink {
  id: string;
  name: string;
  url: string;
  description?: string;
  type: 'app' | 'game' | 'game_ads' | 'string' | 'vip' | 'welcome' | 'welcome_icon';
  createdAt: string;
  updatedAt: string;
}

// 数据状态
const linkList = ref<ExternalLink[]>([]);
const loading = ref(false);
const formVisible = ref(false);
const currentId = ref<string | null>(null);
const formRef = ref();
const searchName = ref('');
const searchType = ref('');

const handleQuery = () => {
  pagination.value.current = 1;
  fetchData(1);
};

const handleReset = () => {
  formData.name = '';
  formData.type = '';
  pagination.value.current = 1;
  fetchData(1);
};
// 表单数据
const formData = reactive({
  name: '',
  title: '',
  description: '',
  type: 'app',
  image_url: '',
  click_url: '',
  alt_text: '',
});

const formRules = {
  name: [{ required: true, message: '请输入链接名称' }],
  title: [{ required: true, message: '请输入标题' }],
  type: [{ required: true, message: '请选择链接类型' }],
  image_url: [{ required: true, message: '请输入图片地址' }],
  click_url: [{ required: true, message: '请输入点击地址' }],
};

const dialogTitle = computed(() => (currentId.value ? '编辑链接' : '新建链接'));

// 表格配置
const columns = [
  { title: '链接名称', colKey: 'name' },
  { title: '标题', colKey: 'title' },
  { title: '类型', colKey: 'type' },
  {
    title: '图片地址',
    colKey: 'image_url',
    ellipsis: true,
  },
  { title: '点击地址', colKey: 'click_url', ellipsis: true },
  { title: '描述', colKey: 'description', ellipsis: true },
  { title: '创建时间', colKey: 'createdAt' },
  { title: '操作', colKey: 'operation', width: 150 },
];

const pagination = ref<TdBaseTableProps['pagination']>({
  ...DEFAULT_PAGE_PARAMS,
  onChange: (pageInfo: { current: number; pageSize: number }) => {
    console.log('分页器切换:', pageInfo);
    pagination.value.current = pageInfo.current;
    pagination.value.pageSize = pageInfo.pageSize;
    fetchData(pageInfo.current);
  },
});

const fetchData = async (page: number = pagination.value.current || pagination.value.defaultCurrent) => {
  const params = {
    ...formData.value,
    name: formData.name,
    type: formData.type,
    currentPage: pagination.value.current,
    pageSize: pagination.value.defaultPageSize,
  };
  console.log('请求参数:', params);
  try {
    const res = await getLinkList(params);
    console.log('接口返回数据:', res.data.data);
    linkList.value = res.data.results;
    pagination.value.total = res.data.pagination.total;
    pagination.value.current = page;
    console.log('分页状态更新:', { current: page, total: res.data.pagination.total });
  } catch (error) {
    console.error('获取任务列表失败:', error);
    MessagePlugin.error('获取任务列表失败').then();
  }
};
const handleCreate = () => {
  currentId.value = null;
  Object.assign(formData, { name: '', url: '', description: '' });
  formVisible.value = true;
};

const handleEdit = (row: ExternalLink) => {
  currentId.value = row.id;
  Object.assign(formData, { ...row });
  formVisible.value = true;
};

const handleDelete = async (row: ExternalLink) => {
  try {
    await deleteLink(row.id);
    MessagePlugin.success('删除成功').then();
    fetchData(1);
  } catch (error) {
    MessagePlugin.error('删除失败').then();
  }
};

const handleConfirm = () => {
  // 触发表单提交
  formRef.value?.submit();
};

const handleCancel = () => {
  formVisible.value = false;
};

const dialogWidth = computed(() => {
  return '50vw';
});

const onSubmit = async ({ validateResult, firstError }: { validateResult: any; firstError: string }) => {
  if (validateResult === true) {
    try {
      if (currentId.value) {
        await updateLink(formData);
      } else {
        await createLink(formData);
      }
      MessagePlugin.success(currentId.value ? '更新成功' : '创建成功').then();
      formVisible.value = false;
      fetchData(1);
    } catch (error) {
      MessagePlugin.error(currentId.value ? '更新失败' : '创建失败').then();
    }
  } else {
    MessagePlugin.warning(firstError).then();
  }
};

const handlePageChange = (pageInfo: { current: number; pageSize: number }) => {
  pagination.current = pageInfo.current;
  pagination.pageSize = pageInfo.pageSize;
  fetchData(pageInfo.current);
};

onMounted(() => {
  fetchData();
});
</script>
<style scoped>
.product-config-list-container {
  padding: var(--td-comp-paddingTB-xxl) var(--td-comp-paddingLR-xxl);
  background: var(--td-bg-color-container);
  border-radius: var(--td-radius-default);
}

.ellipsis {
  display: inline-block;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
