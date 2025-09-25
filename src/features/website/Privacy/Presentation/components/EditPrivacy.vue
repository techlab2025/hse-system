<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import FormLoader from '@/shared/DataStatues/FormLoader.vue'
import PrivacyForm from '@/features/website/Privacy/Presentation/components/PrivacyForm.vue'
import type Params from '@/base/core/params/params'
import ShowPrivacyParams from '../../Core/params/showPrivacyParams'
import ShowPrivacyController from '../controllers/showPrivacyController'
import EditPrivacyController from '../controllers/editPrivacyController'

const router = useRouter()
const params = ref<Params | null>(null)

const showPrivacyController = ShowPrivacyController.getInstance()
const state = ref(showPrivacyController.state.value)
const fetchPrivacyDetails = async () => {
  const PrivacyParams = new ShowPrivacyParams(1)

  await showPrivacyController.showPrivacy(PrivacyParams)
}

onMounted(() => {
  fetchPrivacyDetails()
  // console.log('fetchPrivacyDetails');

})

const EditPrivacy = async (draft: boolean) => {
  if (draft) {
    await EditPrivacyController.getInstance().editPrivacy(params.value!, router)
  } else {
    await EditPrivacyController.getInstance().editPrivacy(params.value!, router)
  }
}

watch(
  () => showPrivacyController.state.value,
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
      <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="EditPrivacy">
        <PrivacyForm @update:data="setParams" :data="state.data!" />
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
