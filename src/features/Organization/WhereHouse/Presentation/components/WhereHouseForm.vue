<script lang="ts" setup>
import UpdatedCustomInputSelect from '@/shared/FormInputs/UpdatedCustomInputSelect.vue'
import { computed, nextTick, ref, watch } from 'vue'
import EditWhereHouseParams from '../../Core/params/editWhereHouseParams'
import AddWhereHouseParams from '../../Core/params/addWhereHouseParams'
import type WhereHouseDetailsModel from '../../Data/models/WhereHouseDetailsModel'
import TitleInterface from '@/base/Data/Models/title_interface'
import { useRoute } from 'vue-router'
import IndexWhereHouseTypeController from '@/features/Organization/WhereHouseType/Presentation/controllers/indexWhereHouseTypeController'
import IndexWhereHouseTypeParams from '@/features/Organization/WhereHouseType/Core/params/indexWhereHouseTypeParams'
import SwitchInput from '@/shared/FormInputs/SwitchInput.vue'
import AddWhereHouseType from '@/features/Organization/WhereHouseType/Presentation/components/AddWhereHouseType.vue'
import { useProjectAppStatusStore } from '@/stores/ProjectStatus'
import { OpenWarningDilaog } from '@/base/Presentation/utils/OpenWarningDialog'

const emit = defineEmits(['update:data'])

const props = defineProps<{
  data?: WhereHouseDetailsModel
}>()

const route = useRoute()
const id = route.params.parent_id
const Name = ref<string>()

const updateData = () => {
  const params = props.data?.id
    ? new EditWhereHouseParams(props.data.id, SelectedWhereHouseType?.value?.id, Name.value)
    : new AddWhereHouseParams(SelectedWhereHouseType?.value?.id, Name.value, SerialNumber.value)

  // console.log(SerialNumber, 'SerialNumber')
  emit('update:data', params)
}

const SerialNumber = ref()

const fields = ref([
  {
    key: 'SerialNumber',
    label: 'serial_number',
    placeholder: 'You can leave it (auto-generated)',
    value: SerialNumber.value,
    enabled: props?.data?.SerialNumber ? false : true,
  },
])
const projtecStateus = useProjectAppStatusStore()
const UpdateSerial = (data) => {
  SerialNumber.value = data.target.value
  updateData()
}
const SelectedWhereHouseType = ref<TitleInterface>()

watch(
  [() => props.data],
  ([newData]) => {
    console.log(newData, 'newData')
    Name.value = newData?.name
    const savedLocale = localStorage.getItem('lang')
    SelectedWhereHouseType.value = new TitleInterface({
      id: newData?.warehouse_type?.id,
      title: newData?.warehouse_type?.titles,
    })
  },
  { immediate: true },
)

const indexWhereHouseTypeController = IndexWhereHouseTypeController.getInstance()
const indexWhereHouseTypeParams = new IndexWhereHouseTypeParams('', 1, 10, 1, false)

const setSelectedWhereHouseType = (data: TitleInterface) => {
  SelectedWhereHouseType.value = data
  updateData()
}

const setName = (data) => {
  Name.value = data.target.value
  updateData()
}
const WarehouseTypeDialog = ref<boolean>(false)

type RequiredFieldRule = {
  key: string
  message: string
  isMissing: () => boolean
}

const requiredFieldErrors = ref<Record<string, string>>({})
const hasValue = (value: unknown) =>
  value !== null && value !== undefined && String(value).trim().length > 0

const requiredFields = computed<RequiredFieldRule[]>(() => [
  {
    key: 'Name',
    message: 'Name Is Required',
    isMissing: () => !hasValue(Name.value),
  },
  {
    key: 'SelectedWhereHouseType',
    message: 'Warehouse Type Is Required',
    isMissing: () => !SelectedWhereHouseType.value?.id,
  },
])

const getFieldError = (key: string) => requiredFieldErrors.value[key] ?? ''

const scrollToRequiredField = async (key: string) => {
  await nextTick()
  document.querySelector<HTMLElement>(`[data-required-field="${key}"]`)?.scrollIntoView({
    behavior: 'smooth',
    block: 'center',
  })
}

const validateRequiredFields = async () => {
  const missedFields = requiredFields.value.filter((field) => field.isMissing())
  requiredFieldErrors.value = missedFields.reduce<Record<string, string>>((errors, field) => {
    errors[field.key] = field.message
    return errors
  }, {})

  if (!missedFields.length) return true

  new OpenWarningDilaog(missedFields[0].message).openDialog()
  await scrollToRequiredField(missedFields[0].key)
  return false
}

defineExpose({
  validateRequiredFields,
})
</script>

<template>
  <div class="col-span-4 md:col-span-2 input-wrapper field-required" data-required-field="Name">
    <label for="name">{{ $t('name') }}</label>
    <input
      type="text"
      id="name"
      class="input"
      v-model="Name"
      @input="setName"
      :placeholder="$t('Enter Name')"
    />
    <p v-if="getFieldError('Name')" class="required-field-message">
      {{ getFieldError('Name') }}
    </p>
  </div>

  <div class="input-wrapper col-span-4 md:col-span-2" v-if="!data?.id">
    <label for="serialNumber">{{ $t('serial_number') }}</label>
    <input
      type="text"
      v-model="SerialNumber"
      @input="UpdateSerial"
      id="serialNumber"
      :disabled="projtecStateus.isSerialNumberAuto()"
      :placeholder="
        projtecStateus.isSerialNumberAuto()
          ? 'You can leave it (auto-generated)'
          : 'Enter Your Serial Number'
      "
    />
  </div>

  <div class="col-span-4 md:col-span-2 input-wrapper" data-required-field="SelectedWhereHouseType">
    <!-- <UpdatedCustomInputSelect :required="false" :modelValue="SelectedWhereHouseType"
      :controller="indexWhereHouseTypeController" :params="indexWhereHouseTypeParams" :label="$t('Where House Type')"
      id="Equipment" placeholder="Select Where House Type" @update:modelValue="setSelectedWhereHouseType" /> -->
    <UpdatedCustomInputSelect
      :required="true"
      :modelValue="SelectedWhereHouseType"
      :controller="indexWhereHouseTypeController"
      :params="indexWhereHouseTypeParams"
      :label="$t('warehouse_type')"
      id="Equipment"
      placeholder="Select Warehouse Type"
      @update:modelValue="setSelectedWhereHouseType"
      :isDialog="true"
      v-model:dialogVisible="WarehouseTypeDialog"
    >
      <template #LabelHeader>
        <span class="add-dialog" @click="WarehouseTypeDialog = true">New</span>
      </template>
      <template #Dialog>
        <AddWhereHouseType @update:data="WarehouseTypeDialog = false" />
      </template>
    </UpdatedCustomInputSelect>
    <p v-if="getFieldError('SelectedWhereHouseType')" class="required-field-message">
      {{ getFieldError('SelectedWhereHouseType') }}
    </p>
  </div>
</template>

<style scoped>
.required-field-message {
  margin-top: 0.35rem;
  color: var(--status-danger);
  font-size: 0.82rem;
  font-weight: 700;
}
</style>
