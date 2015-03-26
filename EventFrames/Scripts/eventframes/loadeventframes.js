$(document).ready(function () {
    InitializeForm();
});

function InitializeForm() {
    GetEventFrames();
    GetTemplates();
}

function GetEventFrames() {
    var serviceUrl = "/Events.svcx"
    $.ajax({
        url: serviceUrl,
        data: {
            action: "geteventframes"
        },
        success: function (data) {
            var result = JSON.parse(data);
            for (var i = 0; i < result.length; i++) {
                var url = "<a href='EventForms/ViewForm.aspx?id=" + result[i].Id + "'>" + result[i].Name + "</a>"
                $("#eventframes").append("<tr><td>" + url + "</td>" + "<td>" + result[i].DateTime + "</td></tr>");
            }
        },
        error: function () {
        }
    });
}

function GetTemplates() {
    var serviceUrl = "/Events.svcx"
    $.ajax({
        url: serviceUrl,
        data: {
            action: "gettemplates"
        },
        success: function (data) {
            var templates = JSON.parse(data);
            for (var i = 0; i < templates.length; i++) {
                $("#newform").append("<div><a href='EventForms/NewForm.aspx?id=" + templates[i].Id +"'>Зарегистрировать событие '" + templates[i].Name + "'</a></div>");
            }
        },
        error: function () {
        }
    });
}