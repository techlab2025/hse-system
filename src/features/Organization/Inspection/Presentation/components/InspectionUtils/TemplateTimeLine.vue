<script setup lang="ts">
import TitleInterface from '@/base/Data/Models/title_interface'
import CustomSelectInput from '@/shared/FormInputs/CustomSelectInput.vue'
import AddAnswer from '@/shared/icons/AddAnswer.vue'
import DeleteItemAction from '@/shared/icons/DeleteItemAction.vue'
import { onMounted, ref, watch } from 'vue'
import TemplateItemTimeLine from './TemplateItemTimeLine.vue'
import TemplateImage from '@/features/setting/TemplateItem/Presentation/components/TemplateTypes/TemplateImage.vue'
import { ActionsEnum } from '@/features/setting/TemplateItem/Core/Enum/ActionsEnum'

const emit = defineEmits(['update:data'])
const props = defineProps<{
  visable: boolean
  validationErrors?: Record<string, string>
}>()

const fieldError = (itemIndex: number, field: string) =>
  props.validationErrors?.[`items.${itemIndex}.${field}`] ?? ''

// Helper to create a new empty answer object with a unique ID
const createNewAnswerObject = () => ({
  id: Math.random().toString(36).substring(2, 9),
  itemTitle: '',
  itemTag: '',
  SelectedActionType: new TitleInterface({ id: ActionsEnum.CHECKBOX, title: 'Checkbox' }),
  TemplateItems: [],
  isUpdloadImage: false,
  ImageStatus: 0,
})

const Answers = ref([createNewAnswerObject()])

const addNewAnswer = () => {
  const lastTag = Answers.value.length > 0 ? Answers.value[Answers.value.length - 1].itemTag : ''
  const newAnswer = createNewAnswerObject()
  newAnswer.itemTag = lastTag
  Answers.value.push(newAnswer)
  UpdateData()
}

const DeletedIndex = ref<number | null>(null)

const DeleteItem = (index: number) => {
  if (Answers.value.length <= 1) return

  // Removing from Answers array automatically removes the nested TemplateItems
  Answers.value.splice(index, 1)
  DeletedIndex.value = index
  UpdateData()
}

const UpdateData = () => {
  emit('update:data', Answers.value)
}

onMounted(() => {
  UpdateData()
})

const ActionsType = ref<TitleInterface[]>([
  new TitleInterface({ id: ActionsEnum.CHECKBOX, title: 'Multiple Choice', subtitle: '' }),
  new TitleInterface({ id: ActionsEnum.RADIOBUTTON, title: 'Single Choice', subtitle: '' }),
  new TitleInterface({ id: ActionsEnum.DROPDOWN, title: 'Dropdown', subtitle: '' }),
  new TitleInterface({ id: ActionsEnum.TEXTAREA, title: 'Text', subtitle: '' }),
])

const UpdateType = () => {
  UpdateData()
}

const updateTemplateImage = (
  item: ReturnType<typeof createNewAnswerObject>,
  data: { isUpdloadImage: boolean; ImageType: number },
) => {
  item.isUpdloadImage = data.isUpdloadImage
  item.ImageStatus = data.ImageType
  UpdateData()
}

const resetAnswers = () => {
  Answers.value = [createNewAnswerObject()]
  DeletedIndex.value = null
  UpdateData()
}

watch(
  () => props.visable,
  (newVal) => {
    if (newVal) {
      if (!Answers.value.length) {
        resetAnswers()
      }
      return
    }
    resetAnswers()
  },
)
</script>

