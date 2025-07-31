import dayjs from 'dayjs';
import type { EChartsOption } from 'echarts';

import type { TChartColor } from '@/config/color';
import { t } from '@/locales/index';
import { getRandomArray } from '@/utils/charts';
import { getChartListColor } from '@/utils/color';

/**
 *  线性图表数据源
 *
 * @export
 * @param {Array<string>} [dateTime]
 * @returns {*} dataSet
 */
export function getLineChartDataSet({
  dateTime = [],
  placeholderColor,
  borderColor,
}: { dateTime?: Array<string> } & TChartColor) {
  const divideNum = 10;
  const timeArray = [];
  const inArray = [];
  const outArray = [];
  const waterArray = [];
  const lineArray = [];
  for (let i = 0; i < divideNum; i++) {
    if (dateTime.length > 0) {
      const dateAbsTime: number = (new Date(dateTime[1]).getTime() - new Date(dateTime[0]).getTime()) / divideNum;
      const enhandTime: number = new Date(dateTime[0]).getTime() + dateAbsTime * i;
      // console.log('dateAbsTime..', dateAbsTime, enhandTime);
      timeArray.push(dayjs(enhandTime).format('MM-DD'));
    } else {
      timeArray.push(
        dayjs()
          .subtract(divideNum - i, 'day')
          .format('MM-DD'),
      );
    }

    inArray.push(getRandomArray().toString());
    outArray.push(getRandomArray().toString());
    waterArray.push(getRandomArray().toString());
    lineArray.push(getRandomArray().toString());
  }

  const dataSet = {
    color: getChartListColor(),
    tooltip: {
      trigger: 'item',
    },
    grid: {
      left: '0',
      right: '20px',
      top: '5px',
      bottom: '36px',
      containLabel: true,
    },
    legend: {
      left: 'center',
      bottom: '0',
      orient: 'horizontal', // legend 横向布局。
      data: ['付费率', '日活', '注册', '流水'],
      textStyle: {
        fontSize: 12,
        color: placeholderColor,
      },
    },
    xAxis: {
      type: 'category',
      data: timeArray,
      boundaryGap: false,
      axisLabel: {
        color: placeholderColor,
      },
      axisLine: {
        lineStyle: {
          width: 1,
        },
      },
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        color: placeholderColor,
      },
      splitLine: {
        lineStyle: {
          color: borderColor,
        },
      },
    },
    series: [
      {
        name: '付费率',
        data: outArray,
        type: 'line',
        smooth: false,
        showSymbol: true,
        symbol: 'circle',
        symbolSize: 8,
        itemStyle: {
          borderColor,
          borderWidth: 1,
        },
        areaStyle: {
          opacity: 0.1,
        },
      },
      {
        name: '日活',
        data: inArray,
        type: 'line',
        smooth: false,
        showSymbol: true,
        symbol: 'circle',
        symbolSize: 8,
        itemStyle: {
          borderColor,
          borderWidth: 1,
        },
        areaStyle: {
          opacity: 0.1,
        },
      },
      {
        name: '注册',
        data: waterArray,
        type: 'line',
        smooth: false,
        showSymbol: true,
        symbol: 'circle',
        symbolSize: 8,
        itemStyle: {
          borderColor,
          borderWidth: 1,
        },
        areaStyle: {
          opacity: 0.1,
        },
      },
      {
        name: '流水',
        data: lineArray,
        type: 'line',
        smooth: false,
        showSymbol: true,
        symbol: 'circle',
        symbolSize: 8,
        itemStyle: {
          borderColor,
          borderWidth: 1,
        },
        areaStyle: {
          opacity: 0.1,
        },
      },
    ],
  };
  return dataSet;
}
