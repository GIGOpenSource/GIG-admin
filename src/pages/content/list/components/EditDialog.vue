<template>
  <!-- 小说动漫漫画编辑 -->
  <t-dialog
    v-model:visible="visible"
    :width="600"
    :header="title"
    confirm-btn="保存"
    style="width: 100%"
    @cancel="onCancel"
    @confirm = "onConfirm"
  >
    <t-form ref="formRef" :model="data" label-width="60px" label-align="right">
      <t-row>
        <t-col :span="4">
          <t-form-item label="封面" name="coverUrl">
            <!-- readonly -->
            <t-input v-model="data.coverUrl" class="form-item-content" placeholder="请上传封面"  />
          </t-form-item>
        </t-col>
        <t-col :span="8">
          <t-form-item label="名称" name="title">
            <t-input v-model="data.title" class="form-item-content" placeholder="请输入名称"  />
          </t-form-item>
          <t-form-item label="作者" name="authorNicknamel">
            <t-input v-model="data.authorNicknamel" class="form-item-content" placeholder="请输入作者"  />
          </t-form-item>
          <t-form-item label="标签" name="tags">
            <t-input v-model="data.tags" class="form-item-content" placeholder="输入标签" />
          </t-form-item>
        </t-col>
      </t-row>
      <t-row :style="{ marginTop: 'var(--td-comp-margin-xxl)' }">
        <t-col :span="12">
          <t-form-item label="简介" name="description">
            <t-input v-model="data.description" class="form-item-content" placeholder="请输入简介" />
          </t-form-item>
        </t-col>
      </t-row>
      <!-- 分集列表 -->
      <div class="diversity-list">
        <t-row
          v-for="(diversity, index) in diversitys"
          :key="index"
          align="middle"
          :gutter="16"
          :style="{ marginTop: 'var(--td-comp-margin-xxl)' }"
        >
          <t-col :span="1" style="text-align: right">{{ index + 1 }}</t-col>
          <t-col :span="4">
            <t-input v-model="diversity.title" class="form-item-content" placeholder="分集名称" />
          </t-col>
          <t-col :span="4">
            <t-input v-model="diversity.content" class="form-item-content" placeholder="上传文件" />
          </t-col>
          <t-col :span="1">
            <t-link theme="danger" @click="handleDeleDiversitys(index)">删除</t-link>
          </t-col>
        </t-row>
      </div>

      <!-- 添加分集 -->
      <t-button theme="primary" :style="{ marginTop: 'var(--td-comp-margin-xxl)' }" @click="addDiversity"
        >添加分集</t-button
      >
    </t-form>
  </t-dialog>
</template>
<script setup lang="ts">
import type { DialogProps } from 'tdesign-vue-next';
import { ref } from 'vue';
import { createContent } from '@/api/content';

interface FormData {
      coverUrl:string,
 title:string,
 description:string,
 authorNicknamel:string,
  tags:  Array<string | number>,
}
// 分集类型
interface Diversity {
  title: string;
  content: string;
  status: "DRAFT";
  chapterNum:Number
}
const visible = ref(false);

const title = ref('小说/动漫/漫画编辑');

const data = ref<FormData>({
  coverUrl:'',
 title:'',
 description:'',
 authorNicknamel:'',
  tags:[111.222],
});

const open = (row?: any) => {
  console.log('🚀 ~ row:', row);
  title.value = row?.id ? '小说/动漫/漫画编辑' : '小说/动漫/漫画新建';
  visible.value = true;
};

const onCancel: DialogProps['onCancel'] = () => {
  visible.value = false;
  diversitys.value = []; // 清空分集列表
};

const onConfirm: DialogProps['onConfirm'] =async () => {
  let arr = diversitys.value.map((item,index) => {
    return {
      ...item,
      chapterNum:index + 1
    }
  })
  let params = {
    ...data.value,
    chapters:arr,
    contentType: "NOVEL", 
  }
  
       const res = await createContent(params)
       console.log(res,'resress')
    
};


// 动态表单
const diversitys = ref<Diversity[]>([]);
// 添加分集
const addDiversity = () => {
  diversitys.value.push({
     title: '',
  content: '',
  status: "DRAFT",
  chapterNum:0
  });
};
// 删除分集
const handleDeleDiversitys = (key: number) => {
  diversitys.value = diversitys.value.filter((item) => item.key !== key);
};
defineExpose({
  open,
});
</script>
<style lang="less" scoped>
.diversity-list {
  margin-top: var(--td-comp-margin-xxl);
  max-height: 300px;
  overflow: hidden auto;
  padding-right: 5px;
}
</style>
