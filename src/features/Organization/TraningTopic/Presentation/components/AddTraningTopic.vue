<script lang="ts" setup>
import { createStayOnPageRouter } from '@/shared/utils/createStayOnPageRouter'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PermissionBuilder from '@/shared/HelpersComponents/PermissionBuilder.vue'
import DataFailed from '@/shared/DataStatues/DataFailed.vue'
import { PermissionsEnum } from '@/features/users/Admin/Core/Enum/permission_enum'
import TraningTopicForm from '@/features/Organization/TraningTopic/Presentation/components/TraningTopicForm.vue'
import AddTraningTopicController from '@/features/Organization/TraningTopic/Presentation/controllers/addTraningTopicController.ts'
import AddTraningTopicParams from '@/features/Organization/TraningTopic/Core/params/addTraningTopicParams.ts'
import type Params from '@/base/core/params/params'

const router = useRouter()
const stayOnPageRouter = createStayOnPageRouter(router)
const route = useRoute()
const params = ref<Params | null>(null)
const formKey = ref(0)
const emit = defineEmits(['update:data'])
const addTraningTopicController = AddTraningTopicController.getInstance()

const createPermissions = [
  PermissionsEnum.ADMIN,
  PermissionsEnum.ORGANIZATION_EMPLOYEE,
  PermissionsEnum.TRANING_TOPIC_ALL,
  PermissionsEnum.TRANING_TOPIC_CREATE,
  PermissionsEnum.ORG_TRANING_TOPIC_ALL,
  PermissionsEnum.ORG_TRANING_TOPIC_CREATE,
]

const setParams = (data: Params) => {
  params.value = data
}

const addTraningTopic = async () => {
  if (!params.value) return

  addTraningTopicController.setLoading()
  await addTraningTopicController.addTraningTopic(
    params.value as AddTraningTopicParams,
    router,
  )

  if (addTraningTopicController.isDataSuccess()) emit('update:data')
}

const saveAndNew = async () => {
  if (!params.value) return

  addTraningTopicController.setLoading()
  await addTraningTopicController.addTraningTopic(
    params.value as AddTraningTopicParams,
    stayOnPageRouter,
    true,
  )

  if (addTraningTopicController.isDataSuccess()) {
    params.value = null
    formKey.value++
  }
}
</script>

<template>
  <PermissionBuilder :code="createPermissions">
    <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="addTraningTopic">
      <TraningTopicForm :key="formKey" @update:data="setParams" />

      <div class="col-span-4 button-wrapper create-form-actions">
        <button type="button" @click.prevent="saveAndNew" class="btn btn-secondary">
          {{ $t('save and new') }}
        </button>
        <button type="submit" class="btn btn-primary">
          {{ route.path.includes('project-progress') ? $t('save and next step') : $t('save') }}
        </button>
      </div>
    </form>

    <template #notPermitted>
      <DataFailed add-text="Have not Permission" description="" link="" />
    </template>
  </PermissionBuilder>
</template>
