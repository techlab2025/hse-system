import type { FeatureGuide } from '../types'

export const ppeMatrixGuide: FeatureGuide = {
  slug: 'ppe-matrix',
  navigationKey: 'ppe_matrix_guide',
  title: {
    en: 'PPE Matrix',
    ar: 'مصفوفة معدات الوقاية',
  },
  summary: {
    en: 'Define which PPE tools are required for each work activity and understand the link to deliveries.',
    ar: 'حدد أدوات الوقاية المطلوبة لكل نشاط وافهم ارتباطها بالتسليم.',
  },
  introduction: {
    en: 'The company PPE matrix maps activities in rows to PPE tools in columns. A checked intersection means the tool is required for that activity. This defines requirements; actual employee issues are recorded through New Delivery. The walkthrough adds a demonstration activity and links its glove requirement.',
    ar: 'تربط مصفوفة الشركة الأنشطة في الصفوف بأدوات الوقاية في الأعمدة. تعني علامة الاختيار أن الأداة مطلوبة للنشاط. تحدد المصفوفة المتطلبات بينما يسجل التسليم الفعلي للموظفين من تسليم جديد. يضيف التسجيل نشاطاً توضيحياً ويربطه بالقفازات.',
  },
  startRoute: '/organization/ppe-matrix',
  actionLabel: {
    en: 'Open PPE Matrix',
    ar: 'افتح مصفوفة الوقاية',
  },
  icon: 'shield-check',
  prerequisites: [
    {
      en: 'PPE activities and PPE tools configured in PPE Matrix settings.',
      ar: 'أنشطة وأدوات وقاية مجهزة في إعدادات مصفوفة الوقاية.',
    },
    {
      en: 'Approved activity requirements and permission to maintain the company matrix.',
      ar: 'متطلبات نشاط معتمدة وصلاحية تعديل مصفوفة الشركة.',
    },
  ],
  steps: [
    {
      id: 'read',
      title: {
        en: 'Read the matrix',
        ar: 'اقرأ المصفوفة',
      },
      summary: {
        en: 'Rows are activities; columns are tools.',
        ar: 'الصفوف أنشطة والأعمدة أدوات.',
      },
      instructions: [
        {
          en: 'Open PPE Matrix. Locate the activity row and the required tool column. Scroll horizontally if not all tools fit.',
          ar: 'افتح المصفوفة وحدد صف النشاط وعمود الأداة وحرك الجدول أفقياً لعرض بقية الأدوات.',
        },
        {
          en: 'A checked box indicates a saved requirement, not a record that someone received the item.',
          ar: 'تشير العلامة إلى متطلب محفوظ ولا تعني أن موظفاً استلم الأداة.',
        },
      ],
    },
    {
      id: 'activity',
      title: {
        en: 'Prepare a missing activity',
        ar: 'جهز النشاط الناقص',
      },
      summary: {
        en: 'Use the lookup settings when the activity is not listed.',
        ar: 'استخدم الإعدادات عندما لا يظهر النشاط.',
      },
      instructions: [
        {
          en: 'Open PPE Activities from PPE Matrix settings and choose Add PPE Activity. Enter the activity title and save.',
          ar: 'افتح أنشطة الوقاية من إعدادات المصفوفة واختر إضافة نشاط ثم اكتب العنوان واحفظ.',
        },
        {
          en: 'Return to the company matrix and locate the newly saved activity. Tools are maintained separately in PPE Tools settings.',
          ar: 'ارجع للمصفوفة وحدد النشاط الجديد. تُدار الأدوات بشكل منفصل في إعدادات أدوات الوقاية.',
        },
      ],
    },
    {
      id: 'requirements',
      title: {
        en: 'Save required tools',
        ar: 'احفظ الأدوات المطلوبة',
      },
      summary: {
        en: 'Each checkbox saves immediately.',
        ar: 'يُحفظ كل مربع اختيار فور تغييره.',
      },
      instructions: [
        {
          en: 'Check the intersection for each required tool. Wait for the update to finish before changing another checkbox.',
          ar: 'حدد تقاطع كل أداة مطلوبة وانتظر انتهاء الحفظ قبل تغيير مربع آخر.',
        },
        {
          en: 'Unchecking removes that requirement. Reopen the matrix to confirm the saved values when making important changes.',
          ar: 'إلغاء التحديد يزيل المتطلب. أعد فتح المصفوفة للتحقق من القيم المحفوظة عند إجراء تغييرات مهمة.',
        },
      ],
    },
    {
      id: 'delivery',
      title: {
        en: 'Use requirements for delivery',
        ar: 'استخدم المتطلبات للتسليم',
      },
      summary: {
        en: 'Open a separate employee delivery record.',
        ar: 'افتح سجل تسليم للموظفين.',
      },
      instructions: [
        {
          en: 'Choose New Delivery, select the activity and recipients, then check the tools actually handed to each employee. Follow the PPE Delivery guide for the full cycle.',
          ar: 'اختر تسليم جديد وحدد النشاط والمستلمين ثم الأدوات المسلمة فعلياً لكل موظف واتبع دليل التسليم للدورة كاملة.',
        },
        {
          en: 'Use PPE log to review recorded issues. Changing matrix requirements does not create a delivery.',
          ar: 'افتح سجل الوقاية لمراجعة التسليمات. تعديل متطلبات المصفوفة لا ينشئ عملية تسليم.',
        },
      ],
    },
  ],
  afterSetup: [
    {
      title: {
        en: 'Company requirements',
        ar: 'متطلبات الشركة',
      },
      description: {
        en: 'Maintain activity/tool requirements when work changes, using the approved PPE assessment.',
        ar: 'حدّث المتطلبات عند تغير العمل وفق تقييم الوقاية المعتمد.',
      },
    },
    {
      title: {
        en: 'Delivery records',
        ar: 'سجلات التسليم',
      },
      description: {
        en: 'The delivery matrix records the employee and the tools issued for the selected activity.',
        ar: 'تسجل مصفوفة التسليم الموظف والأدوات المسلمة للنشاط المحدد.',
      },
    },
  ],
  questions: [
    {
      question: {
        en: 'Why is an activity missing?',
        ar: 'لماذا لا يظهر نشاط؟',
      },
      answer: {
        en: 'Add it under PPE Activities, then reload the matrix. Confirm you have access to its lookup record.',
        ar: 'أضفه في أنشطة الوقاية ثم أعد تحميل المصفوفة وتحقق من صلاحية الوصول.',
      },
    },
    {
      question: {
        en: 'Is there a Save button?',
        ar: 'هل يوجد زر حفظ؟',
      },
      answer: {
        en: 'Each checkbox change is saved automatically. Wait for it to finish and check for an error message.',
        ar: 'يحفظ كل تغيير تلقائياً؛ انتظر اكتماله وتحقق من عدم ظهور خطأ.',
      },
    },
  ],
  recordings: [
    {
      id: 'ppe-matrix',
      title: {
        en: 'PPE Matrix',
        ar: 'مصفوفة معدات الوقاية',
      },
      description: {
        en: 'Define which PPE tools are required for each work activity and understand the link to deliveries.',
        ar: 'حدد أدوات الوقاية المطلوبة لكل نشاط وافهم ارتباطها بالتسليم.',
      },
      gif: '/documentation/ppe-matrix/ppe-matrix.gif',
      poster: '/documentation/ppe-matrix/ppe-matrix-poster.webp',
    },
  ],
}
