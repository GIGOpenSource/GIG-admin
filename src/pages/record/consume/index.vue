<template>
  <div class="blogger-crawler-list-container">
    <t-form :data="formData" :label-width="80">
      <t-row>
        <t-col :span="10">
          <t-row :gutter="[24, 24]">
            <!-- <t-col :span="4">
              <t-form-item label="选择包" name="packageName">
               <t-select
                  v-model="formData.packageName"
                  :options="packageOptions"
                  placeholder="选择包"
                  clearable
                />
              </t-form-item>
            </t-col> -->
            <t-col :span="4">
              <t-form-item label="订单类型" name="content_type">
                <t-select
                  v-model="formData.content_type"
                  :options="orderTypeOptions"
                  placeholder="选择订单类型"
                  clearable
                />
              </t-form-item>
            </t-col>
          </t-row>
        </t-col>
        <t-col :span="2" align="right">
          <t-button theme="primary" @click="handleQuery"> 查询 </t-button>
          <t-button theme="default"  @click="handleReset"> 重置 </t-button>
        </t-col>
      </t-row>
    </t-form>

    <div class="table-container">
      <t-table hover :data="tableData" :columns="COLUMNS" row-key="id" :pagination="pagination">
        <template #operation="{ row }">
          <t-space>
            <t-link theme="primary" @click="handleViewDetail(row)">详情</t-link>
          </t-space>
        </template>
      </t-table>
    </div>

    <!-- 详情弹窗 -->
    <t-dialog
      v-model:visible="detailDialogVisible"
      header="消费记录详情"
      width="600px"
      :footer="false"
    >
      <div class="detail-content">
        <div v-if="selectedRecord">
          <p><strong>标题：</strong>{{ selectedRecord.title || '-' }}</p>
          <p><strong>封面：</strong></p>
          <div v-if="selectedRecord.images || selectedRecord.image_url || selectedRecord.cover_url">
            <img
              :src="selectedRecord.images || selectedRecord.image_url || selectedRecord.cover_url"
              style="max-width: 200px; max-height: 150px; border-radius: 8px; margin-top: 8px;"
              alt="封面图片"
            />
          </div>
          <div v-else style="color: #999; margin-top: 8px;">暂无封面</div>

        </div>
      </div>
    </t-dialog>
  </div>
</template>
<script lang="ts" setup>
import type { PrimaryTableCol, TableRowData, TdBaseTableProps } from 'tdesign-vue-next';
import { ref, onMounted,reactive } from 'vue';
import { getConsumeList, getConsumeDetails } from '@/api/record';
import { DEFAULT_PAGE_PARAMS } from '@/constants';

interface FormData {
  content_type: string | number;
}

const formData = ref<FormData>({
  content_type:''
});
//包名选择
const packageOptions = [
  { label: '全部', value: '' },
  { label: '正常', value: 1 },
  { label: '禁用', value: 0 },
];
const orderTypeOptions = [
  { label: '视频', value: 'content' },
  { label: '动态', value: 'dynamic' },
  { label: '广告', value: 'advertise' }
];
const COLUMNS: PrimaryTableCol[] = [
  {
    title: '序号',
    colKey: 'index',
    align: 'center',
    width: 80,
    cell: (h: any, { rowIndex }: any) => rowIndex + 1,
  },
  {
    title: '用户',
    colKey: 'user_nickname',
    align: 'center',
  },
  {
    title: '订单类型',
    colKey: 'content_type',
    align: 'center',
    cell: (h: any, { row }: any) => {
      const channel = row.content_type
      if (channel === 'content') {
        return '视频';
      } else if (channel === 'dynamic') {
        return '动态';
      }else if (channel === 'advertise') {
        return '广告';
      }
      return channel || '未知';
    },
  },
  {
    title: '消费金额',
    colKey: 'price',
    align: 'left',
    ellipsis: true,
  },
  {
    title: '订单时间',
    colKey: 'purchase_time',
    align: 'left',
    ellipsis: true,
  },
  {
    title: '操作',
    colKey: 'operation',
    align: 'center',
  }
];
const pagination = reactive<TdBaseTableProps['pagination']>({ ...DEFAULT_PAGE_PARAMS,
  onChange: (pageInfo: { current: number; pageSize: number }) => {
    fetchDataList(pageInfo.current);
  },
 });

const tableData = ref<TableRowData[]>([]);
const detailDialogVisible = ref(false);
const selectedRecord = ref<TableRowData | null>(null);

const fetchDataList = async (page: number = pagination.defaultCurrent) => {
  const params = {
    ...formData.value,
    page,
    size: pagination.defaultPageSize,
  };
  const res = await getConsumeList(params);
  console.log('🚀 ~ fetchDataList ~ data:', res);
  tableData.value = res.data.results
  pagination.total = res.data.pagination.total;
  pagination.current = page;
};
// 查询
const handleQuery = () => {

  fetchDataList()
};
// 重置
const handleReset = () => {
  formData.value = {
  packageName: '',
  orderType: '',
}
  fetchDataList()
};
onMounted(() => {
  fetchDataList();
});

const handleCreate = () => {
  // 新建逻辑
};

const handleEdit = (row: TableRowData) => {
  // 编辑逻辑
};

const handleDelete = (row: TableRowData) => {
  // 删除逻辑
};

// 查看详情
const handleViewDetail = async (row: TableRowData) => {
  try {
    selectedRecord.value = row;
    detailDialogVisible.value = true;

    // 调用详情接口获取完整信息
    const res = await getConsumeDetails(row.object_id);
    console.log('🚀 ~ 详情数据:', res);

    // 如果有接口返回的详情数据，更新selectedRecord
    if (res.data && res.data.content_detail) {
      selectedRecord.value = { ...row, ...res.data.content_detail };
    }
  } catch (error) {
    console.error('获取详情失败:', error);
    // 如果接口调用失败，使用原始行数据
    console.log('🚀 ~ 使用原始行数据:', row);
  }
};
</script>
<style lang="less" scoped>
.blogger-crawler-list-container {
  background-color: var(--td-bg-color-container);
  padding: var(--td-comp-paddingTB-xxl) var(--td-comp-paddingLR-xxl);
  border-radius: var(--td-radius-medium);

  .table-container {
    margin-top: var(--td-comp-margin-xxl);
  }
}
</style>
