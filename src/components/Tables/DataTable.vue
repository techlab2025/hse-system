<script setup lang="ts">
import DropList from '@/shared/HelpersComponents/DropList.vue'
import ActionsIcon from '@/shared/icons/ActionsIcon.vue'
import EditIcon from '@/shared/icons/EditIcon.vue'
import SortIcon from '@/shared/icons/SortIcon.vue'
import TrashIcon from '@/shared/icons/TrashIcon.vue'
import { onMounted, ref } from 'vue'

const actionList = (id: number, deleteStudents: (id: number) => void) => [
  {
    text: 'Edit',
    icon: EditIcon,
    link: `/`,
  },
  {
    text: 'Delete',
    icon: TrashIcon,
    link: `/`,
  },
]

const items = ref([
  { id: 1, title: 'Math', phone: '12345', image: '/images/error.png' },
  { id: 2, title: 'Science', phone: '67890', image: '/images/error.png' },
  { id: 3, title: 'History', phone: '11111', image: '/images/error.png' },
  { id: 4, title: 'English', phone: '22222', image: '/images/error.png' },
  { id: 5, title: 'Biology', phone: '33333', image: '/images/error.png' },
])

const isReversed = ref(false)

const ReverseTable = () => {
  isReversed.value = !isReversed.value
  items.value.reverse()
}
</script>

<template>
  <div class="table-responsive">
    <table class="main-table w-full">
      <thead>
        <tr>
          <th scope="col" class="cursor-pointer flex align-center grp-[6px]" @click="ReverseTable">
            <span> name </span>
            <SortIcon />
          </th>
          <th scope="col">{{ $t('image') }}</th>
          <th scope="col">{{ $t('title') }}</th>
          <th scope="col">phone</th>
          <th scope="col">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item,index) in items" :key="item.id">
          <td data-label="#">
            <router-link :to="`/`">{{ index + 1 }}</router-link>
          </td>
          <td :data-label="$t('image')"><img src="@/assets/images/error.png" alt="image" /></td>
          <td :data-label="$t('title')">{{ item.title }}</td>
          <td :data-label="$t('payment_status')">{{ $t('free') }}</td>
          <td data-label="actions" class="cursor-pointer">
            <!-- <ActionsIcon /> -->
            <DropList :show-actions="true" :actionList="actionList(10, function () {})"> </DropList>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped></style>
