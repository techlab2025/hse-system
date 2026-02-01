<script setup lang="ts">
import LoaderDialog from './base/Presentation/Dialogs/LoaderDialogs/LoaderDialog.vue'
import MainDialog from './base/Presentation/Dialogs/MainDialogs/MainDialog.vue'
import Toast from 'primevue/toast'




</script>

<template>
  <Toast />
  <MainDialog />
  <LoaderDialog />
  <RouterView />
</template>
