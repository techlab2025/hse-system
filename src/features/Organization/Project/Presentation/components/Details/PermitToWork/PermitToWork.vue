<script lang="ts" setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import DatePicker from 'primevue/datepicker'
import InputText from 'primevue/inputtext'

import UpdatedCustomInputSelect from '@/shared/FormInputs/UpdatedCustomInputSelect.vue'

import PermitToWorkController from '../../../controllers/PermitToWork/PermitToWorkController'
import PermitToWorkParams from '@/features/Organization/Project/Core/params/PermitToWork/PermitToWorkParams'

import IndexPTWTypeController from '@/features/Organization/PTWType/Presentation/controllers/indexPTWTypeController'
import IndexPTWTypeParams from '@/features/Organization/PTWType/Core/params/indexPTWTypeParams'

import type TitleInterface from '@/base/Data/Models/title_interface'
import { formatJoinDate } from '@/base/Presentation/utils/date_format'
import { formatTime } from '@/base/Presentation/utils/time_format'

const route = useRoute()
const router = useRouter()

/* =========================
   Form Data
========================= */

const ptwNum = ref<string>('')

const PermitToWorkType = ref<TitleInterface>()

const startDate = ref<Date | null>(null)
const endDate = ref<Date | null>(null)

const startTime = ref<Date | null>(null)
const endTime = ref<Date | null>(null)

const location = ref<string>('')
const description = ref<string>('')

/* =========================
   Validation
========================= */

const requiredFieldErrors = ref<Record<string, string>>({})

const getFieldError = (key: string) => {
  return requiredFieldErrors.value[key] ?? ''
}

const setptwNo = () => {}

/* =========================
   PTW Type
========================= */

const indexPTWTypeController = IndexPTWTypeController.getInstance()

const indexPTWTypeParams = new IndexPTWTypeParams('', 1, 10, 0)

const updatePermitToWorkType = (data: TitleInterface) => {
  PermitToWorkType.value = data
}

/* =========================
   Submit
========================= */

const permitToWorkController = PermitToWorkController.getInstance()

const SubmitFrom = async () => {
  const permitToWorkParams = new PermitToWorkParams({
    project_id: Number(route.params.project_id!),

    ptw_number: ptwNum.value,

    ptw_type_id: PermitToWorkType.value?.id!,

    start_date: formatJoinDate(startDate.value!),
    end_date: formatJoinDate(endDate.value!),

    start_time: formatTime(startTime.value!),
    end_time: formatTime(endTime.value!),

    location: location.value,
    description: description.value,
  })

  await permitToWorkController.PermitToWork(permitToWorkParams, router)
}
</script>

<template>
  <div class="grid grid-cols-4 gap-4">
    <!-- =========================
         PTW Number
    ========================== -->

    <div class="col-span-4 md:col-span-2 input-wrapper field-required" data-required-field="Name">
      <label for="name">
        {{ $t('name') }}
      </label>

      <InputText
        id="name"
        v-model="ptwNum"
        class="input w-full"
        :placeholder="$t('Enter Name')"
        @input="setptwNo"
      />

      <p v-if="getFieldError('Name')" class="required-field-message">
        {{ getFieldError('Name') }}
      </p>
    </div>

    <!-- =========================
         PTW Type
    ========================== -->

    <div
      class="col-span-4 md:col-span-2 input-wrapper"
      data-required-field="SelectedWhereHouseType"
    >
      <UpdatedCustomInputSelect
        :required="true"
        :modelValue="PermitToWorkType"
        :controller="indexPTWTypeController"
        :params="indexPTWTypeParams"
        :label="$t('permit_to_work_type')"
        id="permit_to_work_type"
        placeholder="Select permit_to_work_type"
        @update:modelValue="updatePermitToWorkType"
      />

      <p v-if="getFieldError('SelectedWhereHouseType')" class="required-field-message">
        {{ getFieldError('SelectedWhereHouseType') }}
      </p>
    </div>

    <!-- =========================
         Start Date
    ========================== -->

    <div class="col-span-4 md:col-span-2 input-wrapper">
      <label for="start_date">
        {{ $t('start_date') }}
      </label>

      <DatePicker
        id="start_date"
        v-model="startDate"
        dateFormat="yy-mm-dd"
        showIcon
        fluid
        :placeholder="$t('start_date')"
      />
    </div>

    <!-- =========================
         End Date
    ========================== -->

    <div class="col-span-4 md:col-span-2 input-wrapper">
      <label for="end_date">
        {{ $t('end_date') }}
      </label>

      <DatePicker
        id="end_date"
        v-model="endDate"
        dateFormat="yy-mm-dd"
        showIcon
        fluid
        :minDate="startDate ?? undefined"
        :placeholder="$t('end_date')"
      />
    </div>

    <!-- =========================
         Start Time
    ========================== -->

    <div class="col-span-4 md:col-span-2 input-wrapper">
      <label for="start_time">
        {{ $t('start_time') }}
      </label>

      <DatePicker
        id="start_time"
        v-model="startTime"
        timeOnly
        hourFormat="24"
        showIcon
        fluid
        :placeholder="$t('start_time')"
      />
    </div>

    <!-- =========================
         End Time
    ========================== -->

    <div class="col-span-4 md:col-span-2 input-wrapper">
      <label for="end_time">
        {{ $t('end_time') }}
      </label>

      <DatePicker
        id="end_time"
        v-model="endTime"
        timeOnly
        hourFormat="24"
        showIcon
        fluid
        :placeholder="$t('end_time')"
      />
    </div>

    <!-- =========================
         Location
    ========================== -->

    <div class="col-span-4 md:col-span-2 input-wrapper">
      <label for="location">
        {{ $t('location') }}
      </label>

      <InputText
        id="location"
        v-model="location"
        class="input w-full"
        :placeholder="$t('location')"
      />
    </div>

    <!-- =========================
         Description
    ========================== -->

    <div class="col-span-4 md:col-span-2 input-wrapper">
      <label for="description">
        {{ $t('description') }}
      </label>

      <InputText
        id="description"
        v-model="description"
        class="input w-full"
        :placeholder="$t('description')"
      />
    </div>

    <!-- =========================
         Submit
    ========================== -->

    <div class="col-span-4">
      <button type="button" class="btn btn-primary" @click="SubmitFrom">
        {{ $t('save') }}
      </button>
    </div>
  </div>
</template>
