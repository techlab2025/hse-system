import type { FeatureGuide } from '../types'

export const ppeDeliveryGuide: FeatureGuide = {
  slug: 'ppe-delivery',
  navigationKey: 'ppe_delivery_guide',
  title: {
    en: 'PPE Delivery',
    ar: 'تسليم معدات الوقاية',
  },
  summary: {
    en: 'Select an activity, add recipients, record the tools delivered and verify the PPE log.',
    ar: 'اختر النشاط وأضف المستلمين وسجل الأدوات المسلمة وتحقق من سجل الوقاية.',
  },
  introduction: {
    en: 'A PPE delivery records actual issues to named employees. It uses the tools configured for the selected activity in the company matrix. The walkthrough scopes a delivery to a project, location and zone, selects the demonstration activity and employee, records gloves and checks the saved log.',
    ar: 'يسجل تسليم الوقاية الأدوات المسلمة فعلياً لموظفين محددين باستخدام أدوات النشاط المجهزة في مصفوفة الشركة. يحدد التسجيل المشروع والموقع والمنطقة والنشاط والموظف التوضيحي ثم يسجل القفازات ويتحقق من السجل المحفوظ.',
  },
  startRoute: '/organization/ppe-delivery',
  actionLabel: {
    en: 'Open PPE Delivery',
    ar: 'افتح تسليم الوقاية',
  },
  icon: 'box',
  prerequisites: [
    {
      en: 'An activity linked to at least one PPE tool in the company matrix.',
      ar: 'نشاط مرتبط بأداة وقاية واحدة على الأقل في مصفوفة الشركة.',
    },
    {
      en: 'Active employee recipients and the details of the items actually issued.',
      ar: 'موظفون مستلمون نشطون وتفاصيل الأدوات التي تم تسليمها فعلياً.',
    },
  ],
  steps: [
    {
      id: 'scope',
      title: {
        en: 'Set delivery scope',
        ar: 'حدد نطاق التسليم',
      },
      summary: {
        en: 'Choose project context when applicable.',
        ar: 'اختر سياق المشروع عند الحاجة.',
      },
      instructions: [
        {
          en: 'Open New Delivery from PPE Matrix. Project is optional; use project, location and zone when the issue belongs to a specific work area. Work shift can also be selected.',
          ar: 'افتح تسليم جديد من المصفوفة. المشروع اختياري؛ حدد المشروع والموقع والمنطقة للتسليم المرتبط بمكان عمل محدد ويمكن اختيار الوردية.',
        },
      ],
    },
    {
      id: 'activity',
      title: {
        en: 'Select the activity',
        ar: 'اختر النشاط',
      },
      summary: {
        en: 'Activity controls which tools are available.',
        ar: 'يحدد النشاط الأدوات المتاحة.',
      },
      instructions: [
        {
          en: 'Select one activity. Its configured PPE tools load beneath it. If no tools appear, add the requirement in the company matrix first.',
          ar: 'اختر نشاطاً واحداً لتحميل أدواته. إذا لم تظهر أدوات فأضف متطلباتها في مصفوفة الشركة أولاً.',
        },
        {
          en: 'Changing activity clears the current recipients and tool selections; confirm the change only when you intend to rebuild the delivery.',
          ar: 'تغيير النشاط يمسح المستلمين واختيارات الأدوات الحالية؛ أكد التغيير عندما تريد إعادة تجهيز التسليم.',
        },
      ],
    },
    {
      id: 'recipients',
      title: {
        en: 'Add recipients',
        ar: 'أضف المستلمين',
      },
      summary: {
        en: 'Each employee becomes one row.',
        ar: 'يظهر كل موظف في صف.',
      },
      instructions: [
        {
          en: 'Select one or more employees. Review their names in the delivery matrix and remove an incorrect recipient.',
          ar: 'اختر موظفاً أو أكثر وراجع الأسماء داخل مصفوفة التسليم واحذف المستلم غير الصحيح.',
        },
        {
          en: 'Keep each employee only once. The same activity can be delivered to several employees in one save.',
          ar: 'أضف كل موظف مرة واحدة فقط ويمكن التسليم لعدة موظفين في حفظ واحد.',
        },
      ],
    },
    {
      id: 'tools',
      title: {
        en: 'Mark the delivered tools',
        ar: 'حدد الأدوات المسلمة',
      },
      summary: {
        en: 'Check the items for each individual recipient.',
        ar: 'حدد الأدوات لكل مستلم منفرداً.',
      },
      instructions: [
        {
          en: 'For each employee row, check only the tools actually delivered. Available columns are requirements; a delivery checkbox is an issue record.',
          ar: 'حدد لكل موظف الأدوات المسلمة فعلياً فقط. الأعمدة تعرض المتطلبات بينما مربع التسليم يسجل الاستلام.',
        },
        {
          en: 'Review the entire row before saving, especially when several tools or employees are present.',
          ar: 'راجع الصف كاملاً قبل الحفظ وخاصة عند وجود عدة أدوات أو موظفين.',
        },
      ],
    },
    {
      id: 'save',
      title: {
        en: 'Save and review the log',
        ar: 'احفظ وراجع السجل',
      },
      summary: {
        en: 'Confirm the issue is recorded.',
        ar: 'تحقق من تسجيل التسليم.',
      },
      instructions: [
        {
          en: 'Choose Save PPE delivery and wait for success. The recipient selections reset after saving; this is expected.',
          ar: 'اختر حفظ التسليم وانتظر النجاح. تُصفّر اختيارات المستلمين بعد الحفظ وهذا متوقع.',
        },
        {
          en: 'Open PPE log from the matrix. Find the employee and tool checkmark for the activity. The log can aggregate activities; use the shown activity names to interpret the table.',
          ar: 'افتح سجل الوقاية من المصفوفة وحدد الموظف وعلامة الأداة. قد يجمع السجل أنشطة متعددة فراجع أسماء الأنشطة المعروضة لتفسير الجدول.',
        },
      ],
    },
  ],
  afterSetup: [
    {
      title: {
        en: 'Requirement versus issue',
        ar: 'المتطلب والتسليم',
      },
      description: {
        en: 'Requirements are configured in the matrix. A delivery records what was handed to a person.',
        ar: 'تُجهز المتطلبات في المصفوفة ويسجل التسليم ما استلمه الشخص.',
      },
    },
    {
      title: {
        en: 'Check the log',
        ar: 'راجع السجل',
      },
      description: {
        en: 'A saved tool checkmark provides a quick view of recorded employee issues.',
        ar: 'تعرض علامة الأداة المحفوظة ملخصاً سريعاً لما تم تسجيل تسليمه للموظفين.',
      },
    },
  ],
  questions: [
    {
      question: {
        en: 'Why are no tools available?',
        ar: 'لماذا لا توجد أدوات؟',
      },
      answer: {
        en: 'The selected activity has no linked tools. Configure them in PPE Matrix, then reopen the delivery.',
        ar: 'لا توجد أدوات مرتبطة بالنشاط؛ جهزها في المصفوفة ثم أعد فتح التسليم.',
      },
    },
    {
      question: {
        en: 'Does selecting an employee issue every tool?',
        ar: 'هل اختيار الموظف يسلم كل الأدوات؟',
      },
      answer: {
        en: 'No. Check each tool actually issued in that employee’s row, then save.',
        ar: 'لا؛ حدد الأدوات المسلمة فعلياً في صف الموظف ثم احفظ.',
      },
    },
  ],
  recordings: [
    {
      id: 'ppe-delivery',
      title: {
        en: 'PPE Delivery',
        ar: 'تسليم معدات الوقاية',
      },
      description: {
        en: 'Select an activity, add recipients, record the tools delivered and verify the PPE log.',
        ar: 'اختر النشاط وأضف المستلمين وسجل الأدوات المسلمة وتحقق من سجل الوقاية.',
      },
      gif: '/documentation/ppe-delivery/ppe-delivery.gif',
      poster: '/documentation/ppe-delivery/ppe-delivery-poster.webp',
    },
  ],
}
