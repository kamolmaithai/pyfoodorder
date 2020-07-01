
/*How to use
MsgBox("This is a message for the user.", "This is the title");
MsgBox("This is a message for the user.", "This is the title", "JSSnippetToCall();");
YesNo("Are you sure you want to do this?", "Please Confirm", "JSSnippetToCallOnYes();", "JSSnippetToCallOnNo();");
YesNoCancel("Are you sure you want to do this?", "Please Confirm", "JSSnippetToCallOnYes();", "JSSnippetToCallOnNo();", "JSSnippetToCallOnCancel();");

*/

/**************************************************************************************************/
/* Copyright 2016.  Matthew G. Collins.  All rights reserved.
/**************************************************************************************************/
/* The functions below are each self-contained and can be copied into any HTML file by themselves
/* and used.  The CSS styling is accomplished by using the STYLE attribute on each HTML tag.  There
/* is no need to use external CSS.  Of course, once you copy the code you can modify it to suit
/* your needs, including changing the styling.  But be careful, especially with the msgBoxDivStyle,
/* because some of it is necessary to achieve the desired effect.
/*
/* You are free to simply copy this JavaScript code into your application, as long as you include
/* the copyright notice in each copy of the code you make.  No exceptions.  If you don't, and I
/* find out, I'll sue you for enough money to retire on.  Because that's just rude and rude 
/* people need to be sued to make the world a better place.  You are also free to modify the code
/* to suit your needs.  But if you do, you still need to give me credit.
/*
/* To see how these functions can be used in practice to give the effect of a modal dialog box
/* see the demonstration page at http://www.interbit.com/demos/modal.html.
/*
/* I recognize that this code could easily have been written more efficiently, and without some of
/* the redundancy.  I intentionally wrote it the way I did to make it more easily understandable
/* and modifiable to meet your needs.
/**************************************************************************************************/

/**************************************************************************************************/
/* Function MsgBox
/* Copyright 2016.  Matthew G. Collins.  All rights reserved.
/* Parameters: Message, WindowTitle, onOK
/* Description: This function displays a modal message box with a single OK button.
/*              When the user clicks the OK button the box is removed and the JavaScript provided
/*              in the onOK parameter, if any, is called.
/*
/* To see how this function can be used in practice to give the effect of a modal dialog box
/* see the demonstration page at http://www.interbit.com/demos/modal.html.
/**************************************************************************************************/
function MsgBox(msg, title, onOK) {

    try {
        var msgBoxDivStyle = "background: rgba(127, 127, 127, 0.6);height: 100%;position: absolute;width: 100%;z-index: 9999;";
        var msgBoxTitleStyle = "background-color: #00478A;color: white;font-size: 20px;font-weight: bold;left: 0px;padding: 4px;text-align: left;top: 0px;";
        var msgBoxErrorTitleStyle = "background-color: red;color: white;font-size: 20px;font-weight: bold;left: 0px;padding: 4px;text-align: left;top: 0px;";
        var msgBoxSuccessTitleStyle = "background-color: green;color: white;font-size: 20px;font-weight: bold;left: 0px;padding: 4px;text-align: left;top: 0px;";
        var msgBoxWarningTitleStyle = "background-color: orange;color: white;font-size: 20px;font-weight: bold;left: 0px;padding: 4px;text-align: left;top: 0px;";
        var msgBoxContentsStyle = "background: rgba(255, 255, 255, 1);background-color: white;border: 1px solid black;box-shadow: 6px 6px 6px #070707;";
        msgBoxContentsStyle += "left: 30%;position: absolute;resize: vertical;text-align: center;top: 15%;width: 40%;";
        var msgBoxTextStyle = "font-size: 18px;overflow: auto;padding: 20px;text-align: center;";
        var msgBoxButtonStyle = "margin: 20px;";

        var msgDiv = "";

        if (title == null) {
            title = "Information";
        }

        if (onOK == null) {
            onOK = "";
        }

        titleStyle = msgBoxTitleStyle;
        if (title == "Error" || title == "JavaScript Error" || title == "Exception") {
            titleStyle = msgBoxErrorTitleStyle;

        } else if (title == "Success") {
            titleStyle = msgBoxSuccessTitleStyle;

        } else if (title == "Warning") {
            titleStyle = msgBoxWarningTitleStyle;
        }

        msgDiv += "<div id='msgboxDiv' style='" + msgBoxDivStyle + "'>";  // Covers the entire body to prevent any interaction with controls in the body.
        msgDiv += "<div id='msgboxContents' style='" + msgBoxContentsStyle + "'>";  // Contains the messagebox itself
        msgDiv += "<div id='msgboxTitle' style='" + titleStyle + "'>" + title + "</div>";
        msgDiv += "<div id='msgboxText' style='" + msgBoxTextStyle + "'>" + msg + "</div>";  // Contains the text of the message to be displayed.
        msgDiv += "<button id='answerOK' tabindex='1' style='" + msgBoxButtonStyle + "' accesskey='K' onclick='" + onOK + "document.body.removeChild(this.parentElement.parentElement);'>O<u>K</u></button>";
        msgDiv += "</div></div>";  // Closes the modalBox and modalDiv tags

        document.body.insertAdjacentHTML("afterBegin", msgDiv);

        // This next line is necessary so that the new elements can be referred to in the following JavaScript code.
        document.body.focus();

        // Disable the tab key so that the user can't use it to get to the other controls on the page.
        document.getElementById('answerOK').onkeydown = function(e){if(e.keyCode==9){return false;}}
        document.getElementById('answerOK').focus();

    } catch (e) {
        JavaScriptError(e);
    }
}


