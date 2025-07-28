<template>
  <div>
    <div class="select-row">
      <span>选择APP：</span>
      <t-select style="width: 200px">
        <t-option key="apple" label="Apple" value="apple" />
        <t-option key="orange" label="Orange" value="orange">OrangeContentSlot</t-option>
        <t-option key="banana" label="Banana" value="banana" />
      </t-select>
    </div>
    <!-- 列表排名 -->
    <table-list class="row-container" />
    <!-- 中部图表  -->
    <middle-chart class="row-container" />
  </div>
</template>
<script setup lang="ts">
import MiddleChart from './components/MiddleChart.vue';
import TableList from './components/TableList.vue';

defineOptions({
  name: 'HomeBase',
});
</script>
<style scoped>
.row-container:not(:last-child) {
  margin-bottom: 16px;
}
.select-row {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}
</style>
