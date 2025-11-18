<script setup lang="ts">
import { ref } from 'vue'
import Dialog from 'primevue/dialog'

const visible = ref(false)

const props = withDefaults(
  defineProps<{
    certificateImage?: string
  }>(),
  {
    certificateImage: '',
  },
)
</script>

<template>
  <div class="card flex justify-center">
    <button @click="visible = true" type="button" :disabled="!props.certificateImage">
      <span class="link">{{ $t('Certification') }}</span>
    </button>
    <Dialog
      v-model:visible="visible"
      maximizable
      modal
      :header="$t('Certification')"
      :style="{ width: '50rem' }"
      :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
    >
      <img :src="props.certificateImage" alt="demo card certificate image " class="demo-img" />
    </Dialog>
  </div>
</template>
