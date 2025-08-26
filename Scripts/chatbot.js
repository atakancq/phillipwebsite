const chatbotButton = document.getElementById('chatbot-button');
const chatbotForm = document.getElementById('chatbot-form');

if (chatbotButton) {
    chatbotButton.addEventListener('click', () => {
        chatbotForm.style.display = chatbotForm.style.display === 'none' || chatbotForm.style.display === '' ? 'block' : 'none';
        
        if (chatbotForm.style.display === 'block') {
            chatbotButton.textContent = "X";
        } else {
            chatbotButton.innerHTML = `<img src="/images/questionico.png" style="width: 37px; margin-left: -8px; margin-top: -3px;">`;
        }
    });
}

$("#msgarea").keyup(function (event) {
    if (event.keyCode === 13) {
        sendMessageArea();
    }
});

function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function getSessionId() {
    const SESSION_KEY = 'chatbot_session';
    const SESSION_DURATION = 8 * 60 * 60 * 1000;
    
    const storedSession = localStorage.getItem(SESSION_KEY);
    
    if (storedSession) {
        try {
            const sessionData = JSON.parse(storedSession);
            const now = new Date().getTime();
            
            if (now < sessionData.expiry) {
                return sessionData.session_id;
            } else {
                localStorage.removeItem(SESSION_KEY);
            }
        } catch (e) {
            localStorage.removeItem(SESSION_KEY);
        }
    }
    
    const newSessionId = generateUUID();
    const expiryTime = new Date().getTime() + SESSION_DURATION;
    const createdTime = new Date().getTime();
    
    const sessionData = {
        session_id: newSessionId,
        expiry: expiryTime,
        created: createdTime
    };
    
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
    
    return newSessionId;
}

function clearSession() {
    localStorage.removeItem('chatbot_session');
}

