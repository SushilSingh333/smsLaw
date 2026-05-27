/* ==================================================
   SMS LAW COLLEGE — Landing Page Scripts
================================================== */

(function () {
    'use strict';

    // ===== Indian States List =====
    const states = [
        'Andaman and Nicobar', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam',
        'Bihar', 'Chandigarh', 'Chhattisgarh', 'Dadra and Nagar Haveli',
        'Daman and Diu', 'Delhi', 'Goa', 'Gujarat', 'Haryana',
        'Himachal Pradesh', 'Jammu and Kashmir', 'Jharkhand', 'Karnataka',
        'Kerala', 'Lakshadweep', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
        'Meghalaya', 'Mizoram', 'Nagaland', 'Orissa', 'Puducherry',
        'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana',
        'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
    ];

    function populateStates() {
        const selects = document.querySelectorAll('select[name="state"]');
        selects.forEach(select => {
            states.forEach(s => {
                const opt = document.createElement('option');
                opt.value = s;
                opt.textContent = s;
                select.appendChild(opt);
            });
        });
    }

    // ===== Modal Controls =====
    const modal = document.getElementById('enquiryModal');

    window.openModal = function () {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    window.closeModal = function () {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    };

    // Close modal on overlay click
    modal.addEventListener('click', function (e) {
        if (e.target === modal) closeModal();
    });

    // Close on ESC
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // Auto-open modal once per session after 8s
    if (!sessionStorage.getItem('modalShown')) {
        setTimeout(() => {
            openModal();
            sessionStorage.setItem('modalShown', '1');
        }, 8000);
    }

    // ===== Form Validation & Submit =====
    function validateForm(form) {
        const fields = form.querySelectorAll('input[required], select[required]');
        let isValid = true;
        let firstInvalid = null;

        fields.forEach(field => {
            field.classList.remove('error');
            const value = field.value.trim();

            if (!value) {
                field.classList.add('error');
                isValid = false;
                if (!firstInvalid) firstInvalid = field;
                return;
            }

            if (field.type === 'email') {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    field.classList.add('error');
                    isValid = false;
                    if (!firstInvalid) firstInvalid = field;
                }
            }

            if (field.type === 'tel' || field.name === 'mobile') {
                const mobileRegex = /^[6-9]\d{9}$/;
                if (!mobileRegex.test(value)) {
                    field.classList.add('error');
                    isValid = false;
                    if (!firstInvalid) firstInvalid = field;
                }
            }
        });

        if (firstInvalid) {
            firstInvalid.focus();
            firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        return isValid;
    }

    function handleSubmit(form, successId) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            if (!validateForm(form)) {
                showToast('Please fill all fields correctly. Mobile must be a valid 10-digit number.', 'error');
                return;
            }

            // Collect data
            const data = {
                fullname: form.querySelector('[name="fullname"]').value.trim(),
                email: form.querySelector('[name="email"]').value.trim(),
                mobile: form.querySelector('[name="mobile"]').value.trim(),
                state: form.querySelector('[name="state"]').value,
                city: form.querySelector('[name="city"]').value.trim(),
                course: form.querySelector('[name="course"]').value,
                submittedAt: new Date().toISOString()
            };

            // Console log for demo (replace with actual API call)
            console.log('Enquiry submitted:', data);

            // Store in localStorage for demo
            const enquiries = JSON.parse(localStorage.getItem('smslaw_enquiries') || '[]');
            enquiries.push(data);
            localStorage.setItem('smslaw_enquiries', JSON.stringify(enquiries));

            // Show success
            const successEl = document.getElementById(successId);
            if (successEl) successEl.classList.add('show');

            showToast('Thank you! Your enquiry has been submitted successfully.', 'success');

            // Reset form
            setTimeout(() => {
                form.reset();
                if (successEl) successEl.classList.remove('show');

                // Close modal if it's the modal form
                if (form.id === 'modalForm') {
                    setTimeout(closeModal, 1500);
                }
            }, 3500);
        });
    }

    // ===== Toast Notification =====
    function showToast(message, type) {
        let toast = document.getElementById('toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'toast';
            toast.style.cssText = `
                position: fixed;
                bottom: 30px;
                left: 50%;
                transform: translateX(-50%) translateY(100px);
                padding: 14px 24px;
                border-radius: 10px;
                color: #fff;
                font-family: 'Poppins', sans-serif;
                font-size: 0.92rem;
                font-weight: 500;
                box-shadow: 0 14px 40px rgba(0,0,0,0.18);
                z-index: 9999;
                transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                max-width: 90%;
                text-align: center;
            `;
            document.body.appendChild(toast);
        }

        toast.style.background = type === 'success'
            ? 'linear-gradient(135deg, #16a34a, #15803d)'
            : 'linear-gradient(135deg, #e93e21, #ae1b21)';
        toast.textContent = message;
        toast.style.transform = 'translateX(-50%) translateY(0)';

        clearTimeout(toast.hideTimer);
        toast.hideTimer = setTimeout(() => {
            toast.style.transform = 'translateX(-50%) translateY(150px)';
        }, 3500);
    }

    // ===== Accordion =====
    const accItems = document.querySelectorAll('.acc-item');
    accItems.forEach(item => {
        const head = item.querySelector('.acc-head');
        head.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            accItems.forEach(i => i.classList.remove('active'));
            if (!isActive) item.classList.add('active');
        });
    });

    // ===== Sticky Header =====
    const header = document.getElementById('siteHeader');
    const scrollTopBtn = document.getElementById('scrollTop');

    function handleScroll() {
        const scrolled = window.scrollY;

        if (scrolled > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        if (scrolled > 400) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ===== Mobile Menu =====
    const mobileToggle = document.getElementById('mobileToggle');
    const mainNav = document.querySelector('.main-nav');

    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            mainNav.classList.toggle('open');
            mobileToggle.classList.toggle('open');
        });

        // Close mobile menu when a link is clicked
        mainNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mainNav.classList.remove('open');
                mobileToggle.classList.remove('open');
            });
        });
    }

    // ===== Smooth Scroll for Anchor Links =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const headerHeight = header.offsetHeight;
                const targetPos = target.offsetTop - headerHeight - 10;
                window.scrollTo({ top: targetPos, behavior: 'smooth' });
            }
        });
    });

    // ===== Mobile Number — Restrict to Digits =====
    document.querySelectorAll('input[name="mobile"]').forEach(input => {
        input.addEventListener('input', function () {
            this.value = this.value.replace(/\D/g, '').slice(0, 10);
        });
    });

    // ===== Animate Counters in Hero Meta =====
    function animateCounter(el) {
        const text = el.textContent.trim();
        const match = text.match(/^(\d+)(.*)$/);
        if (!match) return;

        const target = parseInt(match[1], 10);
        const suffix = match[2];
        const duration = 1500;
        const step = Math.max(1, Math.floor(target / (duration / 30)));
        let current = 0;

        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            el.textContent = current + suffix;
        }, 30);
    }

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.dataset.animated) {
                entry.target.dataset.animated = '1';
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.4 });

    document.querySelectorAll('.meta-item strong').forEach(el => counterObserver.observe(el));

    // ===== Reveal on Scroll =====
    const revealEls = document.querySelectorAll('.highlight-card, .info-item, .contact-card, .fee-card, .trust-item');
    revealEls.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, i * 60);
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealEls.forEach(el => revealObserver.observe(el));

    // ===== Init =====
    populateStates();
    handleSubmit(document.getElementById('heroForm'), 'heroFormSuccess');
    handleSubmit(document.getElementById('modalForm'), 'modalFormSuccess');
})();
