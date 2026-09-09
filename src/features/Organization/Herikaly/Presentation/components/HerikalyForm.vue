<script lang="ts" setup>
import { computed, markRaw, nextTick, onMounted, ref, watch } from 'vue'
import LangTitleInput from '@/shared/HelpersComponents/LangTitleInput.vue'
import USA from '@/shared/icons/USA.vue'
import SA from '@/shared/icons/SA.vue'
import TranslationsParams from '@/base/core/params/translations_params.ts'
import IndexLangController from '@/features/setting/languages/Presentation/controllers/indexLangController.ts'
import IndexLangParams from '@/features/setting/languages/Core/params/indexLangParams.ts'
import { LangsMap } from '@/constant/langs.ts'
import type HerikalyDetailsModel from '../../Data/models/HerikalyDetailsModel'
import EditHerikalyParams from '../../Core/params/editHerikalyParams'
import AddHerikalyParams from '../../Core/params/addHerikalyParams'
import { useUserStore } from '@/stores/user'
import { useRoute } from 'vue-router'
import IndexCertificateController from '@/features/setting/Certificate/Presentation/controllers/indexCertificateController'
import IndexCertificateParams from '@/features/setting/Certificate/Core/params/indexCertificateParams'
import TitleInterface from '@/base/Data/Models/title_interface'
import SwitchInput from '@/shared/FormInputs/SwitchInput.vue'
import { OpenWarningDilaog } from '@/base/Presentation/utils/OpenWarningDialog'

const emit = defineEmits(['update:data'])

const props = withDefaults(
  defineProps<{
    data?: HerikalyDetailsModel
    showCertificateSelectAll?: boolean
  }>(),
  {
    showCertificateSelectAll: true,
  },
)

const indexCertificateController = IndexCertificateController.getInstance()
const indexCertificateParams = new IndexCertificateParams('', 1, 10, 0)
const Certificate = ref<TitleInterface[]>([])
const certificateOptions = ref<TitleInterface[]>([])
const certificateSearch = ref('')
const isLoadingCertificates = ref(false)

const fetchCertificates = async () => {
  isLoadingCertificates.value = true

  try {
    const response = await indexCertificateController.getData(indexCertificateParams)
    certificateOptions.value = response.value.data ?? []
  } catch {
    certificateOptions.value = []
  } finally {
    isLoadingCertificates.value = false
  }
}

const filteredCertificateOptions = computed(() => {
  const searchTerm = certificateSearch.value.trim().toLocaleLowerCase()
  if (!searchTerm) return certificateOptions.value

  return certificateOptions.value.filter((certificate) =>
    certificate.title?.toLocaleLowerCase().includes(searchTerm),
  )
})

const isCertificateSelected = (id: number) =>
  Certificate.value.some((certificate) => certificate.id === id)

const toggleCertificate = (certificate: TitleInterface) => {
  const certificateIndex = Certificate.value.findIndex((item) => item.id === certificate.id)

  if (certificateIndex === -1) {
    Certificate.value.push(certificate)
  } else {
    Certificate.value.splice(certificateIndex, 1)
  }

  updateData()
}

const areAllCertificatesSelected = computed(
  () =>
    certificateOptions.value.length > 0 &&
    certificateOptions.value.every((certificate) => isCertificateSelected(certificate.id)),
)

const toggleAllCertificates = (event: Event) => {
  const shouldSelectAll = (event.target as HTMLInputElement).checked

  Certificate.value = shouldSelectAll ? [...certificateOptions.value] : []

  updateData()
}

const route = useRoute()
const ParentId = route.params.parent_id
const langs = ref<{ locale: string; title: string }[]>([])
const langDefault = ref<{ locale: string; icon?: string; title: string }[]>([])
const user = useUserStore()

const fetchLang = async (
  query: string = '',
  pageNumber: number = 1,
  perPage: number = 10,
  withPage: number = 0,
) => {
  console.log(user.user, 'user')
  if (user?.user?.languages.length) {
    langDefault.value = user?.user?.languages.map((item: any) => ({
      locale: item.code,
      title: '',
      icon: markRaw(LangsMap[item.code as keyof typeof LangsMap]?.icon),
    }))
    return
  }
  const params = new IndexLangParams(query, pageNumber, perPage, withPage)
  const indexPartnerController = await IndexLangController.getInstance().getData(params)

  const response = indexPartnerController.value

  if (response?.data?.length) {
    langDefault.value = response.data.map((item: any) => ({
      locale: item.code,
      title: '',
      icon: markRaw(LangsMap[item.code as keyof typeof LangsMap]?.icon),
    }))
  } else {
    langDefault.value = [
      { locale: 'en', icon: USA, title: '' },
      { locale: 'ar', icon: SA, title: '' },
    ]
  }
}

onMounted(async () => {
  await Promise.all([fetchLang(), fetchCertificates()])
})

