<script lang="ts" setup>
import { markRaw, onMounted, ref, watch } from 'vue'
import LangTitleInput from '@/shared/HelpersComponents/LangTitleInput.vue'
import USA from '@/shared/icons/USA.vue'
import SA from '@/shared/icons/SA.vue'
import TranslationsParams from '@/base/core/params/translations_params.ts'
import IndexLangController from '@/features/setting/languages/Presentation/controllers/indexLangController.ts'
import IndexLangParams from '@/features/setting/languages/Core/params/indexLangParams.ts'
import { LangsMap } from '@/constant/langs.ts'
import { useRoute } from 'vue-router'
import type RoleDetailsModel from '../../Data/models/RoleDetailsModel'
import { useUserStore } from '@/stores/user'
import type PermissionDetailsModel from '@/features/permission/Data/models/PermissionDetailsModel'
import { getOrganizationPermissionLabel } from '@/features/permission/Presentation/Helpers/organization_permission'
import EditRoleParams from '../../Core/params/editRoleParams'
import AddRoleParams from '../../Core/params/addRoleParams'
import PermissionTabContent from "@/features/permission/Presentation/supcomponents/PermissionTabContent.vue";



const route = useRoute()
const emit = defineEmits(['update:data'])
const props = defineProps<{
  data?: RoleDetailsModel
}>()
const baseSegment = `${route.path.split('/')[1]}`
const allPermission = getOrganizationPermissionLabel(baseSegment)
const id = route.params.parent_id

type ImageValue = string | { file?: File; id?: number }

// ---------- State ----------
const langs = ref<
  {
    locale: string
    icon?: any
    title: string
  }[]
>([])

// default available langs from backend
const langDefault = ref<
  {
    locale: string
    icon?: any
    title: string
  }[]
>([])

const user = useUserStore()
// ---------- Fetch available languages ----------
const fetchLang = async (
  query: string = '',
  pageNumber: number = 1,
  perPage: number = 10,
  withPage: number = 0,
) => {
  if (user?.user?.languages.length) {
    langDefault.value = user?.user?.languages.map((item: any) => ({
      locale: item.code,
      title: '',
      icon: markRaw(LangsMap[item.code as keyof typeof LangsMap]?.icon),
    }))
    return
  }
  const params = new IndexLangParams(query, pageNumber, perPage, withPage)
  const indexRoleController = await IndexLangController.getInstance().getData(params)

  const response = indexRoleController.value

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

const phone = ref<string>('')

onMounted(async () => {
  await fetchLang()
})

// ---------- Emit update ----------
const updateData = () => {
  const translationsParams = new TranslationsParams()

  // titles
  langs.value.forEach((lang) => {
    translationsParams.setTranslation('title', lang.locale, lang.title)
  })



  const params = props.data?.id
    ? new EditRoleParams(props.data.id, translationsParams, allPermission.value)
    : new AddRoleParams(translationsParams, allPermission.value)

  // console.log(params, 'params')

  emit('update:data', params)
}

// ---------- Watchers ----------
// Init from props (edit mode) or defaults (create mode)
watch(
  [() => props.data, () => langDefault.value],
  ([newData, newDefault]) => {
    if (newDefault.length) {
      // titles
      if (newData?.titles?.length) {
        langs.value = newDefault.map((l) => {
          const existing = newData.titles.find((t) => t.locale === l.locale)
          return existing ? existing : { locale: l.locale, title: '' }
        })
      } else {
        langs.value = newDefault.map((l) => ({ locale: l.locale, title: '' }))
      }

      phone.value = newData?.phone ?? ''

      updateData()
    }
  },
  { immediate: true },
)

watch(
  [langs, phone],
  () => {
    updateData()
  },
  { deep: true },
)

const permissions = ref<PermissionDetailsModel[]>([])
const setPermission = (val) => {
  allPermission.value = val
  updateData()
}
</script>

<template>
  <div class="col-span-4 md:col-span-4">
    <LangTitleInput :langs="langDefault" :modelValue="langs" @update:modelValue="(val) => (langs = val)" />
  </div>
  <div class="permission col-span-4 md:col-span-4">
    <PermissionTabContent @update:permissions="setPermission" :permissions="permissions" />
  </div>
</template>
