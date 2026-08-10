// --- تعريف الدوال العالمية خارج حدث التحميل لضمان استدعائها من HTML مباشرة ---
window.submitReview = function(e) {
    if (e) e.preventDefault();
    const nameInput = document.getElementById('reviewerName');
    const commentInput = document.getElementById('reviewerComment');
    const stars = document.querySelectorAll('.star-btn');

    if (!window.selectedRating || window.selectedRating === 0) {
        alert("يرجى اختيار عدد النجوم أولاً!");
        return;
    }

    const newReview = {
        name: nameInput ? nameInput.value : 'زائر',
        rating: window.selectedRating,
        comment: commentInput ? commentInput.value : '',
        date: new Date().toLocaleDateString()
    };

    const savedReviews = JSON.parse(localStorage.getItem('nexa_reviews') || '[]');
    savedReviews.push(newReview);
    localStorage.setItem('nexa_reviews', JSON.stringify(savedReviews));

    if (nameInput) nameInput.value = '';
    if (commentInput) commentInput.value = '';
    window.selectedRating = 0;

    stars.forEach(s => {
        s.classList.remove('active', 'fa-solid', 'hover');
        s.classList.add('fa-regular');
    });

    if (typeof window.loadReviews === 'function') {
        window.loadReviews();
    }
    alert("شكراً لك! تم إضافة تقييمك بنجاح.");
};

