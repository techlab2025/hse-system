import type { FeatureGuide } from '../types'

export const inspectionGuide: FeatureGuide = {
  slug: 'inspection',
  navigationKey: 'inspection_guide',
  icon: 'clipboard-notes',
  title: {
    en: 'Inspections',
    ar: 'التفتيش',
  },
  summary: {
    en: 'Assign an employee inspection, choose a checklist, and understand equipment, zone, and recurring schedules.',
    ar: 'عيّن تفتيشاً لموظف واختر قائمة الفحص وافهم مسارات المعدات والمناطق والجداول المتكررة.',
  },
  introduction: {
    en: 'An inspection is a scheduled checklist task. Choose its assignment target, the checklist to complete, and when it should run. The walkthrough starts with Employee, selects a project and zone, assigns an employee, and saves an AD-HOC inspection. The sections below explain every assignment and scheduling mode so you can choose the correct setup before saving.',
    ar: 'التفتيش مهمة قائمة فحص مجدولة. حدد هدف التعيين وقائمة الفحص وموعد التنفيذ. يبدأ التسجيل بمسار الموظف ويختار المشروع والمنطقة والموظف ثم يحفظ تفتيشاً لمرة واحدة. توضح الأقسام التالية جميع مسارات التعيين والجدولة لاختيار الإعداد الصحيح قبل الحفظ.',
  },
  startRoute: '/organization/equipment-mangement/inspection?inspectionType=1',
  actionLabel: {
    en: 'Open Inspections',
    ar: 'افتح التفتيش',
  },
  recordings: [
    {
      id: 'inspection',
      title: {
        en: 'Employee inspection',
        ar: 'تفتيش الموظف',
      },
      description: {
        en: 'Create a one-time employee inspection, review its assignment and checklist, and open the saved task.',
        ar: 'أنشئ تفتيشاً لموظف لمرة واحدة وراجع التعيين وقائمة الفحص ثم افتح المهمة المحفوظة.',
      },
      gif: '/documentation/inspection/inspection.gif',
      poster: '/documentation/inspection/inspection-poster.webp',
    },
  ],
  prerequisites: [
    {
      en: 'Permission to create inspections and access the intended project.',
      ar: 'صلاحية إنشاء التفتيش والوصول للمشروع المطلوب.',
    },
    {
      en: 'For Employee: a project zone with an assigned employee. For Machine: an equipment record. For Zone: project zones prepared in project setup.',
      ar: 'للموظف: منطقة مشروع بها موظف معيّن. للمعدة: سجل معدة. للمنطقة: مناطق مشروع جاهزة في إعداد المشروع.',
    },
    {
      en: 'A suitable checklist in System Templates or My Templates, or permission to create a new template.',
      ar: 'قائمة فحص مناسبة في قوالب النظام أو قوالبي، أو صلاحية إنشاء قالب جديد.',
    },
  ],
  steps: [
    {
      id: 'inspection-start',
      title: {
        en: 'Start with Employee',
        ar: 'ابدأ بمسار الموظف',
      },
      summary: {
        en: 'Create the inspection in its project context.',
        ar: 'أنشئ التفتيش في سياق المشروع الصحيح.',
      },
      instructions: [
        {
          en: 'Open Inspections and choose New Inspection. Keep the automatic serial, or enter a unique serial when manual numbering is enabled.',
          ar: 'افتح التفتيش واختر تفتيشاً جديداً. اترك الرقم التسلسلي التلقائي أو أدخل رقماً فريداً عند تفعيل الترقيم اليدوي.',
        },
        {
          en: 'Choose Employee under Assignment Target. Select the project, then its zone, then the employee assigned to that zone.',
          ar: 'اختر الموظف ضمن هدف التعيين ثم اختر المشروع ومنطقته والموظف المعيّن لهذه المنطقة.',
        },
        {
          en: 'Use the optional Equipment field when the employee task concerns a specific asset. An employee assignment and its optional equipment reference are different fields.',
          ar: 'استخدم حقل المعدات الاختياري عندما تتعلق مهمة الموظف بمعدة محددة. تعيين الموظف ومرجع المعدة الاختياري حقلان مختلفان.',
        },
      ],
    },
    {
      id: 'inspection-template',
      title: {
        en: 'Choose the checklist',
        ar: 'اختر قائمة الفحص',
      },
      summary: {
        en: 'The template defines what will be checked.',
        ar: 'يحدد القالب البنود التي ستُفحص.',
      },
      instructions: [
        {
          en: 'Open Select Inspection Template. Switch between System Templates and My Templates, review the checklist items, select the matching card, and Confirm.',
          ar: 'افتح اختيار قالب التفتيش وبدّل بين قوالب النظام وقوالبي وراجع البنود ثم اختر البطاقة المناسبة وأكد الاختيار.',
        },
        {
          en: 'If no existing checklist fits, use New Template. Enter its name and checklist items; choose whether to use it once or save it to your collection where offered.',
          ar: 'إذا لم تتوفر قائمة مناسبة فاستخدم قالباً جديداً وأدخل الاسم والبنود ثم اختر استخدامها مرة واحدة أو حفظها في مجموعتك عند توفر الخيار.',
        },
        {
          en: 'Check the selected-template summary before continuing. The assignment target does not replace the need to choose a template.',
          ar: 'راجع ملخص القالب المحدد قبل المتابعة. اختيار هدف التعيين لا يغني عن اختيار القالب.',
        },
      ],
    },
    {
      id: 'inspection-once',
      title: {
        en: 'AD-HOC: one inspection date',
        ar: 'تفتيش لمرة واحدة',
      },
      summary: {
        en: 'Use this for a single scheduled occurrence.',
        ar: 'استخدمه لموعد تنفيذ واحد.',
      },
      instructions: [
        {
          en: 'Choose AD-HOC under Inspection Frequency and set Select Day to the required execution date.',
          ar: 'اختر لمرة واحدة ضمن تكرار التفتيش وحدد يوم التنفيذ المطلوب.',
        },
        {
          en: 'This is the path saved in the walkthrough. Review project, zone, employee, template, and date together before saving.',
          ar: 'هذا هو المسار المحفوظ في التسجيل. راجع المشروع والمنطقة والموظف والقالب والتاريخ معاً قبل الحفظ.',
        },
      ],
    },
    {
      id: 'inspection-periods',
      title: {
        en: 'Periodic: all repetition modes',
        ar: 'التفتيش الدوري وجميع أنماط التكرار',
      },
      summary: {
        en: 'Choose the repetition rule and its start date.',
        ar: 'اختر قاعدة التكرار وتاريخ بدايتها.',
      },
      instructions: [
        {
          en: 'Daily: choose Periodic → daily and set From Date. This uses the daily recurrence rule rather than a list of separate dates.',
          ar: 'يومياً: اختر دوري ثم يومي وحدد تاريخ البداية. يستخدم هذا قاعدة التكرار اليومي بدلاً من قائمة تواريخ منفصلة.',
        },
        {
          en: 'Choose day: select one or more weekdays, such as Monday and Thursday, then set From Date. These are days of the week.',
          ar: 'اختيار يوم: حدد يوماً أو أكثر من أيام الأسبوع مثل الاثنين والخميس ثم تاريخ البداية. هذه أيام أسبوعية.',
        },
        {
          en: 'Choose date: select one or more day numbers from 1–31, such as 1 and 15, then set From Date. These are numbered days within a month, not complete calendar dates.',
          ar: 'اختيار تاريخ: حدد رقماً أو أكثر من 1 إلى 31 مثل 1 و15 ثم تاريخ البداية. هذه أرقام أيام داخل الشهر وليست تواريخ تقويمية كاملة.',
        },
        {
          en: 'Custom date: use the multiple-date calendar to choose the specific calendar dates required, then review From Date.',
          ar: 'تواريخ مخصصة: استخدم التقويم متعدد الاختيارات لتحديد التواريخ التقويمية المطلوبة ثم راجع تاريخ البداية.',
        },
        {
          en: 'Set Period: choose Day, Week, Month, or Year, enter the interval, and set From Date. For example, 2 with Week means a two-week interval. Use the supported range shown in the interval field.',
          ar: 'تحديد فترة: اختر يوم أو أسبوع أو شهر أو سنة وأدخل الفاصل وحدد البداية. مثلاً الرقم 2 مع أسبوع يعني فاصلاً قدره أسبوعان. التزم بالنطاق المدعوم المعروض بالحقل.',
        },
      ],
      note: {
        en: 'Changing the frequency or period mode clears fields that belong to the previous mode. Recheck the visible dates and selections after switching.',
        ar: 'يؤدي تغيير التكرار أو نمط الفترة إلى مسح حقول النمط السابق؛ راجع التواريخ والاختيارات الظاهرة بعد التغيير.',
      },
    },
    {
      id: 'inspection-other-targets',
      title: {
        en: 'Equipment and zone cases',
        ar: 'حالات المعدات والمناطق',
      },
      summary: {
        en: 'Use the same checklist and scheduling process with another target.',
        ar: 'استخدم عملية القالب والجدولة نفسها مع هدف آخر.',
      },
      instructions: [
        {
          en: 'Machine: choose Machine and select the equipment record. Review its model or serial to avoid assigning the task to a similarly named asset. Then choose its checklist and schedule.',
          ar: 'المعدة: اختر المعدة وحدد سجلها وراجع الموديل أو الرقم التسلسلي لتجنب الالتباس بين المعدات المتشابهة ثم اختر القالب والجدول.',
        },
        {
          en: 'Zone: choose Zone, then select the project and work zone. Add the optional equipment reference when applicable, then select the checklist and schedule.',
          ar: 'المنطقة: اختر المنطقة ثم المشروع ومنطقة العمل. أضف مرجع المعدة الاختياري عند الحاجة ثم حدد القالب والجدول.',
        },
        {
          en: 'When switching target types, review all target fields again. A previously selected employee or equipment does not automatically describe the newly selected target.',
          ar: 'عند تبديل نوع الهدف راجع جميع حقول التعيين مجدداً؛ الموظف أو المعدة المختاران سابقاً لا يصفان الهدف الجديد تلقائياً.',
        },
      ],
    },
    {
      id: 'inspection-save',
      title: {
        en: 'Save and review the task',
        ar: 'احفظ وراجع المهمة',
      },
      summary: {
        en: 'Verify the saved assignment and schedule.',
        ar: 'تحقق من التعيين والجدول المحفوظين.',
      },
      instructions: [
        {
          en: 'Select Save to create the inspection, or Save and New to create it and start another. Correct highlighted validation fields before retrying.',
          ar: 'اختر حفظ لإنشاء التفتيش أو حفظ وجديد لإنشائه وبدء آخر، وصحح حقول التحقق المحددة قبل إعادة المحاولة.',
        },
        {
          en: 'Find the new card in All Tasks. Confirm Assigned To, template, frequency, and start date. The card shows the assignment and schedule. Show Task previews checklist questions. Details opens the inspection result history, which can be empty before the first submission. Neither action alone submits a result.',
          ar: 'ابحث عن البطاقة الجديدة في جميع المهام وراجع المعيّن إليه والقالب والتكرار والبداية. تعرض البطاقة التعيين والجدول. يعاين عرض المهمة أسئلة القائمة وتفتح التفاصيل سجل النتائج الذي قد يكون فارغاً قبل أول إرسال. لا يرسل أي من الإجراءين نتيجة بمفرده.',
        },
        {
          en: 'When completing an inspection, answer each applicable checklist item and add notes or evidence requested by the template. Submit only after reviewing the answers.',
          ar: 'عند تنفيذ التفتيش أجب عن بنود قائمة الفحص المنطبقة وأضف الملاحظات أو الأدلة التي يطلبها القالب ثم راجع الإجابات قبل إرسالها.',
        },
      ],
    },
  ],
  afterSetup: [
    {
      title: {
        en: 'All, My, and Submitted tasks',
        ar: 'جميع المهام ومهامي والمهام المرسلة',
      },
      description: {
        en: 'All Tasks shows the available inspection register. My Tasks narrows work assigned to the current user. Submitted Tasks shows completed submissions. Permissions and project filters affect what appears.',
        ar: 'تعرض جميع المهام سجل التفتيش المتاح وتحدد مهامي أعمال المستخدم الحالي وتعرض المرسلة النتائج المكتملة. تؤثر الصلاحيات وفلاتر المشروع في المعروض.',
      },
    },
    {
      title: {
        en: 'Read the saved schedule',
        ar: 'قراءة الجدول المحفوظ',
      },
      description: {
        en: 'A one-time task shows its execution date. A periodic task shows its repetition rule and start date. Review these before relying on the task for daily operations.',
        ar: 'تعرض مهمة المرة الواحدة تاريخ التنفيذ وتعرض الدورية قاعدة التكرار والبداية. راجعها قبل الاعتماد على المهمة في التشغيل اليومي.',
      },
    },
    {
      title: {
        en: 'Inspection results',
        ar: 'نتائج التفتيش',
      },
      description: {
        en: 'Open the available task/result actions to review answers, findings, attachments, and the submission date. A saved schedule is not itself proof that an inspection has been completed.',
        ar: 'افتح إجراءات المهمة أو النتائج لمراجعة الإجابات والنتائج والمرفقات وتاريخ الإرسال. حفظ الجدول لا يعني تنفيذ التفتيش بالفعل.',
      },
    },
  ],
  questions: [
    {
      question: {
        en: 'Why is the employee list empty?',
        ar: 'لماذا قائمة الموظفين فارغة؟',
      },
      answer: {
        en: 'Select the correct project and zone. The employee must be assigned to that project zone through project setup or resource management.',
        ar: 'اختر المشروع والمنطقة الصحيحين. يجب تعيين الموظف لمنطقة المشروع من إعداد المشروع أو إدارة موارده.',
      },
    },
    {
      question: {
        en: 'What is the difference between Choose date and Custom date?',
        ar: 'ما الفرق بين اختيار تاريخ وتواريخ مخصصة؟',
      },
      answer: {
        en: 'Choose date uses month-day numbers such as 1 and 15. Custom date uses complete dates selected in a calendar.',
        ar: 'يستخدم اختيار تاريخ أرقام أيام الشهر مثل 1 و15 بينما تستخدم التواريخ المخصصة تواريخ كاملة من التقويم.',
      },
    },
    {
      question: {
        en: 'Does AD-HOC repeat?',
        ar: 'هل يتكرر التفتيش لمرة واحدة؟',
      },
      answer: {
        en: 'No. Use Periodic and the appropriate recurrence mode when the task must repeat.',
        ar: 'لا؛ استخدم الدوري ونمط التكرار المناسب عندما يجب أن تتكرر المهمة.',
      },
    },
  ],
}
