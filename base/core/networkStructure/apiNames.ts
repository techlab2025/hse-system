import {baseUrl} from "./baseUrl";

class ApiNames {
    private static _instance: ApiNames;

    private constructor() {
    }

    public static get instance(): ApiNames {
        if (!this._instance) {
            this._instance = new ApiNames();
        }
        return this._instance;
    }

    public baseUrl = baseUrl;

    public baseUrlAuth = "https://base.back.auth.techlabeg.com/";
    public baseCourseUrl = "https://base.back.course.techlabeg.com/";
    public baseStageUrl = "https://base.back.stage.techlabeg.com/";
    public baseLocationUrl = "https://back.base.location.techlabeg.com/";
    public baseBlogsUrl = "https://blog.api.techlabeg.com/";

    //Website
    public apiPrefix = "api/";
    public dashboardPrefix = "dashboard/";
    public employeePrefix = "employee/";


    //login_employee
    public loginEmployee = this.baseUrlAuth + this.apiPrefix + this.employeePrefix + "login";
    public logoutEmployee = this.baseUrlAuth + "logout_employee";

    //empolyee
    public AddEmployee = this.baseUrlAuth + this.dashboardPrefix + this.employeePrefix + "create_employee";
    public IndexEmployee = this.baseUrlAuth + this.dashboardPrefix + this.employeePrefix + "fetch_employees";
    public ShowEmployee = this.baseUrlAuth + this.dashboardPrefix + this.employeePrefix + "fetch_employee_details";
    public EditEmployee = this.baseUrlAuth + this.dashboardPrefix + this.employeePrefix + "update_employee";
    public DeleteEmployee = this.baseUrlAuth + this.dashboardPrefix + this.employeePrefix + "delete_employee";
    // public IndexEmployeeRoles = this.baseUrl + this.dashboardPrefix + "fetch_employee_roles";
    // public IndexEmployeeQuestions = this.baseUrl + this.dashboardPrefix + "fetch_employee_questions";

    // bank question
    public AddBankQuestion = this.baseUrl + this.dashboardPrefix + "add_bank_question";
    public IndexBankQuestion = this.baseUrl + this.dashboardPrefix + "fetch_bank_questions";
    public ShowBankQuestion = this.baseUrl + this.dashboardPrefix + "show_bank_question";
    public EditBankQuestion = this.baseUrl + this.dashboardPrefix + "edit_bank_question";
    public DeleteBankQuestion = this.baseUrl + this.dashboardPrefix + "delete_bank_question";
    public IndexBankQuestionQuestions = this.baseUrl + this.dashboardPrefix + "fetch_bank_question_questions";
    public DeleteBankQuestionQuestion = this.baseUrl + this.dashboardPrefix + "delete_bank_question_question";


    // university_education
    public AddUniversityEducation = this.baseUrl + this.dashboardPrefix + "fetch_university_education";

    public Blog = this.baseBlogsUrl + this.dashboardPrefix + "fetch_blogs";
    public ShowBlog = this.baseBlogsUrl + this.dashboardPrefix + "fetch_blog_details";
    public AddBlog = this.baseBlogsUrl + this.dashboardPrefix + "create_blog";
    public EditBlog = this.baseBlogsUrl + this.dashboardPrefix + "update_blog";
    public DeleteBlog = this.baseBlogsUrl + this.dashboardPrefix + "delete_blog";

    // hashtag blog
    public AddHashtagBlog = this.baseBlogsUrl + this.dashboardPrefix + "create_hashtag";
    public DeleteHashtagBlog = this.baseBlogsUrl + this.dashboardPrefix + "delete_hashtag";
    public EditHashtagBlog = this.baseBlogsUrl + this.dashboardPrefix + "update_hashtag";
    public HashtagBlog = this.baseBlogsUrl + this.dashboardPrefix + "fetch_hashtags";
    public ShowHashtagBlog = this.baseBlogsUrl + this.dashboardPrefix + "fetch_hashtag_details";

    public CategoryBlog = this.baseBlogsUrl + this.dashboardPrefix + "fetch_categories";
    public ShowCategoryBlog = this.baseBlogsUrl + this.dashboardPrefix + "fetch_category_details";
    public AddCategoryBlog = this.baseBlogsUrl + this.dashboardPrefix + "create_category";
    public EditCategoryBlog = this.baseBlogsUrl + this.dashboardPrefix + "update_category";
    public DeleteCategoryBlog = this.baseBlogsUrl + this.dashboardPrefix + "delete_category";

    // courses
    public AddCourse = this.baseCourseUrl + this.dashboardPrefix + "create_course";
    public DeleteCourse = this.baseCourseUrl + this.dashboardPrefix + "delete_course";
    public EditCourse = this.baseCourseUrl + this.dashboardPrefix + "update_course";
    public Course = this.baseCourseUrl + this.dashboardPrefix + "fetch_courses";
    public ShowCourse = this.baseCourseUrl + this.dashboardPrefix + "fetch_course_details";
    public ShowSimpleCourse = this.baseCourseUrl + this.dashboardPrefix + "fetch_course_detail";

