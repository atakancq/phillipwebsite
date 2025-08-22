/*************************************************************/
/*               tab menu ve buttons                         */
/*************************************************************/
$(function () {
    var current_btn = "tab1";
    var $id = "tab1";
    $('.tab-b').click(function(){
        $(".tab-kucuk").removeClass('tab-kucuk-active');
        $id = $(this).attr('data-id');
        $(".tab-kucuk[data-id='"+$(this).attr('data-id')+"']").addClass("tab-kucuk-active");
        $(".tab-b").removeClass('active-a');
        $(this).parent().find(".tab-b").addClass('active-a');
    });
});