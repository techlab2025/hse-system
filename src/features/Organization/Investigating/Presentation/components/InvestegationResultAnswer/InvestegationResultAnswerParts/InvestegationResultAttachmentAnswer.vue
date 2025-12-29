<script setup lang="ts">
import HeaderPage from '@/features/Organization/Project/Presentation/components/Details/DetailsHeader/HeaderPage.vue';
import AttachmentAnswer from '@/assets/images/AttachmentAnswer.png'
import { ref } from 'vue';
import InvestegaionResultAttachmentCard from '../InvestegationResultAnswerUtils/InvestegaionResultAttachmentCard.vue';
import type InvestigatingDocumentModel from '@/features/Organization/Investigating/Data/models/InvestegationDocumentModel';

const props =defineProps<{
  attachments: InvestigatingDocumentModel[]
}>()
// const attachments = ref([
//   {
//     id: 1,
//     title: "Analysis",
//     images: [
//       AttachmentAnswer,
//       AttachmentAnswer,
//       AttachmentAnswer
//     ]
//   },
//   {
//     id: 2,
//     title: "Analysis",
//     images: [
//       AttachmentAnswer,
//       AttachmentAnswer,
//       AttachmentAnswer
//     ]

//   },
//   {
//     id: 3,
//     title: "Analysis",
//     images: [
//       AttachmentAnswer,
//       AttachmentAnswer,
//       AttachmentAnswer
//     ]

//   },
//   {
//     id: 2,
//     title: "Analysis",
//     images: [
//       AttachmentAnswer,
//       AttachmentAnswer,
//       AttachmentAnswer
//     ]

//   },

// ])


</script>

<template>
  <div class="attachments-answer">
    <div class="header">
      <HeaderPage :title="`Investigation attachments`" :subtitle="`All files added to the investigation`"
        :img="AttachmentAnswer" class="title-header answer-header border-top" />
    </div>

    <div class="content">
      <InvestegaionResultAttachmentCard v-for="(attachment, index) in attachments" :key="index"
        :attachment="attachment" />
    </div>
  </div>
</template>
