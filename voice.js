// Voice Input Module for Hitmo Assistant
// Uses Web Speech API for voice-to-text conversion

class VoiceInput {
    constructor() {
        this.recognition = null;
        this.isListening = false;
        this.supported = false;
        this.init();
    }

    init() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        if (SpeechRecognition) {
            this.supported = true;
            this.recognition = new SpeechRecognition();

            this.recognition.continuous = false;
            this.recognition.interimResults = false;
            this.recognition.maxAlternatives = 1;

            this.updateLanguage();

            this.recognition.onstart = () => {
                this.isListening = true;
                this.updateUI(true);
            };

            this.recognition.onend = () => {
                this.isListening = false;
                this.updateUI(false);
            };

            this.recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                this.handleResult(transcript);
            };

            this.recognition.onerror = (event) => {
                console.warn('Speech recognition status:', event.error);
                this.isListening = false;
                this.updateUI(false);
            };
        }
    }

    getLangCode(lang) {
        const langMap = {
            'en': 'en-US',
            'es': 'es-ES',
            'pt': 'pt-BR',
            'fr': 'fr-FR',
            'de': 'de-DE',
            'ar': 'ar-SA'
        };
        return langMap[lang] || 'en-US';
    }

    updateLanguage() {
        if (this.recognition) {
            const currentLang = typeof i18n !== 'undefined' ? i18n.getCurrentLanguage() : 'en';
            this.recognition.lang = this.getLangCode(currentLang);
        }
    }

    start() {
        if (!this.supported) {
            alert('Voice recognition is not supported in this browser. Please use Chrome, Edge, or Safari.');
            return;
        }

        if (this.isListening) {
            this.stop();
        } else {
            try {
                this.updateLanguage();
                this.recognition.start();
            } catch (error) {
                console.error('Failed to start recognition:', error);
            }
        }
    }

    stop() {
        if (this.recognition && this.isListening) {
            this.recognition.stop();
        }
    }

    handleResult(transcript) {
        if (!transcript || !transcript.trim()) return;

        // If assistant is closed, open it
        if (typeof hitmoAssistant !== 'undefined') {
            if (!hitmoAssistant.isOpen) {
                hitmoAssistant.toggle();
            }
            const input = document.getElementById('assistantInput');
            if (input) input.value = transcript;
            hitmoAssistant.sendMessage(transcript);
        }

        if (window.sfx) window.sfx.playClick();
    }

    updateUI(isActive) {
        const micButtons = [
            document.getElementById('voiceMicButton'),
            document.getElementById('assistantVoiceButton'),
            document.getElementById('floatingVoiceBtn')
        ];

        micButtons.forEach(btn => {
            if (!btn) return;
            if (isActive) {
                btn.classList.add('bg-rose-500', 'text-white', 'animate-pulse');
                btn.classList.remove('bg-slate-100', 'dark:bg-dark-surface', 'text-slate-600', 'dark:text-slate-300');
            } else {
                btn.classList.remove('bg-rose-500', 'text-white', 'animate-pulse');
                btn.classList.add('bg-slate-100', 'dark:bg-dark-surface', 'text-slate-600', 'dark:text-slate-300');
            }
        });
    }

    isSupported() {
        return this.supported;
    }
}

const voiceInput = new VoiceInput();

function toggleVoiceInput() {
    voiceInput.start();
}
