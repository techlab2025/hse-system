<script setup lang="ts">
import { featureGuides } from '@/features/Documentation/guides'
import { useDocumentation } from '@/features/Documentation/useDocumentation'
import SidebarUnicon from '@/shared/icons/SidebarUnicon.vue'
import '@/features/Documentation/documentation.css'
const { labels, text } = useDocumentation()
</script>

<template>
  <main class="documentation-page hse-identity">
    <header class="documentation-hero">
      <div>
        <span class="documentation-eyebrow">{{ labels.eyebrow }}</span>
        <h1>{{ labels.title }}</h1>
        <p>{{ labels.introduction }}</p>
      </div>
      <span class="documentation-hero-icon" aria-hidden="true"
        ><SidebarUnicon name="book-open"
      /></span>
    </header>
    <section :aria-label="labels.available" class="documentation-catalog">
      <RouterLink
        v-for="guide in featureGuides"
        :key="guide.slug"
        :to="{ name: 'Feature Documentation', params: { feature: guide.slug } }"
        class="documentation-guide-card"
        :aria-label="`${labels.openGuide}: ${text(guide.title)}`"
      >
        <span class="documentation-card-icon" aria-hidden="true"
          ><SidebarUnicon :name="guide.icon"
        /></span>
        <div>
          <h2>{{ text(guide.title) }}</h2>
          <p>{{ text(guide.summary) }}</p>
          <span class="documentation-step-count">{{ guide.steps.length }} {{ labels.steps }}</span>
        </div>
        <span class="documentation-card-action"
          >{{ labels.openGuide }} <span aria-hidden="true">↗</span></span
        >
      </RouterLink>
    </section>
    <p class="documentation-coming-next">{{ labels.next }}</p>
  </main>
</template>
