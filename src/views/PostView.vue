<script setup>
//Vue-核心
import { nextTick, ref } from 'vue'

//Vue-Router
import { useRouter } from 'vue-router'
const router = useRouter()

//Components
import SidebarCard from '@/components/SidebarCard.vue'
import NavbarCard from '@/components/NavbarCard.vue'

//API
import { postPostData, updateUserPhoto } from '@/apis'

//Composables
import { useAlert } from '@/Composables/useAlert.js'
const { showAlert } = useAlert()

//Store
import { useUserStore } from '@/stores/userStore.js'
const userStore = useUserStore()
//forfunction
const postContent = ref('')

const selectedImage = ref(null) // 儲存選擇的圖片檔案
const fileInput = ref(null) // 引用隱藏的檔案輸入框
const uploadedFileUrl = ref(null) // 從後端返回的圖片 URL
// 觸發檔案選擇
const triggerFileUpload = () => {
  fileInput.value.click() // 觸發檔案輸入框的點擊事件
}

// 處理檔案選擇
const handleImageUpload = (event) => {
  const file = event.target.files[0]
  selectedImage.value = file // 儲存檔案
  uploadImage() // 自動上傳
}

// 上傳圖片到後端
const uploadImage = async () => {
  const formData = new FormData()
  formData.append('file', selectedImage.value) // 添加檔案
  formData.append('type', 'post') // 指定上傳類型
  try {
    const data = await updateUserPhoto(formData, userStore.token)
    uploadedFileUrl.value = data.fileUrl // 獲取圖片 URL
    showAlert('圖片上傳成功', 'success')
  } catch (error) {
    console.log('上傳失敗：', error)
    showAlert(`${error.response.data.message}`, 'error', 2000)
  }
}

const submitPost = async () => {
  if (!postContent.value) {
    return showAlert('請輸入貼文內容', 'error', 1500)
  }
  const postData = {
    content: postContent.value,
    image: uploadedFileUrl.value,
  }
  await postPostData(postData, userStore.token)
  postContent.value = ''
  uploadedFileUrl.value = ''
  showAlert('新增貼文成功，導回首頁', 'success', 1500)
  nextTick(() => {
    setTimeout(() => {
      router.push({ path: '/index' })
    }, 1500)
  })
}
</script>

<template>
  <NavbarCard></NavbarCard>
  <div class="container">
    <div class="row mt-4">
      <main class="col-lg-9">
        <div class="card border border-3 border-dark">
          <div class="card-header text-center">
            <h5 class="m-0">張貼動態</h5>
          </div>
          <div class="card-body">
            <div class="mb-3">
              <label for="postContent" class="form-label">貼文內容</label>
              <textarea
                id="postContent"
                v-model="postContent"
                class="form-control"
                cols="10"
                rows="10"
                style="resize: none"
                placeholder="輸入您的貼文內容"
              ></textarea>
            </div>
            <!-- 上傳圖片 -->
            <div class="mb-3">
              <div>
                <!-- 上傳檔案按鈕 -->
                <button class="btn btn-primary" @click="triggerFileUpload">上傳圖片</button>
                <!-- 隱藏檔案選擇框 -->
                <input ref="fileInput" type="file" class="d-none" @change="handleImageUpload" />
              </div>
            </div>
            <!-- 圖片預覽 -->
            <div
              v-if="uploadedFileUrl"
              class="mb-3 img-container border border-3 border-dark text-center"
            >
              <img :src="uploadedFileUrl" alt="Image Preview" class="img-fluid-cos" />
            </div>
            <!-- 送出貼文 -->
            <button class="btn btn-success w-100" @click="submitPost">送出貼文</button>
          </div>
        </div>
      </main>
      <SidebarCard></SidebarCard>
    </div>
  </div>
</template>
