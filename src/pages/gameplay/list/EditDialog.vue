<template>
  <t-dialog
    v-model:visible="visible"
    :header="isEdit ? '编辑游戏' : '新增游戏'"
    width="800px"
    :confirm-btn="isEdit ? '更新' : '保存'"
    @confirm="handleConfirm"
    @cancel="handleCancel"
  >
    <t-form ref="formRef" :data="formData" :rules="rules" :label-width="100">
      <t-form-item label="游戏名称" name="name" required>
        <t-input v-model="formData.name" placeholder="输入游戏名称" />
      </t-form-item>

      <t-form-item label="游戏简介" name="title" required>
        <t-input v-model="formData.title" placeholder="输入游戏简介" />
      </t-form-item>

      <t-form-item label="游戏介绍" name="description" required>
        <t-textarea v-model="formData.description" placeholder="输入游戏介绍" :maxlength="1000" :autosize="{ minRows: 4, maxRows: 8 }" />
      </t-form-item>

      <t-form-item label="游戏权限" name="permission" required>
        <t-select v-model="formData.permission" placeholder="请选择游戏权限" @change="handlePermissionChange">
          <t-option key="vip" value="vip" label="VIP" />
          <t-option key="gold" value="gold" label="金币" />
          <t-option key="free" value="free" label="免费" />
        </t-select>
      </t-form-item>

      <t-form-item v-if="formData.permission === 'gold'" label="价格" name="price" required>
        <t-input-number v-model="formData.price" placeholder="请输入价格" :min="0" :precision="2" />
      </t-form-item>

      <!-- 隐藏字段，用于传递is_vip -->
      <input type="hidden" v-model="formData.is_vip" />

      <t-form-item label="游戏标签" name="tags_id">
        <t-select
          v-model="formData.tags_id"
          placeholder="请选择游戏标签"
          multiple
          :options="tagOptions"
          :loading="tagLoading"
          @focus="loadTags"
        />
      </t-form-item>

      <t-form-item label="游戏地址" name="click_url" required>
        <t-input v-model="formData.click_url" placeholder="请输入游戏地址" />
      </t-form-item>

      <t-form-item label="游戏封面" name="image_url" required>
        <t-upload
          v-model="formData.image_url"
          :max="1"
          :autoUpload="true"
          :requestMethod="handleSingleUpload"
          accept="image/png"
          theme="image"
           :sizeLimit="5 * 1024 * 1024"
          @remove="handleRemoveCover"
        >
          <template #file-input>
            <div class="upload-placeholder">
              <t-icon name="image" size="24" />
              <div class="upload-text">点击上传封面</div>
            </div>
          </template>
        </t-upload>
      </t-form-item>

      <t-form-item label="游戏图片" name="banner_game_url">
        <div class="upload-container">
          <t-upload
            v-model="formData.banner_game_url"
            :max="5"
            :autoUpload="true"
            :requestMethod="handleMultipleUpload"
            accept="image/*"
            theme="image"
            :sizeLimit="5 * 1024 * 1024"
            multiple
            :show-progress="false"
            :show-file-name="false"
            :display-progress="false"
            @remove="handleRemoveBanner"
            @success="handleBannerUploadSuccess"
          >
            <template #file-input>
              <div class="upload-placeholder">
                <t-icon name="image" size="24" />
                <div class="upload-text">点击上传图片</div>
              </div>
            </template>
          </t-upload>
          <div class="upload-tip">最多上传5张</div>
        </div>
      </t-form-item>
    </t-form>
  </t-dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { MessagePlugin } from 'tdesign-vue-next';
import { createGame, updateGame, uploadImage, getGameDetail,getTages} from '@/api/gameplay';

interface FormData {
  id?: number;
  name: string;
  title: string;
  description: string;
  type: string;
  permission: string;
  is_vip: boolean;
  price?: number;
  click_url: string;
  image_url: any[];
  banner_game_url: any[];
  tags_id: number[];
}

interface TagOption {
  label: string;
  value: number;
}

const visible = ref(false);
const isEdit = ref(false);
const formRef = ref();

// 标签相关数据
const tagOptions = ref<TagOption[]>([]);
const tagLoading = ref(false);

// 上传配置
const uploadAction = '/api/upload/';
const uploadData = {
  type: 'img'
};

// 网格配置
const gridConfig = {
  column: 4,
};

