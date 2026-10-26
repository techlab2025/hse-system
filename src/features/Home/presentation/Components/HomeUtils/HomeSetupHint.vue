<script setup lang="ts">
import { computed, ref } from 'vue'
import Popover from 'primevue/popover'
import { useI18n } from 'vue-i18n'
import type ProjectProgressItemModel from '@/features/Organization/ProjectPrgoress/Data/models/ProjectProgressItemModel'
import { setupStepHintKeys } from '@/features/Organization/ProjectPrgoress/Presentation/utils/setupStepHints'
import SidebarUnicon from '@/shared/icons/SidebarUnicon.vue'

const props = defineProps<{ items: ProjectProgressItemModel[]; progressValue: number }>()
const emit = defineEmits<{ continue: [] }>()
const { t, te } = useI18n({ useScope: 'global' })
const remainingSteps = computed(() =>
  props.items
    .filter((item) => !item.progress)
    .sort((a, b) => Number(b.required) - Number(a.required))
    .map((item) => {
      const key = setupStepHintKeys[item.id]
      return {
        ...item,
        title: key
          ? t(`organization_setup_steps.${key}.title`)
          : te(item.title)
            ? t(item.title)
            : item.title,
        hint: key ? t(`organization_setup_steps.${key}.hint`) : t('home_setup_step_fallback'),
      }
    }),
)
const firstSteps = computed(() => remainingSteps.value.slice(0, 3))
const moreSteps = computed(() => remainingSteps.value.slice(3))
const progress = computed(() => Math.min(100, Math.max(0, props.progressValue)))
const details = ref<InstanceType<typeof Popover> | null>(null)
const selectedStepId = ref<number | null>(null)
const detailsOpen = ref(false)
const detailSteps = computed(() => {
  const selected = remainingSteps.value.find((step) => step.id === selectedStepId.value)
  return selected ? [selected] : remainingSteps.value
})
const showDetails = (event: Event, stepId: number | null = null) => {
  selectedStepId.value = stepId
  details.value?.show(event)
}
</script>

<template>
  <section class="home-setup-hint" aria-labelledby="home-setup-hint-title">
    <div class="home-setup-meter" role="img" :aria-label="`${progress}%`">
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <circle class="home-setup-meter-track" cx="24" cy="24" r="20" />
        <circle
          class="home-setup-meter-value"
          cx="24"
          cy="24"
          r="20"
          :stroke-dasharray="`${progress * 1.25664} 125.664`"
        />
        <text x="24" y="25" dominant-baseline="middle" text-anchor="middle">{{ progress }}%</text>
      </svg>
    </div>
    <RouterLink
      to="/organization/project-progress"
      class="home-setup-heading"
      @click="emit('continue')"
    >
      <h3 id="home-setup-hint-title" :title="$t('home_setup_hint_title')">
        {{ $t('home_setup_hint_title') }}
      </h3>
      <p v-if="remainingSteps.length">
        {{ $t('home_setup_remaining', { count: remainingSteps.length }) }}
      </p>
      <p v-else>{{ $t('home_setup_review_remaining') }}</p>
    </RouterLink>
    <div
      v-if="firstSteps.length"
      class="home-setup-chip-trail"
      role="group"
      :aria-label="$t('home_setup_hint_title')"
    >
      <button
        v-for="step in firstSteps"
        :key="step.id"
        type="button"
        class="home-setup-chip"
        :title="`${step.title}: ${step.hint}`"
        :aria-label="`${step.title}. ${step.hint}`"
        aria-haspopup="dialog"
        aria-controls="home-setup-details"
        :aria-expanded="detailsOpen && selectedStepId === step.id"
        @click="showDetails($event, step.id)"
      >
        <span class="home-setup-chip-dot" aria-hidden="true"></span>
        {{ step.title }}
      </button>
      <button
        v-if="moreSteps.length"
        type="button"
        class="home-setup-chip home-setup-chip-more"
        :aria-label="$t('home_setup_more_steps', { count: moreSteps.length })"
        aria-haspopup="dialog"
        aria-controls="home-setup-details"
        :aria-expanded="detailsOpen && selectedStepId === null"
        @click="showDetails($event)"
      >
        +{{ moreSteps.length }}
      </button>
    </div>
    <RouterLink
      to="/organization/project-progress"
      class="home-setup-continue"
      :aria-label="$t('home_setup_open_overview')"
      @click="emit('continue')"
    >
      {{ $t('home_setup_overview_short') }}
      <SidebarUnicon name="arrow-right" />
    </RouterLink>
    <Popover
      id="home-setup-details"
      ref="details"
      :style="{ width: 'min(380px, calc(100vw - 32px))' }"
      @show="detailsOpen = true"
      @hide="detailsOpen = false"
    >
      <div class="home-setup-details hse-identity">
        <div class="home-setup-details-heading">
          <strong>{{ $t('home_setup_hint_title') }}</strong>
          <button type="button" :aria-label="$t('close')" @click="details?.hide()">
            <SidebarUnicon name="times" />
          </button>
        </div>
        <ul class="home-setup-step-list">
          <li v-for="step in detailSteps" :key="step.id" class="home-setup-step">
            <div class="home-setup-step-title">
              <strong>{{ step.title }}</strong>
              <span>{{ $t(step.required ? 'home_setup_required' : 'home_setup_optional') }}</span>
            </div>
            <p>{{ step.hint }}</p>
          </li>
        </ul>
      </div>
    </Popover>
  </section>
</template>

