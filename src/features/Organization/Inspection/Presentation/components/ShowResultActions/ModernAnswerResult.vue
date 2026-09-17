<script setup lang="ts">
import type TaskResultItemModel from '@/features/Organization/Inspection/Data/models/FetchTaskResultModels/ItemTasksResultModel'
import { computed } from 'vue'
import QuestionHeader from '../InspectionDialog/TemplateDocumentTypes/QuestionHeader.vue'

const props = defineProps<{
  title: string
  type: 'checkbox' | 'radio' | 'select' | 'textarea'
  selectedData?: TaskResultItemModel
}>()

const headerType = computed<'multiple' | 'single' | 'dropdown' | 'text'>(() => {
  const types = {
    checkbox: 'multiple',
    radio: 'single',
    select: 'dropdown',
    textarea: 'text',
  } as const

  return types[props.type]
})

const selectedAnswers = computed(() => {
  const titles =
    props.selectedData?.answers
      ?.map((answer) => answer.templateItemOption?.title?.trim())
      .filter((title): title is string => Boolean(title)) ?? []

  return [...new Set(titles)]
})

const writtenAnswer = computed(
  () =>
    props.selectedData?.answers?.find((answer) => String(answer.answer ?? '').trim())?.answer ||
    props.selectedData?.result ||
    '',
)

const imageUrls = computed(
  () => props.selectedData?.files?.map((file) => file.url).filter(Boolean) ?? [],
)

const hasResultContent = computed(
  () =>
    selectedAnswers.value.length > 0 || Boolean(writtenAnswer.value) || imageUrls.value.length > 0,
)
</script>

<template>
  <section class="modern-answer-result">
    <QuestionHeader
      :title="title"
      :type="headerType"
      :status="hasResultContent ? $t('answered') : $t('no_answer')"
    />

    <div v-if="selectedAnswers.length" class="result-block">
      <header class="result-block__heading">
        <span class="result-block__icon result-block__icon--success">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="m5 12 4 4L19 6" />
          </svg>
        </span>
        <div>
          <span class="result-block__eyebrow">{{ $t('answer_summary') }}</span>
          <h4>{{ $t('selected_answers') }}</h4>
        </div>
        <span class="result-block__count">{{ selectedAnswers.length }}</span>
      </header>

      <div class="selected-answer-grid">
        <div v-for="answer in selectedAnswers" :key="answer" class="selected-answer">
          <span class="selected-answer__check">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="m6 12 4 4 8-9" />
            </svg>
          </span>
          <span class="selected-answer__title">{{ answer }}</span>
          <span class="selected-answer__badge">{{ $t('selected') }}</span>
        </div>
      </div>
    </div>

    <div v-if="writtenAnswer" class="result-block result-block--text">
      <header class="result-block__heading">
        <span class="result-block__icon">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M7 8h10M7 12h7m-7 4h4M5 3h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H9l-5 3v-3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"
            />
          </svg>
        </span>
        <div>
          <span class="result-block__eyebrow">{{ $t('written_response') }}</span>
          <h4>{{ type === 'textarea' ? $t('your_answer') : $t('Notes') }}</h4>
        </div>
      </header>
      <p class="written-answer">{{ writtenAnswer }}</p>
    </div>

    <div v-if="imageUrls.length" class="result-block result-block--evidence">
      <header class="result-block__heading">
        <span class="result-block__icon result-block__icon--evidence">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M4 7h3l1.3-2h7.4L17 7h3a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Zm8 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"
            />
          </svg>
        </span>
        <div>
          <span class="result-block__eyebrow">{{ $t('evidence') }}</span>
          <h4>{{ $t('supporting_evidence') }}</h4>
        </div>
        <span class="result-block__count">{{ imageUrls.length }}</span>
      </header>

      <div class="evidence-gallery">
        <a
          v-for="(image, index) in imageUrls"
          :key="`${image}-${index}`"
          :href="image"
          class="evidence-gallery__item"
          target="_blank"
          rel="noopener noreferrer"
          :aria-label="$t('open_photo')"
        >
          <img :src="image" :alt="`${$t('photo')} ${index + 1}`" />
          <span class="evidence-gallery__overlay">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M14 5h5v5M19 5l-7 7M19 14v5H5V5h5" />
            </svg>
          </span>
          <span class="evidence-gallery__number">{{ String(index + 1).padStart(2, '0') }}</span>
        </a>
      </div>
    </div>

    <div v-if="!hasResultContent" class="empty-result">
      <span class="empty-result__icon">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M8 12h8M12 8v8M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"
          />
        </svg>
      </span>
      <span>{{ $t('no_answer') }}</span>
    </div>
  </section>
</template>

<style scoped>
.modern-answer-result {
  display: flex;
  width: 100%;
  min-width: 0;
  flex-direction: column;
  gap: 12px;
}

