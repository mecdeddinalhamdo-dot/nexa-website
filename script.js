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

    // --- 4. ترجمات اللغات الشاملة والمتكاملة ---
    const translations = {
        ar: {
            "nav.services": "خدماتنا", 
            "nav.about": "من نحن", 
            "nav.portfolio": "أعمالنا", 
            "nav.pricing": "الأسعار", 
            "nav.faq": "الأسئلة", 
            "nav.contact": "تواصل معنا",
            "hero.badge": "✨ حلول إبداعية متكاملة",
            "hero.title": "نصنع التأثير والتألق لعلامتك التجارية",
            "hero.desc": "نساعدك على النمو والتوسع بأساليب تسويقية وتصاميم حديثة ومبتكرة تناسب تطلعاتك.",
            "services.title": "ماذا نقدم لك؟",
            "services.subtitle": "خدمات متكاملة مصممة لنقل مشروعك لمستوى آخر",
            "services.s1_title": "التصميم والهوية البصرية",
            "services.s1_desc": "بناء هوية بصرية كاملة وشعارات احترافية تعبر عن قيمة وهدف عملك.",
            "services.s2_title": "التسويق الرقمي",
            "services.s2_desc": "حملات إعلانية مدروسة وإدارة حسابات التواصل لزيادة المبيعات والانتشار.",
            "services.s3_title": "تطوير المواقع والتطبيقات",
            "services.s3_desc": "تطوير مواقع إلكترونية سريعة ومتجاوبة مع كافة الشاشات وأحدث التقنيات.",
            "portfolio.title": "معرض أعمالنا",
            "portfolio.subtitle": "نظرة على بعض مشاريعنا والتصاميم المبتكرة",
            "portfolio.zoom": "تكبير التصميم",
            "portfolio.order_btn": "اطلب مثل هذا",
            "calc.title": "حاسبة التكلفة التقديرية",
            "calc.subtitle": "حدد الخدمات التي تحتاجها لتعرف التكلفة المتوقعة لمشروعك",
            "calc.logo": "تصميم شعار احترافي ($50)",
            "calc.identity": "هوية بصرية كاملة ($150)",
            "calc.social": "إدارة منصات التواصل (شهرياً - $100)",
            "calc.web": "تطوير موقع تعريفي ($300)",
            "calc.total_text": "التكلفة الإجمالية التقديرية:",
            "calc.order_btn": "اطلب هذه الحزمة الآن",
            "testimonials.title": "ماذا يقول عملاؤنا؟",
            "testimonials.c1_name": "- شركة الأفق",
            "testimonials.c2_name": "- متجر كريستال",
            "faq.title": "الأسئلة الشائعة",
            "faq.q1": "كم يستغرق تصميم الهوية البصرية؟",
            "faq.a1": "عادة ما يستغرق الأمر من 5 إلى 10 أيام عمل حسب حجم التفاصيل والتعديلات المطلوبة.",
            "faq.q2": "هل تسلمون الملفات المصدرية المفتوحة؟",
            "faq.a2": "نعم بالتأكيد! نقوم بتسليم كافة الملفات بصيغ (AI, PSD, PDF, PNG) لتتمكن من استخدامها بسهولة.",
            "footer.desc": "حلول إبداعية وعصرية ترفع علامتك التجارية لأعلى النجوم.",
            "modal.order_this": "اطلب تصميم مشابه الآن",
            "modal.order_title": "طلب تصميم سريع",
            "modal.name_label": "الاسم الكريم:",
            "modal.details_label": "تفاصيل إضافية (اختياري):",
            "modal.send_btn": "إرسال الطلب عبر الواتساب"
        },
        en: {
            "nav.services": "Services", 
            "nav.about": "About", 
            "nav.portfolio": "Portfolio", 
            "nav.pricing": "Pricing", 
            "nav.faq": "FAQ", 
            "nav.contact": "Contact Us",
            "hero.badge": "✨ Integrated Creative Solutions",
            "hero.title": "We Create Impact and Brilliance for Your Brand",
            "hero.desc": "We help you grow and expand with modern, innovative marketing methods and designs tailored to your aspirations.",
            "services.title": "What We Offer",
            "services.subtitle": "Integrated services designed to take your project to the next level",
            "services.s1_title": "Design & Visual Identity",
            "services.s1_desc": "Building a complete visual identity and professional logos expressing your business value.",
            "services.s2_title": "Digital Marketing",
            "services.s2_desc": "Well-studied advertising campaigns and social media management to boost sales.",
            "services.s3_title": "Web & App Development",
            "services.s3_desc": "Developing fast, responsive websites and applications using modern technologies.",
            "portfolio.title": "Our Portfolio",
            "portfolio.subtitle": "A glimpse of our projects and innovative designs",
            "portfolio.zoom": "Zoom Design",
            "portfolio.order_btn": "Order Similar",
            "calc.title": "Estimated Cost Calculator",
            "calc.subtitle": "Select the services you need to estimate your project cost",
            "calc.logo": "Professional Logo Design ($50)",
            "calc.identity": "Complete Visual Identity ($150)",
            "calc.social": "Social Media Management (Monthly - $100)",
            "calc.web": "Introductory Website Development ($300)",
            "calc.total_text": "Estimated Total Cost:",
            "calc.order_btn": "Order This Package Now",
            "testimonials.title": "What Our Clients Say",
            "testimonials.c1_name": "- Al-Aفق Company",
            "testimonials.c2_name": "- Crystal Store",
            "faq.title": "Frequently Asked Questions",
            "faq.q1": "How long does visual identity design take?",
            "faq.a1": "It usually takes 5 to 10 working days depending on details and requested revisions.",
            "faq.q2": "Do you deliver open source files?",
            "faq.a2": "Yes, absolutely! We deliver all files in formats (AI, PSD, PDF, PNG) for easy use.",
            "footer.desc": "Creative and modern solutions to elevate your brand to the stars.",
            "modal.order_this": "Order Similar Design Now",
            "modal.order_title": "Quick Design Request",
            "modal.name_label": "Your Name:",
            "modal.details_label": "Additional Details (Optional):",
            "modal.send_btn": "Send Request via WhatsApp"
        },
        tr: {
            "nav.services": "Hizmetlerimiz", 
            "nav.about": "Hakkımızda", 
            "nav.portfolio": "Projelerimiz", 
            "nav.pricing": "Fiyatlar", 
            "nav.faq": "SSS", 
            "nav.contact": "İletişim",
            "hero.badge": "✨ Entegre Yaratıcı Çözümler",
            "hero.title": "Markanız İçin Etki ve Parlaklık Yaratıyoruz",
            "hero.desc": "Hedeflerinize uygun modern ve yenilikçi pazarlama yöntemleri ve tasarımlarla büyümenize yardımcı oluyoruz.",
            "services.title": "Ne Sunuyoruz?",
            "services.subtitle": "Projenizi bir üst seviyeye taşımak için tasarlanmış entegre hizmetler",
            "services.s1_title": "Tasarım ve Görsel Kimlik",
            "services.s1_desc": "İş değerinizi yansıtan eksiksiz bir görsel kimlik ve profesyonel logolar oluşturma.",
            "services.s2_title": "Dijital Pazarlama",
            "services.s2_desc": "Satışları artırmak için iyi planlanmış reklam kampanyaları ve sosyal medya yönetimi.",
            "services.s3_title": "Web ve Uygulama Geliştirme",
            "services.s3_desc": "Modern teknolojileri kullanarak hızlı ve duyarlı web siteleri geliştirme.",
            "portfolio.title": "Portföyümüz",
            "portfolio.subtitle": "Projelerimizden ve yenilikçi tasarımlarımızdan bir kesit",
            "portfolio.zoom": "Tasarımı Büyüt",
            "portfolio.order_btn": "Benzerini Sipariş Et",
            "calc.title": "Tahmini Maliyet Hesaplayıcı",
            "calc.subtitle": "Projenizin maliyetini öğrenmek için ihtiyacınız olan hizmetleri seçin",
            "calc.logo": "Profesyonel Logo Tasarımı ($50)",
            "calc.identity": "Komple Görsel Kimlik ($150)",
            "calc.social": "Sosyal Medya Yönetimi (Aylık - $100)",
            "calc.web": "Tanıtım Web Sitesi Geliştirme ($300)",
            "calc.total_text": "Tahmini Toplam Maliyet:",
            "calc.order_btn": "Bu Paketi Hemen Sipariş Et",
            "testimonials.title": "Müşterilerimiz Ne Diyor?",
            "testimonials.c1_name": "- Al-Ufuq Şirketi",
            "testimonials.c2_name": "- Kristal Mağazası",
            "faq.title": "Sıkça Sorulan Sorular",
            "faq.q1": "Görsel kimlik tasarımı ne kadar sürer?",
            "faq.a1": "Detaylara ve istenen revizyonlara bağlı olarak genellikle 5 ila 10 iş günü sürer.",
            "faq.q2": "Açık kaynaklı dosyaları teslim ediyor musunuz?",
            "faq.a2": "Evet kesinlikle! Kolayca kullanabilmeniz için tüm dosyaları (AI, PSD, PDF, PNG) formatlarında teslim ediyoruz.",
            "footer.desc": "Markanızı zirveye taşıyacak yaratıcı ve modern çözümler.",
            "modal.order_this": "Şimdi Benzer Tasarım Sipariş Et",
            "modal.order_title": "Hızlı Tasarım Talebi",
            "modal.name_label": "Adınız:",
            "modal.details_label": "Ek Detaylar (İsteğe bağlı):",
            "modal.send_btn": "WhatsApp ile Talep Gönder"
        }
    };

    const langSelect = document.getElementById('langSelect');
    if (langSelect) {
        langSelect.addEventListener('change', (e) => {
            const lang = e.target.value;
            document.documentElement.lang = lang;
            document.documentElement.dir = (lang === 'ar') ? 'rtl' : 'ltr';
            
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
        
        const phoneNumber = "905000000000"; 
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

    // --- 9. تأثير 3D Hover لمعرض الأعمال ---
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

    // --- 10. أداة توليد لوحة الألوان الذكية ---
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

                
