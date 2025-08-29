const chatbotButton = document.getElementById('chatbot-button');
const chatbotForm = document.getElementById('chatbot-form');

if (chatbotButton) {
    chatbotButton.addEventListener('click', () => {
        toggleChatbot();
    });
}

function toggleChatbot() {
    if (chatbotForm.style.display === 'none' || chatbotForm.style.display === '') {
        chatbotForm.style.display = 'flex';
        if (chatbotButton) {
            chatbotButton.innerHTML = '<i class="bi bi-x-lg"></i>';
            chatbotButton.classList.add('active');
        }
        // Initialize chatbot when opened
        initializeChatbot();
        setTimeout(() => {
            scrollToBottom();
        }, 100);
    } else {
        chatbotForm.style.display = 'none';
        if (chatbotButton) {
            chatbotButton.innerHTML = '<i class="bi bi-chat-dots-fill"></i>';
            chatbotButton.classList.remove('active');
        }
    }
}

function initializeChatbot() {
    const now = new Date();
    const formattedTime = now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
    const timeElement = document.getElementById("started-chat-time");
    if (timeElement) {
        timeElement.textContent = `Görüşme ${formattedTime}`;
    }
    
    // Load chat history first, then send welcome message if no history exists
    loadChatHistory();
    
    getSessionId();
}

function loadChatHistory() {
    const sessionId = getSessionId();
    const chatHistory = getChatHistory(sessionId);
    
    if (chatHistory && chatHistory.length > 0) {
        // Restore chat history
        $("#chat-messages").html(chatHistory.join(''));
        scrollToBottom();
    } else {
        // Check if welcome message was already shown for this session
        const welcomeShown = getWelcomeMessageStatus(sessionId);
        if (!welcomeShown) {
            setTimeout(() => {
                sendWelcomeMessage();
            }, 500);
        }
    }
}

function getWelcomeMessageStatus(sessionId) {
    const WELCOME_KEY = `chatbot_welcome_${sessionId}`;
    try {
        return localStorage.getItem(WELCOME_KEY) === 'true';
    } catch (e) {
        console.error('Error checking welcome message status:', e);
        return false;
    }
}

function setWelcomeMessageStatus(sessionId, shown) {
    const WELCOME_KEY = `chatbot_welcome_${sessionId}`;
    try {
        localStorage.setItem(WELCOME_KEY, shown.toString());
    } catch (e) {
        console.error('Error setting welcome message status:', e);
    }
}

function clearWelcomeMessageStatus(sessionId) {
    const WELCOME_KEY = `chatbot_welcome_${sessionId}`;
    localStorage.removeItem(WELCOME_KEY);
}

function getChatHistory(sessionId) {
    const CHAT_HISTORY_KEY = `chatbot_history_${sessionId}`;
    try {
        const history = localStorage.getItem(CHAT_HISTORY_KEY);
        return history ? JSON.parse(history) : [];
    } catch (e) {
        console.error('Error loading chat history:', e);
        return [];
    }
}

function saveChatHistory(sessionId, messageHtml) {
    const CHAT_HISTORY_KEY = `chatbot_history_${sessionId}`;
    try {
        let history = getChatHistory(sessionId);
        history.push(messageHtml);
        
        // Limit history to last 50 messages to prevent localStorage from getting too large
        if (history.length > 50) {
            history = history.slice(-50);
        }
        
        localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(history));
    } catch (e) {
        console.error('Error saving chat history:', e);
    }
}

function clearChatHistory(sessionId) {
    const CHAT_HISTORY_KEY = `chatbot_history_${sessionId}`;
    localStorage.removeItem(CHAT_HISTORY_KEY);
    
    // Also clear welcome message status when clearing chat history
    clearWelcomeMessageStatus(sessionId);
}

function sendWelcomeMessage() {
    const welcomeMessage = "Merhaba! PhillipCapital yapay zeka destekli asistanına hoş geldiniz. Size nasıl yardımcı olabilirim?";
    
    const htmlTo = `
        <div class="from welcome-message">
            <div class="bot-avatar">
                <img src="/content/images/project-icon.png" alt="Bot" />
            </div>
            <div class="message-content">
                <p>${welcomeMessage}</p>
            </div>
        </div>`;
    
    $("#chat-messages").html(htmlTo);
    
    // Save welcome message to history and mark as shown
    const sessionId = getSessionId();
    saveChatHistory(sessionId, htmlTo);
    setWelcomeMessageStatus(sessionId, true);
    
    scrollToBottom();
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
                // Clear old chat history and welcome status when session expires
                clearChatHistory(sessionData.session_id);
            }
        } catch (e) {
            localStorage.removeItem(SESSION_KEY);
        }
    }
    
    const newSessionId = generateUUID();
    const expiryTime = new Date().getTime() + SESSION_DURATION;
    
    const sessionData = {
        session_id: newSessionId,
        expiry: expiryTime,
        created: new Date().getTime()
    };
    
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
    return newSessionId;
}

