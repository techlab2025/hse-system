<script setup lang="ts">
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import ExportIcon from '@/shared/icons/ExportIcon.vue'
import PdefActionIcon from '../icons/PdefActionIcon.vue'

const props = defineProps<{ isDropList?: boolean }>()
const exportPDF = async () => {
  const tableElement = document.querySelector('.table-responsive')

  if (!tableElement) {
    console.error('Table element not found.')

    return
  }

  try {
    // Capture the table as an image
    const canvas = await html2canvas(tableElement, {
      scale: 2, // Higher scale for better resolution
    })

    const imgData = canvas.toDataURL('image/png')

    // Initialize jsPDF
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
    })

    // Calculate dimensions
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width

    // Add image to PDF
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)

    // Save the PDF
    pdf.save('table.pdf')
  } catch (error) {
    console.error('Error generating PDF:', error)
  }
}
</script>

<template>
  <button :class="isDropList ? 'export-pdf-btn ms-2' : 'btn btn-secondary'" type="button" @click="exportPDF">
    <PdefActionIcon />
    Export PDF
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
  background-color: #c4c4c40f;
  color: #575b71;
  border: none !important;
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 10px 12px;
  border-radius: 8px;

  &:hover {
    background-color: #ff1d1d0f;
  }

}
</style>