const updateData = () => {
  const translationsParams = new TranslationsParams()

  langs.value.forEach((lang) => {
    translationsParams.setTranslation('title', lang.locale, lang.title)
  })

  const params = props.data?.id
    ? new EditHerikalyParams(
        props?.data?.id,
        translationsParams,
        ParentId,
        Certificate.value.map((item) => item.id),
      )
    : new AddHerikalyParams(
        translationsParams,
        Certificate.value.map((item) => item.id),
        ParentId,
      )

  emit('update:data', params)
}

const setLangs = (data: { locale: string; title: string }[]) => {
  langs.value = data
  updateData()
}

watch(
  [() => props.data, () => langDefault.value],
  ([newData, newDefault]) => {
    if (newDefault.length) {
      if (newData?.titles?.length) {
        langs.value = newDefault.map((l) => {
          const existing = newData.titles.find((t) => t.locale === l.locale)
          return existing ? existing : { locale: l.locale, title: '' }
        })

      } else {
        langs.value = newDefault.map((l) => ({ locale: l.locale, title: '' }))
      }

      Certificate.value = (newData?.certificates ?? []).map(
        (item) =>
          new TitleInterface({
            id: item.id,
            title: item.titles?.[0]?.title,
          }),
      )
    }
  },
  { immediate: true },
)
const UpdateSerial = (data) => {
  SerialNumber.value = data
  updateData()
}

const SerialNumber = ref()

const fields = ref([
  {
    key: 'SerialNumber',
    label: 'serial_number',
    placeholder: 'You can leave it (auto-generated)',
    value: SerialNumber.value,
    enabled: props?.data?.id ? false : true,
  },
])

type RequiredFieldRule = {
  key: string
  message: string
  isMissing: () => boolean
}

const requiredFieldErrors = ref<Record<string, string>>({})
const hasValue = (value: unknown) =>
  value !== null && value !== undefined && String(value).trim().length > 0
const hasLangValue = () => langs.value.some((lang) => hasValue(lang.title))

const requiredFields = computed<RequiredFieldRule[]>(() => [
  {
    key: 'langs',
    message: 'Title Is Required',
    isMissing: () => !hasLangValue(),
  },
  // {
  //   key: 'Certificate',
  //   message: 'Certificate Is Required',
  //   isMissing: () => !Certificate.value?.length,
  // },
])

const getFieldError = (key: string) => requiredFieldErrors.value[key] ?? ''

const scrollToRequiredField = async (key: string) => {
  await nextTick()
  document.querySelector<HTMLElement>(`[data-required-field="${key}"]`)?.scrollIntoView({
    behavior: 'smooth',
    block: 'center',
  })
}

const validateRequiredFields = async () => {
  const missedFields = requiredFields.value.filter((field) => field.isMissing())
  requiredFieldErrors.value = missedFields.reduce<Record<string, string>>((errors, field) => {
    errors[field.key] = field.message
    return errors
  }, {})

  if (!missedFields.length) return true

  new OpenWarningDilaog(missedFields[0].message).openDialog()
  await scrollToRequiredField(missedFields[0].key)
  return false
}

defineExpose({
  validateRequiredFields,
})
</script>

<template>
  <div class="col-span-4 md:col-span-2" data-required-field="langs">
    <LangTitleInput
      type="text"
      :langs="langDefault"
      :modelValue="langs"
      :label="$t('position_name')"
      @update:modelValue="setLangs"
    />
    <p v-if="getFieldError('langs')" class="required-field-message">
      {{ getFieldError('langs') }}
    </p>
  </div>
  <div class="col-span-4" data-required-field="Certificate">
    <div class="training-selector">
      <div class="training-selector-header">
        <label class="training-selector-label">{{ $t('certificate') }}</label>
        <div class="training-selector-actions">
          <label class="training-select-all">
            <input
              type="checkbox"
              :checked="areAllCertificatesSelected"
              :disabled="isLoadingCertificates || !certificateOptions.length"
              @change="toggleAllCertificates"
            />
            <span>{{ $t('select_all') }}</span>
          </label>
          <span class="training-selected-count">
            {{ Certificate.length }} {{ $t('selected') }}
          </span>
        </div>
      </div>

      <div class="training-search">
        <input
          v-model="certificateSearch"
          type="search"
          :placeholder="$t('search certificates')"
          @keydown.enter.prevent
        />
      </div>

      <div class="training-options" role="group" :aria-label="$t('certificate')">
        <div v-if="isLoadingCertificates" class="training-options-message">
          {{ $t('loading') }}...
        </div>

        <template v-else-if="filteredCertificateOptions.length">
          <label
            v-for="certificate in filteredCertificateOptions"
            :key="certificate.id"
            class="training-option"
            :class="{ selected: isCertificateSelected(certificate.id) }"
          >
            <input
              type="checkbox"
              :checked="isCertificateSelected(certificate.id)"
              @change="toggleCertificate(certificate)"
            />
            <span class="training-option-check" aria-hidden="true">
              <span>✓</span>
            </span>
            <span class="training-option-title">{{ certificate.title || '—' }}</span>
          </label>
        </template>

        <div v-else class="training-options-message">
          {{ $t('training_empty_title') }}
        </div>
      </div>
    </div>
    <p v-if="getFieldError('Certificate')" class="required-field-message">
      {{ getFieldError('Certificate') }}
    </p>
  </div>
  <!-- <div class="input-wrapper col-span-4 md:col-span-2" v-if="!data?.id">
      <SwitchInput
      :fields="fields"
      :switch_title="$t('auto')"
      :switch_reverse="true"
      :is-auto="true"
      @update:value="UpdateSerial"
    />
  </div> -->
