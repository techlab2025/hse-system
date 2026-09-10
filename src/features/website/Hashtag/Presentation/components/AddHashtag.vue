<script lang="ts" setup>
import { createStayOnPageRouter } from '@/shared/utils/createStayOnPageRouter'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
// import PrimaryButton from "@/components/HelpersComponents/PrimaryButton.vue";
import HashtagForm from './HashtagForm.vue'
import type Params from '@/base/core/params/params'
import type AddHashtagParams from '../../Core/params/addHashtagParams'
import AddHashtagController from '../controllers/addHashtagController'

const router = useRouter()
const stayOnPageRouter = createStayOnPageRouter(router)
const params = ref<Params | null>(null)
const formKey = ref(0)

const addHashtagController = AddHashtagController.getInstance()

const addHashtag = async () => {
  await addHashtagController.addHashtag(params.value as AddHashtagParams, router)
}

const saveAndNew = async () => {
  addHashtagController.setLoading()
  await addHashtagController.addHashtag(params.value as AddHashtagParams, stayOnPageRouter)
  if (addHashtagController.isDataSuccess()) {
    params.value = null
    formKey.value++
  }
}
const setParams = (data: Params) => {
  params.value = data
}
</script>

<template>
  <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="addHashtag">
    <HashtagForm :key="formKey" @update:data="setParams" />

    <div class="col-span-4 button-wrapper create-form-actions">
      <button type="button" class="btn btn-secondary" @click.prevent="saveAndNew">
        {{ $t('save and new') }}
      </button>
      <button type="submit" class="btn btn-primary">{{ $t('save') }}</button>
    </div>
  </form>
</template>

<style scoped></style>
