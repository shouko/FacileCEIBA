var appCtrl = {};
appCtrl.app = {

    semesterNow: "",
    courseNow: "0",
    student_cname: null,
    student_id: null,
    // baseFileName: "index_ceiba_all_access.html",
    baseFileName: "index_ceiba.html",

    // baseUrl: "https://ceiba.ntu.edu.tw/course/f03067/app/web/aceiba_web_api.php?",
    baseUrl: "https://ceiba.ntu.edu.tw/course/f03067/app/login.php?api=1&",

    baseLogoutUrl: "https://ceiba.ntu.edu.tw/course/f03067/app/web/logout_web.php",
    weekNames: [
        "",
        "一",
        "二",
        "三",
        "四",
        "五",
        "六",
    ],

    semesterData: [],

    timeArray: [
        '7:10-8:00', '8:10-9:00', '9:10-10:00','10:20-11:10','11:20-12:10','12:20-13:10','13:20-14:10'
        ,'14:20-15:10','15:20-16:10','16:30-17:20','17:30-18:20','18:30-19:20'
        ,'19:25-20:15','20:25-21:15','21:20-22:10'
    ],

    courseTimeTableData: [],
    gridData: [],
    course_lang: undefined,
    course_info: undefined,
    teacher_info: [],
    bulletin_data: [],
    content_data: [],
    homeworks_data: [],
    boardData: [],
    course_grade: [],
    board_is_open: false,

    // NTU CEIBA
    semesterTemplate: {},
    gridTemplate: {},
    courseInfoTemplate: {},
    teacherInfoTemplate: {},
    announcementTemplate: {},
    contentTemplate: {},
    hwTemplate: {},
    boardHeaderTemplate: {},
    boardPostTemplate: {},
    boardPostContentTemplate: {},
    boardPostHeader: {},
    gradeTemplate: {},

    boardTopicIndex: 0,
    boardTopicPostIndex: 0,
    boardPostsn: 0,

    jqXHR: null,

    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);

        app = this;

        // INITIALIZE HANDLEBAR LIBS VARIABLE
        this.initializeHandleBars();

        // REGISTER DOWNLOAD EVENT ON HTTP://
        this.registerDownloadEventOnUrl();

        // ADD AJAX LOADING ICON
        this.preSetupAjax();

        // REGISTER SEMESTER BTN EVENT
        $('#semester_div').on("change", "select", function() {
            var url = app.baseFileName + this.value;
            location.href = url;
        });

        // REGISTER LOGOUT BTN
        $('#logout_div').click(function() {
            location.href = app.baseLogoutUrl;
        });

        // REGISTER START SCREEN FORM, default set student_id = b99b01078
        $('#formTest').submit(function(e) {
            e.preventDefault();
            app.student_id = $("input[name='student_id']").val();
            if (app.student_id == "") {
                // return;
                app.student_id = "b99b01078";
            }

            app.baseUrl += "student_id="+app.student_id;
            $.mobile.changePage( "#page1", { transition: "slideup", changeHash: false });
        });

    },

    initializeHandleBars: function()
    {
        var app = this;
        this.semesterTemplate = Handlebars.compile($('#semester_options_template').html());
        this.gridTemplate = Handlebars.compile($('#grid_template').html());
        this.courseInfoTemplate = Handlebars.compile($('#course_info_template').html());
        this.teacherInfoTemplate = Handlebars.compile($('#teacher_info_template').html());
        this.announcementTemplate = Handlebars.compile($('#announcement_template').html());
        this.contentTemplate = Handlebars.compile($('#content_template').html());
        this.hwTemplate = Handlebars.compile($('#hw_template').html());
        this.boardTemplate = Handlebars.compile($('#board_template').html());
        this.boardHeaderTemplate = Handlebars.compile($('#board_header_template').html());
        this.boardPostTemplate = Handlebars.compile($('#board-post-template').html());
        this.boardPostContentTemplate = Handlebars.compile($('#board-post-content-template').html());
        this.boardPostHeader = Handlebars.compile($('#board_post_content_header_template').html());
        this.gradeTemplate = Handlebars.compile($('#grade_template').html());

        Handlebars.registerHelper('list', function(context, options) {
          var ret = "<ul>";

          for(var i=0, j=context.length; i<j; i++) {
            ret = ret + "<li>" + options.fn(context[i]) + "</li>";
          }

          return ret + "</ul>";
        });

        Handlebars.registerHelper('html', function(context) {
            var out = "<p>";

            out = out + context;

            return out + "</p>";
        });

        Handlebars.registerHelper('l10n', function(keyword) {
            // var lang = (navigator.language) ? navigator.language : navigator.userLanguage; 
            var lang = (app.course_lang) ? app.course_lang : 'big5'; 
         
            // pick the right dictionary (if only one available assume it's the right one...)
            // var locale = window.locale[lang] || window.locale['en-US'] || window.locale || false;
            var locale = window.locale[lang] || window.locale['eng'] || false;

            // exit now if there's no data
            if( !locale ) return keyword;
            
            // loop through all the key hierarchy (if any)
            var target = locale;
            var key = keyword.split(".");
            for (i = 0; i < key.length; ++i){
                target = target[key[i]];
            }

            // fallback to the original string if nothing found
            target = target || keyword; 
            //output
            return target;
        });
    },

    registerDownloadEventOnUrl: function()
    {
        $('#course_content div').on("click", "a", function(e) {
            e.preventDefault();
            var fileNameArr = $(this).text().trim().split('.');
            if (fileNameArr.length > 0) {
                var fileName = fileNameArr[0];
//                alert ((this).attr('href') + ", " + fileName);
                downloadfile.download($(this).attr('href'), 'Download', fileName);
            }
        });

        $('#board-post-content').on("click", "a", function(e) {
            e.preventDefault();
            var fileNameArr = $(this).text().trim().split('.');
            if (fileNameArr.length > 0) {
                var fileName = fileNameArr[0];
//                alert ((this).attr('href') + ", " + fileName);
                downloadfile.download($(this).attr('href'), 'Download', fileName);
            }
        });
    },

    preSetupAjax: function()
    {
        // $.ajaxSetup({
        //     dataFilter: function (response, type) {
        //         response = he.decode(response);
        //         return response;
        //     }
        // });

        $(document).ajaxStart(function() {
            $.mobile.loading('show');
        });

        $(document).ajaxStop(function() {
            $.mobile.loading('hide');
        });
    },

    setGridColor: function()
    {
        var app = this;
        $("#grid_div a").each( function(i, element) {
            if ($(this).attr("id") == "grid_a_" + app.courseNow) {
                $(this).css("background-color", "#3388cc");
                $(this).css("border-color", "#3388cc");
                $(this).css("color", "#ffffff");
                $(this).css("text-shadow", "0 1px 0 #005599");
            } else {
                $(this).attr("style", "");
            }
        });

    },

    homeBeforeShow: function(event, args, ui, page, evt)
    {
        var app = this;
        evt.preventDefault();

        // RECORD WHICH COURSE ARE WE IN
        if (args[1] == null) {
            app.updateHomeView(ui);
            return;
        }

        tmp = args[1].split("&");
        if (tmp.length > 0) {
            if (app.semesterNow != tmp[0]) {
                app.semesterNow = tmp[0];
                app.updateHomeView(ui);
                return;
            }

            if (tmp.length == 1) {
                if (app.courseNow == "0") {
                    return;
                }
                app.updateHomeView(ui);
            }

            if (tmp.length > 1) {
                if (app.courseNow == tmp[1] && app.courseNow != "0") {
                    ui.bCDeferred.resolve();
                    app.showHome(false);
                    return;
                }
                app.courseNow = tmp[1];

                if (tmp[1] != "0")
                    app.updateCourseView(app.courseNow, ui);
                else {
                    app.showHome(true);

                    // Update Color
                    app.setGridColor();
                }
            }

        }
    },

    updateHomeView: function(ui)
    {
        var app = this;

        // Update Color
        app.setGridColor();

        var url = app.baseUrl;

        if (app.semesterNow != "") {
            url += "&semester=" + app.semesterNow;
        }

        // alert(url);

        $.ajax({
            dataType: "json",
            url: url,
            dataFilter: function (response, type) {
                response = he.decode(response);
                return response;
            },
            success: function(data){

                // Until finishing ajax, we show page here
                if (ui.bCDeferred != null) {
                    ui.bCDeferred.resolve();
                }

                app.semesterData = data.semester;
                app.gridData = data.grid;
                app.courseTimeTableData = data.calendar;
                app.student_cname = data.student_cname;
                if (app.student_id == "") {
                    app.student_id = data.student_id;
                }

                $.each(app.semesterData, function(i, v) {
                    if (v.now != null) {
                        app.semesterNow = v.semester;
                    }
                });

                if (app.student_cname !== null) {
                    $("#student_id").text(app.student_cname+" 您好！");
                } else {
                    $("#student_id").text(app.student_id+" 您好！");
                }

                $("#semester_div").html(app.semesterTemplate(app.semesterData));
                $("#semester_div").enhanceWithin();

                $("#grid_div").html(app.gridTemplate(app.gridData));
                $("#grid_div").enhanceWithin();

                app.createCalendar();

                if (app.semesterNow == null) {
                    app.semesterNow = app.semesterData[0].semester;
                }

                // Show the view
                app.showHome(true);

            },
            error: function(jqXHR, textStatus, errorThrown){ /* assign handler */
                /* alert(jqXHR.responseText) */

                // Until finishing ajax, we show page here
                ui.bCDeferred.resolve();
                // Error message
                window.plugins.toast.showShortBottom('連線錯誤');
            }

        });

    },

    updateCourseView: function(course_sn, ui)
    {
        var app = this;

        if (course_sn == null) {
            return;
        }

        // Update Color
        app.setGridColor();

        var url = app.baseUrl + "&semester=" +app.semesterNow + "&course_sn="+course_sn;

         $.ajax({
            dataType: "json",
            url: url,
            dataFilter: function (response, type) {
                response = he.decode(response);
                return response;
            },
            success: function(data){
                // Until finishing ajax, we show page here
                ui.bCDeferred.resolve();

                app.parseCourseJSON(data);

                app.showHome(false);

            },
            error: function(jqXHR, textStatus, errorThrown){ /* assign handler */
                // Until finishing ajax, we show page here
                ui.bCDeferred.resolve();

                // Error message
                window.plugins.toast.showShortBottom('連線錯誤');

                // alert("Network error occurred!");
            }
        });

    },

    parseCourseJSON: function(data)
    {
        var app = this;

        app.course_lang = data.lang;
        app.course_info = data.course_info;
        app.teacher_info = data.teacher_info;
        app.bulletin_data = data.bulletin;
        app.content_data = data.contents;
        app.content_files = data.content_files;
        app.homeworks_data = data.homeworks;
        app.course_grade = data.course_grade;
        app.board_is_open = data.board;

        // $("#select-choice-2").

        // Append course_info
        if (app.course_info === undefined) {
            $('#course_info_div').hide();
        } else {
            app.appendCourseInfoData();
            $("#course_info_div").html(app.courseInfoTemplate(app.course_info));
            $("#course_info_div").enhanceWithin();
            $('#course_info_div').show();
        }

        if (app.teacher_info === undefined) {
            $('#teacher_info_div').hide();
        } else {
            $("#teacher_info_div").html(app.teacherInfoTemplate(app.teacher_info));
            $("#teacher_info_div").enhanceWithin();
            $('#teacher_info_div').show();
        }

        // Append content_files to content_data
        if (app.bulletin_data === undefined) {
            $('#announcement_div').hide();
        } else {
            app.appendBulletinDatas();
            $("#announcement_div").html(app.announcementTemplate(app.bulletin_data));
            $("#announcement_div").enhanceWithin();
            $('#announcement_div').show();
        }

        // Append course_sn to bulletin
        if (app.content_data === undefined) {
            $('#content_div').hide();
        } else {
            app.appendContentFiles();
            $("#content_div").html(app.contentTemplate(app.content_data));
            $("#content_div").enhanceWithin();
            $('#content_div').show();
        }
        // Append course_sn to bulletin
        if (app.homeworks_data === undefined) {
            $('#hw_div').hide();
        } else {
            app.appendHomeworkDatas();
            $("#hw_div").html(app.hwTemplate(app.homeworks_data));
            $("#hw_div").enhanceWithin();
            $('#hw_div').show();
        }
        // Modify course grade order
        if (app.course_grade === undefined) {
            $('#grade_div').hide();
        } else {
            app.modifyCourseGradeOrder();
            $("#grade_div").html(app.gradeTemplate(app.course_grade));
            $("#grade_div").enhanceWithin();
            $('#grade_div').show();
        }

        if (app.board_is_open === undefined) {
            $('#board_btn').hide();
        } else {
            $('#board_btn').show();
        }

        // Append Listener after button is updated
        app.appendExpandBtnListener();
    },

    appendCourseInfoData: function()
    {
        var app = this;
        app.course_info['class_time'] = "";

        for (day = 1; day < 7; day++) {
            if (app.course_info['day'+day] !== undefined) {
                app.course_info['class_time'] += app.weekNames[day]+app.course_info['day'+day]+" ";
            }
        }
    },

    appendHomeworkDatas: function()
    {
        var app = this;

        $.each(app.homeworks_data, function(ci, cv) {
            if (cv.is_subm == "0") {
                app.homeworks_data[ci].is_subm = "不行";
            } else {
                app.homeworks_data[ci].is_subm = "可以";
            }

            cv.course_sn = app.courseNow;
        });
    },

    appendBulletinDatas: function()
    {
        var app = this;

        $.each(app.bulletin_data, function(ci, cv) {
            cv.course_sn = app.courseNow;
        });
    },

    appendContentFiles: function()
    {
        var app = this;

        $.each(app.content_data, function(ci, cv) {
            cv.files = [];
            $.each(app.content_files, function(fi, fv) {
                if (cv.syl_sn === fv.syl_sn) {
                    var tmp = {};
                    tmp.file_name = fv.file_name;
                    tmp.course_sn = app.courseNow;
                    cv.files.push(tmp);
                }
            });
        });
    },

    appendExpandBtnListener: function()
    {
        // REGISTER EXPAND/COLLAPSE ALL BUTTON
        $('.expand_btn').on("click", function(e) {
            e.preventDefault();
            isCollapsed = $(this).data("isCollapsed");
            if (isCollapsed === undefined) {
                isCollapsed = true;
            }
            isCollapsed = !isCollapsed;

            $(this).data("isCollapsed", isCollapsed);
            $(this).parent().parent().parent().find(".ui-collapsible")
                .collapsible( "option", "collapsed", isCollapsed );

            return false;
        });
    },

    modifyCourseGradeOrder: function()
    {
        var app = this;

        $.each(app.course_grade, function(ci, cv) {
            if (cv.tier === "3") {
                app.course_grade.move(ci, app.course_grade.length-1);
                cv.isSem = "1";
            }
        });
    },

    createCalendar: function()
    {
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
            th.append("星期" + this.weekNames[k]);
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

            td_time.append(course_text).append(('<br>')).append(course_slot);

            tr.append(td_time);

            for (var day = 0; day < 6; day++) {
                var td = $('<td></td>');

                var course = cal_arr[slot][day];

                if (course !== undefined) {
                    var crs_cname = course['crs_cname'];
                    if (crs_cname.length > 5) {
                        crs_cname = crs_cname.substr(0,4)+"..."; 
                    }
                    if (course["course_sn"]) {
                        var a = $('<a href="#page1?'+this.semesterNow+
                            ((course["course_sn"]) ? '&'+course["course_sn"] : '')
                            +'">'+crs_cname+'</a>');
                        var font = $('<FONT SIZE="2"></FONT>');
                        font.append(a);
                    }
                    else {
                        var font = $('<FONT SIZE="2">'+crs_cname+'</FONT>');
                    }
                    td.append(font);
                }

                tr.append(td);
            }

            cal_table.append(tr);
        }

    },

    showHome: function(show)
    {
        if (show) {
            $('#calendar_table_div').show();
            $('#course_content').hide();
            $('#board_btn').hide();
        } else {
            $('#calendar_table_div').hide();
            $('#course_content').show();
        }

    },

    onDeviceReady: function()
    {
        FastClick.attach(document.body);
        // Register the event listener
    },

    boardBeforeCreate: function(event, args, ui, page, evt)
    {

        var app = this;
        // this.dump(args);

        if (args[1] == '0') {
            return;
        }

        evt.preventDefault();

        // evt.preventDefault();
        var url = app.baseUrl
            +"&semester="+app.semesterNow
            +"&course_sn="+app.courseNow
            +"&board=1";

        $("#board_page_header").html(app.boardHeaderTemplate(
            {semester: app.semesterNow, course_sn: app.courseNow}));
        $("#board_page_header").enhanceWithin();

        var p = $.getJSON(url, function(data){
            // Until finishing ajax, we show page here
            ui.bCDeferred.resolve();

            app.boardData = data;
            // app.gridData = data.grid;
            // app.courseTimeTableData = data.calendar;

            $.each(app.boardData, function(i, v) {
                if (v.board_content.length > 0) {
                    $.each(v.board_content, function(i2, v2) {
                        v2.course_sn = app.courseNow;

                        v2.post_time = v2.post_time.split('.')[0];

                        replacePattern1 = /\[\s*img[^>]*\]([^<]*)\[\s*\/\s*img\s*\]/ig;
                        v2.content = v2.content.replace(replacePattern1, '<img src="1">');

                        replacePattern1 = /\[\s*b[^>]*\]([^<]*)\[\s*\/\s*b\s*\]/ig;
                        v2.content = v2.content.replace(replacePattern1, '<strong>1</strong>');
                        console.log(v2.content);
                    });
                }
            });

            $("#board-content").html(app.boardTemplate(app.boardData));
            $("#board-content").enhanceWithin();

        }).error(function(jqXHR, textStatus, errorThrown){ /* assign handler */
            /* alert(jqXHR.responseText) */

            // Until finishing ajax, we show page here
            ui.bCDeferred.resolve();
            // Error message
            window.plugins.toast.showShortBottom('連線錯誤');
            // alert("Network error occurred!");
        });
    },

    boardPostBeforeShow: function(event, args)
    {
        var app = this;
        app.boardTopicIndex = args[1];

        var tmp = [];
        $.each(app.boardData[args[1]].board_content, function(i, v) {
            if (v.parent == "0") {
                tmp.push(v);
            }
        });

        $("#board-post").html(app.boardPostTemplate(tmp));
        $("#board-post").enhanceWithin();
    },

    boardPostContentBeforeShow: function(event, args)
    {
        var app = this;
        this.boardPostsn = args[1];
        $("#board_post_content_header").html(
            app.boardPostHeader({post_id: app.boardTopicIndex}));
        $("#board_post_content_header").enhanceWithin();

        var tmp = [];
        $.each(app.boardData[app.boardTopicIndex].board_content, function(i, v) {
            if (v.parent == app.boardPostsn) {
                tmp.push(v);
            }
            else if (v.sn == app.boardPostsn) {
                tmp.unshift(v);
            }
        });

        $("#board-post-content").html(app.boardPostContentTemplate(tmp));
        $("#board-post-content").enhanceWithin();
    },

    // Helper function
    bbcode_template: function(text)
    {
        // [b] and [/b] for bolding text.
        // text = str_replace("[b]", "<span style=\"font-weight: bold\">", text);
        // text = str_replace("[/b]", "</span>", text);

        // [i] and [/i] for italicizing text.
        // text = str_replace("[i]", "<span style=\"font-style: italic\">", text);
        // text = str_replace("[/i]", "</span>", text);
        text = text.replace(/\[i\]/g, "<span style=\"font-style: italic\">");
        text = text.replace(/\[\/i\]/g, "</span>");

        // [u] and [/u] for underlining text.
        text = text.replace(/\[u\]/g, "<span style=\"text-decoration: underline\">");
        text = text.replace(/\[\/u\]/g, "</span>");
        // text = str_replace("[u]", "<span style=\"text-decoration: underline\">", text);
        // text = str_replace("[/u]", "</span>", text);


        // [QUOTE] and [/QUOTE] for posting replies with quote, or just for quoting stuff.
        text = text.replace(/\[quote\]/g, "<div class=\"quotebox\"><p class=\"quote_head\">");
        text = text.replace(/\[\/quote\]/g, "</p></div>");
        // text = str_replace("[quote]", "<div class=\"quotebox\"><p class=\"quote_head\">", text);
        // text = str_replace("[/quote]", "</p></div>", text);

        // unordered lists
        text = text.replace(/\[list\]/g, "<ul>");
        text = text.replace(/\[\/list\]/g, "</ul>");
        // text = str_replace("[list]", "<ul>", text);
        // text = str_replace("[/list]", "</ul>", text);


        // Patterns and replacements for URL and email tags..
        // patterns = array();
        // replacements = array();

        // [img]image_url_here[/img] code..
        // This one gets first-passed..
        // text = text.replace(/\[list\]/g, "<ul>");

        // patterns[] = "#\[img\]([^?](?:[^\[]+|\[(?!url))*?)\[/img\]#i";
        // replacements[] = str_replace('{URL}', '\\1', '<img src="{URL}" border="0" />');



        // // matches a [url]xxxx://www.phpbb.com[/url] code..
        // patterns[] = "#\[url\]([\w]+?://([\w\#%&~/.\-;:=,?@\]+]+|\[(?!url=))*?)\[/url\]#is";
        // url1 = str_replace('{URL}', '\\1', '<a href="{URL}" target="_blank" class="postlink">{DESCRIPTION}</a>');
        // replacements[] = str_replace('{DESCRIPTION}', '\\1', url1);

        // // [url]www.phpbb.com[/url] code.. (no xxxx:// prefix).
        // patterns[] = "#\[url\]((www|ftp)\.([\w\#%&~/.\-;:=,?@\]+]+|\[(?!url=))*?)\[/url\]#is";
        // url2 = str_replace('{URL}', 'http://\\1', '<a href="{URL}" target="_blank" class="postlink">{DESCRIPTION}</a>');
        // replacements[] = str_replace('{DESCRIPTION}', '\\1', url2);

        // // [url=xxxx://www.phpbb.com]phpBB[/url] code..
        // patterns[] = "#\[url=([\w]+?://[\w\#%&~/.\-;:=,?@\[\]+]*?)\]([^?\n\r\t].*?)\[/url\]#is";
        // url3 = str_replace('{URL}', '\\1', '<a href="{URL}" target="_blank" class="postlink">{DESCRIPTION}</a>');
        // replacements[] = str_replace('{DESCRIPTION}', '\\2', url3);

        // // [url=www.phpbb.com]phpBB[/url] code.. (no xxxx:// prefix).
        // patterns[] = "#\[url=((www|ftp)\.[\w\#%&~/.\-;:=,?@\[\]+]*?)\]([^?\n\r\t].*?)\[/url\]#is";
        // url4 = str_replace('{URL}', 'http://\\1', '<a href="{URL}" target="_blank" class="postlink">{DESCRIPTION}</a>');
        // replacements[] = str_replace('{DESCRIPTION}', '\\3', url4);

        // text = preg_replace(patterns, replacements, text);

        // // colours
        // color_open = str_replace('{COLOR}', '\\1', '<span style="color: {COLOR}">');
        // text = preg_replace("/\[color=(\#[0-9A-F]{6}|[a-z]+)\]/si", color_open, text);
        // text = str_replace("[/color]", "</span>", text);

        // // size
        // size_open = str_replace('{SIZE}', '\\1', '<span style="font-size: {SIZE}pt; line-height: normal">');
        // text = preg_replace("/\[size=([1-3]?[0-9])\]/si", size_open, text);
        // text = str_replace("[/size]", "</span>", text);

        return text;
    },

    dump: function (obj)
    {
        var out = '';
        for (var i in obj) {
            out += i + ": " + obj[i] + "\n";
        }

        alert(out);
    }

};

appCtrl.router = new $.mobile.Router(
    {
        "#page1(?:[?](.*))?": {handler: "homeBeforeShow", events:"bC"},
        "#board_page(?:[?](.*))?": {handler: "boardBeforeCreate", events:"bC"},
        "#board_post[?](\\d+)": {handler: "boardPostBeforeShow", events:"bs"},
        "#board_post_content[?](\\d+)": {handler: "boardPostContentBeforeShow", events:"bs"},
    },
    appCtrl.app
);

Array.prototype.move = function(from, to) {
    this.splice(to, 0, this.splice(from, 1)[0]);
};