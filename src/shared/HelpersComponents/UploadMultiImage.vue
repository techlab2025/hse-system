<script setup lang="ts">
import { ref } from 'vue'
import UploadImage from '@/shared/icons/UploadImage.vue'

const images = ref<string[]>([])

const handleUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (!target.files) return

  images.value = []

  Array.from(target.files).forEach((file) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      images.value.push(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  })
}

const handleOverlayClick = () => {
  console.log('Overlay clicked!')
}
</script>

<template>
  <div class="">
    <label v-if="images.length === 0" class="cursor-pointer inline-block">
      <UploadImage class="image-upload" />
      <input type="file" multiple accept="image/*" class="hidden" @change="handleUpload" />
    </label>

    <div v-if="images.length" class="grid grid-cols-2 gap-1 w-20">
      <div
        v-for="(img, i) in images.slice(0, 3)"
        :key="i"
        class="w-full h-full rounded-md overflow-hidden"
      >
        <img :src="img" class="w-full h-full object-cover" />
      </div>

      <div
        v-if="images.length >= 4"
        class="w-full h-full rounded-md overflow-hidden relative cursor-pointer"
        @click="handleOverlayClick"
      >
        <img :src="images[3]" class="w-full h-full object-cover" />

        <div
          class="absolute inset-0 bg-black/50 text-white flex items-center justify-center text-xl font-semibold"
        >
          +{{ images.length - 3 }}
        </div>
      </div>
    </div>
  </div>
</template>
