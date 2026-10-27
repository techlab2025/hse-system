import { translate as localizeUi } from '@/localization/i18n'
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useSystemIdentity } from './useSystemIdentity'
import { exportBrandedPdf } from '@/shared/utils/exportBrandedPdf'

export function usePdfExport() {
  const route = useRoute()
  const user = useUserStore()
  const { identity, defaultIdentity } = useSystemIdentity()
  const isExporting = ref(false)
  const exportError = ref('')

  async function exportPdf(options: {
    targetSelector: string
    filename: string
    title?: string
    orientation?: 'portrait' | 'landscape'
    margin?: number
  }) {
    if (isExporting.value) return
    isExporting.value = true
    exportError.value = ''
    try {
      const target = document.querySelector<HTMLElement>(options.targetSelector)
      if (!target) throw new Error(localizeUi('No report content is available to export.'))
      const title =
        options.title ||
        target.dataset.pdfTitle ||
        target.querySelector('h1, h2')?.textContent?.trim() ||
        String(route.meta.breadcrumb || route.name || '') ||
        options.filename.replace(/\.pdf$/i, '').replace(/[-_]/g, ' ') ||
        'Report'
      await exportBrandedPdf({
        ...options,
        target,
        title,
        identity: identity.value.isActive ? identity.value : defaultIdentity.value,
        organization: user.user?.organizationName,
      })
    } catch (error) {
      exportError.value =
        error instanceof Error ? error.message : 'Unable to export the PDF. Please try again.'
      console.error('PDF export failed:', error)
    } finally {
      isExporting.value = false
    }
  }

  return { exportPdf, isExporting, exportError }
}
