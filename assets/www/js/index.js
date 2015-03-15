var appCtrl = {};
appCtrl.app = {

    courseData: [ {title: "探索台灣：人文與社會 "},
                {title: "通信原理 "},
                {title: "數位語音處理概論 "},
                {title: "專題演講 "},
                {title: "書報討論（二）"},
                {title: "電工實驗(網路與多媒體) "}
    ],

    courseHomeData: [
                {title: "教師資訊"},
                {title: "公佈欄"},
                {title: "課程內容 "},
                {title: "作業區 "},
    ],

    courseContentData: [
                {date:"2/18", title: "講題：奈米磁性粒子在生物醫學的應用 講者：物理系 傅昭銘教授，3F演講廳",
                 file_name:"Biosketch of JM Fang-140210.pdf" , file_link:"https://ceiba.ntu.edu.tw/course/987afe/content/Biosketch%20of%20JM%20Fang-140210.pdf"
                },

                {date:"2/25", title: " 講題：從有機化學到醫藥開發 講者：化學系 方俊明教授",
                 file_name:"Biosketch of JM Fang-140210.pdf" , file_link:"https://ceiba.ntu.edu.tw/course/987afe/content/Biosketch%20of%20JM%20Fang-140210.pdf"
                },

                {date:"3/04", title: "王珮驊: Copper Chaperone-Dependent and -Independent Activation of Three Copper-Zinc Superoxide Dismutase Homologs Localized in Different Cellular Compartments in Arabidopsis",
                 file_name:"彭湛傑paper.pdf", file_link:"https://ceiba.ntu.edu.tw/course/987afe/content/%E5%BD%AD%E6%B9%9B%E5%82%91paper.pdf"
                },

                {date:"3/18", title: "黃怡諶: Parvalbumin-expressing basket-cell network plasticity induced by experience regulates adult learning Flavio Donato1  ",
                 file_name:"黃怡諶paper.pdf" , file_link:"https://ceiba.ntu.edu.tw/course/987afe/content/%E9%BB%83%E6%80%A1%E8%AB%B6paper.pdf"
                }
    ],


    courseListTemplate: {},
    courseContentListTemplate: {},
    courseHomeListTemplate: {},
    contentPostTemplate: {},

    course: {},
    contentPost: {},

    blogData: [ {title: "Introduction", body: "What is your favorite platform? IOS or Android?"},
                {title: "jQuery Template", body: "What's a project template to started with jquery mobile?"}
    ],

    blogListTemplate: {},
    postTemplate: {},

    post: {},
    savedPosts: {},

    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        this.postTemplate = Handlebars.compile($('#post-template').html());
        this.blogListTemplate = Handlebars.compile($('#blog-list-template').html());
        this.courseListTemplate = Handlebars.compile($('#course-list-template').html());
        this.courseHomeListTemplate = Handlebars.compile($('#course-home-list-template').html());
        this.courseContentListTemplate = Handlebars.compile($('#course-content-list-template').html());
        this.contentPostTemplate = Handlebars.compile($('#content-post-template').html());

        var app = this;
        $("#course-content-refresh-btn").click(function() {
            app.get_blog_data();
        });

        $("#post-save-btn").click(function() {
            if (app.savedPosts[app.post.url] === undefined) {
                app.savedPosts[app.post.url] = app.post.title;
            } else {
                delete app.savedPosts[app.post.url];
            }

            app.updatePostSaveButton();
        });
    },

    homeBeforeCreate: function(event, args) {
        this.get_course_data();
    },

    get_course_data: function() {
        var app = this;
        $("#home-content").html(app.courseListTemplate(app.courseData));
        $("#home-content").enhanceWithin();
    },

    courseHomeBeforeShow: function(event, args) {
        // RECORD WHICH COURSE ARE WE IN
        this.course = this.courseData[args[1]];

        $("#course-home-content").html(this.courseHomeListTemplate(this.courseHomeData));
        $("#course-home-content").enhanceWithin();

    },

    courseContBeforeShow: function(event, args) {
        $("#course-content-content").html(this.courseContentListTemplate(this.courseContentData));
        $("#course-content-content").enhanceWithin();
    },

    contentPostBeforeShow: function(event, args) {
        this.contentPost = this.courseContentData[args[1]];

        $("#content-post-content").html(this.contentPostTemplate(this.contentPost));
        $("#content-post-content").enhanceWithin();

        $("#content-post-content a").click(function(e) {
            window.open(this.href, '_blank', 'location=yes');
            return false;
        });
    },

    get_blog_data: function() {
        var app = this;
        $.get("http://app-o-mat.com/videofeed/", function(data) {
            app.blogData = $(data).find("item").map(function(i, item) {
                return {
                    url: $(item).find("link").text(),
                    title: $(item).find("title").text(),
                    body: $(item).find("description").text()
                };
            }).toArray();
            $("#course-content-content").html(app.blogListTemplate(app.blogData));
            $("#course-content-content").enhanceWithin();
        });
    },

    updatePostSaveButton: function() {
        if (this.savedPosts[this.post.url] === undefined) {
            $("#post-save-btn").text("Save").removeClass("ui-btn-b");
        } else {
            $("#post-save-btn").text("Saved").addClass("ui-btn-b");
        }
    },

    postBeforeShow: function(event, args) {
        this.post = this.blogData[args[1]];
        $("#post-content").html(this.postTemplate(this.post));
        $("#post-content").enhanceWithin();
        $("#post-content a").click(function(e) {
            window.open(this.href, '_blank', 'location=yes');
            return false;
        });

        this.updatePostSaveButton();
    },

    onDeviceReady: function() {
        FastClick.attach(document.body);
    }

};

appCtrl.router = new $.mobile.Router(
    {
        "#post[?](\\d+)$": {handler: "postBeforeShow", events:"bs"},

        "#course-home[?](\\d+)$": {handler: "courseHomeBeforeShow", events:"bs"},

        "#content-post[?](\\d+)$": {handler: "contentPostBeforeShow", events:"bs"},

        "#home$": {handler: "homeBeforeCreate", events:"bc"},
        "#course-content$": {handler: "courseContBeforeShow", events:"bs"}
    },
    appCtrl.app
);
