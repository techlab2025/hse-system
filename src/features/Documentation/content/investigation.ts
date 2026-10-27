import type { FeatureGuide } from '../types'

export const investigationGuide: FeatureGuide = {
  slug: 'investigation',
  navigationKey: 'investigation_guide',
  icon: 'search-alt',
  title: {
    en: 'Investigations',
    ar: 'التحقيقات',
  },
  summary: {
    en: 'Assign a team, record findings while In Progress, close the investigation, and open its report.',
    ar: 'عيّن الفريق وسجّل النتائج أثناء التنفيذ ثم أغلق التحقيق وافتح تقريره.',
  },
  introduction: {
    en: 'An investigation develops the initial incident or observation into a reviewed explanation and an assigned action plan. The walkthrough follows a documentation incident from New through team assignment and In Progress data entry to the closed report. Investigation status is separate from the incident’s action status; closing an incident action does not replace completing its investigation.',
    ar: 'يطور التحقيق الحادث أو الملاحظة إلى تفسير تمت مراجعته وخطة إجراءات محددة المسؤوليات. يتابع التسجيل حادثاً توضيحياً من جديد إلى تعيين الفريق وإدخال البيانات أثناء التنفيذ ثم التقرير المغلق. حالة التحقيق منفصلة عن حالة إجراء الحادث؛ إغلاق إجراء الحادث لا يغني عن استكمال التحقيق.',
  },
  startRoute: '/organization/Investigating?isAll=1',
  actionLabel: {
    en: 'Open Investigations',
    ar: 'افتح التحقيقات',
  },
  recordings: [
    {
      id: 'investigation',
      title: {
        en: 'Team, findings, and closed report',
        ar: 'الفريق والنتائج والتقرير المغلق',
      },
      description: {
        en: 'Assign a team and leader, save the meeting, add investigation findings and CAPA actions, then review the closed investigation report.',
        ar: 'عيّن الفريق والقائد واحفظ الاجتماع ثم أضف نتائج التحقيق وإجراءات كابا وراجع تقرير التحقيق المغلق.',
      },
      gif: '/documentation/investigation/investigation.gif',
      poster: '/documentation/investigation/investigation-poster.webp',
    },
  ],
  prerequisites: [
    {
      en: 'An incident or observation available in the investigation register and permission to manage it.',
      ar: 'حادث أو ملاحظة متاحة في سجل التحقيقات وصلاحية إدارتها.',
    },
    {
      en: 'The investigation team, its leader, meeting date/time, and meeting platform or place.',
      ar: 'فريق التحقيق وقائده وتاريخ ووقت الاجتماع ومنصته أو مكانه.',
    },
    {
      en: 'Event facts, witness and injury information, root causes, and the people responsible for implementing and monitoring follow-up actions.',
      ar: 'وقائع الحدث وبيانات الشهود والإصابات والأسباب الجذرية ومسؤولو تنفيذ إجراءات المتابعة ومراقبتها.',
    },
  ],
  steps: [
    {
      id: 'investigation-register',
      title: {
        en: 'Find the source report',
        ar: 'ابحث عن التقرير المصدر',
      },
      summary: {
        en: 'Start with a New investigation.',
        ar: 'ابدأ بتحقيق حالته جديد.',
      },
      instructions: [
        {
          en: 'Open Investigations. Check the source report serial, project, date, location, and zone so the team is assigned to the correct event.',
          ar: 'افتح التحقيقات وراجع رقم التقرير المصدر والمشروع والتاريخ والموقع والمنطقة لتعيين الفريق للواقعة الصحيحة.',
        },
        {
          en: 'For a New record, select Assign Investigation Team. Actions change with the investigation status.',
          ar: 'للسجل الجديد اختر تعيين فريق التحقيق؛ تتغير الإجراءات حسب حالة التحقيق.',
        },
      ],
    },
    {
      id: 'investigation-team',
      title: {
        en: 'Assign team and meeting',
        ar: 'عيّن الفريق والاجتماع',
      },
      summary: {
        en: 'Choose responsible people and coordinate the first review.',
        ar: 'حدد المسؤولين ونسّق المراجعة الأولى.',
      },
      instructions: [
        {
          en: 'Select the investigation team members, then select a team leader from those selected members.',
          ar: 'اختر أعضاء فريق التحقيق ثم اختر القائد من الأعضاء المحددين أنفسهم.',
        },
        {
          en: 'Set the meeting date and time. Choose Google Meet, Zoom, Skype, Teams, or Other. For Other, enter the meeting place.',
          ar: 'حدد تاريخ ووقت الاجتماع واختر جوجل ميت أو زووم أو سكايب أو تيمز أو أخرى، وأدخل المكان عند اختيار أخرى.',
        },
        {
          en: 'Review the meeting details and Confirm. Return to the register and verify that the investigation is In Progress.',
          ar: 'راجع بيانات الاجتماع وأكد، ثم عد إلى السجل وتحقق من انتقال التحقيق إلى قيد التنفيذ.',
        },
      ],
    },
    {
      id: 'investigation-evidence',
      title: {
        en: 'Open the In Progress investigation',
        ar: 'افتح التحقيق قيد التنفيذ',
      },
      summary: {
        en: 'Review the identification and existing evidence first.',
        ar: 'راجع تعريف الواقعة والأدلة الحالية أولاً.',
      },
      instructions: [
        {
          en: 'Select Add Investigation Result for the In Progress record. Review Incident Identification and the regulatory references that apply.',
          ar: 'اختر إضافة نتيجة التحقيق للسجل قيد التنفيذ وراجع تعريف الحادث والمراجع التنظيمية المنطبقة.',
        },
        {
          en: 'Open Immediate Action Evaluation. Choose the evaluation and explain your notes. Review the investigation team and meeting details.',
          ar: 'افتح تقييم الإجراء الفوري واختر التقييم واكتب الملاحظات ثم راجع الفريق وبيانات الاجتماع.',
        },
        {
          en: 'Use Events Timeline for the sequence of events. Each started timeline row needs both a time and a description.',
          ar: 'استخدم تسلسل الأحداث لترتيب الوقائع؛ يحتاج كل صف تمت تعبئته إلى وقت ووصف معاً.',
        },
      ],
    },
    {
      id: 'investigation-people',
      title: {
        en: 'Review health impact and witnesses',
        ar: 'راجع الأثر الصحي والشهود',
      },
      summary: {
        en: 'Reconcile the original report with the investigation findings.',
        ar: 'طابق التقرير الأصلي مع نتائج التحقيق.',
      },
      instructions: [
        {
          en: 'Open Health Impact Integration and review the injury records carried from the incident. Correct or complete the person and injury description where needed.',
          ar: 'افتح تكامل الأثر الصحي وراجع سجلات الإصابات المنقولة من الحادث وصحح الشخص ووصف الإصابة أو استكملهما عند الحاجة.',
        },
        {
          en: 'Open Witnesses Management, verify the witness identity and statement, and add further relevant evidence when available. Remove unused rows.',
          ar: 'افتح إدارة الشهود وتحقق من هوية الشاهد وشهادته وأضف الأدلة المنطبقة عند توفرها واحذف الصفوف غير المستخدمة.',
        },
      ],
    },
    {
      id: 'investigation-causes',
      title: {
        en: 'Analyze root causes',
        ar: 'حلل الأسباب الجذرية',
      },
      summary: {
        en: 'Record the explanation that supports the action plan.',
        ar: 'سجّل التفسير الذي تستند إليه خطة الإجراءات.',
      },
      instructions: [
        {
          en: 'Use the 5 Whys questions and answers to explain why the event occurred. Select contributing factors and their subfactors when applicable.',
          ar: 'استخدم أسئلة لماذا وإجاباتها لشرح سبب الواقعة وحدد العوامل المساهمة والعوامل الفرعية عند انطباقها.',
        },
        {
          en: 'If Other is selected, enter its factor text. Select identified root causes from the available lookup where applicable.',
          ar: 'إذا اخترت أخرى فاكتب وصف العامل، واختر الأسباب الجذرية المحددة من القائمة عند انطباقها.',
        },
      ],
    },
    {
      id: 'investigation-actions',
      title: {
        en: 'Build corrective and preventive actions',
        ar: 'أنشئ الإجراءات التصحيحية والوقائية',
      },
      summary: {
        en: 'Turn findings into tasks with clear accountability.',
        ar: 'حوّل النتائج إلى مهام واضحة المسؤولية.',
      },
      instructions: [
        {
          en: 'Corrective actions address the current problem; preventive actions reduce recurrence. For each started row, enter the action, implementation responsibility, monitoring responsibility, and target date.',
          ar: 'تعالج الإجراءات التصحيحية المشكلة الحالية وتقلل الوقائية تكرارها. أدخل لكل صف الإجراء ومسؤول التنفيذ ومسؤول المراقبة وتاريخ الاستحقاق.',
        },
        {
          en: 'Use Ongoing only when an action has no completion date. Do not leave a partially completed task row in the action plan.',
          ar: 'استخدم مستمر فقط عندما لا يوجد تاريخ إكمال للإجراء، ولا تترك صف مهمة غير مكتمل.',
        },
        {
          en: 'Add the lessons learned and appropriate attachments. Review similar incidents when the retrieval panel provides matches.',
          ar: 'أضف الدروس المستفادة والمرفقات المناسبة وراجع الحوادث المشابهة عندما يوفر قسم الاسترجاع نتائج.',
        },
      ],
    },
    {
      id: 'investigation-close',
      title: {
        en: 'Finish or arrange another meeting',
        ar: 'أكمل التحقيق أو حدد اجتماعاً آخر',
      },
      summary: {
        en: 'The final meeting decision controls whether work continues.',
        ar: 'يحدد قرار الاجتماع الأخير استمرار العمل أو اكتماله.',
      },
      instructions: [
        {
          en: 'Open Another Meeting. Choose Yes if further investigation is required and complete its date, time, platform, and place when applicable.',
          ar: 'افتح اجتماع آخر واختر نعم عند الحاجة لمزيد من التحقيق وأكمل التاريخ والوقت والمنصة والمكان عند الحاجة.',
        },
        {
          en: 'Choose No when the review is complete. Check all evidence, people, causes, and action tasks, then Confirm.',
          ar: 'اختر لا عند اكتمال المراجعة وتحقق من الأدلة والأشخاص والأسباب والمهام ثم أكد.',
        },
        {
          en: 'Return to Investigations and verify the resulting status. For a closed investigation, select View Results to open its reported investigation.',
          ar: 'عد إلى التحقيقات وراجع الحالة الناتجة ثم اختر عرض النتائج للتحقيق المغلق لفتح تقريره.',
        },
      ],
    },
    {
      id: 'investigation-report',
      title: {
        en: 'Review the closed report and CAPA',
        ar: 'راجع التقرير المغلق وإجراءات كابا',
      },
      summary: {
        en: 'Check that the saved record matches the completed review.',
        ar: 'تحقق من مطابقة السجل المحفوظ للمراجعة المكتملة.',
      },
      instructions: [
        {
          en: 'Review the report identification, team and meeting, timeline, health impact, witnesses, root-cause analysis, actions, and lessons learned.',
          ar: 'راجع تعريف التقرير والفريق والاجتماع والتسلسل والأثر الصحي والشهود وتحليل الأسباب والإجراءات والدروس المستفادة.',
        },
        {
          en: 'Use the report printing/export action when available. Continue action execution and status updates in CAPA; a closed investigation can still have action tasks awaiting completion.',
          ar: 'استخدم طباعة التقرير أو تصديره عند توفرها وتابع التنفيذ وتحديث الحالات في كابا؛ قد تظل مهام الإجراءات غير مكتملة رغم إغلاق التحقيق.',
        },
      ],
    },
  ],
  afterSetup: [
    {
      title: {
        en: 'Investigation versus action status',
        ar: 'حالة التحقيق وحالة الإجراء',
      },
      description: {
        en: 'Investigation completion records the review outcome. CAPA task status records whether each assigned action has actually been implemented and verified.',
        ar: 'يسجل اكتمال التحقيق نتيجة المراجعة بينما تسجل حالة مهمة كابا ما إذا كان كل إجراء قد نُفذ وتم التحقق منه.',
      },
    },
    {
      title: {
        en: 'Further meetings',
        ar: 'اجتماعات إضافية',
      },
      description: {
        en: 'Use another meeting when evidence or review is incomplete. Record each meeting outcome rather than closing an unfinished investigation.',
        ar: 'استخدم اجتماعاً آخر عندما تكون الأدلة أو المراجعة غير مكتملة وسجّل نتيجة كل اجتماع بدلاً من إغلاق تحقيق غير مكتمل.',
      },
    },
  ],
  questions: [
    {
      question: {
        en: 'Why is Add Investigation Result unavailable?',
        ar: 'لماذا لا تظهر إضافة نتيجة التحقيق؟',
      },
      answer: {
        en: 'A New investigation needs a team and meeting first. Check the investigation status and your permissions.',
        ar: 'يحتاج التحقيق الجديد إلى فريق واجتماع أولاً؛ راجع حالة التحقيق وصلاحياتك.',
      },
    },
    {
      question: {
        en: 'Must the team leader be in the selected team?',
        ar: 'هل يجب أن يكون القائد ضمن الفريق المختار؟',
      },
      answer: {
        en: 'Yes. Select the team first, then choose one of its members as leader.',
        ar: 'نعم؛ اختر الفريق أولاً ثم اختر أحد أعضائه قائداً.',
      },
    },
    {
      question: {
        en: 'Does closing the investigation complete every CAPA task?',
        ar: 'هل يؤدي إغلاق التحقيق إلى إكمال جميع مهام كابا؟',
      },
      answer: {
        en: 'No. Review and update the corrective and preventive tasks separately in their details.',
        ar: 'لا؛ راجع المهام التصحيحية والوقائية وحدّثها بصورة منفصلة داخل تفاصيلها.',
      },
    },
  ],
}
