/* HistoryBack - Berker Yüceer - 24.06.2021 */
function historyBack() {
    // history.back();
    // $.cookie("previousUrl", window.location.href, {path:"/"});
    /*//
    console.log(
        "referrer[" + document.referrer + "] \n" +
        "historyLength[" + window.history.length + "] \n" +
        "history[" + window.history[0] + "] \n"
    );
    //*/
    if (document.referrer != null)
        window.location.href = document.referrer;
    else
        window.location.href = "/Anasayfa";
}
// Element Is In View
function isInView(el) {
    var rect = el.getBoundingClientRect(); // Absolute Positions of Element
    // return !(rect.top > $(window).height() || rect.bottom < 0); // Partialy Visible?
    return !(rect.bottom > $(window).height() || rect.top < 0); // Totaly Visible?
}
// Make Sure It is Click Event For Touch Devices
var setClickEvent = function (elem, func) {
    var isRecording = false;
    var isMoved = false;
    var isEnd = false;
    // On Movement Catch
    var onMove = function (e) {
        isMoved = true;
    };
    // Stop Recording
    var onEnd = function (e) {
        isEnd = true;
        if (isMoved) {
            return true;    // slide event, make sure continues
        } else {
            func(elem, e);  // click event function
        }
    };
    // Start Recording
    var onStart = function (e) {
        isRecording = true;
        isMoved = false;
        // Set Events
        if (e.type == "touch") {
            elem.addEventListener('touchmove', onMove); // Move Event
            elem.addEventListener('touchend', onEnd);   // End Event
        } else {
            elem.addEventListener('mousemove', onMove); // Move Event
            elem.addEventListener('mouseup', onEnd);    // End Event
        }
    };
    // Set Action
    /* Conditional "touch OR mouse/keyboard" event binding */
    if ('touchstart' in window) {
        // Set up event listeners for touch
        elem.addEventListener('touchstart', onStart);
    } else {
        // Set up event listeners for mouse/keyboard
        elem.addEventListener('mousedown', onStart);
    }
};
/* Window Resize Handler - Berker Yüceer - 24.06.2021 */
(function () {
    // Gathered from https://css-tricks.com/the-trick-to-viewport-units-on-mobile/
    let vw = (window.innerWidth) * 0.01;
    let vh = (window.innerHeight) * 0.01;
    // Then we set the value in the --vh custom property to the root of the document `${vh}px`
    document.documentElement.style.setProperty('--vw', vw + 'px');
    document.documentElement.style.setProperty('--vh', vh + 'px');
})();
// We listen to the resize event
window.addEventListener('resize', () => {
    // We execute the same script as before
    let vw = (window.innerWidth) * 0.01;
    let vh = (window.innerHeight) * 0.01;
    document.documentElement.style.setProperty('--vw', vw + 'px');
    document.documentElement.style.setProperty('--vh', vh + 'px');
});
// We listen to the orientationchange event
window.addEventListener('orientationchange', () => {
    // We execute the same script as before
    let vw = (window.innerWidth) * 0.01;
    let vh = (window.innerHeight) * 0.01;
    document.documentElement.style.setProperty('--vw', vw + 'px');
    document.documentElement.style.setProperty('--vh', vh + 'px');
});
/* Navigation Panel Close On Outside Clicks - Berker Yüceer - 19.02.2021 */
$(document).click(function (e) {
    // Navigation Panel Close
    if (!$(e.target).hasClass('navbar-collapse')) {
        $('.navbar-collapse').removeClass('in');
    }
    // Theme Panel Close
    if (!$(e.target).hasClass('theme-b')) {
        $('.theme-d').removeClass('in');
    }
});
/* Resize & Position - Berker Yüceer - 04.06.2021 */
var scaleFit = function (parent, child, onlyWidth) {
    // Reset to normal sizes for calculation
    child.style.transform = 'scale(1, 1)';
    // Fit only by Width? Scrollable Height
    if (onlyWidth) {
        // Calculate Width
        var cw = child.getBoundingClientRect().width;
        var pw = parent.getBoundingClientRect().width;
        var scaleX = pw / cw; // Only fit by width (Scrollable)
        var scaleY = scaleX;
        child.style.transform = 'scale(' + scaleX + ', ' + scaleY + ')';
        // child.style.top = '50%'; // Scrollable so no need to do this
        child.style.left = '50%';
        // Attention: Reset parent scroll top first then get the top position of child 
        parent.scrollTop = 0;
        var ct = child.getBoundingClientRect().top;
        // Scroll to Position
        parent.scrollTo(cw / 2, ct - 86); // -51 top menu - 5 margin - 30 graph tabs
    } else {
        var cw = child.getBoundingClientRect().width;
        var ch = child.getBoundingClientRect().height;
        var pw = parent.getBoundingClientRect().width;
        var ph = parent.getBoundingClientRect().height;
        var scaleX = Math.min(pw / cw, ph / ch); // Protect Aspect Ratio
        var scaleY = scaleX;
        child.style.transform = 'scale(' + scaleX + ', ' + scaleY + ')';
        // Centered Child
        child.style.top = '50%';
        child.style.left = '50%';
        // Get Top Position After Scaling
        var ct = child.getBoundingClientRect().top;
        // Scroll to Position
        parent.scrollTo(cw / 2, ct);
    }
};
// Parse Currency With Local Style - Berker Yüceer
function parseLocalCurrency(value, locale, fraction, style, currency) {
    /*//
    console.log(
        "Incoming Value [" + value + "]\n" +
        "Locale [" + locale + "]\n" +
        "Fraction [" + fraction + "]\n" +
        "Style [" + style + "]\n" +
        "Currency [" + currency + "]\n"
    );
    //*/
    try {
        if (typeof value == 'undefined') { return "-"; }
        if (typeof value == 'string') { value = parseFloat(value); }
        if (style == 'currency') {
            return value.toLocaleString((locale ? locale : "tr-TR"), {
                minimumFractionDigits: (fraction ? fraction : 2),
                maximumFractionDigits: (fraction ? fraction : 2),
                style: (style ? style : 'currency'),
                currency: (currency ? currency : 'TRY')
            });
        }
        return value.toLocaleString((locale ? locale : "tr-TR"), {
            minimumFractionDigits: (fraction ? fraction : 0),
            maximumFractionDigits: (fraction ? fraction : 0)
        });
    } catch (ex) {
        console.log("Exception occurred in parseLocalCurrency() method... Message[" + ex + "]");
        return "-";
    }
}
// TR Values For Decimal Value Correction - Berker Yüceer - 29.07.2021
function floated(val, fix) {
    if (fix != null)
        return parseFloat(val.replaceAll(".", "").replace(",", ".")).toFixed(fix);
    return parseFloat(val.replaceAll(".", "").replace(",", "."));
}
// Decimal Values For TR Value Correction - Berker Yüceer - 29.07.2021
function unFloated(val, fix) {
    if (fix != null)
        return parseFloat(val).toFixed(fix).replace(".", ",");
    return parseFloat(val).toString().replace(".", ",");
}
// Unix Time to Readable DateTime - Berker Yüceer - 22.04.2021
function unixToDateTime(unix) {
    var date = new Date((unix * 1000));
    function zeros(x) { return x < 10 ? "0" + x : x; }
    return date.getFullYear() + "-" + zeros(date.getMonth() + 1) + "-" + date.getDate() + " " + zeros(date.getHours()) + ":" + zeros(date.getMinutes()) + ":" + zeros(date.getSeconds());
}
// Get Only Last X Digits
function lastXdigit(text, digits, seperator) {
    if (text == "") { return "-"; }
    return text.substring(0, text.indexOf(seperator ? seperator : ".") + (digits ? (digits + 1) : 3))
}
// Change Tabs On Click
function changetabs(tabs, tabcos) {
    // Tab Activation
    $(tabs).click(function () {
        // Change Tab
        let inx = $(this).index();
        $(tabs).removeClass("active");
        $(this).addClass("active");
        // Change Tab Content
        $(tabcos).removeClass("active");
        
        $(tabcos).eq(inx).addClass("active");
        //$(tabcos).eq(inx).children(".quick-tabs").children("a").removeClass("active")
        //$(tabcos).eq(inx).children(".quick-tabs").children("a").eq(0).addClass("active")

        //$(tabcos).eq(inx).find(".table-box").removeClass("active")
        //$(tabcos).eq(inx).find(".table-box").eq(0).addClass("active")
    });
}