.result-block {
  padding: 14px;
  border: 1px solid
    color-mix(in srgb, var(--status-success, #22c55e) 14%, var(--surface-2, #e5e7eb));
  border-radius: 17px;
  background: linear-gradient(
    145deg,
    color-mix(in srgb, var(--status-success, #22c55e) 5%, #fff),
    var(--surface-1, #fff)
  );
}

.result-block--text {
  border-color: color-mix(
    in srgb,
    var(--brand-primary-500, #386cfe) 14%,
    var(--surface-2, #e5e7eb)
  );
  background: linear-gradient(
    145deg,
    color-mix(in srgb, var(--brand-primary-500, #386cfe) 5%, #fff),
    var(--surface-1, #fff)
  );
}

.result-block--evidence {
  border-color: color-mix(in srgb, #8b5cf6 17%, var(--surface-2, #e5e7eb));
  background: linear-gradient(145deg, rgb(139 92 246 / 5%), var(--surface-1, #fff));
}

.result-block__heading {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 10px;
  margin-bottom: 11px;
}

.result-block__icon {
  display: grid;
  width: 36px;
  height: 36px;
  flex: 0 0 36px;
  place-items: center;
  border-radius: 12px;
  color: var(--brand-primary-600, #2563eb);
  background: color-mix(in srgb, var(--brand-primary-500, #386cfe) 10%, transparent);
}

.result-block__icon--success {
  color: var(--status-success, #16a34a);
  background: color-mix(in srgb, var(--status-success, #22c55e) 11%, transparent);
}

.result-block__icon--evidence {
  color: #7c3aed;
  background: rgb(139 92 246 / 10%);
}

.result-block__icon svg {
  width: 18px;
  height: 18px;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.9;
}

.result-block__heading > div {
  min-width: 0;
  flex: 1;
}

.result-block__eyebrow {
  display: block;
  color: var(--text-muted, #667085);
  font-size: 0.62rem;
  font-weight: 850;
  letter-spacing: 0.09em;
  text-transform: uppercase;
}

.result-block__heading h4 {
  margin: 2px 0 0;
  color: var(--text-strong, #172033);
  font-size: 0.86rem;
  font-weight: 800;
}

.result-block__count {
  display: grid;
  min-width: 29px;
  height: 29px;
  padding-inline: 7px;
  place-items: center;
  border-radius: 10px;
  color: var(--text-muted, #667085);
  background: rgb(255 255 255 / 72%);
  font-size: 0.68rem;
  font-weight: 850;
}

.selected-answer-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 8px;
}

.selected-answer {
  display: flex;
  min-width: 0;
  min-height: 46px;
  align-items: center;
  gap: 9px;
  padding: 9px 10px;
  border: 1px solid color-mix(in srgb, var(--status-success, #22c55e) 20%, transparent);
  border-radius: 13px;
  background: rgb(255 255 255 / 78%);
}

.selected-answer__check {
  display: grid;
  width: 26px;
  height: 26px;
  flex: 0 0 26px;
  place-items: center;
  border-radius: 9px;
  color: #fff;
  background: var(--status-success, #22c55e);
  box-shadow: 0 6px 14px rgb(34 197 94 / 18%);
}

.selected-answer__check svg {
  width: 15px;
  height: 15px;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 2.2;
}

.selected-answer__title {
  min-width: 0;
  flex: 1;
  color: var(--text-strong, #172033);
  font-size: 0.82rem;
  font-weight: 750;
  line-height: 1.35;
}

.selected-answer__badge {
  padding: 4px 7px;
  border-radius: 999px;
  color: var(--status-success, #15803d);
  background: color-mix(in srgb, var(--status-success, #22c55e) 9%, transparent);
  font-size: 0.6rem;
  font-weight: 800;
}

.written-answer {
  margin: 0;
  padding: 12px 13px;
  border: 1px solid color-mix(in srgb, var(--brand-primary-500, #386cfe) 10%, transparent);
  border-radius: 13px;
  color: var(--text-strong, #172033);
  background: rgb(255 255 255 / 78%);
  font-size: 0.86rem;
  line-height: 1.65;
  white-space: pre-wrap;
}

.evidence-gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
  gap: 9px;
}

.evidence-gallery__item {
  position: relative;
  min-height: 105px;
  overflow: hidden;
  border: 2px solid rgb(255 255 255 / 85%);
  border-radius: 14px;
  background: var(--surface-2, #f2f4f7);
  box-shadow: 0 7px 18px rgb(15 23 42 / 8%);
}

.evidence-gallery__item img {
  display: block;
  width: 100%;
  height: 112px;
  object-fit: cover;
  transition: transform 220ms ease;
}

.evidence-gallery__overlay {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  color: #fff;
  background: rgb(15 23 42 / 42%);
  opacity: 0;
  transition: opacity 180ms ease;
}

.evidence-gallery__overlay svg {
  width: 25px;
  height: 25px;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.8;
}

.evidence-gallery__item:hover img {
  transform: scale(1.05);
}

.evidence-gallery__item:hover .evidence-gallery__overlay {
  opacity: 1;
}

.evidence-gallery__number {
  position: absolute;
  top: 7px;
  inset-inline-start: 7px;
  padding: 4px 6px;
  border-radius: 8px;
  color: #fff;
  background: rgb(15 23 42 / 56%);
  font-size: 0.6rem;
  font-weight: 850;
  backdrop-filter: blur(6px);
}

.empty-result {
  display: flex;
  min-height: 72px;
  align-items: center;
  justify-content: center;
  gap: 9px;
  border: 1px dashed var(--surface-2, #e5e7eb);
  border-radius: 15px;
  color: var(--text-muted, #667085);
  background: var(--surface-1, #fff);
  font-size: 0.8rem;
  font-weight: 750;
}

.empty-result__icon {
  display: grid;
  width: 30px;
  height: 30px;
  place-items: center;
  border-radius: 10px;
  color: var(--text-muted, #667085);
  background: var(--surface-2, #f2f4f7);
}

.empty-result__icon svg {
  width: 16px;
  height: 16px;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.8;
}

@media (max-width: 640px) {
  .selected-answer-grid {
    grid-template-columns: 1fr;
  }

  .selected-answer__badge {
    display: none;
  }

  .evidence-gallery {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
