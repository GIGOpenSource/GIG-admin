<template>
  <!-- 常规内容编辑 -->
  <t-dialog v-model:visible="visible" :width="600" header="小说/动漫/漫画编辑" @cancel="onCancel" confirm-btn="保存">
    <t-row>
      <t-col :span="6">
        <p>评论：2323626</p>
      </t-col>
      <t-col :span="6">
        <p>点赞：47474856858658</p>
      </t-col>
    </t-row>

    <div class="table-container">
      <!-- <t-table></t-table> -->
    </div>
  </t-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import { DialogProps } from 'tdesign-vue-next';

interface FormData {
  name: string;
  type: string;
  range: Array<string | number>;
}
const visible = ref(false);
const data = ref<FormData>({
  name: '',
  type: '',
  range: ['', ''],
});

const open = (row: any) => {
  console.log("🚀 ~ row:", row)
  visible.value = true;
};

const onCancel: DialogProps['onCancel'] = () => {
  visible.value = false;
};

defineExpose({
  open,
});
</script>

<style lang="less" scoped></style>
