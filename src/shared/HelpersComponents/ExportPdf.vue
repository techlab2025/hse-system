<script setup lang="ts">
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas-pro'
import PdefActionIcon from '../icons/PdefActionIcon.vue'

const props = withDefaults(
  defineProps<{
    isDropList?: boolean
    targetSelector?: string
    filename?: string
  }>(),
  {
    targetSelector: '.table-responsive',
    filename: 'export.pdf',
  },
)

const exportPDF = async () => {
  const exportElement = document.querySelector<HTMLElement>(props.targetSelector)

  if (!exportElement) {
    console.error(`PDF export element not found: ${props.targetSelector}`)

    return
  }

  try {
    const canvas = await html2canvas(exportElement, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
    })

    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
    })

    const pageMargin = 5
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfPageHeight = pdf.internal.pageSize.getHeight()
    const imageWidth = pdfWidth - pageMargin * 2
    const imageHeight = (canvas.height * imageWidth) / canvas.width
    const printablePageHeight = pdfPageHeight - pageMargin * 2

    let renderedHeight = 0
    pdf.addImage(imgData, 'PNG', pageMargin, pageMargin, imageWidth, imageHeight)

    while (imageHeight - renderedHeight > printablePageHeight) {
      renderedHeight += printablePageHeight
      pdf.addPage()
      pdf.addImage(imgData, 'PNG', pageMargin, pageMargin - renderedHeight, imageWidth, imageHeight)
    }

    pdf.save(props.filename)
  } catch (error) {
    console.error('Error generating PDF:', error)
  }
}
</script>

<template>
  <button
    :class="isDropList ? 'export-pdf-btn ms-2' : 'btn btn-secondary'"
    type="button"
    @click="exportPDF"
  >
    <PdefActionIcon v-if="isDropList" />
    Export to PDF
  </button>
</template>

<style scoped>
.export-pdf-btn {
  font-family: 'Regular';
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin-bottom: 5px;
  margin-top: 5px;
  transition: linear all 0.3s;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  border-radius: 5px;
  background-color: color-mix(in srgb, var(--main-border) 5.88%, transparent);
  color: var(--text-soft);
  border: none !important;
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 10px 12px;
  border-radius: 8px;

  &:hover {
    background-color: color-mix(in srgb, var(--status-danger) 5.88%, transparent);
  }
}
</style>
