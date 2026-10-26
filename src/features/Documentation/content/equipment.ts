import { guideText as text, type FeatureGuide } from '../types'

export const equipmentGuide: FeatureGuide = {
  slug: 'equipment',
  navigationKey: 'equipment_guide',
  icon: 'wrench',
  title: text('Equipment', 'المعدات'),
  summary: text(
    'Register owned and rented assets, check rental dates, and review equipment records.',
    'سجّل المعدات المملوكة والمستأجرة وراجع مواعيد الإيجار وسجلات المعدات.',
  ),
  introduction: text(
    'The equipment registry holds machines, devices, and tools. Both ownership cycles start from the same form. Select the relevant walkthrough below, then follow the guide for identity, compliance, ownership, storage, and saved details.',
    'يضم سجل المعدات الآلات والأجهزة والأدوات. تبدأ دورتا الملكية والإيجار من النموذج نفسه. اختر الشرح المناسب أدناه ثم اتبع خطوات الهوية والمستندات والملكية والتخزين ومراجعة البيانات المحفوظة.',
  ),
  startRoute: '/organization/equipments',
  actionLabel: text('Open Equipment', 'افتح المعدات'),
  recordings: [
    {
      id: 'equipment-owned',
      title: text('Owned equipment', 'المعدات المملوكة'),
      description: text(
        'Create an owned asset, save it in the registry, and open Show to inspect its equipment card and inspection history.',
        'أنشئ معدة مملوكة واحفظها في السجل ثم افتح العرض لمراجعة بطاقة المعدة وسجل التفتيش.',
      ),
      gif: '/documentation/equipment/equipment-owned.gif',
      poster: '/documentation/equipment/equipment-owned-poster.webp',
    },
    {
      id: 'equipment-rented',
      title: text('Rented equipment', 'المعدات المستأجرة'),
      description: text(
        'Create a rented asset with a contractor and a two-month period. The saved record shows 1 November 2026 through 1 January 2027.',
        'أنشئ معدة مستأجرة مع مقاول وفترة شهرين. يعرض السجل المحفوظ الفترة من 1 نوفمبر 2026 إلى 1 يناير 2027.',
      ),
      gif: '/documentation/equipment/equipment-rented.gif',
      poster: '/documentation/equipment/equipment-rented-poster.webp',
    },
  ],
  prerequisites: [
    text(
      'Permission to view and create equipment, and an existing brand for the selected asset category.',
      'صلاحية عرض المعدات وإنشائها ووجود علامة تجارية لفئة المعدة المختارة.',
    ),
    text(
      'The asset model and its ownership status. Prepare a contractor, rental period, and start date for rented assets.',
      'موديل المعدة وحالة ملكيتها. جهّز المقاول وفترة الإيجار وتاريخ البداية للمعدات المستأجرة.',
    ),
    text(
      'A warehouse if you want to record initial storage. Prepare images, inspection certificates, and registration details when applicable.',
      'مستودع إذا أردت تسجيل مكان التخزين الأولي، مع تجهيز الصور وشهادات التفتيش وبيانات التسجيل عند الحاجة.',
    ),
  ],
  steps: [
    {
      id: 'asset-identity',
      title: text('Choose the asset category and identity', 'اختر فئة المعدة وبياناتها'),
      summary: text(
        'Open the add form from the equipment list.',
        'افتح نموذج الإضافة من قائمة المعدات.',
      ),
      instructions: [
        text(
          'Open Equipment and use its add action. Choose Equipment, Devices, or Tools at the top of the form; the fields and available brands follow that category.',
          'افتح المعدات واستخدم زر الإضافة. اختر المعدات أو الأجهزة أو الأدوات أعلى النموذج؛ تتغير الحقول والعلامات التجارية حسب الفئة.',
        ),
        text(
          'For Equipment, choose Heavy or Light. Keep the automatic serial or enter a unique manual serial when manual numbering is enabled.',
          'للمعدات اختر ثقيلة أو خفيفة. اترك الرقم التسلسلي التلقائي أو أدخل رقماً فريداً عند تفعيل الترقيم اليدوي.',
        ),
        text(
          'Select a brand and enter the model name. Fill the available language fields as needed; the model needs a non-empty name. Record manufacturing year and operating hours where applicable.',
          'اختر العلامة التجارية واكتب اسم الموديل. املأ حقول اللغات حسب الحاجة؛ يجب وجود اسم غير فارغ للموديل. سجّل سنة التصنيع وساعات التشغيل عند الحاجة.',
        ),
      ],
    },
    {
      id: 'asset-compliance',
      title: text('Add documentation and compliance details', 'أضف المستندات وبيانات الامتثال'),
      summary: text(
        'Attach the records used to identify and inspect the asset.',
        'أرفق السجلات المستخدمة لتعريف المعدة والتفتيش عليها.',
      ),
      instructions: [
        text(
          'Upload the equipment image and certificate or inspection image when available. Follow the file-size limit shown beside each upload.',
          'ارفع صورة المعدة وصورة الشهادة أو التفتيش عند توفرها، والتزم بحد حجم الملف المعروض بجوار كل حقل.',
        ),
        text(
          'Set the third-party inspection expiry date and IVMS status if applicable. Complete plate, usage, and condition fields that apply to the selected category.',
          'حدد تاريخ انتهاء تفتيش الطرف الثالث وحالة نظام تتبع المركبات عند الحاجة. أكمل بيانات اللوحة والاستخدام والحالة التي تظهر للفئة المختارة.',
        ),
      ],
    },
    {
      id: 'owned-cycle',
      title: text('Owned cycle', 'دورة المعدات المملوكة'),
      summary: text(
        'Use this path when the organization owns the asset.',
        'استخدم هذا المسار عندما تكون المعدة مملوكة للمؤسسة.',
      ),
      instructions: [
        text(
          'In Ownership and assignment, select Owned. Select the initial warehouse if needed.',
          'في قسم الملكية والتعيين اختر مملوكة، ثم حدد المستودع الأولي عند الحاجة.',
        ),
        text(
          'Review the preview, then select Save. Find the saved owned asset in the equipment list and use its action menu → Show.',
          'راجع المعاينة ثم اضغط على حفظ. ابحث عن المعدة المملوكة المحفوظة وافتح قائمة إجراءاتها ثم العرض.',
        ),
        text(
          'Confirm the Owned badge and identity details. Owned equipment does not display rental start and end dates.',
          'تحقق من شارة مملوكة وبيانات التعريف. لا تعرض المعدات المملوكة تاريخي بداية ونهاية الإيجار.',
        ),
      ],
    },
    {
      id: 'rented-cycle',
      title: text('Rented cycle and date calculation', 'دورة الإيجار وحساب المواعيد'),
      summary: text(
        'Use this path for equipment supplied temporarily by a contractor.',
        'استخدم هذا المسار للمعدات التي يوفرها مقاول لفترة مؤقتة.',
      ),
      instructions: [
        text(
          'Select Rent, then choose the supplying subcontractor. Choose the rent type: Hour, Day, Month, or Year.',
          'اختر مستأجرة ثم المقاول المورّد. حدد وحدة الإيجار: ساعة أو يوم أو شهر أو سنة.',
        ),
        text(
          'Enter a positive rental period and set the start date and time. The end date is calculated from the start date plus that period in the chosen unit.',
          'أدخل مدة إيجار موجبة وحدد تاريخ ووقت البداية. يُحسب تاريخ النهاية بإضافة المدة إلى البداية وفق الوحدة المختارة.',
        ),
        text(
          'For example, 1 November 2026 plus 2 months gives 1 January 2027. Check the calculated end date and contractor before saving; the end date is read-only.',
          'مثلاً: 1 نوفمبر 2026 مع شهرين يساوي 1 يناير 2027. راجع النهاية المحسوبة والمقاول قبل الحفظ؛ حقل النهاية للقراءة فقط.',
        ),
        text(
          'Select a warehouse if applicable, review the preview, and select Save. Open the saved asset through its action menu → Show to confirm Rental Details.',
          'حدد المستودع عند الحاجة وراجع المعاينة ثم احفظ. افتح المعدة المحفوظة من قائمة الإجراءات ثم العرض للتحقق من تفاصيل الإيجار.',
        ),
      ],
      note: text(
        'Changing the period or its unit recalculates the end date. Month and year periods use calendar dates; they are not fixed counts of 30 or 365 days.',
        'يؤدي تغيير المدة أو وحدتها إلى إعادة حساب النهاية. تعتمد الأشهر والسنوات على التقويم ولا تعني عدداً ثابتاً من 30 أو 365 يوماً.',
      ),
    },
    {
      id: 'equipment-save',
      title: text('Save and verify', 'الحفظ والتحقق'),
      summary: text(
        'Confirm the saved asset, rather than relying only on the preview.',
        'تحقق من المعدة المحفوظة إلى جانب معاينة النموذج.',
      ),
      instructions: [
        text(
          'Save creates the asset and returns to the registry. Save and New creates it and clears the form for another asset.',
          'ينشئ زر حفظ المعدة ويعيدك للسجل. ينشئ حفظ وجديد المعدة ويفرغ النموذج لإضافة معدة أخرى.',
        ),
        text(
          'If validation appears, correct the highlighted fields and save again. Required rental fields apply when Rent is selected.',
          'عند ظهور رسائل التحقق صحح الحقول المحددة ثم أعد الحفظ. تنطبق حقول الإيجار المطلوبة عند اختيار مستأجرة.',
        ),
        text(
          'Check the saved model, status, serial, and storage information on the card. Use Filter when the registry contains many assets.',
          'راجع الموديل والحالة والرقم التسلسلي ومعلومات التخزين في البطاقة المحفوظة. استخدم التصفية عند وجود معدات كثيرة.',
        ),
      ],
    },
  ],
  afterSetup: [
    {
      title: text('Show and QR card', 'العرض وبطاقة QR'),
      description: text(
        'The card action menu → Show opens equipment details, the identification card, and Print QR card. Rented assets include contractor and rental dates; owned assets hide rental dates.',
        'تفتح قائمة إجراءات البطاقة ثم العرض تفاصيل المعدة وبطاقة التعريف وطباعة بطاقة QR. تتضمن المعدات المستأجرة المقاول ومواعيد الإيجار وتخفي المعدات المملوكة هذه المواعيد.',
      ),
    },
    {
      title: text('Inspection history', 'سجل التفتيش'),
      description: text(
        'Use Inspection and Results in the details page to review assigned checks and completed results. A newly created asset may have no records yet.',
        'استخدم تبويبي التفتيش والنتائج داخل التفاصيل لمراجعة الفحوصات المعيّنة والنتائج المكتملة. قد لا تحتوي المعدة الجديدة على سجلات بعد.',
      ),
    },
    {
      title: text('Maintain the asset', 'تحديث المعدة'),
      description: text(
        'Use Edit in the card action menu to update its information, or Add Inspection when available. Permissions determine which actions are shown.',
        'استخدم التعديل من قائمة البطاقة لتحديث البيانات أو إضافة تفتيش عند توفرها. تحدد الصلاحيات الإجراءات التي تظهر.',
      ),
    },
    {
      title: text('Project assignment', 'التعيين للمشروع'),
      description: text(
        'Creating an equipment record adds it to the registry. Assign equipment to the intended project zone through project setup or project resource management.',
        'تضيف عملية الإنشاء المعدة إلى السجل. عيّنها لمنطقة المشروع المناسبة من إعداد المشروع أو إدارة موارده.',
      ),
    },
  ],
  questions: [
    {
      question: text('Why is a brand missing?', 'لماذا لا تظهر علامة تجارية؟'),
      answer: text(
        'Check the selected Equipment, Devices, or Tools category. Prepare the brand for that category in the organization lookups, or use New if your role permits it.',
        'راجع فئة المعدات أو الأجهزة أو الأدوات المختارة. جهّز العلامة التجارية لهذه الفئة في القوائم المرجعية أو استخدم جديد إذا سمحت صلاحياتك.',
      ),
    },
    {
      question: text('Can I type the rental end date?', 'هل يمكن كتابة تاريخ نهاية الإيجار؟'),
      answer: text(
        'The form calculates it. Adjust the start date, period, or rent type and check the result before saving.',
        'يحسبه النموذج تلقائياً. عدّل البداية أو المدة أو الوحدة ثم راجع النتيجة قبل الحفظ.',
      ),
    },
    {
      question: text('Why does the add button say Add Tool?', 'لماذا يظهر زر إضافة أداة؟'),
      answer: text(
        'The entry label can reflect the current equipment category. The opened form contains category tabs, so select the category you actually want before choosing the brand.',
        'قد يعكس اسم زر الإضافة فئة المعدات الحالية. يحتوي النموذج على تبويبات للفئات؛ اختر الفئة المطلوبة قبل اختيار العلامة التجارية.',
      ),
    },
  ],
}
