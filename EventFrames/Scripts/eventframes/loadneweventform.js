$(document).ready(function () {
    InitializeForm();
});

function InitializeForm() {
    var serviceUrl = "/Events.svcx"
    var url = window.location.href;
    var splitString = url.split("?");
    var eventId;
    if (splitString.length > 1) {
        var id = splitString[1].split("=");
        eventId = id[1];
    }

    $.ajax({
        url: serviceUrl,
        data: {
            action: "geteventframetemplate",
            id: eventId
        },
        success: function (data) {
            var attributes = JSON.parse(data);
            for (var i = 0; i < attributes.length; i++) {
                $("#newform").append("<div>" + attributes[i].Name + ": <input value='" + attributes[i].Value + "'></input></div><br/>");
            }
        },
        error: function () {
        }
    });

}