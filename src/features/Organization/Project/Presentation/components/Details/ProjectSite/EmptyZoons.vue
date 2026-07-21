<script setup lang="ts">
import EmptyZoon from '@/assets/images/EmptyZoon.png'
</script>
<template>
  <div class="empty-zoon">
    <span class="empty-zone-mark" aria-hidden="true">+</span>
    <div class="empty-zoon-info">
      <p class="no-zoon">{{ $t('No Zoons Yet') }}</p>
      <p class="no-zoon-description">
        {{
          $t('No Zoons has been assigned to this location yet. You can add new areas at any time')
        }}
      </p>
    </div>
    <img :src="EmptyZoon" :alt="$t('no_zones')" />
  </div>
</template>

<style scoped lang="scss">
.empty-zoon {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 11px;
  width: 100%;
  min-height: 88px;
  padding: 11px 12px;
  border: 1px dashed color-mix(in srgb, var(--PrimaryColor) 20%, var(--main-border));
  border-radius: 13px;
  background: color-mix(in srgb, var(--PrimaryColor) 4%, var(--surface-2));
}

.empty-zone-mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 11px;
  background: color-mix(in srgb, var(--PrimaryColor) 10%, transparent);
  color: var(--PrimaryColor);
  font-family: 'Bold';
  font-size: 1.1rem;
}

.empty-zoon-info {
  min-width: 0;
}

.empty-zoon-info .no-zoon {
  margin: 0 0 3px;
  color: var(--text-strong);
  font-family: 'Bold';
  font-size: 0.76rem;
  font-weight: 850;
}

.empty-zoon-info .no-zoon-description {
  margin: 0;
  color: var(--text-soft);
  font-size: 0.66rem;
  line-height: 1.45;
}

.empty-zoon > img {
  width: 64px;
  height: 64px;
  object-fit: contain;
  opacity: 0.7;
}

@media (max-width: 480px) {
  .empty-zoon {
    grid-template-columns: auto minmax(0, 1fr);
  }

  .empty-zoon > img {
    display: none;
  }
}
</style>
