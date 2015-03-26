function CellConstant(id, value) {
    return $("<div/>", {
        'id': id,
        'text': value
    });
}

function CellString(id, value, required) {
    var control = $("<input/>", {
        'title': "Введите корректные данные",
        'id': id,
        'name': value,
        'type': 'text',
        'value': value,
        change: function () {
            var currentElement = { Id: this.id, Value: this.value };
            SaveCurrentState($(this).closest("[class$='Control']"), currentElement);
        }
    });
    if (required) {
        control.attr("required", "");
    }
    return control;
}

function CellDateTime(id, value, required) {
    var control = $("<input/>", {
        'title': "Введите корректную дату",
        'id': id,
        'name': id,
        'type': 'datetime',

        'value': value,
        change: function () {
            var currentElement = { Id: this.id, Value: this.value };
            SaveCurrentState($(this).closest("[class$='Control']"), currentElement);
        }
    });

    if (required) {
        control.attr("required", "");
    }

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

    return control;
}

function CellNumber(id, value, required) {
    var control = $("<input/>", {
        'title': "Введите корретное число",
        'id': id,
        'name': id,
        'type': 'number',
        'value': value,
        change: function () {
            var currentElement = { Id: this.id, Value: this.value };
            SaveCurrentState($(this).closest("[class$='Control']"), currentElement);
        }
    });
    if (required) {
        control.attr("required", "");
    }
    return control;
}

function CellList(currentObject) {
    var control = $("<select/>", {
        'title': currentObject.Desc,
        'id': currentObject.Id,
        change: function () {
            var currentElement = { Id: this.id, Value: this.value };
            SaveCurrentState($(this).closest("[class$='Control']"), currentElement);
        }
    });
    if ((currentObject.Value == "") || (currentObject.Value == null)) {
        control.append($("<option></option>"));
    }
    for (var y = 0; y < currentObject.ValueSet.length; y++) {
        control.append($("<option value='" + currentObject.ValueSet[y] + "'>" + currentObject.ValueSet[y] + "</option>"));
    }
    control.val(currentObject.Value);

    return control;
}

function CellLink(id, value, desc) {
    return $("<a/>", {
        'text': desc,
        'id': id,
        'href': value,
        'target': '_blank'
    });
}

function CellDictionaryComboBox(currentObject) {
    var control = $("<select/>", {
        'id': currentObject.Id,
        change: function () {
            $.ajax({
                context: this,
                url: urlService,
                data: {
                    action: "LoadFields",
                    folder: $(this).val()
                },
                success: function (data) {
                    LoadDictionaryFields(data, $(this).parent());
                    var currentElement = { Id: currentObject.Id, Childrens: JSON.parse(data), Value: $(this).find("option:selected").text() };
                    SaveCurrentState($(this).closest("[class$='Control']"), currentElement);
                }
            });
        }
    });

    control.append($("<option/>", {
        'text': "Выберите значение",
        'selected': 'selected',
        'value': null
    }));

    for (var i = 0; i < currentObject.ValueSet.length; i++) {
        var selected = false;
        if (currentObject.Value === currentObject.ValueSet[i].Value) {
            selected = true;
        }
        control.append($("<option/>", {
            'value': currentObject.ValueSet[i].Id,
            'text': currentObject.ValueSet[i].Value,
            'selected': selected
        }));
    }
    return control;
}

function CellDictionaryTree(id) {
    var control = $("<button/>", {
        'text': "Выбрать",
        'id': id,
        click: function () {
            var currentObjectId = this.id;
            var dialogControl = $(this).parent().children(".dialog");
            dialogControl.dialog({
                autoOpen: false,
                width: 600, modal: true,
                buttons: {
                    "Выбрать": function () {
                        $(this).dialog("close");
                        var nodes = dialogControl.children(".tree").jstree('get_selected');

                        $.ajax({
                            url: urlService,
                            data: {
                                action: "LoadFields",
                                folder: nodes[0]
                            },
                            success: function (data) {
                                LoadDictionaryFields(data, $("button#" + currentObjectId).parent());
                                var currentElement = { Id: currentObjectId, Childrens: JSON.parse(data) };
                                SaveCurrentState($(this).closest("[class$='Control']"), currentElement);
                            }
                        });
                    },
                    "Закрыть": function () {
                        $(this).dialog("close");
                    }
                }
            });
            //$(":button:contains('Выбрать')").prop("disabled", true);
            dialogControl.dialog("open");

            //загрузка дерева в диалоге
            $.ajax({
                url: urlService,
                data: {
                    action: "LoadAfTree",
                    folder: currentObjectId
                },
                success: function (data) {
                    var treeList = JSON.parse(data);

                    dialogControl.children(".tree").jstree({
                        'core': {
                            'themes': {
                                'dots': false, 'icons': false,
                                'name': 'proton', 'responsive': true
                            },
                            'data': treeList
                        }
                    });
                }
            });
            return false;
        }
    });
    control.button();
    return control;
}