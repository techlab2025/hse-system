<script setup lang="ts">
import {
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from 'vue'

import lottie, {
  type AnimationConfigWithData,
  type AnimationItem,
} from 'lottie-web'

import newLoaderJson from '@/assets/lotties/newloader.json'

interface LoaderProps {
  visible?: boolean
  text?: string
  size?: number
  fullscreen?: boolean
}

const props = withDefaults(defineProps<LoaderProps>(), {
  visible: true,
  text: 'Loading...',
  size: 180,
  fullscreen: true,
})

const animationContainer = ref<HTMLElement | null>(null)

let animationInstance: AnimationItem | null = null
let componentMounted = false

/*
 * Some build configurations return JSON directly.
 * Others may wrap it inside a default property.
 */
const importedJson = newLoaderJson as unknown as {
  default?: AnimationConfigWithData<'svg'>['animationData']
}

const animationData =
  importedJson.default ??
  (newLoaderJson as AnimationConfigWithData<'svg'>['animationData'])

function destroyAnimation(): void {
  animationInstance?.destroy()
  animationInstance = null

  if (animationContainer.value) {
    animationContainer.value.innerHTML = ''
  }
}

async function createAnimation(): Promise<void> {
  await nextTick()

  if (!componentMounted || !props.visible) {
    return
  }

  if (!animationContainer.value) {
    console.error('Lottie container is not available.')
    return
  }

  destroyAnimation()

  try {
    /*
     * Lottie can modify parts of animationData internally.
     * Cloning prevents problems when the animation is recreated.
     */
    const clonedAnimationData = structuredClone(animationData)

    animationInstance = lottie.loadAnimation({
      container: animationContainer.value,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: clonedAnimationData,
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid meet',
      },
    })

    animationInstance.addEventListener('data_failed', () => {
      console.error('Lottie failed to load the animation data.')
    })
  } catch (error) {
    console.error('Unable to initialize Lottie loader:', error)
  }
}

onMounted(async () => {
  componentMounted = true

  if (props.visible) {
    await createAnimation()
  }
})

watch(
  () => props.visible,
  async visible => {
    if (!componentMounted) {
      return
    }

    if (visible) {
      await createAnimation()
    } else {
      destroyAnimation()
    }
  },
)

onBeforeUnmount(() => {
  componentMounted = false
  destroyAnimation()
})
</script>

<template>
  <Transition name="loader-fade">
    <div
      v-if="visible"
      class="app-loader"
      :class="{ 'app-loader--fullscreen': fullscreen }"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div class="app-loader__content">
        <div
          ref="animationContainer"
          class="app-loader__animation"
          :style="{
            width: `${size}px`,
            height: `${size}px`,
          }"
        />

        <p v-if="text" class="app-loader__text">
          {{ text }}
        </p>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.app-loader {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
}

.app-loader--fullscreen {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgb(255 255 255 / 88%);
  backdrop-filter: blur(4px);
}

.app-loader__content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.app-loader__animation {
  display: block;
  overflow: hidden;
}

.app-loader__animation :deep(svg) {
  display: block;
  width: 100% !important;
  height: 100% !important;
}

.app-loader__text {
  margin: 12px 0 0;
  color: #475569;
  font-size: 14px;
  font-weight: 500;
}

.loader-fade-enter-active,
.loader-fade-leave-active {
  transition: opacity 200ms ease;
}

.loader-fade-enter-from,
.loader-fade-leave-to {
  opacity: 0;
}
</style>