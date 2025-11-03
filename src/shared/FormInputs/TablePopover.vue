<script setup lang="ts">
import { ref, watch } from "vue";
import Popover from 'primevue/popover';
import wordSlice from "@/base/Presentation/utils/word_slice";
import DropIcon from "../icons/DropIcon.vue";
import { setDefaultImage } from '@/base/Presentation/utils/set_default_image.ts'

const op = ref();

const props = defineProps<{
  data?: { name: string }[]
  data_img?: { name: string, avatar: string }[]
}>()

const Data = ref(props.data)
const DataImg = ref(props.data_img)

const toggle = (event) => {
  op.value.toggle(event);
}

watch(() => props.data, (newVal) => {
  Data.value = newVal
})

watch(() => props.data_img, (newVal) => {
  DataImg.value = newVal
})

</script>

<template>

  <div class="popover-button" @click="toggle" v-if="data?.length > 0">
    <span v-if="Data && Data.length > 1" class="tag tag-more">
      {{ Data.length - 1 }}
    </span>
    <span class="tag tag-blue">
      {{wordSlice(Data.map((contractor) => contractor.name).join(', '), 10)}}
    </span>
    <DropIcon class="drop-icon" />
  </div>
  <div @click="toggle" class="popover-button" v-else>
    <img v-for="(supervisor, idx) in DataImg?.slice(0, 3)" :key="idx" :src="supervisor.avatar || '/default-avatar.png'"
      :alt="supervisor.name" class="avatar" @error="setDefaultImage" />
    <span v-if="DataImg && DataImg.length > 3" class="avatar-more">
      +{{ DataImg.length - 3 }}
    </span>
  </div>

  <Popover ref="op">
    <div class="popover-content" v-if="data?.length > 0">
      <p class="name" v-for="(name, index) in Data" :key="index">{{ name?.name }}</p>
    </div>
    <div class="popover-content" v-else>
      <div class="img-container" v-for="(name, index) in DataImg" :key="index">
        <img class="name" :src="name?.avatar || '/default-avatar.png'" :key="index" @error="setDefaultImage" />
        <p>{{ name?.name }}</p>
      </div>
    </div>
  </Popover>
</template>
