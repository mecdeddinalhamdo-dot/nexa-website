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
                


/* =========================================================
   NEXA CREATIVE ULTIMATE — Interaction Layer
   ========================================================= */
(() => {
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => [...r.querySelectorAll(s)];
  const root = document.documentElement;
  const NEXA_PURPLE = '#6C2EFB';
  const NEXA_DARK = '#292D38';

  const translations = {
    ar:{
      'nav.services':'خدماتنا','nav.about':'من نحن','nav.portfolio':'أعمالنا','nav.pricing':'الأسعار','nav.faq':'الأسئلة','nav.contact':'تواصل معنا',
      'hero.badge':'✦ Nexa Creative — حلول إبداعية متكاملة','hero.title':'نصنع التأثير والتألق لعلامتك التجارية','hero.desc':'نحوّل الأفكار إلى هويات وتجارب رقمية تترك انطباعاً لا يُنسى.','hero.start':'ابدأ مشروعك','hero.work':'شاهد أعمالنا','hero.stat1':'+ مشروع','hero.stat2':'+ هوية','hero.stat3':'% رضا',
      'services.title':'ماذا نقدم لك؟','services.subtitle':'خدمات متكاملة مصممة لنقل مشروعك لمستوى آخر','services.s1_title':'التصميم والهوية البصرية','services.s1_desc':'بناء هوية بصرية كاملة وشعارات احترافية تعبر عن قيمة وهدف عملك.','services.s2_title':'التسويق الرقمي','services.s2_desc':'حملات إعلانية مدروسة وإدارة حسابات التواصل لزيادة المبيعات والانتشار.','services.s3_title':'تطوير المواقع والتطبيقات','services.s3_desc':'تطوير مواقع إلكترونية سريعة ومتجاوبة مع كافة الشاشات وأحدث التقنيات.',
      'portfolio.title':'معرض أعمالنا','portfolio.subtitle':'نظرة على بعض مشاريعنا والتصاميم المبتكرة','portfolio.zoom':'تكبير التصميم','portfolio.order_btn':'اطلب مثل هذا','portfolio.all':'الكل','portfolio.branding':'Branding','portfolio.marketing':'Marketing','portfolio.uiux':'UI/UX','portfolio.case':'عرض المشروع',
      'calc.title':'حاسبة التكلفة التقديرية','calc.subtitle':'حدد الخدمات التي تحتاجها لتعرف التكلفة المتوقعة لمشروعك','calc.logo':'تصميم شعار احترافي ($50)','calc.identity':'هوية بصرية كاملة ($150)','calc.social':'إدارة منصات التواصل (شهرياً - $100)','calc.web':'تطوير موقع تعريفي ($300)','calc.total_text':'التكلفة الإجمالية التقديرية:','calc.order_btn':'اطلب هذه الحزمة الآن',
      'testimonials.title':'ماذا يقول عملاؤنا؟','testimonials.c1_name':'- شركة الأفق','testimonials.c2_name':'- متجر كريستال',
      'faq.title':'الأسئلة الشائعة','faq.q1':'كم يستغرق تصميم الهوية البصرية؟','faq.a1':'عادة ما يستغرق الأمر من 5 إلى 10 أيام عمل حسب حجم التفاصيل والتعديلات المطلوبة.','faq.q2':'هل تسلمون الملفات المصدرية المفتوحة؟','faq.a2':'نعم بالتأكيد! نقوم بتسليم كافة الملفات بصيغ (AI, PSD, PDF, PNG) لتتمكن من استخدامها بسهولة.',
      'footer.desc':'حلول إبداعية وعصرية ترفع علامتك التجارية لأعلى النجوم.','footer.contact':'تواصل معنا','footer.social':'تابعنا على منصات التواصل','footer.rights':'جميع الحقوق محفوظة.',
      'about.title':'نصمم حضورك، لا مجرد صورة.','about.desc':'Nexa Creative استوديو إبداعي يركز على الهوية البصرية والتجارب الرقمية والتصميم الذي يخدم هدفاً واضحاً.','about.p1':'هوية قابلة للتوسع','about.p2':'تصميم يركز على المستخدم','about.p3':'تسليم منظم واحترافي',
      'palette.title':'مولد لوحة الألوان الذكي','palette.subtitle':'اختر لونك الأساسي لتوليد درجات هوية بصرية متناسقة لمشروعك فوراً','palette.choose':'اختر اللون الأساسي:','palette.save':'حفظ اللوحة','palette.reset':'ألوان Nexa',
      'reviews.add_title':'أضف تقييمك ورأيك','reviews.add_subtitle':'شاركونا انطباعكم عن خدماتنا لنستمر في تقديم الأفضل','reviews.name_label':'اسمك أو اسم شركتك:','reviews.name_placeholder':'أدخل اسمك هنا...','reviews.rating_label':'تقييمك:','reviews.comment_label':'تعليقك أو انطباعك:','reviews.comment_placeholder':'اكتب تعليقك هنا...','reviews.submit':'إرسال التقييم',
      'modal.order_this':'اطلب تصميم مشابه الآن','modal.order_title':'طلب تصميم سريع','modal.name_label':'الاسم الكريم:','modal.details_label':'تفاصيل إضافية (اختياري):','modal.send_btn':'إرسال الطلب عبر الواتساب',
      'why.title':'لماذا Nexa Creative؟','why.subtitle':'نمزج الاستراتيجية مع التصميم لنصنع حضوراً رقمياً واضحاً ومميزاً.','why.w1':'فكرة قبل الشكل','why.d1':'كل تفصيل بصري له هدف ورسالة، وليس مجرد زينة.','why.w2':'جودة بصرية عالية','why.d2':'نظام بصري متناسق يصلح للهوية والطباعة والمنصات الرقمية.','why.w3':'تنفيذ سريع ومرن','why.d3':'خطوات واضحة وتعديلات مرنة حتى تصل للنتيجة التي تريدها.','why.w4':'دعم بعد التسليم','why.d4':'نبقى قريبين منك لتسهيل استخدام ملفاتك وهويتك.',
      'process.title':'من الفكرة إلى الإطلاق','process.subtitle':'أربع خطوات بسيطة، ونتيجة مصممة حول هدفك.','process.p1':'اكتشف','process.d1':'نفهم مشروعك وجمهورك واحتياجك الحقيقي.','process.p2':'خطط','process.d2':'نحدد الاتجاه البصري والرسالة والهيكل.','process.p3':'صمّم','process.d3':'نحوّل الخطة إلى تصميم احترافي قابل للاستخدام.','process.p4':'أطلق','process.d4':'نسلم الملفات ونجهزك للانطلاق بثقة.',
      'compare.title':'شاهد التصميم من زاوية مختلفة','compare.subtitle':'يمكنك لاحقاً استبدال الصور بصور قبل/بعد مشاريعك الحقيقية.','compare.after':'FINAL DESIGN','compare.heading':'كل مشروع يمكن أن يتحول إلى قصة نجاح.','compare.desc':'أضف صور قبل/بعد الحقيقية لاحقاً، وسيظهر هذا القسم كعرض تفاعلي كامل بدون تغيير هوية الموقع.','compare.cta':'ابدأ مشروعاً جديداً',
      'wizard.title':'ابنِ طلب مشروعك خلال دقيقة','wizard.subtitle':'اختر احتياجك وسنجهز لك رسالة احترافية جاهزة للإرسال عبر واتساب.','wizard.step1':'ما الخدمة التي تحتاجها؟','wizard.step2':'ما الميزانية التقريبية؟','wizard.step3':'متى تريد التسليم؟','wizard.step4':'أخبرنا عن فكرتك','wizard.week':'خلال أسبوع','wizard.two':'1 — 2 أسبوع','wizard.flex':'موعد مرن','wizard.back':'السابق','wizard.next':'التالي','wizard.send':'إرسال عبر واتساب','wizard.placeholder':'اكتب التفاصيل، رابط الحساب، اسم العلامة، أو أي ملاحظة مهمة...','wizard.name':'اسمك / اسم المشروع',
      'reviews.summary':'آراء وتجارب العملاء تساعدنا على تطوير Nexa Creative باستمرار.',
      'ai.subtitle':'مساعد إبداعي سريع','ai.welcome':'اكتب فكرتك وسأقترح لك الاتجاه البصري والخدمات المناسبة.','ai.placeholder':'اكتب فكرتك...','case.desc':'مشروع مختار من أعمال Nexa Creative، قابل للتوسع إلى دراسة حالة كاملة.','case.cta':'أريد مشروعاً مشابهاً'
    },
    en:{
      'nav.services':'Services','nav.about':'About','nav.portfolio':'Portfolio','nav.pricing':'Pricing','nav.faq':'FAQ','nav.contact':'Contact',
      'hero.badge':'✦ Nexa Creative — Complete Creative Solutions','hero.title':'We create impact and distinction for your brand','hero.desc':'We turn ideas into identities and digital experiences people remember.','hero.start':'Start a Project','hero.work':'View Our Work','hero.stat1':'+ Projects','hero.stat2':'+ Identities','hero.stat3':'% Satisfaction',
      'services.title':'What We Do','services.subtitle':'Integrated services designed to take your project further','services.s1_title':'Branding & Visual Identity','services.s1_desc':'Complete visual identities and professional logos built around your value and goals.','services.s2_title':'Digital Marketing','services.s2_desc':'Strategic campaigns and social management designed to grow reach and sales.','services.s3_title':'Web & App Development','services.s3_desc':'Fast, responsive digital experiences built with modern technology.',
      'portfolio.title':'Selected Work','portfolio.subtitle':'A look at selected projects and creative designs','portfolio.zoom':'View Design','portfolio.order_btn':'Order Similar','portfolio.all':'All','portfolio.branding':'Branding','portfolio.marketing':'Marketing','portfolio.uiux':'UI/UX','portfolio.case':'View Case',
      'calc.title':'Estimated Cost Calculator','calc.subtitle':'Select the services you need to estimate your project cost','calc.logo':'Professional Logo ($50)','calc.identity':'Complete Visual Identity ($150)','calc.social':'Social Media Management (Monthly - $100)','calc.web':'Business Website ($300)','calc.total_text':'Estimated Total:','calc.order_btn':'Order This Package',
      'testimonials.title':'What Clients Say','testimonials.c1_name':'- Horizon Company','testimonials.c2_name':'- Crystal Store',
      'faq.title':'Frequently Asked Questions','faq.q1':'How long does branding take?','faq.a1':'Usually 5–10 business days depending on scope and revisions.','faq.q2':'Do you deliver source files?','faq.a2':'Yes. We deliver AI, PSD, PDF and PNG files as needed.',
      'footer.desc':'Modern creative solutions that elevate your brand.','footer.contact':'Contact Us','footer.social':'Follow Us','footer.rights':'All rights reserved.',
      'about.title':'We design your presence, not just a picture.','about.desc':'Nexa Creative is a creative studio focused on visual identity, digital experiences and purposeful design.','about.p1':'Scalable identity','about.p2':'User-focused design','about.p3':'Professional delivery',
      'palette.title':'Smart Color Palette Generator','palette.subtitle':'Choose a base color to generate a balanced visual identity palette instantly','palette.choose':'Choose base color:','palette.save':'Save Palette','palette.reset':'Nexa Colors',
      'reviews.add_title':'Leave a Review','reviews.add_subtitle':'Share your experience and help us keep improving','reviews.name_label':'Your name or company:','reviews.name_placeholder':'Enter your name...','reviews.rating_label':'Your rating:','reviews.comment_label':'Your comment:','reviews.comment_placeholder':'Write your comment...','reviews.submit':'Submit Review',
      'modal.order_this':'Order a Similar Design','modal.order_title':'Quick Project Request','modal.name_label':'Your Name:','modal.details_label':'Additional Details (optional):','modal.send_btn':'Send via WhatsApp',
      'why.title':'Why Nexa Creative?','why.subtitle':'We blend strategy and design to build a clear, distinctive digital presence.','why.w1':'Ideas Before Decoration','why.d1':'Every visual detail has a purpose and message.','why.w2':'High Visual Quality','why.d2':'A consistent system that works across digital and print.','why.w3':'Fast & Flexible','why.d3':'Clear steps and flexible revisions until it feels right.','why.w4':'Post-Delivery Support','why.d4':'We stay close to help you use your identity and files.',
      'process.title':'From Idea to Launch','process.subtitle':'Four simple steps, designed around your goal.','process.p1':'Discover','process.d1':'We understand your project, audience and real need.','process.p2':'Plan','process.d2':'We define the visual direction, message and structure.','process.p3':'Design','process.d3':'We turn the plan into a polished, usable design.','process.p4':'Launch','process.d4':'We deliver the files and prepare you to launch.',
      'compare.title':'See Design From Another Angle','compare.subtitle':'You can later replace these with real before/after project images.','compare.after':'FINAL DESIGN','compare.heading':'Every project can become a success story.','compare.desc':'Add real before/after images later and this section can become a full interactive showcase.','compare.cta':'Start a New Project',
      'wizard.title':'Build Your Project Brief in One Minute','wizard.subtitle':'Choose your needs and get a professional WhatsApp-ready brief.','wizard.step1':'What service do you need?','wizard.step2':'What is your approximate budget?','wizard.step3':'When do you need delivery?','wizard.step4':'Tell us about your idea','wizard.week':'Within a week','wizard.two':'1–2 weeks','wizard.flex':'Flexible','wizard.back':'Back','wizard.next':'Next','wizard.send':'Send via WhatsApp','wizard.placeholder':'Details, account link, brand name, or anything important...','wizard.name':'Your name / project name',
      'reviews.summary':'Client feedback helps us keep improving Nexa Creative.',
      'ai.subtitle':'Quick creative assistant','ai.welcome':'Tell me your idea and I will suggest a visual direction and suitable services.','ai.placeholder':'Describe your idea...','case.desc':'A selected Nexa Creative project, ready to expand into a full case study.','case.cta':'I Want Something Similar'
    },
    tr:{
      'nav.services':'Hizmetler','nav.about':'Hakkımızda','nav.portfolio':'Projeler','nav.pricing':'Fiyatlar','nav.faq':'SSS','nav.contact':'İletişim',
      'hero.badge':'✦ Nexa Creative — Yaratıcı Çözümler','hero.title':'Markanız için etki ve fark yaratıyoruz','hero.desc':'Fikirleri unutulmaz marka kimliklerine ve dijital deneyimlere dönüştürüyoruz.','hero.start':'Proje Başlat','hero.work':'Çalışmalarımız','hero.stat1':'+ Proje','hero.stat2':'+ Kimlik','hero.stat3':'% Memnuniyet',
      'services.title':'Ne Sunuyoruz?','services.subtitle':'Projenizi bir üst seviyeye taşıyan entegre hizmetler','services.s1_title':'Marka ve Görsel Kimlik','services.s1_desc':'Değerlerinize ve hedeflerinize uygun profesyonel logo ve kurumsal kimlik.','services.s2_title':'Dijital Pazarlama','services.s2_desc':'Erişimi ve satışları artırmak için stratejik kampanyalar ve sosyal medya yönetimi.','services.s3_title':'Web ve Uygulama','services.s3_desc':'Modern teknolojilerle hızlı ve duyarlı dijital deneyimler.',
      'portfolio.title':'Seçili Çalışmalar','portfolio.subtitle':'Projelerimizden ve yaratıcı tasarımlarımızdan bir seçki','portfolio.zoom':'Tasarımı Gör','portfolio.order_btn':'Benzerini İste','portfolio.all':'Tümü','portfolio.branding':'Branding','portfolio.marketing':'Pazarlama','portfolio.uiux':'UI/UX','portfolio.case':'Projeyi Gör',
      'calc.title':'Tahmini Fiyat Hesaplayıcı','calc.subtitle':'İhtiyacınız olan hizmetleri seçerek tahmini maliyeti görün','calc.logo':'Profesyonel Logo ($50)','calc.identity':'Tam Görsel Kimlik ($150)','calc.social':'Sosyal Medya Yönetimi (Aylık - $100)','calc.web':'Kurumsal Web Sitesi ($300)','calc.total_text':'Tahmini Toplam:','calc.order_btn':'Bu Paketi İste',
      'testimonials.title':'Müşterilerimiz Ne Diyor?','testimonials.c1_name':'- Ufuk Şirketi','testimonials.c2_name':'- Crystal Mağaza',
      'faq.title':'Sık Sorulan Sorular','faq.q1':'Kurumsal kimlik ne kadar sürer?','faq.a1':'Kapsama ve revizyonlara bağlı olarak genellikle 5–10 iş günü.','faq.q2':'Kaynak dosyaları teslim ediyor musunuz?','faq.a2':'Evet. Gerektiğinde AI, PSD, PDF ve PNG dosyalarını teslim ediyoruz.',
      'footer.desc':'Markanızı yükselten modern yaratıcı çözümler.','footer.contact':'İletişim','footer.social':'Bizi Takip Edin','footer.rights':'Tüm hakları saklıdır.',
      'about.title':'Sadece bir görüntü değil, güçlü bir varlık tasarlıyoruz.','about.desc':'Nexa Creative; görsel kimlik, dijital deneyim ve hedef odaklı tasarıma odaklanan yaratıcı bir stüdyodur.','about.p1':'Ölçeklenebilir kimlik','about.p2':'Kullanıcı odaklı tasarım','about.p3':'Profesyonel teslim',
      'palette.title':'Akıllı Renk Paleti','palette.subtitle':'Temel renginizi seçin ve dengeli bir görsel kimlik paleti oluşturun','palette.choose':'Temel rengi seçin:','palette.save':'Paleti Kaydet','palette.reset':'Nexa Renkleri',
      'reviews.add_title':'Değerlendirme Bırakın','reviews.add_subtitle':'Deneyiminizi paylaşın ve gelişmemize yardımcı olun','reviews.name_label':'Adınız veya şirketiniz:','reviews.name_placeholder':'Adınızı girin...','reviews.rating_label':'Puanınız:','reviews.comment_label':'Yorumunuz:','reviews.comment_placeholder':'Yorumunuzu yazın...','reviews.submit':'Değerlendirme Gönder',
      'modal.order_this':'Benzer Tasarım İste','modal.order_title':'Hızlı Proje Talebi','modal.name_label':'Adınız:','modal.details_label':'Ek Detaylar (isteğe bağlı):','modal.send_btn':'WhatsApp ile Gönder',
      'why.title':'Neden Nexa Creative?','why.subtitle':'Net ve farklı bir dijital görünüm için strateji ile tasarımı birleştiriyoruz.','why.w1':'Önce Fikir','why.d1':'Her görsel detayın bir amacı ve mesajı vardır.','why.w2':'Yüksek Görsel Kalite','why.d2':'Dijital ve baskıda çalışan tutarlı bir görsel sistem.','why.w3':'Hızlı ve Esnek','why.d3':'Net adımlar ve esnek revizyonlar.','why.w4':'Teslimat Sonrası Destek','why.d4':'Kimliğinizi ve dosyalarınızı kullanırken yanınızdayız.',
      'process.title':'Fikirden Lansmana','process.subtitle':'Hedefinize göre tasarlanmış dört basit adım.','process.p1':'Keşfet','process.d1':'Projenizi, kitlenizi ve gerçek ihtiyacınızı anlarız.','process.p2':'Planla','process.d2':'Görsel yönü, mesajı ve yapıyı belirleriz.','process.p3':'Tasarla','process.d3':'Planı kullanılabilir profesyonel tasarıma dönüştürürüz.','process.p4':'Yayınla','process.d4':'Dosyaları teslim eder ve lansmana hazırlarız.',
      'compare.title':'Tasarımı Farklı Bir Açıdan Görün','compare.subtitle':'Daha sonra gerçek önce/sonra görselleri ekleyebilirsiniz.','compare.after':'FINAL TASARIM','compare.heading':'Her proje bir başarı hikâyesine dönüşebilir.','compare.desc':'Gerçek önce/sonra görsellerini eklediğinizde bu alan interaktif bir vitrine dönüşebilir.','compare.cta':'Yeni Proje Başlat',
      'wizard.title':'Proje Talebinizi Bir Dakikada Oluşturun','wizard.subtitle':'İhtiyacınızı seçin, WhatsApp için profesyonel bir mesaj hazırlayalım.','wizard.step1':'Hangi hizmete ihtiyacınız var?','wizard.step2':'Yaklaşık bütçeniz nedir?','wizard.step3':'Ne zaman teslim almak istersiniz?','wizard.step4':'Fikrinizi anlatın','wizard.week':'Bir hafta içinde','wizard.two':'1–2 hafta','wizard.flex':'Esnek','wizard.back':'Geri','wizard.next':'İleri','wizard.send':'WhatsApp ile Gönder','wizard.placeholder':'Detaylar, hesap linki, marka adı veya önemli bir not...','wizard.name':'Adınız / proje adı',
      'reviews.summary':'Müşteri geri bildirimleri Nexa Creative’i geliştirmemize yardımcı olur.',
      'ai.subtitle':'Hızlı yaratıcı asistan','ai.welcome':'Fikrinizi yazın; size görsel yön ve uygun hizmetleri önereyim.','ai.placeholder':'Fikrinizi anlatın...','case.desc':'Nexa Creative seçili projesi; tam bir vaka çalışmasına dönüştürülebilir.','case.cta':'Benzer Proje İstiyorum'
    }
  };

  function applyLanguage(lang){
    if(!translations[lang]) lang='ar';
    root.lang=lang; root.dir=lang==='ar'?'rtl':'ltr';
    localStorage.setItem('nexa_lang',lang);
    const select=$('#langSelect'); if(select) select.value=lang;
    $$('[data-i18n]').forEach(el=>{
      const key=el.getAttribute('data-i18n');
      if(translations[lang][key]!==undefined) el.textContent=translations[lang][key];
    });
    $$('[data-i18n-placeholder]').forEach(el=>{
      const key=el.getAttribute('data-i18n-placeholder');
      if(translations[lang][key]!==undefined) el.placeholder=translations[lang][key];
    });
  }
  const savedLang=localStorage.getItem('nexa_lang') || 'ar';
  applyLanguage(savedLang);
  $('#langSelect')?.addEventListener('change',e=>applyLanguage(e.target.value));

  // loader
  window.addEventListener('load',()=>{
    setTimeout(()=>$('#pageLoader')?.classList.add('hide'),650);
  });

  // mobile menu
  const menuBtn=$('#mobileMenuBtn'), nav=$('.nav-links');
  menuBtn?.addEventListener('click',()=>{
    const open=nav?.classList.toggle('mobile-open');
    menuBtn.setAttribute('aria-expanded',String(!!open));
    menuBtn.innerHTML=open?'<i class="fa-solid fa-xmark"></i>':'<i class="fa-solid fa-bars"></i>';
  });
  $$('.nav-links a').forEach(a=>a.addEventListener('click',()=>nav?.classList.remove('mobile-open')));

  // portfolio filters
  $$('.portfolio-filter').forEach(btn=>{
    btn.addEventListener('click',()=>{
      $$('.portfolio-filter').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      const filter=btn.dataset.filter;
      $$('.portfolio-card').forEach(card=>{
        card.classList.toggle('is-hidden',filter!=='all' && card.dataset.category!==filter);
      });
    });
  });

  // smooth counters
  const counters=$$('.counter');
  const counterObs=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(!entry.isIntersecting || entry.target.dataset.done) return;
      entry.target.dataset.done='1';
      const target=Number(entry.target.dataset.target||0);
      let start=0; const duration=1200; const t0=performance.now();
      const tick=t=>{
        const p=Math.min((t-t0)/duration,1);
        start=Math.floor((1-Math.pow(1-p,3))*target);
        entry.target.textContent=start;
        if(p<1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  },{threshold:.55});
  counters.forEach(c=>counterObs.observe(c));

  // back-to-top
  const topBtn=$('#backToTop');
  window.addEventListener('scroll',()=>topBtn?.classList.toggle('show',scrollY>650),{passive:true});
  topBtn?.addEventListener('click',()=>scrollTo({top:0,behavior:'smooth'}));

  // cursor spotlight
  if(matchMedia('(pointer:fine)').matches){
    const spot=document.createElement('div'); spot.className='cursor-spotlight'; document.body.appendChild(spot);
    let sx=0,sy=0,tx=0,ty=0;
    document.addEventListener('mousemove',e=>{tx=e.clientX;ty=e.clientY});
    const move=()=>{sx+=(tx-sx)*.12;sy+=(ty-sy)*.12;spot.style.left=sx+'px';spot.style.top=sy+'px';requestAnimationFrame(move)};move();
    $$('.magnetic').forEach(el=>{
      el.addEventListener('mousemove',e=>{
        const r=el.getBoundingClientRect(), x=(e.clientX-r.left-r.width/2)/r.width*14, y=(e.clientY-r.top-r.height/2)/r.height*14;
        el.style.transform=`translate(${x}px,${y}px)`;
      });
      el.addEventListener('mouseleave',()=>el.style.transform='');
    });
  }

  // toast
  let toast;
  function showToast(msg){
    if(!toast){toast=document.createElement('div');toast.className='toast-message';document.body.appendChild(toast)}
    toast.textContent=msg;toast.classList.add('show');clearTimeout(showToast.t);
    showToast.t=setTimeout(()=>toast.classList.remove('show'),2200);
  }
  window.nexaToast=showToast;

  // palette save/reset
  $('#savePaletteBtn')?.addEventListener('click',()=>{
    const color=$('#baseColorPicker')?.value || NEXA_PURPLE;
    localStorage.setItem('nexa_palette',color);showToast('تم حفظ لوحة الألوان');
  });
  $('#resetPaletteBtn')?.addEventListener('click',()=>{
    const picker=$('#baseColorPicker'); if(picker){picker.value=NEXA_PURPLE;picker.dispatchEvent(new Event('input',{bubbles:true}))}
    root.style.setProperty('--primary',NEXA_PURPLE);root.style.setProperty('--primary-light','#8A5CFF');
    localStorage.setItem('nexa_palette',NEXA_PURPLE);showToast('تمت استعادة ألوان Nexa');
  });
  const savedPalette=localStorage.getItem('nexa_palette');
  if(savedPalette && $('#baseColorPicker')){$('#baseColorPicker').value=savedPalette;$('#baseColorPicker').dispatchEvent(new Event('input',{bubbles:true}))}

  // case study
  const caseModal=$('#caseModal');
  window.openCaseStudy=(button)=>{
    if(!caseModal) return;
    $('#caseImage').src=button.dataset.image||'work1.jpg';
    $('#caseTitle').textContent=button.dataset.title||'Nexa Creative';
    $('#caseCategory').textContent=button.dataset.category||'CREATIVE PROJECT';
    caseModal.classList.add('open');caseModal.setAttribute('aria-hidden','false');
  };
  const closeCase=()=>{caseModal?.classList.remove('open');caseModal?.setAttribute('aria-hidden','true')};
  $('#caseClose')?.addEventListener('click',closeCase);
  caseModal?.addEventListener('click',e=>{if(e.target===caseModal)closeCase()});

  // wizard
  const wizard=$('#projectWizard'), steps=$$('.wizard-step',wizard||document), dots=$$('.wizard-dot'), prev=$('.wizard-prev',wizard||document), next=$('.wizard-next',wizard||document), submit=$('.wizard-submit',wizard||document);
  let step=1;
  function renderStep(){
    steps.forEach(s=>s.classList.toggle('active',Number(s.dataset.step)===step));
    dots.forEach((d,i)=>d.classList.toggle('active',i<step));
    if(prev) prev.disabled=step===1;
    if(next) next.style.display=step===4?'none':'inline-flex';
    if(submit) submit.style.display=step===4?'inline-flex':'none';
  }
  next?.addEventListener('click',()=>{if(step<4){step++;renderStep()}});
  prev?.addEventListener('click',()=>{if(step>1){step--;renderStep()}});
  wizard?.addEventListener('submit',e=>{
    e.preventDefault();
    const service=$('input[name="service"]:checked',wizard)?.value||'Creative Service';
    const budget=$('input[name="budget"]:checked',wizard)?.value||'Flexible';
    const timeline=$('input[name="timeline"]:checked',wizard)?.value||'Flexible';
    const name=$('#wizardName')?.value||'Visitor';
    const details=$('#wizardDetails')?.value||'';
    const message=`مرحباً Nexa Creative، أريد بدء مشروع.%0Aالاسم: ${encodeURIComponent(name)}%0Aالخدمة: ${encodeURIComponent(service)}%0Aالميزانية: ${encodeURIComponent(budget)}%0Aالموعد: ${encodeURIComponent(timeline)}%0Aالتفاصيل: ${encodeURIComponent(details)}`;
    window.open(`https://wa.me/905364391849?text=${message}`,'_blank');
    showToast('تم تجهيز طلبك وفتح واتساب');
  });
  renderStep();

  // AI local assistant
  const aiPanel=$('#aiPanel'), aiFab=$('#aiFab'), aiClose=$('#aiClose'), aiForm=$('#aiForm'), aiInput=$('#aiInput'), aiMessages=$('#aiMessages');
  function aiReply(text){
    const t=text.toLowerCase();
    if(t.includes('مطعم')||t.includes('restaurant')) return 'أنصحك بهوية دافئة وواضحة، شعار بسيط، نظام ألوان مميز، قوالب سوشيال ميديا وقائمة/منيو متناسقة. الخدمات الأنسب: Branding + Social Media.';
    if(t.includes('متجر')||t.includes('أزياء')||t.includes('fashion')) return 'الأنسب هوية أنيقة قابلة للتوسع، شعار مرن، Typography قوية وقوالب سوشيال. الخدمات: Branding + Logo + Social Media.';
    if(t.includes('موقع')||t.includes('web')||t.includes('website')) return 'أقترح Web Design أولاً مع UX واضح، Hero قوي، صفحات خدمات، Portfolio وCTA ذكي. الخدمات: UI/UX + Web Design.';
    if(t.includes('شعار')||t.includes('logo')) return 'نبدأ بـLogo direction ثم نبني نظام الألوان والخطوط والاستخدامات. إذا كان المشروع أكبر، نوسعه إلى Visual Identity.';
    return 'فكرة ممتازة. كبداية أقترح تحديد الهدف والجمهور ثم اختيار اتجاه بصري. اكتب لي نوع المشروع (مطعم، متجر، شركة، تطبيق...) وسأقترح عليك الحزمة الأنسب.';
  }
  function addAi(text,type='bot'){
    const d=document.createElement('div');d.className=`ai-bubble ${type}`;d.textContent=text;aiMessages?.appendChild(d);aiMessages?.scrollTo({top:aiMessages.scrollHeight,behavior:'smooth'});
  }
  aiFab?.addEventListener('click',()=>{aiPanel?.classList.toggle('open');aiPanel?.setAttribute('aria-hidden',String(!aiPanel.classList.contains('open')));if(aiPanel.classList.contains('open'))aiInput?.focus()});
  aiClose?.addEventListener('click',()=>aiPanel?.classList.remove('open'));
  $$('.ai-suggestions button').forEach(b=>b.addEventListener('click',()=>{const p=b.dataset.prompt;addAi(p,'user');setTimeout(()=>addAi(aiReply(p)),280)}));
  aiForm?.addEventListener('submit',e=>{e.preventDefault();const text=aiInput?.value.trim();if(!text)return;addAi(text,'user');aiInput.value='';setTimeout(()=>addAi(aiReply(text)),280)});

  // escape for all premium overlays
  document.addEventListener('keydown',e=>{
    if(e.key!=='Escape')return;
    closeCase();aiPanel?.classList.remove('open');window.closeGlassModal?.();
  });

  // average reviews
  function updateReviewSummary(){
    try{
      const reviews=JSON.parse(localStorage.getItem('nexa_reviews')||'[]');
      if(!reviews.length){$('#averageRating') && ($('#averageRating').textContent='5.0');return}
      const avg=reviews.reduce((a,r)=>a+Number(r.rating||0),0)/reviews.length;
      if($('#averageRating'))$('#averageRating').textContent=avg.toFixed(1);
    }catch(_){}
  }
  updateReviewSummary();
  const reviewForm=$('#reviewForm'); reviewForm?.addEventListener('submit',()=>setTimeout(updateReviewSummary,50));

  // close modal when clicking CTA inside case
  $$('.case-content a[href="#project"]').forEach(a=>a.addEventListener('click',closeCase));

  // theme persistence (works with the original theme button)
  const savedTheme=localStorage.getItem('nexa_theme');
  if(savedTheme){root.setAttribute('data-theme',savedTheme);root.classList.toggle('dark',savedTheme==='dark')}
  $('#themeToggle')?.addEventListener('click',()=>setTimeout(()=>{
    const theme=root.getAttribute('data-theme')||'light';localStorage.setItem('nexa_theme',theme);
  },30));
})();