/**************************************************************************************************/
/* Function YesNo
/* Copyright 2016.  Matthew G. Collins.  All rights reserved.
/* Parameters: Message, WindowTitle, onYes, onNo
/* Description: This function displays a modal message box with two buttons labeled "Yes" and "No".
/*              When the user clicks either button the box is removed and the appropriate
/*              JavaScript (passed in the onYes and onNo parameters) is executed.
/*
/* To see how this function can be used in practice to give the effect of a modal dialog box
/* see the demonstration page at http://www.interbit.com/demos/modal.html.
/**************************************************************************************************/
function YesNo(msg, title, onYes, onNo) {

    try {
        var msgBoxDivStyle = "background: rgba(127, 127, 127, 0.6);height: 100%;position: absolute;width: 100%;z-index: 9999;";
        var msgBoxTitleStyle = "background-color: #00478A;color: white;font-size: 20px;font-weight: bold;left: 0px;padding: 4px;text-align: left;top: 0px;";
        var msgBoxErrorTitleStyle = "background-color: red;color: white;font-size: 20px;font-weight: bold;left: 0px;padding: 4px;text-align: left;top: 0px;";
        var msgBoxSuccessTitleStyle = "background-color: green;color: white;font-size: 20px;font-weight: bold;left: 0px;padding: 4px;text-align: left;top: 0px;";
        var msgBoxWarningTitleStyle = "background-color: orange;color: white;font-size: 20px;font-weight: bold;left: 0px;padding: 4px;text-align: left;top: 0px;";
        var msgBoxContentsStyle = "background: rgba(255, 255, 255, 1);background-color: white;border: 1px solid black;box-shadow: 6px 6px 6px #070707;";
        msgBoxContentsStyle += "left: 30%;position: absolute;resize: vertical;text-align: center;top: 15%;width: 40%;";
        var msgBoxTextStyle = "font-size: 18px;overflow: auto;padding: 20px;text-align: center;";
        var msgBoxButtonStyle = "margin: 20px;";

        var msgDiv = "";

        if (title == null) {
            title = "Confirm";
        }

        if (onYes == null) {
            onYes = "";
        }

        if (onNo == null) {
            onNo = "";
        }

        msgDiv += "<div id='msgboxDiv' style='" + msgBoxDivStyle + "'>";  // Covers the entire body to prevent any interaction with controls in the body.
        msgDiv += "<div id='msgboxContents' style='" + msgBoxContentsStyle + "'>";  // Contains the messagebox itself
        msgDiv += "<div id='msgboxTitle' style='" + msgBoxTitleStyle + "'>" + title + "</div>";
        msgDiv += "<div id='msgboxText' style='" + msgBoxTextStyle + "'>" + msg + "</div>";  // Contains the text of the message to be displayed.
        msgDiv += "<button id='answerYes' tabindex='1' style='" + msgBoxButtonStyle + "' accesskey='Y' onclick='" + onYes + "document.body.removeChild(this.parentElement.parentElement);'><u>Y</u>es</button>";
        msgDiv += "<button id='answerNo' tabindex='2' style='" + msgBoxButtonStyle + "' accesskey='N' onclick='" + onNo + "document.body.removeChild(this.parentElement.parentElement);'><u>N</u>o</button>";
        msgDiv += "</div></div>";  // Closes the modalBox and modalDiv tags

        document.body.insertAdjacentHTML("afterbegin", msgDiv);

        // This next line is necessary so that the new elements can be referred to in the following JavaScript code.
        document.body.focus();

        // Intercept the tab key so that the user can't use it to get to the other controls on the page.
        document.getElementById('answerYes').onkeydown = function(e){if(e.keyCode==9){document.getElementById('answerNo').focus();return false;}}
        document.getElementById('answerNo').onkeydown = function(e){if(e.keyCode==9){document.getElementById('answerYes').focus();return false;}}

        // Put the user's focus on the Yes button.
        document.getElementById('answerYes').focus();

    } catch (e) {
        JavaScriptError(e);
    }
}


