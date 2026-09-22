<script lang="ts" setup>
import { ref } from 'vue'
import * as XLSX from 'xlsx'
import { useRouter } from 'vue-router'
import FileUpload from '@/features/Organization/OrganizationEmployee/Presentation/supcomponents/ExcelSheetHandle/FileUpload.vue'
import ExcelSheetColumnsHandle from '@/features/Organization/OrganizationEmployee/Presentation/supcomponents/ExcelSheetHandle/ExcelSheetColumnsHandle.vue'
import PermissionBuilder from '@/shared/HelpersComponents/PermissionBuilder.vue'
import DataFailed from '@/shared/DataStatues/DataFailed.vue'
import { PermissionsEnum } from '@/features/users/Admin/Core/Enum/permission_enum'
import AddTraningTopicController from '../controllers/addTraningTopicController'
import AddTraningTopicExcelParams, { type Data } from '../../Core/params/addTraningTopicExcelParams'
import { OpenWarningDilaog } from '@/base/Presentation/utils/OpenWarningDialog'

const emit = defineEmits<{ uploaded: [] }>()
const router = useRouter()
const addController = AddTraningTopicController.getInstance()

const Data = ref<any[][]>([])
const mappedData = ref<any[][] | null>(null)
const sheetData = ref<any[][]>([])
const SendData = ref<string[]>(['title'])
const SendDataLabels: Record<string, string> = {
  title: 'Title',
}

const createPermissions = [
  PermissionsEnum.ADMIN,
  PermissionsEnum.ORGANIZATION_EMPLOYEE,
  PermissionsEnum.TRANING_TOPIC_ALL,
  PermissionsEnum.TRANING_TOPIC_CREATE,
  PermissionsEnum.ORG_TRANING_TOPIC_ALL,
  PermissionsEnum.ORG_TRANING_TOPIC_CREATE,
]

const getBodyData = (data: any[][]) => data.slice(1)

const onFileData = (data: any[][]) => {
  Data.value = data
  mappedData.value = data
  sheetData.value = getBodyData(data)
}

const onColumnMapping = (mapping: Record<string, string>) => {
  if (!Data.value.length) return

  const reverseMapping: Record<string, string> = {}
  Object.entries(mapping).forEach(([sentKey, excelCol]) => {
    if (excelCol) reverseMapping[excelCol] = sentKey
  })

  const cloned = Data.value.map((row) => [...row])
  cloned[0] = cloned[0].map((col: string) => reverseMapping[col] ?? col)

  const allowedKeys = new Set(SendData.value)
  const headers = cloned[0] as string[]
  const allowedIndexes = headers
    .map((key, index) => (allowedKeys.has(key) ? index : -1))
    .filter((index) => index !== -1)

  mappedData.value = cloned.map((row) => allowedIndexes.map((index) => row[index]))
  sheetData.value = getBodyData(mappedData.value)
}

const deleteRow = (index: number) => {
  if (!mappedData.value) return
  mappedData.value.splice(index + 1, 1)
  sheetData.value = getBodyData(mappedData.value)
}

const upload = async () => {
  if (!mappedData.value?.length) {
    new OpenWarningDilaog('At Least One Excel Row Is Required').openDialog()
    return
  }

  const headers = mappedData.value[0] as string[]
  const rows = mappedData.value.slice(1)

  const dataAsObjects: Data[] = rows.map((row) => {
    const obj: Record<string, unknown> = {}
    headers.forEach((key, index) => {
      if (key?.trim()) obj[key] = row[index]
    })

    return {
      title: String(obj.title ?? '').trim(),
    }
  })

  if (!dataAsObjects.length) {
    new OpenWarningDilaog('At Least One Excel Row Is Required').openDialog()
    return
  }

  if (dataAsObjects.some((row) => !row.title)) {
    new OpenWarningDilaog('Title Is Required For Every Excel Row').openDialog()
    return
  }

  await addController.addTraningTopic(
    new AddTraningTopicExcelParams({ data: dataAsObjects }),
    router,
    true,
  )

  emit('uploaded')
}
</script>

<template>
  <PermissionBuilder :code="createPermissions">
    <div class="flex flex-col gap-4">
      <FileUpload @update:data="onFileData" />

      <ExcelSheetColumnsHandle
        v-if="Data.length"
        :data="Data"
        :sentData="SendData"
        :sentDataLabels="SendDataLabels"
        @update:mapping="onColumnMapping"
      />

      <div v-if="sheetData.length" class="table-responsive">
        <table class="main-table">
          <thead>
            <tr>
              <th>#</th>
              <th>{{ $t('title') }}</th>
              <th>{{ $t('actions') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, index) in sheetData" :key="index">
              <td>{{ index + 1 }}</td>
              <td>{{ row[0] }}</td>
              <td>
                <button type="button" @click="deleteRow(index)">
                  {{ $t('delete') }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <button class="btn btn-primary" :disabled="!sheetData.length" @click="upload">
        {{ $t('upload') }}
      </button>
    </div>

    <template #notPermitted>
      <DataFailed add-text="Have not Permission" description="" link="" />
    </template>
  </PermissionBuilder>
</template>
