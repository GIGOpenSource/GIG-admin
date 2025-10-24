<template>
  <div class="link-list-container">
    <t-form :data="searchForm" :label-width="80">
      <t-row>
        <t-col :span="10">
          <t-row :gutter="[24, 24]">
            <t-col :span="4">
              <t-form-item label="链接名称" name="name">
                <t-input
                  v-model="searchForm.name"
                  type="search"
                  placeholder="输入链接名称"
                  :style="{ minWidth: '134px' }"
                />
              </t-form-item>
            </t-col>
            <t-col :span="4">
              <t-form-item label="类型" name="type">
                <t-select v-model="searchForm.type" placeholder="选择类型" clearable>
                  <t-option key="all" value="" label="全部" />
                  <t-option key="app" value="app" label="App" />
                  <t-option key="game" value="game" label="游戏" />
                  <t-option key="game_ads" value="game_ads" label="游戏广告" />
                  <t-option key="string" value="string" label="字符串" />
                  <t-option key="vip" value="vip" label="VIP" />
                  <t-option key="welcome" value="welcome" label="欢迎页" />
                  <t-option key="welcome_icon" value="welcome_icon" label="欢迎图标" />
                </t-select>
              </t-form-item>
            </t-col>
          </t-row>
        </t-col>
        <t-col :span="2" class="operation-container">
          <t-button theme="primary" @click="handleQuery"> 查询 </t-button>
          <t-button theme="default" @click="handleReset"> 重置 </t-button>
        </t-col>
      </t-row>
    </t-form>

    <t-row :style="{ marginTop: 'var(--td-comp-margin-xxl)' }">
      <t-button theme="primary" @click="handleCreate"> 新建 </t-button>
    </t-row>

    <div class="table-container">
      <t-table
        :data="linkList"
        :columns="columns"
        :loading="loading"
        row-key="id"
        :pagination="pagination"
        @page-change="handlePageChange"
      >
        <template #operation="{ row }">
          <t-space>
            <t-link theme="primary" @click="handleEdit(row)">编辑</t-link>
            <t-link theme="danger" @click="handleDelete(row)">删除</t-link>
          </t-space>
        </template>
      </t-table>
    </div>

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
          <t-select v-model="formData.type" placeholder="请选择链接类型" clearable>
            <t-option key="app" value="app" label="App" />
            <t-option key="game" value="game" label="游戏" />
            <t-option key="game_ads" value="game_ads" label="游戏广告" />
            <t-option key="string" value="string" label="字符串" />
            <t-option key="vip" value="vip" label="VIP" />
            <t-option key="welcome" value="welcome" label="欢迎页" />
            <t-option key="welcome_icon" value="welcome_icon" label="欢迎图标" />
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
import { MessagePlugin, DialogPlugin, type TdBaseTableProps } from 'tdesign-vue-next';
import { getLinkList, createLink, updateLink, deleteLink } from '@/api/goods';
import { DEFAULT_PAGE_PARAMS } from '@/constants';

interface ExternalLink {
  id: string;
  name: string;
  title: string;
  description?: string;
  type: 'app' | 'game' | 'game_ads' | 'string' | 'vip' | 'welcome' | 'welcome_icon';
  image_url: string;
  click_url: string;
  alt_text?: string;
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
  searchForm.name = '';
  searchForm.type = '';
  pagination.value.current = 1;
  fetchData(1);
};

// 搜索表单数据
const searchForm = reactive({
  name: '',
  type: '',
});

// 编辑表单数据
const formData = reactive({
  name: '',
  title: '',
  description: '',
  type: '',
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
  {
    title: '类型',
    colKey: 'type',
    cell: (h: any, { row }: { row: any }) => {
      const typeMap: Record<string, string> = {
        app: 'App',
        game: '游戏',
        game_ads: '游戏广告',
        string: '字符串',
        vip: 'VIP',
        welcome: '欢迎页',
        welcome_icon: '欢迎图标',
      };
      return typeMap[row.type] || row.type;
    },
  },
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
    name: searchForm.name,
    type: searchForm.type,
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
  Object.assign(formData, {
    name: '',
    title: '',
    description: '',
    type: '',
    image_url: '',
    click_url: '',
    alt_text: '',
  });
  formVisible.value = true;
};

const handleEdit = (row: ExternalLink) => {
  currentId.value = row.id;
  Object.assign(formData, { ...row });
  formVisible.value = true;
};

const handleDelete = (row: ExternalLink) => {
  const dialog = DialogPlugin.confirm({
    theme: 'danger',
    header: '确认删除',
    body: `您确定要删除链接"${row.name}"吗？`,
    confirmBtn: '确认',
    cancelBtn: '取消',
    onConfirm: async () => {
      try {
        await deleteLink(row.id);
        MessagePlugin.success('删除成功');
        fetchData(pagination.value.current);
        dialog.destroy();
      } catch (error) {
        MessagePlugin.error('删除失败');
        dialog.destroy();
      }
    },
    onCancel: () => {
      dialog.hide();
    },
  });
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

const onSubmit = async (context: any) => {
  if (context.validateResult === true) {
    try {
      if (currentId.value) {
        await updateLink(formData);
      } else {
        await createLink(formData);
      }
      MessagePlugin.success(currentId.value ? '更新成功' : '创建成功');
      formVisible.value = false;
      fetchData(1);
    } catch (error) {
      MessagePlugin.error(currentId.value ? '更新失败' : '创建失败');
    }
  } else {
    MessagePlugin.warning(context.firstError || '请检查表单数据');
  }
};

const handlePageChange = (pageInfo: { current: number; pageSize: number }) => {
  pagination.value.current = pageInfo.current;
  pagination.value.pageSize = pageInfo.pageSize;
  fetchData(pageInfo.current);
};

onMounted(() => {
  fetchData();
});
</script>
<style scoped>
.link-list-container {
  background-color: var(--td-bg-color-container);
  padding: var(--td-comp-paddingTB-xxl) var(--td-comp-paddingLR-xxl);
  border-radius: var(--td-radius-medium);

  .table-container {
    margin-top: var(--td-comp-margin-xxl);
  }
}

.operation-container {
  text-align: right;
}
</style>
