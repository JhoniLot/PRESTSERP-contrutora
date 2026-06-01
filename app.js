/* ==========================================================================
   PRESTSERP CONSTRUTORA - Interactive JS Logic
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // 1. Header Scroll Effect
    const header = document.querySelector('.main-header');
    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check on load

    // 2. Mobile Responsive Navigation
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            header.classList.toggle('menu-open');
            // Toggle body scrolling
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu when a link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
                header.classList.remove('menu-open');
                document.body.style.overflow = '';
            });
        });
    }

    // 3. Scroll Reveal System using Intersection Observer
    const revealElements = document.querySelectorAll('.reveal-fade, .reveal-slide, .reveal-slide-left, .reveal-slide-right');
    
    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = entry.target.getAttribute('data-delay') || 0;
                    setTimeout(() => {
                        entry.target.classList.add('active');
                    }, delay);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        });

        revealElements.forEach(el => revealObserver.observe(el));
    } else {
        // Fallback for older browsers
        revealElements.forEach(el => el.classList.add('active'));
    }

    // 4. Metrics Animated Counters
    const metricsSection = document.querySelector('.metrics-section');
    const metricNumbers = document.querySelectorAll('.metric-number');
    let countersStarted = false;

    const startCounters = () => {
        metricNumbers.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'), 10);
            const duration = 2000; // 2 seconds
            const stepTime = Math.max(Math.floor(duration / target), 15);
            let current = 0;

            const timer = setInterval(() => {
                current += Math.ceil(target / (duration / stepTime));
                if (current >= target) {
                    counter.textContent = target;
                    clearInterval(timer);
                } else {
                    counter.textContent = current;
                }
            }, stepTime);
        });
    };

    if ('IntersectionObserver' in window && metricsSection) {
        const metricsObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !countersStarted) {
                    countersStarted = true;
                    startCounters();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        metricsObserver.observe(metricsSection);
    } else if (metricsSection) {
        startCounters();
    }

    // 5. Portfolio Filtering System
    const tabButtons = document.querySelectorAll('.tab-btn');
    const projectCards = document.querySelectorAll('.project-card');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active from other buttons
            tabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                // Hide with micro-animations
                if (filterValue === 'all' || category === filterValue) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // 6. Interactive Contact Form Submission & WhatsApp Link redirection
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const serviceType = document.getElementById('service-type').value;
            const message = document.getElementById('message').value.trim();
            
            // Basic UI Feedback during submission
            const submitBtn = contactForm.querySelector('.btn-submit');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span>Processando... <i class="fa-solid fa-spinner fa-spin"></i></span>';
            submitBtn.disabled = true;

            // Simulate form submission to backend or direct redirect to WhatsApp
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;

                // 1. Success Message on screen
                formStatus.className = 'form-status-msg success';
                formStatus.innerHTML = '<i class="fa-solid fa-circle-check"></i> Proposta recebida com sucesso! Redirecionando para o nosso time de engenharia...';
                
                // 2. Clear Form
                contactForm.reset();

                // 3. Construct WhatsApp Message URL
                const text = `Olá, meu nome é *${name}* (${email}). Gostaria de fazer um orçamento para uma obra do tipo *${serviceType.toUpperCase()}*.\n\n*Detalhes do Projeto:*\n${message}\n\n*Contato:* ${phone}`;
                const encodedText = encodeURIComponent(text);
                const whatsappUrl = `https://wa.me/551632360944?text=${encodedText}`;

                // 4. Open WhatsApp in new tab after 2 seconds
                setTimeout(() => {
                    window.open(whatsappUrl, '_blank');
                    formStatus.innerHTML = '';
                    formStatus.className = 'form-status-msg';
                }, 2000);

            }, 1500);
        });
    }

    // 7. Back to Top Button
    const backToTopBtn = document.getElementById('backToTop');

    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                backToTopBtn.classList.add('active');
            } else {
                backToTopBtn.classList.remove('active');
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // 8. Navigation Active Link States on Scroll
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', () => {
        let scrollY = window.pageYOffset;
        
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 120;
            const sectionId = current.getAttribute('id');
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                document.querySelector('.nav-menu a[href*=' + sectionId + ']')?.classList.add('active');
            } else {
                document.querySelector('.nav-menu a[href*=' + sectionId + ']')?.classList.remove('active');
            }
        });
    });
});
