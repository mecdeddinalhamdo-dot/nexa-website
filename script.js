// --- 1. تأثير الرياح البنفسجية المتحركة في الخلفية ---
const canvas = document.getElementById('purpleWindCanvas');
const ctx = canvas.getContext('2d');

let width, height;
let particles = [];

function resizeCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class WindParticle {
    constructor() {
        this.reset();
    }
    reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.length = Math.random() * 120 + 40;
        this.speed = Math.random() * 2 + 1;
        this.opacity = Math.random() * 0.4 + 0.1;
        this.angle = Math.PI / 6; // ميلان الخطوط
    }
    update() {
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
        if (this.x > width + 100 || this.y > height + 100) {
            this.x = -100;
            this.y = Math.random() * height - 200;
        }
    }
    draw() {
        ctx.strokeStyle = document.documentElement.getAttribute('data-theme') === 'light' 
            ? `rgba(124, 58, 237, ${this.opacity * 0.5})` 
            : `rgba(124, 58, 237, ${this.opacity})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x - Math.cos(this.angle) * this.length, this.y - Math.sin(this.angle) * this.length);
        ctx.stroke();
    }
}

for (let i = 0; i < 35; i++) {
    particles.push(new WindParticle());
}

function animateParticles() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    requestAnimationFrame(animateParticles);
}
animateParticles();

// --- 2. مؤشر شريط التمرير العلوي ---
window.addEventListener('scroll', () => {
    const winScroll = document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    document.getElementById('scrollProgressBar').style.width = scrolled + '%';
});

// --- 3. نظام الوضع الليلي والنهاري ---
const themeToggle = document.getElementById('themeToggle');
const htmlEl = document.documentElement;

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

// --- 4. ترجمات اللغات (عربي، إنجليزي، تركي) ---
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
        "beforeAfter.title": "نصنع الفارق",
        "beforeAfter.subtitle": "اسحب الشريط لترى كيف نطور العلامات التجارية (قبل وبعد)",
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
        "hero.title": "We Create Impact & Shine For Your Brand",
        "hero.desc": "Helping you grow and expand with modern marketing strategies and innovative designs.",
        "services.title": "What We Offer?",
        "services.subtitle": "Comprehensive services designed to take your project to the next level",
        "services.s1_title": "Design & Brand Identity",
        "services.s1_desc": "Building a complete brand identity and professional logos reflecting your business value.",
        "services.s2_title": "Digital Marketing",
        "services.s2_desc": "Targeted ad campaigns and social media management to increase sales and reach.",
        "services.s3_title": "Web & App Development",
        "services.s3_desc": "Developing fast, responsive websites with the latest cutting-edge technologies.",
        "beforeAfter.title": "We Make a Difference",
        "beforeAfter.subtitle": "Drag the slider to see how we upgrade brands (Before & After)",
        "portfolio.title": "Our Portfolio",
        "portfolio.subtitle": "A glimpse into our projects and innovative designs",
        "portfolio.zoom": "Zoom Design",
        "portfolio.order_btn": "Order Similar",
        "calc.title": "Estimated Cost Calculator",
        "calc.subtitle": "Select the services you need to know the expected project cost",
        "calc.logo": "Professional Logo Design ($50)",
        "calc.identity": "Full Brand Identity ($150)",
        "calc.social": "Social Media Management (Monthly - $100)",
        "calc.web": "Landing Page Development ($300)",
        "calc.total_text": "Estimated Total Cost:",
        "calc.order_btn": "Order This Package Now",
        "testimonials.title": "What Our Clients Say",
        "testimonials.c1_name": "- Al-Afaq Company",
        "testimonials.c2_name": "- Crystal Store",
        "faq.title": "Frequently Asked Questions",
        "faq.q1": "How long does brand identity design take?",
        "faq.a1": "Usually takes 5 to 10 business days depending on the scope and required revisions.",
        "faq.q2": "Do you deliver open source master files?",
        "faq.a2": "Yes absolutely! We deliver all source files in formats (AI, PSD, PDF, PNG) for your convenience.",
        "footer.desc": "Modern creative solutions elevating your brand to the highest stars.",
        "modal.order_this": "Order Similar Design Now",
        "modal.order_title": "Quick Design Order",
        "modal.name_label": "Your Name:",
        "modal.details_label": "Additional Details (Optional):",
        "modal.send_btn": "Send Order via WhatsApp"
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
        "hero.desc": "Modern pazarlama stratejileri ve yenilikçi tasarımlarla büyümenize yardımcı oluyoruz.",
        "services.title": "Neler Sunuyoruz?",
        "services.subtitle": "Projenizi bir üst seviyeye taşımak için kapsamlı hizmetler",
        "services.s1_title": "Tasarım ve Marka Kimliği",
        "services.s1_desc": "İşletmenizin değerini yansıtan eksiksiz kimlik ve profesyonel logolar.",
        "services.s2_title": "Dijital Pazarlama",
        "services.s2_desc": "Satışları artırmak için hedefli reklam kampanyaları ve sosyal medya yönetimi.",
        "services.s3_title": "Web ve Uygulama Geliştirme",
        "services.s3_desc": "En son teknolojilerle hızlı ve duyarlı web siteleri geliştirme.",
        "beforeAfter.title": "Fark Yaratıyoruz",
        "beforeAfter.subtitle": "Markaları nasıl geliştirdiğimizi görmek için kaydırıcıyı sürükleyin (Önce & Sonra)",
        "portfolio.title": "Portföyümüz",
        "portfolio.subtitle": "Projelerimizden ve yenilikçi tasarımlarımızdan bir kesit",
        "portfolio.zoom": "Tasarımı Büyüt",
        "portfolio.order_btn": "Benzerini İste",
        "calc.title": "Tahmini Maliyet Hesaplayıcı",
        "calc.subtitle": "Beklenen proje maliyetini öğrenmek için ihtiyacınız olan hizmetleri seçin",
        "calc.logo": "Profesyonel Logo Tasarımı ($50)",
        "calc.identity": "Tam Marka Kimliği ($150)",
        "calc.social": "Sosyal Medya Yönetimi (Aylık - $100)",
        "calc.web": "Tanıtım Sitesi Geliştirme ($300)",
        "calc.total_text": "Tahmini Toplam Maliyet:",
        "calc.order_btn": "Bu Paketi Hemen Sipariş Et",
        "testimonials.title": "Müşterilerimiz Ne Diyor?",
        "testimonials.c1_name": "- Al-Afaq Şirketi",
        "testimonials.c2_name": "- Crystal Mağazası",
        "faq.title": "Sıkça Sorulan Sorular",
        "faq.q1": "Kimlik tasarımı ne kadar sürer?",
        "faq.a1": "Genellikle detaylara ve düzeltmelere bağlı olarak 5-10 iş günü sürer.",
        "faq.q2": "Kaynak dosyalarını teslim ediyor musunuz?",
        "faq.a2": "Evet kesinlikle! Tüm dosyaları (AI, PSD, PDF, PNG) formatlarında teslim ediyoruz.",
        "footer.desc": "Markanızı en yüksek yıldızlara taşıyan modern yaratıcı çözümler.",
        "modal.order_this": "Şimdi Benzer Tasarım Sipariş Et",
        "modal.order_title": "Hızlı Tasarım Siparişi",
        "modal.name_label": "Adınız:",
        "modal.details_label": "Ek Detaylar (İsteğe bağlı):",
        "modal.send_btn": "WhatsApp ile Sipariş Gönder"
    }
};

const langSelect = document.getElementById('langSelect');
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

// --- 5. النافذة المنبثقة (Modal & Lightbox) ---
const glassModal = document.getElementById('glassModal');
const lightboxView = document.getElementById('lightboxView');
const orderView = document.getElementById('orderView');
const modalImg = document.getElementById('modalImg');
const modalTitle = document.getElementById('modalTitle');
const orderProjectName = document.getElementById('orderProjectName');

let currentProject = "";

function openLightbox(imgSrc, title) {
    lightboxView.style.display = 'block';
    orderView.style.display = 'none';
    modalImg.src = imgSrc;
    modalTitle.innerText = title;
    currentProject = title;
    glassModal.classList.add('active');
}

function openOrderModal(projectName) {
    lightboxView.style.display = 'none';
    orderView.style.display = 'block';
    currentProject = projectName;
    orderProjectName.innerText = `الخدمة المطلوبة: ${projectName}`;
    glassModal.classList.add('active');
}

function switchToOrderView() {
    lightboxView.style.display = 'none';
    orderView.style.display = 'block';
    orderProjectName.innerText = `الخدمة المطلوبة: ${currentProject}`;
}

function closeGlassModal() {
    glassModal.classList.remove('active');
}

glassModal.addEventListener('click', (e) => {
    if (e.target === glassModal) closeGlassModal();
});

// --- 6. إرسال طلب الواتساب ---
function sendWhatsAppOrder(e) {
    e.preventDefault();
    const name = document.getElementById('custName').value;
    const details = document.getElementById('custDetails').value;
    
    const phoneNumber = "905000000000"; // استبدل برقم الواتساب الخاص بك
    const message = `مرحباً NEXA، أود طلب خدمة: *${currentProject}*%0Aالاسم: ${name}%0Aالتفاصيل: ${details}`;
    
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
    closeGlassModal();
}

// --- 7. ميزة المقارنة (قبل وبعد) ---
const baSlider = document.getElementById('baSlider');
const baBefore = document.getElementById('baBefore');
const baLine = document.getElementById('baSliderLine');
const baBtn = document.getElementById('baSliderBtn');

if(baSlider) {
    baSlider.addEventListener('input', (e) => {
        let sliderVal = e.target.value;
        if (document.documentElement.dir === 'rtl') {
            baBefore.style.clipPath = `polygon(100% 0, ${100-sliderVal}% 0, ${100-sliderVal}% 100%, 100% 100%)`;
            baLine.style.left = `${sliderVal}%`;
            baBtn.style.left = `${sliderVal}%`;
        } else {
            baBefore.style.clipPath = `polygon(0 0, ${sliderVal}% 0, ${sliderVal}% 100%, 0 100%)`;
            baLine.style.left = `${sliderVal}%`;
            baBtn.style.left = `${sliderVal}%`;
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
        
        let start = parseInt(totalPriceEl.innerText);
        animateValue(totalPriceEl, start, currentTotal, 300);
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

function orderFromCalc() {
    if(currentTotal === 0) {
        alert("يرجى تحديد خدمة واحدة على الأقل!");
        return;
    }
    openOrderModal(`حزمة مخصصة بقيمة $${currentTotal}`);
}

// --- 9. الأسئلة الشائعة (Accordion) ---
const faqItems = document.querySelectorAll('.faq-item');
faqItems.forEach(item => {
    item.querySelector('.faq-question').addEventListener('click', () => {
        faqItems.forEach(i => { if(i !== item) i.classList.remove('active'); });
        item.classList.toggle('active');
    });
});

// --- 10. تأثير 3D Hover لمعرض الأعمال ---
const tiltCards = document.querySelectorAll('.tilt-card');
tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * -10;
        const rotateY = ((x - centerX) / centerX) * 10;
        
        card.querySelector('.portfolio-img').style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.querySelector('.portfolio-img').style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    });
});
        
