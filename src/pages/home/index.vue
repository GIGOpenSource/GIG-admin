<template>
  <div>
    <!-- <t-card :bordered="false" style="margin-bottom: 16px">
      <t-form v-model="formData" label-align="left" label-width="80px">
        <t-row>
          <t-col :span="10">
            <t-row>
              <t-col :span="4">
                <t-form-item label="选择APP" name="name" initial-data="TDesign">
                  <select-app
                    v-model="formData.app"
                    @change="handleChangeApp"
                  />
                </t-form-item>
              </t-col>
            </t-row>
          </t-col>
          <t-col :span="2" align="right">
            <t-button theme="primary" @click="handleQueryData"> 查询 </t-button>
            <t-button theme="default" @click="handleReset"> 重置 </t-button>
          </t-col>
        </t-row>
      </t-form>
    </t-card> -->
    <!-- 列表排名 -->
    <table-list ref="tabListRef" class="row-container" />
    <!-- 图表  -->
    <middle-chart ref="chartRef" class="row-container" />
  </div>
</template>
<script setup lang="ts">
import { ref, reactive } from 'vue';
import { SelectProps } from 'tdesign-vue-next';

import MiddleChart from './components/MiddleChart.vue';
import TableList from './components/TableList.vue';

defineOptions({
  name: 'HomeBase',
});

const tabListRef = ref<InstanceType<typeof TableList>>();
const chartRef = ref<InstanceType<typeof MiddleChart>>();

const formData = reactive({
  app: '',
});

// 切换APP
const handleChangeApp: SelectProps['onChange'] = (ctx) => {
  console.log('Selected app:', ctx);
  // 这里可以添加处理逻辑，比如更新图表或列表数据
};
// 查询数据
const handleQueryData = () => {
  console.log('Querying data for app:', formData);
  // 触发子组件更新
  tabListRef.value?.refreshData();
  chartRef.value?.refreshCharts();
};
// 重置表单
const handleReset = () => {
  formData.app = '';
  console.log('Form reset to default app:', formData);
};
</script>
<style scoped>
.row-container:not(:last-child) {
  margin-bottom: 16px;
}
.select-row {
  display: flex;
  align-items: center;
}
</style>
