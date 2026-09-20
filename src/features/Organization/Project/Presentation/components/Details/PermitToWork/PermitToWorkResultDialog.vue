<script setup lang="ts">
import type PermitAuditResultItemModel from '@/features/Organization/Project/Data/models/PermitToWork/PermitAuditResultItemModel'
import type PermitAuditResultModel from '@/features/Organization/Project/Data/models/PermitToWork/PermitAuditResultModel'
import type PermitAuditTemplateItemModel from '@/features/Organization/Project/Data/models/PermitToWork/PermitAuditTemplateItemModel'
import type PermitAuditTemplateItemOptionModel from '@/features/Organization/Project/Data/models/PermitToWork/PermitAuditTemplateItemOptionModel'
import { computed, ref, watch } from 'vue'
import Dialog from 'primevue/dialog'

const visible = defineModel<boolean>('visible', { default: false })
const props = withDefaults(defineProps<{ audits?: PermitAuditResultModel[] }>(), {
  audits: () => [],
})

const selectedAuditId = ref<number | null>(null)

watch(
  () => props.audits,
  (audits) => {
    if (!audits.length) {
      selectedAuditId.value = null
      return
    }

    if (!audits.some((audit) => audit.id === selectedAuditId.value)) {
      selectedAuditId.value = audits[0].id
    }
  },
  { immediate: true },
)

const activeAudit = computed(
  () => props.audits.find((audit) => audit.id === selectedAuditId.value) ?? props.audits[0],
)

const displayGroups = computed(() => {
  const audit = activeAudit.value
  if (!audit) return []

  const groups =
    audit.template?.templateItemTags.map((tag) => ({
      id: tag.id,
      title: tag.title,
      items: tag.templateItems,
    })) ?? []

  const groupedIds = new Set(
    groups.flatMap((group) => group.items.map((item) => item.templateItemId)),
  )
  const ungroupedItems = [...(audit.template?.templateItems ?? [])]

  audit.answers.forEach((resultItem) => {
    if (
      resultItem.templateItem &&
      !groupedIds.has(resultItem.templateItemId) &&
      !ungroupedItems.some((item) => item.templateItemId === resultItem.templateItemId)
    ) {
      ungroupedItems.push(resultItem.templateItem)
    }
  })

  if (ungroupedItems.length) {
    groups.push({ id: 0, title: 'General', items: ungroupedItems })
  }

  return groups
})

const getResultItem = (templateItemId: number): PermitAuditResultItemModel | undefined =>
  activeAudit.value?.answers.find((item) => item.templateItemId === templateItemId)

const getSelectedOptionIds = (templateItem: PermitAuditTemplateItemModel): Set<number> => {
  const resultItem = getResultItem(templateItem.templateItemId)
  if (!resultItem) return new Set()

  return new Set(
    resultItem.permitToWorkResultItemOptions
      .map(
        (selectedOption) =>
          selectedOption.templateItemOptionId ||
          selectedOption.templateItemOption?.templateItemOptionId ||
          selectedOption.templateItemOption?.id,
      )
      .filter((id): id is number => Boolean(id)),
  )
}

const isOptionSelected = (
  templateItem: PermitAuditTemplateItemModel,
  option: PermitAuditTemplateItemOptionModel,
): boolean =>
  getSelectedOptionIds(templateItem).has(option.templateItemOptionId) ||
  getSelectedOptionIds(templateItem).has(option.id)

const getWrittenAnswers = (templateItem: PermitAuditTemplateItemModel): string[] => {
  const resultItem = getResultItem(templateItem.templateItemId)
  if (!resultItem) return []

  const answers = resultItem.permitToWorkResultItemOptions
    .map((option) => option.answer)
    .filter(Boolean)

  if (resultItem.result) answers.unshift(resultItem.result)

  return [...new Set(answers)]
}

const hasAnswer = (templateItem: PermitAuditTemplateItemModel): boolean =>
  getSelectedOptionIds(templateItem).size > 0 || getWrittenAnswers(templateItem).length > 0

const isImage = (url: string, mimeType: string): boolean =>
  mimeType.startsWith('image/') || /\.(avif|gif|jpe?g|png|webp)(\?.*)?$/i.test(url)

const formatTime = (time: string): string => (time ? time.slice(0, 5) : '—')
</script>

