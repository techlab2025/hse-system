import { guideText as text, type FeatureGuide } from '../types'

export const employeeGuide: FeatureGuide = {
  slug: 'employee',
  navigationKey: 'employee_guide',
  icon: 'user-check',
  title: text('Employees', 'الموظفون'),
  summary: text(
    'Create an employee profile, assign a position, and configure workspace access.',
    'أنشئ ملف الموظف وحدد المسمى الوظيفي وصلاحيات الوصول لمساحة العمل.',
  ),
  introduction: text(
    'Employee profiles connect people to organization positions and project assignments. The form separates contact information, organization details, and access permissions. The demonstration creates a regular employee using example contact details with dashboard access disabled.',
    'تربط ملفات الموظفين الأشخاص بالمسميات الوظيفية وتعيينات المشاريع. يفصل النموذج بيانات الاتصال والتفاصيل التنظيمية وصلاحيات الوصول. ينشئ المثال موظفاً عادياً ببيانات اتصال توضيحية مع تعطيل الدخول إلى لوحة التحكم.',
  ),
  startRoute: '/organization/organization-employee?type=3',
  actionLabel: text('Open Employees', 'افتح الموظفين'),
  recordings: [
    {
      id: 'employee',
      title: text('Create an employee', 'إضافة موظف'),
      description: text(
        'Fill the employee profile, select a position, review access settings, save, and verify the saved employee in the list.',
        'املأ بيانات الموظف واختر المسمى الوظيفي وراجع إعدادات الوصول ثم احفظ وتحقق من الموظف في القائمة.',
      ),
      gif: '/documentation/employee/employee.gif',
      poster: '/documentation/employee/employee-poster.webp',
    },
  ],
  prerequisites: [
    text(
      'Permission to view and add organization employees. Prepare the employee name, phone country code, phone number, and email address.',
      'صلاحية عرض موظفي المؤسسة وإضافتهم مع تجهيز الاسم وكود دولة الهاتف ورقمه والبريد الإلكتروني.',
    ),
    text(
      'An organization position to assign. Create a missing position from organization setup or the New action when available.',
      'مسمى وظيفي داخل المؤسسة للتعيين. أضف المسمى الناقص من الإعدادات التنظيمية أو إجراء جديد عند توفره.',
    ),
    text(
      'Decide whether the employee needs dashboard access and which roles match their responsibilities.',
      'حدد ما إذا كان الموظف يحتاج إلى دخول لوحة التحكم والأدوار المناسبة لمسؤولياته.',
    ),
  ],
  steps: [
    {
      id: 'employee-open',
      title: text('Open the employee form', 'افتح نموذج الموظف'),
      summary: text('Start from the organization employee list.', 'ابدأ من قائمة موظفي المؤسسة.'),
      instructions: [
        text(
          'Open Employees and select Add Employee. Leave automatic serial generation enabled, or enter a unique serial when the organization uses manual numbering.',
          'افتح الموظفين واختر إضافة موظف. اترك توليد الرقم التسلسلي تلقائياً أو أدخل رقماً فريداً إذا كانت المؤسسة تستخدم الترقيم اليدوي.',
        ),
      ],
    },
    {
      id: 'employee-profile',
      title: text('Enter profile and contact details', 'أدخل بيانات الملف والاتصال'),
      summary: text(
        'Use the information that identifies and contacts the employee.',
        'أدخل البيانات التي تُستخدم لتعريف الموظف والتواصل معه.',
      ),
      instructions: [
        text(
          'Enter the full employee name. Select the phone country code, then enter the phone number in the separate phone field.',
          'اكتب اسم الموظف كاملاً واختر كود دولة الهاتف ثم اكتب الرقم في الحقل المنفصل.',
        ),
        text(
          'Enter the email address. Add an employee image if available; the image is optional.',
          'أدخل البريد الإلكتروني وأضف صورة للموظف عند توفرها؛ الصورة اختيارية.',
        ),
      ],
    },
    {
      id: 'employee-position',
      title: text('Assign the organization position', 'حدد المسمى الوظيفي'),
      summary: text(
        'Connect the employee to the correct organization hierarchy.',
        'اربط الموظف بالهيكل التنظيمي الصحيح.',
      ),
      instructions: [
        text(
          'Select the position under Organization and workspace. Check the department shown beside the position when there are similar names.',
          'اختر المسمى الوظيفي ضمن المؤسسة ومساحة العمل، وراجع اسم القسم بجواره عند تشابه المسميات.',
        ),
        text(
          'When dashboard access is enabled, set the employee password using the password field. The password stays masked in the form.',
          'عند تفعيل الدخول إلى لوحة التحكم حدد كلمة مرور الموظف في حقلها؛ تظل كلمة المرور مخفية في النموذج.',
        ),
      ],
    },
    {
      id: 'employee-access',
      title: text('Review access and permissions', 'راجع الوصول والصلاحيات'),
      summary: text(
        'Choose the access appropriate for this employee.',
        'اختر الوصول المناسب لهذا الموظف.',
      ),
      instructions: [
        text(
          'Admin Permission controls the administration access level. Turn it off for a regular employee.',
          'يتحكم خيار صلاحية المدير في مستوى الوصول الإداري؛ عطّله للموظف العادي.',
        ),
        text(
          'Dashboard Access controls whether the employee can sign in. An employee profile can be recorded without enabling dashboard access, as shown in the walkthrough.',
          'يحدد دخول لوحة التحكم إمكانية تسجيل الدخول. يمكن تسجيل ملف موظف دون تفعيل الدخول كما في الشرح العملي.',
        ),
        text(
          'Keep All Permissions off when assigning specific roles, then select the roles in Permissions. Review these choices before saving.',
          'اترك جميع الصلاحيات معطلاً عند تعيين أدوار محددة ثم اختر الأدوار من حقل الصلاحيات، وراجع الخيارات قبل الحفظ.',
        ),
      ],
    },
    {
      id: 'employee-save',
      title: text('Save and check the employee', 'احفظ وراجع الموظف'),
      summary: text(
        'Verify the newly saved profile in the employee list.',
        'تحقق من الملف المحفوظ في قائمة الموظفين.',
      ),
      instructions: [
        text(
          'Select Save to create the profile and return to Employees. Save and New creates it and resets the form for another employee.',
          'اضغط حفظ لإنشاء الملف والعودة إلى الموظفين. ينشئ حفظ وجديد الملف ويعيد ضبط النموذج لإضافة موظف آخر.',
        ),
        text(
          'Correct highlighted fields if validation appears. Check the success result before trying again to avoid adding the same employee twice.',
          'صحح الحقول المحددة عند ظهور رسائل التحقق. تأكد من نتيجة الحفظ قبل المحاولة مجدداً لتجنب تكرار الموظف.',
        ),
        text(
          'Find the saved row and verify the name, position, email, and phone. Use the row action menu to edit the employee when needed.',
          'ابحث عن الصف المحفوظ وراجع الاسم والمسمى والبريد والهاتف. استخدم قائمة إجراءات الصف لتعديل الموظف عند الحاجة.',
        ),
      ],
    },
  ],
  afterSetup: [
    {
      title: text('Project assignment', 'التعيين للمشاريع'),
      description: text(
        'Saving an organization employee does not assign them to every project. Use project setup Positions and Teams, or project resource management, to assign the employee to the intended location and team.',
        'لا يؤدي حفظ موظف المؤسسة إلى تعيينه لكل المشاريع. استخدم المسميات والفرق في إعداد المشروع أو إدارة موارده لتعيين الموظف للموقع والفريق المناسبين.',
      ),
    },
    {
      title: text('Update the profile', 'تحديث الملف'),
      description: text(
        'Open the row action menu and Edit to update contact information, position, and access settings. Review the saved row after updating.',
        'افتح قائمة إجراءات الصف ثم التعديل لتحديث الاتصال والمسمى وإعدادات الوصول، وراجع الصف بعد الحفظ.',
      ),
    },
    {
      title: text('Find employees', 'البحث عن الموظفين'),
      description: text(
        'Use the list filters to narrow the displayed employees. A project selection can affect project-related employee views; organization profiles and project assignments are separate records.',
        'استخدم فلاتر القائمة لتحديد الموظفين المعروضين. قد يؤثر اختيار المشروع في قوائم موظفي المشروع؛ ملفات المؤسسة وتعيينات المشاريع سجلات منفصلة.',
      ),
    },
  ],
  questions: [
    {
      question: text(
        'Can I add an employee without dashboard access?',
        'هل يمكن إضافة موظف دون دخول لوحة التحكم؟',
      ),
      answer: text(
        'Yes. Disable Dashboard Access and review the remaining profile and position fields before saving.',
        'نعم، عطّل دخول لوحة التحكم وراجع بقية بيانات الملف والمسمى قبل الحفظ.',
      ),
    },
    {
      question: text(
        'Why can I not find this employee in a project team?',
        'لماذا لا يظهر الموظف ضمن فريق المشروع؟',
      ),
      answer: text(
        'First assign the employee to a project location and position. Team member choices come from the employees assigned to that project.',
        'عيّن الموظف أولاً لموقع ومسمى داخل المشروع؛ تأتي خيارات أعضاء الفرق من الموظفين المعيّنين للمشروع.',
      ),
    },
    {
      question: text('What should I check if saving fails?', 'ماذا أراجع عند فشل الحفظ؟'),
      answer: text(
        'Read the displayed validation message and check name, contact details, position, password where required, and any duplicate email or phone reported by the server.',
        'اقرأ رسالة التحقق وراجع الاسم وبيانات الاتصال والمسمى وكلمة المرور عند طلبها وأي تكرار للبريد أو الهاتف يذكره الخادم.',
      ),
    },
  ],
}
