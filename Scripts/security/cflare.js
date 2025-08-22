$(document).ready(() => {
    var checkCookie = checkCookieValidity("cfv");
    if (checkCookie)
        window.location.href = "/";
});

window.onloadTurnstileCallback = function () {
    turnstile.render('#verify-container', {
        sitekey: '0x4AAAAAAASO4bKbM1gXq5hB',
        callback: function (token) { 
            handleResponse(token); 
        },
    });
};

function resetTurnstile() {
    var widgetSelector = "#verify-container";
    try {
        console.log("Trying to reset Turnstile with widgetSelector =", widgetSelector);
        if (widgetSelector && turnstile && typeof turnstile.reset === "function") {
            turnstile.reset(widgetSelector);
            console.log("Turnstile reset");
        } else {
            console.log("Turnstile or reset function is undefined");
        }
    } catch (e) {
        console.error("Error resetting Turnstile:", e);
    }
}

function readyCheck() {
    turnstile.ready(function () {
        turnstile.render('#verify-container', {
            sitekey: '0x4AAAAAAASO4bKbM1gXq5hB',
            callback: function (token) {
                console.log(`token ${token}`);
            },
        });
    });
}


function handleResponse(token) {
    var verifyTokenRequest = {
        token: token,
        secretKey: "",
        ip: ""
    };
    var widgetSelector = "#verify-container";
    $.ajax({
        url: `/WebServices/ClientServices.asmx/VerifyToken?token=${verifyTokenRequest.token}`,
        type: 'POST',
        contentType: 'application/x-www-form-urlencoded',
        dataType: 'json',
        success: function (res) {
            if (String(res).includes("true")) {
                const d = new Date();
                var t = d.getTime() + (14 * 24 * 60 * 60 * 1000);
                d.setTime(t);
                let expires = "expires=" + d.toUTCString();
                document.cookie = `cfv=${true}; expires=${expires}`;
                turnstile.remove(widgetSelector);
                $("#redirect-msg").show();
                $("#verify-message").hide();
                setTimeout(() => {
                    document.location.href = "/";
                }, 800)

            }
        },
        error: (err) => {
            console.log(err)
        }
    })
}

function validTest() {
    var verifyTokenRequest = {
        token: "abc",
        secretKey: "",
        ip: ""
    };
    $.ajax({
        url: `/WebServices/ClientServices.asmx/VerifyToken?token=${verifyTokenRequest.token}`,
        type: 'POST',
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify(verifyTokenRequest),
        success: function (res) {
            if (String(res).includes("true")) {
                const d = new Date();
                var t = d.getTime() + (14 * 24 * 60 * 60 * 1000);
                d.setTime(t);
                let expires = "expires=" + d.toUTCString();
                document.cookie = `cfv=${true}; expires=${expires}`;
                turnstile.remove(widgetSelector);
                $("#redirect-msg").show();
                $("#verify-message").hide();
                setTimeout(() => {
                    document.location.href = "/";
                }, 800)

            }
        },
        error: (err) => {
            console.log(err)
        }
    })
}

function checkCookieValidity(cname) {
    var cookieValue = getCookie(cname);
    if (cookieValue !== "") {
        var cookieExpiration = new Date(getCookieExpiration(cname));
        var currentDate = new Date();
        if (cookieExpiration > currentDate) {
            return true;
        } else {
            return false;
        }
    } else {
        console.log("Çerez bulunamadı.");
    }
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function getCookieExpiration(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length).split('=')[1];
        }
    }
    return "";
}