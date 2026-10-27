import type { FeatureGuide } from './types'
import { projectGuide } from './content/project'
import { equipmentGuide } from './content/equipment'
import { employeeGuide } from './content/employee'
import { observationGuide } from './content/observation'
import { incidentGuide } from './content/incident'
import { inspectionGuide } from './content/inspection'
import { investigationGuide } from './content/investigation'
import { capaGuide } from './content/capa'
import { inductionGuide } from './content/induction'
import { ppeMatrixGuide } from './content/ppe-matrix'
import { ppeDeliveryGuide } from './content/ppe-delivery'
import { objectivesGuide } from './content/objectives'
import { internalAuditGuide } from './content/internal-audit'
export type { FeatureGuide, GuideRecording, GuideStep, GuideText } from './types'

export const featureGuides: FeatureGuide[] = [
  projectGuide,
  equipmentGuide,
  employeeGuide,
  observationGuide,
  incidentGuide,
  inspectionGuide,
  investigationGuide,
  capaGuide,
  inductionGuide,
  ppeMatrixGuide,
  ppeDeliveryGuide,
  objectivesGuide,
  internalAuditGuide,
]

export const documentationLabels = {
  en: {
    title: 'Documentation',
    eyebrow: 'Your workspace guide',
    introduction: 'Clear, practical guides for the features you use every day.',
    available: 'Available guides',
    openGuide: 'Open guide',
    allGuides: 'All guides',
    before: 'Before you begin',
    watch: 'Watch the walkthrough',
    play: 'Play walkthrough GIF',
    stop: 'Stop animation',
    download: 'Download GIF',
    steps: 'Guide steps',
    after: 'After setup',
    questions: 'Common questions',
    next: 'More feature guides will be added here.',
    notFound: 'This guide is not available yet.',
    step: 'Step',
    of: 'of',
    contents: 'On this page',
    back: 'Back to documentation',
  },
  ar: {
    title: 'التوثيق',
    eyebrow: 'دليل مساحة العمل',
    introduction: 'أدلة واضحة وعملية للميزات التي تستخدمها يومياً.',
    available: 'الأدلة المتاحة',
    openGuide: 'افتح الدليل',
    allGuides: 'جميع الأدلة',
    before: 'قبل البدء',
    watch: 'شاهد الشرح العملي',
    play: 'تشغيل الشرح بصيغة GIF',
    stop: 'إيقاف الحركة',
    download: 'تنزيل GIF',
    steps: 'خطوات الدليل',
    after: 'بعد الإعداد',
    questions: 'أسئلة شائعة',
    next: 'ستُضاف أدلة لميزات أخرى هنا.',
    notFound: 'هذا الدليل غير متاح حالياً.',
    step: 'الخطوة',
    of: 'من',
    contents: 'في هذه الصفحة',
    back: 'العودة إلى التوثيق',
  },
}