// 多张图片上传处理（游戏图片）
const handleMultipleUpload = async (files: any) => {
  try {
    console.log('开始上传多张图片:', files);

    // 处理不同的文件格式
    let fileList = [];

    if (Array.isArray(files)) {
      // 如果是数组，直接使用
      fileList = files;
    } else if (files && typeof files === 'object') {
      // 如果是单个文件对象，包装成数组
      fileList = [files];
    } else {
      console.warn('无效的文件格式:', files);
      return {
        status: 'fail' as const,
        response: { error: '无效的文件格式' }
      };
    }

    console.log('处理后的文件列表:', fileList);
    const results = [];

    for (const file of fileList) {
      const fileToUpload = file.raw || file;
      if (!fileToUpload) {
        console.warn('跳过无效文件:', file);
        continue;
      }

      const fileName = fileToUpload.name || file.name || `image_${Date.now()}.jpg`;
      console.log('上传文件名:', fileName);

      const response = await uploadImage(fileToUpload);
      console.log('上传成功:', response);

      const imageUrl = response.data?.url || response.data?.path || response.url || response;
      console.log('保存的图片URL:', imageUrl);

      results.push({
        url: imageUrl,
        name: fileName,
        status: 'success' as const,
        response: {
          url: imageUrl,
          ...(response.data || {})
        } as any
      });

    }

    MessagePlugin.success(`成功上传${results.length}张图片`);
    console.log('多张上传结果:', results);

    // 返回TDesign期望的格式
    return {
      status: 'success' as const,
      response: results
    };
  } catch (error) {
    console.error('上传失败:', error);
    MessagePlugin.error('图片上传失败，请重试');
    return {
      status: 'fail' as const,
      response: null
    };
  }
};



// 单张图片上传处理（游戏封面）
const handleSingleUpload = async (file: any) => {
  try {
    console.log('开始上传单张图片:', file);

    // 单张上传时，file是对象
    const fileToUpload = file.raw || file;
    if (!fileToUpload) {
      throw new Error('文件对象不存在');
    }

    const fileName = fileToUpload.name || file.name || `image_${Date.now()}.jpg`;
    console.log('上传文件名:', fileName);

    const response = await uploadImage(fileToUpload);
    console.log('上传成功:', response);
    MessagePlugin.success('图片上传成功');

    const imageUrl = response.data?.url || response.data?.path || response.url || response;
    console.log('保存的图片URL:', imageUrl);

    return {
      url: imageUrl,
      name: fileName,
      status: 'success' as const,
      response: {
        url: imageUrl,
        ...(response.data || {})
      } as any
    };
  } catch (error) {
    console.error('上传失败:', error);
    MessagePlugin.error('图片上传失败，请重试');
    return {
      url: '',
      name: file.name || 'unknown',
      status: 'fail' as const,
      response: null
    };
  }
};


const formData = reactive<FormData>({
  name: '',
  title: '',
  description: '',
  type: 'game',
  permission: '',
  is_vip: false,
  price: 0,
  click_url: '',
  image_url: [],
  banner_game_url: [],
  tags_id: [],
});

// 确保文件列表始终是数组
const ensureFileList = (fileList: any) => {
  if (!Array.isArray(fileList)) {
    return [];
  }
  return fileList;
};

const rules = {
  name: [{ required: true, message: '请输入游戏名称', type: 'error' as const }],
  title: [{ required: true, message: '请输入游戏简介', type: 'error' as const }],
  description: [{ required: true, message: '请输入游戏介绍', type: 'error' as const }],
  permission: [{ required: true, message: '请选择游戏权限', type: 'error' as const }],
  price: [
    {
      required: true,
      message: '请输入价格',
      type: 'error' as const,
      validator: (val: any) => {
        if (formData.permission === 'gold' && (!val || val <= 0)) {
          return { result: false, message: '金币权限必须设置价格' };
        }
        return { result: true, message: '' };
      }
    }
  ],
  click_url: [{ required: true, message: '请输入游戏地址', type: 'error' as const }],
  image_url: [{
    required: true,
    message: '请上传游戏封面',
    type: 'error' as const,
    trigger: 'change' as const // 只在内容变化时校验
  }],
  tags_id: [{
    required: true,
    message: '请选择游戏标签',
    type: 'error' as const,
    trigger: 'change' as const // 只在内容变化时校验
  }],
  banner_game_url: [{
    required: true,
    message: '请上传游戏图片',
    type: 'error' as const,
    trigger: 'change' as const // 只在内容变化时校验
  }],
};