document.addEventListener("DOMContentLoaded", () => {

    // --- 0. Custom Cursor (للكمبيوتر فقط وبدون أي أخطاء) ---
    if (window.matchMedia("(pointer: fine)").matches) {
        let cursor = document.querySelector('.custom-cursor');
        if (!cursor) {
            cursor = document.createElement('div');
            cursor.className = 'custom-cursor';
            document.body.appendChild(cursor);
        }

        cursor.style.position = 'fixed';
        cursor.style.pointerEvents = 'none'; 
        cursor.style.zIndex = '99999'; 
        
        if (getComputedStyle(cursor).width === '0px') {
            cursor.style.width = '20px';
            cursor.style.height = '20px';
            cursor.style.backgroundColor = 'var(--primary-color, #7c3aed)';
            cursor.style.borderRadius = '50%';
            cursor.style.transform = 'translate(-50%, -50%)'; 
            cursor.style.transition = 'transform 0.1s ease';
        }

        document.addEventListener('mousemove', (e) => {
            requestAnimationFrame(() => {
                 cursor.style.left = e.clientX + 'px';
                 cursor.style.top = e.clientY + 'px';
            });
        });

        const interactiveElements = document.querySelectorAll('a, button, input, select, textarea, .card, .portfolio-card, .calc-item, .faq-question, .color-card-item');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('hovered'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('hovered'));
        });
    }

    // --- Scroll Reveal ---
    const revealElements = document.querySelectorAll('.card, .portfolio-card, .calc-container, .faq-item, .section-head, .palette-box');
    revealElements.forEach(el => el.classList.add('reveal'));

    function handleScrollReveal() {
        const triggerBottom = window.innerHeight * 0.85;
        revealElements.forEach(el => {
            const top = el.getBoundingClientRect().top;
            if (top < triggerBottom) {
                el.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', handleScrollReveal);
    handleScrollReveal();

    // --- 1. خلفية الجرافيك المتحركة ---
    const canvas = document.getElementById('purpleWindCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;
        let elements = [];

        function resizeCanvas() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        }
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        class GraphicElement {
            constructor() { this.reset(); }
            reset() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.size = Math.random() * 30 + 10;
                this.speedX = (Math.random() - 0.5) * 1;
                this.speedY = (Math.random() - 0.5) * 1;
                this.rotation = Math.random() * 360;
                this.rotationSpeed = (Math.random() - 0.5) * 1.5;
                this.type = Math.floor(Math.random() * 4);
                this.opacity = Math.random() * 0.3 + 0.1;
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                this.rotation += this.rotationSpeed;
                if (this.x < -50) this.x = width + 50;
                if (this.x > width + 50) this.x = -50;
                if (this.y < -50) this.y = height + 50;
                if (this.y > height + 50) this.y = -50;
            }
            draw() {
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate((this.rotation * Math.PI) / 180);
                const isLight = document.documentElement.getAttribute('data-theme') === 'light';
                ctx.strokeStyle = isLight ? `rgba(124, 58, 237, ${this.opacity * 0.7})` : `rgba(124, 58, 237, ${this.opacity})`;
                ctx.fillStyle = isLight ? `rgba(124, 58, 237, ${this.opacity * 0.2})` : `rgba(124, 58, 237, ${this.opacity * 0.3})`;
                ctx.lineWidth = 1.5;

                if (this.type === 0) {
                    ctx.beginPath(); ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2); ctx.stroke();
                } else if (this.type === 1) {
                    ctx.strokeRect(-this.size / 2, -this.size / 2, this.size, this.size);
                } else if (this.type === 2) {
                    ctx.beginPath(); ctx.moveTo(-this.size, 0); ctx.quadraticCurveTo(0, -this.size, this.size, 0); ctx.stroke();
                } else {
                    ctx.fillRect(-4, -4, 8, 8); ctx.strokeRect(-this.size / 2, -this.size / 2, this.size, this.size);
                }
                ctx.restore();
            }
        }

        for (let i = 0; i < 25; i++) elements.push(new GraphicElement());

        function animateGraphics() {
            ctx.clearRect(0, 0, width, height);
            elements.forEach(el => { el.update(); el.draw(); });
            requestAnimationFrame(animateGraphics);
        }
        animateGraphics();
    }

    // --- 2. مؤشر التمرير العلوي ---
    window.addEventListener('scroll', () => {
        const winScroll = document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        const progressBar = document.getElementById('scrollProgressBar');
        if (progressBar) progressBar.style.width = scrolled + '%';
        document.body.style.setProperty('--scroll-y', (winScroll / height * 100) + '%');
    });

    // --- 3. نظام الوضع الليلي/النهاري ---
    const themeToggle = document.getElementById('themeToggle');
    const htmlEl = document.documentElement;
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = htmlEl.getAttribute('data-theme');
            if (currentTheme === 'light') {
                htmlEl.setAttribute('data-theme', 'dark');
                themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
            } else {
                htmlEl.setAttribute('data-theme', 'light');
                themeToggle.innerHTML = '<i class="fa-solid fa-moon"></i>';
            }
        });
    }

    // --- 4. ترجمات اللغات ---
    const translations = {
        ar: { "nav.services": "خدماتنا", "nav.about": "من نحن", "nav.portfolio": "أعمالنا", "nav.pricing": "الأسعار", "nav.faq": "الأسئلة", "nav.contact": "تواصل معنا" },
        en: { "nav.services": "Services", "nav.about": "About", "nav.portfolio": "Portfolio", "nav.pricing": "Pricing", "nav.faq": "FAQ", "nav.contact": "Contact Us" },
        tr: { "nav.services": "Hizmetlerimiz", "nav.about": "Hakkımızda", "nav.portfolio": "Projelerimiz", "nav.pricing": "Fiyatlar", "nav.faq": "SSS", "nav.contact": "İletişim" }
    };
    const langSelect = document.getElementById('langSelect');
    if (langSelect) {
        langSelect.addEventListener('change', (e) => {
            const lang = e.target.value;
            document.documentElement.lang = lang;
            document.documentElement.dir = (lang === 'en' || lang === 'tr') ? 'ltr' : 'rtl';
            document.querySelectorAll('[data-i18n]').forEach(el => {
                const key = el.getAttribute('data-i18n');
                if (translations[lang] && translations[lang][key]) el.innerText = translations[lang][key];
            });
        });
    }

    // --- 5. Modal & Lightbox ---
    const glassModal = document.getElementById('glassModal');
    const lightboxView = document.getElementById('lightboxView');
    const orderView = document.getElementById('orderView');
    const modalImg = document.getElementById('modalImg');
    const modalTitle = document.getElementById('modalTitle');
    const orderProjectName = document.getElementById('orderProjectName');
    let currentProject = "";

    window.openLightbox = function(imgSrc, title) {
        if (lightboxView) lightboxView.style.display = 'block';
        if (orderView) orderView.style.display = 'none';
        if (modalImg) modalImg.src = imgSrc;
        if (modalTitle) modalTitle.innerText = title;
        currentProject = title;
        if (glassModal) glassModal.classList.add('active');
    };

    window.openOrderModal = function(projectName) {
        if (lightboxView) lightboxView.style.display = 'none';
        if (orderView) orderView.style.display = 'block';
        currentProject = projectName;
        if (orderProjectName) orderProjectName.innerText = `الخدمة المطلوبة: ${projectName}`;
        if (glassModal) glassModal.classList.add('active');
    };

    window.closeGlassModal = function() { if (glassModal) glassModal.classList.remove('active'); };
    if (glassModal) { glassModal.addEventListener('click', (e) => { if (e.target === glassModal) closeGlassModal(); }); }

    // --- 6. طلب الواتساب ---
    window.sendWhatsAppOrder = function(e) {
        e.preventDefault();
        const name = document.getElementById('custName')?.value || '';
        const details = document.getElementById('custDetails')?.value || '';
        const phoneNumber = "905364391849"; 
        const message = `مرحباً NEXA، أود طلب خدمة: *${currentProject}*%0Aالاسم: ${name}%0Aالتفاصيل: ${details}`;
        window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
        closeGlassModal();
    };

    // --- 7. حاسبة الأسعار التفاعلية بالعد السلس ---
    const calcCheckboxes = document.querySelectorAll('.calc-checkbox');
    const totalPriceEl = document.getElementById('totalPrice');
    let currentTotal = 0;

    function animateValue(obj, start, end, duration) {
        if (!obj) return;
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            
            const currentValue = Math.floor(progress * (end - start) + start);
            obj.innerHTML = currentValue;

            if (progress < 1) {
                obj.style.transform = 'scale(1.1)';
                obj.style.transition = 'transform 0.1s ease';
                window.requestAnimationFrame(step);
            } else {
                obj.style.transform = 'scale(1)';
            }
        };
        window.requestAnimationFrame(step);
    }

    calcCheckboxes.forEach(box => {
        box.addEventListener('change', () => {
            const card = box.closest('.calc-item') || box.parentElement;
            if (box.checked) {
                card.style.borderColor = 'var(--primary-color, #7c3aed)';
                card.style.backgroundColor = 'rgba(124, 58, 237, 0.08)';
            } else {
                card.style.borderColor = '';
                card.style.backgroundColor = '';
            }

            const newTotal = Array.from(calcCheckboxes)
                .filter(i => i.checked)
                .reduce((sum, i) => sum + parseInt(i.value), 0);
            
            if (totalPriceEl) {
                let startValue = parseInt(totalPriceEl.innerText) || 0;
                animateValue(totalPriceEl, startValue, newTotal, 450);
            }
            
            currentTotal = newTotal;
        });
    });

    window.orderFromCalc = function() {
        if(currentTotal === 0) { alert("يرجى تحديد خدمة واحدة على الأقل!"); return; }
        openOrderModal(`حزمة مخصصة بقيمة $${currentTotal}`);
    };

    // --- 8. الأسئلة الشائعة ---
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        if (question) {
            question.addEventListener('click', () => {
                faqItems.forEach(i => { if(i !== item) i.classList.remove('active'); });
                item.classList.toggle('active');
            });
        }
    });

    // --- 9. مولد لوحة الألوان الذكي وتغيير ألوان الموقع كلياً ---
    const baseColorPicker = document.getElementById('baseColorPicker');
    const paletteContainer = document.getElementById('paletteColorsContainer');

    function hexToHSL(H) {
        let r = 0, g = 0, b = 0;
        if (H.length == 4) { r = "0x" + H[1] + H[1]; g = "0x" + H[2] + H[2]; b = "0x" + H[3] + H[3]; }
        else if (H.length == 7) { r = "0x" + H[1] + H[2]; g = "0x" + H[3] + H[4]; b = "0x" + H[5] + H[6]; }
        r /= 255; g /= 255; b /= 255;
        let cmin = Math.min(r,g,b), cmax = Math.max(r,g,b), delta = cmax - cmin;
        let h = 0, s = 0, l = 0;
        if (delta == 0) h = 0;
        else if (cmax == r) h = ((g - b) / delta) % 6;
        else if (cmax == g) h = (b - r) / delta + 2;
        else h = (r - g) / delta + 4;
        h = Math.round(h * 60); if (h < 0) h += 360;
        l = (cmax + cmin) / 2;
        s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
        return { h, s: +(s * 100).toFixed(1), l: +(l * 100).toFixed(1) };
    }

    function hslToHex(h, s, l) {
        s /= 100; l /= 100;
        let c = (1 - Math.abs(2 * l - 1)) * s, x = c * (1 - Math.abs((h / 60) % 2 - 1)), m = l - c/2, r = 0, g = 0, b = 0;
        if (0 <= h && h < 60) { r = c; g = x; b = 0; }
        else if (60 <= h && h < 120) { r = x; g = c; b = 0; }
        else if (120 <= h && h < 180) { r = 0; g = c; b = x; }
        else if (180 <= h && h < 240) { r = 0; g = x; b = c; }
        else if (240 <= h && h < 300) { r = x; g = 0; b = c; }
        else if (300 <= h && h < 360) { r = c; g = 0; b = x; }
        r = Math.round((r + m) * 255).toString(16);
        g = Math.round((g + m) * 255).toString(16);
        b = Math.round((b + m) * 255).toString(16);
        if (r.length == 1) r = "0" + r; if (g.length == 1) g = "0" + g; if (b.length == 1) b = "0" + b;
        return "#" + r + g + b;
    }

    function applyPaletteToSite(hexColor) {
        if (!paletteContainer) return;
        paletteContainer.innerHTML = '';
        const hsl = hexToHSL(hexColor);
        const primaryColor = hexColor.toUpperCase();
        const primaryDark = hslToHex(hsl.h, hsl.s, Math.max(15, hsl.l - 20));
        const primaryLight = hslToHex(hsl.h, hsl.s, Math.min(85, hsl.l + 20));
        const accentColor = hslToHex((hsl.h + 180) % 360, hsl.s, hsl.l);

        document.documentElement.style.setProperty('--primary-color', primaryColor);
        document.documentElement.style.setProperty('--primary-dark', primaryDark);
        document.documentElement.style.setProperty('--primary-light', primaryLight);
        document.documentElement.style.setProperty('--accent-color', accentColor);

        const generatedColors = [
            hslToHex(hsl.h, hsl.s, Math.max(12, hsl.l - 35)),
            primaryDark, 
            primaryColor, 
            primaryLight,
            hslToHex(hsl.h, hsl.s, Math.min(94, hsl.l + 32)), 
            accentColor
        ];

        const track = document.createElement('div');
        track.className = 'palette-track';
        generatedColors.forEach(colorHex => {
            const colorCard = document.createElement('div');
            colorCard.className = 'color-card-item';
            colorCard.style.backgroundColor = colorHex;
            colorCard.innerHTML = `<span style="font-size: 11px; font-weight: bold; color: #fff; background: rgba(0,0,0,0.6); padding: 4px 8px; border-radius: 6px;">${colorHex}</span>`;
            colorCard.addEventListener('click', () => {
                navigator.clipboard.writeText(colorHex);
                alert(`تم نسخ كود اللون: ${colorHex}`);
            });
            track.appendChild(colorCard);
        });
        paletteContainer.appendChild(track);
    }

    if (baseColorPicker) {
        baseColorPicker.addEventListener('input', (e) => applyPaletteToSite(e.target.value));
        applyPaletteToSite(baseColorPicker.value);
    }

    // --- 10. نظام تقييم النجوم والتعليقات ---
    const stars = document.querySelectorAll('.star-btn');
    window.selectedRating = 0;

    stars.forEach((star, index) => {
        star.addEventListener('mouseover', () => {
            stars.forEach((s, i) => {
                if (i <= index) { s.classList.add('hover', 'fa-solid'); s.classList.remove('fa-regular'); }
                else { s.classList.remove('hover', 'fa-solid'); s.classList.add('fa-regular'); }
            });
        });

        star.addEventListener('mouseleave', () => {
            stars.forEach((s, i) => {
                s.classList.remove('hover');
                if (i >= window.selectedRating) { s.classList.remove('fa-solid'); s.classList.add('fa-regular'); }
            });
        });

        star.addEventListener('click', () => {
            window.selectedRating = index + 1;
            stars.forEach((s, i) => {
                if (i < window.selectedRating) { s.classList.add('active', 'fa-solid'); s.classList.remove('fa-regular'); }
                else { s.classList.remove('active', 'fa-solid'); s.classList.add('fa-regular'); }
            });
        });
    });

    // --- 11. تحميل التقييمات ---
    const userReviewsContainer = document.getElementById('userReviewsContainer');
    window.loadReviews = function() {
        if (!userReviewsContainer) return;
        const savedReviews = JSON.parse(localStorage.getItem('nexa_reviews') || '[]');
        userReviewsContainer.innerHTML = '';
        savedReviews.forEach(rev => {
            let starsHtml = '';
            for (let i = 0; i < 5; i++) {
                starsHtml += i < rev.rating ? '<i class="fa-solid fa-star"></i>' : '<i class="fa-regular fa-star"></i>';
            }
            const card = document.createElement('div');
            card.className = 'user-review-card reveal active';
            card.innerHTML = `
                <div class="review-stars">${starsHtml}</div>
                <p>"${rev.comment}"</p>
                <h4 style="color: var(--primary-color, #7c3aed); margin-top: 10px;">- ${rev.name}</h4>
            `;
            userReviewsContainer.prepend(card);
        });
    };

    window.loadReviews();
});
                
