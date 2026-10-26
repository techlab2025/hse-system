import { guideText as text, type FeatureGuide } from '../types'

export const observationGuide: FeatureGuide = {
  slug: 'observation',
  navigationKey: 'observation_guide',
  icon: 'eye',
  title: text('Observations', 'الملاحظات'),
  summary: text(
    'Report an observation, assess a negative condition, record action, and review the saved report.',
    'سجّل ملاحظة وقيّم الحالة السلبية ووثّق الإجراء وراجع التقرير المحفوظ.',
  ),
  introduction: text(
    'An observation records a condition or behavior at a project zone. Positive observations capture good practice. Negative observations capture hazards, risk assessment, and follow-up actions. The recording uses a clearly labelled documentation example in the demonstration project.',
    'تسجل الملاحظة حالة أو سلوكاً في منطقة داخل المشروع. توثق الملاحظات الإيجابية الممارسات الجيدة، وتوثق السلبية المخاطر وتقييمها وإجراءات المتابعة. يستخدم التسجيل مثالاً توضيحياً مسمى بوضوح داخل المشروع التجريبي.',
  ),
  startRoute: '/organization/equipment-mangement/observation?isAll=1&type=2',
  actionLabel: text('Open Observations', 'افتح الملاحظات'),
  recordings: [
    {
      id: 'observation',
      title: text('Create an observation', 'إضافة ملاحظة'),
      description: text(
        'Select the project and zone, complete a negative observation with its risk and immediate action, submit, and open the saved report.',
        'اختر المشروع والمنطقة وأكمل ملاحظة سلبية مع المخاطر والإجراء الفوري ثم أرسلها وافتح التقرير المحفوظ.',
      ),
      gif: '/documentation/observation/observation.gif',
      poster: '/documentation/observation/observation-poster.webp',
    },
  ],
  prerequisites: [
    text(
      'Permission to create observations and access the intended project and its zones.',
      'صلاحية إنشاء الملاحظات والوصول للمشروع ومناطقه.',
    ),
    text(
      'The event date, time, work area, observation type, and a clear description of what was observed.',
      'تاريخ ووقت الواقعة ومكان العمل ونوع الملاحظة ووصف واضح لما تمت ملاحظته.',
    ),
    text(
      'Hazard classifications and risks for negative observations. Prepare supporting images, involved people, equipment, and immediate-action details when applicable.',
      'تصنيفات المخاطر والمخاطر المحددة للملاحظات السلبية، مع تجهيز الصور والأشخاص والمعدات وتفاصيل الإجراء الفوري عند الحاجة.',
    ),
  ],
  steps: [
    {
      id: 'observation-context',
      title: text('Choose the project and zone', 'اختر المشروع والمنطقة'),
      summary: text(
        'Start the report in its correct project context.',
        'ابدأ التقرير في سياق المشروع الصحيح.',
      ),
      instructions: [
        text(
          'Open Observations and select the add observation action. Select the intended project in the form. The header project selection may provide the initial project.',
          'افتح الملاحظات واختر إضافة ملاحظة ثم حدد المشروع المطلوب داخل النموذج. قد يوفر اختيار المشروع في الرأس القيمة الأولية.',
        ),
        text(
          'Choose the zone under that project. A single available zone is selected automatically; check its displayed name before continuing.',
          'اختر المنطقة التابعة للمشروع. تُحدد المنطقة تلقائياً عند وجود منطقة واحدة؛ راجع اسمها المعروض قبل المتابعة.',
        ),
      ],
    },
    {
      id: 'observation-event',
      title: text('Record what happened', 'سجّل ما حدث'),
      summary: text(
        'Capture the observation details and supporting context.',
        'وثّق بيانات الملاحظة والسياق الداعم.',
      ),
      instructions: [
        text(
          'Keep the automatic reference, or enter a unique manual serial when enabled. Confirm the observation date and time and enter the Work Area / Facility.',
          'اترك المرجع التلقائي أو أدخل رقماً فريداً عند تفعيل الترقيم اليدوي. راجع تاريخ ووقت الملاحظة وأدخل مكان العمل أو المرفق.',
        ),
        text(
          'Select the Observation Type. Choose equipment, involved persons, and shift when applicable.',
          'اختر نوع الملاحظة وحدد المعدة والأشخاص المعنيين والوردية عند الحاجة.',
        ),
        text(
          'Write a clear description of the condition and add supporting images when available. Describe the observed facts and where they occurred.',
          'اكتب وصفاً واضحاً للحالة وأضف الصور الداعمة عند توفرها، مع تحديد الوقائع ومكان حدوثها.',
        ),
      ],
    },
    {
      id: 'observation-risk',
      title: text('Positive or negative and risk assessment', 'إيجابية أم سلبية وتقييم المخاطر'),
      summary: text(
        'The selected result determines which assessment fields appear.',
        'تحدد النتيجة المختارة حقول التقييم التي تظهر.',
      ),
      instructions: [
        text(
          'Select Positive for good practice or Negative for an unsafe condition or behavior. The walkthrough demonstrates Negative.',
          'اختر إيجابية للممارسات الجيدة أو سلبية للحالة أو السلوك غير الآمن. يعرض التسجيل المسار السلبي.',
        ),
        text(
          'For Negative, choose Consequence Severity and Probability of Occurrence. Review the resulting risk level; the form calculates it from those choices.',
          'للملاحظة السلبية اختر شدة العواقب واحتمال الحدوث وراجع مستوى الخطورة الناتج؛ يحسبه النموذج من هذه الخيارات.',
        ),
        text(
          'Select Hazard Classification, then the specific Risk choices that belong to it. These fields are required for a negative observation.',
          'اختر تصنيف المخاطر ثم المخاطر المحددة التابعة له؛ هذه الحقول مطلوبة للملاحظة السلبية.',
        ),
      ],
      note: text(
        'A high risk level, or a medium level marked as a near miss, can trigger an investigation. Review the investigation notice when it appears before submitting.',
        'قد يؤدي مستوى الخطورة العالي أو المستوى المتوسط المحدد كحادث وشيك إلى إنشاء تحقيق. راجع إشعار التحقيق عند ظهوره قبل الإرسال.',
      ),
    },
    {
      id: 'observation-action',
      title: text('Record immediate action and status', 'سجّل الإجراء الفوري والحالة'),
      summary: text(
        'Explain how the condition was controlled and whether it remains open.',
        'وضح كيفية السيطرة على الحالة وما إذا كانت لا تزال مفتوحة.',
      ),
      instructions: [
        text(
          'Indicate whether work stopped. Set Action Taken to Yes when an immediate action was taken, then describe that action.',
          'حدد ما إذا توقف العمل. اختر نعم في الإجراء المتخذ عند تنفيذ إجراء فوري ثم اكتب تفاصيله.',
        ),
        text(
          'Select Closed when the observation has been resolved, or Open when further action is needed. Complete the open follow-up note if that field appears.',
          'اختر مغلقة عند معالجة الملاحظة أو مفتوحة عند الحاجة لمزيد من الإجراءات، وأكمل ملاحظة المتابعة إذا ظهر حقلها.',
        ),
      ],
    },
    {
      id: 'observation-save',
      title: text('Submit and review the saved report', 'أرسل وراجع التقرير المحفوظ'),
      summary: text(
        'Check the persisted record and its available follow-up actions.',
        'راجع السجل المحفوظ وإجراءات المتابعة المتاحة.',
      ),
      instructions: [
        text(
          'Review the project, zone, date, time, type, risk, and action details, then select Submit. Save and New saves the report and resets the form for another one.',
          'راجع المشروع والمنطقة والتاريخ والوقت والنوع والمخاطر والإجراء ثم اضغط إرسال. يحفظ حفظ وجديد التقرير ويعيد ضبط النموذج لتقرير آخر.',
        ),
        text(
          'Correct highlighted required fields if validation appears. After success, find the report in Observations and open its details from the card actions.',
          'صحح الحقول المطلوبة المحددة عند ظهور رسائل التحقق. بعد النجاح ابحث عن التقرير في الملاحظات وافتح تفاصيله من إجراءات البطاقة.',
        ),
        text(
          'Confirm the saved description, location, classification, and status. Review any related follow-up records shown in the details.',
          'تحقق من الوصف والموقع والتصنيف والحالة المحفوظة وراجع سجلات المتابعة المرتبطة التي تظهر في التفاصيل.',
        ),
      ],
    },
  ],
  afterSetup: [
    {
      title: text('Find the report', 'العثور على التقرير'),
      description: text(
        'Use project and list filters to find observations by their available status, type, date, or other criteria. Clear filters if a saved report is not visible.',
        'استخدم المشروع وفلاتر القائمة للبحث حسب الحالة والنوع والتاريخ والمعايير المتاحة، وامسح الفلاتر إذا لم يظهر التقرير المحفوظ.',
      ),
    },
    {
      title: text('Details and follow-up', 'التفاصيل والمتابعة'),
      description: text(
        'The report details show the recorded context, risk, evidence, people, and action. Open related investigations or corrective follow-up when present and permitted.',
        'تعرض التفاصيل السياق والمخاطر والأدلة والأشخاص والإجراء المسجل. افتح التحقيقات أو المتابعات التصحيحية المرتبطة عند وجودها وحسب الصلاحيات.',
      ),
    },
    {
      title: text('Update an observation', 'تحديث الملاحظة'),
      description: text(
        'Use the available edit action to correct the report or update its action status. Keep the project and zone consistent with where the observation occurred.',
        'استخدم التعديل المتاح لتصحيح التقرير أو تحديث حالة الإجراء مع الحفاظ على المشروع والمنطقة المطابقين لمكان الملاحظة.',
      ),
    },
  ],
  questions: [
    {
      question: text('Why are there no zones?', 'لماذا لا توجد مناطق؟'),
      answer: text(
        'Select a project and check that its setup includes locations and zones. The form only offers zones belonging to the selected project.',
        'اختر مشروعاً وتحقق من أن إعداده يتضمن مواقع ومناطق؛ يعرض النموذج المناطق التابعة للمشروع المختار فقط.',
      ),
    },
    {
      question: text('Why are hazard fields hidden?', 'لماذا تختفي حقول المخاطر؟'),
      answer: text(
        'Hazard classification and risk fields apply to the Negative path. Positive observations use a shorter form.',
        'تنطبق حقول تصنيف المخاطر والمخاطر المحددة على المسار السلبي، بينما تستخدم الملاحظة الإيجابية نموذجاً أقصر.',
      ),
    },
    {
      question: text('Can I set the risk level directly?', 'هل يمكن تحديد مستوى الخطورة مباشرة؟'),
      answer: text(
        'The form derives it from consequence severity and probability. Check those inputs and the displayed result before submitting.',
        'يستنتج النموذج المستوى من شدة العواقب واحتمال الحدوث؛ راجع المدخلات والنتيجة المعروضة قبل الإرسال.',
      ),
    },
  ],
}
