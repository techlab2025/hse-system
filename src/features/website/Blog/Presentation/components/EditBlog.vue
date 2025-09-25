<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import FormLoader from '@/shared/DataStatues/FormLoader.vue'
import BlogForm from '@/features/website/Blog/Presentation/components/BlogForm.vue'
import type Params from '@/base/core/params/params'
import ShowBlogParams from '../../Core/params/showBlogParams'
import ShowBlogController from '../controllers/showBlogController'
import EditBlogController from '../controllers/editBlogController'

const route = useRoute()
const router = useRouter()
const id = route.params.id
const params = ref<Params | null>(null)

const showBlogController = ShowBlogController.getInstance()
const state = ref(showBlogController.state.value)
const fetchBlogDetails = async () => {
  const BlogParams = new ShowBlogParams(Number(id))

  await showBlogController.showBlog(BlogParams)
}

onMounted(() => {
  fetchBlogDetails()
})

const EditBlog = async (draft: boolean) => {
  if (draft) {
    await EditBlogController.getInstance().editBlog(params.value!, router)
  } else {
    await EditBlogController.getInstance().editBlog(params.value!, router)
  }
}

watch(
  () => showBlogController.state.value,
  (newState) => {
    if (newState) {
      console.log(newState)
      state.value = newState
    }
  },
)

const setParams = (data: Params) => {
  params.value = data
}
</script>

<template>
  <DataStatus :controller="state">
    <template #success>
      <!--      <pre>-->
      <!--              {{ state.data?.titles }}-->

      <!--      </pre>-->
      <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="EditBlog">
        <BlogForm @update:data="setParams" :data="state.data!" />
        <div class="col-span-4 button-wrapper">
          <button type="submit" class="btn btn-primary">Edit</button>
        </div>
      </form>
    </template>
    <template #loader>
      <FormLoader :inputsCount="5" />
    </template>
  </DataStatus>
</template>

<style scoped></style>
