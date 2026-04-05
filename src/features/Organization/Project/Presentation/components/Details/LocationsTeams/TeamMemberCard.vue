<script setup lang="ts">
import person from '@/assets/images/person.png'
import { setDefaultImage } from '@/base/Presentation/utils/set_default_image'
import wordSlice from '@/base/Presentation/utils/word_slice'
import DeleteEmployeeDialog from './DeleteEmployeeDialog.vue'
import type OrganizatoinEmployeeDetailsModel from '@/features/Organization/OrganizationEmployee/Data/models/OrganizatoinEmployeeDetailsModel'
import type ProjectLocationEmployeeModel from '@/features/Organization/Project/Data/models/CustomLocation/ProjectLocationEmployeeModel'

const emit = defineEmits(['update:data'])

const { member } = defineProps<{
  // member: ProjectLocationEmployeeModel
  member: OrganizatoinEmployeeDetailsModel |ProjectLocationEmployeeModel
}>()

const UpdateData = (id: number) => {
  console.log(id, 'id')
  emit('update:data', id)
}
</script>
<template>
  <!-- {{ member }} -->
  <div class="member-card">
    <DeleteEmployeeDialog
      @delete="
        UpdateData(
          member?.projectLocationHierarchyEmployeeId! || member?.projectLocationTeamEmployeeId!,
        )
      "
    />
    <img
      class="member-img"
      :src="member?.image || person"
      @error="setDefaultImage"
      :alt="member.name"
    />
    <div class="member-data">
      <p class="name">{{ wordSlice(member?.name, 18) }}</p>
      <p class="position" v-if="member.hierarchy?.length > 0">
        {{ member.hierarchy?.map((p) => p.title).join(', ') }}
      </p>
    </div>
  </div>
</template>
