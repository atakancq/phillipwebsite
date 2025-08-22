

$(document).ready(function (e) {

    jQuery.datetimepicker.setLocale('tr');

    if ($("#dailog-content").length > 0) {

    //    if (!localStorage.fancyShow_29092023) {
    //        $("#fancyTrigger").fancybox({
    //            'titlePosition': 'inside',
    //            'transitionIn': 'none',
    //            'transitionOut': 'none'
    //        });

    //        setTimeout(() => { $("#fancyTrigger").click() }, 100);

    //        localStorage.fancyShow_29092023 = true;

        //    }

         
        if (!localStorage.dailyFancy || (localStorage.dailyFancy && localStorage.dailyFancy != new Date().toLocaleDateString())) {
            debugger;
            $("#fancyTrigger").fancybox({
                'titlePosition': 'inside',
                'transitionIn': 'none',
                'transitionOut': 'none'
            });

            setTimeout(() => { $("#fancyTrigger").click() }, 100);

            localStorage.dailyFancy = new Date().toLocaleDateString();

        } 

    }


    $(".copyValue").on("click", function () {
        var $temp = $("<input>");
        $("body").append($temp);
        $temp.val($(this).data("val")).select();
        document.execCommand("copy");
        $temp.remove();

    })

    $(".accordion .baslik-link").on("click", function () {


    });



    $("#drpCityID").change(function () {

        var thisCity = $(this).val();
        $.ajax({
            type: "POST",
            url: "../WebServices/ClientServices.asmx/getRegion",
            data: "{ 'CityID':'" + thisCity + "'}",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                $("#drpDistrictID option").remove();
                $("#drpDistrictID").append(data.d);
            },
            error: function () {
                console.log("Failed to load region");
            }
        });


    });



    $("#txtBirthDate,#txtPreviousWorkStartDate,#txtPreviousWorkStopDate,#txtLastWorkStartDate,#txtLastWorkStopDate").datetimepicker({
        format: 'd/m/Y',
        timepicker: false,
    });


    $('[name="chckWorkStill"]').change(function () {
        var inpt = $("input[name='txtLastWorkStopDate']");
        if ($(this).is(':checked')) {
            inpt.parents(".row").addClass("disable")
            inpt.attr("disabled", "disabled");
        }
        else {
            inpt.parents(".row").removeClass("disable")
            inpt.removeAttr("disabled", "disabled");
        }
    });

    $("#txtFAQSearchIcon").keyup(function () {
        var thisVal = $(this).val().toLowerCase();
        $(".accordion[allfaq] > div").hide();

        if (thisVal.length > 0) {
            $(".accordion[allfaq] > div").each(function (i, obj) {
                let baslik = $(obj).find("h5").text().toLowerCase();
                let icerik = $(obj).find(".accordion-content p").text().toLowerCase();

                if (baslik.indexOf(thisVal) > -1 || icerik.indexOf(thisVal) > -1) {
                    $(obj).show();
                } else {
                    $(obj).hide();
                }

            });
        } else $(".accordion[allfaq] > div").show();

    });

    if ($("input[name='txtPhone']").length > 0) {
        //$("input[name='txtPhone']").usPhoneFormat({
        //    format: '(xxx) xxx-xxxx',
        //});
    }

    function formatPhoneNumber(phoneNumberString) {
        var c = ('' + phoneNumberString).replace(/\D/g, '').split('');
        return "(" + (c[0] ? c[0] : "_") + (c[1] ? c[1] : "_") + (c[2] ? c[2] : "_") + ") " + (c[3] ? c[3] : "_") + (c[4] ? c[4] : "_") + (c[5] ? c[5] : "_") + "-" + (c[6] ? c[6] : "_") + (c[7] ? c[7] : "_") + (c[8] ? c[8] : "_") + (c[9] ? c[9] : "_")

    }



    $("input[name='txtPhone']").on('keydown', function (e) {
        if ($(this).val().trim() == "" && (e.keyCode == 48 || e.keyCode == 96)) {
            return false
        }
    })


    function handlePaste(e) {

        var clipboardData, pastedData;
        e.stopPropagation();
        e.preventDefault();

        clipboardData = e.clipboardData || window.clipboardData;
        pastedData = clipboardData.getData('Text');


        if (pastedData && pastedData[0] == "0") {
            this.value = formatPhoneNumber(pastedData.substr(1))
        }
    }

    document.getElementsByName("txtPhone")[0].addEventListener('paste', handlePaste);

    $("a[href]").on("touchend", function () {
        var url = $(this).attr("href");
        window.location.href = url;
    });



    if ($(".askStockForm").length > 0) {
        calcAskStockDate();
    }

  

});




function calcAskStockDate() {

    let daySelected = false;
    let targetDay = moment();
    targetDay.locale("tr");
    targetDay.set({ hour: 14, minute: 30, second: 0, millisecond: 0 })
    do {
        if (moment() < targetDay && (targetDay.day() == 2 || targetDay.day() == 4)) {
            daySelected = true;
        } else targetDay.add("days", 1);

    } while (!daySelected);


    var diffTime = targetDay.unix() - moment().unix(); //better to handle this in Controller to avoid timezone problem
    var duration = moment.duration(diffTime, 'seconds');
    var interval = 1;

    $(".askFromIcons .text .time").html(targetDay.format("DD MMMM / HH:mm"));
    setInterval(function () {
        duration = moment.duration(duration.asSeconds() - interval, 'seconds');
        $(".countdown .col .no.day").html(duration.days());
        $(".countdown .col .no.hour").html(duration.hours());
        $(".countdown .col .no.min").html(duration.minutes());
        $(".countdown .col .no.sec").html(duration.seconds());

        if (moment() > targetDay) calcAskStockDate();
    }, 1000);
}