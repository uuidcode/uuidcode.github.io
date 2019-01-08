String.prototype.trim = function(){
    return this.replace(/^\s+|\s+$/g, "");
};

String.prototype.toCamel = function(){
    return this.replace(/(\-[a-z])/g, function($1){return $1.toUpperCase().replace('-','');});
};

String.prototype.toDash = function(){
    return this.replace(/([A-Z])/g, function($1){return "-"+$1.toLowerCase();});
};

String.prototype.toUnderscore = function(){
    return this.replace(/([A-Z])/g, function($1){return "_"+$1.toLowerCase();});
};

String.prototype.startsWith = function (str){
    return this.indexOf(str) == 0;
};

String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

String.prototype.contains = function(str) {
    return this.indexOf(str) != -1;
}

var COLUMN_WIDTH = 250;
var TASK_WIDTH = 200;
var HEIGHT = 30;

var HOLIDAY_BACKGROUND_COLOR = "#BDBDBD";
var SPECIALDAY_BACKGROUND_COLOR = "#F6EBBC";

function isHoliday(xdate, developer) {

    var day = xdate.getDay();
    var dateFormat = xdate.toString('yyyy-MM-dd');


    for (var i = 0; i < model.holidayList.length; i++) {
        var holiday = model.holidayList[i];

        if (holiday.date == dateFormat) {
            if (holiday.type == 'all') {
                return true;
            }

            if (holiday.type == 'developer') {
                if (holiday.developer == developer) {
                    return true;
                }
            }
        }
    }

    return false;
}

function getHoliday(xdate, developer) {
    var day = xdate.getDay();
    var dateFormat = xdate.toString('yyyy-MM-dd');

    for (var i = 0; i < model.holidayList.length; i++) {
        var holiday = model.holidayList[i];

        if (holiday.date == dateFormat) {
            if (holiday.type == 'all') {
                return holiday;
            } else if (holiday.type == 'developer') {
                if (holiday.developer == developer) {
                    return holiday
                }
            }
        }
    }

    return null;
}

function isWeekend(xdate) {
    var day = xdate.getDay();
    return day == 0 || day == 6;
}

