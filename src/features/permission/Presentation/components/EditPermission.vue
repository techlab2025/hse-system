<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue'
import { canAny, validatePermissionChanges } from '../Helpers/organization_permission'
import { PermissionsEnum } from '@/features/users/Admin/Core/Enum/permission_enum'
import type AddPermissionParams from '../../Core/params/addPermissionParams'
import { useRoute, useRouter } from 'vue-router'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import FormLoader from '@/shared/DataStatues/FormLoader.vue'
import PermissionForm from './PermissionForm.vue'
import ShowPermissionteController from '../controllers/showPermissionController'
import ShowPermissionParams from '../../Core/params/showPermissionParams'
import EditPermissionController from '../controllers/editPermissionController'
import { getOrganizationType } from '../Helpers/organization_type'

const route = useRoute()
const router = useRouter()
const params = ref<AddPermissionParams | null>(null)
const canEdit = computed(
  () =>
    canAny([PermissionsEnum.PERMISSION_UPDATE]) &&
    state.value.data?.isScopedTo(type, Number(route.params.id)) === true,
)

const showPermissionController = ShowPermissionteController.getInstance()
const state = ref(showPermissionController.state.value)

const baseSegment = `${route.path.split('/')[1]}`
const type = getOrganizationType(baseSegment)

const fetchPermissionDetails = async () => {
  const PermissionParams = new ShowPermissionParams(type, +route.params.id)

  await showPermissionController.showPermission(PermissionParams)
}

onMounted(() => {
  fetchPermissionDetails()
})

const EditPermission = async () => {
  if (!canEdit.value || !params.value) return
  const original = state.value.data?.permission.map((item) => item.permission) ?? []
  if (!validatePermissionChanges(original, params.value.permission)) return
  await EditPermissionController.getInstance().editPermission(params.value, router)
}

watch(
  () => showPermissionController.state.value,
  (newState) => {
    if (newState) {
      // console.log(newState.data?.permission)
      state.value = newState
    }
  },
)

const setParams = (data: AddPermissionParams) => {
  params.value = data
}
</script>

<template>
  <DataStatus :controller="state">
    <template #success>
      <!--      <pre>-->
      <!--              {{ state.data?.titles }}-->

      <!--      </pre>-->
        <!-- v-if="state.data?.isScopedTo(type, Number(route.params.id))" -->

      <form
        v-if="state.data?.isScopedTo(type, Number(route.params.id))"
        @submit.prevent="EditPermission"
      >
        <PermissionForm @update:data="setParams" :data="state.data!" />
        <div class="col-span-4 button-wrapper">
          <button v-if="canEdit" type="submit" class="btn btn-primary" :disabled="!params">
            {{ $t('save') }}
          </button>
        </div>
      </form>
      <p v-else role="alert">{{ $t('authorization.unscopedAssignments') }}</p>
    </template>
    <template #loader>
      <FormLoader :inputsCount="5" />
    </template>
  </DataStatus>
</template>

<style scoped></style>
