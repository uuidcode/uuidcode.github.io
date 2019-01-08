var youtubeDivId = "youtube";
$("body").append("<div id='" + youtubeDivId +"'></div>");
var youtubeDiv = $("#" + youtubeDivId);
youtubeDiv.hide();
$("#youtube").easydrag();

var offset = 20;
var width = 560;
var height = 349;


function getImageURL(id) {
    return "http://i.ytimg.com/vi/" + id + "/default.jpg";
}

function addYouTube(youtubeDiv, id) {
    var xpath = "img[src='" + getImageURL(id) + "']";
    var Image = $(xpath);
    var subject = $(Image).attr("alt");
    var content = "<table width=580 height=389><td height='20' style=\"padding: 5px 0px 0px 10px\"><b>" + subject + "</b></td>";
    content += "<td align='right' style=\"padding: 5px 10px 0px 10px\"><img src='/close_button.gif' border='0' onclick='javascript:hideYouTube()'></td></tr>";
    content += "<tr><td colspan='2' width='100%' height='100%' align='center' valign='center'>";
    content += "<iframe width=" + width + " height=" + height + " src=\"http://www.youtube.com/embed/" + id + "?autoplay=1\" frameborder=\"0\" allowfullscreen></iframe>";
    content += "</td></tr></table>";
    youtubeDiv.html(content);
}

function writeYouTube(id, subject, description) {
    document.write("<img src=\"" + getImageURL(id) + "\" border=\"0\" alt=\"" + subject + "\" width=130 height=100 style='cursor:pointer' onclick=\"javascript: showYouTube('" + id + "')\">");
}


function writeYouTubeEx(id, subject, position) {
    document.write("<table><tr><td width='130'>");
    document.write("<img src=\"" + getImageURL(id) + "\" border=\"0\" alt=\"" + subject + "\" width='130' height='100' style='cursor:pointer' onclick=\"javascript: showYouTube('" + id + "')\"></td>");
    if (position == undefined) {
        document.write("<td valign='center'>&nbsp;&nbsp;<a href='http://www.youtube.com/watch?v=" + id + "' target='_new'>" + subject + "</a></td>");
    } else {
        if ("below" == position) {
            document.write("</tr><tr><td width='130' valign='center' align='center'>&nbsp;&nbsp;<a href='http://www.youtube.com/watch?v=" + id + "' target='_new'>" + subject + "</a></td>");
        }
    }
    document.write("</tr></table>");
}

function embedYouTube(id, subject) {
    document.write("<a href=\"http://www.youtube.com/watch?v=" + id + "\"><img src=\"http://i.ytimg.com/vi/" + id + "/default.jpg\" border=\"0\" alt=\"" + subject + "\" width=130 height=100></a>");
}

function showYouTube(id) {
    var youtubeDiv = $("#" + youtubeDivId);
    $("table", youtubeDiv).remove();
    addYouTube(youtubeDiv, id);
    youtubeDiv.css("position", "absolute");
    youtubeDiv.css("background-color", "#EFF3FF");
    youtubeDiv.css("border", "1px solid black");
    //youtubeDiv.css("width", width + offset);
    //youtubeDiv.css("height", height + offset);

    var posx = 0;
    var posy = 0;

    if (!e) var e = window.event;

    if (e.pageX || e.pageY) {
        posx = e.pageX;
        posy = e.pageY;
    }	else if (e.clientX || e.clientY) {
        posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        posy = e.clientY + document.body.scrollTop  + document.documentElement.scrollTop;
    }

    youtubeDiv.css("left", posx);
    youtubeDiv.css("top", posy - 10);
    //youtubeDiv.css("border-right", "solid 2px #000000");
    //youtubeDiv.css("border-bottom", "solid 2px #000000");
    youtubeDiv.show();
}

function hideYouTube() {
    var youtubeDiv = $("#" + youtubeDivId);
    $("table", youtubeDiv).remove();
    youtubeDiv.hide();
}

//$(function(){
//	$("body").append("<div id='" + youtubeDivId +"'></div>");
//	var youtubeDiv = $("#" + youtubeDivId);
//	youtubeDiv.hide();
//	$("#youtube").easydrag();
//});

function getContent(datasource) {
    var ajaxParameter = {
        type: "GET",
        url: datasource,
        dataType: "text",
        success: function(msg) {
            alert(msg);
            $("#content").html(msg);
        }
    };
    $.ajax(ajaxParameter);
}