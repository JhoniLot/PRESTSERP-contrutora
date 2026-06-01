/* ==========================================================================
   PRESTSERP CONSTRUTORA - LOGIC & EFFECTS
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. SCROLL HEADER TRANSITION ---
    const header = document.querySelector('.main-header');
    
    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();

    // --- 2. MOBILE MENU DRAWER ---
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            mobileToggle.classList.toggle('active');
            
            // Hamburger to Close cross animation
            const bars = mobileToggle.querySelectorAll('.bar');
            if (mobileToggle.classList.contains('active')) {
                bars[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                bars[1].style.opacity = '0';
                bars[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
            } else {
                bars[0].style.transform = 'none';
                bars[1].style.opacity = '1';
                bars[2].style.transform = 'none';
            }
        });

        // Close menu when clicking a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                mobileToggle.classList.remove('active');
                const bars = mobileToggle.querySelectorAll('.bar');
                bars[0].style.transform = 'none';
                bars[1].style.opacity = '1';
                bars[2].style.transform = 'none';
            });
        });
    }

    // --- 3. DYNAMIC SCROLL ACTIVE NAV LINK ---
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.pageYOffset >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    });

    // --- 4. SCROLL REVEAL ANIMATIONS (Intersection Observer) ---
    const reveals = document.querySelectorAll('.reveal-left, .reveal-right, .reveal-up');
    
    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target); // Trigger only once
                }
            });
        }, {
            threshold: 0.02,
            rootMargin: '0px 0px 150px 0px'
        });

        reveals.forEach(element => {
            revealObserver.observe(element);
        });
    } else {
        // Fallback for older browsers
        reveals.forEach(element => element.classList.add('active'));
    }

    // Bulletproof reveal fallback: force everything to active state after a short delay
    setTimeout(() => {
        reveals.forEach(element => {
            if (!element.classList.contains('active')) {
                element.classList.add('active');
            }
        });
    }, 1500);

    // --- 5. STATS COUNTER ANIMATION ---
    const statsSection = document.querySelector('.stats-section');
    const statNumbers = document.querySelectorAll('.stat-number');
    let counted = false;

    const countStats = () => {
        statNumbers.forEach(stat => {
            const target = +stat.getAttribute('data-target');
            const countTo = target;
            let current = 0;
            const increment = Math.max(1, countTo / 50); // speed
            
            const updateCount = () => {
                current += increment;
                if (current < countTo) {
                    stat.innerText = Math.ceil(current);
                    setTimeout(updateCount, 25);
                } else {
                    stat.innerText = countTo;
                }
            };
            
            updateCount();
        });
    };

    if (statsSection && 'IntersectionObserver' in window) {
        const statsObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !counted) {
                    countStats();
                    counted = true;
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.2
        });

        statsObserver.observe(statsSection);
    } else if (statsSection) {
        countStats();
    }

    // --- 6. INTERACTIVE PORTFOLIO FILTER ---
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active from other buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            portfolioItems.forEach(item => {
                const category = item.getAttribute('data-category');
                
                // Hide with transition, then set display
                if (filterValue === 'all' || filterValue === category) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 400); // matching CSS transition
                }
            });
        });
    });

    // --- 7. CONTACT FORM VALIDATION & WHATSAPP REDIRECT ---
    const contactForm = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');
    const formStatus = document.getElementById('form-status');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Inputs
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const phoneInput = document.getElementById('phone');
            const messageInput = document.getElementById('message');

            let isValid = true;

            // Simple validation functions
            const setError = (input, show) => {
                const group = input.parentElement;
                if (show) {
                    group.classList.add('invalid');
                    isValid = false;
                } else {
                    group.classList.remove('invalid');
                }
            };

            // Name
            setError(nameInput, nameInput.value.trim().length === 0);

            // Email Regex
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            setError(emailInput, !emailRegex.test(emailInput.value.trim()));

            // Phone (simple length check)
            setError(phoneInput, phoneInput.value.trim().length < 8);

            // Message
            setError(messageInput, messageInput.value.trim().length === 0);

            if (isValid) {
                // Change UI state
                submitBtn.disabled = true;
                submitBtn.querySelector('span').innerText = 'Redirecionando...';
                submitBtn.querySelector('i').className = 'fa-solid fa-circle-notch fa-spin';

                // Construct WhatsApp Lead message
                const name = nameInput.value.trim();
                const email = emailInput.value.trim();
                const phone = phoneInput.value.trim();
                const message = messageInput.value.trim();

                const text = `Olá! Meu nome é *${name}* (${email}). Gostaria de fazer uma reunião com o corpo de engenharia da *PRESTSERP*.\n\n*Detalhes do Projeto:*\n${message}\n\n*Contato:* ${phone}`;
                const encodedText = encodeURIComponent(text);
                const whatsappUrl = `https://wa.me/551632360944?text=${encodedText}`;

                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.querySelector('span').innerText = 'Iniciar Atendimento Private';
                    submitBtn.querySelector('i').className = 'fa-solid fa-paper-plane';

                    // Show success status
                    formStatus.className = 'form-status success';
                    formStatus.innerHTML = '<i class="fa-solid fa-circle-check"></i> Orçamento gerado com sucesso! Redirecionando para o WhatsApp...';

                    // Open WhatsApp
                    setTimeout(() => {
                        window.open(whatsappUrl, '_blank');
                        contactForm.reset();
                        formStatus.innerHTML = '';
                        formStatus.className = 'form-status';
                    }, 1200);

                }, 1000);
            }
        });

        // Realtime input clear error validation on type
        const formInputs = contactForm.querySelectorAll('input, textarea');
        formInputs.forEach(input => {
            input.addEventListener('input', () => {
                if (input.value.trim().length > 0) {
                    input.parentElement.classList.remove('invalid');
                }
            });
        });
    }

    // --- 8. SMOOTH SCROLL OFFSET FOR ANCHOR LINKS ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = header.clientHeight;
                const offsetPosition = targetElement.offsetTop - headerHeight;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});
