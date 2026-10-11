<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import FormLoader from '@/shared/DataStatues/FormLoader.vue'
import ShowObjectivesController from '../controllers/showObjectivesController'
import ShowObjectivesParams from '../../Core/params/showObjectivesParams'
import EditObjectivesController from '../controllers/editObjectivesController'
import ObjectivesForm from './ObjectivesForm.vue'
import EditObjectivesParams from '../../Core/params/editObjectivesParams'
import type AddObjectivesParams from '../../Core/params/addObjectivesParams'

const route = useRoute()
const router = useRouter()
const id = route.params.id
const params = ref<EditObjectivesParams | null>(null)
const formRef = ref<InstanceType<typeof ObjectivesForm> | null>(null)

const showObjectivesController = ShowObjectivesController.getInstance()
const state = ref(showObjectivesController.state.value)

const fetchObjectivesDetails = async () => {
  const ObjectivesParams = new ShowObjectivesParams(Number(id))

  await showObjectivesController.showObjectivesType(ObjectivesParams)
}

onMounted(() => {
  fetchObjectivesDetails()
})

const editObjectives = async () => {
  if (!(await formRef.value?.validateRequiredFields())) return
  await EditObjectivesController.getInstance().editObjectives(params.value!, router)
}

watch(
  () => showObjectivesController.state.value,
  (newState) => {
    if (newState) {
      // console.log(newState)
      state.value = newState
    }
  },
)

const setParams = (data: AddObjectivesParams | EditObjectivesParams) => {
  if (data instanceof EditObjectivesParams) params.value = data
}
</script>

<template>
  <DataStatus :controller="state">
    <template #success>
      <form class="objective-editor-form" @submit.prevent="editObjectives">
        <ObjectivesForm ref="formRef" @update:data="setParams" :data="state.data!" />
        <div class="objective-action-bar create-form-actions">
          <button type="submit" class="btn btn-primary">{{ $t('save') }}</button>
        </div>
      </form>
    </template>
    <template #loader>
      <FormLoader :inputsCount="5" />
    </template>
  </DataStatus>
</template>

<style scoped>
.objective-editor-form {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  align-items: start;
  gap: 14px;
  width: 100%;
}

.objective-action-bar {
  position: sticky;
  z-index: 5;
  bottom: 14px;
  grid-column: 1 / -1;
  justify-self: stretch;
  width: 100%;
  max-width: none;
  min-width: 0;
  box-sizing: border-box;
  padding: 10px;
  border: 1px solid color-mix(in srgb, var(--PrimaryColor) 12%, var(--main-border));
  border-radius: 16px;
  background: color-mix(in srgb, var(--surface-1) 92%, transparent);
  box-shadow: 0 16px 32px color-mix(in srgb, var(--brand-primary-900) 10%, transparent);
  backdrop-filter: blur(12px);
}

.objective-action-bar .btn {
  min-height: 42px;
  border-radius: 12px !important;
  font-weight: 800;
}

@media (max-width: 768px) {
  .objective-editor-form {
    grid-template-columns: 1fr;
  }

  .objective-action-bar {
    grid-column: 1 / -1;
  }
}
</style>
