<script lang="ts" setup>
import { createStayOnPageRouter } from '@/shared/utils/createStayOnPageRouter'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
// import PrimaryButton from "@/components/HelpersComponents/PrimaryButton.vue";
import BlogForm from './BlogForm.vue'
import type Params from '@/base/core/params/params'
import type AddBlogParams from '../../Core/params/addBlogParams'
import AddBlogController from '../controllers/addBlogController'

const router = useRouter()
const stayOnPageRouter = createStayOnPageRouter(router)
const params = ref<Params | null>(null)
const formKey = ref(0)

const addBlogController = AddBlogController.getInstance()

const addBlog = async () => {
  await addBlogController.addBlog(params.value as AddBlogParams, router)
}

const saveAndNew = async () => {
  addBlogController.setLoading()
  await addBlogController.addBlog(params.value as AddBlogParams, stayOnPageRouter)
  if (addBlogController.isDataSuccess()) {
    params.value = null
    formKey.value++
  }
}
const setParams = (data: Params) => {
  params.value = data
}
</script>

<template>
  <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="addBlog">
    <BlogForm :key="formKey" @update:data="setParams" />

    <div class="col-span-4 button-wrapper create-form-actions">
      <button type="button" class="btn btn-secondary" @click.prevent="saveAndNew">
        {{ $t('save and new') }}
      </button>
      <button type="submit" class="btn btn-primary">{{ $t('save') }}</button>
    </div>
  </form>
</template>

<style scoped></style>
