<script lang="ts" setup>
import { markRaw, onMounted, ref } from 'vue'
import Dialog from 'primevue/dialog'
import HeaderSection from '@/features/Organization/Project/Presentation/components/Details/DetailsHeader/HeaderSection.vue'


const emit = defineEmits<{
  (e: 'update:data', payload: { title: any; files: any[] }): void
}>()

const visible = ref(false)

const SendData = () => {

  visible.value = false
}

</script>

<template>
  <button class="btn btn-secondary" @click="visible = true">
    {{ $t('close_investegation') }}
  </button>

  <Dialog v-model:visible="visible" modal :dismissableMask="true" :style="{ width: '50vw' }"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
    <template #header>
      <HeaderSection title="Close Investegation" subtitle="Close This Investegation" />
    </template>

    <div class="investegation-attachment-dialog-content">
      <hr class="attch-hr" />


    </div>

    <button class="btn btn-primary w-full" @click="SendData">
      Confirm
    </button>
  </Dialog>
</template>
