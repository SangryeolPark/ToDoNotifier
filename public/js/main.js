var userInfo;
var loginUserKey;
var tempKey;
var tempDate;
var tempTitle;
var alarmKey;

var todayDate = new Date();
var todayMonth = (todayDate.getMonth() + 1);
var todayDay = todayDate.getDate();
var todayDayTemp = todayDay < 10 ? "0" + todayDay : todayDay;
var todayMonthTemp = todayMonth < 10 ? "0" + todayMonth : todayMonth;
var todayValue = todayDate.getFullYear() + "-" + todayMonthTemp + "-" + todayDayTemp;

var selectedDateTemp = todayValue;
var selectedDateText = todayDate.getFullYear() + "년 " + (todayDate.getMonth() + 1) + "월 " + todayDate.getDate() + "일";

function deleteToDo(key) {
    if(!confirm('정말 삭제하시겠습니까?')){
        return;
    }
    var ref = firebaseDatabase.ref("users/" + loginUserKey + "/list/" + key);
    ref.remove();
    $("." + key).remove();
}

function editToDo(key) {
    tempKey = key;
    let ref = firebaseDatabase.ref('users/' + loginUserKey + "/list/" + key);
    ref.once('value').then(function(snapshot) {
        $("#editToDoDate").val(snapshot.val().date);
        $("#editToDoTitle").val(snapshot.val().title);
        tempDate = snapshot.val().date;
        tempTitle = snapshot.val().title;
    });
    $('.main-screen').css({ 'transition': '0.5s', 'filter': 'blur(2px)', 'pointer-events': 'none'}, 500);
    $('.edit-to-do-dialog').fadeIn(500).css('display', 'flex');
}

function getTodayToDo() {
    var ref = firebaseDatabase.ref("users/" + loginUserKey + "/list");
    ref.once('child_added', onGetTodayToDo);
}

function onGetTodayToDo(data) {
    var key = data.key;
    var toDoData = data.val();
    var title = toDoData.title;
    var date = toDoData.date;
    var addedTime = toDoData.addedTime;
    var alarm = toDoData.alarm;
    var alarmTime = toDoData.alarmTime;
    var alarmImage = alarm ? "notify_card_off_img.png" : "notify_card_img.png";
    var alarmFunction = alarm ? "cancelAlarm('" + key + "')" : "openAlarmDialog('" + key + "')"
    var html =
        "<div added-time=\"" + addedTime + "\" class=\"list-card today-card " + key + "\">" +
            "<img class=\"img-delete-card\" src=\"delete_card_img.png\" width=\"20px\" height=\"20px\" onclick=\"deleteToDo('" + key + "')\"/>" +
            "<img class=\"img-edit-card\" src=\"edit_card_img.png\" width=\"20px\" height=\"20px\" onclick=\"editToDo('" + key + "')\"/>" +
            "<img id=\"alarm-image" + key + "\" class=\"img-notify-card\" src=\"" + alarmImage + "\" width=\"20px\" height=\"20px\" onclick=\"" + alarmFunction + "\"/>" + 
            "<span id=\"" + key + "\" class=\"list-title\">" + title + "</span>" +
            "<span id=\"alarm-time" + key + "\" class=\"list-date\">" + date + " " + alarmTime + "</span>" +
        "</div>";
    if(date == todayValue) {
        $(".today-list").append(html);
    }
    sortingToday();
}

function sortingToday() {
    var result = $('.today-card').sort(function (a, b) {
        var contentA =parseInt( $(a).attr('added-time'));
        var contentB =parseInt( $(b).attr('added-time'));
        return (contentA < contentB) ? -1 : (contentA > contentB) ? 1 : 0;
    });
    $(".today-card").remove();
    $('.today-list').html(result);
    $('.today-list').prepend("<span class=\"today-title\">오늘의 할 일</span>");
}

function getSelectedDayToDo() {
    var ref = firebaseDatabase.ref("users/" + loginUserKey + "/list");
    ref.once('child_added', onGetSelectedDayToDo);
}

function onGetSelectedDayToDo(data) {
    var key = data.key;
    var toDoData = data.val();
    var title = toDoData.title;
    var date = toDoData.date;
    var addedTime = toDoData.addedTime;
    var html =
        "<div added-time=\"" + addedTime + "\" class=\"list-card selected-day-card " + key + "\">" +
            "<img class=\"img-edit-card\" src=\"edit_card_img.png\" width=\"20px\" height=\"20px\" onclick=\"editToDo('" + key + "')\"/>" +
            "<img class=\"img-delete-card\" src=\"delete_card_img.png\" width=\"20px\" height=\"20px\" onclick=\"deleteToDo('" + key + "')\"/>" + 
            "<span class=\"list-title\">" + title + "</span>" +
            "<span class=\"list-date\">" + date + "</span>" +
        "</div>";
    if(date == selectedDateTemp) {
        $(".selected-day-list").append(html);
    }
    sortingSelectedDay();
}

