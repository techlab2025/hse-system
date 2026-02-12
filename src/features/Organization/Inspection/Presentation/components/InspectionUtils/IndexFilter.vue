  <script setup lang="ts">
  import type MyZonesModel from '@/features/Organization/ObservationFactory/Data/models/MyZonesModel'
  import IndexFilterIcon from '@/shared/icons/IndexFilterIcon.vue'
  import { ref } from 'vue'
  const emit = defineEmits(['update:data'])

  const props = defineProps<{
    filters: MyZonesModel[]
    link: string
    linkTitle: string
    SelectdProject: number[]
  }>()

  const SelectedFilter = ref<number[]>([])

  const UpdateData = (data: number) => {
    console.log(data, 'zonw dta')
    if (SelectedFilter.value.includes(data)) {
      SelectedFilter.value = SelectedFilter.value.filter((i) => i !== data)
      return
    }

    SelectedFilter.value.push(data)
    emit('update:data', SelectedFilter.value)
  }

</script>
  <template>
    <div class="idnex-filter">
      <div class="filter-container">
        <div class="filter"  :class="SelectedFilter.includes(item.id) ? 'active' : ''"
          v-for="item in filters" :key="item.id" @click="UpdateData(item.id)">
          <p v-if="item?.title != null">
            <span>
              {{ item?.title }}
            </span>
          </p>
        </div>
      </div>
      <div class="btns">
        <!-- <button class="btn btn-filter">
          <span>Filter</span>
          <IndexFilterIcon />
        </button> -->

        <router-link :to="link" v-if="link != ''">
          <button class="btn btn-primary">{{ linkTitle }}</button>
        </router-link>
      </div>
    </div>
  </template>
