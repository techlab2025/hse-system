import type { FeatureGuide } from '../types'

export const internalAuditGuide: FeatureGuide = {
  slug: 'internal-audit',
  navigationKey: 'internal_audit_guide',
  title: {
    en: 'Internal Audit',
    ar: 'التدقيق الداخلي',
  },
  summary: {
    en: 'Publish a plan, record meeting attendance, create an NCR and issue the complete audit report.',
    ar: 'انشر خطة وسجل حضور الاجتماعات وأنشئ عدم مطابقة وأصدر تقرير التدقيق الكامل.',
  },
  introduction: {
    en: 'The audit register is the entry point to a single workspace with Plan, Attendance, NCRs and Report tabs. Save a plan before using the other tabs. Publish it and reach its start date before recording attendance or issuing a report. The three walkthroughs follow the same demonstration audit through planning and attendance, a Minor NC with actions, and the issued report.',
    ar: 'سجل التدقيق هو مدخل مساحة عمل واحدة تضم الخطة والحضور وعدم المطابقة والتقرير. احفظ الخطة قبل استخدام بقية التبويبات وانشرها وانتظر تاريخ البداية لتسجيل الحضور وإصدار التقرير. تتبع التسجيلات الثلاثة نفس التدقيق التوضيحي عبر الخطة والحضور وعدم مطابقة بسيطة بإجراءاتها ثم التقرير الصادر.',
  },
  startRoute: '/organization/internal-audit/register',
  actionLabel: {
    en: 'Open Audit Register',
    ar: 'افتح سجل التدقيق',
  },
  icon: 'clipboard-notes',
  prerequisites: [
    {
      en: 'Audit standards, activities, departments and employee records prepared in the organization settings.',
      ar: 'معايير وأنشطة التدقيق والأقسام والموظفون مجهزون في إعدادات المؤسسة.',
    },
    {
      en: 'An agreed scope, audit team, lead auditor, schedule and permission for the audit workflow.',
      ar: 'نطاق وفريق وقائد وجدول متفق عليها وصلاحيات دورة التدقيق.',
    },
    {
      en: 'Use the real audit date for operational records. The demonstration plan is dated on its recording day so attendance and report are available.',
      ar: 'استخدم تاريخ التدقيق الحقيقي للسجلات التشغيلية. خطة العرض مؤرخة بيوم التسجيل لإتاحة الحضور والتقرير.',
    },
  ],
  steps: [
    {
      id: 'register',
      title: {
        en: 'Start from the audit register',
        ar: 'ابدأ من سجل التدقيق',
      },
      summary: {
        en: 'Review existing audits before creating a plan.',
        ar: 'راجع التدقيقات الموجودة قبل إنشاء الخطة.',
      },
      instructions: [
        {
          en: 'Open Audit Register. Use the audit number, status, date and scope filters to find a record. Open resumes that audit; New Audit Plan starts a separate plan.',
          ar: 'افتح السجل واستخدم فلاتر الرقم والحالة والتاريخ والنطاق. فتح يستكمل التدقيق الموجود وخطة جديدة تبدأ تدقيقاً منفصلاً.',
        },
      ],
    },
    {
      id: 'overview',
      title: {
        en: 'Define dates, scope and team',
        ar: 'حدد التواريخ والنطاق والفريق',
      },
      summary: {
        en: 'Choose company-wide or a project, then standards and auditors.',
        ar: 'اختر الشركة أو المشروع ثم المعايير والمدققين.',
      },
      instructions: [
        {
          en: 'Set start and end dates, keeping end on or after start. Choose Full Company or the intended project in Focus Area, and select the audit standards.',
          ar: 'حدد البداية والنهاية بحيث لا تسبق النهاية البداية واختر كامل الشركة أو المشروع في النطاق وحدد المعايير.',
        },
        {
          en: 'Select Audit Team members and a Lead Auditor from that team. Changing the team may require selecting the lead again.',
          ar: 'اختر أعضاء الفريق ثم قائد تدقيق من نفس الفريق وقد يلزم إعادة اختيار القائد بعد تغيير الفريق.',
        },
      ],
    },
    {
      id: 'schedule',
      title: {
        en: 'Build scope and schedule',
        ar: 'جهز النطاق والجدول',
      },
      summary: {
        en: 'Each schedule row must match the scope and audit period.',
        ar: 'يجب أن يتوافق كل صف جدول مع النطاق وفترة التدقيق.',
      },
      instructions: [
        {
          en: 'For every Audit Scope row, select the department/process and at least one audit activity. Add rows for additional departments.',
          ar: 'حدد لكل صف نطاق القسم أو العملية ونشاط تدقيق واحداً على الأقل وأضف صفوفاً للأقسام الأخرى.',
        },
        {
          en: 'For each schedule activity, choose start/end time, a day inside the audit period, Audit Focus from the selected scope, location and assigned auditor from the team. End time must follow start time.',
          ar: 'حدد لكل نشاط وقت البداية والنهاية ويوماً داخل الفترة وتركيزاً من النطاق والموقع ومدققاً من الفريق ويجب أن يأتي وقت النهاية بعد البداية.',
        },
        {
          en: 'Add general instructions and optional plan attachments. Use Save as Draft for incomplete work or Publish Plan once ready. Reopen the saved Planned audit from the register.',
          ar: 'أضف التعليمات والمرفقات الاختيارية واستخدم حفظ كمسودة للعمل غير المكتمل أو نشر الخطة عند جاهزيتها ثم افتح التدقيق المخطط من السجل.',
        },
      ],
    },
    {
      id: 'attendance',
      title: {
        en: 'Record opening and closing attendance',
        ar: 'سجل حضور الافتتاح والختام',
      },
      summary: {
        en: 'Attendance becomes editable after publication and the start date.',
        ar: 'يتاح تعديل الحضور بعد النشر وحلول تاريخ البداية.',
      },
      instructions: [
        {
          en: 'Open Attendance. Review the audit team and use Add Attendee for additional participants when needed.',
          ar: 'افتح الحضور وراجع الفريق واستخدم إضافة حاضر للمشاركين الإضافيين عند الحاجة.',
        },
        {
          en: 'Mark Opening meeting and Closing meeting separately for each person according to actual attendance. Choose Save Attendance and confirm the saved checks.',
          ar: 'حدد حضور الافتتاح والختام لكل شخص بشكل مستقل وفق الحضور الفعلي ثم احفظ وتحقق من العلامات.',
        },
      ],
    },
    {
      id: 'finding',
      title: {
        en: 'Create the NCR finding',
        ar: 'أنشئ نتيجة عدم المطابقة',
      },
      summary: {
        en: 'Describe the requirement, evidence and immediate correction.',
        ar: 'صف المتطلب والدليل والتصحيح الفوري.',
      },
      instructions: [
        {
          en: 'Open NCRs and choose New NCR. Choose Minor NC or Major NC, the area under review and the applicable audit standard.',
          ar: 'افتح عدم المطابقة واختر جديد ثم بسيطة أو جسيمة وحدد القسم قيد المراجعة والمعيار المنطبق.',
        },
        {
          en: 'Enter a requirement reference, a precise non-conformance description and Correction / Immediate Action. Identify the relevant root cause.',
          ar: 'اكتب مرجع المتطلب ووصفاً دقيقاً لعدم المطابقة والتصحيح أو الإجراء الفوري وحدد السبب الجذري.',
        },
        {
          en: 'Link the finding to observed evidence and the applicable requirement. The recording labels its finding as a simulation.',
          ar: 'اربط النتيجة بدليل تمت ملاحظته ومتطلب منطبق. يوضح التسجيل أن نتيجته محاكاة.',
        },
      ],
    },
    {
      id: 'actions',
      title: {
        en: 'Assign and save NCR actions',
        ar: 'عيّن إجراءات عدم المطابقة واحفظ',
      },
      summary: {
        en: 'Complete both corrective and preventive action fields.',
        ar: 'أكمل حقول الإجراء التصحيحي والوقائي.',
      },
      instructions: [
        {
          en: 'Describe the corrective action, select its assigned employee and target date. Complete the preventive action, assigned employee and target date as well.',
          ar: 'صف التصحيحي وحدد الموظف وتاريخ المستهدف وأكمل أيضاً الوقائي والموظف وتاريخ المستهدف.',
        },
        {
          en: 'Attach supporting evidence if needed and Submit NCR. Open the saved NCR from the list and confirm its finding and action owners.',
          ar: 'أرفق الأدلة عند الحاجة ثم أرسل عدم المطابقة وافتحها من القائمة للتحقق من النتيجة ومسؤولي الإجراءات.',
        },
        {
          en: 'Follow implementation and effectiveness through CAPA. Issuing the audit report does not automatically close open NCR actions.',
          ar: 'تابع التنفيذ والفاعلية من CAPA. إصدار التقرير لا يغلق إجراءات عدم المطابقة المفتوحة تلقائياً.',
        },
      ],
    },
    {
      id: 'report',
      title: {
        en: 'Complete and issue the report',
        ar: 'أكمل التقرير وأصدره',
      },
      summary: {
        en: 'The report assembles the plan, attendance and all NCRs.',
        ar: 'يجمع التقرير الخطة والحضور وجميع حالات عدم المطابقة.',
      },
      instructions: [
        {
          en: 'Open Report and review its plan, attendance and NCR sections. Resolve loading errors before using the document.',
          ar: 'افتح التقرير وراجع أقسام الخطة والحضور وعدم المطابقة وعالج أخطاء التحميل قبل استخدام المستند.',
        },
        {
          en: 'Complete Scope Clarifications, Methodology, Maintenance and Conclusion; add General observations and report attachments where applicable.',
          ar: 'أكمل توضيح النطاق والمنهجية والمتابعة والخلاصة وأضف الملاحظات والمرفقات عند الحاجة.',
        },
        {
          en: 'Use Save Draft for unfinished report text and Preview to review the document. Choose Issue Report when ready. The plan must be Planned and its start date reached.',
          ar: 'استخدم حفظ المسودة للنص غير المكتمل والمعاينة للمراجعة ثم إصدار التقرير عند الجاهزية. يجب أن تكون الخطة مخططة وقد حل تاريخ بدايتها.',
        },
      ],
    },
    {
      id: 'review',
      title: {
        en: 'Open the reported audit',
        ar: 'افتح التدقيق بعد إصدار تقريره',
      },
      summary: {
        en: 'Check the saved final record and remaining actions.',
        ar: 'راجع السجل النهائي والإجراءات المتبقية.',
      },
      instructions: [
        {
          en: 'Return to Audit Register and confirm Reported status. Open the same audit and its Report tab to review the persisted document.',
          ar: 'ارجع للسجل وتحقق من حالة تم التقرير ثم افتح نفس التدقيق وتبويب التقرير لمراجعة المستند المحفوظ.',
        },
        {
          en: 'The issued report is read-only. Preview and Export PDF provide document review and export. Track open NCR corrective/preventive actions separately through CAPA.',
          ar: 'التقرير الصادر للقراءة فقط وتتيح المعاينة وتصدير PDF مراجعة المستند وتصديره. تابع إجراءات عدم المطابقة المفتوحة بشكل منفصل من CAPA.',
        },
      ],
    },
  ],
  afterSetup: [
    {
      title: {
        en: 'Draft → Planned → Reported',
        ar: 'مسودة ← مخطط ← تم التقرير',
      },
      description: {
        en: 'A draft can be prepared before publication. Publication enables the scheduled workflow; issue the report after the audit starts and the report is ready.',
        ar: 'يمكن تجهيز المسودة قبل النشر ثم يتيح النشر دورة التدقيق المجدولة ويصدر التقرير بعد البداية وجاهزيته.',
      },
    },
    {
      title: {
        en: 'Audit versus action closure',
        ar: 'التقرير وإغلاق الإجراءات',
      },
      description: {
        en: 'An audit can be Reported while an NCR remains Open. The report records findings; CAPA follows the remaining actions and verification.',
        ar: 'قد يكون التدقيق تم التقرير وعدم المطابقة مفتوحة؛ يوثق التقرير النتائج وتتابع CAPA الإجراءات والتحقق.',
      },
    },
  ],
  questions: [
    {
      question: {
        en: 'Why are the other tabs disabled?',
        ar: 'لماذا بقية التبويبات معطلة؟',
      },
      answer: {
        en: 'Save the plan first. Attendance and report issuance also require a published plan and reaching its start date.',
        ar: 'احفظ الخطة أولاً ويتطلب الحضور وإصدار التقرير نشرها وحلول تاريخ بدايتها.',
      },
    },
    {
      question: {
        en: 'Can I use any employee as lead auditor?',
        ar: 'هل يمكن اختيار أي موظف قائداً؟',
      },
      answer: {
        en: 'The lead must be selected from the audit team. Assigned schedule auditors must also belong to that team.',
        ar: 'يجب اختيار القائد من الفريق وكذلك المدققون المعينون في الجدول.',
      },
    },
    {
      question: {
        en: 'Does Reported mean all NCRs are closed?',
        ar: 'هل تم التقرير تعني إغلاق كل عدم المطابقة؟',
      },
      answer: {
        en: 'No. The report can include open NCRs. Follow each action and its verification through the NCR/CAPA workflow.',
        ar: 'لا؛ قد يشمل التقرير حالات مفتوحة وتتابع كل إجراءاتها والتحقق منها عبر عدم المطابقة وCAPA.',
      },
    },
  ],
  recordings: [
    {
      id: 'audit-plan',
      title: {
        en: 'Plan & attendance',
        ar: 'الخطة والحضور',
      },
      description: {
        en: 'Publish the plan and save opening and closing attendance for the audit team.',
        ar: 'انشر الخطة واحفظ حضور اجتماعي الافتتاح والختام للفريق.',
      },
      gif: '/documentation/internal-audit/audit-plan.gif',
      poster: '/documentation/internal-audit/audit-plan-poster.webp',
    },
    {
      id: 'audit-ncr',
      title: {
        en: 'Create an NCR',
        ar: 'إنشاء عدم مطابقة',
      },
      description: {
        en: 'Record a simulated finding, root cause, corrective and preventive actions, then reopen the saved NCR.',
        ar: 'سجل نتيجة توضيحية وسببها وإجراءاتها التصحيحية والوقائية ثم أعد فتحها بعد الحفظ.',
      },
      gif: '/documentation/internal-audit/audit-ncr.gif',
      poster: '/documentation/internal-audit/audit-ncr-poster.webp',
    },
    {
      id: 'audit-report',
      title: {
        en: 'Issue & review the report',
        ar: 'إصدار التقرير ومراجعته',
      },
      description: {
        en: 'Complete the audit report, issue it and reopen the Reported audit from the register.',
        ar: 'أكمل التقرير وأصدره ثم أعد فتح التدقيق بعد إصدار التقرير من السجل.',
      },
      gif: '/documentation/internal-audit/audit-report.gif',
      poster: '/documentation/internal-audit/audit-report-poster.webp',
    },
  ],
}
