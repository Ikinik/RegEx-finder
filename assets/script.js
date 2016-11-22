/**
 * Created by Adam on 18.11.2016.
 */
$(document).ready(function(){
    textArea = $('textarea#text');
    init();
    menu();
    content();
});

function init(){
    /* style/behavior - configuration */
    textArea.autogrow({vertical: true, horizontal: false});

    resizeSidebar();
    $("#center-area").on("mresize", function(){
        resizeSidebar();
    });

    $("input#regex").focus(function(){
        $("#input-box").addClass("focus");
    });
    $("input#regex").focusout(function(){
        $("#input-box").removeClass("focus");
    });
}

function content(){
    var matchesText = $('#matches-text');
    var matchesCount = $('span#matches-count');
    var matchesColors = ['#ef2765', '#01adef', '#8cc63e', '#662e93', '#f79437', '#00b6ba', '#ef3e36', '#f9ee06',
        '#c3b59b', '#30b66f', '#48bfe9', '#3cae4c', '#f36056', '#9a65ab', '#fbac1c', '#aac47d', '#8f8f8d', '#6490cd',
        '#f06aa7', '#c5996c', '#a01f62', '#0f75bd', '#ed1b24', '#92c741'];
    $("input#regex").on('input', function(){
        matchesText.find('.match').remove();
        matchesCount.html("0");
        var regexString = $(this).val();
        if(regexString != ""){
            var regex = new RegExp(regexString, 'gm');
            var content = textArea.val();
            var result = content.match(regex);
            if(result != null) {
                matchesCount.html(result.length);
                var matcheString = "";
                result.forEach(function (element) {
                    var color = matchesColors[Math.floor((Math.random() * (matchesColors.length - 1)) + 0)];
                    matcheString += "<div class='match' style='background-color: " + color + "'>" + element + "</div> ";
                });
                matchesText.prepend(matcheString);
            }
        }
    });
}

function menu(){
    var inputFile = $("<input type='file' name='file-input'>");
    var linkDialog = $('<div id="link-dialog" title="Otevřít z URL"><form onsubmit="return false"><label for="link-input">Vložte odkaz: </label><input type="text" placeholder="http://" name="link-input" id="link-input"></form></div>').dialog({
        autoOpen: false,
        height: 200,
        width: 480,
        modal: true,
        create: function() {
            var $this = $(this);

            // focus first button and bind enter to it
            $this.parent().find('.ui-dialog-buttonpane button:last').focus();
            $this.keypress(function(e) {
                if( e.keyCode == $.ui.keyCode.ENTER ) {
                    $this.parent().find('.ui-dialog-buttonpane button:last').click();
                    return false;
                }
            });
        },
        buttons: {
            "Zrušit": function(){
                $(this).dialog("close");
            },
            "Ok": function(){
                var url = $("#link-input").val();
                if(url != ""){
                    // to do load file trought php
                }
            }
        }
    });


    $("#source-file").click(function () {
        inputFile.click();
        inputFile.change(function(){
            var fileURL = this.files[0];
            var fileType = /text.*/;

            if(fileURL.type.match(fileType)){
                var reader = new FileReader();
                reader.onload = function(e){
                    textArea.val(e.target.result);
                }
                reader.readAsText(fileURL);
            }
        });
    });

    $('#source-link').click(function(){
        linkDialog.dialog("open");
    });
}

function resizeSidebar(){
    $("#side-menu").css("min-height",$("#center-area").height() - 2);
}