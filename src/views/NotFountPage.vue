<script setup lang="ts">
import EmptyData from '@/assets/images/EmptyData.png'
import { OrganizationTypeEnum } from '@/features/auth/Core/Enum/organization_type'
import { useUserStore } from '@/stores/user'
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

const userStore = useUserStore()

const homePath = computed(() =>
  userStore.user?.type === OrganizationTypeEnum.ADMIN ? '/admin' : '/organization',
)
</script>

<template>
  <main class="not-found" aria-labelledby="not-found-title">
    <span class="glow glow--one" aria-hidden="true"></span>
    <span class="glow glow--two" aria-hidden="true"></span>

    <section class="not-found__card">
      <div class="not-found__copy">
        <span class="not-found__eyebrow">Error 404</span>
        <p class="not-found__code" aria-hidden="true">404</p>
        <h1 id="not-found-title">Oops! This page took a wrong turn.</h1>
        <p class="not-found__description">
          The page you’re looking for may have moved, been removed, or never existed.
          Let’s get you back somewhere familiar.
        </p>

        <RouterLink class="home-button" :to="homePath">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M3 10.8 12 3l9 7.8v9.7a.5.5 0 0 1-.5.5H15v-6H9v6H3.5a.5.5 0 0 1-.5-.5v-9.7Z" />
          </svg>
          Back to home
          <span aria-hidden="true">→</span>
        </RouterLink>
      </div>

      <div class="not-found__visual" aria-hidden="true">
        <span class="orbit orbit--outer"></span>
        <span class="orbit orbit--inner"></span>
        <span class="floating-dot floating-dot--one"></span>
        <span class="floating-dot floating-dot--two"></span>
        <img :src="EmptyData" alt="" />
      </div>
    </section>
  </main>
</template>

<style scoped>
.not-found {
  position: relative;
  display: grid;
  min-height: 100svh;
  padding: clamp(20px, 5vw, 72px);
  place-items: center;
  overflow: hidden;
  isolation: isolate;
  background:
    linear-gradient(135deg, var(--brand-primary-50), transparent 55%),
    var(--app-bg);
}

.not-found::before {
  position: absolute;
  z-index: -1;
  width: min(760px, 90vw);
  height: min(760px, 90vw);
  border: 1px solid var(--brand-primary-100);
  border-radius: 50%;
  content: '';
  opacity: 0.65;
}

.glow {
  position: absolute;
  z-index: -1;
  width: 340px;
  height: 340px;
  border-radius: 50%;
  background: var(--brand-primary-200);
  filter: blur(110px);
  opacity: 0.55;
}

.glow--one {
  inset-block-start: -150px;
  inset-inline-start: -90px;
}

.glow--two {
  inset-inline-end: -120px;
  inset-block-end: -170px;
  background: var(--brand-accent-200);
}

.not-found__card {
  display: grid;
  width: min(1080px, 100%);
  grid-template-columns: minmax(0, 1fr) minmax(320px, 0.9fr);
  align-items: center;
  gap: clamp(24px, 5vw, 70px);
  padding: clamp(28px, 5vw, 68px);
  border: 1px solid var(--brand-primary-100);
  border-radius: clamp(24px, 4vw, 42px);
  background: color-mix(in srgb, var(--surface-1) 88%, transparent);
  box-shadow: 0 30px 90px color-mix(in srgb, var(--shadow-color) 45%, transparent);
  backdrop-filter: blur(18px);
}

.not-found__copy {
  position: relative;
  z-index: 2;
}

.not-found__eyebrow {
  display: inline-flex;
  padding: 8px 14px;
  border: 1px solid var(--brand-primary-100);
  border-radius: 999px;
  background: var(--brand-primary-50);
  color: var(--brand-primary-600);
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.09em;
  text-transform: uppercase;
}