</template>

<style scoped>
.required-field-message {
  margin-top: 0.35rem;
  color: var(--status-danger);
  font-size: 0.82rem;
  font-weight: 700;
}

.training-selector {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 0.875rem;
  border: 1px solid var(--surface-2, #dbe4ff);
  border-radius: 18px;
  background: var(--surface-1, #fff);
  box-shadow: 0 8px 24px rgb(37 83 219 / 6%);
}

.training-selector-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}

.training-selector-label {
  color: var(--text-strong, #172554);
  font-size: 0.95rem;
  font-weight: 700;
}

.training-selector-actions {
  display: flex;
  align-items: center;
  gap: 0.625rem;
}

.training-select-all {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  margin: 0;
  color: var(--brand-primary-700, #1d4ed8) !important;
  font-size: 0.8rem !important;
  font-weight: 700 !important;
  cursor: pointer;
}

.training-select-all input {
  width: 18px;
  height: 18px;
  margin: 0;
  padding: 0 !important;
  accent-color: var(--brand-primary-500, #2553db);
  cursor: pointer;
}

.training-select-all:has(input:disabled) {
  opacity: 0.55;
  cursor: not-allowed;
}

.training-select-all input:disabled {
  cursor: not-allowed;
}

.training-selected-count {
  flex-shrink: 0;
  padding: 0.3rem 0.65rem;
  border-radius: 999px;
  color: var(--brand-primary-700, #1d4ed8);
  background: var(--brand-primary-50, #eff6ff);
  font-size: 0.75rem;
  font-weight: 700;
}

.training-search input {
  width: 100%;
  min-height: 42px;
  padding-inline: 0.875rem;
  border: 1px solid var(--surface-2, #dbe4ff);
  border-radius: 12px;
  color: var(--text-strong, #172554);
  background: var(--surface-2, #f8faff);
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.training-search input:focus {
  border-color: var(--brand-primary-500, #2553db);
  box-shadow: 0 0 0 3px rgb(37 83 219 / 12%);
}

.training-options {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  grid-auto-rows: minmax(48px, auto);
  align-content: start;
  gap: 0.625rem;
  width: 100%;
  max-height: calc(96px + 15.625rem);
  padding-inline-end: 0.35rem;
  overflow-x: hidden;
  overflow-y: auto;
  overscroll-behavior: contain;
  scrollbar-width: thin;
  scrollbar-color: var(--brand-primary-300, #93b0ff) transparent;
}

.training-options::-webkit-scrollbar {
  width: 7px;
}

.training-options::-webkit-scrollbar-thumb {
  border-radius: 999px;
  background: var(--brand-primary-300, #93b0ff);
}

.training-option {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.625rem;
  min-width: 0;
  min-height: 48px;
  padding: 0.625rem 0.75rem;
  border: 1px solid var(--surface-2, #dbe4ff);
  border-radius: 12px;
  background: var(--surface-1, #fff);
  cursor: pointer;
  transition: border-color 0.2s ease, background-color 0.2s ease, transform 0.2s ease;
}

.training-option:hover {
  border-color: var(--brand-primary-300, #93b0ff);
  background: var(--brand-primary-50, #f5f8ff);
  transform: translateY(-1px);
}

.training-option.selected {
  border-color: var(--brand-primary-500, #2553db);
  background: var(--brand-primary-50, #eff6ff);
}

.training-option input {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
}

.training-option-check {
  display: grid;
  flex: 0 0 22px;
  width: 22px;
  height: 22px;
  place-items: center;
  border: 2px solid var(--surface-2, #b8c7ef);
  border-radius: 7px;
  color: transparent;
  background: var(--surface-1, #fff);
  transition: all 0.2s ease;
}

.training-option input:focus-visible + .training-option-check {
  outline: 3px solid rgb(37 83 219 / 18%);
  outline-offset: 2px;
}

.training-option.selected .training-option-check {
  border-color: var(--brand-primary-500, #2553db);
  color: #fff;
  background: var(--brand-primary-500, #2553db);
}

.training-option-title {
  min-width: 0;
  overflow: hidden;
  color: var(--text-strong, #172554);
  font-size: 0.875rem;
  font-weight: 600;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.training-options-message {
  grid-column: 1 / -1;
  padding: 1.5rem 0.75rem;
  color: var(--text-muted, #64748b);
  text-align: center;
}

@media (max-width: 900px) {
  .training-options {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .training-selector-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .training-selector-actions {
    width: 100%;
    justify-content: space-between;
  }

  .training-options {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
