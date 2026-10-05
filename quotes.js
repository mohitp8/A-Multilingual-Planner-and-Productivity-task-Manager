// Elite Motivational Database - Cristiano Ronaldo & Tony Stark (Iron Man) Only
// Curated for Hitmo's Planner - Professional Edition

const MOTIVATIONAL_DATABASE = [
    // Cristiano Ronaldo - The Relentless Champion
    {
        quote: "Your love makes me strong, your hate makes me unstoppable.",
        author: "Cristiano Ronaldo",
        role: "5× Ballon d'Or Winner",
        category: "CR7",
        badge: "⚽ RELENTLESS MINDSET",
        gradient: "from-green-600 to-emerald-700"
    },
    {
        quote: "Talent without working hard is nothing.",
        author: "Cristiano Ronaldo",
        role: "All-Time Top Scorer",
        category: "CR7",
        badge: "⚽ WORK ETHIC",
        gradient: "from-green-600 to-emerald-700"
    },
    {
        quote: "I don't have to show anything to anyone. There is nothing to prove.",
        author: "Cristiano Ronaldo",
        role: "Champions League Legend",
        category: "CR7",
        badge: "⚽ CONFIDENCE",
        gradient: "from-green-600 to-emerald-700"
    },
    {
        quote: "Dreams are not what you see in your sleep. Dreams are things which do not let you sleep.",
        author: "Cristiano Ronaldo",
        role: "Portuguese Icon",
        category: "CR7",
        badge: "⚽ AMBITION",
        gradient: "from-green-600 to-emerald-700"
    },
    {
        quote: "I am not a perfectionist, but I like to feel that things are done well. More important than that, I feel an endless need to learn, to improve, to evolve.",
        author: "Cristiano Ronaldo",
        role: "Global Football Icon",
        category: "CR7",
        badge: "⚽ CONTINUOUS GROWTH",
        gradient: "from-green-600 to-emerald-700"
    },
    {
        quote: "We don't want to tell our dreams, we want to show them.",
        author: "Cristiano Ronaldo",
        role: "Record Breaker",
        category: "CR7",
        badge: "⚽ ACTION OVER WORDS",
        gradient: "from-green-600 to-emerald-700"
    },
    {
        quote: "Without football, my life is worth nothing.",
        author: "Cristiano Ronaldo",
        role: "Dedication Personified",
        category: "CR7",
        badge: "⚽ OBSESSION",
        gradient: "from-green-600 to-emerald-700"
    },
    {
        quote: "I'm living a dream I never want to wake up from.",
        author: "Cristiano Ronaldo",
        role: "Living Legend",
        category: "CR7",
        badge: "⚽ GRATITUDE",
        gradient: "from-green-600 to-emerald-700"
    },

    // Tony Stark (Iron Man) - Genius Billionaire Playboy Philanthropist
    {
        quote: "I am Iron Man.",
        author: "Tony Stark",
        role: "Genius, Billionaire, Playboy, Philanthropist",
        category: "STARK",
        badge: "🦾 STARK INDUSTRIES",
        gradient: "from-red-600 to-yellow-600"
    },
    {
        quote: "Sometimes you gotta run before you can walk.",
        author: "Tony Stark",
        role: "Founder of Stark Industries",
        category: "STARK",
        badge: "🦾 BOLD ACTION",
        gradient: "from-red-600 to-yellow-600"
    },
    {
        quote: "No amount of money ever bought a second of time.",
        author: "Tony Stark",
        role: "Avenger & Innovator",
        category: "STARK",
        badge: "🦾 TIME IS PRECIOUS",
        gradient: "from-red-600 to-yellow-600"
    },
    {
        quote: "I shouldn't be alive... unless it was for a reason.",
        author: "Tony Stark",
        role: "Arc Reactor Creator",
        category: "STARK",
        badge: "🦾 PURPOSE DRIVEN",
        gradient: "from-red-600 to-yellow-600"
    },
    {
        quote: "If you're nothing without the suit, then you shouldn't have it.",
        author: "Tony Stark",
        role: "Mentor & Leader",
        category: "STARK",
        badge: "🦾 INNER STRENGTH",
        gradient: "from-red-600 to-yellow-600"
    },
    {
        quote: "The truth is... I am Iron Man. Own your identity, own your power.",
        author: "Tony Stark",
        role: "Self-Made Hero",
        category: "STARK",
        badge: "🦾 AUTHENTICITY",
        gradient: "from-red-600 to-yellow-600"
    },
    {
        quote: "Heroes are made by the path they choose, not the powers they are graced with.",
        author: "Tony Stark",
        role: "Strategic Mind",
        category: "STARK",
        badge: "🦾 CHOICES DEFINE YOU",
        gradient: "from-red-600 to-yellow-600"
    },
    {
        quote: "I told you. I don't want to join your super secret boy band.",
        author: "Tony Stark",
        role: "Independent Innovator",
        category: "STARK",
        badge: "🦾 THINK DIFFERENT",
        gradient: "from-red-600 to-yellow-600"
    },
    {
        quote: "Part of the journey is the end.",
        author: "Tony Stark",
        role: "Legacy Builder",
        category: "STARK",
        badge: "🦾 EMBRACE THE PROCESS",
        gradient: "from-red-600 to-yellow-600"
    },
    {
        quote: "Everybody wants a happy ending, right? But it doesn't always roll that way.",
        author: "Tony Stark",
        role: "Realist & Visionary",
        category: "STARK",
        badge: "🦾 REALITY CHECK",
        gradient: "from-red-600 to-yellow-600"
    }
];

