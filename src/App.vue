<script setup lang="ts">
import LoaderDialog from './base/Presentation/Dialogs/LoaderDialogs/LoaderDialog.vue'
import MainDialog from './base/Presentation/Dialogs/MainDialogs/MainDialog.vue'
</script>

<template>
  <MainDialog />
  <LoaderDialog />
  <RouterView />
</template>
