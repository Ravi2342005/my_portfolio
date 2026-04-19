// Portfolio Custom Script
console.log("Portfolio script loaded.");

document.addEventListener('DOMContentLoaded', () => {

    /* =========================================
       UI INTERACTIVITY
       ========================================= */

    // --- Mobile Menu Toggle ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-link');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.innerHTML = navLinks.classList.contains('active')
                ? '<i class="fas fa-times"></i>'
                : '<i class="fas fa-bars"></i>';
        });
    }

    // Close menu when a link is clicked
    navLinksItems.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            if (hamburger) hamburger.innerHTML = '<i class="fas fa-bars"></i>';
        });
    });

    // --- Sticky Navbar Color Change ---
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // --- Scroll Active Sublink Logic ---
    const sections = document.querySelectorAll('section');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinksItems.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });

    // --- Intersection Observer for Scroll Animations ---
    const faders = document.querySelectorAll('.fade-in');

    // Add fade-in class to major sections automatically 
    document.querySelectorAll('.section-header, .about-text, .skill-category, .project-card, .contact-info, .form-wrapper').forEach(el => {
        el.classList.add('fade-in');
    });

    // Re-query
    const allFaders = document.querySelectorAll('.fade-in');
    const appearOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const appearOnScroll = new IntersectionObserver(function (entries, appearOnScroll) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('appear');
            appearOnScroll.unobserve(entry.target);
        });
    }, appearOptions);

    allFaders.forEach(fader => {
        appearOnScroll.observe(fader);
    });

    // --- Progress Bar Animation Observer ---
    const progressLines = document.querySelectorAll('.progress-line');
    const progressObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    progressLines.forEach(line => {
        progressObserver.observe(line);
    });


    /* =========================================
       EMAILJS FORM SUBMISSION & VALIDATION
       ========================================= */

    const contactForm = document.getElementById('contact-form');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    const submitBtn = document.getElementById('submitBtn');
    const formAlert = document.getElementById('formAlert');

    // Validation functions
    const setError = (element, messageElementId, message) => {
        element.classList.add('error-border');
        document.getElementById(messageElementId).innerText = message;
    };

    const clearError = (element, messageElementId) => {
        element.classList.remove('error-border');
        document.getElementById(messageElementId).innerText = '';
    };

    const isValidEmail = (email) => {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    };

    const showAlert = (message, type) => {
        formAlert.innerText = message;
        formAlert.className = `alert ${type}`;

        // Auto hide after 5 seconds
        setTimeout(() => {
            formAlert.className = 'alert hidden';
        }, 5000);
    };

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Prevent default form submission behavior

            // Clear previous errors
            clearError(nameInput, 'nameError');
            clearError(emailInput, 'emailError');
            clearError(messageInput, 'messageError');

            let isValid = true;

            // Validate Name
            if (nameInput.value.trim() === '') {
                setError(nameInput, 'nameError', 'Name is required');
                isValid = false;
            }

            // Validate Email
            if (emailInput.value.trim() === '') {
                setError(emailInput, 'emailError', 'Email is required');
                isValid = false;
            } else if (!isValidEmail(emailInput.value.trim())) {
                setError(emailInput, 'emailError', 'Please enter a valid email');
                isValid = false;
            }

            // Validate Message
            if (messageInput.value.trim() === '') {
                setError(messageInput, 'messageError', 'Message is required');
                isValid = false;
            }

            if (!isValid) return;

            // Prepare for Submission
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span>Sending...</span> <i class="fas fa-spinner fa-spin"></i>';

            // Send via EmailJS
            emailjs.sendForm('service_dh49l09', 'template_7yjdpf8', contactForm)
                .then(() => {
                    console.log('SUCCESS!');
                    showAlert('Message Sent Successfully ✅', 'success');
                    contactForm.reset();
                }, (error) => {
                    console.error('FAILED...', error);
                    showAlert('Failed to send message. Please try again later.', 'error');
                })
                .finally(() => {
                    // Reset Button status
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = '<span>Send Message</span> <i class="fas fa-paper-plane"></i>';
                });
        });
    }

});
