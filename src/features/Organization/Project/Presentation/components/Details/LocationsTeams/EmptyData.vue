<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
const props = defineProps<{
  img: string
  title: string
  subtitle: string
  link?: string
  linkText?: string
}>()
</script>
<template>
  <router-link :to="link || route.path" class="empty-teams">
    <span class="empty-visual"><img :src="img" :alt="$t('empty_state')" /></span>
    <div class="empty-text">
      <p class="title">{{ title }}</p>
      <p class="subtitle">{{ subtitle }}</p>
      <span v-if="linkText" class="empty-action"> {{ linkText }} <i aria-hidden="true">→</i> </span>
    </div>
  </router-link>
</template>

<style scoped lang="scss">
.empty-teams {
  display: flex;
  align-items: center;
  width: 100%;
  min-height: 150px;
  gap: 16px;
  margin: 0;
  padding: 18px;
  border: 1px dashed color-mix(in srgb, var(--PrimaryColor) 22%, var(--main-border));
  border-radius: 17px;
  background:
    linear-gradient(135deg, color-mix(in srgb, var(--PrimaryColor) 6%, transparent), transparent),
    var(--surface-2);
  text-align: start;
  text-decoration: none;
}

.empty-visual {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 100px;
  flex: 0 0 100px;
  border-radius: 26px;
  background: var(--surface-1);
  box-shadow: 0 10px 24px color-mix(in srgb, var(--brand-primary-900) 7%, transparent);
}

.empty-visual img {
  width: 78px;
  height: 78px;
  object-fit: contain;
}

.empty-text {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 5px;
}

.empty-text .title {
  margin: 0;
  color: var(--text-strong);
  font-family: 'Bold';
  font-size: 0.9rem;
  font-weight: 900;
}

.empty-text .subtitle {
  max-width: 520px;
  margin: 0;
  color: var(--text-soft);
  font-size: 0.7rem;
  line-height: 1.55;
}

.empty-action {
  display: inline-flex;
  align-items: center;
  width: fit-content;
  gap: 8px;
  margin-top: 5px;
  color: var(--PrimaryColor);
  font-size: 0.7rem;
  font-weight: 900;
}

.empty-action i {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 7px;
  background: color-mix(in srgb, var(--PrimaryColor) 10%, transparent);
  font-style: normal;
}

[dir='rtl'] .empty-action i {
  transform: rotate(180deg);
}

@media (max-width: 520px) {
  .empty-teams {
    align-items: flex-start;
    flex-direction: column;
  }

  .empty-visual {
    width: 72px;
    height: 72px;
    flex-basis: 72px;
    border-radius: 19px;
  }

  .empty-visual img {
    width: 56px;
    height: 56px;
  }
}
</style>