function clearSession() {
    const sessionData = localStorage.getItem('chatbot_session');
    if (sessionData) {
        try {
            const session = JSON.parse(sessionData);
            clearChatHistory(session.session_id);
        } catch (e) {
            console.error('Error clearing session:', e);
        }
    }
    localStorage.removeItem('chatbot_session');
}

// Enhanced Markdown to HTML converter with full featured libraries
function convertMarkdownToHtml(text) {
    if (!text) return '';
    
    // Check if all required libraries are available
    if (typeof marked !== 'undefined' && typeof DOMPurify !== 'undefined') {
        try {
            // Configure highlight.js if available
            if (typeof hljs !== 'undefined') {
                // Register common languages
                if (hljs.getLanguage('javascript')) {
                    // Languages are already loaded via CDN
                }
                
                // Configure marked with highlight.js
                marked.setOptions({
                    gfm: true,
                    breaks: true,
                    smartypants: true,
                    headerIds: false,
                    highlight: function(code, lang) {
                        if (lang && hljs.getLanguage(lang)) {
                            try {
                                return hljs.highlight(code, { language: lang }).value;
                            } catch (e) {
                                console.warn('Highlight.js error:', e);
                            }
                        }
                        return hljs.highlightAuto(code).value;
                    }
                });
            } else {
                // Configure marked without highlight.js
                marked.setOptions({
                    gfm: true,
                    breaks: true,
                    smartypants: true,
                    headerIds: false
                });
            }
            
            // Custom renderer for links and images
            const renderer = new marked.Renderer();
            
            // Links with security attributes
            renderer.link = function(href, title, text) {
                const titleAttr = title ? ` title="${title}"` : '';
                return `<a href="${href}"${titleAttr} target="_blank" rel="noopener noreferrer nofollow ugc">${text}</a>`;
            };
            
            // Images with lazy loading
            renderer.image = function(href, title, text) {
                const titleAttr = title ? ` title="${title}"` : '';
                const altAttr = text ? ` alt="${text}"` : '';
                return `<img src="${href}"${titleAttr}${altAttr} loading="lazy" style="max-width: 100%; height: auto;">`;
            };
            
            // Parse markdown
            let html = marked.parse(text, { renderer: renderer });
            
            // Sanitize with DOMPurify
            html = DOMPurify.sanitize(html, {
                ADD_ATTR: ['target', 'rel', 'loading'],
                ALLOWED_TAGS: [
                    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
                    'p', 'br', 'strong', 'b', 'em', 'i', 'u', 's', 'del',
                    'a', 'img', 'code', 'pre', 'blockquote',
                    'ul', 'ol', 'li', 'table', 'thead', 'tbody', 'tr', 'th', 'td',
                    'hr', 'div', 'span'
                ],
                ALLOWED_ATTR: [
                    'href', 'title', 'alt', 'src', 'target', 'rel', 'loading',
                    'class', 'style', 'data-*'
                ]
            });
            
            // Wrap in markdown-body container
            return `<div class="markdown-body">${html}</div>`;
            
        } catch (e) {
            console.error('Markdown parsing error:', e);
            return fallbackMarkdownToHtml(text);
        }
    }
    
    // Fallback to simple markdown parsing
    return fallbackMarkdownToHtml(text);
}

