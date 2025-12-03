<script lang="ts" setup>
import HeaderPage from '@/features/Organization/Project/Presentation/components/Details/DetailsHeader/HeaderPage.vue'
import Investegationattachment from '@/assets/images/Investegationattachment.png'
import InvestegationAttachmentsDialog from '../InvestegationDialogs/InvestegationAttachmentsDialog.vue'

const emit = defineEmits(['update:data'])

const UpdateData = (data) => {
  emit('update:data', data)
}
</script>
<template>
  <div class="investegation-attachment">
    <HeaderPage
      :title="`Investigation attachments`"
      :subtitle="`Add a description of each witness to the incident.`"
      :img="Investegationattachment"
      class="title-header"
    />
    <InvestegationAttachmentsDialog @update:data="UpdateData" />
  </div>
</template>
