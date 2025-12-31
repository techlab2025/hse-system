<script lang="ts" setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type Params from '@/base/core/params/params'
import TemplateItemForm from './TemplateItemForm.vue'
import AddTemplateItemController from '../controllers/addTemplateItemController'
import type AddTemplateItemParams from '../../Core/params/addTemplateItemParams'

const router = useRouter()
const route = useRoute()
const params = ref<Params | null>(null)

const addTemplateItemController = AddTemplateItemController.getInstance()

const addTemplateItem = async () => {
  console.log(params.value, 'params')
  await addTemplateItemController.addTemplateItem(params.value as AddTemplateItemParams, router, null, Number(route.params.parent_id))
}
const setParams = (data: Params) => {
  params.value = data
}


</script>

<template>
  <form class="grid grid-cols-1 md:grid-cols-4 gap-8 mt-4" @submit.prevent="addTemplateItem">
    <TemplateItemForm @update:data="setParams" />
    <div class="col-span-4 button-wrapper">

      <router-link to="/organization/template?type=1" class="btn btn-cancel w-full" @click.prevent="">cancel</router-link>
      <router-link to="/organization/template" type="submit" class="btn btn-primary w-full">confirm</router-link>
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
