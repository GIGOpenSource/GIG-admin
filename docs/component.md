# 组件文档

## 选择APP - 筛选组件

已经全局注册该组件

路径：`/components/select-app`

**使用方法：**

```html
<template>
  <select-app v-model="formData.app" @change="handleChangeApp"> </select-app>
</template>
```

```ts
import { SelectProps } from 'tdesign-vue-next';

// 切换APP
const handleChangeApp: SelectProps['onChange'] = (ctx) => {
  console.log('Selected app:', ctx);
  // 这里可以添加处理逻辑，比如更新图表或列表数据
};
```
