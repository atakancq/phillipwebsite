/*************************************************************/
/*     tab menu ve buttons yon tusları   */
/*************************************************************/
$(function () {
    var current_btn = "tab1";
    var  $id = "tab1";
    $('.tab-a').click(function(){
        $(".tab").removeClass('tab-active');
        $id = $(this).attr('data-id');
        $(".tab[data-id='"+$(this).attr('data-id')+"']").addClass("tab-active");
        $(".tab-a").removeClass('active-a');
        $(this).parent().find(".tab-a").addClass('active-a');
    });
    var counter_click_before = $id.charAt($id.length-1);
    var counter_click_after = counter_click_before;
    /***************************************************/
    /* sag ust taraftaki yon tuşları tusları */
    /***************************************************/
    $('.arrow-controls a').click(function (e) {
        var btn = $(this).attr("data-value");
        if (btn == "left") {
            $(".tab").removeClass('tab-active');
            counter_click_after--;
            if (counter_click_after < 1) {
                counter_click_after = 8;
            }
            $(".tab[data-id='tab"+counter_click_after+"']").addClass("tab-active");
            $(".tab-a").removeClass('active-a');
            $(".tab-a[data-id='tab"+counter_click_after+"']").addClass("active-a");
        }
        if (btn == "right") {
            $(".tab").removeClass('tab-active');
            counter_click_after++;
            if (counter_click_after > 8) {
                counter_click_after = 1;
            }
            $(".tab[data-id='tab"+counter_click_after+"']").addClass("tab-active");
            $(".tab-a").removeClass('active-a');
            $(".tab-a[data-id='tab"+counter_click_after+"']").addClass("active-a");
        }
        var link;
        var clicked_btn;
    });
});