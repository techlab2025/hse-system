<script lang="ts" setup>
import { ref } from 'vue'
import Dialog from 'primevue/dialog'
const visible = ref(false)
const emits = defineEmits(['delete'])
</script>

<template>
  <button @click="visible = true" class="w-100 flex items-center gap-sm">
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M14.25 5.25L13.5995 14.3569C13.5434 15.1418 12.8903 15.75 12.1033 15.75H5.89668C5.10972 15.75 4.45656 15.1418 4.40049 14.3569L3.75 5.25M7.5 8.25V12.75M10.5 8.25V12.75M11.25 5.25V3C11.25 2.58579 10.9142 2.25 10.5 2.25H7.5C7.08579 2.25 6.75 2.58579 6.75 3V5.25M3 5.25H15"
        stroke="#EE2527"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
    <span>{{ $t('delete') }}</span>
  </button>
  <Dialog v-model:visible="visible" :modal="true" class="delete-dialog">

    <template #container>
      <img src="@/assets/images/delete-bin-full.png" alt="delete" />
      <h4 class="dialog-title">Are you sure</h4>
      <p class="dialog-message">Now you will delete</p>
      <div class="flex w-full btns">
        <button class="btn btn-primary justify-center mb-sm" @click="emits('delete')">Delete</button>
        <button class="btn btn-secondary" @click="visible = false">Cancel</button>
      </div>
    </template>
  </Dialog>
</template>

<style scoped></style>
