function StringField(attributes) {
    var field = $("<div/>", {
    });
    var input = $("<input/>", {
        value: attributes.Value
    });
    if (attributes.Constant) {
        input.attr("readonly", "readonly");
    }
    var label = "<label>" + attributes.Name + "</label>";
    field.append(label);
    field.append(input);
    return field;
}

function MultilineStringField(attributes) {
    var field = $("<div/>");
    var input = "<textarea>" + attributes.Value + "</textarea>";
    var label = "<label>" + attributes.Name + "</label>";
    field.append(label);
    field.append(input);
    return field;
}

function DateTimeField(attributes) {
    var field = $("<div/>");

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

    return field;
}

function FileUploadField(attributes) {
    var field = $("<div/>", {
    });
    var input = $("<input/>", {
        type: "file"
    });
    
    var label = "<label>" + attributes.Name + "</label>";
    field.append(label);
    field.append(input);
    return field;
}

function ListField(attributes) {
    var field = $("<div/>");
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
    return field;
}