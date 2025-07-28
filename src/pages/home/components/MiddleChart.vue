<template>
  <t-card title="" class="dashboard-chart-card" :bordered="false">
    <div
      id="monitorContainer"
      class="dashboard-chart-container"
      :style="{ width: '100%', height: `${resizeTime * 326}px` }"
    />
  </t-card>
</template>
<script setup lang="ts">
import { useWindowSize } from '@vueuse/core';
import { LineChart } from 'echarts/charts';
import { GridComponent, LegendComponent, TooltipComponent } from 'echarts/components';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { computed, nextTick, onDeactivated, onMounted, ref, watch } from 'vue';

import { useSettingStore } from '@/store';
import { changeChartsTheme } from '@/utils/color';

import { getLineChartDataSet } from '../index';

echarts.use([TooltipComponent, LegendComponent, GridComponent, LineChart, CanvasRenderer]);

const store = useSettingStore();
const resizeTime = ref(1);

const chartColors = computed(() => store.chartColors);

// monitorChart
let monitorContainer: HTMLElement;
let monitorChart: echarts.ECharts;
const renderMonitorChart = () => {
  if (!monitorContainer) {
    monitorContainer = document.getElementById('monitorContainer');
  }
  monitorChart = echarts.init(monitorContainer);
  monitorChart.setOption(getLineChartDataSet({ ...chartColors.value }));
};

const renderCharts = () => {
  renderMonitorChart();
};

// chartSize update
const updateContainer = () => {
  if (document.documentElement.clientWidth >= 1400 && document.documentElement.clientWidth < 1920) {
    resizeTime.value = Number((document.documentElement.clientWidth / 2080).toFixed(2));
  } else if (document.documentElement.clientWidth < 1080) {
    resizeTime.value = Number((document.documentElement.clientWidth / 1080).toFixed(2));
  } else {
    resizeTime.value = 1;
  }

  monitorChart.resize({
    width: monitorContainer.clientWidth,
    height: resizeTime.value * 326,
  });
};

onMounted(() => {
  renderCharts();
  nextTick(() => {
    updateContainer();
  });
});

const { width, height } = useWindowSize();
watch([width, height], () => {
  updateContainer();
});

onDeactivated(() => {
  storeModeWatch();
  storeBrandThemeWatch();
  storeSidebarCompactWatch();
});

const storeBrandThemeWatch = watch(
  () => store.brandTheme,
  () => {
    changeChartsTheme([monitorChart]);
  },
);

const storeSidebarCompactWatch = watch(
  () => store.isSidebarCompact,
  () => {
    if (store.isSidebarCompact) {
      nextTick(() => {
        updateContainer();
      });
    } else {
      setTimeout(() => {
        updateContainer();
      }, 180);
    }
  },
);

const storeModeWatch = watch(
  () => store.mode,
  () => {
    [monitorChart].forEach((item) => {
      item.dispose();
    });

    renderCharts();
  },
);
</script>
<style lang="less" scoped>
.dashboard-chart-card {
  padding: var(--td-comp-paddingTB-xxl) var(--td-comp-paddingLR-xxl);

  :deep(.t-card__header) {
    padding: 0;
  }

  :deep(.t-card__body) {
    padding: 0;
    margin-top: var(--td-comp-margin-xxl);
  }

  :deep(.t-card__title) {
    font: var(--td-font-title-large);
    font-weight: 400;
  }
}
</style>
