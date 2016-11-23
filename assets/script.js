/**
 * Created by Adam on 18.11.2016.
 */
$(document).ready(function () {
    textArea = $('textarea#text');
	regexFlags = "gm";
	
    init();
    menu();
    content();
});

function init() {
    /* style/behavior - configuration */
    textArea.autogrow({vertical: true, horizontal: false});

    resizeSidebar();
    $("#center-area").on("mresize", function () {
        resizeSidebar();
    });

    $("input#regex").focus(function () {
        $("#input-box").addClass("focus");
    });
    $("input#regex").focusout(function () {
        $("#input-box").removeClass("focus");
    });
	
	$("[title]").tooltip({show: {delay: 900}});
}

function content() {
    $("input#regex").on('input', function () {
		searchMatches();
		console.log($(this).caret().start + " - " + $(this).caret().end);
    }).keydown(function(){
		console.log($(this).caret().start + " - " + $(this).caret().end);
	}).mousemove(function(){
		console.log($(this).caret().start + " - " + $(this).caret().end);
	});
	
	textArea.on("input",function(){
		searchMatches();
	});
}

function menu() {
    var inputFile = $("<input type='file' name='file-input'>");
    var linkDialog = $('<div id="link-dialog" title="Otevřít z URL"><form onsubmit="return false"><label for="link-input">Vložte odkaz: </label><input type="text" placeholder="http://" name="link-input" id="link-input"></form></div>').dialog({
        autoOpen: false,
        height: 200,
        width: 480,
        modal: true,
        create: function () {
            var $this = $(this);

            // focus first button and bind enter to it
            $this.parent().find('.ui-dialog-buttonpane button:last').focus();
            $this.keypress(function (e) {
                if (e.keyCode == $.ui.keyCode.ENTER) {
                    $this.parent().find('.ui-dialog-buttonpane button:last').click();
                    return false;
                }
            });
        },
        buttons: {
            "Zrušit": function () {
                $(this).dialog("close");
            },
            "Ok": function () {
                var url = $("#link-input").val();
                if (url != "") {
                    // to do load file trought php
                }
            }
        }
    });


    $("#source-file").click(function () {
        inputFile.click();
        inputFile.change(function () {
            var fileURL = this.files[0];
            var fileType = /text.*/;

            if (fileURL.type.match(fileType)) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    textArea.val(e.target.result);
                }
                reader.readAsText(fileURL);
            }
        });
    });

    $('#source-link').click(function () {
        linkDialog.dialog("open");
    });
	
	setFlags();
    $("input.check").checkboxradio().change(function(){
		setFlags();
		searchMatches();
	});
	
	$("#char-classes button").click(function(){
		var regexInput = $("input#regex");
		
		if(regexInput.is(":focus")){
			alert(regexInput.selectionStart);
			alert("hooovno");
		}
		
		
		var regexString = regexInput.val();
		var regexChar = $(this).text();
		regexInput.val(regexString + regexChar);
	});
}

function resizeSidebar() {
    $("#side-menu").css("min-height", $("#center-area").height() - 2);
}

function setFlags(){
	var flags = "";
	$("input.check").each(function(){
		if($(this).is(":checked")){
			var name = $(this).attr("name");
			var flag = name.substr(name.length - 1, name.length);
			flags += flag;
		}
	});
	
	regexFlags = flags;
	$("div#after-input").text("/" + flags);
}

function searchMatches(){
	var matchesText = $('#matches-text');
	var matchesCount = $('span#matches-count');
	var matchesColors = ['#ef2765', '#01adef', '#8cc63e', '#662e93', '#f79437', '#00b6ba', '#ef3e36', '#f9ee06',
	'#c3b59b', '#30b66f', '#48bfe9', '#3cae4c', '#f36056', '#9a65ab', '#fbac1c', '#aac47d', '#8f8f8d', '#6490cd',
	'#f06aa7', '#c5996c', '#a01f62', '#0f75bd', '#ed1b24', '#92c741'];

	matchesText.find('.match').remove();
	matchesCount.html("0");
	var regexString = $("input#regex").val();
	if (regexString != "") {
		var regex = new RegExp(regexString, regexFlags);
		var content = textArea.val();
		var result = content.match(regex);
		var matches = [];
		while((match = regex.exec(content)) != null){
			matches.push(match);
		}
		
		if(matches.length != 0){
			matchesCount.html(matches.length);
			matches.forEach(function(matchedEl){
				var color = matchesColors[Math.floor((Math.random() * (matchesColors.length - 1)) + 0)];
				var matchDivString = "<div class='match' style='background-color: " + color + "' data-position='"+matchedEl["index"]+"'>" + matchedEl[0] + "</div> ";
				var matchDiv = $(matchDivString).click(function(){
					textArea.focus();
					setSelectionRange(textArea[0], matchedEl["index"], matchedEl["index"] + matchedEl[0].length);
					
				});
				matchDiv.insertBefore(matchesText.find("div.ender"));
			});
		}
	}	
}

function setSelectionRange(input, selectionStart, selectionEnd) {
  if (input.setSelectionRange) {
    input.focus();
    input.setSelectionRange(selectionStart, selectionEnd);
  }
  else if (input.createTextRange) {
    var range = input.createTextRange();
    range.collapse(true);
    range.moveEnd('character', selectionEnd);
    range.moveStart('character', selectionStart);
    range.select();
  }
}