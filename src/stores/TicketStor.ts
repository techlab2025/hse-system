import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useTicketStore = defineStore(
  'Ticket',
  () => {
    const capturedImage = ref<string | null>(null)
    const OpenTicketDialog = ref<boolean>(false)

    const captureScreen = async () => {
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia({ preferCurrentTab: true })
        const video = document.createElement('video')

        video.srcObject = stream
        video.play()

        video.onloadedmetadata = () => {
          const canvas = document.createElement('canvas')
          canvas.width = video.videoWidth
          canvas.height = video.videoHeight

          const ctx = canvas.getContext('2d')
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

          const image = canvas.toDataURL('image/png')
          // saveImage(image, 'screenshot.png')
          capturedImage.value = image
          OpenTicketDialog.value = true
          stream.getTracks().forEach((track) => track.stop())
        }
      } catch (err) {
        console.error('Error: ' + err)
      }
    }
    return {
      capturedImage,
      captureScreen,
      OpenTicketDialog
    }
  },
  {
    persist: {
      enabled: true,
    },
  },
)
