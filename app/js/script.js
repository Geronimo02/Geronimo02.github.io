document.addEventListener('DOMContentLoaded', () => {
        // ==================== TOGGLE MODO OSCURO ====================
        const toggleBtn = document.getElementById('toggle-dark');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                document.body.classList.toggle('dark');
            });
        }
    // ==================== ANIMACIONES AL SCROLL ====================
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    // Aplicar a todas las secciones
    document.querySelectorAll('section:not(.presentation-strip)').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'all 0.6s ease-out';
        observer.observe(section);
    });

    // Animación para cards individuales con delay
    const cards = document.querySelectorAll('.service-card, .result-card, .cert-card, .project-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = `all 0.5s ease-out ${index * 0.1}s`;
        observer.observe(card);
    });

    // ==================== FORMULARIO DE CONTACTO (Envío por WhatsApp) ====================
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;

            // Construir el mensaje para WhatsApp
            const whatsappMessage = `Hola Geronimo,

*Nombre:* ${name}
*Email:* ${email}
*Asunto:* ${subject}

*Mensaje:*
${message}`;

            // Encodificar el mensaje para URL
            const encodedMessage = encodeURIComponent(whatsappMessage);
            
            // Número de WhatsApp: +54 92494589884
            const whatsappURL = `https://wa.me/5492494589884?text=${encodedMessage}`;

            // Mostrar mensaje de estado
            formStatus.className = 'form-status success';
            formStatus.innerHTML = '<i class="fas fa-check-circle"></i> Redirigiendo a WhatsApp...';
            formStatus.style.display = 'block';

            // Abrir WhatsApp después de 1 segundo
            setTimeout(() => {
                window.open(whatsappURL, '_blank');
                
                // Limpiar formulario
                contactForm.reset();
                
                // Ocultar mensaje después de 3 segundos
                setTimeout(() => {
                    formStatus.style.display = 'none';
                }, 3000);
            }, 1000);
        });
    }

    // ==================== MODO OSCURO ====================
    // Crear botón de toggle
    const themeToggle = document.createElement('button');
    themeToggle.className = 'theme-toggle';
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    themeToggle.setAttribute('aria-label', 'Cambiar tema');
    themeToggle.setAttribute('title', 'Cambiar tema');
    
    // Comprobar preferencia guardada
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }

    const toggleTheme = () => {
        document.body.classList.toggle('dark-theme');
        const isDark = document.body.classList.contains('dark-theme');
        
        themeToggle.innerHTML = isDark 
            ? '<i class="fas fa-sun"></i>' 
            : '<i class="fas fa-moon"></i>';
        
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    };

    themeToggle.addEventListener('click', toggleTheme);
    document.body.appendChild(themeToggle);

    // ==================== SMOOTH SCROLL ====================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // ==================== CONTADORES ANIMADOS ====================
    const animateCounters = () => {
        const counters = document.querySelectorAll('.result-number');
        counters.forEach(counter => {
            const target = counter.textContent;
            const isPercentage = target.includes('%');
            const isPlus = target.includes('+');
            const number = parseInt(target.replace(/[^0-9]/g, ''));
            
            let current = 0;
            const increment = number / 50;
            const timer = setInterval(() => {
                current += increment;
                if (current >= number) {
                    clearInterval(timer);
                    current = number;
                }
                counter.textContent = (isPlus ? '+' : '') + Math.floor(current) + (isPercentage ? '%' : '');
            }, 30);
        });
    };

    // Activar contadores cuando sean visibles
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const resultsSection = document.getElementById('results');
    if (resultsSection) {
        counterObserver.observe(resultsSection);
    }
});
