<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { featureGuides } from '@/features/Documentation/guides'
import { useDocumentation } from '@/features/Documentation/useDocumentation'
import SidebarUnicon from '@/shared/icons/SidebarUnicon.vue'
import '@/features/Documentation/documentation.css'

const route = useRoute()
const { labels, text } = useDocumentation()
const guide = computed(() =>
  featureGuides.find((item) => item.slug === String(route.params.feature).toLowerCase()),
)
const playing = ref(false)
const recordingIndex = ref(0)
const recording = computed(() => guide.value?.recordings[recordingIndex.value])
const selectRecording = (index: number) => {
  recordingIndex.value = index
  playing.value = false
}
watch(
  () => route.params.feature,
  () => {
    playing.value = false
    recordingIndex.value = 0
  },
)
const stepLink = (hash: string) => ({
  name: 'Feature Documentation',
  params: { feature: guide.value?.slug },
  hash: `#${hash}`,
})
</script>

<template>
  <main class="documentation-page hse-identity">
    <RouterLink :to="{ name: 'Documentation' }" class="documentation-back"
      >← {{ labels.back }}</RouterLink
    >
    <template v-if="guide">
      <header class="documentation-hero">
        <div>
          <span class="documentation-eyebrow">{{ labels.title }}</span>
          <h1>{{ text(guide.title) }}</h1>
          <p>{{ text(guide.summary) }}</p>
        </div>
        <RouterLink
          :to="guide.startRoute"
          class="documentation-button documentation-button-primary"
          >{{ text(guide.actionLabel) }}</RouterLink
        >
      </header>
      <div class="documentation-layout">
        <div class="documentation-article">
          <p class="documentation-introduction">{{ text(guide.introduction) }}</p>
          <section id="before-you-begin" class="documentation-section">
            <h2>{{ labels.before }}</h2>
            <ul class="documentation-prerequisites">
              <li v-for="(item, index) in guide.prerequisites" :key="index">{{ text(item) }}</li>
            </ul>
          </section>
          <section id="walkthrough" class="documentation-section">
            <div class="documentation-section-heading">
              <h2>{{ labels.watch }}</h2>
              <span class="documentation-format">GIF</span>
            </div>
            <div
              v-if="guide.recordings.length > 1"
              class="documentation-recording-choices"
              :aria-label="labels.watch"
            >
              <button
                v-for="(item, index) in guide.recordings"
                :key="item.id"
                type="button"
                class="documentation-button"
                :class="{ 'documentation-button-primary': recordingIndex === index }"
                :aria-pressed="recordingIndex === index"
                @click="selectRecording(index)"
              >
                {{ text(item.title) }}
              </button>
            </div>
            <template v-if="recording">
              <p>{{ text(recording.description) }}</p>
              <figure class="documentation-recording">
                <img
                  :key="`${recording.id}-${playing}`"
                  :src="playing ? recording.gif : recording.poster"
                  :alt="`${text(recording.title)} — ${labels.watch}`"
                  width="1440"
                  height="1000"
                  loading="lazy"
                />
                <figcaption>
                  <button
                    type="button"
                    class="documentation-button documentation-button-primary"
                    :aria-pressed="playing"
                    @click="playing = !playing"
                  >
                    <span aria-hidden="true">{{ playing ? '■' : '▶' }}</span>
                    {{ playing ? labels.stop : labels.play }}
                  </button>
                </figcaption>
              </figure>
            </template>
          </section>
          <ol class="documentation-steps" :aria-label="labels.steps">
            <li
              v-for="(step, index) in guide.steps"
              :id="step.id"
              :key="step.id"
              class="documentation-section"
            >
              <header class="documentation-step-heading">
                <span aria-hidden="true">{{ String(index + 1).padStart(2, '0') }}</span>
                <div>
                  <small
                    >{{ labels.step }} {{ index + 1 }} {{ labels.of }}
                    {{ guide.steps.length }}</small
                  >
                  <h2>{{ text(step.title) }}</h2>
                </div>
              </header>
              <p>{{ text(step.summary) }}</p>
              <ol class="documentation-instructions">
                <li v-for="(item, instruction) in step.instructions" :key="instruction">
                  {{ text(item) }}
                </li>
              </ol>
              <p v-if="step.note" class="documentation-note">{{ text(step.note) }}</p>
            </li>
          </ol>
          <section id="after-setup" class="documentation-section">
            <h2>{{ labels.after }}</h2>
            <div class="documentation-next-actions">
              <div v-for="(action, index) in guide.afterSetup" :key="index">
                <h3>{{ text(action.title) }}</h3>
                <p>{{ text(action.description) }}</p>
              </div>
            </div>
          </section>
          <section id="common-questions" class="documentation-section">
            <h2>{{ labels.questions }}</h2>
            <details
              v-for="(question, index) in guide.questions"
              :key="index"
              class="documentation-question"
            >
              <summary>{{ text(question.question) }}</summary>
              <p>{{ text(question.answer) }}</p>
            </details>
          </section>
        </div>
        <aside class="documentation-contents" :aria-label="labels.contents">
          <strong>{{ labels.contents }}</strong>
          <nav>
            <RouterLink :to="stepLink('before-you-begin')">{{ labels.before }}</RouterLink>
            <RouterLink :to="stepLink('walkthrough')">{{ labels.watch }}</RouterLink>
            <RouterLink v-for="(step, index) in guide.steps" :key="step.id" :to="stepLink(step.id)"
              ><span>{{ String(index + 1).padStart(2, '0') }}</span>
              {{ text(step.title) }}</RouterLink
            >
            <RouterLink :to="stepLink('after-setup')">{{ labels.after }}</RouterLink>
            <RouterLink :to="stepLink('common-questions')">{{ labels.questions }}</RouterLink>
          </nav>
        </aside>
      </div>
    </template>
    <section v-else class="documentation-section documentation-unavailable">
      <SidebarUnicon name="book-open" aria-hidden="true" />
      <h1>{{ labels.notFound }}</h1>
    </section>
  </main>
</template>
