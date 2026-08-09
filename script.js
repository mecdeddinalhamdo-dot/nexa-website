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
        if (glassModal) glassModal.style.display = 'flex';
    };

    window.openOrderModal = function(projectName) {
        if (lightboxView) lightboxView.style.display = 'none';
        if (orderView) orderView.style.display = 'block';
        currentProject = projectName;
        if (orderProjectName) orderProjectName.innerText = `الخدمة المطلوبة: ${projectName}`;
        if (glassModal) glassModal.style.display = 'flex';
    };

    window.closeGlassModal = function() {
        if (glassModal) glassModal.style.display = 'none';
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
        
        const phoneNumber = "905364391849"; 
        const message = `مرحباً NEXA، أود طلب خدمة: *${currentProject}*%0Aالاسم: ${name}%0Aالتفاصيل: ${details}`;
        
        window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
        closeGlassModal();
    };

    // --- 7. حاسبة الأسعار السلسة والتفاعلية (مع العداد المتدرج) ---
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

    // --- 8. الأسئلة الشائعة (Accordion) ---
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

    // --- 9. دولاب الألوان المتحرك والسلس ---
    const baseColorPicker = document.getElementById('baseColorPicker');
    const paletteContainer = document.getElementById('paletteColorsContainer');

    function generateRainbowPalette(baseHex) {
        if (!paletteContainer) return;
        paletteContainer.innerHTML = '';

        const wrapper = document.createElement('div');
        wrapper.style.overflowX = 'auto';
        wrapper.style.padding = '10px 0';
        wrapper.style.scrollbarWidth = 'thin';

        const track = document.createElement('div');
        track.style.display = 'flex';
        track.style.gap = '12px';
        track.style.width = 'max-content';

        const hues = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];

        for (let j = 0; j < 2; j++) {
            hues.forEach(hue => {
                const colorHex = hslToHex(hue, 70, 55);
                
                const colorCard = document.createElement('div');
                colorCard.style.backgroundColor = colorHex;
                colorCard.style.minWidth = '85px';
                colorCard.style.height = '65px';
                colorCard.style.borderRadius = '10px';
                colorCard.style.display = 'flex';
                colorCard.style.alignItems = 'flex-end';
                colorCard.style.justifyContent + 'center';
                colorCard.style.justifyContent = 'center';
                colorCard.style.padding = '6px';
                colorCard.style.cursor = 'pointer';
                colorCard.style.boxShadow = '0 4px 6px rgba(0,0,0,0.2)';
                colorCard.style.transition = 'transform 0.2s ease';
                
                colorCard.innerHTML = `<span style="font-size: 10px; font-weight: bold; color: #fff; background: rgba(0,0,0,0.5); padding: 2px 6px; border-radius: 6px;">${colorHex}</span>`;
                
                colorCard.addEventListener('mouseenter', () => colorCard.style.transform = 'scale(1.05)');
                colorCard.addEventListener('mouseleave', () => colorCard.style.transform = 'scale(1)');

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
        // إذا كان عنصر الـ input مخفياً، نجعله ظاهراً أو نتفاعل معه
        baseColorPicker.style.display = 'inline-block';
        baseColorPicker.style.opacity = '1';
        baseColorPicker.style.visibility = 'visible';
        
        generateRainbowPalette(baseColorPicker.value || '#7c3aed');
        baseColorPicker.addEventListener('input', (e) => {
            generateRainbowPalette(e.target.value);
        });
    }

});
                          