function sortingSelectedDay() {
    var result = $('.selected-day-card').sort(function (a, b) {
        var contentA =parseInt( $(a).attr('added-time'));
        var contentB =parseInt( $(b).attr('added-time'));
        return (contentA < contentB) ? -1 : (contentA > contentB) ? 1 : 0;
    });
    $(".selected-day-card").remove();
    $('.selected-day-list').html(result);
    $('.selected-day-list').prepend("<span class=\"selected-day-title\"></span>");
    $(".selected-day-title").html(selectedDateText + " 할 일");
}

$(document).ready(function() {
    $('.main-screen').fadeIn(1000).css('display', 'flex');
    $(".selected-day-title").html(selectedDateText + " 할 일");

    userSessionCheck();
    if (!('serviceWorker' in navigator) || !('showTrigger' in Notification.prototype)) {
        alert('ServiceWorker or Notification Trigger API is not supported');
    }
    navigator.serviceWorker.register('service-worker.js');
    
    function userSessionCheck() {
        firebaseAuth.onAuthStateChanged(function (user) {
            if (user) {
                firebaseDatabase.ref("users/" + user.uid).once('value').then(function (snapshot) {
                    $("#mainTitle").text(snapshot.val().nickname + " 님의 To Do List");
                    userInfo = snapshot.val();
                    loginUserKey = snapshot.key;
                    getTodayToDo();
                    getSelectedDayToDo();
                });

            } else {
                window.location.href = "index.html";
            }
        });
    }

    function logout() {
        $('.main-screen').fadeOut(1000, function() {
            $('.logout-success-screen').fadeIn(500, function() {
                $('.checkmark').animate({ width: '60px', height: '60px', top: '29px' }, 500, function() {
                    $('#loginNickname').text(userInfo.nickname + ' 님');
                    $('#goodByeMsg').fadeIn(500, function() {
                        $('.logout-success-screen').delay(500).animate({ top: '-100%'}, 1000, function() {
                            firebaseAuth.signOut().then(function() {
                                window.location.href = "index.html";
                            }).catch(function (error) {
                                console.log(error)
                            });
                        });
                    });
                });
            }).css('display', 'flex');
        });        
    }

    function getCurrentDate() {
        var date = new Date();
        var year = date.getFullYear().toString();

        var month = date.getMonth() + 1;
        month = month < 10 ? '0' + month.toString() : month.toString();

        var day = date.getDate();
        day = day < 10 ? '0' + day.toString() : day.toString();

        var hour = date.getHours();
        hour = hour < 10 ? '0' + hour.toString() : hour.toString();

        var minites = date.getMinutes();
        minites = minites < 10 ? '0' + minites.toString() : minites.toString();

        var seconds = date.getSeconds();
        seconds = seconds < 10 ? '0' + seconds.toString() : seconds.toString();

        return year + month + day + hour + minites + seconds;
    }

    function addToDo() {
        var ref = firebaseDatabase.ref("users/" + loginUserKey + "/list");
        ref.push({
            title: $("#addToDoTitle").val(),
            date: $("#addToDoDate").val(),
            addedTime: getCurrentDate(),
            alarm: false,
            alarmTime: ""
        });
        alert("할 일이 추가되었습니다!");
    }

    $(".img-logout").click(function() {
        $('.main-screen').css({ 'transition': '0.5s', 'filter': 'blur(2px)', 'pointer-events': 'none'}, 500);
        $('.logout-dialog').fadeIn(500).css('display', 'flex');
    });

    function closeLogout() {
        $('.main-screen').css({ 'transition': '0.5s', 'filter': '', 'pointer-events': ''}, 500);
        $('.logout-dialog').fadeOut(500, function() {
            $('.main-screen').css('transition', '');
        });
    }

    $("#logoutBtn").click(function() {
        closeLogout();
        logout();
    });

    $("#cancelLogoutBtn").click(function() {
        closeLogout();
    });

    $(".img-add").click(function() {
        $('.main-screen').css({ 'transition': '0.5s', 'filter': 'blur(2px)', 'pointer-events': 'none'}, 500);
        $('.add-to-do-dialog').fadeIn(500).css('display', 'flex');
    });

    function closeAddToDo() {
        $('.main-screen').css({ 'transition': '0.5s', 'filter': '', 'pointer-events': ''}, 500);
        $('.add-to-do-dialog').fadeOut(500, function() {
            $('.main-screen').css('transition', '');
        });
        $("#addToDoTitle").val("");
        $("#addToDoDate").val("");
    }

    $("#cancelAddToDoBtn").click(function() {
        closeAddToDo();
    });

    $("#addToDoBtn").click(function() {
        if($("#addToDoTitle").val() == "" || $("#addToDoDate").val() == "") {
            alert("날짜와 내용을 입력해주세요.")
            return;
        }
        addToDo();
        getTodayToDo();
        getSelectedDayToDo();
        closeAddToDo();
    });

    $("#editToDoBtn").click(function() {
        if($("#editToDoTitle").val() == tempTitle && $("#editToDoDate").val() == tempDate) {
            alert("변경된 내용이 없습니다.");
            return;
        }
        if($("#editToDoTitle").val() == "" || $("#editToDoDate").val() == "") {
            alert("날짜와 내용을 입력해주세요.")
            return;
        }
        var ref = firebaseDatabase.ref("users/" + loginUserKey + "/list/" + tempKey);
        ref.update({
            title: $("#editToDoTitle").val(),
            date: $("#editToDoDate").val(),
            addedTime: getCurrentDate(),
        });
        alert("할 일이 수정되었습니다!");
        $(".today-card").remove();
        $(".selected-day-card").remove();
        getTodayToDo();
        getSelectedDayToDo();
        closeEditToDo();
    });

    function closeEditToDo() {
        $('.main-screen').css({ 'transition': '0.5s', 'filter': '', 'pointer-events': ''}, 500);
        $('.edit-to-do-dialog').fadeOut(500, function() {
            $('.main-screen').css('transition', '');
            $("#editToDoTitle").val("");
            $("#editToDoDate").val("");
        });
        tempKey = undefined;
        tempDate = undefined;
        tempTitle = undefined;
    }

    $("#cancelEditToDoBtn").click(function() {
        closeEditToDo();
    });

    $("#setAlarmBtn").click(function() {
        if($("#alarmTime").val() == "") {
            alert("시간을 입력해주세요.")
            return;
        }
        var currentTime = new Date();
        var alarmTimeSlice = $("#alarmTime").val().split(":");
        var setTime = new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate(), alarmTimeSlice[0], alarmTimeSlice[1]);
        if (currentTime.getTime() > setTime.getTime()) {
            alert("지난 시간입니다.")
            return;
        };
        setAlarm(alarmKey, setTime.getTime() - currentTime.getTime());
        closeSetAlarm();
    });

    $("#cancelSetAlarmBtn").click(function() {
        closeSetAlarm();
    });

    function closeSetAlarm() {
        $('.main-screen').css({ 'transition': '0.5s', 'filter': '', 'pointer-events': ''}, 500);
        $('.set-alarm-dialog').fadeOut(500, function() {
            $('.main-screen').css('transition', '');
            $("#alarmTime").val("");
        });
        alarmKey = undefined;
    }

});

