document.addEventListener('DOMContentLoaded', () => {
    const chatInput = document.getElementById('chatInput');
    const chatSendBtn = document.getElementById('chatSendBtn');
    const chatMessages = document.getElementById('chatMessages');
    const GEMINI_API_KEY = 'TU_API_KEY_AQUI';
    const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent';


    function formatMarkdown(text) {
        if (!text) return '';
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') 
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/###\s*(.*)/g, '<br><strong style="color: #ff9f43; font-size: 0.95rem;">$1</strong>')
            .replace(/---\s*/g, '<hr style="border:0; border-top:1px solid rgba(255,255,255,0.15); margin:8px 0;">')
            .replace(/\n/g, '<br>');
    }

    async function fetchWithRetry(url, options, retries = 3, delay = 2000) {
        for (let i = 0; i < retries; i++) {
            try {
                const response = await fetch(url, options);
                if ((response.status === 503 || response.status === 429) && i < retries - 1) {
                    await new Promise(resolve => setTimeout(resolve, delay));
                    delay *= 2;
                    continue;
                }
                return response;
            } catch (error) {
                if (i === retries - 1) throw error;
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    }

    async function enviarMensaje() {
        const texto = chatInput.value.trim();
        if (!texto) return;

        const userMsg = document.createElement('div');
        userMsg.className = 'message user';
        userMsg.textContent = texto;
        chatMessages.appendChild(userMsg);

        chatInput.value = '';
        chatMessages.scrollTop = chatMessages.scrollHeight;

        const loadingMsg = document.createElement('div');
        loadingMsg.className = 'message ai';
        loadingMsg.textContent = 'Analizando mercado...';
        chatMessages.appendChild(loadingMsg);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        try {
            const response = await fetchWithRetry(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-goog-api-key': GEMINI_API_KEY
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text:
                                'Actúa como CriptoMentor, un asistente experto en criptomonedas. ' +
                                'Responde de forma clara, profesional y estructurada con negritas y títulos donde corresponda. ' +
                                'No presentes tus respuestas como asesoramiento financiero personalizado. ' +
                                'Consulta del usuario: ' + texto
                        }]
                    }]
                })
            });

            const data = await response.json();

            if (loadingMsg.parentNode) {
                loadingMsg.remove();
            }

            if (!response.ok) {
                console.error('Error de Gemini:', data);
                throw new Error(data?.error?.message || `Error HTTP ${response.status}`);
            }

            const aiText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

            if (!aiText) {
                console.error('Respuesta inesperada:', data);
                throw new Error('Gemini no devolvió texto.');
            }

            const aiMsg = document.createElement('div');
            aiMsg.className = 'message ai';
            
            aiMsg.innerHTML = formatMarkdown(aiText);
            chatMessages.appendChild(aiMsg);

        } catch (error) {
            console.error('Error:', error);

            if (loadingMsg.parentNode) {
                loadingMsg.remove();
            }

            const errorMsg = document.createElement('div');
            errorMsg.className = 'message ai';
            errorMsg.textContent = 'Los servidores están con alta demanda en este momento. Por favor, intentá enviar tu mensaje nuevamente en unos segundos.';
            chatMessages.appendChild(errorMsg);
        }

        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    if (chatSendBtn) {
        chatSendBtn.addEventListener('click', enviarMensaje);
    }

    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                enviarMensaje();
            }
        });
    }
});