const open = async (data?: FormData) => {
  visible.value = true;
  isEdit.value = !!data;

  // 清除之前的校验状态
  if (formRef.value) {
    formRef.value.clearValidate();
  }

  if (data && data.id) {
    // 编辑模式：调用API获取完整详情
    try {
      console.log('获取游戏详情，ID:', data.id);
      const response = await getGameDetail(data.id);
      console.log('游戏详情API返回:', response);

      const gameData = response.data || response;
      console.log('游戏详情数据:', gameData);

      // 处理图片数据
      const imageUrl = gameData.image_url || gameData.cover || '';
      const bannerGameUrl = gameData.banner_game_url || gameData.images || '';

      // 将字符串形式的图片URL转换为upload组件需要的格式
      const imageUrlList = imageUrl ? [{
        url: imageUrl,
        name: '封面图片',
        status: 'success' as const,
        response: { url: imageUrl }
      }] : [];

      const bannerUrlList = bannerGameUrl ?
        bannerGameUrl.split(',').map((url: string, index: number) => ({
          url: url.trim(),
          name: `游戏图片${index + 1}`,
          type: 'image',
          removeBtn: false,
          status: 'success' as const,
          response: { url: url.trim() }
        })) : [];

      // 根据is_vip和price字段判断权限类型
      let permissionType = 'free';
      if (gameData.is_vip === true && gameData.price > 0) {
        permissionType = 'gold';
      } else if (gameData.is_vip === true && gameData.price === 0) {
        permissionType = 'vip';
      } else if (gameData.is_vip === false && gameData.price === 0) {
        permissionType = 'free';
      }

      console.log('权限判断:', {
        is_vip: gameData.is_vip,
        price: gameData.price,
        permissionType: permissionType
      });

      // 填充表单数据
      Object.assign(formData, {
        id: gameData.id,
        name: gameData.name || '',
        title: gameData.title || gameData.brief || '',
        description: gameData.description || '',
        type: gameData.type || 'game',
        permission: permissionType,
        is_vip: gameData.is_vip || false,
        price: gameData.price || 0,
        click_url: gameData.click_url || gameData.url || '',
        image_url: imageUrlList,
        banner_game_url: bannerUrlList,
        tags_id: Array.isArray(gameData.tags_id) ? gameData.tags_id : (gameData.tags_id ? gameData.tags_id.split(',').map(Number) : []),
      });

      console.log('填充后的表单数据:', formData);
    } catch (error) {
      console.error('获取游戏详情失败:', error);
      MessagePlugin.error('获取游戏详情失败，请重试');
      visible.value = false;
      return;
    }
  } else {
    // 新增模式
    resetForm();
  }
};

const resetForm = () => {
  Object.assign(formData, {
    name: '',
    title: '',
    description: '',
    type: 'game',
    permission: '',
    is_vip: false,
    price: 0,
    click_url: '',
    image_url: [],
    banner_game_url: [],
    tags_id: [],
  });
};

