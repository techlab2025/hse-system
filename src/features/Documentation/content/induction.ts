import type { FeatureGuide } from '../types'

export const inductionGuide: FeatureGuide = {
  slug: 'induction',
  navigationKey: 'induction_guide',
  title: {
    en: 'Induction',
    ar: 'التدريب التعريفي',
  },
  summary: {
    en: 'Record the instructor, date, attendees, topics and supporting evidence, then review the saved induction.',
    ar: 'سجل المدرب والتاريخ والحضور والموضوعات والأدلة ثم راجع التدريب المحفوظ.',
  },
  introduction: {
    en: 'An induction records who attended a training session and what was covered. You can create a company-wide record or add a project, location and zone. The walkthrough selects an employee and adds a named visitor, chooses a PPE topic, saves the session and opens its overview.',
    ar: 'يسجل التدريب التعريفي الحضور والموضوعات المشروحة. يمكن إنشاء سجل على مستوى الشركة أو ربطه بمشروع وموقع ومنطقة. يختار التسجيل موظفاً ويضيف زائراً بالاسم ويحدد موضوع معدات الوقاية ثم يحفظ الجلسة ويفتح ملخصها.',
  },
  startRoute: '/organization/inductions',
  actionLabel: {
    en: 'Open Inductions',
    ar: 'افتح التدريب التعريفي',
  },
  icon: 'presentation',
  prerequisites: [
    {
      en: 'Active employee records for the instructor and staff attendees.',
      ar: 'سجلات موظفين نشطة للمدرب والحضور من الموظفين.',
    },
    {
      en: 'Training topics configured in Lookups, plus any evidence files you intend to attach.',
      ar: 'موضوعات تدريب مجهزة في القوائم وأي ملفات أدلة تريد إرفاقها.',
    },
  ],
  steps: [
    {
      id: 'start',
      title: {
        en: 'Start an induction',
        ar: 'ابدأ تدريباً تعريفياً',
      },
      summary: {
        en: 'Open the list and choose Add Induction.',
        ar: 'افتح القائمة واختر إضافة تدريب تعريفي.',
      },
      instructions: [
        {
          en: 'Check existing records first to avoid entering the same session twice. Choose Add Induction for a new session.',
          ar: 'راجع السجلات لتجنب تكرار الجلسة ثم اختر إضافة تدريب جديد.',
        },
      ],
    },
    {
      id: 'session',
      title: {
        en: 'Set instructor, date and scope',
        ar: 'حدد المدرب والتاريخ والنطاق',
      },
      summary: {
        en: 'Identify when and where the session took place.',
        ar: 'حدد موعد الجلسة ونطاقها.',
      },
      instructions: [
        {
          en: 'Select Instructor Name and the session Date.',
          ar: 'اختر اسم المدرب وتاريخ الجلسة.',
        },
        {
          en: 'Project is optional. If selected, choose the relevant location and zone when applicable. Leaving it empty creates a company-level record.',
          ar: 'المشروع اختياري. عند تحديده اختر الموقع والمنطقة المناسبين عند الحاجة. تركه فارغاً ينشئ سجلاً على مستوى الشركة.',
        },
      ],
    },
    {
      id: 'people',
      title: {
        en: 'Add employees and visitors',
        ar: 'أضف الموظفين والزوار',
      },
      summary: {
        en: 'Use employee records for staff and names for visitors.',
        ar: 'استخدم سجلات الموظفين للعاملين والأسماء للزوار.',
      },
      instructions: [
        {
          en: 'Select one or more employees in Add Employee. Review selected names before saving.',
          ar: 'اختر موظفاً أو أكثر في إضافة موظف وراجع الأسماء المختارة قبل الحفظ.',
        },
        {
          en: 'For an external attendee, enter Visitor name and press Add visitor. Remove an incorrect visitor chip before submission.',
          ar: 'للحضور الخارجي اكتب اسم الزائر واضغط إضافة زائر واحذف أي اسم خاطئ قبل الإرسال.',
        },
      ],
    },
    {
      id: 'topics',
      title: {
        en: 'Choose topics and attach evidence',
        ar: 'اختر الموضوعات وأرفق الأدلة',
      },
      summary: {
        en: 'Record the subjects actually covered.',
        ar: 'سجل الموضوعات التي تم شرحها فعلياً.',
      },
      instructions: [
        {
          en: 'Select the relevant Training Topic cards. Select All is useful only when the session covered every listed topic.',
          ar: 'اختر بطاقات موضوعات التدريب المنطبقة. استخدم تحديد الكل فقط إذا شملت الجلسة كل الموضوعات.',
        },
        {
          en: 'Attach attendance evidence or images if available. Respect the upload size/type limits shown by the form. Attachments are optional.',
          ar: 'أرفق أدلة الحضور أو الصور إن وجدت مع الالتزام بحدود الحجم والنوع المعروضة. المرفقات اختيارية.',
        },
      ],
    },
    {
      id: 'save',
      title: {
        en: 'Save and open the overview',
        ar: 'احفظ وافتح الملخص',
      },
      summary: {
        en: 'Check attendance and topics after saving.',
        ar: 'راجع الحضور والموضوعات بعد الحفظ.',
      },
      instructions: [
        {
          en: 'Choose Save to return to the list, or Save and New to save and start another session. Resolve any highlighted required fields.',
          ar: 'اختر حفظ للعودة للقائمة أو حفظ وجديد لحفظ الجلسة وبدء أخرى وأكمل الحقول المطلوبة المميزة.',
        },
        {
          en: 'Open the saved record. Review instructor, date, scope, training topics, employee and visitor attendees, and evidence. Print / Save PDF is available from this overview.',
          ar: 'افتح السجل وراجع المدرب والتاريخ والنطاق والموضوعات والموظفين والزوار والأدلة. تتوفر الطباعة أو الحفظ PDF من الملخص.',
        },
      ],
    },
  ],
  afterSetup: [
    {
      title: {
        en: 'Attendance history',
        ar: 'سجل الحضور',
      },
      description: {
        en: 'The saved overview preserves employee attendees and manually added visitors together.',
        ar: 'يحفظ الملخص حضور الموظفين والزوار المضافين يدوياً معاً.',
      },
    },
    {
      title: {
        en: 'Evidence',
        ar: 'الأدلة',
      },
      description: {
        en: 'A topic selection records what was taught; attachments can support attendance and training records.',
        ar: 'يسجل اختيار الموضوع ما تم شرحه ويمكن للمرفقات دعم سجلات الحضور والتدريب.',
      },
    },
  ],
  questions: [
    {
      question: {
        en: 'Must I select a project?',
        ar: 'هل يجب اختيار مشروع؟',
      },
      answer: {
        en: 'No. Project is optional; add it when the session belongs to a particular project.',
        ar: 'لا؛ المشروع اختياري ويُحدد عندما تخص الجلسة مشروعاً معيناً.',
      },
    },
    {
      question: {
        en: 'Can a visitor attend?',
        ar: 'هل يمكن إضافة زائر؟',
      },
      answer: {
        en: 'Yes. Enter a visitor name and click Add visitor; staff should be selected from employee records.',
        ar: 'نعم؛ اكتب اسم الزائر واضغط إضافة زائر واختر العاملين من سجلات الموظفين.',
      },
    },
  ],
  recordings: [
    {
      id: 'induction',
      title: {
        en: 'Induction',
        ar: 'التدريب التعريفي',
      },
      description: {
        en: 'Record the instructor, date, attendees, topics and supporting evidence, then review the saved induction.',
        ar: 'سجل المدرب والتاريخ والحضور والموضوعات والأدلة ثم راجع التدريب المحفوظ.',
      },
      gif: '/documentation/induction/induction.gif',
      poster: '/documentation/induction/induction-poster.webp',
    },
  ],
}
