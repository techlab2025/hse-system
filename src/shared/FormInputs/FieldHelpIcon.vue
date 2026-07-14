<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref, useId } from 'vue'

defineProps<{
  text: string
}>()

const tooltipId = `field-help-${useId()}`
const trigger = ref<HTMLButtonElement | null>(null)
const tooltip = ref<HTMLElement | null>(null)
const isOpen = ref(false)
const placement = ref<'top' | 'bottom'>('top')
const tooltipPosition = ref({ left: '0px', top: '0px' })

const updatePosition = async () => {
  if (!trigger.value) return

  const triggerRect = trigger.value.getBoundingClientRect()
  const gap = 12
  placement.value = triggerRect.top > 150 ? 'top' : 'bottom'

  await nextTick()

  const tooltipWidth = tooltip.value?.offsetWidth ?? 280
  const edgeGap = 12
  const halfWidth = tooltipWidth / 2
  const left = Math.min(
    window.innerWidth - halfWidth - edgeGap,
    Math.max(halfWidth + edgeGap, triggerRect.left + triggerRect.width / 2),
  )

  tooltipPosition.value = {
    left: `${left}px`,
    top: placement.value === 'top' ? `${triggerRect.top - gap}px` : `${triggerRect.bottom + gap}px`,
  }
}

const showTooltip = () => {
  isOpen.value = true
  updatePosition()
  window.addEventListener('resize', updatePosition)
  window.addEventListener('scroll', updatePosition, true)
}

const hideTooltip = () => {
  isOpen.value = false
  window.removeEventListener('resize', updatePosition)
  window.removeEventListener('scroll', updatePosition, true)
}

onBeforeUnmount(hideTooltip)
</script>

<template>
  <button
    ref="trigger"
    type="button"
    class="field-help"
    aria-label="More information about this field"
    :aria-describedby="tooltipId"
    @click.prevent.stop
    @mouseenter="showTooltip"
    @mouseleave="hideTooltip"
    @focus="showTooltip"
    @blur="hideTooltip"
  >
    <span class="field-help__glow" aria-hidden="true"></span>
    <span class="field-help__mark" aria-hidden="true">!</span>
  </button>

  <Teleport to="body">
    <span
      v-if="isOpen"
      :id="tooltipId"
      ref="tooltip"
      class="field-help__tooltip"
      :class="`field-help__tooltip--${placement}`"
      :style="tooltipPosition"
      role="tooltip"
    >
      <span class="field-help__eyebrow">
        <span class="field-help__spark" aria-hidden="true">✦</span>
        Field guide
      </span>
      <span class="field-help__text">{{ text }}</span>
      <span class="field-help__arrow" aria-hidden="true"></span>
    </span>
  </Teleport>
</template>

