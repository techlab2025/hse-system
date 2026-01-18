<script setup lang="ts">
import PagesHeader from '@/shared/HelpersComponents/PagesHeader.vue'
import AddSerialForm from './AddSerialForm.vue'
</script>

<template>
  <div>
    <PagesHeader :title="$t('Serial Number Management')" />
    <div>
      <AddSerialForm />
    </div>
  </div>
</template>
