<script setup lang="ts">
import {ref, defineProps, defineEmits, watch} from "vue";
import PdfIcon from "@/assets/images/pdf.png";
import WordIcon from "@/assets/images/word.png";
import ExcelIcon from "@/assets/images/excel.png";
import VideoIcon from "@/assets/images/video.png"; // Adjust the path as needed

// const props = defineProps<{ initialImages?: string[]; index?: number; label?: string }>()
const props = defineProps({
  accept: {
    type: String,
    default: "image/jp2, image/jpeg, image/jpg, image/png, image/webp",
  },
  initialImages: {
    type: Array,
    default: () => [],
  },
  initialFiles: {
    type: Array,
    default: () => [],
  },
  index: {
    type: Number,
    default: 0,
  },
  label: {
    type: String,
    default: "",
  },
  text: {
    type: String,
    default: "",
  },
  multiple: {
    type: Boolean,
    default: true,
  },
  icon: {
    type: [Object, Boolean],
    default: false,
  }
});
const emit = defineEmits<{
  (e: "update:images", files: File[], index?: number): void;
}>();

// Reactive variables to store image previews and file objects
const imagePreviews = ref([...props.initialImages]);

watch(
    () => props.initialImages,
    (newImages) => {
      imagePreviews.value = newImages;
    },
);
const imageFiles = ref<File[]>([]);

// Define file type icons
const placeholderIcons = {
  pdf: PdfIcon,
  word: WordIcon,
  excel: ExcelIcon,
  video: VideoIcon,
  generic: PdfIcon,
};

// Determine file type placeholder
function getPlaceholder(fileName: string, fileType?: string): string {
  const extension = fileName.split(".").pop()?.toLowerCase();
  if (fileType && fileType.startsWith("video/")) {
    return placeholderIcons.video;
  }
  switch (extension) {
    case "pdf":
      return placeholderIcons.pdf;
    case "doc":
    case "docx":
      return placeholderIcons.word;
    case "xls":
    case "xlsx":
      return placeholderIcons.excel;
    case "mp4":
    case "avi":
    case "mov":
    case "wmv":
    case "webm":
      return placeholderIcons.video;
    default:
      return placeholderIcons.generic;
  }
}

// Handle file changes
  function onFileChange(event: Event) {
    const files = (event.target as HTMLInputElement).files;

    if (files) {
      Array.from(files).forEach((file) => {
        const preview = file.type.startsWith("image/")
            ? URL.createObjectURL(file)
            : getPlaceholder(file.name);

        imagePreviews.value.push(preview);
        imageFiles.value.push(file);
      });
      // console.log("imageFiles.value", imageFiles.value);
      emit("update:images", imageFiles.value, props.index);
    }
  }

// Fallback for broken images
  function handleImageError(index: number) {
    imagePreviews.value[index] = placeholderIcons.generic;
  }

// Remove an image
  function removeImage(index: number) {
    imagePreviews.value.splice(index, 1);
    imageFiles.value.splice(index, 1);
    emit("update:images", imageFiles.value); // Emit updated file list
  }
</script>

<template>
  <div class="col-span-4 md:col-span-4 multi-image-uploader">
    <!-- Upload Button -->

    <div class="input-image">
      <span>{{ props.label }}</span>
      <label :for="`images${index}`" class="input-label-images">

        <component :is="props.icon"/>
        <span>
          {{ props.text || $t("max_file_upload") }}
        </span>
        <span>{{ $t("default_image_text") }}</span>
      </label>
      <input
          type="file"
          :accept="accept"
          :id="`images${index}`"
          class="input"
          :multiple="props.multiple"
          @change="onFileChange"
      />
    </div>

    <!-- Preview Images -->
    <div class="image-gallery" v-if="imagePreviews.length">
      <div
          class="image-item"
          v-for="(img, index) in imagePreviews"
          :key="index"
      >
        <img
            :src="img"
            @error="handleImageError(index)"
            alt="Previewed Image"
        />
        <button class="remove-btn" type="button" @click="removeImage(index)">
          <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
          >
            <path
                d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z"
                stroke="#B91F13"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
            />
            <path
                d="M9.16998 14.8299L14.83 9.16992"
                stroke="#B91F13"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
            />
            <path
                d="M14.83 14.8299L9.16998 9.16992"
                stroke="#B91F13"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
