<script setup lang="ts">
import DocumnetHeader from '@/assets/images/DocumnetHeader.png'
import TemplateDocumentRadioButtonShow from './TemplateDocumentTypes/TemplateDocumentRadioButtonShow.vue'
import TemplateDocumentCheckboxShow from './TemplateDocumentTypes/TemplateDocumentCheckboxShow.vue'
import TemplateDocumentSelectShow from './TemplateDocumentTypes/TemplateDocumentSelectShow.vue'
import TemplateDocumentTextAreaShow from './TemplateDocumentTypes/TemplateDocumentTextAreaShow.vue'
import TitleInterface from '@/base/Data/Models/title_interface'
import type TemplateDetailsModel from '@/features/setting/Template/Data/models/TemplateDetailsModel'
import { ActionsEnum } from '../../Core/Enum/ActionsEnum'
import { ref, watch } from 'vue'
import DeleteTemplateItemController from '../controllers/deleteTemplateItemController'
import DeleteTemplateItemParams from '../../Core/params/deleteTemplateItemParams'
import DeleteIcon from '@/shared/icons/DeleteIcon.vue'
import DeleteTemplateIcon from '@/shared/icons/DeleteTemplateIcon.vue'
import DeleteItemDialog from '@/shared/HelpersComponents/dialog/DeleteItemDialog.vue'
import DropList from '@/shared/HelpersComponents/DropList.vue'
import { PermissionsEnum } from '@/features/users/Admin/Core/Enum/permission_enum'
import IconEdit from '@/shared/icons/IconEdit.vue'
import IconDelete from '@/shared/icons/IconDelete.vue'
import ShowProjectIcon from '@/shared/icons/ShowProjectIcon.vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import IconArrowDownNav from '@/shared/icons/IconArrowDownNav.vue'

const props = defineProps<{
  allData: TemplateDetailsModel
  headerDisplay: boolean | true
  isActions?: boolean | true
}>()
const emit = defineEmits(['update:data'])
const { t } = useI18n()
const route = useRoute()
const TemplateId = route.params.parent_id

const AllData = ref(props.allData)

watch(
  () => props.allData,
  (newState) => {
    if (newState) {
      AllData.value = newState
      // console.log(newState)
    }
  },
  {
    deep: true,
  },
)

const actionList = (id: number, DeleteTemplateItem: (id: number) => void) => [
  // {
  //   text: t('edit'),
  //   icon: IconEdit,
  //   //id =  template_id / parent_id =tempalte_item_id
  //   link: `/organization/template-item/${TemplateId}/${id}`,
  //   permission: [

  //     PermissionsEnum.ORGANIZATION_EMPLOYEE,
  //     PermissionsEnum.TEMPLATE_ITEM_ALL,
  //   ],
  // },
  {
    text: t('delete'),
    icon: IconDelete,
    action: () => DeleteTemplateItem(id),
    permission: [
      PermissionsEnum.TEMPLATE_ITEM_DELETE,
      PermissionsEnum.ORGANIZATION_EMPLOYEE,
      PermissionsEnum.TEMPLATE_ITEM_ALL,
    ],
  },
]

