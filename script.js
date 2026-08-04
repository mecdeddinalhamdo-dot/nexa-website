// ⚡ رقم الواتساب الخاص بك لإستقبال الطلبات (يمكنك تغييره لاحقاً)
const WHATSAPP_NUMBER = "905000000000"; 

// 1. نظام الترجمات اللغوية (AR / EN / TR)
const translations = {
    ar: {
        nav: { services: "خدماتنا", about: "من نحن", portfolio: "أعمالنا", contact: "تواصل معنا" },
        hero: { badge: "✨ حلول إبداعية متكاملة", title: "نصنع <span>التأثير والتألق</span> لعلامتك التجارية", desc: "نساعدك على النمو والتوسع بأساليب تسويقية وتصاميم حديثة ومبتكرة تناسب تطلعاتك." },
        services: {
            title: "ماذا نقدم لك؟", subtitle: "خدمات متكاملة مصممة لنقل مشروعك لمستوى آخر",
            s1_title: "التصميم والهوية البصرية", s1_desc: "بناء هوية بصرية كاملة وشعارات احترافية تعبر عن قيمة وهدف عملك.",
            s2_title: "التسويق الرقمي", s2_desc: "حملات إعلانية مدروسة وإدارة حسابات التواصل لزيادة المبيعات والانتشار.",
            s3_title: "تطوير المواقع والتطبيقات", s3_desc: "تطوير مواقع إلكترونية سريعة ومتجاوبة مع كافة الشاشات وأحدث التقنيات."
        },
        about: {
            title: "عن <span>NEXA</span>", desc: "نحن فريق متكامل من المصممين والمطورين والمُسوقين الشغوفين بتحويل الأفكار إلى واقع رقمي متميز وبناء شراكات نجاح طويلة الأمد.",
            projects: "مشروع مكتمل", clients: "عميل سعيد", quality: "جودة جرافيك"
        },
        portfolio: {
            title: "معرض أعمالنا", subtitle: "نظرة على بعض مشاريعنا والتصاميم المبتكرة",
            zoom: "تكبير التصميم", order_btn: "اطلب مثل هذا"
        },
        modal: {
            order_this: "اطلب تصميم مشابه الآن", order_title: "طلب تصميم سريع",
            name_label: "الاسم الكريم:", details_label: "تفاصيل إضافية (اختياري):", send_btn: "إرسال الطلب عبر الواتساب"
        },
        footer: { desc: "حلول إبداعية وعصرية ترفع علامتك التجارية لأعلى النجوم.", quick_links: "روابط سريعة", social: "تابعنا" }
    },
    en: {
        nav: { services: "Services", about: "About Us", portfolio: "Portfolio", contact: "Contact Us" },
        hero: { badge: "✨ Integrated Creative Solutions", title: "We Create <span>Impact & Brilliance</span> For Your Brand", desc: "Helping you grow and scale with modern, innovative design and marketing strategies." },
        services: {
            title: "What We Offer?", subtitle: "Integrated services crafted to elevate your business",
            s1_title: "Branding & Design", s1_desc: "Complete visual identities and professional logos representing your values.",
            s2_title: "Digital Marketing", s2_desc: "Targeted campaigns and social media management to boost sales.",
            s3_title: "Web & App Development", s3_desc: "Fast, modern, and responsive websites built with cutting-edge tech."
        },
        about: {
            title: "About <span>NEXA</span>", desc: "We are a passionate team of designers, developers, and marketers turning ideas into digital excellence.",
            projects: "Completed Projects", clients: "Happy Clients", quality: "Graphic Quality"
        },
        portfolio: {
            title: "Our Portfolio", subtitle: "A glance at our recent innovative work",
            zoom: "Zoom Image", order_btn: "Order Similar"
        },
        modal: {
            order_this: "Order Similar Design Now", order_title: "Quick Order",
            name_label: "Your Name:", details_label: "Additional Details (Optional):", send_btn: "Send Order via WhatsApp"
        },
        footer: { desc: "Creative solutions that elevate your brand to the stars.", quick_links: "Quick Links", social: "Follow Us" }
    },
    tr: {
        nav: { services: "Hizmetlerimiz", about: "Hakkımızda", portfolio: "Portföy", contact: "İletişim" },
        hero: { badge: "✨ Entegre Yaratıcı Çözümler", title: "Markanız İçin <span>Etki ve Etkileyicilik</span> Yaratıyoruz", desc: "Modern tasarım ve pazarlama stratejileri ile büyümenize yardımcı oluyoruz." },
        services: {
            title: "Neler Sunuyoruz?", subtitle: "İşinizi bir üst seviyeye taşımak için tasarlanmış çözümler",
            s1_title: "Tasarım ve Markalaşma", s1_desc: "Eşsiz kurumsal kimlik ve profesyonel logo tasarımları.",
            s2_title: "Dijital Pazarlama", s2_desc: "Satışlarınızı artıracak hedefli sosyal medya kampanyaları.",
            s3_title: "Web ve Uygulama Geliştirme", s3_desc: "En son teknolojilerle oluşturulmuş hızlı ve duyarlı web siteleri."
        },
        about: {
            title: "<span>NEXA</span> Hakkında", desc: "Fikirleri dijital mükemmelliğe dönüştüren tutkulu bir tasarımcı ve geliştirici ekibiyiz.",
            projects: "Tamamlanan Proje", clients: "Mutlu Müşteri", quality: "Grafik Kalitesi"
        },
        portfolio: {
            title: "Portföyümüz", subtitle: "Yenilikçi projelerimize bir bakış",
            zoom: "Resمي Büyüt", order_btn: "Benzerini İsteyin"
        },
        modal: {
            order_this: "Şimdi Benzer Tasarım İsteyin", order_title: "Hızlı Sipariş",
            name_label: "Adınız:", details_label: "Ek Detaylar (İsteğe bağlı):", send_btn: "WhatsApp ile Sipariş Gönder"
        },
        footer: { desc: "Markanızı yıldızlara taşıyan yaratıcı çözümler.", quick_links: "Hızlı Bağlantılar", social: "Takip Edin" }
    }
};

