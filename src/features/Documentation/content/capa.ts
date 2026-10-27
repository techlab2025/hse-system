import type { FeatureGuide } from '../types'

export const capaGuide: FeatureGuide = {
  slug: 'capa',
  navigationKey: 'capa_guide',
  title: {
    en: 'CAPA',
    ar: 'الإجراءات التصحيحية والوقائية',
  },
  summary: {
    en: 'Follow corrective and preventive actions from their source through task status and effectiveness verification.',
    ar: 'تابع الإجراءات التصحيحية والوقائية من مصدرها إلى حالة التنفيذ والتحقق من الفاعلية.',
  },
  introduction: {
    en: 'CAPA brings together action plans from investigations and internal-audit NCRs. Each action has its own implementation status, owner and due date. The walkthrough opens the plan created by the demonstration investigation, changes a corrective task to In Progress and Completed, and saves an effectiveness review. Completing one action does not complete the other actions in the same plan.',
    ar: 'تجمع CAPA خطط إجراءات التحقيقات وحالات عدم المطابقة في التدقيق الداخلي. لكل إجراء حالة تنفيذ ومسؤول وتاريخ استحقاق. يفتح التسجيل خطة التحقيق التوضيحي ويغير الإجراء التصحيحي إلى قيد التنفيذ ثم مكتمل ويحفظ مراجعة الفاعلية. إكمال إجراء واحد لا يكمل بقية إجراءات الخطة.',
  },
  startRoute: '/organization/capa',
  actionLabel: {
    en: 'Open CAPA',
    ar: 'افتح الإجراءات',
  },
  icon: 'file-check-alt',
  prerequisites: [
    {
      en: 'An investigation or NCR with saved action items, and permission to view and update them.',
      ar: 'تحقيق أو حالة عدم مطابقة لها إجراءات محفوظة مع صلاحية عرضها وتحديثها.',
    },
    {
      en: 'Know the assigned employee, monitoring responsibility, due date and evidence before changing a task.',
      ar: 'راجع موظف التنفيذ ومسؤول المتابعة وتاريخ الاستحقاق والأدلة قبل تغيير الحالة.',
    },
  ],
  steps: [
    {
      id: 'source',
      title: {
        en: 'Find the correct plan',
        ar: 'اعثر على الخطة الصحيحة',
      },
      summary: {
        en: 'Use source and serial references to identify the plan.',
        ar: 'حدد الخطة من المصدر والأرقام المرجعية.',
      },
      instructions: [
        {
          en: 'Open CAPA. Use All, NCR or Investigation to narrow the source, together with the project filter where available.',
          ar: 'افتح CAPA واستخدم الكل أو عدم المطابقة أو التحقيق لتحديد المصدر مع فلتر المشروع عند توفره.',
        },
        {
          en: 'Match the CAPA serial to the incident, observation or NCR reference, then choose View CAPA Details. The source-details link opens the original record.',
          ar: 'طابق رقم CAPA مع مرجع الحادث أو الملاحظة أو عدم المطابقة ثم افتح التفاصيل. يفتح رابط تفاصيل المصدر السجل الأصلي.',
        },
      ],
    },
    {
      id: 'review',
      title: {
        en: 'Review responsibilities and dates',
        ar: 'راجع المسؤوليات والتواريخ',
      },
      summary: {
        en: 'Corrective and preventive actions are separate lists.',
        ar: 'التصحيحي والوقائي قائمتان منفصلتان.',
      },
      instructions: [
        {
          en: 'Read the full action, current status, due date, Assigned to and Responsible values. Corrective actions address the identified issue; preventive actions address recurrence.',
          ar: 'اقرأ الإجراء والحالة والاستحقاق وموظف التنفيذ والمسؤول. تعالج التصحيحية المشكلة المحددة وتستهدف الوقائية منع التكرار.',
        },
        {
          en: 'Check every action separately; do not infer completion from the investigation being closed.',
          ar: 'راجع كل إجراء منفرداً ولا تستنتج اكتماله من إغلاق التحقيق.',
        },
      ],
    },
    {
      id: 'status',
      title: {
        en: 'Change task status',
        ar: 'غيّر حالة الإجراء',
      },
      summary: {
        en: 'Save a status on the specific task card.',
        ar: 'احفظ الحالة في بطاقة الإجراء المقصود.',
      },
      instructions: [
        {
          en: 'Choose Change status, select In Progress and Save status when implementation begins. Reopen the dialog and choose Completed after implementation is finished.',
          ar: 'اختر تغيير الحالة ثم قيد التنفيذ واحفظ عند بدء العمل. أعد فتح النافذة واختر مكتمل بعد انتهاء التنفيذ.',
        },
        {
          en: 'Pending / On Hold and Cancelled require a reason. Overdue is displayed for late work but is not a selectable status in this dialog.',
          ar: 'يتطلب معلق أو ملغى سبباً. تظهر متأخر للأعمال المتأخرة لكنها ليست اختياراً يدوياً داخل هذه النافذة.',
        },
        {
          en: 'Confirm that the task card displays the saved state before leaving the page.',
          ar: 'تأكد أن بطاقة الإجراء تعرض الحالة المحفوظة قبل المغادرة.',
        },
      ],
    },
    {
      id: 'verify',
      title: {
        en: 'Verify effectiveness',
        ar: 'تحقق من الفاعلية',
      },
      summary: {
        en: 'Implementation and effectiveness answer different questions.',
        ar: 'التنفيذ والفاعلية مرحلتان مختلفتان.',
      },
      instructions: [
        {
          en: 'Choose Verify effectiveness on the completed action. Describe the verification methodology: what was checked, how, by whom, and which evidence was reviewed.',
          ar: 'اختر التحقق من الفاعلية للإجراء المكتمل واكتب المنهجية وما تمت مراجعته وكيف ومن راجعه والأدلة المستخدمة.',
        },
        {
          en: 'Record Result & findings, choose Effective or Ineffective, and Save verification. Use actual evidence for operational records. The recording uses clearly labelled simulated evidence.',
          ar: 'سجل النتائج واختر فعال أو غير فعال ثم احفظ التحقق. استخدم أدلة حقيقية للسجلات التشغيلية؛ يستخدم التسجيل مثالاً موضحاً أنه محاكاة.',
        },
      ],
    },
    {
      id: 'follow-up',
      title: {
        en: 'Review the whole plan',
        ar: 'راجع الخطة كاملة',
      },
      summary: {
        en: 'Keep remaining actions visible.',
        ar: 'تابع الإجراءات المتبقية.',
      },
      instructions: [
        {
          en: 'Return to the saved details and inspect the other corrective and preventive tasks. A completed corrective task can coexist with a preventive task that has not started.',
          ar: 'ارجع للتفاصيل وراجع بقية التصحيحية والوقائية. قد يكون التصحيحي مكتملاً بينما الوقائي لم يبدأ.',
        },
        {
          en: 'If the verification is ineffective, use your organization’s follow-up process to address the remaining cause and reassess the action.',
          ar: 'إذا كانت المراجعة غير فعالة فاتبع إجراء المؤسسة لمعالجة السبب المتبقي وإعادة تقييم الإجراء.',
        },
      ],
    },
  ],
  afterSetup: [
    {
      title: {
        en: 'Source traceability',
        ar: 'تتبع المصدر',
      },
      description: {
        en: 'Keep the CAPA, investigation and incident/NCR references together when reviewing the plan.',
        ar: 'احتفظ بمراجع CAPA والتحقيق والحادث أو عدم المطابقة معاً عند المراجعة.',
      },
    },
    {
      title: {
        en: 'Verification',
        ar: 'التحقق',
      },
      description: {
        en: 'Completed records implementation. Effective records the outcome of a separate evidence review.',
        ar: 'مكتمل تسجل التنفيذ وفعال تسجل نتيجة مراجعة أدلة مستقلة.',
      },
    },
  ],
  questions: [
    {
      question: {
        en: 'Where do CAPA tasks come from?',
        ar: 'من أين تأتي إجراءات CAPA؟',
      },
      answer: {
        en: 'They are entered in investigation action plans or internal-audit NCRs, then followed here.',
        ar: 'تُدخل في خطط التحقيق أو حالات عدم المطابقة ثم تتابع هنا.',
      },
    },
    {
      question: {
        en: 'Does changing one task update all tasks?',
        ar: 'هل يتغير الجميع بتغيير إجراء؟',
      },
      answer: {
        en: 'No. Change and verify each applicable action separately.',
        ar: 'لا؛ غيّر وتحقق من كل إجراء منطبق منفرداً.',
      },
    },
  ],
  recordings: [
    {
      id: 'capa',
      title: {
        en: 'CAPA',
        ar: 'الإجراءات التصحيحية والوقائية',
      },
      description: {
        en: 'Follow corrective and preventive actions from their source through task status and effectiveness verification.',
        ar: 'تابع الإجراءات التصحيحية والوقائية من مصدرها إلى حالة التنفيذ والتحقق من الفاعلية.',
      },
      gif: '/documentation/capa/capa.gif',
      poster: '/documentation/capa/capa-poster.webp',
    },
  ],
}