<style scoped>
.field-help,
.field-help__tooltip {
  --field-help-accent: var(--PrimaryColor, #1d4ed8);
  --field-help-surface: var(--surface-1, #ffffff);
  --field-help-surface-soft: var(--surface-2, #f8fafc);
  --field-help-border: var(--main-border, #dde2ed);
  --field-help-text: var(--text-strong, #0f172a);
  --field-help-text-soft: var(--text-soft, #475569);
  --field-help-on-accent: #ffffff;
  --field-help-shadow-color: color-mix(in srgb, var(--text-primary, #0f172a) 18%, transparent);
}

.field-help {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 21px;
  width: 21px;
  height: 21px;
  margin: 0 0 4px;
  padding: 0;
  border: 1px solid color-mix(in srgb, var(--field-help-accent) 32%, transparent);
  border-radius: 7px;
  background: linear-gradient(
    145deg,
    color-mix(in srgb, var(--field-help-accent) 13%, var(--field-help-surface)),
    color-mix(in srgb, var(--field-help-accent) 4%, var(--field-help-surface-soft))
  );
  color: var(--field-help-accent);
  box-shadow:
    0 3px 9px color-mix(in srgb, var(--field-help-accent) 17%, transparent),
    inset 0 1px 0 color-mix(in srgb, var(--field-help-surface) 75%, transparent);
  /* cursor: help; */
  outline: none;
  isolation: isolate;
  transition:
    color 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.field-help__mark {
  position: relative;
  z-index: 1;
  font-size: 12px;
  font-weight: 900;
  line-height: 1;
}

.field-help__glow {
  position: absolute;
  inset: -4px;
  z-index: -1;
  border-radius: 10px;
  background: color-mix(in srgb, var(--field-help-accent) 16%, transparent);
  opacity: 0;
  transform: scale(0.75);
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.field-help:hover,
.field-help:focus-visible {
  border-color: color-mix(in srgb, var(--field-help-accent) 65%, transparent);
  color: var(--field-help-on-accent);
  background: linear-gradient(
    135deg,
    color-mix(in srgb, var(--field-help-accent) 82%, var(--field-help-text-soft)),
    var(--field-help-accent)
  );
  box-shadow: 0 7px 16px color-mix(in srgb, var(--field-help-accent) 28%, transparent);
  transform: translateY(-2px) rotate(-3deg);
}

.field-help:hover .field-help__glow,
.field-help:focus-visible .field-help__glow {
  opacity: 1;
  transform: scale(1);
}

.field-help:focus-visible {
  outline: 3px solid color-mix(in srgb, var(--field-help-accent) 20%, transparent);
  outline-offset: 2px;
}

.field-help__tooltip {
  position: fixed;
  z-index: 2147483647;
  display: flex;
  flex-direction: column;
  gap: 5px;
  width: max-content;
  min-width: 190px;
  max-width: min(300px, 78vw);
  padding: 12px 14px 13px;
  overflow: visible;
  border: 1px solid var(--field-help-border);
  border-radius: 13px;
  background:
    radial-gradient(
      circle at 100% 0,
      color-mix(in srgb, var(--field-help-accent) 18%, transparent),
      transparent 42%
    ),
    linear-gradient(145deg, var(--field-help-surface), var(--field-help-surface-soft));
  color: var(--field-help-text);
  box-shadow:
    0 18px 42px var(--field-help-shadow-color),
    0 4px 12px color-mix(in srgb, var(--field-help-shadow-color) 70%, transparent);
  text-align: start;
  pointer-events: none;
  animation: field-help-enter 0.2s cubic-bezier(0.2, 0.8, 0.2, 1) both;
}

.field-help__tooltip--top {
  transform: translate(-50%, -100%);
  transform-origin: bottom center;
}

.field-help__tooltip--bottom {
  transform: translate(-50%, 0);
  transform-origin: top center;
}

.field-help__eyebrow {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--field-help-accent);
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.08em;
  line-height: 1;
  text-transform: uppercase;
}

.field-help__spark {
  color: var(--field-help-accent);
  font-size: 11px;
}

.field-help__text {
  color: var(--field-help-text);
  font-size: 12px;
  font-weight: 500;
  line-height: 1.5;
  white-space: normal;
}

.field-help__arrow {
  position: absolute;
  inset-inline-start: 50%;
  width: 10px;
  height: 10px;
  background: var(--field-help-surface-soft);
  transform: translateX(-50%) rotate(45deg);
}

.field-help__tooltip--top .field-help__arrow {
  top: 100%;
  margin-top: -5px;
}

.field-help__tooltip--bottom .field-help__arrow {
  bottom: 100%;
  margin-bottom: -5px;
  background: var(--field-help-surface);
}

@keyframes field-help-enter {
  from {
    opacity: 0;
    filter: blur(2px);
  }

  to {
    opacity: 1;
    filter: blur(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .field-help,
  .field-help__glow,
  .field-help__tooltip {
    transition: none;
  }
}

@media (max-width: 480px) {
  .field-help__tooltip {
    min-width: 170px;
    max-width: 72vw;
  }
}
</style>