<template>
  <Dialog
    v-model:visible="visible"
    modal
    dismissable-mask
    :header="$t('Permit audit results')"
    class="permit-audit-dialog"
    :style="{ width: 'min(70rem, calc(100vw - 24px))' }"
  >
    <div v-if="audits.length" class="audit-dialog-content">
      <div v-if="audits.length > 1" class="audit-switcher" role="tablist">
        <button
          v-for="(audit, index) in audits"
          :key="audit.id"
          type="button"
          :class="{ active: audit.id === activeAudit?.id }"
          @click="selectedAuditId = audit.id"
        >
          {{ $t('Audit') }} {{ index + 1 }}
          <small>{{ audit.date }} · {{ formatTime(audit.time) }}</small>
        </button>
      </div>

      <template v-if="activeAudit">
        <section class="audit-summary">
          <div class="audit-title">
            <span>{{ $t('Template') }}</span>
            <h3>{{ activeAudit.template?.title || '—' }}</h3>
          </div>

          <!-- <dl class="audit-meta">
            <div>
              <dt>{{ $t('Audit ID') }}</dt>
              <dd>#{{ activeAudit.permitToWorkResultId }}</dd>
            </div>
            <div>
              <dt>{{ $t('Permit ID') }}</dt>
              <dd>#{{ activeAudit.permitToWorkId }}</dd>
            </div>
            <div>
              <dt>{{ $t('Created by') }}</dt>
              <dd>{{ activeAudit.createdBy?.name || '—' }}</dd>
              <small>{{
                activeAudit.createdBy?.hierarchy.map((item) => item.title).join(', ')
              }}</small>
            </div>
            <div>
              <dt>{{ $t('Date & Time') }}</dt>
              <dd>{{ activeAudit.date || '—' }} · {{ formatTime(activeAudit.time) }}</dd>
            </div>
            <div>
              <dt>{{ $t('Status') }}</dt>
              <dd>{{ activeAudit.status }}</dd>
            </div>
          </dl> -->

          <!-- <div v-if="activeAudit.createdBy" class="creator-contact">
            <span v-if="activeAudit.createdBy.serialName">
              {{ activeAudit.createdBy.serialName }}
            </span>
            <a v-if="activeAudit.createdBy.email" :href="`mailto:${activeAudit.createdBy.email}`">
              {{ activeAudit.createdBy.email }}
            </a>
            <a v-if="activeAudit.createdBy.phone" :href="`tel:${activeAudit.createdBy.phone}`">
              {{ activeAudit.createdBy.phone }}
            </a>
          </div> -->
        </section>

        <div v-if="displayGroups.length" class="template-groups">
          <section v-for="group in displayGroups" :key="group.id" class="template-group">
            <h4>{{ group.title || $t('General') }}</h4>

            <article v-for="item in group.items" :key="item.templateItemId" class="answer-card">
              <div class="question-row">
                <span class="question-number">{{ item.templateItemId }}</span>
                <div>
                  <h5>{{ item.name || '—' }}</h5>
                  <small v-if="item.requireImage">{{ $t('Image required') }}</small>
                </div>
              </div>

              <div v-if="item.options.length" class="option-list">
                <div
                  v-for="option in item.options"
                  :key="option.templateItemOptionId"
                  class="template-option"
                  :class="{
                    selected: isOptionSelected(item, option),
                    danger: option.isDanger,
                  }"
                >
                  <span class="option-marker">
                    {{ isOptionSelected(item, option) ? '✓' : '' }}
                  </span>
                  <span>{{ option.title || '—' }}</span>
                </div>
              </div>

              <div v-if="getWrittenAnswers(item).length" class="written-answers">
                <strong>{{ $t('Answer') }}</strong>
                <p v-for="answer in getWrittenAnswers(item)" :key="answer">{{ answer }}</p>
              </div>

              <p v-if="!hasAnswer(item)" class="no-answer">
                {{ $t('No answer provided') }}
              </p>

              <div v-if="getResultItem(item.templateItemId)?.media.length" class="attachments">
                <a
                  v-for="media in getResultItem(item.templateItemId)?.media"
                  :key="media.id || media.url"
                  :href="media.url"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    v-if="isImage(media.url, media.mimeType)"
                    :src="media.url"
                    :alt="media.fileName"
                  />
                  <span v-else>{{ media.fileName || $t('View attachment') }}</span>
                </a>
              </div>
            </article>
          </section>
        </div>

        <div v-else class="empty-result">
          <strong>{{ $t('No template answers found') }}</strong>
        </div>
      </template>
    </div>

    <div v-else class="empty-result">
      <strong>{{ $t('No audit results found') }}</strong>
    </div>
  </Dialog>
</template>