function openAlarmDialog(key) {
    $('.main-screen').css({ 'transition': '0.5s', 'filter': 'blur(2px)', 'pointer-events': 'none'}, 500);
    $('.set-alarm-dialog').fadeIn(500).css('display', 'flex');
    alarmKey = key;
}

async function setAlarm(key, time) {
    const reg = await navigator.serviceWorker.getRegistration();
    Notification.requestPermission().then(permission => {
        if (permission !== 'granted') {
            alert('알림 권한을 허용해야합니다.');
        } else {
            const timestamp = new Date().getTime() + time;
            const scheduledTime = new Date(timestamp);
            var scheduledTimeText = pad(scheduledTime.getHours()) + ':' + pad(scheduledTime.getMinutes());
            var ref = firebaseDatabase.ref("users/" + loginUserKey + "/list/" + key);
            ref.update({
                alarm: true,
                alarmTime: "(" + scheduledTimeText + ")"
            });
            reg.showNotification(
                $("#" + key).text(),
                {
                    tag: timestamp,
                    body: $("#" + key).text() + " 할 시간입니다.",
                    showTrigger: new TimestampTrigger(timestamp),
                    data: {
                        url: window.location.href,
                    }
                }
            );
            $("#alarm-image" + key).attr("src", "notify_card_off_img.png");
            $("#alarm-image" + key).attr("onclick", "cancelAlarm('" + key + "')");
            $("#alarm-time" + key).text($("#alarm-time" + key).text() + " (" + scheduledTimeText + ")");
            alert(scheduledTimeText + "에 알람이 설정되었습니다.");
        }
    });
}

async function cancelAlarm(key) {
    const reg = await navigator.serviceWorker.getRegistration();
    const notifications = await reg.getNotifications({
        includeTriggered: true
    });
    var ref = firebaseDatabase.ref("users/" + loginUserKey + "/list/" + key);
    ref.update({
        alarm: false,
        alarmTime: ""
    });
    ref.once('value').then(function(snapshot) {
        notifications.some((notification) => {
            if (notification.title == snapshot.val().title) {
                console.log("알림 취소");
                notification.close();
            }
        });

        $("#alarm-image" + key).attr("src", "notify_card_img.png");
        $("#alarm-image" + key).attr("onclick", "openAlarmDialog('" + key + "')");
        $("#alarm-time" + key).text(snapshot.val().date);
        alert("알람이 해제되었습니다.");
    });
}

function pad(num, size = 2) {
    let s = num + '';
    while (s.length < size) s = '0' + s;
    return s;
}