document.addEventListener("DOMContentLoaded", () => {

    // --- 1. تأثير خلفية الجرافيك والتصميم المتحركة ---
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
            constructor() {
                this.reset();
            }
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
                    ctx.beginPath();
                    ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
                    ctx.stroke();
                } else if (this.type === 1) {
                    ctx.strokeRect(-this.size / 2, -this.size / 2, this.size, this.size);
                } else if (this.type === 2) {
                    ctx.beginPath();
                    ctx.moveTo(-this.size, 0);
                    ctx.quadraticCurveTo(0, -this.size, this.size, 0);
                    ctx.stroke();
                } else {
                    ctx.fillRect(-4, -4, 8, 8);
                    ctx.strokeRect(-this.size / 2, -this.size / 2, this.size, this.size);
                }
                ctx.restore();
            }
        }

        for (let i = 0; i < 25; i++) {
            elements.push(new GraphicElement());
        }

        function animateGraphics() {
            ctx.clearRect(0, 0, width, height);
            elements.forEach(el => {
                el.update();
                el.draw();
            });
            requestAnimationFrame(animateGraphics);
        }
        animateGraphics();
    }

    // --- 2. مؤشر شريط التمرير العلوي ---
    window.addEventListener('scroll', () => {
        const winScroll = document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        const progressBar = document.getElementById('scrollProgressBar');
        if (progressBar) progressBar.style.width = scrolled + '%';
    });

    // --- 3. نظام الوضع الليلي والنهاري ---
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
        ar: {
            "nav.services": "خدماتنا", "nav.about": "من نحن", "nav.portfolio": "أعمالنا", "nav.pricing": "الأسعار", "nav.faq": "الأسئلة", "nav.contact": "تواصل معنا"
        },
        en: {
            "nav.services": "Services", "nav.about": "About", "nav.portfolio": "Portfolio", "nav.pricing": "Pricing", "nav.faq": "FAQ", "nav.contact": "Contact Us"
        },
        tr: {
            "nav.services": "Hizmetlerimiz", "nav.about": "Hakkımızda", "nav.portfolio": "Projelerimiz", "nav.pricing": "Fiyatlar", "nav.faq": "SSS", "nav.contact": "İletişim"
        }
    };

    const langSelect = document.getElementById('langSelect');
    if (langSelect) {
        langSelect.addEventListener('change', (e) => {
            const lang = e.target.value;
            document.documentElement.lang = lang;
            document.documentElement.dir = (lang === 'en') ? 'ltr' : 'rtl';
            
            document.querySelectorAll('[data-i18n]').forEach(el => {
                const key = el.getAttribute('data-i18n');
                if (translations[lang] && translations[lang][key]) {
                    el.innerText = translations[lang][key];
                }
            });
        });
    }

    // --- 5. النافذة المنبثقة (Modal & Lightbox) ---
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

    window.closeGlassModal = function() {
        if (glassModal) glassModal.classList.remove('active');
    };

    if (glassModal) {
        glassModal.addEventListener('click', (e) => {
            if (e.target === glassModal) closeGlassModal();
        });
    }

    // --- 6. إرسال طلب الواتساب ---
    window.sendWhatsAppOrder = function(e) {
        e.preventDefault();
        const custNameInput = document.getElementById('custName');
        const custDetailsInput = document.getElementById('custDetails');
        
        const name = custNameInput ? custNameInput.value : '';
        const details = custDetailsInput ? custDetailsInput.value : '';
        
        const phoneNumber = "905000000000"; 
        const message = `مرحباً NEXA، أود طلب خدمة: *${currentProject}*%0Aالاسم: ${name}%0Aالتفاصيل: ${details}`;
        
        window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
        closeGlassModal();
    };

    // --- 7. ميزة المقارنة (قبل وبعد) ---
    const baSlider = document.getElementById('baSlider');
    const baBefore = document.getElementById('baBefore');
    const baLine = document.getElementById('baSliderLine');
    const baBtn = document.getElementById('baSliderBtn');

    if(baSlider && baBefore) {
        baSlider.addEventListener('input', (e) => {
            let sliderVal = e.target.value;
            if (document.documentElement.dir === 'rtl') {
                baBefore.style.clipPath = `polygon(100% 0, ${100-sliderVal}% 0, ${100-sliderVal}% 100%, 100% 100%)`;
                if (baLine) baLine.style.left = `${sliderVal}%`;
                if (baBtn) baBtn.style.left = `${sliderVal}%`;
            } else {
                baBefore.style.clipPath = `polygon(0 0, ${sliderVal}% 0, ${sliderVal}% 100%, 0 100%)`;
                if (baLine) baLine.style.left = `${sliderVal}%`;
                if (baBtn) baBtn.style.left = `${sliderVal}%`;
            }
        });
    }

    // --- 8. حاسبة الأسعار التفاعلية ---
    const calcCheckboxes = document.querySelectorAll('.calc-checkbox');
    const totalPriceEl = document.getElementById('totalPrice');
    let currentTotal = 0;

    calcCheckboxes.forEach(box => {
        box.addEventListener('change', () => {
            currentTotal = Array.from(calcCheckboxes)
                .filter(i => i.checked)
                .reduce((sum, i) => sum + parseInt(i.value), 0);
            
            if (totalPriceEl) {
                let start = parseInt(totalPriceEl.innerText) || 0;
                animateValue(totalPriceEl, start, currentTotal, 300);
            }
        });
    });

    function animateValue(obj, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            obj.innerHTML = Math.floor(progress * (end - start) + start);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    window.orderFromCalc = function() {
        if(currentTotal === 0) {
            alert("يرجى تحديد خدمة واحدة على الأقل!");
            return;
        }
        openOrderModal(`حزمة مخصصة بقيمة $${currentTotal}`);
    };

    // --- 9. الأسئلة الشائعة (Accordion) ---
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

    // --- 10. تأثير 3D Hover لمعرض الأعمال ---
    const tiltCards = document.querySelectorAll('.tilt-card');
    tiltCards.forEach(card => {
        const portfolioImg = card.querySelector('.portfolio-img');
        if (portfolioImg) {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = ((y - centerY) / centerY) * -10;
                const rotateY = ((x - centerX) / centerX) * 10;
                portfolioImg.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            });
            card.addEventListener('mouseleave', () => {
                portfolioImg.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
            });
        }
    });

    // --- 11. أداة توليد لوحة الألوان الذكية (الدولاب العرضي المتحرك لجميع الألوان) ---
    const baseColorPicker = document.getElementById('baseColorPicker');
    const paletteContainer = document.getElementById('paletteColorsContainer');

    function generateRainbowPalette(baseHex) {
        if (!paletteContainer) return;
        paletteContainer.innerHTML = '';

        const wrapper = document.createElement('div');
        wrapper.className = 'palette-scroll-wrapper';

        const track = document.createElement('div');
        track.className = 'palette-track';

        const hues = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];

        for (let j = 0; j < 2; j++) {
            hues.forEach(hue => {
                const colorHex = hslToHex(hue, 70, 55);
                
                const colorCard = document.createElement('div');
                colorCard.className = 'color-card-item';
                colorCard.style.backgroundColor = colorHex;
                
                colorCard.innerHTML = `<span style="font-size: 11px; font-weight: bold; color: #fff; background: rgba(0,0,0,0.3); padding: 2px 6px; border-radius: 6px; backdrop-filter: blur(4px);">${colorHex}</span>`;
                
                colorCard.addEventListener('click', () => {
                    navigator.clipboard.writeText(colorHex);
                    alert(`تم نسخ كود اللون: ${colorHex}`);
                });

                track.appendChild(colorCard);
            });
        }

        wrapper.appendChild(track);
        paletteContainer.appendChild(wrapper);
    }

    function hslToHex(h, s, l) {
        l /= 100;
        const a = s * Math.min(l, 1 - l) / 100;
        const f = n => {
            const k = (n + h / 30) % 12;
            const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
            return Math.round(255 * color).toString(16).padStart(2, '0');
        };
        return `#${f(0)}${f(8)}${f(4)}`;
    }

    if (baseColorPicker) {
        generateRainbowPalette(baseColorPicker.value);
        baseColorPicker.addEventListener('input', (e) => {
            generateRainbowPalette(e.target.value);
        });
    }

    // --- 12. استوديو معاينة الشعار التفاعلي (يدعم اللمس والماوس) ---
    const logoUploadInput = document.getElementById('logoUploadInput');
    const previewLogoOverlay = document.getElementById('previewLogoOverlay');
    const mockupPlaceholderText = document.getElementById('mockupPlaceholderText');

    if (logoUploadInput && previewLogoOverlay) {
        logoUploadInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    previewLogoOverlay.src = event.target.result;
                    previewLogoOverlay.style.display = 'block';
                    previewLogoOverlay.style.left = '50%';
                    previewLogoOverlay.style.top = '50%';
                    previewLogoOverlay.style.transform = 'translate(-50%, -50%)';
                    if (mockupPlaceholderText) mockupPlaceholderText.style.display = 'none';
                }
                reader.readAsDataURL(file);
            }
        });

        let isDragging = false;
        let initialX = 0;
        let initialY = 0;

        function dragStart(e) {
            isDragging = true;
            const clientX = e.type === "touchstart" ? e.touches[0].clientX : e.clientX;
            const clientY = e.type === "touchstart" ? e.touches[0].clientY : e.clientY;
            
            const rect = previewLogoOverlay.getBoundingClientRect();
            initialX = clientX - rect.left;
            initialY = clientY - rect.top;
            
            previewLogoOverlay.style.transform = 'none';
            previewLogoOverlay.style.left = `${previewLogoOverlay.offsetLeft}px`;
            previewLogoOverlay.style.top = `${previewLogoOverlay.offsetTop}px`;
        }

        function drag(e) {
            if (!isDragging) return;
            e.preventDefault();
            const clientX = e.type === "touchmove" ? e.touches[0].clientX : e.clientX;
            const clientY = e.type === "touchmove" ? e.touches[0].clientY : e.clientY;

            let x = clientX - initialX;
            let y = clientY - initialY;

            previewLogoOverlay.style.left = `${x}px`;
            previewLogoOverlay.style.top = `${y}px`;
        }

        function dragEnd() {
            isDragging = false;
        }

        previewLogoOverlay.addEventListener('mousedown', dragStart);
        window.addEventListener('mousemove', drag);
        window.addEventListener('mouseup', dragEnd);

        previewLogoOverlay.addEventListener('touchstart', dragStart, { passive: false });
        window.addEventListener('touchmove', drag, { passive: false });
        window.addEventListener('touchend', dragEnd);
    }

});

// --- 13. تأثير الإضاءة البنفسجية المتفاعلة مع التمرير ---
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = maxScroll > 0 ? (scrollY / maxScroll) * 100 : 0;
    document.body.style.setProperty('--scroll-y', `${scrollPercent}%`);
});
                    