<template>
  <div class="template-container inspection-template-timeline col-span-4 w-full">
    <div class="heirarchy-info w-full">
      <div class="timeline-container col-span-3 w-full">
        <div class="timeline-toolbar">
          <div class="timeline-toolbar-copy">
            <span class="timeline-toolbar-kicker">{{ Answers.length }}</span>
            <!-- <span>{{ $t('inspection_exemined_title') }}</span> -->
          </div>
          <button class="timeline-add-main" type="button" @click="addNewAnswer">
            <AddAnswer />
            <span>{{ $t('Add another item') }}</span>
          </button>
        </div>

        <div class="timeline-wrapper">
          <div class="timeline-line"></div>

          <div
            v-for="(item, index) in Answers"
            :key="item.id"
            class="timeline-item"
            :class="{ active: index === 0 }"
            :style="{ animationDelay: `${index * 0.15}s` }"
          >
            <div class="timeline-marker">
              <div class="timeline-dot">
                <div class="timeline-dot-inner">
                  <span>{{ index + 1 }}</span>
                </div>
                <div class="timeline-pulse"></div>
              </div>

              <div class="timeline-actions">
                <button
                  v-if="Answers.length > 1"
                  class="timeline-action danger"
                  type="button"
                  @click="DeleteItem(index)"
                >
                  <DeleteItemAction />
                </button>
                <button
                  v-if="index === Answers.length - 1"
                  class="timeline-action add"
                  type="button"
                  @click="addNewAnswer"
                >
                  <AddAnswer />
                </button>
              </div>
            </div>

            <div class="timeline-content template-timeline-content grid grid-cols-4 w-full" :data-template-validation-error="Boolean(fieldError(index, 'title') || fieldError(index, 'tag') || fieldError(index, 'type') || fieldError(index, 'answers'))">
              <div class="template-section-topline col-span-4">
                <span class="template-section-chip">{{ index + 1 }}</span>
                <span class="template-section-rule"></span>
                <button
                  v-if="Answers.length > 1"
                  class="timeline-remove-card"
                  type="button"
                  @click="DeleteItem(index)"
                >
                  <DeleteItemAction />
                  <span>{{ $t('Remove') }}</span>
                </button>
              </div>
              <div class="col-span-4 flex flex-col md:flex-row w-full items-center gap-3">
                <div class="timeline-content-text input-wrapper w-full">
                  <label for="text">{{ $t('inspection_exemined_title') }}</label>
                  <input
                    type="text"
                    v-model="item.itemTitle"
                    class="input"
                    :placeholder="$t('add your title')"
                    @input="UpdateData"
                  />
                  <p v-if="fieldError(index, 'title')" class="required-field-message">{{ fieldError(index, 'title') }}</p>
                </div>
                <div class="timeline-content-text input-wrapper w-full">
                  <label for="text">{{ $t('inspection_exemined_tag') }}</label>
                  <input
                    type="text"
                    v-model="item.itemTag"
                    class="input"
                    :placeholder="$t('add your tag')"
                    @input="UpdateData"
                  />
                  <p v-if="fieldError(index, 'tag')" class="required-field-message">{{ fieldError(index, 'tag') }}</p>
                </div>

                <div class="input-wrapper type-select">
                  <CustomSelectInput
                    :static-options="ActionsType"
                    v-model="item.SelectedActionType"
                    :placeholder="$t('select template type..')"
                    class="mt-4 mr-2 input"
                    :label="$t('result_type')"
                    :reload="false"
                    @update:modelValue="UpdateType"
                  />
                  <p v-if="fieldError(index, 'type')" class="required-field-message">{{ fieldError(index, 'type') }}</p>
                </div>
              </div>

              <TemplateImage
                class="w-full col-span-4 md:col-span-4"
                @update:data="updateTemplateImage(item, $event)"
                :IdIndex="`${item.id}`"
              />

              <TemplateItemTimeLine
                v-if="item.SelectedActionType.id !== ActionsEnum.TEXTAREA"
                :itemindex="index"
                :key="`timeline-${item.id}`"
                @update:data="item.TemplateItems = $event"
                :isRadio="item.SelectedActionType.id === ActionsEnum.RADIOBUTTON"
                :deletedIndex="DeletedIndex"
                :validation-errors="validationErrors"
              />
              <p v-if="fieldError(index, 'answers')" class="required-field-message col-span-4">{{ fieldError(index, 'answers') }}</p>
            </div>
          </div>

          <button class="timeline-add-footer" type="button" @click="addNewAnswer">
            <AddAnswer />
            <span>{{ $t('Add another item') }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.inspection-template-timeline {
  --template-blue: var(--brand-primary-500);
  --template-navy: var(--brand-primary-800);
  --template-green: var(--status-success);
  --template-border: color-mix(in srgb, var(--brand-primary-100) 82%, transparent);
  margin-top: 2px;
}

.inspection-template-timeline .timeline-container {
  padding: 6px 0 2px;
  border: 0;
  background: transparent;
}

.timeline-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 14px;
  margin-bottom: 12px;
  border: 1px solid color-mix(in srgb, var(--brand-primary-100) 82%, transparent);
  border-radius: 18px;
  background: color-mix(in srgb, var(--surface-1) 90%, transparent);
  box-shadow: 0 10px 26px color-mix(in srgb, var(--brand-primary-900) 4%, transparent);
}

