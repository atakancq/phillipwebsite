
const chatbotButton = document.getElementById('chatbot-button');
const chatbotForm = document.getElementById('chatbot-form');



chatbotButton.addEventListener('click', () => {
    chatbotForm.style.display = chatbotForm.style.display === 'none' || chatbotForm.style.display === '' ? 'block' : 'none';
    chatbotForm.style.display = chatbotForm.style.display === 'none' || chatbotForm.style.display === '' ? chatbotButton.innerHTML = ` <img src="/images/questionico.png" style="
            width: 37px; 
            margin-left: -8px; 
            margin-top: -3px;">` : chatbotButton.textContent = "X";
});


$("#msgarea").keyup(function (event) {
    if (event.keyCode === 13) {
        sendMessageArea();
    }
});


function sendMessage() {
    const now = new Date();
    const formattedTime = now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
    document.getElementById("started-chat-time").textContent = `Görüşme Başlatıldı; ${formattedTime}`;

    $("#screen1").hide();
    $("#screen2").show();



    // var message = $("#message").val();
    // if (message.trim() === "") {
    // alert("Lütfen bir mesaj girin!");
    // return;
    // } 

    // var htmlFrom = `<div class="me"><p>${message}</p></div>`;
    // $("#message-area").append(htmlFrom);

    var settings = {
        "url": "https://app.buyingen.com/api/send-chatbot",
        "method": "POST",
        "timeout": 0,
        "headers": {
            "Content-Type": "application/json",
            "Authorization": "Bearer pj7XMf1lHTGWnO4dWabv5kBnxTAC75Ci"
        },
        "data": JSON.stringify({
            "chatbot_token": "CIeStXCDqSl4CIY1c8cJHVtuVD9cGPRQ",
            email: document.getElementById("email").value,
            name: document.getElementById("name").value,
            //message: document.getElementById("message").value,
        }),
    };
    $.ajax(settings).done(function (response) {
        // var htmlto = `<div class="from"><p>${response.message}</p></div>`;
        // $("#message-area").append(htmlto); 
    }).fail(function (error) {
        console.log(error);
        alert("Mesaj gönderilemedi!");
    });
}



function sendMessageArea() {
    var message = $("#msgarea").val();
    if (message.trim() === "") {
        alert("Lütfen bir mesaj girin!");
        return;
    }

    var htmlFrom = `<div class="me"><p>${message}</p></div>`;
    $("#chat-messages").append(htmlFrom);

    //var writing = '<div class="writing" id="writing"> <p></p><div class="dots"></div><p></p></div>';
    //$("#writing-area").append(writing); 

    const container = document.querySelector('.dots');
    const dotCount = 3;

    for (let i = 0; i < dotCount; i++) {
        const span = document.createElement('span');
        span.textContent = '.';
        span.style.animationDelay = `${i * 0.2}s`;
        container.appendChild(span);
    }


    var messageArea = document.querySelector(".messages");
    messageArea.scrollTop = messageArea.scrollHeight;

    var settings = {
        "url": "https://app.buyingen.com/api/send-chatbot",
        "method": "POST",
        "timeout": 0,
        "headers": {
            "Content-Type": "application/json",
            "Authorization": "Bearer pj7XMf1lHTGWnO4dWabv5kBnxTAC75Ci"
        },
        "data": JSON.stringify({
            "chatbot_token": "CIeStXCDqSl4CIY1c8cJHVtuVD9cGPRQ",
            email: document.getElementById("email").value,
            name: document.getElementById("name").value,
            message: document.getElementById("msgarea").value,
        }),
    };
    $.ajax(settings).done(function (response) {
        document.getElementById("writing-area").innerHTML = "";
        var htmlto = `<div class="from"><p>${response.message}</p></div>`;
        $("#chat-messages").append(htmlto);
        messageArea.scrollTop = messageArea.scrollHeight;
    }).fail(function (error) {
        console.log(error);
        alert("Mesaj gönderilemedi!");
    });

    $("#msgarea").val("");
} 