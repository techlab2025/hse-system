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
  //     PermissionsEnum.TEMPLATE_ITEM_UPDATE,
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
  emit("update:data")
}
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
      <div class="template-document-content" v-for="(item, index) in allData?.templateItems" :key="index">

        <div class="actions"
          v-if="(!route.path.includes('equipment-show') && !route.path.includes('template-item')) && isActions">
          <DropList :actionList="actionList(item.id, DeleteTemplateItem)" @delete="DeleteTemplateItem(item.id)" />
        </div>

        <TemplateDocumentCheckboxShow v-if="item?.action == ActionsEnum.CHECKBOX" :key="index" :title="item.name"
          :options="item.options" :require_image="item.requiredImage" :has_textarea="item.has_textarea"
          :tag="item.tag" />
        <TemplateDocumentRadioButtonShow v-if="item?.action == ActionsEnum.RADIOBUTTON" :title="item.name"
          :options="item.options" :require_image="item.requiredImage" :has_textarea="item.has_textarea"
          :tag="item.tag" />
        <TemplateDocumentSelectShow v-if="item?.action == ActionsEnum.DROPDOWN" :title="item.name" :key="index"
          :options="item.options" :require_image="item.requiredImage" :has_textarea="item.has_textarea"
          :tag="item.tag" />
        <TemplateDocumentTextAreaShow v-if="item?.action == ActionsEnum.TEXTAREA" :title="item.name"
          :require_image="item.requiredImage" :tag="item.tag" />

      </div>
    </div>
    <!-- <DeleteItemDialog @update:data="DeleteTemplateItem(item?.id)" /> -->

  </div>
</template>