.timeline-toolbar-copy {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  color: var(--brand-primary-800);
  font-size: var(--sm-size);
  font-weight: 900;
}

.timeline-toolbar-kicker {
  display: inline-grid;
  width: 30px;
  height: 30px;
  place-items: center;
  border-radius: 10px;
  color: var(--template-blue);
  background: color-mix(in srgb, var(--brand-primary-500) 10%, transparent);
}

.timeline-add-main,
.timeline-add-footer {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 40px;
  padding: 0 14px;
  border: 1px solid color-mix(in srgb, var(--brand-primary-500) 18%, transparent);
  border-radius: 999px;
  color: var(--text-on-brand);
  font-size: 13px;
  font-weight: 900;
  white-space: nowrap;
  background: linear-gradient(135deg, var(--template-blue), var(--template-navy));
  box-shadow: 0 12px 22px color-mix(in srgb, var(--brand-primary-500) 18%, transparent);
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.timeline-add-main:hover,
.timeline-add-footer:hover {
  transform: translateY(-1px);
  box-shadow: 0 16px 28px color-mix(in srgb, var(--brand-primary-500) 24%, transparent);
}

.timeline-add-main :deep(svg),
.timeline-add-footer :deep(svg) {
  width: 20px;
  height: 20px;
}

.timeline-add-main :deep(svg circle),
.timeline-add-footer :deep(svg circle) {
  fill: color-mix(in srgb, var(--surface-1) 14%, transparent);
  stroke: color-mix(in srgb, var(--surface-1) 34%, transparent);
}

.timeline-add-main :deep(svg path),
.timeline-add-footer :deep(svg path) {
  fill: var(--text-on-brand);
}

.inspection-template-timeline .timeline-wrapper {
  padding-inline-start: 54px;
}

.inspection-template-timeline .timeline-line {
  inset-inline-start: 19px;
  top: 26px;
  bottom: 30px;
  width: 3px;
  border-radius: 999px;
  background: linear-gradient(180deg, color-mix(in srgb, var(--brand-primary-500) 72%, transparent), color-mix(in srgb, var(--status-success) 58%, transparent)) !important;
  opacity: 1;
}

.inspection-template-timeline .timeline-item {
  margin-bottom: 18px;
}

.inspection-template-timeline .timeline-marker {
  inset-inline-start: -54px;
  top: 22px;
}

.inspection-template-timeline .timeline-dot {
  width: 42px;
  height: 42px;
}

.inspection-template-timeline .timeline-dot-inner {
  display: grid;
  width: 34px;
  height: 34px;
  place-items: center;
  border: 4px solid var(--surface-1);
  background: linear-gradient(135deg, var(--template-blue), var(--template-navy));
  box-shadow: 0 12px 22px color-mix(in srgb, var(--brand-primary-500) 25%, transparent);
}

.inspection-template-timeline .timeline-dot-inner span {
  color: var(--text-on-brand);
  font-size: 12px;
  font-weight: 900;
}

.timeline-actions {
  position: absolute;
  inset-inline-start: 49px;
  top: 2px;
  display: flex;
  gap: 6px;
  padding: 4px;
  border: 1px solid color-mix(in srgb, var(--brand-primary-100) 88%, transparent);
  border-radius: 999px;
  background: color-mix(in srgb, var(--surface-1) 94%, transparent);
  box-shadow: 0 10px 20px color-mix(in srgb, var(--brand-primary-900) 8%, transparent);
}

.timeline-action {
  display: grid;
  width: 28px;
  height: 28px;
  place-items: center;
  border: 0;
  border-radius: 50%;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    background-color 0.2s ease,
    box-shadow 0.2s ease;
}

.timeline-action.add {
  color: var(--template-blue);
  background: color-mix(in srgb, var(--brand-primary-500) 10%, transparent);
}

.timeline-action.danger {
  color: var(--status-danger);
  background: color-mix(in srgb, var(--status-danger) 10%, transparent);
}

.timeline-action:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 16px color-mix(in srgb, var(--brand-primary-900) 10%, transparent);
}

.timeline-action :deep(svg) {
  width: 18px;
  height: 18px;
}

.timeline-add-footer {
  width: fit-content;
  margin: 14px 0 0;
}

