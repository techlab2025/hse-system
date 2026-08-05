<script setup lang="ts">
import SidebarUnicon from '@/shared/icons/SidebarUnicon.vue'

const props = defineProps<{
  img?: string
  icon?: string
  title: string
  subtitle?: string
}>()
</script>
<template>
  <div class="section-header">
    <span v-if="icon || img" class="section-img-wrap">
      <SidebarUnicon v-if="icon" :name="icon" class="section-icon" />
      <img v-else class="section-img" :src="img" :alt="$t('section_illustration')" />
    </span>
    <div class="header-text">
      <!-- <span class="section-eyebrow">{{ $t('Project workspace') }}</span> -->
      <p class="title" v-if="title">{{ $t(title) }}</p>
      <p class="subtitle" v-if="subtitle">{{ $t(subtitle) }}</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.section-header {
  display: flex;
  align-items: center;
  min-width: 0;
  gap: 13px;
}

.section-img-wrap {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  flex: 0 0 52px;
  border: 1px solid color-mix(in srgb, var(--PrimaryColor) 16%, transparent);
  border-radius: 16px;
  background:
    linear-gradient(145deg, color-mix(in srgb, var(--PrimaryColor) 11%, transparent), transparent),
    var(--surface-1);
  box-shadow: 0 8px 18px color-mix(in srgb, var(--PrimaryColor) 11%, transparent);
}

.section-img-wrap .section-img {
  width: 38px;
  height: 38px;
  padding: 3px;
  border-radius: 0;
  background: transparent;
  object-fit: contain;
}

.section-img-wrap .section-icon {
  width: 30px;
  height: 30px;
  color: var(--PrimaryColor);
}

.header-text {
  display: flex;
  min-width: 0;
  flex-direction: column;
}

.section-eyebrow {
  margin-bottom: 2px;
  color: var(--PrimaryColor);
  font-size: 0.61rem;
  font-weight: 900;
  letter-spacing: 0.09em;
  text-transform: uppercase;
}

.header-text .title {
  margin: 0;
  color: var(--text-strong);
  font-family: 'Bold';
  font-size: clamp(1rem, 1.5vw, 1.18rem);
  font-weight: 900;
  line-height: 1.35;
}

.header-text .subtitle {
  max-width: 610px;
  margin: 2px 0 0;
  color: var(--text-soft);
  font-size: 0.72rem;
  font-weight: 600;
  line-height: 1.5;
}

@media (max-width: 540px) {
  .section-header {
    align-items: flex-start;
  }

  .section-img-wrap {
    width: 44px;
    height: 44px;
    flex-basis: 44px;
    border-radius: 13px;
  }

  .section-img-wrap .section-img {
    width: 32px;
    height: 32px;
  }

  .section-img-wrap .section-icon {
    width: 27px;
    height: 27px;
  }
}
</style>