function reset() {
    console.log("reset");

    var scrollTop = $('body').scrollTop();
    console.log("scrollTop:" + scrollTop);

    if (!model.startDate) {
        return;
    }

    $('#startDate').val(model.startDate);
    $('#endDate').val(model.endDate);

    var startDate = new XDate(model.startDate);
    var endDate = new XDate(model.endDate);
    var diffDays = startDate.diffDays(endDate);

    console.log("diffDays:" + diffDays);

    $("#developerList").empty();
    $("#dayList").empty();

    var header = $('<tr><th></th></tr>').appendTo($('#developerList'));

    for (var i = 0; i < model.developerList.length; i++) {
        var developer = model.developerList[i];
        var developerItem = $('<th></th>')
            .appendTo(header)
            .css({
                'width': COLUMN_WIDTH + 'px'
                , 'text-align': 'center'
            });

        var content = '<span class="developer">' + developer + '</span>';

        if (i != 0) {
            content = '<i class="icon-arrow-left"></i>&nbsp;' + content;
        }

        if (i != model.developerList.length - 1) {
            content += '&nbsp;<i class="icon-arrow-right"></i>';
        }

        developerItem.html(content + '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>');
        developerItem
            .find('button.close')
            .attr('developer', developer)
            .on('click', function() {
            var currentDeveloper = $(this).attr('developer');

            for (var j = 0; j < model.developerList.length; j++) {
                var developer = model.developerList[j];
                if (developer == currentDeveloper) {
                    model.developerList.splice(j, 1);
                    break;
                }
            }

            reset();
            resetTask();
        });
        developerItem.find('i.icon-arrow-left').attr('index', i).on('click', function() {
            var index = parseInt($(this).attr('index'), 10);
            console.log("index:" + index);
            var temp = model.developerList[index - 1];
            model.developerList[index - 1] = model.developerList[index];
            model.developerList[index] = temp;
            reset();
            resetTask();
        });

        developerItem.find('i.icon-arrow-right').attr('index', i).on('click', function() {
            var index = parseInt($(this).attr('index'), 10);
            console.log("index:" + index);

            console.log(model.developerList);
            var temp = model.developerList[index + 1];
            model.developerList[index + 1] = model.developerList[index];
            model.developerList[index] = temp;
            console.log(model.developerList);
            reset();
            resetTask();
        });

        developerItem
            .find('span.developer')
            .on('click', function(event) {
                event.preventDefault();
                event.stopPropagation();

                var developer = $(this).text();
                $(this).empty();

                var self = $(this);

                $(this).off('click');

                $('<input type="text">')
                    .appendTo($(this))
                    .css({
                        width: '100px'
                        , marginBottom: '0px'
                    })
                    .on('click', function() {
                        event.preventDefault();
                        event.stopPropagation();
                    })
                    .val(developer)
                    .attr('id', 'currentDeveloper')
                    .attr('old-developer', developer)
                    .focus()
                    .keyup(function(event){
                        if(event.keyCode == 13){
                            var oldDeveloper = $(this).attr('old-developer');
                            var newDeveloper = $(this).val();

                            console.log('oldDeveloper:' + oldDeveloper);
                            console.log('newDeveloper:' + newDeveloper);

                            $(this).parent().empty().text(newDeveloper);

                            for (var j = 0; j < model.allTaskList.length; j++) {
                                var task = model.allTaskList[j];
                                if (task.developer == oldDeveloper) {
                                    task.developer = newDeveloper;
                                }
                            }

                            for (var j = 0; j < model.developerList.length; j++) {
                                var developer = model.developerList[j];
                                if (developer == oldDeveloper) {
                                    model.developerList[j] = newDeveloper;
                                }
                            }

                            reset();
                            resetTask();
                        }
                    });
            });

    }

    for (var i = 0; i <= diffDays; i++) {
        var xdate = startDate.clone().addDays(i);
        var dateFormat = xdate.toString('MM/dd ddd');
        var date = xdate.toString('yyyy-MM-dd');

        var row = $('<tr><td style="vertical-align: middle;width: 100px">' + dateFormat + '</td></tr>')
            .appendTo($('#dayList'));

        row.find('td').attr('date', date);

        if (isHoliday(xdate) || isWeekend(xdate)) {
        } else {
            row.find('td').on('dblclick', function() {
                var currentDate = $(this).attr('date');
                var currentXDate = XDate(currentDate);
                var holiday = getHoliday(currentXDate);

                $('#holidayDate').val(currentDate);
                $('#holidayType').val('all');

                var comment = '';

                if (holiday) {
                    comment = holiday.comment;
                }

                $('#holidayComment').val(comment);

                $('#holidayModal').modal("show").draggable({
                    handle: ".modal-header"
                });
            });
        }

        var droppable = true;

        row.css({
            height: '42px'
        });

        if (isHoliday(xdate) || isWeekend(xdate)) {
            row.css({
               backgroundColor: HOLIDAY_BACKGROUND_COLOR
            });

            if (isHoliday(xdate)) {
                var holiday = getHoliday(xdate);

                if (holiday.eventType == 'special') {
                    row.css({
                        backgroundColor: SPECIALDAY_BACKGROUND_COLOR
                    });
                }
            }
            droppable = false;
        }


        for (var j = 0; j < model.developerList.length; j++) {
            var droppable = true;

            var developer = model.developerList[j];

            var itemTd = $('<td></td>').appendTo(row);


            if (isHoliday(xdate, developer) || isWeekend(xdate)) {
                droppable = false;
                itemTd.css({
                    textAlign: 'center'
                    , verticalAlign: 'middle'
                    , backgroundColor: HOLIDAY_BACKGROUND_COLOR
                })

                if (isHoliday(xdate)) {
                    var holiday = getHoliday(xdate);

                    if (holiday.eventType == 'special') {
                        itemTd.css({
                            backgroundColor: SPECIALDAY_BACKGROUND_COLOR
                        });
                    }
                }
            }

            if (isHoliday(xdate, developer) || isWeekend(xdate)) {
                if (isHoliday(xdate, developer)) {
                    var holiday = getHoliday(xdate, developer);
                    itemTd.html(holiday.comment + '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>');
                    itemTd.find('button').on('click', function() {
                        var currentId = $(this).attr('id');
                        for (var k = 0; k < model.holidayList.length; k++) {
                            var holiday = model.holidayList[k];

                            if (holiday.id == currentId) {
                                model.holidayList.splice(k, 1);
                                break;
                            }
                        }

                        reset();
                        resetTask();
                    })
                    .attr('id', holiday.id)
                }

            }

            if (isHoliday(xdate, developer) || isWeekend(xdate)) {

            } else {
                var date = xdate.toString('yyyy-MM-dd');
                var taskList = getTaskByDateAndDeveloper(date, developer);
                var item = createTask(itemTd, taskList, date, developer);

                if (item) {
                    item.appendTo(itemTd);
                }

                if (droppable && item) {
                        item.droppable({
                        accept: '.dropdown'
                        , hoverClass: 'hover-droppable'
                        , activeClass: 'active-droppable'
                        , drop: function(event, ui) {
                            ui.draggable
                                    .appendTo($(this))
                                    .css({
                                        left: '0px'
                                        , top: '0px'
                                    });

                            var taskId = $(ui.draggable).attr('id');
                            $('#task' + taskId).remove();

                            var task = getTask(taskId);
                            task.developer = $(this).attr('developer');
                            task.date = $(this).attr('date');
                            removeTask(taskId);

                            ui.draggable.find('button.close').off('click').on('click', function() {
                                console.log("unAssignTask");
                                unAssignTask(ui.draggable.attr('id'));
                                item.empty();
                                reset();
                                resetTask();
                            });
                        }
                    });
                }
            }
        }
    }

    $('#worksheet').css('width', (model.developerList.length + 1) * COLUMN_WIDTH + 'px');
    $('body').scrollTop(scrollTop);
}

