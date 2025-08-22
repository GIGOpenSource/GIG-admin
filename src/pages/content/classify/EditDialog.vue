<template>
  <t-dialog v-model:visible="visible" :width="600" :header="title" confirm-btn="保存" @confirm="onConfirm"
    @cancel="onCancel">
    <t-form ref="formRef" :model="data" label-width="80px">
      <!-- <t-form-item label="分类排序" name="sortOrder">
        <t-input type="number" v-model="data.sortOrder" placeholder="输入分类排序" />
      </t-form-item> -->

      <t-form-item label="分类名称" name="name">
        <t-input v-model="data.name" placeholder="输入分类名称" />
      </t-form-item>
      <t-form-item label="选择父级" name="parentId">
        <t-cascader v-model="data.parentId" :options="options" :keys="{ value: 'id', label: 'name' }" check-strictly
          placeholder="选择父级" clearable />
      </t-form-item>
      <t-form-item label="分类icon" name="iconUrl">
        <t-input v-model="data.iconUrl" placeholder="输入分类icon" />
      </t-form-item>
    </t-form>
  </t-dialog>
</template>
<script setup lang="ts">
import { MessagePlugin, type DialogProps} from 'tdesign-vue-next';
import { ref } from 'vue';

import { categoryDetail, createCategory, updateCategory, categoryTree } from '@/api/content'
const emit = defineEmits(['confirm'])
interface FormData {
  name: string;
  description: string;

  iconUrl: string;
  parentId: string;
  sortOrder: number;
  status: "ACTIVE"
}
const visible = ref(false);

const id = ref(0)
const title = ref('新建分类');
const data = ref<FormData>({
  name: '',
  description: '123455667',
  iconUrl: '',
  parentId: '',
  sortOrder: 1,
  status: "ACTIVE"
});
const options = ref()


const open = (row: any) => {
  id.value = row?.id ? row.id : 0
  title.value = row?.id ? '编辑分类' : '新建分类';
  if (row.id) {
    data.value = row
  } else {
    data.value = {
      name: '',
      description: '123455667',
      iconUrl: '',
      parentId: '',
      sortOrder: 1,
      status: "ACTIVE"
    }
  }
  categoryTree().then(res => {
    options.value = res.data
  })
  if (row?.id) {
    categoryDetail(row.id).then(res => {
      data.value = res.data
    })
  }
  visible.value = true;
};

const onConfirm: DialogProps['onConfirm'] = async () => {
  // if (!data.value.sortOrder) return MessagePlugin.error('请输入分类排序')
  if (!data.value.name) return MessagePlugin.error('请输入分类名称')
  if (!data.value.iconUrl) return MessagePlugin.error('请输入分类icon')
  const fn = id.value > 0 ? updateCategory : createCategory
  const res = await fn(data.value)
  MessagePlugin.success(res.message)
  visible.value = false;
  emit('confirm')
};

const onCancel: DialogProps['onCancel'] = () => {
  visible.value = false;
};

defineExpose({
  open,
});
</script>
<style lang="less" scoped></style>
