<script setup lang="ts">
import EmptyZoon from '@/assets/images/EmptyZoon.png'
</script>
<template>
  <div class="empty-zoon">
    <div class="empty-zoon-info">
      <p class="no-zoon">{{ $t('No Zoons Yet') }}</p>
      <p class="no-zoon-description">
        {{
          $t('No Zoons has been assigned to this location yet. You can add new areas at any time')
        }}
      </p>
    </div>
    <img :src="EmptyZoon" alt="empty-zoon" />
  </div>
</template>