function removeTask(id) {
    for (var i = 0; i < model.taskList.length; i++) {
        var currentTask = model.taskList[i];
        if (currentTask.id == id) {
            model.taskList.splice(i, 1);
            return;
        }
    }
}

function getTask(id) {
    for (var i = 0; i < model.allTaskList.length; i++) {
        var currentTask = model.allTaskList[i];
        if (currentTask.id == id) {
            return currentTask;
        }
    }
}

function getTaskByDateAndDeveloper(date, developer) {
    var taskList = [];
    for (var i = 0; i < model.allTaskList.length; i++) {
        var currentTask = model.allTaskList[i];
        if (currentTask.date == date && currentTask.developer == developer) {
            taskList.push(currentTask);
        }
    }

    return taskList;
}

function unAssignTask(id) {
    for (var i = 0; i < model.allTaskList.length; i++) {
        var currentTask = model.allTaskList[i];

        if (currentTask.id == id) {
            currentTask.date = null;
            currentTask.developer = null;
            model.taskList.push(currentTask);
        }
    }
}

function createTask(parent, taskList, date, developer) {
    var currentDate = date;
    var currentXDate = XDate(currentDate);
    var holiday = getHoliday(currentXDate, developer);

    if (holiday) {
        parent.css({
            backgroundColor: HOLIDAY_BACKGROUND_COLOR
        });
        parent.text(holiday.comment);
        return null;
    }

    var taskItem = $('<div></div>')
        .appendTo(parent)
        .css({
            height: '42px'
            , width: '100%'
        }).on('dblclick', function() {
            $('#holidayDate').val(date);
            $('#holidayType').val('developer');

            var comment = '';

            if (holiday) {
                comment = holiday.comment;
            }

            $('#holidayComment').val(comment);
            $('#holidayDeveloper').val(developer);

            $('#holidayModal').modal("show").draggable({
                handle: ".modal-header"
            });
        });

    if (holiday) {
        taskItem.css({
            backgroundColor: HOLIDAY_BACKGROUND_COLOR
        });
        taskItem.text(holiday.comment);
    }

    if (date) {
        taskItem.attr('date', date);
    }

    if (developer) {
        taskItem.attr('developer', developer);
    }

    for (var i = 0; i < taskList.length; i++) {

        var task = taskList[i];

        var taskContent = $('<div class="dropdown"> \
                                   <ul class="dropdown-menu" role="menu" aria-labelledby="dropdownMenu" style="display: block; position: static; padding: 10px; width: ' + COLUMN_WIDTH + '">\
                                    <div class="taskname" style="display: inline-block;width: ' + TASK_WIDTH + 'px">' + task.name + '</div>\
                                    <div style="display: inline-block;text-align: right">\
                                    <span class="badge badge-success">' + task.hour + '</span> \
                                    </div>\
                                   </ul>\
                                   <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>\
                                </div>')
            .appendTo(taskItem)
            .draggable({
                revert: 'invalid'
            }).mousedown(function(e) {

            });

        if (date) {
            taskContent.attr('date', date);
            taskContent.attr('developer', developer);
            taskContent.find('button.close').on('click', function() {
                unAssignTask(task.id);
                reset();
                resetTask();
            });
        } else {
            taskContent.find('button.close').on('click', function() {
                removeTask(task.id)
                reset();
                resetTask();
            });
        }

        taskContent
            .attr('id', task.id)
            .on('click', function(event) {
                event.preventDefault();
                event.stopPropagation();

                $('div.dropdown ul').removeClass('selected');
                $(this).find('ul').toggleClass('selected');
            })
            .on('dblclick', function() {
                event.preventDefault();
                event.stopPropagation();

                $('div.dropdown ul.selected').removeClass('selected');

                $('#taskName').val($(this).find('div.taskname').text().trim());
                $('#taskHour').val($(this).find('span').text().trim());
                $('#taskId').val($(this).attr('id'));

                $('#modal').modal("show").draggable({
                    handle: ".modal-header"
                });
            });
    }

    return taskItem;
}