.template-timeline-content {
  position: relative;
  gap: 14px;
  overflow: hidden;
  padding: 18px;
  border: 1px solid var(--template-border) !important;
  border-radius: 22px;
  background:
    linear-gradient(135deg, color-mix(in srgb, var(--surface-1) 98%, transparent), color-mix(in srgb, var(--brand-primary-50) 94%, transparent)),
    linear-gradient(90deg, color-mix(in srgb, var(--brand-primary-500) 6%, transparent), color-mix(in srgb, var(--status-success) 5%, transparent));
  box-shadow: 0 18px 42px color-mix(in srgb, var(--brand-primary-900) 7%, transparent);
}

.template-timeline-content::before {
  position: absolute;
  inset-inline-start: 0;
  top: 0;
  bottom: 0;
  width: 5px;
  content: '';
  background: linear-gradient(180deg, var(--template-blue), var(--template-green));
}

.template-section-topline {
  display: flex;
  align-items: center;
  gap: 10px;
}

.template-section-chip {
  display: inline-grid;
  width: 30px;
  height: 30px;
  place-items: center;
  border-radius: 10px;
  color: var(--template-blue);
  font-size: 12px;
  font-weight: 900;
  background: color-mix(in srgb, var(--brand-primary-500) 10%, transparent);
}

.template-section-rule {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, color-mix(in srgb, var(--brand-primary-500) 24%, transparent), transparent);
}

.timeline-remove-card {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-height: 34px;
  padding: 0 11px;
  border: 1px solid color-mix(in srgb, var(--status-danger) 18%, transparent);
  border-radius: 999px;
  color: var(--status-danger);
  font-size: 12px;
  font-weight: 900;
  white-space: nowrap;
  background: color-mix(in srgb, var(--status-danger) 8%, transparent);
  cursor: pointer;
  transition:
    transform 0.2s ease,
    color 0.2s ease,
    background-color 0.2s ease,
    box-shadow 0.2s ease;
}

.timeline-remove-card:hover {
  transform: translateY(-1px);
  color: var(--text-on-brand);
  background: var(--status-danger);
  box-shadow: 0 10px 20px color-mix(in srgb, var(--status-danger) 16%, transparent);
}

.timeline-remove-card :deep(svg) {
  width: 16px;
  height: 16px;
}

.timeline-remove-card:hover :deep(svg path) {
  stroke: var(--text-on-brand);
}

.template-timeline-content .input-wrapper {
  padding: 2px;
}

.template-timeline-content :deep(input),
.template-timeline-content :deep(.p-select),
.template-timeline-content :deep(.p-multiselect) {
  border-color: color-mix(in srgb, var(--brand-primary-100) 95%, transparent) !important;
  background: color-mix(in srgb, var(--surface-1) 95%, transparent) !important;
  box-shadow: 0 6px 18px color-mix(in srgb, var(--brand-primary-900) 4%, transparent);
}

.template-timeline-content :deep(input:focus),
.template-timeline-content :deep(.p-focus) {
  border-color: color-mix(in srgb, var(--brand-primary-500) 55%, transparent) !important;
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--brand-primary-500) 10%, transparent) !important;
}

.type-select {
  min-width: 220px;
}

.required-field-message {
  margin-top: 6px;
  color: var(--status-danger);
  font-size: 12px;
  font-weight: 700;
}

[data-template-validation-error='true'] {
  border-color: color-mix(in srgb, var(--status-danger) 55%, transparent) !important;
}

@media (max-width: 768px) {
  .inspection-template-timeline .timeline-wrapper {
    padding-inline-start: 36px;
  }

  .inspection-template-timeline .timeline-marker {
    inset-inline-start: -36px;
    top: 18px;
  }

  .inspection-template-timeline .timeline-line {
    inset-inline-start: 14px;
  }

  .inspection-template-timeline .timeline-dot,
  .inspection-template-timeline .timeline-dot-inner {
    width: 30px;
    height: 30px;
  }

  .inspection-template-timeline .timeline-dot-inner {
    border-width: 3px;
  }

  .timeline-actions {
    position: static;
    margin-top: 8px;
    transform: translateX(-4px);
  }

  .timeline-toolbar {
    align-items: stretch;
    flex-direction: column;
  }

  .timeline-add-main,
  .timeline-add-footer {
    width: 100%;
  }

  .template-timeline-content {
    padding: 14px;
    border-radius: 18px;
  }

  .template-section-topline {
    flex-wrap: wrap;
  }

  .timeline-remove-card {
    width: 100%;
  }

  .type-select {
    width: 100%;
    min-width: 0;
  }
}
</style>