class QuoteEngine {
    constructor() {
        this.currentIndex = 0;
        this.autoPlayTimer = null;
        this.isPlaying = true;
    }

    init() {
        this.render();
        this.startAutoPlay();
    }

    getCurrentQuote() {
        return MOTIVATIONAL_DATABASE[this.currentIndex];
    }

    next() {
        this.currentIndex = (this.currentIndex + 1) % MOTIVATIONAL_DATABASE.length;
        this.render(true);
        this.playSound();
    }

    prev() {
        this.currentIndex = (this.currentIndex - 1 + MOTIVATIONAL_DATABASE.length) % MOTIVATIONAL_DATABASE.length;
        this.render(true);
        this.playSound();
    }

    random() {
        let newIdx;
        do {
            newIdx = Math.floor(Math.random() * MOTIVATIONAL_DATABASE.length);
        } while (newIdx === this.currentIndex && MOTIVATIONAL_DATABASE.length > 1);
        this.currentIndex = newIdx;
        this.render(true);
        this.playSound();
    }

    speak() {
        const quote = this.getCurrentQuote();
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const text = `${quote.quote}. By ${quote.author}, ${quote.role}`;
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 0.95;
            utterance.pitch = 1.0;
            utterance.volume = 1.0;
            window.speechSynthesis.speak(utterance);
        }
    }

    toggleAutoPlay() {
        this.isPlaying = !this.isPlaying;
        const btn = document.getElementById('autoPlayBtn');
        if (this.isPlaying) {
            this.startAutoPlay();
            if (btn) btn.innerHTML = '<i data-lucide="pause" class="w-3.5 h-3.5"></i>';
        } else {
            if (this.autoPlayTimer) clearInterval(this.autoPlayTimer);
            if (btn) btn.innerHTML = '<i data-lucide="play" class="w-3.5 h-3.5"></i>';
        }
        if (window.lucide) window.lucide.createIcons();
    }

    startAutoPlay() {
        if (this.autoPlayTimer) clearInterval(this.autoPlayTimer);
        this.autoPlayTimer = setInterval(() => {
            if (this.isPlaying) this.next();
        }, 15000); // 15 seconds per quote
    }

    render(animate = false) {
        const quote = this.getCurrentQuote();
        const container = document.getElementById('quoteContainer');
        const textEl = document.getElementById('quoteText');
        const authorEl = document.getElementById('quoteAuthor');
        const badgeEl = document.getElementById('quoteBadge');
        const counterEl = document.getElementById('quoteCounter');

        if (!textEl || !authorEl || !badgeEl) return;

        if (animate && container) {
            container.style.opacity = '0';
            container.style.transform = 'translateY(-5px)';

            setTimeout(() => {
                this.updateContent(quote, textEl, authorEl, badgeEl, counterEl);
                container.style.opacity = '1';
                container.style.transform = 'translateY(0)';
            }, 200);
        } else {
            this.updateContent(quote, textEl, authorEl, badgeEl, counterEl);
        }
    }

    updateContent(quote, textEl, authorEl, badgeEl, counterEl) {
        textEl.innerText = `"${quote.quote}"`;
        authorEl.innerText = `— ${quote.author}, ${quote.role}`;
        badgeEl.innerText = quote.badge;
        badgeEl.className = `shrink-0 text-[9px] font-extrabold uppercase tracking-wider bg-white/25 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/40`;

        if (counterEl) {
            counterEl.innerText = `${this.currentIndex + 1}/${MOTIVATIONAL_DATABASE.length}`;
        }

        if (window.lucide) window.lucide.createIcons();
    }

    playSound() {
        if (window.sfx) window.sfx.playClick();
    }
}

const quoteEngine = new QuoteEngine();
