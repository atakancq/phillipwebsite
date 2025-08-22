
$(document).ready(function e() {

    $(".GridWiew tbody input[type=checkbox]").click(function () {
        UpdateSelectedItem()
    });


    $("#drpCity").change(function () {

        var thisCity = $(this).val();
        $.ajax({
            type: "POST",
            url: "../WebServices/AdminServices.asmx/getRegion",
            data: "{ 'CityID':'" + thisCity + "'}",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                $("#drpRegion option").remove();
                $("#drpRegion").append(data.d);
            },
            error: function () {
                alert("Failed to load genders");
            }
        });


    });

    Load();
    UpdateShortVal();

    if ($("#drpViewType").length) {
        foldertypeChangeFiled($("#drpViewType").val());
    }
    $("#drpViewType").change(function (e) {

        foldertypeChangeFiled($(this).val());

    });


    // UpdateSelectedItem();


    $("a.DeleteFile").click(function () {
        debugger;
        var $this = $(this);
        var ID = $this.attr("rel");
        var type = $this.attr("type");

        if (window.confirm('Kalıcı olarak silinecek onaylıyor musunuz ?')) {
            $("*").css("cursor", "progress");
            $.ajax({
                type: "POST",
                data: "ID=" + ID + "&Type=" + type,
                url: "App_Module/DeleteFile",
                success: function (reply) {
                    debugger
                    if (reply == "true") {
                        $this.parent().remove();
                    }
                    else {
                        alert(reply);
                    }
                    $("*").css("cursor", "");
                    $(".fx_input input").val("");
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    $("*").css("cursor", "");
                    alert(xhr.status);
                }
            });
        }
        else {
            return false;
        }



        return false;
    });
});

function foldertypeChangeFiled(thisValue)
{
    $("#txtBgColor,#txtTextColor,#fuImageUrl").parent().hide();
    $("#txtBgColor,#txtTextColor,#fuImageUrl").parent().prev().hide();
    $("#txtBgColor,#txtTextColor,#fuImageUrl").parent().next().hide();

    switch (thisValue) {
        case "1":
            $("#txtTextColor,#txtBgColor").parent().show();
            $("#txtTextColor,#txtBgColor").parent().prev().show();
            $("#txtTextColor,#txtBgColor").parent().next().show();

            break;
        case "2":
            $("#fuImageUrl").parent().show();
            $("#fuImageUrl").parent().next().show();
            $("#fuImageUrl").parent().prev().show();
            break;

    }
}