$(function () {
    $(".clickurl").click(function (e) {
        window.open($(this).data("url"), $(this).data("target"));
    });

    $(".page-container .views .block .tabcos .tabco .quick-tabs .quick-tab").click(function (e) {
        //console.log($(this).parent());
        //console.log($(this).parents(1).find(".quick-tab"))
        $(this).parent().parent().find(".quick-tab").removeClass("active");
        $(this).addClass("active");
        var getindex = $(this).parent().parent().find(".quick-tab").index($(this));
        $(this).parent().parent().find(".table-box").removeClass("active");
        $(this).parent().parent().find(".table-box").eq(getindex).addClass("active");
    });
});
function changetabsAccordion(tabs, accordion) {
    // Tab Activation
    $(tabs).click(function () {
        // Change Tab

        $(tabs).removeClass("active");
        $(this).addClass("active");
        // Change Tab Content
        $(accordion).removeClass("active");
        console.log($(this).index())
        $(accordion).eq($(this).index()).addClass("active");
        $(accordion).eq($(this).index()).children(".tab").children("a").removeClass("active")
        $(accordion).eq($(this).index()).children(".tab").children("a").eq(0).addClass("active")

        $(accordion).eq($(this).index()).find(".accordion-content").removeClass("active")
        $(accordion).eq($(this).index()).find(".accordion-content").eq(0).addClass("active")
    });
}
$(function () {
    $(".clickurl").click(function (e) {
        window.open($(this).data("url"), $(this).data("target"));
    });

    $(".accordion .tabs .tab").click(function (e) {
        $(".accordion .tabs .tab").removeClass("active");
        $(this).addClass("active");
        var getindex = $(".accordion .tabs .tab").index($(this));
        $(".accordion .accordion-content").removeClass("active");
        $(".accordion .accordion-content").eq(getindex).addClass("active");
    });
});