<style scoped>
.home-setup-hint {
  display: grid;
  grid-template-columns: 48px minmax(180px, 1fr) minmax(0, 1.5fr) auto;
  align-items: center;
  gap: 16px;
  min-width: 0;
  padding: 14px 20px;
  border: 1px solid var(--hse-project-line);
  border-radius: var(--hse-project-radius-card);
  background: linear-gradient(
    100deg,
    color-mix(in srgb, var(--hse-project-blue) 4%, var(--hse-project-surface)),
    var(--hse-project-surface) 45%
  );
  color: var(--hse-project-ink);
  font-family: var(--hse-project-font);
}
.home-setup-meter {
  width: 48px;
  height: 48px;
}
.home-setup-meter svg {
  display: block;
  width: 100%;
  height: 100%;
}
.home-setup-meter circle {
  fill: none;
  stroke-width: 3;
}
.home-setup-meter-track {
  stroke: var(--hse-project-line-soft);
}
.home-setup-meter-value {
  stroke: var(--hse-project-blue);
  stroke-linecap: round;
  transform: rotate(-90deg);
  transform-origin: center;
}
.home-setup-meter text {
  fill: var(--hse-project-ink);
  font: 600 11px var(--hse-project-font);
}
.home-setup-heading {
  min-width: 0;
  text-decoration: none;
}
.home-setup-heading h3 {
  overflow: hidden;
  margin: 0 0 4px;
  color: var(--hse-project-ink);
  font-size: 13px;
  font-weight: 600;
  line-height: 1.4;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.home-setup-heading p {
  overflow: hidden;
  margin: 0;
  color: var(--hse-project-muted);
  font-size: 11px;
  line-height: 1.5;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-transform: none !important;
}
.home-setup-chip-trail {
  display: flex;
  align-items: center;
  gap: 7px;
  min-width: 0;
  overflow-x: auto;
  padding: 3px;
  scrollbar-width: thin;
}
.home-setup-chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  flex-shrink: 0;
  min-height: 32px;
  padding: 6px 10px;
  border: 1px solid var(--hse-project-line);
  border-radius: 99px;
  background: var(--hse-project-surface);
  color: var(--hse-project-ink);
  font: 500 11px/1.4 var(--hse-project-font);
  white-space: nowrap;
  cursor: pointer;
}
.home-setup-chip-dot {
  width: 6px;
  height: 6px;
  border: 1px solid var(--hse-project-blue);
  border-radius: 50%;
}
.home-setup-chip:hover,
.home-setup-chip[aria-expanded='true'] {
  border-color: var(--hse-project-blue);
  background: var(--hse-project-ice);
  color: var(--hse-project-blue);
}
.home-setup-chip-more {
  border-style: dashed;
  color: var(--hse-project-blue);
  font-weight: 600;
}
.home-setup-continue {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 36px;
  padding: 8px 12px;
  border: 1px solid var(--identity-primaryButtonBackground, var(--hse-project-blue));
  border-radius: var(--hse-project-radius-button, 10px);
  background: var(--identity-primaryButtonBackground, var(--hse-project-blue));
  color: var(--identity-primaryButtonText, #fff);
  font-size: 12px;
  font-weight: 500;
  text-decoration: none;
}
.home-setup-continue svg {
  width: 16px;
  height: 16px;
}
.home-setup-continue:dir(rtl) svg {
  transform: rotate(180deg);
}
.home-setup-hint :is(a, button):focus-visible {
  outline: 2px solid var(--hse-project-blue);
  outline-offset: 2px;
}
.home-setup-details {
  padding: 16px;
  border: 1px solid var(--hse-project-line);
  border-radius: 12px;
  background: var(--hse-project-surface);
  box-shadow: var(--hse-project-shadow-panel);
  color: var(--hse-project-ink);
  font-family: var(--hse-project-font);
}
.home-setup-details-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.home-setup-details-heading strong {
  font-size: 13px;
  font-weight: 600;
}
.home-setup-details-heading button {
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  padding: 0;
  border: 0;
  border-radius: 8px;
  background: var(--hse-project-surface-soft);
  color: var(--hse-project-muted);
  cursor: pointer;
}
.home-setup-step-list {
  display: grid;
  gap: 14px;
  max-height: 320px;
  overflow-y: auto;
  margin: 16px 0 0;
  padding: 0;
  list-style: none;
}
.home-setup-step-title {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 4px;
}
.home-setup-step-title strong {
  font-size: 12px;
  font-weight: 600;
}
.home-setup-step-title span {
  color: var(--hse-project-muted);
  font-size: 10px;
}
.home-setup-step p {
  margin: 0;
  color: var(--hse-project-muted);
  font-size: 12px;
  line-height: 1.6;
  text-transform: none !important;
}
@media (max-width: 1000px) {
  .home-setup-hint {
    grid-template-columns: 44px minmax(0, 1fr) auto;
    gap: 10px 14px;
  }
  .home-setup-meter {
    grid-row: 1 / 3;
    width: 44px;
    height: 44px;
  }
  .home-setup-chip-trail {
    grid-column: 2;
    grid-row: 2;
  }
  .home-setup-continue {
    grid-column: 3;
    grid-row: 1 / 3;
  }
}
@media (max-width: 600px) {
  .home-setup-hint {
    padding: 12px;
    grid-template-columns: 40px minmax(0, 1fr) auto;
    gap: 10px;
  }
  .home-setup-meter {
    grid-row: 1;
    width: 40px;
    height: 40px;
  }
  .home-setup-heading h3 {
    font-size: 12px;
  }
  .home-setup-heading p {
    font-size: 10px;
  }
  .home-setup-chip-trail {
    grid-column: 1 / -1;
    grid-row: 2;
    padding: 2px;
  }
  .home-setup-continue {
    grid-row: 1;
    padding: 8px 10px;
    font-size: 11px;
  }
}
</style>