const DeleteTemplateItem = async (id: number) => {
  const deleteTemplateItemController = DeleteTemplateItemController.getInstance()
  const deleteTemplateItemParams = new DeleteTemplateItemParams(id)
  await deleteTemplateItemController.deleteTemplateItem(deleteTemplateItemParams)
  emit('update:data')
}
const showMore = ref(false)
</script>
<template>
  <div class="template-document-container">
    <div class="template-document-header" v-if="headerDisplay">
      <div class="template-header">
        <!-- <pre>{{ allData }}</pre> -->
        <p class="header-title" v-if="allData.titles && allData?.titles?.length > 0">
          {{
            allData?.titles
              ?.filter((item) => item.locale === 'en')
              .map((item) => item.title)
              .join('')
          }}
        </p>

        <p class="header-title" v-else>{{ allData?.title }}</p>
        <div class="template-details">
          <p>
            Id : <span>{{ allData?.id }}</span>
          </p>
          <!-- <p>location :<span>example</span></p> -->
          <!-- <p>Zone :<span>example</span></p> -->
        </div>
      </div>
      <img :src="DocumnetHeader" alt="header" />
    </div>
    <div class="template-document-content-container">
      
      <div
        v-for="(tag, index) in route.path.includes('equipment-mangement/inspection/add')
          ? showMore
            ? allData?.templateItemTags
            : allData?.templateItemTags.slice(0, 1)
          : allData?.templateItemTags"
        :key="index"
        class="template-tag-group"
      >
        <p class="tag-title" v-if="tag.titles?.length > 0">
          {{
            tag.titles
              ?.filter((item) => item.locale === 'en')
              .map((item) => item.title)
              .join('')
          }}
        </p>
        <p class="tag-title" v-else>{{ tag.title }}</p>
        <div
          class="template-document-content"
          v-for="(item, index) in route.path.includes('equipment-mangement/inspection/add')
            ? showMore
              ? tag?.templateItems
              : tag?.templateItems.slice(0, 1)
            : tag?.templateItems"
          :key="index"
        >
          <div
            class="actions"
            v-if="
              !route.path.includes('equipment-show') &&
              !route.path.includes('template-item') &&
              isActions
            "
          >
            <DropList
              :actionList="actionList(item.id, DeleteTemplateItem)"
              @delete="DeleteTemplateItem(item.id)"
            />
          </div>
          <TemplateDocumentCheckboxShow
            v-if="item?.action == ActionsEnum.CHECKBOX"
            :key="index"
            :title="item.name"
            :options="item.options"
            :require_image="item.requiredImage"
            :has_textarea="item.has_textarea"
          />
          <TemplateDocumentRadioButtonShow
            v-if="item?.action == ActionsEnum.RADIOBUTTON"
            :title="item.name"
            :options="item.options"
            :require_image="item.requiredImage"
            :has_textarea="item.has_textarea"
          />
          <TemplateDocumentSelectShow
            v-if="item?.action == ActionsEnum.DROPDOWN"
            :title="item.name"
            :key="index"
            :options="item.options"
            :require_image="item.requiredImage"
            :has_textarea="item.has_textarea"
          />
          <TemplateDocumentTextAreaShow
            v-if="item?.action == ActionsEnum.TEXTAREA"
            :title="item.name"
            :require_image="item.requiredImage"
          />
        </div>
      </div>
      <button
        class="show-more-btn"
        v-if="
          allData?.templateItemTags.length > 1 &&
          route.path.includes('equipment-mangement/inspection/add')
        "
        @click="showMore = !showMore"
      >
        <span>{{ showMore ? 'Show Less' : 'Show More' }}</span>
        <IconArrowDownNav :class="showMore ? 'rotate' : ''" />
      </button>
    </div>
    <!-- <DeleteItemDialog @update:data="DeleteTemplateItem(item?.id)" /> -->
  </div>
</template>

<style scoped>
.template-document-container {
  min-width: 0;
  padding: 2px 4px 4px;
}

.template-document-content-container {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 14px;
}

.template-tag-group {
  min-width: 0;
}

.template-tag-group + .template-tag-group {
  padding-top: 6px;
}

.tag-title {
  display: flex;
  align-items: center;
  gap: 9px;
  margin: 8px 0 10px;
  color: var(--brand-primary-800);
  font-family: 'Regular';
  font-size: 14px;
  font-weight: 900;
  line-height: 1.25;
}

.tag-title::before {
  display: inline-block;
  width: 8px;
  height: 22px;
  flex: 0 0 auto;
  border-radius: 999px;
  content: '';
  background: linear-gradient(180deg, var(--brand-primary-500), var(--status-success));
}

.template-document-content {
  position: relative;
  min-width: 0;
  margin-bottom: 10px;
  padding: 14px;
  overflow: hidden;
  border: 1px solid color-mix(in srgb, var(--brand-primary-100) 84%, transparent);
  border-radius: 18px;
  background:
    linear-gradient(135deg, color-mix(in srgb, var(--surface-1) 96%, transparent), color-mix(in srgb, var(--brand-primary-50) 95%, transparent)),
    linear-gradient(90deg, color-mix(in srgb, var(--brand-primary-500) 3.5%, transparent), color-mix(in srgb, var(--status-success) 3.5%, transparent));
  box-shadow: 0 12px 28px color-mix(in srgb, var(--brand-primary-900) 5.5%, transparent);
}