function convertMarkdownToHtml(text) {
    if (!text) return '';
    
    let html = text
        .replace(/\[([^\]]*)\]\(([^)]*)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
        .replace(/(^|[^"'>])(https?:\/\/[^\s<>"']+)/gi, '$1<a href="$2" target="_blank" rel="noopener noreferrer">$2</a>')
        .replace(/(^|[^"'>])(www\.[^\s<>"']+)/gi, '$1<a href="https://$2" target="_blank" rel="noopener noreferrer">$2</a>')
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
        .replace(/\*([^*]+)\*/g, '<em>$1</em>')
        .replace(/^### (.*)$/gm, '<h3>$1</h3>')
        .replace(/^## (.*)$/gm, '<h2>$1</h2>')
        .replace(/^# (.*)$/gm, '<h1>$1</h1>')
        .replace(/^\* (.+)$/gm, '<li>$1</li>')
        .replace(/\n\s*\n/g, '</p><p>')
        .replace(/\n/g, '<br>');
    
    html = html.replace(/(<li>.*?<\/li>)(?:\s*<br>\s*<li>.*?<\/li>)*/g, function(match) {
        return '<ul>' + match.replace(/<br>/g, '') + '</ul>';
    });
    
    if (!html.startsWith('<h') && !html.startsWith('<ul') && !html.startsWith('<ol')) {
        html = '<p>' + html + '</p>';
    }
    
    html = html
        .replace(/<p><\/p>/g, '')
        .replace(/<p>\s*<br>\s*<\/p>/g, '')
        .replace(/<br><\/p>/g, '</p>')
        .replace(/<p><br>/g, '<p>');
    
    return html;
}

function sendMessage() {
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    
    if (!name || !email) {
        alert("Lütfen adınızı ve e-posta adresinizi girin!");
        return;
    }
    
    if (!isValidEmail(email)) {
        alert("Lütfen geçerli bir e-posta adresi girin!");
        return;
    }

    const now = new Date();
    const formattedTime = now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
    document.getElementById("started-chat-time").textContent = `Görüşme Başlatıldı; ${formattedTime}`;

    $("#screen1").hide();
    $("#screen2").show();

    sendChatMessage("Merhaba", true);
}

function sendMessageArea() {
    const message = $("#msgarea").val().trim();
    if (!message) {
        alert("Lütfen bir mesaj girin!");
        return;
    }

    sendChatMessage(message, false);
    $("#msgarea").val("");
}

function sendChatMessage(message, isWelcome) {
    if (!isWelcome) {
        const htmlFrom = `<div class="me"><p>${escapeHtml(message)}</p></div>`;
        $("#chat-messages").append(htmlFrom);
        scrollToBottom();
    }

    showTypingIndicator();

    const sessionId = getSessionId();

    const settings = {
        "url": "/WebServices/ClientServices.asmx/GetChatMessage",
        "method": "POST",
        "timeout": 30000,
        "headers": {
            "Content-Type": "application/json"
        },
        "data": JSON.stringify({
            message: message,
            session_id: sessionId
        })
    };
    
    $.ajax(settings)
        .done(function (response) {
            hideTypingIndicator();
            
            try {
                let data;
                let botMessage = "Üzgünüz, yanıt alınamadı.";
                
                if (response && response.d) {
                    if (typeof response.d === 'string') {
                        data = JSON.parse(response.d);
                    } else {
                        data = response.d;
                    }
                } else if (typeof response === 'string') {
                    data = JSON.parse(response);
                } else if (response && typeof response === 'object') {
                    data = response;
                } else {
                    throw new Error("Bilinmeyen response formatı");
                }
                
                if (data && data.message) {
                    botMessage = data.message;
                    
                    if (botMessage.includes("Görüşme süreniz dolmuştur")) {
                        clearSession();
                    }
                } else if (data && data.response) {
                    botMessage = data.response;
                } else if (typeof data === 'string') {
                    botMessage = data;
                } else if (data && data.success === false && data.error) {
                    botMessage = "Üzgünüz, şu anda size yardımcı olamıyoruz. Lütfen daha sonra tekrar deneyin.";
                }
                
                const formattedMessage = convertMarkdownToHtml(botMessage);
                
                const htmlTo = `<div class="from">${formattedMessage}</div>`;
                $("#chat-messages").append(htmlTo);
                scrollToBottom();
                
            } catch (e) {
                const errorHtml = `<div class="from"><p>Üzgünüz, bir hata oluştu. Lütfen tekrar deneyin.</p></div>`;
                $("#chat-messages").append(errorHtml);
                scrollToBottom();
            }
        })
        .fail(function (xhr, status, error) {
            hideTypingIndicator();
            
            let errorMessage = "Bağlantı hatası oluştu. Lütfen tekrar deneyin.";
            
            try {
                if (xhr.responseText) {
                    const errorResponse = JSON.parse(xhr.responseText);
                    if (errorResponse.message) {
                        errorMessage = errorResponse.message;
                    }
                }
            } catch (e) {
            }
            
            if (xhr.status === 422) {
                errorMessage = "Mesaj formatında hata var. Lütfen tekrar deneyin.";
            } else if (xhr.status === 500) {
                errorMessage = "Sunucu hatası oluştu. Lütfen daha sonra tekrar deneyin.";
            } else if (xhr.status === 0) {
                errorMessage = "Bağlantı kurulamadı. İnternet bağlantınızı kontrol edin.";
            }
            
            const errorHtml = `<div class="from"><p>${errorMessage}</p></div>`;
            $("#chat-messages").append(errorHtml);
            scrollToBottom();
        });
}

function showTypingIndicator() {
    const container = document.querySelector('#writing-area');
    if (container) {
        container.innerHTML = '<div class="dots"><span>.</span><span>.</span><span>.</span></div>';
        
        const dots = container.querySelectorAll('.dots span');
        dots.forEach((dot, index) => {
            dot.style.animationDelay = `${index * 0.2}s`;
        });
    }
}

function hideTypingIndicator() {
    const container = document.getElementById("writing-area");
    if (container) {
        container.innerHTML = "";
    }
}

function scrollToBottom() {
    const messageArea = document.querySelector(".messages");
    if (messageArea) {
        messageArea.scrollTop = messageArea.scrollHeight;
    }
}

function escapeHtml(text) {
    if (typeof text !== 'string') {
        text = String(text);
    }
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

$(document).ready(function() {
    getSessionId(); 
});