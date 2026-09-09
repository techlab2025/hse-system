<script lang="ts" setup>
import { createStayOnPageRouter } from '@/shared/utils/createStayOnPageRouter'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type Params from '@/base/core/params/params'
import TemplateItemForm from './TemplateItemForm.vue'
import AddTemplateItemController from '../controllers/addTemplateItemController'
import type AddTemplateItemParams from '../../Core/params/addTemplateItemParams'

const router = useRouter()
const stayOnPageRouter = createStayOnPageRouter(router)
const route = useRoute()
const params = ref<Params | null>(null)
const formKey = ref(0)

const addTemplateItemController = AddTemplateItemController.getInstance()

const addTemplateItem = async () => {
  console.log(params.value, 'params')
  await addTemplateItemController.addTemplateItem(
    params.value as AddTemplateItemParams,
    router,
    null,
    Number(route.params.parent_id),
  )
}

const saveAndNew = async () => {
  console.log(params.value, 'params')
  addTemplateItemController.setLoading()
  await addTemplateItemController.addTemplateItem(
    params.value as AddTemplateItemParams,
    stayOnPageRouter,
    null,
    Number(route.params.parent_id),
  )
  if (addTemplateItemController.isDataSuccess()) {
    params.value = null
    formKey.value++
  }
}
const setParams = (data: Params) => {
  params.value = data
}
</script>

<template>
  <form class="grid grid-cols-1 md:grid-cols-4 gap-8 mt-4" @submit.prevent="addTemplateItem">
    <TemplateItemForm :key="formKey" @update:data="setParams" />
    <div class="col-span-4 button-wrapper create-form-actions">
      <router-link
        to="/organization/template?type=1"
        class="btn btn-cancel w-full"
        @click.prevent=""
        >cancel</router-link
      >
      <button type="button" class="btn btn-secondary" @click.prevent="saveAndNew">
        {{ $t('save and new') }}
      </button>
      <button type="submit" class="btn btn-primary w-full">confirm</button>
    </div>
  </form>
</template>

<style scoped>
.button-wrapper {
  display: flex;
  justify-content: center;
  gap: 5px;

  .btn-primary {
    width: 70%;
  }

  .btn-cancel {
    width: 30%;
  }
}
</style>
