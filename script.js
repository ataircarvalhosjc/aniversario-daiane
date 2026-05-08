document.addEventListener('DOMContentLoaded', () => {
    const loveButton = document.getElementById('love-button');
    const heartContainer = document.getElementById('heart-container');
    const muralContent = document.querySelector('.mural-content');
    const placeholder = document.querySelector('.mural-placeholder');

    const compliments = [
        "Você é incrível!",
        "Mãe maravilhosa ❤️",
        "Esposa dos sonhos!",
        "Brilha sempre, Daiane!",
        "38 anos de luz!",
        "Exemplo de força!",
        "Coração gigante!",
        "Te amamos muito!",
        "Parabéns, Deusa!",
        "Nossa alegria diária!"
    ];

    function createHeart() {
        const heart = document.createElement('div');
        heart.classList.add('floating-heart');
        heart.innerHTML = '❤️';
        
        // Random position
        const startX = Math.random() * window.innerWidth;
        heart.style.left = `${startX}px`;
        
        // Random size
        const size = Math.random() * 20 + 10;
        heart.style.fontSize = `${size}px`;
        
        // Random duration
        const duration = Math.random() * 3 + 2;
        heart.style.animationDuration = `${duration}s`;

        heartContainer.appendChild(heart);

        // Remove heart after animation
        setTimeout(() => {
            heart.remove();
        }, duration * 1000);
    }

    window.createHeartGlobally = createHeart;

    // Supabase setup
    const SUPABASE_URL = 'https://mehzgdagamchytjethkr.supabase.co';
    const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1laHpnZGFnYW1jaHl0amV0aGtyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI2NjI1MDMsImV4cCI6MjA4ODIzODUwM30.VC29X1NtHIlsl3Fq3M4ZDzTX1KCIHPZKdO4KhrjaXp8';
    const db = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

    function renderMessage(name, text, time) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('mural-item');
        messageDiv.innerHTML = `
            <span class="time">${time}</span>
            <strong>${name}</strong>
            <p>${text}</p>
        `;
        muralContent.prepend(messageDiv);
    }

    async function loadMessages() {
        muralContent.innerHTML = '<p style="color:var(--text-muted);text-align:center">Carregando mensagens... 💌</p>';
        const { data, error } = await db
            .from('mensagens_daiane')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(50);

        muralContent.innerHTML = '';
        if (error) { console.error(error); return; }
        data.forEach(msg => {
            const time = new Date(msg.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
            renderMessage(msg.nome, msg.texto, time);
        });
    }

    // Real-time: new messages appear instantly for everyone
    db.channel('mural')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'mensagens_daiane' }, payload => {
            const msg = payload.new;
            const time = new Date(msg.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
            renderMessage(msg.nome, msg.texto, time);
            for (let i = 0; i < 8; i++) setTimeout(createHeart, i * 100);
        })
        .subscribe();

    window.postMessage = async function() {
        const nameInput = document.getElementById('visitor-name');
        const messageInput = document.getElementById('visitor-message');

        if (!nameInput.value.trim() || !messageInput.value.trim()) {
            alert("Por favor, preencha seu nome e a mensagem! ❤️");
            return;
        }

        const { error } = await db.from('mensagens_daiane').insert({
            nome: nameInput.value.trim(),
            texto: messageInput.value.trim()
        });

        if (error) {
            alert("Erro ao postar mensagem. Tente novamente!");
            console.error(error);
            return;
        }

        nameInput.value = '';
        messageInput.value = '';

        for (let i = 0; i < 10; i++) setTimeout(createHeart, i * 100);
    }

    loadMessages();

    loveButton.addEventListener('click', () => {
        // Create a burst of hearts
        for (let i = 0; i < 15; i++) {
            setTimeout(createHeart, i * 100);
        }
        
        // Visual feedback on button
        loveButton.style.transform = 'scale(0.95)';
        setTimeout(() => {
            loveButton.style.transform = 'scale(1.05)';
        }, 100);
    });

    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.photo-item, .message-card, .mural, .reason-card').forEach(el => {
        el.style.opacity = '0';
        observer.observe(el);
    });

    // Initial burst
    setTimeout(() => {
        for (let i = 0; i < 20; i++) {
            setTimeout(createHeart, i * 150);
        }
    }, 1000);

    // Autoplay Music Logic
    const audio = document.getElementById('bg-music');
    const musicBtn = document.getElementById('music-btn');

    function startMusic() {
        audio.play().then(() => {
            musicBtn.innerHTML = '🎵 Pausar Música';
            document.removeEventListener('click', startMusic);
            document.removeEventListener('touchstart', startMusic);
        }).catch(error => {
            console.log("Autoplay bloqueado pelo navegador. Aguardando interação.");
        });
    }

    // Tenta tocar no primeiro clique ou toque na tela
    document.addEventListener('click', startMusic);
    document.addEventListener('touchstart', startMusic);
    
    // Também tenta tocar logo no início
    startMusic();
});

function revealSurprise(element, message) {
    if (element.classList.contains('flipped')) return;

    element.classList.add('flipped');
    const back = element.querySelector('.card-back');
    back.innerText = message;

    // Trigger hearts on reveal
    for (let i = 0; i < 10; i++) {
        setTimeout(window.createHeartGlobally, i * 100);
    }
}

// Stardust Effect
document.addEventListener('mousemove', (e) => {
    if (Math.random() > 0.1) return; // Limit particles
    
    const star = document.createElement('div');
    star.innerHTML = '✨';
    star.style.position = 'fixed';
    star.style.left = e.clientX + 'px';
    star.style.top = e.clientY + 'px';
    star.style.fontSize = Math.random() * 15 + 5 + 'px';
    star.style.pointerEvents = 'none';
    star.style.zIndex = '10000';
    star.style.color = '#ffb3c1';
    star.style.opacity = '1';
    star.style.transition = 'all 1s ease-out';
    
    document.body.appendChild(star);
    
    setTimeout(() => {
        star.style.transform = `translate(${(Math.random()-0.5)*100}px, ${(Math.random()-0.5)*100}px) scale(0)`;
        star.style.opacity = '0';
    }, 10);
    
    setTimeout(() => star.remove(), 1000);
});

// PIX Copy Logic
function copyPix() {
    const key = '(12) 98869-9057';
    navigator.clipboard.writeText(key).then(() => {
        const btn = document.querySelector('.pix-copy-btn');
        btn.textContent = '✅ Copiado!';
        btn.style.background = '#28a745';
        setTimeout(() => {
            btn.textContent = '📋 Copiar';
            btn.style.background = '';
        }, 2500);
    }).catch(() => {
        alert('Chave PIX: ' + key);
    });
}

// Music Toggle Logic
function toggleMusic() {
    const audio = document.getElementById('bg-music');
    const btn = document.getElementById('music-btn');
    
    if (audio.paused) {
        audio.play().catch(e => {
            alert("Para ouvir a trilha sonora, coloque um arquivo chamado 'musica.mp3' na mesma pasta desta página!");
            console.log("Erro ao tocar áudio:", e);
        });
        btn.innerHTML = '🎵 Pausar Música';
    } else {
        audio.pause();
        btn.innerHTML = '🎵 Tocar Música';
    }
}