function Load() {
    $("div[href]").click(function () { Redirect($(this).attr("href")); }).css("cursor", "pointer");

    $(".HomeItems .Item .Title").click(function () { $(this).parent().find(".Content").slideToggle(); });

    $(".ItemTitle").click(function () {
        var Hide = $(this).parent().find(".ItemContent").css("display");
        if (Hide == "none") {
            $(".ItemContent").slideUp();
            $(this).addClass("ItemTitleSelect").parent().find(".ItemContent").slideDown();
        }
        else {
            $(this).removeClass("ItemTitleSelect").parent().find(".ItemContent").slideUp();
        }
    });

    var PageName = $("#PageName").val();
    if (PageName) {
        $(".Menu .ItemContent .ItemLink[href=" + PageName + "]").parent().show().parent().find(".ItemTitle").addClass("ItemTitleSelect");
        setTimeout(function () {
            $(".Ok,.Warning.Error").slideUp("fast");
        }, 3000);

        $(".Menu .ItemContent .ItemLink[href=" + PageName + "]").parent().show().parent().find(".ItemTitle").addClass("ItemTitleSelect");
        setTimeout(function () {
            $(".Info").show();
        });
    }
   

    $(".MainRight .Page .Content td").hover(function () {
        $(this).find(".OnHover").css("visibility", "visible");
    }, function () {
        $(this).find(".OnHover").css("visibility", "hidden");
    });

    $(".GridWiew thead input[type=checkbox],.GridWiew tfoot input[type=checkbox]").click(function () {
        if ($(this).attr("checked") == true) {
            $(".GridWiew input[type=checkbox]").attr("checked", "checked");
        }
        else {
            $(".GridWiew input[type=checkbox]").attr("checked", "");
        }
        UpdateSelectedItem()
    });



    $("input[type=text],textarea").focus(function () {
        $(this).css("border-color", "#54BCEB");
    }).blur(function () {
        $(this).css("border-color", "");
    });



    $(".inputtextarea").each(function () {
        var thisW = $(this).width() + 10;
        $(this).resizable({ minWidth: thisW, maxWidth: thisW, minHeight: 100, maxHeight: 800 });
    });




    $(".GridWiew[type=sortable] tbody").each(function () {
        var _handle = ($(this).find(".grippy").length > 0) ? ".grippy" : "";
        $(this).sortable({
            cursor: "move",
            axis: "y",
            dropOnEmpty: true,
            update: UpdateShortVal,
            handle: _handle,
            placeholder: 'gridwiewplaceholder'
        });
    });

    //$("#Search").keyup(function () {
    //    var thisVal = $(this).val();
    //    $(".InTxt tbody tr").hide();
    //    if (thisVal != null) {
    //        var i = $(".InTxt tbody tr:containsIgnoreCase('" + thisVal + "')").show().size();
    //        if (i > 0) { $(".InTxt tbody #NoneItem").hide(); }
    //        else { $(".InTxt tbody #NoneItem").show(); }
    //    }
    //    else {
    //        $(".InTxt tbody tr").show();
    //        $(".InTxt tbody #NoneItem").hide();
    //    }
    //}).val("Herhangi bir özelliği yazarak arama yapabilirsiniz");
    //$("#Search").focusEmpty();
    $(".InTxt tbody").append("<tr id='NoneItem' class='Hide'><td class='Big' colspan='10'><div class='NoneItemPage'>Sonuç Bulunamadı.</div></td></tr>")

    //$("a.DeleteFile").click(function () {
    //    var $this = $(this);
    //    var ID = $this.attr("rel");
    //    var type = $this.attr("type");
    //    $("*").css("cursor", "progress");
    //    $.ajax({
    //        type: "POST",
    //        data: "ID=" + ID + "&Type=" + type,
    //        url: "App_Control/DeleteFile.aspx",
    //        success: function (reply) {
    //            if (reply == "true") {
    //                $this.parent().remove();
    //            }
    //            else {
    //                alert(reply);
    //            }
    //            $("*").css("cursor", "");
    //            $(".fx_input input").val("");
    //        },
    //        error: function (xhr, ajaxOptions, thrownError) {
    //            $("*").css("cursor", "");
    //            alert(xhr.status);
    //        }
    //    });
    //    return false;
    //});

    $("input[rel=Back]").click(function () { window.location.href = "javascript:history.back(1)"; });
    $(".GridWiew tbody tr:even").each(function () { $(this).css("background-color", "#eee"); });
    $(".GridWiew tbody tr:odd").each(function () { $(this).css("background-color", "#fff"); });
    $(".GridWiew tbody tr.red").css("background-color", "#fbe3e4").css("cursor", "help");
    //$(".uploadcontrol .inputfile").change(function () {
    //    var $this = $(this);
    //    var val = $this.val();
    //    var rel = $this.parent().attr("rel");
    //    $(this).attr("disabled", "disabled");
    //    $("*").css("cursor", "progress");
    //    $.ajax({
    //        type: "POST",
    //        data: "val=" + val + "&dir=" + rel,
    //        url: "App_Control/ImageControl.aspx",
    //        success: function (reply) {
    //            if (reply == "0") {
    //                $this.parent().removeClass("GreenPanel").addClass("RedPanel").attr("title", "Dosya mevcut");
    //            }
    //            else {
    //                $this.parent().removeClass("RedPanel").addClass("GreenPanel");
    //            }
    //            $this.attr("disabled", "");
    //            $("*").css("cursor", "");
    //        }
    //    });
    //});


    $(".datepicker").datepicker({
        dateFormat: "dd/mm/yy",
        dayNamesMin: ['Pzr', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'],
        dayNames: ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'],
        monthNamesMin: ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'],
        monthNames: ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık']
    });

    $(".Phone").mask("9(999) 999-9999");
    $(".Date").mask("99/99/9999");

    $(".Hour").mask("99:99").blur(function () {
        if (parseInt($(this).val().replace(":", "")) > 2359) {
            $(this).val("");
        }
    });

    $(".Number").keyup(function () {
        if (!IsNumeric($(this).val())) {
            $(this).val(ConvertNumeric($(this).val()));
        }
    });



}
function Redirect(Url) {
    window.location.href = Url;
}

function UpdateShortVal() {
    $(".SortItems").val("");
    $(".GridWiew[type=sortable] tbody tr[id!=NoneItem]").each(function () {
        var thisVal = $(this).attr("thisVal");
        $(".SortItems").val($(".SortItems").val() + thisVal + ",")
    });
    $(".GridWiew tbody tr:even").each(function () { $(this).css("background-color", "#eee"); });
    $(".GridWiew tbody tr:odd").each(function () { $(this).css("background-color", "#fff"); });
}


function UpdateSelectedItem() {
    $(".SelectedItems").val("");
    $(".PassiveItems").val("");
    var i = 0
    debugger
    $(".GridWiew tbody input[type=checkbox]").each(function () {
        if ($(this).prop("checked")== true) {
            $(".SelectedItems").val($(".SelectedItems").val() + $(this).val() + ",");
            i += 1;
        }
        else {
            $(".PassiveItems").val($(".PassiveItems").val() + $(this).val() + ",");
        }
    });
    if (i < $(".GridWiew tbody input[type=checkbox]").size()) $(".GridWiew thead input[type=checkbox],.GridWiew tfoot input[type=checkbox]").attr("checked", "");
    else if (i == $(".GridWiew tbody input[type=checkbox]").size()) $(".GridWiew input[type=checkbox]").attr("checked", "checked");
}

function confirmDelete(Txt) {
    if (Txt == undefined || Txt == "" || Txt == null) Txt = "Silmek İstediğinize eminmisiniz?";
    return confirm(Txt);
}