function resetTask() {
    console.log("resetTask");

    var taskList = $('#taskList').empty();

    for (var i = 0; i < model.taskList.length; i++) {
        console.log("####");
        var task = model.taskList[i];
        console.log(task);

        var taskRow = $('<tr></tr>')
                        .appendTo(taskList)
                        .attr('id', 'task' + task.id);

        var taskTd = $('<td></td>')
                    .appendTo(taskRow);

        createTask(taskTd, [task]);
    }
}

function init() {
    model = model || {};
    model.taskList = model.taskList || [];
    model.allTaskList = model.allTaskList || [];
    model.developerList = model.developerList || [];
    model.holidayList = model.holidayList || [];

    console.log(model);
}

function move(mode) {

    console.log('mode:' + mode);

    var item = $('div.dropdown ul.selected');

    if (item.size() == 0) {
        return;
    }

    var taskItem = item.parent();
    var date = taskItem.attr('date');
    var developer = taskItem.attr('developer');
    var id = taskItem.attr('id');

    var selectedTaskList = _.filter(model.allTaskList, function(item) {
        var isDeveloperEqual = item.developer == developer;
        var dateCondtion = false;

        if (mode == 'up') {
            dateCondtion = item.id == id;
        } else if (mode == 'upHigh') {
            dateCondtion = item.date <= date;
        } else if (mode == 'upLow') {
            dateCondtion = item.date >= date;
        } else if (mode == 'down') {
            dateCondtion = item.id == id;
        } else if (mode == 'downHigh') {
            dateCondtion = item.date <= date;
        } else if (mode == 'downLow') {
            dateCondtion = item.date >= date;
        }

        return isDeveloperEqual && dateCondtion;
    })


    for (var i = 0; i < selectedTaskList.length; i++) {
        var task = selectedTaskList[i];

        if (task.date) {
            var xDate = new XDate(task.date);

            do {
                if (mode.startsWith('up')) {
                    xDate.addDays(-1);
                } else if (mode.startsWith('down')) {
                    xDate.addDays(1);
                }
            } while (isHoliday(xDate, developer) || isWeekend(xDate));

            task.date = xDate.toString('yyyy-MM-dd');
        }
    }

    reset();
    resetTask();

    setTimeout(function () {
        $('#' + id).find('ul').addClass('selected');
    }, 1);
}

var model = null;

