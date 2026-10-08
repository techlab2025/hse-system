<script setup lang="ts">
import type OrganizationDocumentsModel from '../../Data/models/OrganizationDocumentsModel'
defineProps<{ document: OrganizationDocumentsModel }>()
</script>
<template>
  <div class="certificate-card">
    <div class="certificate-info">
      <p class="title">{{ document.document_title }}</p>
      <p>{{ document.document_ref }} · {{ document.document_version }}</p>
      <p>{{ $t('document_category') }}: {{ document.documentCategory?.title }}</p>
      <p>{{ $t('issue_date') }}: {{ document.issue_date }}</p>
      <p>{{ $t('nex_review_date') }}: {{ document.nex_review_date }}</p>
      <p v-if="document.notes">{{ document.notes }}</p>
    </div>
  </div>
</template>
