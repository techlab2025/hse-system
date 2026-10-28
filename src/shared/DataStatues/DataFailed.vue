<script setup lang="ts">
import { computed } from 'vue'
import { translateKeyOrLiteral } from '@/localization/i18n'
import { OrganizationTypeEnum } from '@/features/auth/Core/Enum/organization_type'
import { useUserStore } from '@/stores/user'

const props = withDefaults(
  defineProps<{
    title?: string
    description?: string
    link?: string
    addText?: string
    withbtn?: boolean
    variant?: 'failed' | 'empty'
  }>(),
  {
    title: '',
    description: '',
    link: '',
    addText: 'Home',
    withbtn: true,
    variant: 'failed',
  },
)

const userStore = useUserStore()
const actionLink = computed(
  () =>
    props.link ||
    (userStore.user?.type === OrganizationTypeEnum.ADMIN ? '/admin' : '/organization'),
)
</script>

<template>
  <section class="data-state" :class="`data-state--${variant}`" role="status" aria-live="polite">
    <span class="data-state__icon" aria-hidden="true">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <template v-if="variant === 'empty'">
          <path d="M4 4h16v16H4zM4 14h5l1.5 3h3l1.5-3h5M9 8h6M9 11h4" />
        </template>
        <template v-else>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v6m0 4h.01" />
        </template>
      </svg>
    </span>

    <div class="data-state__copy">
      <h2>{{ title || $t(variant === 'empty' ? 'No data available' : 'Failed to load data') }}</h2>
      <p>
        {{
          description ||
          $t(
            variant === 'empty'
              ? 'There are no records to show right now. You can return or create a new record.'
              : 'Please try again.',
          )
        }}
      </p>
    </div>

    <router-link v-if="withbtn" :to="actionLink" class="data-state__action">
      {{ translateKeyOrLiteral(addText) }}
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M5 12h14m-5-5 5 5-5 5"
          stroke="currentColor"
          stroke-width="1.6"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </router-link>
  </section>
</template>

<style scoped>
.data-state {
  --state-accent: var(--status-danger, #d94755);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  box-sizing: border-box;
  width: 100%;
  min-height: 260px;
  margin-block: 16px;
  padding: 32px 20px;
  border: 1px solid var(--main-border, #e2e9f2);
  border-radius: 16px;
  background: var(--surface-1, #fff);
  font-family: inherit;
  text-align: center;
}

.data-state--empty {
  --state-accent: var(--PrimaryColor, #256df4);
}

.data-state__icon {
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 52px;
  height: 52px;
  border-radius: 14px;
  background: color-mix(in srgb, var(--state-accent) 8%, var(--surface-1, #fff));
  color: var(--state-accent);
}

.data-state__icon svg {
  width: 26px;
  height: 26px;
}

.data-state__copy {
  width: 100%;
  max-width: 440px;
  overflow-wrap: anywhere;
}

.data-state__copy h2 {
  margin: 0;
  color: var(--text-strong, #10243f);
  font-size: 1.125rem;
  font-weight: 600;
  line-height: 1.5;
}

.data-state__copy p {
  margin: 8px 0 0;
  color: var(--text-soft, #6c7d92);
  font-size: 0.875rem;
  line-height: 1.65;
}

.data-state__action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  max-width: 100%;
  min-height: 40px;
  padding: 8px 16px;
  border: 1px solid var(--main-border, #e2e9f2);
  border-radius: 9px;
  color: var(--PrimaryColor, #256df4);
  background: var(--surface-1, #fff);
  font-size: 0.8125rem;
  font-weight: 600;
  line-height: 1.5;
  overflow-wrap: anywhere;
  text-decoration: none;
}

.data-state__action:hover {
  border-color: currentColor;
  background: color-mix(in srgb, var(--PrimaryColor, #256df4) 5%, var(--surface-1, #fff));
}

.data-state__action:focus-visible {
  outline: 2px solid var(--PrimaryColor, #256df4);
  outline-offset: 3px;
}

.data-state__action svg {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.data-state__action:dir(rtl) svg {
  transform: rotate(180deg);
}

@media (max-width: 480px) {
  .data-state {
    min-height: 220px;
    padding: 24px 16px;
  }
}
</style>
