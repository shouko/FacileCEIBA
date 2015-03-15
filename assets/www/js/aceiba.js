
var appCtrl = {};
appCtrl.app = {

    semesterNow: "",
    courseNow: "",

    //baseUrl: "https://ceiba.ntu.edu.tw/course/f03067/app/login.php?api=1",
    baseUrl: "https://ceiba.ntu.edu.tw/course/f03067/app/aceiba_web_api.php?",
    weekNames: [
        "",
        "星期一",
        "星期二",
        "星期三",
        "星期四",
        "星期五",
        "星期六",
    ],

    semesterData: [],

    timeArray: [
        '7:10-8:00', '8:10-9:00', '9:10-10:00','10:20-11:10','11:20-12:10','12:20-13:10','13:20-14:10'
        ,'14:20-15:10','15:20-16:10','16:30-17:20','17:30-18:20','18:30-19:20'
        ,'19:25-20:15','20:25-21:15','21:20-22:10'
    ],

    courseTimeTableData: [
//        {crs_cname: "Intro to lab", course_sn:100, day: 1, slot: '234'},
    ],

    gridData: [
//        {crs_cname: "Intro to lab2", semester: "103-1", course_sn: 100},
    ],

    announcementData: [
//        {subject: "Intro to lab2", post_time: "103-1", course_sn: 100, attach: "xxx.xml", content: "blabla"},
    ],

    contentData: [
//        {unit: "1 week", notes: "sdfsdf", course_sn: 100, file_name: "xxx.xml", subject: "blabla"},
    ],

    hwData: [
//        {name: "1 week", description: "sdfsdf", course_sn: 100, file_path: "xxx.xml", pub_day: "blabla", end_date: "blabla", end_hour: "blabla"},
    ],

    // NTU CEIBA
    semesterTemplate: {},
    gridTemplate: {},
    announcementTemplate: {},
    contentTemplate: {},
    hwTemplate: {},

    studentid: "",

    // Application Constructor
    initialize: function() {
        ////////////////////
        //for (var i in appCtrl.app)
                //document.writeln("https://ceiba.ntu.edu.tw/course/f03067/app/aceiba_web_api.php?semester="+getUrlParam('accountname'));

        ///////////////////
        document.addEventListener('deviceready', this.onDeviceReady, false);

        var app = this;

        this.semesterTemplate = Handlebars.compile($('#semester_options_template').html());
        this.gridTemplate = Handlebars.compile($('#grid_template').html());
        this.announcementTemplate = Handlebars.compile($('#announcement_template').html());
        this.contentTemplate = Handlebars.compile($('#content_template').html());
        this.hwTemplate = Handlebars.compile($('#hw_template').html());

        $('#course_content').on("click", "a", function(e) {
//            alert('haha');
            e.preventDefault();
            var fileNameArr = $(this).text().trim().split('.');
            if (fileNameArr.length > 0) {
                var fileName = fileNameArr[0];
//                alert ($(this).attr('href') + ", " + fileName);
                download($(this).attr('href'), 'ceiba', fileName);
            }
        });

        $('#formTest').submit(function(e) {
            e.preventDefault();
            app.studentid = $("input[name='studentid']").val();
            if (app.studentid === "") {
                return;
            }

            app.baseUrl += "studentid="+app.studentid;

            $.mobile.changePage( "#page1", { transition: "slideup", changeHash: false });
        });

        $(document).ajaxStart(function() {
            $.mobile.loading('show');
        });

        $(document).ajaxStop(function() {
            $.mobile.loading('hide');
        });

        $('#grid_div').on("click", "a", function(e) {

        });

        $('#semester_div').on("change", "select", function() {
//            alert("get in!" + this.value);
            var url = 'index_ceiba.html' + this.value;
            location.href = url;
        });
    },

    homeBeforeShow: function(event, args) {

//        this.dump(args);

        // RECORD WHICH COURSE ARE WE IN
        if (args[1] != null) {
            tmp = args[1].split("&");
            if (tmp.length > 0) {
                this.semesterNow = tmp[0];
                if (tmp.length > 1 && tmp[1] != "0") {
                    this.courseNow = tmp[1];
                    this.showHome(false);
                    this.getCourseData(this.courseNow);
                    return;
                }
            }

        }
        this.showHome(true);

        this.getHomeData();
    },

    getHomeData: function() {
        var app = this;

        var url = app.baseUrl;
        if (app.semesterNow != "") {
            url += "&semester=" +app.semesterNow;
        }

//        alert("url = "+url);

        $.getJSON(url, function(data){

            app.studentid = data.studentid;
            app.semesterData = data.semester;
            app.gridData = data.grid;
            app.courseTimeTableData = data.calendar;

            $("#semester_div").html(app.semesterTemplate(app.semesterData));
            $("#semester_div").enhanceWithin();

            $("#grid_div").html(app.gridTemplate(app.gridData));
            $("#grid_div").enhanceWithin();

            $("#announcement_div").html(app.announcementTemplate(app.announcementData));
            $("#announcement_div").enhanceWithin();

            $("#content_div").html(app.contentTemplate(app.contentData));
            $("#content_div").enhanceWithin();

            $("#hw_div").html(app.hwTemplate(app.hwData));
            $("#hw_div").enhanceWithin();

            $("#student_id").text(app.student_id+" 您好");

            app.createCalendar();

            if (app.semesterNow == null) {
                app.semesterNow = app.semesterData[0]["semester"];
            }

        }).error(function(jqXHR, textStatus, errorThrown){ /* assign handler */
            alert("1Network error occurred!");
/*
            str = '{"semester":[{"semester":"103-1","now":1},{"semester":"102-2"},{"semester":"101-2"},{"semester":"101-1"},{"semester":"100-2"},{"semester":"100-1"},{"semester":"99-2"},{"semester":"99-1"}],"grid":[{"crs_cname":"Calendar","semester":"103-1","course_sn":0},{"crs_cname":"\u5148\u79e6\u5112\u5bb6\u54f2\u5b78","semester":"103-1","course_sn":"046368"},{"crs_cname":"\u96fb\u5b50\u5b78\u4e09","semester":"103-1","course_sn":"2a619c"},{"crs_cname":"\u666e\u901a\u7269\u7406\u5b78\u5be6\u9a57\u4e0a","semester":"103-1","course_sn":"66de35"},{"crs_cname":"\u907a\u50b3\u5b78","semester":"103-1","course_sn":"ac5ed3"},{"crs_cname":"\u6578\u8ad6\u5c0e\u8ad6\u4e00","semester":"103-1","course_sn":"ad7ea6"},{"crs_cname":"\u96fb\u5b50\u96fb\u8def\u5be6\u9a57\u4e09","semester":"103-1","course_sn":"d2f35d"},{"crs_cname":"\u8ecd\u8a13\u4e09","semester":"103-1","course_sn":"eaf086"},{"crs_cname":"\u6392\u968a\u7406\u8ad6","semester":"103-1","course_sn":"fc3169"}],"calendar":[{"slot":"678","day":2,"crs_cname":"\u6392\u968a\u7406\u8ad6","course_sn":"fc3169"},{"slot":"34","day":4,"crs_cname":"\u8ecd\u8a13\u4e09","course_sn":"eaf086"},{"slot":"567","day":3,"crs_cname":"\u6578\u8ad6\u5c0e\u8ad6\u4e00","course_sn":"ad7ea6"},{"slot":"234","day":3,"crs_cname":"\u907a\u50b3\u5b78","course_sn":"ac5ed3"},{"slot":"678","day":0,"crs_cname":"\u666e\u901a\u7269\u7406\u5b78\u5be6\u9a57\u4e0a","course_sn":"66de35"},{"slot":"2","day":0,"crs_cname":"\u96fb\u5b50\u5b78\u4e09","course_sn":"2a619c"},{"slot":"78","day":1,"crs_cname":"\u96fb\u5b50\u5b78\u4e09","course_sn":"2a619c"},{"slot":"34@","day":2,"crs_cname":"\u5148\u79e6\u5112\u5bb6\u54f2\u5b78","course_sn":"046368"},{"slot":"678","day":4,"crs_cname":"\u96fb\u5de5\u5be6\u9a57(\u5d4c\u5165\u5f0f\u7cfb\u7d71)","course_sn":null},{"slot":"34@","day":1,"crs_cname":"\u81ea\u52d5\u6a5f\u8207\u5f62\u5f0f\u8a9e\u8a00","course_sn":null},{"slot":"34","day":0,"crs_cname":"\u96fb\u78c1\u5b78\u4e8c","course_sn":null},{"slot":"6","day":1,"crs_cname":"\u96fb\u78c1\u5b78\u4e8c","course_sn":null}]}';

            data = $.parseJSON(str);

            app.semesterData = data.semester;
            app.gridData = data.grid;
            app.courseTimeTableData = data.calendar;

            $("#semester_div").html(app.semesterTemplate(app.semesterData));
            $("#semester_div").enhanceWithin();

            $("#grid_div").html(app.gridTemplate(app.gridData));
            $("#grid_div").enhanceWithin();

            app.createCalendar();

            if (app.semesterNow == null) {
                app.semesterNow = app.semesterData[0]["semester"];
            }
*/
        });



    },



    getCourseData: function(course_sn) {
        var app = this;

        if (course_sn == null) {
            return;
        }

        var url = app.baseUrl;
        if (app.semesterNow != "") {
            url += "&semester=" +app.semesterNow + "&course_sn="+course_sn;
        }

        $.getJSON(url, function(data){

//            alert("success");

            parseCourseJSON(data);

        }).error(function(jqXHR, textStatus, errorThrown){ /* assign handler */
            /* alert(jqXHR.responseText) */
            alert("2Network error occurred!");
/*
            str = '{"announcement":[],"content":[{"unit":"\u7b2c17\u9031","notes":"1\/07","subject":"\u7d9c\u5408\u8a0e\u8ad6","course_sn":"046368"},{"unit":"\u7b2c18\u9031","notes":"1\/14","subject":"\u671f\u672b\u8003","course_sn":"046368"},{"unit":"\u7b2c3\u9031","notes":"10\/01","subject":"\u300a\u8ad6\u8a9e\u300b\u89e3\u8b80\uff1a\u543e\u9053\u4e00\u4ee5\u8cab\u4e4b","course_sn":"046368"},{"unit":"\u7b2c4\u9031","notes":"10\/08","subject":"\u300a\u8ad6\u8a9e\u300b\u89e3\u8b80\uff1a\u543e\u5341\u6709\u4e94\u800c\u5fd7\u65bc\u5b78","course_sn":"046368"},{"unit":"\u7b2c5\u9031","notes":"10\/15","subject":"\u300a\u8ad6\u8a9e\u300b\u89e3\u8b80\uff1a\u77e5\u6211\u8005\u5176\u5929\u4e4e","course_sn":"046368"},{"unit":"\u7b2c6\u9031","notes":"10\/22","subject":"\u300a\u5b5f\u5b50\u2022\u516c\u5b6b\u4e11\u4e0a\u300b\u89e3\u8b80\uff1a\u6d69\u7136\u4e4b\u6c23","course_sn":"046368"},{"unit":"\u7b2c7\u9031","notes":"10\/29","subject":"\u300a\u5b5f\u5b50\u2022\u544a\u5b50\u4e0a\u300b\u89e3\u8b80\uff1a\u4eba\u6027\u7406\u8ad6","course_sn":"046368"},{"unit":"\u7b2c8\u9031","notes":"11\/05","subject":"\u671f\u4e2d\u8003","course_sn":"046368"},{"unit":"\u7b2c9\u9031","notes":"11\/12","subject":"\u300a\u5b5f\u5b50\u2022\u76e1\u5fc3\u4e0a\u300b\u89e3\u8b80\uff1a\u76e1\u5fc3\u77e5\u6027\u77e5\u5929","course_sn":"046368"},{"unit":"\u7b2c10\u9031","notes":"11\/19","subject":"\u300a\u5b5f\u5b50\u2022\u76e1\u5fc3\u4e0b\u300b\u89e3\u8b80\uff1a\u5584\uff0c\u4fe1\uff0c\u7f8e\uff0c\u5927\uff0c\u8056\uff0c\u795e","course_sn":"046368"},{"unit":"\u7b2c11\u9031","notes":"11\/26","subject":"\u300a\u8340\u5b50\u2022\u5929\u8ad6\u300b\u89e3\u8b80\uff1a\u5929\u884c\u6709\u5e38","course_sn":"046368"},{"unit":"\u7b2c12\u9031","notes":"12\/03","subject":"\u300a\u8340\u5b50\u2022\u6027\u60e1\u300b\u89e3\u8b80\uff1a\u4eba\u6027\u7406\u8ad6","course_sn":"046368"},{"unit":"\u7b2c13\u9031","notes":"12\/10","subject":"\u300a\u5468\u6613\u2022\u6587\u8a00\u300b\u89e3\u8b80\uff1a\u4fee\u8eab\u4ee5\u8aa0","course_sn":"046368"},{"unit":"\u7b2c14\u9031","notes":"12\/17","subject":"\u300a\u5927\u5b78\u300b\u89e3\u8b80\uff1a\u683c\u7269\u81f4\u77e5","course_sn":"046368"},{"unit":"\u7b2c15\u9031","notes":"12\/24","subject":"\u300a\u4e2d\u5eb8\u300b\u89e3\u8b80\uff1a\u5929\u547d\u4e4b\u8b02\u6027","course_sn":"046368"},{"unit":"\u7b2c16\u9031","notes":"12\/31","subject":"\u300a\u4e2d\u5eb8\u300b\u89e3\u8b80\uff1a\u8aa0\u7684\u54f2\u5b78","course_sn":"046368"},{"unit":"\u7b2c1\u9031","notes":"9\/17","subject":"\u5112\u5bb6\u7684\u57fa\u672c\u6027\u683c\uff1a\u80cc\u666f\u3001\u4eba\u7269\u8207\u7d93\u5178","course_sn":"046368","file_name":"1031\u5148\u79e6\u5112\u5bb6\u54f2\u5b78\u95b1\u8b80\u6750\u6599.pdf"},{"unit":"\u7b2c2\u9031","notes":"9\/24","subject":"\u300a\u8ad6\u8a9e\u300b\u89e3\u8b80\uff1a\u5bb0\u6211\u554f\u4e09\u5e74\u4e4b\u55aa","course_sn":"046368"}],"hw":[]}';
            data = $.parseJSON(str);
            app.announcementData = data.announcement;
            app.contentData = data.content;
            app.hwData = data.hw;

            $("#announcement_div").html(app.announcementTemplate(app.announcementData));
            $("#announcement_div").enhanceWithin();

            $("#content_div").html(app.contentTemplate(app.contentData));
            $("#content_div").enhanceWithin();

            $("#hw_div").html(app.hwTemplate(app.hwData));
            $("#hw_div").enhanceWithin();
*/
        });
    },

    parseCourseJSON: function(data)
    {
        var app = this;

        app.bulletin_data = data.bulletin;
        app.content_data = data.contents;
        app.content_files = data.content_files;
        app.homeworks_data = data.homeworks;

        app.dump(content_data);

        $("#announcement_div").html(app.announcementTemplate(app.bulletin_data));
        $("#announcement_div").enhanceWithin();

        $("#content_div").html(app.contentTemplate(app.content_data));
        $("#content_div").enhanceWithin();

        $("#hw_div").html(app.hwTemplate(app.homeworks_data));
        $("#hw_div").enhanceWithin();
    },

    createCalendar: function() {

        var cal_arr = new Array(15);
        for (var i = 0; i < 15; i++) {
            cal_arr[i] = new Array(6);
        }

        var cal_table = $('#calendar_table');
        cal_table.empty();

        var len = this.courseTimeTableData.length;
        for (var i = 0; i < len; i++) {
            var course = this.courseTimeTableData[i];
            if (course['slot'] != '' && course['day'] != null) {
                for (var j = 0; j < course['slot'].length; j++) {
                    var ch = course['slot'][j];
                    if (ch == "@") {
                        ch = 5;
                    } else if (ch == "A") {
                        ch = 11;
                    } else if (ch == "B") {
                        ch = 12;
                    } else if (ch == "C") {
                        ch = 13;
                    } else if (ch == "D") {
                        ch = 14;
                    }
                    else {
                        ch = parseInt(ch);
                        if (ch > 4) {
                            ++ch;
                        }
                    }

                    cal_arr[ch][course['day']] = {
                        crs_cname: course['crs_cname'],
                        course_sn: course['course_sn']
                    };
                }
            }
        }

        var tr_day = $('<tr ALIGN="CENTER" BGCOLOR="#FFFFCC"></tr>');

        for (var k = 0; k < this.weekNames.length; k++) {
            var th = $('<Th WIDTH="12%"></Th>');
            th.append(this.weekNames[k]);
            tr_day.append(th);
        }

        cal_table.append(tr_day);

        for (var slot = 0; slot < 15; slot++) {
            var tr = $("<tr class='row-a' ALIGN='LEFT' VALIGN='TOP'></tr>");

            var course_ind = slot;
            switch (course_ind) {
                case 0:
                case 1:
                case 2:
                case 3:
                case 4:
                    break;
                case 5:
                    course_ind = '@';
                    break;
                case 6:
                case 7:
                case 8:
                case 9:
                case 10:
                    --course_ind;
                    break;
                case 11:
                    course_ind = 'A';
                    break;
                case 12:
                    course_ind = 'B';
                    break;
                case 13:
                    course_ind = 'C';
                    break;
                case 14:
                    course_ind = 'D';
                    break;
                default:
                    break;
            }
            // TD for time
            var td_time = $('<TD ALIGN="CENTER" VALIGN="MIDDLE"></TD>');
            var course_text = $('<FONT SIZE="2">'+course_ind+'</FONT>');
            var course_slot = $('<FONT SIZE="1" COLOR="GRAY">'+this.timeArray[slot]+'</FONT>');

            td_time.append(course_text).append($('<br>')).append(course_slot);

            tr.append(td_time);

            for (var day = 0; day < 6; day++) {
                var td = $('<td></td>');

                var course = cal_arr[slot][day];

                if (course !== undefined) {
                    if (course["course_sn"] != null) {
                        var a = $('<a href="#page1?'+this.semesterNow+
                            ((course["course_sn"] == null) ? '' : '&'+course["course_sn"])
                            +'">'+course["crs_cname"]+'</a>');
                        var font = $('<FONT SIZE="2"></FONT>');
                        font.append(a);
                    }
                    else {
                        var font = $('<FONT SIZE="2">'+course["crs_cname"]+'</FONT>');
                    }
                    td.append(font);
                }

                tr.append(td);
            }

            cal_table.append(tr);
        }

    },

    showHome: function(show) {
        if (show) {
            $('#calendar_table_div').show();
            $('#course_content').hide();
        } else {
            $('#calendar_table_div').hide();
            $('#course_content').show();
        }

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
    },

    dump: function (obj) {
        var out = '';
        for (var i in obj) {
            out += i + ": " + obj[i] + "\n";
        }

        alert(out);

        // or, if you wanted to avoid alerts...

        var pre = document.createElement('pre');
        pre.innerHTML = out;
        document.body.appendChild(pre)
    }

};

appCtrl.router = new $.mobile.Router(
    {
//        "#post[?](\\d+)$": {handler: "postBeforeShow", events:"bs"},

//        "#course-home[?](\\d+)$": {handler: "courseHomeBeforeShow", events:"bs"},

//        "#content-post[?](\\d+)$": {handler: "contentPostBeforeShow", events:"bs"},
        "#page1(?:[?](.*))?$": {handler: "homeBeforeShow", events:"bs"},
//        "#page1[?]()[&]()$": {handler: "homeBeforeShow", events:"bs"},

//        "#course-content$": {handler: "courseContBeforeShow", events:"bs"}
    },
    appCtrl.app
);
