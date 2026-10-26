import { guideText as text, type FeatureGuide } from '../types'

export const incidentGuide: FeatureGuide = {
  slug: 'incident',
  navigationKey: 'incident_guide',
  icon: 'exclamation-triangle',
  title: text('Incidents', 'الحوادث'),
  summary: text(
    'Create an incident report, capture its people and compliance details, and review the saved record.',
    'أنشئ تقرير حادث ووثّق بيانات الأشخاص والامتثال ثم راجع السجل المحفوظ.',
  ),
  introduction: text(
    'Incident reporting captures an event in a specific project and zone, including its type, context, immediate response, and any affected people. The walkthrough records a labelled documentation scenario with no injuries or fatalities. Select additional sections only when they apply to the incident being reported.',
    'يوثق تقرير الحادث واقعة في مشروع ومنطقة محددين بما يشمل النوع والسياق والاستجابة الفورية والأشخاص المتأثرين. يسجل الشرح سيناريو توضيحياً مسمى دون إصابات أو وفيات. فعّل الأقسام الإضافية فقط عند انطباقها على الحادث المبلغ عنه.',
  ),
  startRoute: '/organization/equipment-mangement/incedant?isAll=1',
  actionLabel: text('Open Incidents', 'افتح الحوادث'),
  recordings: [
    {
      id: 'incident',
      title: text('Create an incident', 'إضافة حادث'),
      description: text(
        'Select the project and zone, complete the incident details and immediate response, review the people sections, submit, and open the saved report.',
        'اختر المشروع والمنطقة وأكمل بيانات الحادث والاستجابة الفورية وراجع أقسام الأشخاص ثم أرسل وافتح التقرير المحفوظ.',
      ),
      gif: '/documentation/incident/incident.gif',
      poster: '/documentation/incident/incident-poster.webp',
    },
  ],
  prerequisites: [
    text(
      'Permission to create incidents and access the selected project and its zones.',
      'صلاحية إنشاء الحوادث والوصول إلى المشروع المختار ومناطقه.',
    ),
    text(
      'An incident type in the organization lookups, plus the event date, time, work area, and description.',
      'نوع حادث ضمن القوائم المرجعية بالمؤسسة مع تاريخ ووقت الواقعة ومكان العمل والوصف.',
    ),
    text(
      'Prepare equipment, involved persons, immediate actions, witness statements, injury information, and compliance details when applicable.',
      'جهّز المعدة والأشخاص المعنيين والإجراءات الفورية وأقوال الشهود وبيانات الإصابات والامتثال عند انطباقها.',
    ),
  ],
  steps: [
    {
      id: 'incident-context',
      title: text('Open a report and select its context', 'افتح التقرير وحدد سياقه'),
      summary: text(
        'Place the event in the correct project and zone.',
        'اربط الواقعة بالمشروع والمنطقة الصحيحين.',
      ),
      instructions: [
        text(
          'Open Incidents and select the add incident action. Choose the project inside the form and confirm the zone; a single available zone is selected automatically.',
          'افتح الحوادث واختر إضافة حادث. حدد المشروع داخل النموذج وراجع المنطقة؛ تُحدد المنطقة تلقائياً عند وجود منطقة واحدة.',
        ),
        text(
          'Keep the automatic serial, or enter a unique manual reference if manual numbering is enabled. Enter the incident date, time, and Work Area / Facility. The date must be on or after the project start date and must not be in the future.',
          'اترك الرقم التسلسلي التلقائي أو أدخل مرجعاً يدوياً فريداً عند تفعيل الترقيم اليدوي، ثم أدخل تاريخ ووقت الحادث ومكان العمل أو المرفق. يجب ألا يسبق التاريخ بداية المشروع وألا يكون في المستقبل.',
        ),
      ],
    },
    {
      id: 'incident-event',
      title: text('Describe and classify the incident', 'صف الحادث وحدد نوعه'),
      summary: text(
        'Capture the event and its immediate context.',
        'وثّق الواقعة وسياقها المباشر.',
      ),
      instructions: [
        text(
          'Select the Incident Type. Complete Property Damage when applicable, then select equipment, involved persons, and shift where relevant.',
          'اختر نوع الحادث وأكمل حقل تلف الممتلكات عند انطباقه، ثم حدد المعدة والأشخاص والوردية عند الحاجة.',
        ),
        text(
          'Write a factual description of the incident. Add supporting images when available and review all selected references.',
          'اكتب وصفاً واقعياً للحادث وأضف الصور الداعمة عند توفرها وراجع جميع العناصر المرتبطة التي اخترتها.',
        ),
      ],
    },
    {
      id: 'incident-response',
      title: text('Record the immediate response', 'سجّل الاستجابة الفورية'),
      summary: text(
        'Explain what happened to the work and how the event was controlled.',
        'وضح ما حدث للعمل وكيف تمت السيطرة على الواقعة.',
      ),
      instructions: [
        text(
          'Indicate whether work stopped. Select Yes for Action Taken if an immediate action occurred and describe what was done.',
          'حدد ما إذا توقف العمل، واختر نعم للإجراء المتخذ عند تنفيذ إجراء فوري ثم صف ما تم.',
        ),
        text(
          'Select PTW Status and Regulatory / Compliance Notification where applicable. These fields record the report context; review what you selected before submission.',
          'حدد حالة تصريح العمل والإخطار التنظيمي أو الامتثال عند انطباقهما. تسجل هذه الحقول سياق التقرير؛ راجع اختياراتك قبل الإرسال.',
        ),
      ],
    },
    {
      id: 'incident-people',
      title: text('Review witnesses, injuries, and fatalities', 'راجع الشهود والإصابات والوفيات'),
      summary: text(
        'Expand only the sections that apply to the report.',
        'افتح الأقسام التي تنطبق على التقرير فقط.',
      ),
      instructions: [
        text(
          'For witnesses, choose Yes when someone provided a statement. Add each witness using an employee selection or the available manual-name option, then record their statement.',
          'للشهود اختر نعم عند وجود من أدلى بشهادة. أضف كل شاهد باختيار موظف أو باستخدام إدخال الاسم اليدوي المتاح ثم سجّل أقواله.',
        ),
        text(
          'For injuries, choose Yes only when an injury occurred. Complete each person and the applicable injury details, categories, supporting images, locations, and PPE information.',
          'للإصابات اختر نعم فقط عند حدوث إصابة، وأكمل بيانات كل شخص والتفاصيل والفئات والصور والمواضع ومعلومات معدات الحماية المنطبقة.',
        ),
        text(
          'For fatalities, choose Yes only when applicable and enter the affected person and available details. Keep No for sections that do not apply, as shown in this demonstration.',
          'للوفيات اختر نعم فقط عند انطباقها وأدخل الشخص والتفاصيل المتاحة. اترك لا للأقسام غير المنطبقة كما في هذا المثال.',
        ),
        text(
          'Remove unused rows. An added witness, injury, or fatality row needs an identified person before submission.',
          'احذف الصفوف غير المستخدمة. يحتاج كل صف شاهد أو إصابة أو وفاة مضاف إلى تحديد الشخص قبل الإرسال.',
        ),
      ],
    },
    {
      id: 'incident-save',
      title: text('Submit and inspect the saved report', 'أرسل وراجع التقرير المحفوظ'),
      summary: text(
        'Verify the persisted incident and its follow-up links.',
        'تحقق من الحادث المحفوظ وروابط المتابعة.',
      ),
      instructions: [
        text(
          'Check project, zone, date, time, incident type, description, actions, and people sections, then select Submit. Save and New saves and clears the form for another report.',
          'راجع المشروع والمنطقة والتاريخ والوقت ونوع الحادث والوصف والإجراءات وأقسام الأشخاص ثم اضغط إرسال. يحفظ حفظ وجديد التقرير ويفرغ النموذج لتقرير آخر.',
        ),
        text(
          'Correct highlighted fields if validation appears. After success, locate the new incident and open its details from the card action menu. If you started from a project-specific workflow, success can return you to that project summary.',
          'صحح الحقول المحددة عند ظهور التحقق. بعد النجاح ابحث عن الحادث وافتح تفاصيله من قائمة البطاقة. إذا بدأت من مسار خاص بمشروع فقد يعيدك النجاح إلى ملخصه.',
        ),
        text(
          'Confirm the saved description, type, project context, and response. Review any linked investigation or follow-up records that the system makes available.',
          'تحقق من الوصف والنوع وسياق المشروع والاستجابة المحفوظة وراجع التحقيق أو سجلات المتابعة المرتبطة التي يتيحها النظام.',
        ),
      ],
    },
  ],
  afterSetup: [
    {
      title: text('Find and review incidents', 'البحث عن الحوادث ومراجعتها'),
      description: text(
        'Use the project and list filters to find the report. Clear filters when needed, then open the card details to review the recorded event and people sections.',
        'استخدم المشروع وفلاتر القائمة للعثور على التقرير، وامسح الفلاتر عند الحاجة ثم افتح تفاصيل البطاقة لمراجعة الواقعة وأقسام الأشخاص.',
      ),
    },
    {
      title: text('Investigations and follow-up', 'التحقيقات والمتابعة'),
      description: text(
        'Review related records and the actions available on the saved incident. Open a linked investigation when present, then continue its assigned workflow. Available actions depend on status and permissions.',
        'راجع السجلات المرتبطة والإجراءات المتاحة على الحادث المحفوظ. افتح التحقيق المرتبط عند وجوده وتابع مساره المحدد؛ تعتمد الإجراءات على الحالة والصلاحيات.',
      ),
    },
    {
      title: text('Maintain the report', 'تحديث التقرير'),
      description: text(
        'Use Edit when available to correct or complete incident information. In saved details, use Convert Status to Close when the response is complete, or Convert Status to Open when further work is required. Confirm the resulting status after updating.',
        'استخدم التعديل عند توفره لتصحيح بيانات الحادث أو استكمالها. داخل التفاصيل استخدم تحويل الحالة إلى مغلقة عند اكتمال الاستجابة أو إلى مفتوحة عند الحاجة لمزيد من العمل، وتحقق من الحالة بعد التحديث.',
      ),
    },
  ],
  questions: [
    {
      question: text('Why is the incident date rejected?', 'لماذا يُرفض تاريخ الحادث؟'),
      answer: text(
        'The date must be on or after the selected project’s start date and no later than today. A project that has not started yet cannot accept an incident dated today; verify the correct project and event date.',
        'يجب أن يكون التاريخ في بداية المشروع المختار أو بعدها وألا يتجاوز اليوم. لا يقبل المشروع الذي لم يبدأ بعد حادثاً بتاريخ اليوم؛ تحقق من المشروع وتاريخ الواقعة الصحيحين.',
      ),
    },
    {
      question: text(
        'How is an incident different from an observation?',
        'ما الفرق بين الحادث والملاحظة؟',
      ),
      answer: text(
        'The incident form requires an incident type and includes property damage, permit/compliance context, witnesses, injuries, and fatalities. Observations include Positive/Negative classification and risk assessment for negative conditions.',
        'يتطلب نموذج الحادث نوع حادث ويضم تلف الممتلكات وسياق التصريح والامتثال والشهود والإصابات والوفيات. تتضمن الملاحظات التصنيف الإيجابي أو السلبي وتقييم المخاطر للحالات السلبية.',
      ),
    },
    {
      question: text('Do all people sections need data?', 'هل يجب تعبئة جميع أقسام الأشخاص؟'),
      answer: text(
        'No. Select the sections that apply. When you add a row, identify the person and complete the relevant details; remove empty rows before submitting.',
        'لا؛ حدد الأقسام المنطبقة فقط. عند إضافة صف حدد الشخص وأكمل التفاصيل المرتبطة واحذف الصفوف الفارغة قبل الإرسال.',
      ),
    },
    {
      question: text(
        'Does selecting a compliance notification send it?',
        'هل يؤدي اختيار إخطار الامتثال إلى إرساله؟',
      ),
      answer: text(
        'This field records the selected compliance context in the incident. Follow your organization process to confirm whether a separate notification or approval is required.',
        'يسجل الحقل سياق الامتثال المختار داخل الحادث. اتبع إجراءات المؤسسة للتأكد مما إذا كان يلزم إخطار أو اعتماد منفصل.',
      ),
    },
  ],
}
