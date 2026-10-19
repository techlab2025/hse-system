<script lang="ts" setup>
import { canOrganizationOperation } from '@/features/permission/Presentation/Helpers/organization_authorization'

import { canPolicy } from '@/features/permission/Presentation/Helpers/organization_authorization'
import { organizationApiPolicies } from '@/features/permission/Core/organizationPolicies'

import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import FormLoader from '@/shared/DataStatues/FormLoader.vue'
import MeetingTypeForm from '@/features/Organization/MeetingType/Presentation/components/MeetingTypeForm.vue'
import AddMeetingTypeParams from '../../Core/params/addMeetingTypeParams'
import EditMeetingTypeParams from '../../Core/params/editMeetingTypeParams'
import ShowMeetingTypeController from '../controllers/showMeetingTypeController'
import ShowMeetingTypeParams from '../../Core/params/showMeetingTypeParams'
import EditMeetingTypeController from '../controllers/editMeetingTypeController'

const route = useRoute()
const router = useRouter()
const id = route.params.id
const params = ref<EditMeetingTypeParams | null>(null)
const formRef = ref<InstanceType<typeof MeetingTypeForm> | null>(null)

const showMeetingTypeController = ShowMeetingTypeController.getInstance()
const state = ref(showMeetingTypeController.state.value)
const fetchMeetingTypeDetails = async () => {
  const MeetingTypeParams = new ShowMeetingTypeParams(Number(id))

  await showMeetingTypeController.showMeetingType(MeetingTypeParams)
}

onMounted(() => {
  fetchMeetingTypeDetails()
})

const editMeetingType = async () => {
  if (!canOrganizationOperation('update_meeting_type')) return

  if (!(await formRef.value?.validateRequiredFields())) return
  await EditMeetingTypeController.getInstance().editMeetingType(params.value!, router)
}

watch(
  () => showMeetingTypeController.state.value,
  (newState) => {
    if (newState) {
      state.value = newState
    }
  },
)

const setParams = (data: AddMeetingTypeParams | EditMeetingTypeParams) => {
  if (data instanceof EditMeetingTypeParams) params.value = data
}
</script>

<template>
  <template v-if="canPolicy(organizationApiPolicies['update_meeting_type'])">

  <DataStatus :controller="state">
    <template #success>
      <!--      <pre>-->
      <!--              {{ state.data?.titles }}-->

      <!--      </pre>-->
      <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="editMeetingType">
        <MeetingTypeForm ref="formRef" @update:data="setParams" :data="state.data!" />
        <div class="col-span-4 button-wrapper">
          <button v-if="canOrganizationOperation('update_meeting_type')" type="submit" class="btn btn-primary">{{ $t('save') }}</button>
        </div>
      </form>
    </template>
    <template #loader>
      <FormLoader :inputsCount="5" />
    </template>
  </DataStatus>

  </template>
</template>

<style scoped></style>
