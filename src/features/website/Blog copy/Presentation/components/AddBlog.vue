<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
// import PrimaryButton from "@/components/HelpersComponents/PrimaryButton.vue";
import BlogForm from './BlogForm.vue'
import type Params from '@/base/core/params/params'
import type AddBlogParams from '../../Core/params/addBlogParams'
import AddBlogController from '../controllers/addBlogController'

const router = useRouter()
const params = ref<Params | null>(null)

const addBlogController = AddBlogController.getInstance()

const addBlog = async () => {
  await addBlogController.addBlog(params.value as AddBlogParams, router)
}
const setParams = (data: Params) => {
  params.value = data
}
</script>

<template>
  <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="addBlog">
    <BlogForm @update:data="setParams" />

    <div class="col-span-4 button-wrapper">
      <button type="submit" class="btn btn-primary">Add</button>
    </div>
  </form>
</template>

<style scoped></style>