// Fallback function for when libraries are not available
function fallbackMarkdownToHtml(text) {
    if (!text) return '';
    
    let html = text
        // Headers
        .replace(/^### (.*$)/gm, '<h3>$1</h3>')
        .replace(/^## (.*$)/gm, '<h2>$1</h2>')
        .replace(/^# (.*$)/gm, '<h1>$1</h1>')
        // Bold and italic
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
        .replace(/\*([^*]+)\*/g, '<em>$1</em>')
        // Links
        .replace(/\[([^\]]*)\]\(([^)]*)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer nofollow ugc">$1</a>')
        .replace(/(^|[^"'>])(https?:\/\/[^\s<>"']+)/gi, '$1<a href="$2" target="_blank" rel="noopener noreferrer nofollow ugc">$2</a>')
        // Inline code
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        // Code blocks (simple)
        .replace(/```[\s\S]*?```/g, function(match) {
            const code = match.replace(/```(\w+)?\n?/g, '').replace(/```$/g, '');
            return `<pre><code>${escapeHtml(code)}</code></pre>`;
        })
        // Line breaks
        .replace(/\n\s*\n/g, '</p><p>')
        .replace(/\n/g, '<br>');
    
    // Wrap in paragraphs if not starting with heading or list
    if (!html.startsWith('<h') && !html.startsWith('<ul') && !html.startsWith('<ol') && !html.startsWith('<pre')) {
        html = '<p>' + html + '</p>';
    }
    
    // Clean up empty paragraphs
    html = html.replace(/<p><\/p>/g, '');
    
    return `<div class="markdown-body">${html}</div>`;
}

function sendMessageArea() {
    const message = $("#msgarea").val().trim();
    if (!message) return;

    sendChatMessage(message, false);
    $("#msgarea").val("");
}

function sendChatMessage(message, isWelcome) {
    const sessionId = getSessionId();
    
    if (!isWelcome) {
        const htmlFrom = `
            <div class="me">
                <div class="message-content">
                    <p>${escapeHtml(message)}</p>
                </div>
            </div>`;
        $("#chat-messages").append(htmlFrom);
        
        // Save user message to history
        saveChatHistory(sessionId, htmlFrom);
        
        scrollToBottom();
    }

    showTypingIndicator();

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
                }
                
                const formattedMessage = convertMarkdownToHtml(botMessage);
                
                const htmlTo = `
                    <div class="from">
                        <div class="bot-avatar">
                            <img src="/content/images/project-icon.png" alt="Bot" />
                        </div>
                        <div class="message-content">
                            ${formattedMessage}
                        </div>
                    </div>`;
                $("#chat-messages").append(htmlTo);
                
                // Save bot message to history
                saveChatHistory(sessionId, htmlTo);
                
                scrollToBottom();
                
            } catch (e) {
                const errorHtml = `
                    <div class="from">
                        <div class="bot-avatar">
                            <img src="/content/images/project-icon.png" alt="Bot" />
                        </div>
                        <div class="message-content">
                            <p>Üzgünüz, bir hata oluştu. Lütfen tekrar deneyin.</p>
                        </div>
                    </div>`;
                $("#chat-messages").append(errorHtml);
                
                // Save error message to history
                saveChatHistory(sessionId, errorHtml);
                
                scrollToBottom();
            }
        })
        .fail(function (xhr, status, error) {
            hideTypingIndicator();
            
            let errorMessage = "Bağlantı hatası oluştu. Lütfen tekrar deneyin.";
            
            if (xhr.status === 422) {
                errorMessage = "Mesaj formatında hata var. Lütfen tekrar deneyin.";
            } else if (xhr.status === 0) {
                errorMessage = "Bağlantı kurulamadı. İnternet bağlantınızı kontrol edin.";
            }
            
            const errorHtml = `
                <div class="from">
                    <div class="bot-avatar">
                        <img src="/content/images/project-icon.png" alt="Bot" />
                    </div>
                    <div class="message-content">
                        <p>${errorMessage}</p>
                    </div>
                </div>`;
            $("#chat-messages").append(errorHtml);
            
            // Save error message to history
            const sessionId = getSessionId();
            saveChatHistory(sessionId, errorHtml);
            
            scrollToBottom();
        });
}

function showTypingIndicator() {
    const container = document.querySelector('#writing-area');
    if (container) {
        container.innerHTML = `
            <div class="from typing-indicator">
                <div class="bot-avatar">
                    <img src="/content/images/project-icon.png" alt="Bot" />
                </div>
                <div class="message-content">
                    <div class="typing-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            </div>`;
    }
    scrollToBottom();
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

// Function to clear chat history with confirmation (improved with delay)
function clearChatHistoryWithConfirm() {
    // Small delay to ensure SweetAlert2 is fully loaded
    setTimeout(function() {
        if (typeof Swal !== 'undefined') {
            console.log('SweetAlert2 is available, showing dialog');
            
            Swal.fire({
                title: 'Geçmişi Temizle',
                text: 'Tüm konuşma geçmişini silmek istediğinizden emin misiniz?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Evet, Sil',
                cancelButtonText: 'İptal',
                backdrop: true,
                allowOutsideClick: false,
                customClass: {
                    popup: 'swal2-popup-custom'
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    clearChatHistoryAndReset();
                    
                    Swal.fire({
                        title: 'Temizlendi!',
                        text: 'Konuşma geçmişi başarıyla silindi.',
                        icon: 'success',
                        timer: 1500,
                        showConfirmButton: false,
                        timerProgressBar: true
                    });
                }
            }).catch((error) => {
                console.error('SweetAlert2 error:', error);
                fallbackConfirmDialog();
            });
        } else {
            console.log('SweetAlert2 not available, using fallback');
            fallbackConfirmDialog();
        }
    }, 100);
}

// Fallback function for when SweetAlert2 is not available
function fallbackConfirmDialog() {
    if (confirm("Tüm konuşma geçmişini silmek istediğinizden emin misiniz?")) {
        clearChatHistoryAndReset();
        setTimeout(() => {
            alert("Konuşma geçmişi başarıyla silindi.");
        }, 300);
    }
}

// Function to clear chat history and reset to welcome message
function clearChatHistoryAndReset() {
    const sessionId = getSessionId();
    
    // Clear chat history from localStorage
    clearChatHistory(sessionId);
    
    // Clear the chat messages from UI
    $("#chat-messages").html('');
    
    // Send welcome message again
    setTimeout(() => {
        sendWelcomeMessage();
    }, 300);
}

// Debug function to test SweetAlert2
function testSweetAlert() {
    if (typeof Swal !== 'undefined') {
        Swal.fire('Test', 'SweetAlert2 çalışıyor!', 'success');
    } else {
        alert('SweetAlert2 yüklü değil!');
    }
}

$(document).ready(function() {
});