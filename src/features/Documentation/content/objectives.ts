import type { FeatureGuide } from '../types'

export const objectivesGuide: FeatureGuide = {
  slug: 'objectives',
  navigationKey: 'objectives_guide',
  title: {
    en: 'Objectives & Progress',
    ar: 'الأهداف وتحديث التقدم',
  },
  summary: {
    en: 'Create a measurable objective, assign responsibility and save a reporting-period result.',
    ar: 'أنشئ هدفاً قابلاً للقياس وحدد المسؤولية واحفظ نتيجة لفترة التقرير.',
  },
  introduction: {
    en: 'Objectives describe the result you want to achieve; progress records describe what was actually achieved in a reporting period. Configure the measurement first, then enter the result in the same unit. The recording creates a company-wide Number / Increase objective with a target of 10 briefings, records a cumulative result of 3 for October 2026 and confirms 30% progress in its history.',
    ar: 'تصف الأهداف النتيجة المطلوبة وتوضح سجلات التقدم ما تحقق خلال فترة التقرير. جهز القياس أولاً ثم أدخل النتيجة بنفس الوحدة. ينشئ التسجيل هدفاً على مستوى الشركة من نوع عدد باتجاه زيادة ومستهدف 10 جلسات، ويسجل نتيجة تراكمية 3 لأكتوبر 2026 ويتحقق من تقدم 30٪ في السجل.',
  },
  startRoute: '/organization/objectives',
  actionLabel: {
    en: 'Open Objectives',
    ar: 'افتح الأهداف',
  },
  icon: 'crosshair',
  prerequisites: [
    {
      en: 'An agreed objective, year, measurement, responsible department and follow-up employee.',
      ar: 'هدف وسنة وقياس متفق عليها وقسم مسؤول وموظف للمتابعة.',
    },
    {
      en: 'Permission to create objectives and update progress, plus evidence for the result you report.',
      ar: 'صلاحية إنشاء الأهداف وتحديث تقدمها وأدلة النتيجة التي ستسجلها.',
    },
  ],
  steps: [
    {
      id: 'create',
      title: {
        en: 'Create and scope the objective',
        ar: 'أنشئ الهدف وحدد نطاقه',
      },
      summary: {
        en: 'Choose the year, project context and a clear statement.',
        ar: 'اختر السنة ونطاق المشروع واكتب هدفاً واضحاً.',
      },
      instructions: [
        {
          en: 'Open Objectives and choose Add Objectives. Select the year and describe a specific measurable outcome.',
          ar: 'افتح الأهداف واختر إضافة أهداف وحدد السنة واكتب نتيجة محددة قابلة للقياس.',
        },
        {
          en: 'Keep Company-wide for an organization goal or select a project for a project-specific goal.',
          ar: 'اختر على مستوى الشركة للهدف العام أو حدد المشروع للهدف الخاص به.',
        },
      ],
    },
    {
      id: 'measurement',
      title: {
        en: 'Choose the measurement model',
        ar: 'اختر نموذج القياس',
      },
      summary: {
        en: 'The target type controls the fields and result units.',
        ar: 'يحدد نوع المستهدف الحقول ووحدة النتيجة.',
      },
      instructions: [
        {
          en: 'Percentage: use Increase for a target percentage such as 80. For Decrease, enter the reduction percentage, baseline and applicable unit; a target of 20 means a 20% reduction from baseline.',
          ar: 'النسبة: استخدم زيادة لمستهدف نسبة مثل 80. في النقصان أدخل نسبة التخفيض وخط الأساس والوحدة؛ تعني 20 تخفيضاً قدره 20٪ من خط الأساس.',
        },
        {
          en: 'Number: set Increase or Decrease, a numeric target and unit. Decrease also requires a baseline. Keep the same unit when recording actual results.',
          ar: 'العدد: حدد زيادة أو نقصان والمستهدف والوحدة. يتطلب النقصان خط أساس أيضاً واستخدم نفس الوحدة عند تحديث الفعلي.',
        },
        {
          en: 'Periodic frequency: choose Annually, Semi-annually, Quarterly or Monthly. The form shows the planned annual occurrence count; progress records completed occurrences.',
          ar: 'التكرار الدوري: اختر سنوي أو نصف سنوي أو ربع سنوي أو شهري. يعرض النموذج عدد المرات السنوي المخطط ويسجل التقدم المرات المكتملة.',
        },
      ],
    },
    {
      id: 'owners',
      title: {
        en: 'Assign ownership and save',
        ar: 'حدد المسؤولية واحفظ',
      },
      summary: {
        en: 'Separate primary ownership from follow-up.',
        ar: 'حدد المسؤولية الأساسية والمتابعة.',
      },
      instructions: [
        {
          en: 'Choose the primary department and follow-up employee. Review the measurement summary and save. Save and New starts a separate objective after saving.',
          ar: 'اختر القسم المسؤول وموظف المتابعة وراجع ملخص القياس ثم احفظ. يبدأ حفظ وجديد هدفاً منفصلاً بعد الحفظ.',
        },
        {
          en: 'Open Objective Details to review the stored target, scope and responsibility. Editing the objective definition and updating progress are separate actions.',
          ar: 'افتح تفاصيل الهدف لمراجعة المستهدف والنطاق والمسؤولية. تعديل تعريف الهدف منفصل عن تحديث التقدم.',
        },
      ],
    },
    {
      id: 'progress',
      title: {
        en: 'Update a reporting period',
        ar: 'حدّث فترة التقرير',
      },
      summary: {
        en: 'Record the actual result, not a guessed progress percentage.',
        ar: 'سجل النتيجة الفعلية وليس نسبة تقدم تقديرية.',
      },
      instructions: [
        {
          en: 'Choose Update Progress. Select an available reporting period. Future periods are unavailable; already recorded periods may need the correction/edit action rather than a duplicate entry.',
          ar: 'اختر تحديث التقدم وحدد فترة متاحة. الفترات المستقبلية غير متاحة وقد تتطلب الفترة المسجلة تعديل السجل بدلاً من تكراره.',
        },
        {
          en: 'For Increase, enter the cumulative actual result. For Decrease, enter the current actual value. For Periodic frequency, select the completed occurrence count.',
          ar: 'للزيادة أدخل النتيجة الفعلية التراكمية وللنقصان القيمة الحالية وللتكرار الدوري عدد المرات المكتملة.',
        },
        {
          en: 'Add notes and evidence files where applicable, then choose Save Progress. In the example, 3 briefings against 10 produces 30%.',
          ar: 'أضف الملاحظات والأدلة عند الحاجة ثم احفظ التقدم. في المثال تحقق 3 جلسات من 10 نسبة 30٪.',
        },
      ],
    },
    {
      id: 'history',
      title: {
        en: 'Review progress and history',
        ar: 'راجع التقدم والسجل',
      },
      summary: {
        en: 'Check the latest value and its reporting period.',
        ar: 'راجع آخر نتيجة وفترتها.',
      },
      instructions: [
        {
          en: 'Confirm Latest Actual Result, Latest Progress Period and Progress on Objective Details. Read the history row for result, author, recorded date, notes and attachments.',
          ar: 'تحقق من آخر نتيجة وفترة ونسبة تقدم في التفاصيل ثم راجع صف السجل والنتيجة والمسجل والتاريخ والملاحظات والمرفقات.',
        },
        {
          en: 'Use a later period for a new cumulative result. Correct an inaccurate existing record through its available edit action; avoid adding the same cumulative value as an extra increment.',
          ar: 'استخدم فترة لاحقة للنتيجة التراكمية الجديدة وصحح السجل الخاطئ من التعديل المتاح. لا تعتبر القيمة التراكمية زيادة تضاف مرة أخرى.',
        },
      ],
    },
  ],
  afterSetup: [
    {
      title: {
        en: 'Consistent units',
        ar: 'وحدات متسقة',
      },
      description: {
        en: 'A target in briefings must be updated in briefings; a percentage target uses the percentage value rather than an employee count.',
        ar: 'يحدث مستهدف الجلسات بعدد الجلسات ومستهدف النسبة بقيمة النسبة وليس بعدد الموظفين.',
      },
    },
    {
      title: {
        en: 'Evidence and history',
        ar: 'الأدلة والسجل',
      },
      description: {
        en: 'Review period history to understand how the latest result was recorded and supported.',
        ar: 'راجع سجل الفترات لفهم كيفية تسجيل آخر نتيجة وأدلتها.',
      },
    },
  ],
  questions: [
    {
      question: {
        en: 'Why is a period disabled?',
        ar: 'لماذا الفترة غير متاحة؟',
      },
      answer: {
        en: 'It may be in the future or already recorded. Check the objective year, reporting period and saved history.',
        ar: 'قد تكون مستقبلية أو مسجلة مسبقاً؛ راجع سنة الهدف والفترة والسجل.',
      },
    },
    {
      question: {
        en: 'Should I type 30 for 3 of 10?',
        ar: 'هل أكتب 30 عند تحقيق 3 من 10؟',
      },
      answer: {
        en: 'For a Number target of 10, enter the actual count 3. The system derives the displayed 30% progress.',
        ar: 'لمستهدف عددي 10 أدخل الفعلي 3 ويحسب النظام نسبة التقدم 30٪.',
      },
    },
  ],
  recordings: [
    {
      id: 'objectives',
      title: {
        en: 'Objectives & Progress',
        ar: 'الأهداف وتحديث التقدم',
      },
      description: {
        en: 'Create a measurable objective, assign responsibility and save a reporting-period result.',
        ar: 'أنشئ هدفاً قابلاً للقياس وحدد المسؤولية واحفظ نتيجة لفترة التقرير.',
      },
      gif: '/documentation/objectives/objectives.gif',
      poster: '/documentation/objectives/objectives-poster.webp',
    },
  ],
}
