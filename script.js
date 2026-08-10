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

    // --- 4. ترجمات اللغات الشاملة ---
    const translations = {
        ar: {
            "nav.services": "خدماتنا", 
            "nav.about": "من نحن", 
            "nav.portfolio": "أعمالنا", 
            "nav.pricing": "الأسعار", 
            "nav.faq": "الأسئلة", 
            "hero.badge": "✨ حلول إبداعية متكاملة",
            "hero.title": "نصنع التأثير والتألق لعلامتك التجارية",
            "hero.desc": "نساعدك على النمو والتوسع بأساليب تسويقية وتصاميم حديثة ومبتكرة تناسب تطلعاتك.",
            "services.title": "ماذا نقدم لك؟",
            "services.subtitle": "خدمات متكاملة مصممة لنقل مشروعك لمستوى آخر"
        },
        en: {
            "nav.services": "Services", 
            "nav.about": "About", 
            "nav.portfolio": "Portfolio", 
            "nav.pricing": "Pricing", 
            "nav.faq": "FAQ", 
            "hero.badge": "✨ Integrated Creative Solutions",
            "hero.title": "We Create Impact & Brilliance for Your Brand",
            "hero.desc": "We help you grow and expand with modern, innovative marketing methods and designs tailored to your aspirations.",
            "services.title": "What We Offer?",
            "services.subtitle": "Comprehensive services designed to take your project to the next level"
        },
        tr: {
            "nav.services": "Hizmetlerimiz", 
            "nav.about": "Hakkımızda", 
            "nav.portfolio": "Projelerimiz", 
            "nav.pricing": "Fiyatlar", 
            "nav.faq": "SSS", 
            "hero.badge": "✨ Entegre Yaratıcı Çözümler",
            "hero.title": "Markanız İçin Etki ve Parlaklık Yaratıyoruz",
            "hero.desc": "Hedeflerinize uygun modern, yenilikçi pazarlama yöntemleri ve tasarımlarla büyümenize yardımcı oluyoruz.",
            "services.title": "Neler Sunuyoruz?",
            "services.subtitle": "Projenizi bir üst seviyeye taşımak için tasarlanmış kapsamlı hizmetler"
        }
    };

    const langSelect = document.getElementById('langSelect');
    if (langSelect) {
        langSelect.addEventListener('change', (e) => {
            const lang = e.target.value;
            document.documentElement.lang = lang;
            document.documentElement.dir = (lang === 'en' || lang === 'tr') ? 'ltr' : 'rtl';
            
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

    window.switchToOrderView = function() {
        if (lightboxView) lightboxView.style.display = 'none';
        if (orderView) orderView.style.display = 'block';
        if (orderProjectName) orderProjectName.innerText = `الخدمة المطلوبة: ${currentProject}`;
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
        
        const phoneNumber = "905364391849"; 
        const message = `مرحباً NEXA، أود طلب خدمة: *${currentProject}*%0Aالاسم: ${name}%0Aالتفاصيل: ${details}`;
        
        window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
        closeGlassModal();
    };

    // --- 7. حاسبة الأسعار التفاعلية ---
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

    // --- 9. مولد لوحة الألوان الذكي المتوافق مع HTML ---
    const baseColorPicker = document.getElementById('baseColorPicker');
    const paletteContainer = document.getElementById('paletteColorsContainer');

    function generatePalette(hexColor) {
        if (!paletteContainer) return;
        paletteContainer.innerHTML = '';

        // تحويل Hex إلى RGB
        let r = parseInt(hexColor.slice(1, 3), 16);
        let g = parseInt(hexColor.slice(3, 5), 16);
        let b = parseInt(hexColor.slice(5, 7), 16);

        // توليد درجات ألوان متناسقة
        const shades = [
            { name: "أساسي", val: hexColor },
            { name: "فاتح 1", val: lightenDarkenColor(hexColor, 30) },
            { name: "فاتح 2", val: lightenDarkenColor(hexColor, 60) },
            { name: "داكن 1", val: lightenDarkenColor(hexColor, -30) },
            { name: "داكن 2", val: lightenDarkenColor(hexColor, -60) }
        ];

        shades.forEach(shade => {
            const box = document.createElement('div');
            box.style.background = shade.val;
            box.style.padding = '15px 10px';
            box.style.borderRadius = '10px';
            box.style.color = '#fff';
            box.style.cursor = 'pointer';
            box.style.fontWeight = 'bold';
            box.style.fontSize = '12px';
            box.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
            box.style.transition = 'transform 0.2s';
            box.innerHTML = `${shade.name}<br><span style="font-size:10px; opacity:0.9;">${shade.val}</span>`;
            
            box.addEventListener('click', () => {
                navigator.clipboard.writeText(shade.val);
                alert(`تم نسخ كود اللون: ${shade.val}`);
            });

            paletteContainer.appendChild(box);
        });
    }

    function lightenDarkenColor(col, amt) {
        let usePound = false;
        if (col[0] == "#") {
            col = col.slice(1);
            usePound = true;
        }
        let num = parseInt(col, 16);
        let r = (num >> 16) + amt;
        if (r > 255) r = 255; else if (r < 0) r = 0;
        let b = ((num >> 8) & 0x00ff) + amt;
        if (b > 255) b = 255; else if (b < 0) b = 0;
        let g = (num & 0x0000ff) + amt;
        if (g > 255) g = 255; else if (g < 0) g = 0;
        return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16).padStart(6, '0');
    }

    if (baseColorPicker) {
        generatePalette(baseColorPicker.value);
        baseColorPicker.addEventListener('input', (e) => {
            generatePalette(e.target.value);
        });
    }

});
            
