<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PermissionBuilder from '@/shared/HelpersComponents/PermissionBuilder.vue'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import DataFailed from '@/shared/DataStatues/DataFailed.vue'
import FormLoader from '@/shared/DataStatues/FormLoader.vue'
import { PermissionsEnum } from '@/features/users/Admin/Core/Enum/permission_enum'
import TraningTopicForm from '@/features/Organization/TraningTopic/Presentation/components/TraningTopicForm.vue'
import ShowTraningTopicController from '@/features/Organization/TraningTopic/Presentation/controllers/showTraningTopicController'
import EditTraningTopicController from '@/features/Organization/TraningTopic/Presentation/controllers/editTraningTopicController'
import ShowTraningTopicParams from '@/features/Organization/TraningTopic/Core/params/showTraningTopicParams'
import type EditTraningTopicParams from '@/features/Organization/TraningTopic/Core/params/editTraningTopicParams'
import type Params from '@/base/core/params/params'

const route = useRoute()
const router = useRouter()
const id = Number(route.params.id)
const params = ref<Params | null>(null)

const showTraningTopicController = ShowTraningTopicController.getInstance()
const editTraningTopicController = EditTraningTopicController.getInstance()
const state = ref(showTraningTopicController.state.value)
const showParams = new ShowTraningTopicParams(id)

const detailsPermissions = [
  PermissionsEnum.ADMIN,
  PermissionsEnum.ORGANIZATION_EMPLOYEE,
  PermissionsEnum.TRANING_TOPIC_ALL,
  PermissionsEnum.TRANING_TOPIC_DETAILS,
  PermissionsEnum.ORG_TRANING_TOPIC_ALL,
  PermissionsEnum.ORG_TRANING_TOPIC_DETAILS,
]

const updatePermissions = [
  PermissionsEnum.ADMIN,
  PermissionsEnum.ORGANIZATION_EMPLOYEE,
  PermissionsEnum.TRANING_TOPIC_ALL,
  PermissionsEnum.TRANING_TOPIC_UPDATE,
  PermissionsEnum.ORG_TRANING_TOPIC_ALL,
  PermissionsEnum.ORG_TRANING_TOPIC_UPDATE,
]

const setParams = (data: Params) => {
  params.value = data
}

const fetchTraningTopic = async () => {
  await showTraningTopicController.showTraningTopic(showParams)
}

onMounted(fetchTraningTopic)

watch(
  () => showTraningTopicController.state.value,
  (newState) => {
    if (newState) state.value = newState
  },
  { deep: true },
)

const editTraningTopic = async () => {
  if (!params.value) return

  editTraningTopicController.setLoading()
  await editTraningTopicController.editTraningTopic(
    params.value as EditTraningTopicParams,
    router,
  )
}
</script>

<template>
  <PermissionBuilder :code="detailsPermissions">
    <DataStatus :controller="state">
      <template #success>
        <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="editTraningTopic">
          <TraningTopicForm :data="state.data!" @update:data="setParams" />

          <PermissionBuilder :code="updatePermissions">
            <div class="col-span-4 button-wrapper create-form-actions">
              <button type="submit" class="btn btn-primary">
                {{ $t('save') }}
              </button>
            </div>
          </PermissionBuilder>
        </form>
      </template>

      <template #loader>
        <FormLoader />
      </template>

      <template #initial>
        <FormLoader />
      </template>

      <template #empty>
        <DataFailed title="No Data Found" description="" link="" />
      </template>

      <template #failed>
        <DataFailed title="Failed To Load Traning Topic" description="" link="" />
      </template>
    </DataStatus>

    <template #notPermitted>
      <DataFailed add-text="Have not Permission" description="" link="" />
    </template>
  </PermissionBuilder>
</template>