    // lessons
    public AddLesson = this.baseCourseUrl + this.dashboardPrefix + "create_lesson";
    public DeleteLesson = this.baseCourseUrl + this.dashboardPrefix + "delete_lesson";
    public EditLesson = this.baseCourseUrl + this.dashboardPrefix + "update_lesson";
    public Lessons = this.baseCourseUrl + this.dashboardPrefix + "fetch_lessons";
    public ShowLesson = this.baseCourseUrl + this.dashboardPrefix + "fetch_lesson_details";


    // content
    public AddContent = this.baseCourseUrl + this.dashboardPrefix + "create_content";
    public DeleteContent = this.baseCourseUrl + this.dashboardPrefix + "delete_content";
    public EditContent = this.baseCourseUrl + this.dashboardPrefix + "update_content";
    public Content = this.baseCourseUrl + this.dashboardPrefix + "fetch_contents";
    public ShowContent = this.baseCourseUrl + this.dashboardPrefix + "fetch_content_details";


    // location

    // country
    public Locations = this.baseLocationUrl + this.dashboardPrefix + "fetch_locations";
    public Location = this.baseLocationUrl + this.dashboardPrefix + "fetch_location_details";
    public AddLocation = this.baseLocationUrl + this.dashboardPrefix + "create_location";
    public EditLocation = this.baseLocationUrl + this.dashboardPrefix + "update_location";
    public DeleteLocation = this.baseLocationUrl + this.dashboardPrefix + "delete_location";

    // Partner
    public Partners = this.baseCourseUrl + this.dashboardPrefix + "fetch_partners";
    public Partner = this.baseCourseUrl + this.dashboardPrefix + "fetch_partner_details";
    public AddPartner = this.baseCourseUrl + this.dashboardPrefix + "create_partner";
    public EditPartner = this.baseCourseUrl + this.dashboardPrefix + "update_partner";
    public DeletePartner = this.baseCourseUrl + this.dashboardPrefix + "delete_partner";

    // Certificate
    public Certificates = this.baseCourseUrl + this.dashboardPrefix + "fetch_certificates";
    public Certificate = this.baseCourseUrl + this.dashboardPrefix + "fetch_certificate_details";
    public AddCertificate = this.baseCourseUrl + this.dashboardPrefix + "create_certificate";
    public EditCertificate = this.baseCourseUrl + this.dashboardPrefix + "update_certificate";
    public DeleteCertificate = this.baseCourseUrl + this.dashboardPrefix + "delete_certificate";


    // Platform
    public Platforms = this.baseCourseUrl + this.dashboardPrefix + "fetch_platforms";
    public Platform = this.baseCourseUrl + this.dashboardPrefix + "fetch_platform_details";
    public AddPlatform = this.baseCourseUrl + this.dashboardPrefix + "create_platform";
    public EditPlatform = this.baseCourseUrl + this.dashboardPrefix + "update_platform";
    public DeletePlatform = this.baseCourseUrl + this.dashboardPrefix + "delete_platform";


    // Currency
    public Currencys = this.baseCourseUrl + this.dashboardPrefix + "fetch_currencies";
    public Currency = this.baseCourseUrl + this.dashboardPrefix + "fetch_currency_details";
    public AddCurrency = this.baseCourseUrl + this.dashboardPrefix + "create_currency";
    public EditCurrency = this.baseCourseUrl + this.dashboardPrefix + "update_currency";
    public DeleteCurrency = this.baseCourseUrl + this.dashboardPrefix + "delete_currency";



    // stage
    public Stages = this.baseStageUrl + this.dashboardPrefix + "fetch_stages";
    public AddStage = this.baseStageUrl + this.dashboardPrefix + "create_stage";
    public EditStage = this.baseStageUrl + this.dashboardPrefix + "update_stage";
    public ShowStage = this.baseStageUrl + this.dashboardPrefix + "fetch_stage_details";
    public DeleteStage = this.baseStageUrl + this.dashboardPrefix + "delete_stage";


    // Subjects
    public Subjects = this.baseStageUrl + this.dashboardPrefix + "fetch_subjects";
    public AddSubject = this.baseStageUrl + this.dashboardPrefix + "create_subject";
    public EditSubject = this.baseStageUrl + this.dashboardPrefix + "update_subject";
    public ShowSubject = this.baseStageUrl + this.dashboardPrefix + "fetch_subject_details";
    public DeleteSubject = this.baseStageUrl + this.dashboardPrefix + "delete_subject";


    // Questions
    public Question = this.baseUrl + this.dashboardPrefix + "fetch_questions";
    public AddQuestion = this.baseUrl + this.dashboardPrefix + "add_question";
    public EditQuestion = this.baseUrl + this.dashboardPrefix + "edit_question";
    public ShowQuestion = this.baseUrl + this.dashboardPrefix + "fetch_question";
    public DeleteQuestion = this.baseUrl + this.dashboardPrefix + "delete_question";


    public AddFaqs = this.baseUrl + this.dashboardPrefix + "add_faqs";
    public DeleteFaqs = this.baseUrl + this.dashboardPrefix + "delete_faqs";
    public EditFaqs = this.baseUrl + this.dashboardPrefix + "edit_faqs";
    public Faqs = this.baseUrl + this.dashboardPrefix + "show_faqs";
    public ShowFaqs = this.baseUrl + this.dashboardPrefix + "show_faqs";

}

export {ApiNames};
