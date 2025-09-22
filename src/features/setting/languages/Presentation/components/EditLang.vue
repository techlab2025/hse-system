<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import EditLangController from '@/features/setting/languages/Presentation/controllers/editLangController'
import ShowLangParams from '@/features/setting/languages/Core/params/showLangParams'
import ShowLangController from '@/features/setting/languages/Presentation/controllers/showLangController.ts'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import FormLoader from '@/shared/DataStatues/FormLoader.vue'
import LangForm from '@/features/setting/languages/Presentation/components/LangForm.vue'
import type Params from '@/base/core/params/params'

const route = useRoute()
const router = useRouter()
const id = route.params.id
const params = ref<Params | null>(null)

const showLangController = ShowLangController.getInstance()
const state = ref(showLangController.state.value)
const fetchLangDetails = async () => {
  const LangParams = new ShowLangParams(Number(id))

  await showLangController.showLang(LangParams)
}

onMounted(() => {
  fetchLangDetails()
})

const EditLang = async (draft: boolean) => {
  if (draft) {
    await EditLangController.getInstance().editLang(params.value!, router)
  } else {
    await EditLangController.getInstance().editLang(params.value!, router)
  }
}

watch(
  () => showLangController.state.value,
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
      <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="EditLang">
        <LangForm @update:data="setParams" :data="state.data!" />
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