.template-document-content::before {
  position: absolute;
  inset-inline-start: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  content: '';
  background: linear-gradient(180deg, var(--brand-primary-500), var(--status-success));
}

.actions {
  position: absolute;
  z-index: 4;
  top: 10px;
  inset-inline-end: 10px;
}

.show-more-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 40px;
  padding: 0 14px;
  border: 1px solid color-mix(in srgb, var(--brand-primary-500) 18%, transparent);
  border-radius: 999px;
  color: var(--brand-primary-500);
  font-size: 12px;
  font-weight: 900;
  background: color-mix(in srgb, var(--brand-primary-500) 8%, transparent);
  cursor: pointer;
}

.show-more-btn .rotate {
  transform: rotate(180deg);
}

:deep(.show-template-document-checkbox),
:deep(.show-template-document-radio),
:deep(.show-template-document-select) {
  width: 100%;
  min-width: 0;
  gap: 10px;
}

:deep(.show-template-document-checkbox > .title),
:deep(.show-template-document-radio > .title),
:deep(.show-template-document-select label) {
  margin: 0;
  padding-inline-end: 38px;
  color: var(--brand-primary-900);
  font-size: 14px;
  font-weight: 900;
  line-height: 1.35;
}

:deep(.options-container) {
  width: 100%;
  min-width: 0;
  padding: 0 !important;
  border-bottom: 0 !important;
}

:deep(.options) {
  display: grid !important;
  width: 100%;
  min-width: 0;
  grid-template-columns: repeat(auto-fit, minmax(118px, 1fr));
  gap: 8px !important;
}

:deep(.options-box) {
  display: flex !important;
  min-width: 0;
  min-height: 42px;
  align-items: center !important;
  justify-content: space-between !important;
  gap: 8px !important;
  padding: 8px 10px;
  border: 1px solid color-mix(in srgb, var(--brand-primary-100) 86%, transparent);
  border-radius: 13px;
  background: var(--brand-primary-50);
}

:deep(.options-box .label) {
  min-width: 0;
  overflow: hidden;
  color: var(--brand-primary-700) !important;
  font-size: 12px !important;
  font-weight: 900 !important;
  text-overflow: ellipsis;
  white-space: nowrap;
}

:deep(.p-checkbox),
:deep(.p-radiobutton) {
  flex: 0 0 auto;
}

:deep(.p-checkbox-box),
:deep(.p-radiobutton-box) {
  border-color: color-mix(in srgb, var(--brand-primary-500) 28%, transparent) !important;
  background: var(--surface-1) !important;
}

:deep(.show-template-document-select .options-container) {
  display: flex !important;
  align-items: flex-start !important;
  gap: 10px;
}

:deep(.show-template-document-select .input-wrapper) {
  width: 100%;
  min-width: 0;
  padding: 0 !important;
}

:deep(.show-template-document-select .p-select),
:deep(.show-template-document-select textarea),
:deep(.show-template-document-select .input) {
  width: 100%;
  min-height: 44px;
  border: 1px solid color-mix(in srgb, var(--brand-primary-100) 90%, transparent) !important;
  border-radius: 14px !important;
  background: var(--brand-primary-50) !important;
  box-shadow: none !important;
}

:deep(.image-upload) {
  width: 38px !important;
  height: 38px !important;
  flex: 0 0 auto;
  padding: 8px;
  border: 1px solid color-mix(in srgb, var(--status-success) 20%, transparent);
  border-radius: 13px;
  background: color-mix(in srgb, var(--status-success) 10%, transparent);
}

@media (max-width: 640px) {
  .template-document-content {
    padding: 12px;
    border-radius: 16px;
  }

  :deep(.options) {
    grid-template-columns: 1fr;
  }
}
</style>
