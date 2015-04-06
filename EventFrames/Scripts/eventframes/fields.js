var serviceUrl = "/Events.svcx"

function StringField(attributes) {
    var field = $("<td/>", {
    });
    var input = $("<input/>", {
        value: attributes.Value,
        id: attributes.Id
    });
    if (attributes.Constant) {
        input.attr("readonly", "readonly");
    }
    var label = "<label>" + attributes.Name + "</label>";
    field.append(label);
    field.append(input);

    var object = {
        field: input,
        label: label
    };

    return object;
}

function MultilineStringField(attributes) {
    var field = $("<td/>");
    var input = $("<textarea/>", {
        text: attributes.Value,
        id: attributes.Id
    });
    var label = "<label>" + attributes.Name + "</label>";
    field.append(label);
    field.append(input);
    var object = {
        field: input,
        label: label
    };

    return object;
}

function DateTimeField(attributes) {
    var field = $("<td/>");

    var control = $("<input/>", {
        'title': "Введите корректную дату",
        'id': attributes.Id,
        'name': attributes.Id,
        'type': 'datetime',
        'value': attributes.Value
    });
    
    control.datetimepicker({
        closeText: 'Закрыть',
        prevText: '<Пред',
        nextText: 'След>',
        currentText: 'Сегодня',
        monthNames: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
            'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
        monthNamesShort: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн',
            'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
        dayNames: ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'],
        dayNamesShort: ['вск', 'пнд', 'втр', 'срд', 'чтв', 'птн', 'сбт'],
        dayNamesMin: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
        weekHeader: 'Не',
        dateFormat: 'dd.mm.yy',
        firstDay: 1,
        isRTL: false,
        showMonthAfterYear: false,
        yearSuffix: '',

        timeOnlyTitle: 'Выберите время',
        timeText: 'Время',
        hourText: 'Часы',
        minuteText: 'Минуты',
        secondText: 'Секунды',
        millisecText: 'Миллисекунды',
        timezoneText: 'Часовой пояс',
        timeFormat: 'H:mm'
    });

    var label = "<label>" + attributes.Name + "</label>";
    field.append(label);
    field.append(control);

    var object = {
        field: control,
        label: label
    };

    return object;
}

function FileUploadField(attributes) {
    var field = $("<td/>", {
    });
    var input = $("<input/>", {
        id: attributes.Id,
        type: "file"
    });
    
    var label = "<label>" + attributes.Name + "</label>";
    field.append(label);
    field.append(input);
    var object = {
        field: input,
        label: label
    };

    return object;
}

function ListField(attributes) {
    var field = $("<td/>");
    var control = $("<select/>", {
        'title': attributes.Name,
        'id': attributes.Id,
    });
    if ((attributes.Value == "") || (attributes.Value == null)) {
        control.append($("<option></option>"));
    }
    for (var y = 0; y < attributes.ValueSet.length; y++) {
        control.append($("<option value='" + attributes.ValueSet[y] + "'>" + attributes.ValueSet[y] + "</option>"));
    }
    control.val(attributes.Value);

    var label = "<label>" + attributes.Name + "</label>";
    field.append(label);
    field.append(control);
    var object = {
        field: control,
        label: label
    };

    return object;
}

function DictionaryField(attributes) {
    var field = $("<td/>");
    var control = $("<select/>", {
        'title': attributes.Name,
        'id': attributes.Id,
        change: function () {
            $.ajax({
                context: this,
                url: serviceUrl,
                data: {
                    action: "getdictionaryfields",
                    id: $(this).val()
                },
                success: function (data) {
                    FillDictionaryField(JSON.parse(data));
                }
            });
        }
    });
    control.append($("<option></option>"));
    for (var y = 0; y < attributes.ValueSet.length; y++) {
        control.append($("<option value='" + attributes.ValueSet[y].Id + "'>" + attributes.ValueSet[y].Name + "</option>"));
    }
    control.val(attributes.Value);

    var label = "<label>" + attributes.Name + "</label>";
    field.append(label);
    field.append(control);
    var object = {
        field: control,
        label: label
    };

    return object;
}

function FillDictionaryField(attributes) {
    for (var i = 0; i < attributes.length; i++) {
        var label = $("label:contains('" + attributes[i].Name + "')");
        var input = label.parent().parent().find("input");
        input.val(attributes[i].Value);
    }
}