let currentSelectedProject = "";

// 2. ميزة 3: شريط تقدم التصفح البنفسجي
window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    document.getElementById("scrollProgressBar").style.width = scrolled + "%";
});

// 3. ميزة 1 + 2: التحكم بالنوافذ الزجاجية المكبرة والطلب السريع
function openLightbox(imgUrl, title) {
    currentSelectedProject = title;
    document.getElementById('modalImg').src = imgUrl;
    document.getElementById('modalTitle').textContent = title;
    
    document.getElementById('lightboxView').style.display = 'block';
    document.getElementById('orderView').style.display = 'none';
    
    document.getElementById('glassModal').classList.add('active');
}

function openOrderModal(title) {
    currentSelectedProject = title;
    document.getElementById('orderProjectName').textContent = "📌 المشروع المطلوبة: " + title;
    
    document.getElementById('lightboxView').style.display = 'none';
    document.getElementById('orderView').style.display = 'block';
    
    document.getElementById('glassModal').classList.add('active');
}

function switchToOrderView() {
    openOrderModal(currentSelectedProject);
}

function closeGlassModal() {
    document.getElementById('glassModal').classList.remove('active');
}

// إغلاق النافذة عند الضغط خارجها
document.getElementById('glassModal').addEventListener('click', (e) => {
    if (e.target.id === 'glassModal') {
        closeGlassModal();
    }
});

// إرسال الطلب المباشر عبر الواتساب
function sendWhatsAppOrder(e) {
    e.preventDefault();
    const name = document.getElementById('custName').value.trim();
    const details = document.getElementById('custDetails').value.trim();
    
    let msg = `مرحباً NEXA 👋\n`;
    msg += `أريد طلب تصميم شبيه بمشروع: *${currentSelectedProject}*\n`;
    msg += `👤 الاسم: ${name}\n`;
    if(details) {
        msg += `📝 تفاصيل إضافية: ${details}\n`;
    }

    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
    window.open(whatsappUrl, '_blank');
    closeGlassModal();
}

// 4. تغيير اللغة ديناميكياً
document.getElementById('langSelect').addEventListener('change', (e) => {
    const lang = e.target.value;
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const keys = el.getAttribute('data-i18n').split('.');
        let val = translations[lang];
        keys.forEach(k => { if(val) val = val[k]; });
        if(val) el.innerHTML = val;
    });
});

// 5. تبديل وضع الليل والنهار (Dark / Light Mode)
const themeBtn = document.getElementById('themeToggle');
themeBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    themeBtn.innerHTML = newTheme === 'dark' ? '<i class="fa-solid fa-moon"></i>' : '<i class="fa-solid fa-sun"></i>';
});

// 6. تشغيل خلفية الرياح البنفسجية التفاعلية
const canvas = document.getElementById('purpleWindCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

const particles = [];
const particleCount = 45;

for (let i = 0; i < particleCount; i++) {
    particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        length: Math.random() * 80 + 40,
        speed: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.4 + 0.1,
        width: Math.random() * 2 + 0.5
    });
}

function animateWind() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(p => {
        ctx.beginPath();
        const gradient = ctx.createLinearGradient(p.x, p.y, p.x - p.length, p.y + p.length * 0.4);
        gradient.addColorStop(0, `rgba(124, 58, 237, ${p.opacity})`);
        gradient.addColorStop(1, 'rgba(124, 58, 237, 0)');
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = p.width;
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x - p.length, p.y + p.length * 0.4);
        ctx.stroke();
        
        p.x += p.speed * 2;
        p.y -= p.speed * 0.8;
        
        if (p.x > canvas.width + p.length || p.y < -p.length) {
            p.x = -p.length;
            p.y = Math.random() * canvas.height + p.length;
        }
    });
    
    requestAnimationFrame(animateWind);
}
animateWind();