$(function() {
    try {
        model = $.parseJSON('{ "taskList": [ { "id": "1388135511964", "name": "testing", "hour": "8", "developer": null, "date": null }, { "id": "1388135417888", "name": "google api", "hour": "4", "developer": null, "date": null } ], "allTaskList": [ { "id": "1388135324416", "name": "login", "hour": "8", "developer": "smith", "date": "2013-12-02" }, { "id": "1388135345741", "name": "facebook api", "hour": "8", "developer": "tom", "date": "2013-12-03" }, { "id": "1388135361045", "name": "markup", "hour": "8", "developer": "alice", "date": "2013-12-04" }, { "id": "1388135386719", "name": "cart", "hour": "8", "developer": "smith", "date": "2013-12-03" }, { "id": "1388135396391", "name": "payment", "hour": "8", "developer": "smith", "date": "2013-12-06" }, { "id": "1388135417888", "name": "google api", "hour": "4", "developer": null, "date": null }, { "id": "1388135488120", "name": "design", "hour": "8", "developer": "alice", "date": "2013-12-02" }, { "id": "1388135492535", "name": "design", "hour": "8", "developer": "alice", "date": "2013-12-03" }, { "id": "1388135498946", "name": "markup", "hour": "8", "developer": "alice", "date": "2013-12-05" }, { "id": "1388135511964", "name": "testing", "hour": "8", "developer": null, "date": null } ], "developerList": [ "smith", "tom", "alice" ], "holidayList": [ { "id": 1388135191681, "date": "2013-12-02", "comment": "day off", "type": "developer", "eventType": "holiday", "developer": "tom" }, { "id": 1388135227140, "date": "2013-12-25", "comment": "Christmas", "type": "all", "eventType": "holiday" }, { "id": 1388135243663, "date": "2013-12-04", "comment": "day off", "type": "developer", "eventType": "holiday", "developer": "smith" }, { "id": 1388135251510, "date": "2013-12-05", "comment": "day off", "type": "developer", "eventType": "holiday", "developer": "smith" }, { "id": 1388135269201, "date": "2013-12-10", "comment": "QA", "type": "all", "eventType": "special" }, { "id": 1388135282664, "date": "2013-12-09", "comment": "Code Review", "type": "all", "eventType": "special" }, { "id": 1388135442693, "date": "2013-12-06", "comment": "day off", "type": "developer", "eventType": "special", "developer": "alice" }, { "id": 1388135459010, "date": "2013-12-05", "comment": "conference", "type": "developer", "eventType": "holiday", "developer": "tom" } ], "startDate": "2013-12-01", "endDate": "2013-12-31" }');
        init();

        console.log(model);

        reset();
        resetTask();
    } catch (e) {
    }

    model = model || {};

    $('#startDateDiv').datetimepicker({
        format: 'yyyy-MM-dd'
        , pickTime: false
    });

    $('#endDateDiv').datetimepicker({
        format: 'yyyy-MM-dd'
        , pickTime: false
    });

    $("#applyButton").on('click', function() {
        model.startDate = $('#startDate').val();
        model.endDate = $('#endDate').val();
        reset();
    });

    $("#addButton").on('click', function() {
        model.developerList.push($('#developer').val());
        reset();
    });

    $("#saveButton").on('click', function() {
        localStorage.setItem('test', JSON.stringify(model, null, 2));
    });

    $("#addTaskButton").on('click', function() {
        var task = {
            id: '' + new Date().getTime()
            , name: $('#name').val()
            , hour: $('#hour').val()
        };

        model.taskList.push(task);
        model.allTaskList.push(task);

        resetTask();
    });

    $('#modalSaveButton').on('click', function() {
        var id = $('#taskId').val();

        for (var i = 0; i < model.allTaskList.length; i++) {
            var task = model.allTaskList[i];
            if (task.id == id) {
                task.name = $('#taskName').val();
                task.hour = $('#taskHour').val();
                break;
            }
        }

        for (var i = 0; i < model.taskList.length; i++) {
            var task = model.taskList[i];
            if (task.id == id) {
                task.name = $('#taskName').val();
                task.hour = $('#taskHour').val();
                break;
            }
        }

        $('#modal').modal('hide');

        reset();
        resetTask();
    });

    $('body').on('click', function() {
        var currentDeveloper = $('#currentDeveloper');

        if (currentDeveloper.size() > 0) {
            reset();
            resetTask();
        }

        $('div.dropdown ul.selected').removeClass('selected');

    }).on('keyup', function(e) {
//        var mode = '';
//
//        if (e.keyCode == 82) { // r
//            mode = 'downHigh';
//        } else if (e.keyCode == 70) { // f
//            mode = 'down';
//        } else if (e.keyCode == 86) { // v
//            mode = 'downLow';
//        } else if (e.keyCode == 85) { // u
//            mode = 'upHigh';
//        } else if (e.keyCode == 74) { // j
//            mode = 'up';
//        } else if (e.keyCode == 78) { // n
//            mode = 'upLow';
//        }
//
//        move(mode);
    });

    $('button.move-btn').on('click', function() {
        var mode = '' + $(this).attr('id');
        move(mode);
    });

    $('#holidaySaveButton').on('click', function() {
        var date = $('#holidayDate').val();
        var xDate = new XDate(date);
        var comment = $('#holidayComment').val();
        var holidayDeveloper = $('#holidayDeveloper').val();
        var holidayType = $('#holidayType').val();
        var eventType = $('#eventType').val();

        var holiday = getHoliday(xDate, holidayDeveloper);

        if (holiday) {
            holiday.comment = comment;
            holiday.holidayDeveloper = holidayDeveloper;
            holiday.type = holidayType;
        } else {

            var newHoliday = {
                id: new Date().getTime()
                , date: date
                , comment: comment
                , type: holidayType
                , eventType: eventType
            }

            if (newHoliday.type == 'developer') {
                newHoliday.developer = holidayDeveloper;
            }

            console.log(newHoliday);
            model.holidayList.push(newHoliday);
        }

        console.log(model);

        $('#holidayModal').modal('hide');

        reset();
        resetTask();
    });
});