/**************************************************************************************************/
/* Function YesNoCancel
/* Copyright 2016.  Matthew G. Collins.  All rights reserved.
/* Parameters: Message, WindowTitle, Callback
/* Description: This function displays a modal message box with three buttons labeled "Yes", "No",
/*              and "Cancel".  When the user clicks any of the buttons the box is removed and the
/*              appropriate JavaScript (passed in the onYes, onNo, and onCancel parameters)
/*              is called, if any.
/*
/* To see how this function can be used in practice to give the effect of a modal dialog box
/* see the demonstration page at http://www.interbit.com/demos/modal.html.
/**************************************************************************************************/
function YesNoCancel(msg, title, onYes, onNo, onCancel) {

    try {
        var msgBoxDivStyle = "background: rgba(127, 127, 127, 0.6);height: 100%;position: absolute;width: 100%;z-index: 9999;";
        var msgBoxTitleStyle = "background-color: #00478A;color: white;font-size: 20px;font-weight: bold;left: 0px;padding: 4px;text-align: left;top: 0px;";
        var msgBoxErrorTitleStyle = "background-color: red;color: white;font-size: 20px;font-weight: bold;left: 0px;padding: 4px;text-align: left;top: 0px;";
        var msgBoxSuccessTitleStyle = "background-color: green;color: white;font-size: 20px;font-weight: bold;left: 0px;padding: 4px;text-align: left;top: 0px;";
        var msgBoxWarningTitleStyle = "background-color: orange;color: white;font-size: 20px;font-weight: bold;left: 0px;padding: 4px;text-align: left;top: 0px;";
        var msgBoxContentsStyle = "background: rgba(255, 255, 255, 1);background-color: white;border: 1px solid black;box-shadow: 6px 6px 6px #070707;";
        msgBoxContentsStyle += "left: 30%;position: absolute;resize: vertical;text-align: center;top: 15%;width: 40%;";
        var msgBoxTextStyle = "font-size: 18px;overflow: auto;padding: 20px;text-align: center;";
        var msgBoxButtonStyle = "margin: 20px;";

        var msgDiv = "";

        if (title == null) {
            title = "Confirm";
        }

        if (onYes == null) {
            onYes = "";
        }

        if (onNo == null) {
            onNo = "";
        }

        if (onCancel == null) {
            onCancel = "";
        }

        msgDiv += "<div id='msgboxDiv' style='" + msgBoxDivStyle + "'>";  // Covers the entire body to prevent any interaction with controls in the body.
        msgDiv += "<div id='msgboxContents' style='" + msgBoxContentsStyle + "'>";  // Contains the messagebox itself
        msgDiv += "<div id='msgboxTitle' style='" + msgBoxTitleStyle + "'>" + title + "</div>";
        msgDiv += "<div id='msgboxText' style='" + msgBoxTextStyle + "'>" + msg + "</div>";  // Contains the text of the message to be displayed.
        msgDiv += "<button id='answerYes' tabindex='1' style='" + msgBoxButtonStyle + "' accesskey='Y' onclick='document.body.removeChild(this.parentElement.parentElement);" + onYes + "'><u>Y</u>es</button>";
        msgDiv += "<button id='answerNo' tabindex='2' style='" + msgBoxButtonStyle + "' accesskey='N' onclick='document.body.removeChild(this.parentElement.parentElement);" + onNo + "'><u>N</u>o</button>";
        msgDiv += "<button id='answerCancel' tabindex='3' style='" + msgBoxButtonStyle + "' accesskey='C' onclick='document.body.removeChild(this.parentElement.parentElement);" + onCancel + "'><u>C</u>ancel</button>";
        msgDiv += "</div></div>";  // Closes the modalBox and modalDiv tags

        document.body.insertAdjacentHTML("afterbegin", msgDiv);

        // This next line is necessary so that the new elements can be referred to in the following JavaScript code.
        document.body.focus();

        // Intercept the tab key so that the user can't use it to get to the other controls on the page.
        document.getElementById('answerYes').onkeydown = function(e){if(e.keyCode==9){document.getElementById('answerNo').focus();return false;}}
        document.getElementById('answerNo').onkeydown = function(e){if(e.keyCode==9){document.getElementById('answerCancel').focus();return false;}}
        document.getElementById('answerCancel').onkeydown = function(e){if(e.keyCode==9){document.getElementById('answerYes').focus();return false;}}

        // Put the user's focus on the Yes button.
        document.getElementById('answerYes').focus();

    } catch (e) {
        JavaScriptError(e);
    }

}


/**************************************************************************************************/
/* Function JavaScriptError
/* Copyright 2016.  Matthew G. Collins.  All rights reserved.
/* Parameters: JavaScript Error Object
/* Description: This function formats and uses the MsgBox function to display a JavaScript Error.
/*
/* To see how this function can be used in practice to give the effect of a modal dialog box
/* see the demonstration page at http://www.interbit.com/demos/modal.html.
/**************************************************************************************************/
function JavaScriptError(e) {

    var msg = "";

    try {
        msg = e.name + "<br /><br />" + e.message + "<br /><br />" + e.stack;

    } catch (e) {
        msg = e.message;
    }

    try {
        MsgBox(msg, "JavaScript Error");

    } catch (e1) {
        alert(msg);
    }
}


/**************************************************************************************************/
/* Function jsonError
/* Parameters: JSON object with the following properties: errNumber, errMessage.
/*             The JSON object may have additional properties, but it will only use the errNumber
/*             and errMessage properties.
/* Description: This function formats and displays a JSON error.
/**************************************************************************************************/
function jsonError(err) {
    msg = "Error " + err.errNumber + "<br /><br />";
    msg += err.errMessage + "<br /><br />";
    MsgBox(msg, "Exception");
}