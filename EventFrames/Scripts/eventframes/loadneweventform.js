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
            console.log(data);
            var attributes = JSON.parse(data);
            for (var i = 0; i < attributes.length; i++) {
                var field;
                switch (attributes[i].Type) {
                    case "String":
                        field = StringField(attributes[i]);
                        break;
                    case "DateTime":
                        field = DateTimeField(attributes[i]);
                        break;
                    case "MultilineString":
                        field = MultilineStringField(attributes[i]);
                        break;
                    case "File":
                        field = FileUploadField(attributes[i]);
                        break;
                    case "List":
                        field = ListField(attributes[i]);
                        break;
                    case "Dictionary":
                        field = DictionaryField(attributes[i]);
                        break;
                }
                var row = $("<tr/>");
                var label = $("<td/>");
                label.append(field.label);
                var object = $("<td/>");
                object.append(field.field);
                row.append(label);
                row.append(object);
                $("#newform").append(row);
            }
        },
        error: function () {
        }
    });

}