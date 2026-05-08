$(function() {
    $("pre img").css("cursor", "pointer").on("click", function() {
        var current = $(this).data("rotate") || 0;
        current = (current + 90) % 360;
        $(this).data("rotate", current);
        $(this).css("transform", "rotate(" + current + "deg)");
    });
});