.not-found__code {
  margin: 18px 0 -12px;
  color: var(--brand-primary-100);
  font-size: clamp(72px, 10vw, 136px);
  font-weight: 800;
  line-height: 0.9;
  letter-spacing: -0.08em;
  user-select: none;
}

h1 {
  max-width: 590px;
  margin: 0;
  color: var(--text-strong);
  font-size: clamp(30px, 4vw, 50px);
  font-weight: 800;
  line-height: 1.08;
}

.not-found__description {
  max-width: 560px;
  margin: 20px 0 30px;
  color: var(--text-muted);
  font-size: clamp(15px, 1.5vw, 18px);
  line-height: 1.7;
}

.home-button {
  display: inline-flex;
  min-height: 52px;
  align-items: center;
  gap: 11px;
  padding: 13px 22px;
  border: 1px solid var(--brand-primary-500);
  border-radius: 16px;
  background: var(--brand-primary-500);
  box-shadow: 0 12px 28px color-mix(in srgb, var(--brand-primary-500) 28%, transparent);
  color: var(--text-on-brand);
  font-weight: 700;
  transition: transform 180ms ease, box-shadow 180ms ease, background 180ms ease;
}

.home-button:hover {
  background: var(--brand-primary-600);
  box-shadow: 0 16px 34px color-mix(in srgb, var(--brand-primary-500) 38%, transparent);
  transform: translateY(-2px);
}

.home-button:focus-visible {
  outline: 3px solid var(--brand-primary-200);
  outline-offset: 4px;
}

.home-button svg {
  width: 20px;
  fill: currentColor;
}

.home-button span {
  font-size: 20px;
  transition: transform 180ms ease;
}

.home-button:hover span {
  transform: translateX(4px);
}

.not-found__visual {
  position: relative;
  display: grid;
  aspect-ratio: 1;
  place-items: center;
}

.not-found__visual::before {
  position: absolute;
  width: 76%;
  height: 76%;
  border-radius: 38% 62% 57% 43% / 45% 38% 62% 55%;
  background: linear-gradient(145deg, var(--brand-primary-100), var(--brand-accent-50));
  content: '';
  animation: morph 8s ease-in-out infinite;
}

.not-found__visual img {
  position: relative;
  z-index: 1;
  width: min(100%, 430px);
  filter: drop-shadow(0 24px 28px color-mix(in srgb, var(--shadow-color) 38%, transparent));
  animation: float 5s ease-in-out infinite;
}

.orbit {
  position: absolute;
  border: 1px dashed var(--brand-primary-300);
  border-radius: 50%;
}

.orbit--outer { inset: 3%; }
.orbit--inner { inset: 13%; opacity: 0.6; }

.floating-dot {
  position: absolute;
  z-index: 2;
  width: 13px;
  height: 13px;
  border: 3px solid var(--surface-1);
  border-radius: 50%;
  background: var(--brand-primary-500);
  box-shadow: 0 5px 18px var(--shadow-color);
}

.floating-dot--one { inset-block-start: 12%; inset-inline-end: 13%; }
.floating-dot--two { inset-block-end: 14%; inset-inline-start: 8%; background: var(--brand-accent-500); }

@keyframes float {
  50% { transform: translateY(-12px) rotate(1deg); }
}

@keyframes morph {
  50% { border-radius: 57% 43% 38% 62% / 58% 61% 39% 42%; transform: rotate(5deg); }
}

@media (max-width: 800px) {
  .not-found__card {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .not-found__description { margin-inline: auto; }
  .not-found__visual { order: -1; width: min(330px, 82vw); margin: auto; }
}

@media (max-width: 480px) {
  .not-found { padding: 12px; }
  .not-found__card { padding: 24px 18px 30px; border-radius: 24px; }
  .not-found__visual { width: min(245px, 72vw); }
  .not-found__code { margin-top: 12px; }
}

@media (prefers-reduced-motion: reduce) {
  .not-found__visual::before,
  .not-found__visual img { animation: none; }
}
</style>
