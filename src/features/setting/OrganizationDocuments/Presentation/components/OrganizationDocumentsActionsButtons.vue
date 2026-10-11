<script setup lang="ts">
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import PermissionBuilder from '@/shared/HelpersComponents/PermissionBuilder.vue'
import { PermissionsEnum } from '@/features/users/Admin/Core/Enum/permission_enum'

const downloadTemplate = () => {
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(
    workbook,
    XLSX.utils.json_to_sheet([
      {
        document_title: 'Safety Policy',
        document_ref: 'DOC-001',
        document_version: '1.0',
        issue_date: '2026-10-06',
        nex_review_date: '2027-10-06',
        document_category_id: 1,
        document_file: 'data:application/pdf;base64,...',
        notes: '',
      },
    ]),
    'Documents',
  )
  saveAs(
    new Blob([XLSX.write(workbook, { type: 'array', bookType: 'xlsx' })]),
    'organization_documents_template.xlsx',
  )
}
</script>
<template>
  <PermissionBuilder
    :code="[
      PermissionsEnum.ORGANIZATION_DOCUMENTS_ALL,
      PermissionsEnum.ORGANIZATION_DOCUMENTS_CREATE,
    ]"
  >
    <router-link class="btn btn-primary" to="/organization/organization-documents/add">{{
      $t('add_organization_documents')
    }}</router-link>
    <router-link class="btn btn-secondary" to="/organization/organization-documents/import-excel">{{
      $t('upload_organization_documents_sheet')
    }}</router-link>
    <button type="button" class="btn btn-secondary" @click="downloadTemplate">
      {{ $t('download_excel_template') }}
    </button>
  </PermissionBuilder>
</template>
