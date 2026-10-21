<script setup lang="ts">
import type InvestigatingDocumentModel from '@/features/Organization/Investigating/Data/models/InvestegationDocumentModel'

defineProps<{
  attachment: InvestigatingDocumentModel
}>()
const isImage = (url: string) => /\.(png|jpe?g|gif|webp|svg|avif)([?#].*)?$/i.test(url)
</script>
<template>
  <div class="investegaion-attachment-card">
    <p class="title">{{ attachment?.title }}</p>
    <div class="investegaion-attachment-card-media">
      <figure
        v-for="(media, index) in attachment?.media"
        :key="media.id || index"
        class="evidence-item"
      >
        <img
          v-if="isImage(media.url)"
          :src="media.url"
          :alt="media.file_name || `Evidence ${index + 1}`"
        />
        <a v-else :href="media.url" target="_blank" rel="noopener noreferrer"
          >{{ media.file_name || `Attachment ${index + 1}` }} ↗</a
        >
        <figcaption v-if="isImage(media.url) && media.file_name">{{ media.file_name }}</figcaption>
      </figure>
    </div>
  </div>
</template>

<style scoped>
.evidence-item {
  min-width: 0;
  margin: 0;
  break-inside: avoid;
}
.evidence-item img {
  display: block;
  width: 100%;
  max-height: 280px;
  object-fit: contain;
  border-radius: 10px;
}
.evidence-item a {
  display: block;
  padding: 18px;
  border: 1px solid var(--brand-primary-100, #dce6ef);
  border-radius: 10px;
  color: var(--brand-primary-500, #245d88);
  overflow-wrap: anywhere;
}
.evidence-item figcaption {
  margin-top: 8px;
  font-size: 11px;
  color: var(--text-soft, #52687a);
  overflow-wrap: anywhere;
}
</style>
