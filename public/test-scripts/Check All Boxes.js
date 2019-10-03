var checkboxMarkup = `<div id="checkboxDiv"></div>`

$('body')
	.append(checkboxMarkup)
	.find('#checkboxDiv')
    .dialog({
        tite: 'How Many Days Would You Like Set?',
		modal: false,
		resizable: false,
        buttons: {
            "Select All": function () {
                $(':checkbox').prop('checked', true)
            },
            "Deselect All": function () {
                $(':checkbox').prop('checked', false)
            }
        }
    })