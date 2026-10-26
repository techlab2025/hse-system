export type GuideText = { en: string; ar: string }
export type GuideStep = {
  id: string
  title: GuideText
  summary: GuideText
  instructions: GuideText[]
  note?: GuideText
}
export type FeatureGuide = {
  slug: string
  navigationKey: string
  title: GuideText
  summary: GuideText
  introduction: GuideText
  icon: string
  startRoute: string
  prerequisites: GuideText[]
  steps: GuideStep[]
  afterSetup: { title: GuideText; description: GuideText }[]
  questions: { question: GuideText; answer: GuideText }[]
  recording: { gif: string; poster: string }
}
const text = (en: string, ar: string): GuideText => ({ en, ar })

export const featureGuides: FeatureGuide[] = [
  {
    slug: 'project',
    navigationKey: 'project_guide',
    title: text('Project', 'المشروع'),
    summary: text(
      'Create a project, complete its five setup steps, and manage its daily work.',
      'أنشئ مشروعاً وأكمل خطوات إعداده الخمس وتابع أعماله اليومية.',
    ),
    introduction: text(
      'A project brings your locations, work zones, people, teams, and equipment together. Follow the setup wizard once, then use the project overview to manage assignments and operational records.',
      'يجمع المشروع مواقع العمل والمناطق والموظفين والفرق والمعدات في مكان واحد. أكمل معالج الإعداد ثم استخدم ملخص المشروع لإدارة التعيينات والسجلات التشغيلية.',
    ),
    icon: 'briefcase-alt',
    startRoute: '/organization/projects',
    recording: {
      gif: '/documentation/projects/project-setup.gif',
      poster: '/documentation/projects/project-setup-poster.webp',
    },
    prerequisites: [
      text(
        'Permission to view and create projects. Available buttons depend on your role.',
        'صلاحية عرض المشاريع وإنشائها؛ تعتمد الأزرار المتاحة على دورك.',
      ),
      text(
        'At least one work location. Prepare work zones if your project uses them.',
        'موقع عمل واحد على الأقل، مع تجهيز مناطق العمل إذا كان المشروع يستخدمها.',
      ),
      text(
        'The project name, start and end dates, cost, and planned number of drills.',
        'اسم المشروع وتاريخا البداية والنهاية والتكلفة وعدد التدريبات المخطط لها.',
      ),
      text(
        'Positions, employees, teams, and equipment prepared in your organization settings for the assignment steps.',
        'تجهيز المسميات الوظيفية والموظفين والفرق والمعدات في إعدادات المؤسسة لاستخدامها في خطوات التعيين.',
      ),
    ],
    steps: [
      {
        id: 'basic-data',
        title: text('Basic data', 'البيانات الأساسية'),
        summary: text(
          'Define the project and where its work will take place.',
          'حدد هوية المشروع والمواقع التي ستُنفذ فيها أعماله.',
        ),
        instructions: [
          text(
            'Open Projects from Project Management, then select New Project.',
            'افتح المشاريع من إدارة المشاريع ثم اضغط على مشروع جديد.',
          ),
          text(
            'Keep automatic serial generation on, or enter your own unique serial. Enter the project name in the available language fields.',
            'اترك توليد الرقم التسلسلي تلقائياً أو أدخل رقماً فريداً، ثم اكتب اسم المشروع في حقول اللغات المتاحة.',
          ),
          text(
            'Select subcontractors when applicable. Enter a cost of zero or more, choose the start and end dates, and enter the planned drill count.',
            'اختر المقاولين من الباطن عند الحاجة، وأدخل تكلفة تساوي صفراً أو أكثر وتاريخي البداية والنهاية وعدد التدريبات المخطط لها.',
          ),
          text(
            'Select the project locations. If Project has zones is enabled, choose the work zones for those locations.',
            'اختر مواقع المشروع، وإذا كان خيار «المشروع يحتوي على مناطق» مفعّلاً فاختر مناطق العمل التابعة لهذه المواقع.',
          ),
          text(
            'You can also add a scope of work and a project image. Review the information, then select Save & Next.',
            'يمكنك إضافة نطاق العمل وصورة للمشروع. راجع البيانات ثم اضغط على حفظ والتالي.',
          ),
        ],
        note: text(
          'The end date must be on or after the start date. Required fields are highlighted when missing. Saving this step creates the project; later steps add its assignments.',
          'يجب أن يكون تاريخ النهاية مساوياً لتاريخ البداية أو لاحقاً له. تظهر الحقول المطلوبة الناقصة عند الحفظ. ينشئ حفظ هذه الخطوة المشروع، وتضيف الخطوات التالية تعييناته.',
        ),
      },
      {
        id: 'holidays',
        title: text('Holidays', 'العطلات'),
        summary: text(
          'Set the working calendar for the project.',
          'حدد تقويم العمل الخاص بالمشروع.',
        ),
        instructions: [
          text(
            'Select the weekly days off, such as Friday or Saturday.',
            'اختر أيام العطلة الأسبوعية مثل الجمعة أو السبت.',
          ),
          text(
            'Enable Custom holidays if you need additional days off. Add a holiday name and select one or more dates for each entry.',
            'فعّل العطلات المخصصة عند الحاجة، وأضف اسماً للعطلة واختر تاريخاً أو أكثر لكل إدخال.',
          ),
          text(
            'Remove unused holiday rows and select Save & Next.',
            'احذف صفوف العطلات غير المستخدمة ثم اضغط على حفظ والتالي.',
          ),
        ],
        note: text(
          'Every custom holiday row you add needs both a name and at least one date.',
          'يجب أن يحتوي كل صف عطلة مخصصة على اسم وتاريخ واحد على الأقل.',
        ),
      },
      {
        id: 'positions',
        title: text('Positions & employees', 'المسميات الوظيفية والموظفون'),
        summary: text(
          'Assign the right people to each project location.',
          'عيّن الموظفين المناسبين لكل موقع في المشروع.',
        ),
        instructions: [
          text(
            'Review the locations saved in Basic data. Select the positions or hierarchies needed for each location.',
            'راجع المواقع المحفوظة في البيانات الأساسية، ثم اختر المسميات الوظيفية أو الهياكل المطلوبة لكل موقع.',
          ),
          text(
            'For each selected position, choose the employees to assign. Repeat for the other project locations as needed.',
            'اختر الموظفين لكل مسمى وظيفي، وكرر ذلك مع مواقع المشروع الأخرى حسب الحاجة.',
          ),
          text(
            'Remove incomplete assignments, check the employee selections, and select Save & Next.',
            'احذف التعيينات غير المكتملة وراجع اختيارات الموظفين ثم اضغط على حفظ والتالي.',
          ),
        ],
        note: text(
          'If a position or employee is missing, first check the organization setup and your access permissions.',
          'إذا لم يظهر مسمى وظيفي أو موظف، فتحقق أولاً من إعدادات المؤسسة وصلاحيات حسابك.',
        ),
      },
      {
        id: 'teams',
        title: text('Teams', 'الفرق'),
        summary: text(
          'Organize the assigned project employees into location teams.',
          'نظّم الموظفين المعيّنين للمشروع ضمن فرق مرتبطة بالمواقع.',
        ),
        instructions: [
          text(
            'Select a team for the relevant project location.',
            'اختر فريقاً لموقع المشروع المناسب.',
          ),
          text(
            'Choose the project employees who belong to that team.',
            'اختر موظفي المشروع الذين سينضمون إلى هذا الفريق.',
          ),
          text(
            'Select a team leader from the selected team members. Repeat for any other teams, then select Save & Next.',
            'اختر قائد الفريق من الأعضاء المحددين، وكرر ذلك مع الفرق الأخرى ثم اضغط على حفظ والتالي.',
          ),
        ],
        note: text(
          'A team with selected employees must have a leader who is also one of those employees.',
          'يجب أن يكون للفريق الذي يضم موظفين قائد من بين الموظفين المحددين أنفسهم.',
        ),
      },
      {
        id: 'equipment',
        title: text('Equipment', 'المعدات'),
        summary: text(
          'Connect equipment to the project work zones and finish setup.',
          'اربط المعدات بمناطق العمل في المشروع ثم أكمل الإعداد.',
        ),
        instructions: [
          text(
            'Review the zones available for the project and select the equipment needed in each zone.',
            'راجع المناطق المتاحة للمشروع واختر المعدات المطلوبة في كل منطقة.',
          ),
          text(
            'Check that each item is assigned to the intended zone. Add other available equipment as needed.',
            'تحقق من تعيين كل معدة للمنطقة الصحيحة، وأضف المعدات الأخرى المتاحة عند الحاجة.',
          ),
          text(
            'Select Save & Finish to save the final step and return to Projects. Select Open Project on the saved project card to open its overview.',
            'اضغط على حفظ وإنهاء لحفظ الخطوة الأخيرة والعودة إلى المشاريع، ثم اضغط على فتح المشروع من بطاقته لعرض الملخص.',
          ),
        ],
        note: text(
          'Equipment assignment uses the locations and zones selected earlier. If a zone is missing, review the Basic data step.',
          'يعتمد تعيين المعدات على المواقع والمناطق المختارة سابقاً. إذا لم تظهر منطقة، فراجع خطوة البيانات الأساسية.',
        ),
      },
    ],
    afterSetup: [
      {
        title: text('Check the overview', 'راجع ملخص المشروع'),
        description: text(
          'Review setup readiness, project details, and the counts of assigned locations, zones, people, and equipment.',
          'راجع جاهزية الإعداد وبيانات المشروع وأعداد المواقع والمناطق والموظفين والمعدات المعيّنة.',
        ),
      },
      {
        title: text('Manage assignments', 'إدارة التعيينات'),
        description: text(
          'Open a resource from the overview to inspect its records or add more locations, employees, teams, contractors, and equipment where permitted.',
          'افتح أحد أقسام الملخص لعرض سجلاته أو إضافة مواقع وموظفين وفرق ومقاولين ومعدات وفقاً لصلاحياتك.',
        ),
      },
      {
        title: text('Safety records', 'سجلات السلامة'),
        description: text(
          'Use Safety statistics to open observations, incidents, investigations, and inspections for this project. Counters show the current records; each section provides its available create and follow-up actions.',
          'استخدم إحصاءات السلامة لفتح ملاحظات وحوادث وتحقيقات وتفتيشات هذا المشروع. تعرض العدادات السجلات الحالية، ويتيح كل قسم إجراءات الإنشاء والمتابعة المتاحة.',
        ),
      },
      {
        title: text('Overview tabs', 'تبويبات الملخص'),
        description: text(
          'All data shows the full workspace. Safety statistics, Operations, Equipment, Meetings, Drills, Loss time, and Quick access narrow the visible sections. Open Full Project Details opens the detailed project workspace.',
          'يعرض «كل البيانات» مساحة العمل كاملة. تحدد تبويبات إحصاءات السلامة والعمليات والمعدات والاجتماعات والتدريبات والوقت الضائع والوصول السريع الأقسام المعروضة. يفتح زر تفاصيل المشروع الكاملة مساحة العمل التفصيلية.',
        ),
      },
      {
        title: text('Meetings and drills', 'الاجتماعات والتدريبات'),
        description: text(
          'Open Meetings to manage the schedule and outcomes. The meeting count compares meetings with results against the total. Drills compares actual exercises against the planned count entered during setup; open it to review or add project drills.',
          'افتح الاجتماعات لإدارة المواعيد والنتائج؛ يقارن العداد الاجتماعات ذات النتائج بالإجمالي. يقارن عداد التدريبات التنفيذ الفعلي بالعدد المخطط أثناء الإعداد؛ افتحه لمراجعة تدريبات المشروع أو إضافتها.',
        ),
      },
      {
        title: text('Quick access workflows', 'إجراءات الوصول السريع'),
        description: text(
          'Quick access opens Leadership Engagement, Risk assessments, Meetings, Management of change, Audits, and Permit to work. Start from the project overview so the opened workflow keeps the current project context.',
          'يتيح الوصول السريع فتح المشاركة القيادية وتقييم المخاطر والاجتماعات وإدارة التغيير والتدقيق وتصاريح العمل. ابدأ من ملخص المشروع للاحتفاظ بسياق المشروع في الإجراء المفتوح.',
        ),
      },
      {
        title: text('Loss time', 'الوقت الضائع'),
        description: text(
          'The Loss time matrix summarizes daily, monthly, and yearly loss time by accident type. An empty matrix means no loss-time entries are available for this project.',
          'تلخص مصفوفة الوقت الضائع القيم اليومية والشهرية والسنوية حسب نوع الحادث. تعني المصفوفة الفارغة عدم توفر سجلات وقت ضائع لهذا المشروع.',
        ),
      },
      {
        title: text('Filter by project', 'التصفية حسب المشروع'),
        description: text(
          'Select a project in the application header to filter project-related lists and reports. Select All Projects to return to the combined view.',
          'اختر مشروعاً من رأس التطبيق لتصفية القوائم والتقارير المرتبطة بالمشاريع، واختر جميع المشاريع للعودة إلى العرض المجمع.',
        ),
      },
    ],
    questions: [
      {
        question: text('Can I finish setup later?', 'هل يمكن إكمال الإعداد لاحقاً؟'),
        answer: text(
          'Yes. After Basic data is saved, return to Projects and use the project setup or resume action to continue. Saving a step keeps its data even if you leave the wizard.',
          'نعم. بعد حفظ البيانات الأساسية، عد إلى المشاريع واستخدم إجراء الإعداد أو استكمال الإعداد للمشروع. تبقى بيانات الخطوات المحفوظة حتى إذا غادرت المعالج.',
        ),
      },
      {
        question: text('What does Skip this step do?', 'ماذا يفعل تخطي هذه الخطوة؟'),
        answer: text(
          'It moves to the next step without filling in that step’s assignments. Use it only when the section is not needed yet, then review the project overview for any remaining setup.',
          'ينقلك إلى الخطوة التالية دون إضافة تعيينات لهذه الخطوة. استخدمه فقط إذا لم تكن بحاجة إلى هذا القسم حالياً، ثم راجع ملخص المشروع لمعرفة الإعدادات المتبقية.',
        ),
      },
      {
        question: text('How do I change saved project details?', 'كيف أعدّل بيانات مشروع محفوظ؟'),
        answer: text(
          'Open the project and use its edit or setup actions to update the relevant section. Check location changes carefully because removing a location can also remove its related assignments.',
          'افتح المشروع واستخدم إجراءات التعديل أو الإعداد لتحديث القسم المطلوب. راجع تغييرات المواقع بعناية لأن إزالة موقع قد تزيل التعيينات المرتبطة به.',
        ),
      },
      {
        question: text(
          'Why is a list empty or a button missing?',
          'لماذا تظهر قائمة فارغة أو لا يظهر أحد الأزرار؟',
        ),
        answer: text(
          'Check the selected project, the data prepared in organization settings, and your role’s permissions. Team member choices also depend on the employees assigned to the project.',
          'تحقق من المشروع المحدد والبيانات المجهزة في إعدادات المؤسسة وصلاحيات دورك. تعتمد خيارات أعضاء الفرق أيضاً على الموظفين المعيّنين للمشروع.',
        ),
      },
    ],
  },
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
    watch: 'Watch the full setup',
    recordingDescription:
      'Follow a real project setup through all five steps. The recording uses a demonstration project.',
    play: 'Play walkthrough GIF',
    stop: 'Stop animation',
    download: 'Download GIF',
    steps: 'Setup steps',
    after: 'After setup',
    questions: 'Common questions',
    try: 'Open Projects',
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
    watch: 'شاهد الإعداد بالكامل',
    recordingDescription:
      'تابع إعداد مشروع فعلي عبر الخطوات الخمس. يستخدم التسجيل مشروعاً توضيحياً.',
    play: 'تشغيل الشرح بصيغة GIF',
    stop: 'إيقاف الحركة',
    download: 'تنزيل GIF',
    steps: 'خطوات الإعداد',
    after: 'بعد الإعداد',
    questions: 'أسئلة شائعة',
    try: 'افتح المشاريع',
    next: 'ستُضاف أدلة لميزات أخرى هنا.',
    notFound: 'هذا الدليل غير متاح حالياً.',
    step: 'الخطوة',
    of: 'من',
    contents: 'في هذه الصفحة',
    back: 'العودة إلى التوثيق',
  },
}