<style scoped lang="scss">
.audit-dialog-content,
.template-groups {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.audit-switcher {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 4px;

  button {
    min-width: 135px;
    padding: 9px 12px;
    border: 1px solid var(--main-border);
    border-radius: 10px;
    color: var(--text-soft);
    background: var(--surface-1);
    text-align: start;
    cursor: pointer;

    &.active {
      border-color: var(--PrimaryColor);
      color: var(--PrimaryColor);
      background: color-mix(in srgb, var(--PrimaryColor) 7%, var(--surface-1));
    }
  }

  small {
    display: block;
    margin-top: 3px;
    white-space: nowrap;
  }
}

.audit-summary {
  padding: 18px;
  border: 1px solid color-mix(in srgb, var(--PrimaryColor) 18%, var(--main-border));
  border-radius: 16px;
  background: color-mix(in srgb, var(--PrimaryColor) 5%, var(--surface-1));
}

.audit-title {
  span,
  h3 {
    margin: 0;
  }

  span {
    color: var(--text-soft);
    font-size: 0.72rem;
    font-weight: 700;
    text-transform: uppercase;
  }

  h3 {
    margin-top: 3px;
    color: var(--text-strong);
  }
}

.audit-meta {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  margin: 16px 0 0;

  div {
    min-width: 0;
    padding-top: 10px;
    border-top: 1px solid var(--main-border);
  }

  dt {
    color: var(--text-soft);
    font-size: 0.68rem;
  }

  dd {
    margin: 4px 0 0;
    overflow-wrap: anywhere;
    color: var(--text-strong);
    font-weight: 700;
  }

  small {
    color: var(--text-soft);
  }
}

.creator-contact {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 14px;
  margin-top: 12px;
  color: var(--text-soft);
  font-size: 0.72rem;

  a {
    color: var(--PrimaryColor);
    text-decoration: none;
  }
}

.template-group {
  h4 {
    margin: 0 0 9px;
    color: var(--PrimaryColor);
    font-size: 0.9rem;
  }
}

.answer-card {
  margin-bottom: 10px;
  padding: 14px;
  border: 1px solid var(--main-border);
  border-radius: 14px;
  background: var(--surface-1);
}

.question-row {
  display: flex;
  align-items: flex-start;
  gap: 10px;

  h5 {
    margin: 1px 0 0;
    color: var(--text-strong);
    font-size: 0.88rem;
  }

  small {
    color: var(--text-soft);
  }
}

.question-number {
  display: grid;
  width: 30px;
  height: 30px;
  flex: 0 0 auto;
  place-items: center;
  border-radius: 8px;
  color: var(--PrimaryColor);
  font-size: 0.65rem;
  font-weight: 800;
  background: color-mix(in srgb, var(--PrimaryColor) 10%, transparent);
}

.option-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 8px;
  margin-top: 12px;
}

.template-option {
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 40px;
  padding: 7px 10px;
  border: 1px solid var(--main-border);
  border-radius: 10px;
  color: var(--text-soft);
  font-size: 0.78rem;
  background: var(--surface-1);

  &.selected {
    border-color: var(--PrimaryColor);
    color: var(--PrimaryColor);
    font-weight: 800;
    background: color-mix(in srgb, var(--PrimaryColor) 9%, var(--surface-1));
  }

  &.selected.danger {
    border-color: var(--status-danger, #dc2626);
    color: var(--status-danger, #dc2626);
    background: color-mix(in srgb, var(--status-danger, #dc2626) 8%, var(--surface-1));
  }
}

.option-marker {
  display: grid;
  width: 20px;
  height: 20px;
  flex: 0 0 auto;
  place-items: center;
  border: 1px solid currentColor;
  border-radius: 50%;
  font-size: 0.65rem;
}

.written-answers {
  margin-top: 12px;
  padding: 10px 12px;
  border-radius: 10px;
  background: color-mix(in srgb, var(--PrimaryColor) 7%, var(--surface-1));

  strong {
    color: var(--text-soft);
    font-size: 0.68rem;
    text-transform: uppercase;
  }

  p {
    margin: 4px 0 0;
    color: var(--text-strong);
    font-size: 0.8rem;
    white-space: pre-wrap;
  }
}

.no-answer {
  margin: 10px 0 0;
  color: var(--text-soft);
  font-size: 0.76rem;
  font-style: italic;
}

.attachments {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;

  a {
    display: grid;
    min-width: 88px;
    min-height: 64px;
    place-items: center;
    overflow: hidden;
    border: 1px solid var(--main-border);
    border-radius: 10px;
    color: var(--PrimaryColor);
    font-size: 0.72rem;
    text-decoration: none;
  }

  img {
    width: 88px;
    height: 64px;
    object-fit: cover;
  }
}

.empty-result {
  padding: 42px 20px;
  color: var(--text-soft);
  text-align: center;
}

@media (max-width: 700px) {
  .audit-meta {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 440px) {
  .audit-meta {
    grid-template-columns: 1fr;
  }
}
</style>
