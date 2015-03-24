$(document).ready(function () {
    InitializeForm();
});

function InitializeForm() {
    var serviceUrl = "/Events.svcx"
    $.ajax({
        url: serviceUrl,
        data: {
            action: "geteventframes"
        },
        success: function (data) {
            var result = JSON.parse(data);
            for (var i = 0; i < result.length; i++) {
                $("#result").append("Id: " + result[i].Id + "; Name: " + result[i].Name + "; Date: " + result[i].DateTime + "<br/>");
            }
        },
        error: function () {
        }
    });

}