# 项目基本配置

## 1.修改界面布局(设置)

配置文件：/src/config/style.ts

预览效果：可放出设置按钮，通过界面修改预览效果

/src/layouts/components/Header.vue组件，找到下面代码并解开注释

```html
<t-tooltip placement="bottom" :content="t('layout.header.setting')">
  <t-button theme="default" shape="square" variant="text" @click="toggleSettingPanel">
    <setting-icon />
  </t-button>
</t-tooltip>
```