const handleConfirm = async () => {
  // 先进行表单校验
  const valid = await formRef.value?.validate();
  if (!valid) {
    MessagePlugin.error('请检查表单填写是否完整');
    return;
  }

  // 手动校验必填字段
  if (!formData.name || formData.name.trim() === '') {
    MessagePlugin.error('请输入游戏名称');
    return;
  }

  if (!formData.title || formData.title.trim() === '') {
    MessagePlugin.error('请输入游戏简介');
    return;
  }

  if (!formData.description || formData.description.trim() === '') {
    MessagePlugin.error('请输入游戏介绍');
    return;
  }

  if (!formData.permission || formData.permission.trim() === '') {
    MessagePlugin.error('请选择游戏权限');
    return;
  }

  if (!formData.click_url || formData.click_url.trim() === '') {
    MessagePlugin.error('请输入游戏地址');
    return;
  }

  if (!formData.image_url || formData.image_url.length === 0) {
    MessagePlugin.error('请上传游戏封面');
    return;
  }

  if (!formData.tags_id || formData.tags_id.length === 0) {
    MessagePlugin.error('请选择游戏标签');
    return;
  }

  if (!formData.banner_game_url || formData.banner_game_url.length === 0) {
    MessagePlugin.error('请上传游戏图片');
    return;
  }

  // 校验金币权限的价格
  if (formData.permission === 'gold' && (!formData.price || formData.price <= 0)) {
    MessagePlugin.error('金币权限必须设置价格');
    return;
  }

  try {
    let bannerUrls = '';
    console.log(formData.banner_game_url,'formData.banner_game_urlformData.banner_game_url')

    if (formData.banner_game_url && formData.banner_game_url.length > 0) {
      const urls = formData.banner_game_url
        .map(file => {
          // 处理不同的响应格式
          const url = file.response[0].url
          return url;
        })
        .filter(url => url && url.trim() !== '');
      if (urls.length > 0) {
        bannerUrls = urls.join(','); // 用逗号拼接数组
      }
    }
    // 校验游戏图片是否成功上传
    if (!bannerUrls || bannerUrls.trim() === '') {
      MessagePlugin.error('游戏图片上传失败，请重新上传');
      return;
    }

    // 校验游戏封面是否成功上传
    const imageUrl = formData.image_url.length > 0 ?
      formData.image_url[0].url || formData.image_url[0].response?.url || formData.image_url[0].name : '';

    if (!imageUrl || imageUrl.trim() === '') {
      MessagePlugin.error('游戏封面上传失败，请重新上传');
      return;
    }

    console.log('最终bannerUrls:', bannerUrls);

    const submitData = {
      ...formData,
      image_url: imageUrl,
      banner_game_url: bannerUrls,
      tags_id: formData.tags_id // 直接传递标签ID数组
    };

    // 移除permission字段，不传递给后端
    delete submitData.permission;

    console.log('提交数据:', submitData);
    console.log('封面图片URL:', submitData.image_url);
    console.log('游戏图片URLs:', submitData.banner_game_url);

    if (isEdit.value) {
      await updateGame(submitData);
      MessagePlugin.success('更新成功');
    } else {
      await createGame(submitData);
      MessagePlugin.success('创建成功');
    }

    visible.value = false;
    emit('confirm');
  } catch (error) {
    console.error('操作失败:', error);
    MessagePlugin.error(isEdit.value ? '更新失败' : '创建失败');
  }
};

const handleCancel = () => {
  visible.value = false;
  resetForm();
};

// 处理游戏权限变化
const handlePermissionChange = (value: any) => {
  if (value === 'vip') {
    formData.is_vip = false;
    formData.price = 0;
  } else if (value === 'gold') {
    formData.is_vip = true;
    // 保持当前价格，如果为空则设为0
    if (!formData.price) {
      formData.price = 0;
    }
  } else if (value === 'free') {
    formData.is_vip = false;
    formData.price = 0;
  }
};

// 处理封面图片移除
const handleRemoveCover = (context: any) => {
  console.log('移除封面图片:', context);
  if (context && context.fileList) {
    formData.image_url = ensureFileList(context.fileList);
  } else {
    formData.image_url = [];
  }
};

// 处理游戏图片移除
const handleRemoveBanner = (context: any) => {
  console.log('移除游戏图片:', context);
  if (context && context.fileList) {
    formData.banner_game_url = ensureFileList(context.fileList);
  } else {
    formData.banner_game_url = [];
  }
};

// 处理游戏图片上传成功
const handleBannerUploadSuccess = (context: any) => {
  console.log('游戏图片上传成功:', context);
  if (context && context.fileList) {
    formData.banner_game_url = ensureFileList(context.fileList);
    console.log('更新后的banner_game_url:', formData.banner_game_url);
  }
};


// 加载标签列表
const loadTags = async () => {
  if (tagOptions.value.length > 0) return; // 已经加载过了

  try {
    tagLoading.value = true;
    console.log('开始加载标签列表');
    const response = await getTages({type:'game'});
    console.log('标签API返回:', response);

    const tags = response.data.results || response || [];
    tagOptions.value = tags.map((tag: any) => ({
      label: tag.name || tag.label || tag.title,
      value: tag.id || tag.value
    }));

    console.log('处理后的标签选项:', tagOptions.value);
  } catch (error) {
    console.error('加载标签失败:', error);
    MessagePlugin.error('加载标签失败，请重试');
  } finally {
    tagLoading.value = false;
  }
};


const emit = defineEmits<{
  confirm: [];
}>();

defineExpose({
  open,
});
</script>

<style lang="less" scoped>
.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 100px;
  border: 2px dashed #d3d3d3;
  border-radius: 6px;
  background-color: #fafafa;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    border-color: var(--td-brand-color);
    background-color: var(--td-brand-color-1);
  }

  .upload-text {
    margin-top: 8px;
    font-size: 12px;
    color: #666;
  }
}

.upload-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.upload-tip {
  margin-top: 8px;
  font-size: 12px;
  color: #999;
  align-self: flex-start;
}


</style>
<style>
.t-upload__card-name{
  display: none !important;
}
</style>
