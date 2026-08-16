const STORAGE = {
    auth: "nexa_admin_auth",
    content: "nexa_admin_content",
    portfolio: "nexa_admin_portfolio",
    messages: "nexa_admin_messages",
    theme: "nexa_admin_theme"
};

// ============================================================
// مهم: هذه المصادقة واجهة تجريبية فقط.
// لا تضع كلمة مرور حقيقية هنا في موقع عام.
// للمصادقة الحقيقية يجب استخدام Backend + جلسات/توكنات.
// ============================================================
const DEMO_USERNAME = "admin";
const DEMO_PASSWORD = "NEXA-CHANGE-ME";

const defaultContent = {
    title: "NEXA Creative",
    description: "حلول إبداعية متكاملة في التصميم الجرافيكي والهوية البصرية.",
    phone: "+905364391849",
    email: "magdalhamdo176@gmail.com",
    whatsapp: "https://wa.me/905364391849",
    instagram: ""
};

const $ = (id) => document.getElementById(id);

function getData(key, fallback) {
    try {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : fallback;
    } catch {
        return fallback;
    }
}

function setData(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

function showToast(message) {
    const toast = $("toast");
    toast.textContent = message;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2200);
}

function updateStats() {
    $("portfolioCount").textContent = getData(STORAGE.portfolio, []).length;
    $("messagesCount").textContent = getData(STORAGE.messages, []).length;
    $("visitsCount").textContent = "—";
}

function loadContent() {
    const content = { ...defaultContent, ...getData(STORAGE.content, {}) };
    $("siteTitle").value = content.title;
    $("siteDescription").value = content.description;
    $("phone").value = content.phone;
    $("email").value = content.email;
    $("whatsapp").value = content.whatsapp;
    $("instagram").value = content.instagram;
}

function saveContent() {
    setData(STORAGE.content, {
        title: $("siteTitle").value.trim(),
        description: $("siteDescription").value.trim(),
        phone: $("phone").value.trim(),
        email: $("email").value.trim(),
        whatsapp: $("whatsapp").value.trim(),
        instagram: $("instagram").value.trim()
    });
    showToast("تم حفظ التغييرات");
}

function renderPortfolio() {
    const list = $("portfolioList");
    const items = getData(STORAGE.portfolio, []);

    if (!items.length) {
        list.innerHTML = '<div class="message-item"><span>لا توجد أعمال حالياً.</span></div>';
        updateStats();
        return;
    }

    list.innerHTML = items.map((item, index) => `
        <div class="portfolio-item">
            <div class="project-info">
                ${item.image ? `<img class="project-thumb" src="${escapeHtml(item.image)}" alt="">` : '<div class="project-thumb"></div>'}
                <div>
                    <strong>${escapeHtml(item.name)}</strong>
                    <div style="color:var(--muted);font-size:12px">${escapeHtml(item.category)}</div>
                </div>
            </div>
            <button class="delete-btn" data-delete-project="${index}">حذف</button>
        </div>
    `).join("");

    list.querySelectorAll("[data-delete-project]").forEach(btn => {
        btn.addEventListener("click", () => {
            const items = getData(STORAGE.portfolio, []);
            items.splice(Number(btn.dataset.deleteProject), 1);
            setData(STORAGE.portfolio, items);
            renderPortfolio();
            showToast("تم حذف العمل");
        });
    });

    updateStats();
}

function renderMessages() {
    const list = $("messagesList");
    const items = getData(STORAGE.messages, []);

    if (!items.length) {
        list.innerHTML = '<div class="message-item"><span>لا توجد رسائل حالياً.</span></div>';
        updateStats();
        return;
    }

    list.innerHTML = items.map((item, index) => `
        <div class="message-item">
            <div>
                <strong>${escapeHtml(item.name || "زائر")}</strong>
                <div style="color:var(--muted);font-size:13px">${escapeHtml(item.message || "")}</div>
                <small style="color:var(--muted)">${escapeHtml(item.date || "")}</small>
            </div>
            <button class="delete-btn" data-delete-message="${index}">حذف</button>
        </div>
    `).join("");

    list.querySelectorAll("[data-delete-message]").forEach(btn => {
        btn.addEventListener("click", () => {
            const items = getData(STORAGE.messages, []);
            items.splice(Number(btn.dataset.deleteMessage), 1);
            setData(STORAGE.messages, items);
            renderMessages();
            showToast("تم حذف الرسالة");
        });
    });

    updateStats();
}

function escapeHtml(value) {
    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function openModal() {
    $("portfolioModal").classList.remove("hidden");
    $("projectName").focus();
}

function closeModal() {
    $("portfolioModal").classList.add("hidden");
    $("projectName").value = "";
    $("projectImage").value = "";
    $("projectCategory").value = "";
}

function saveProject() {
    const name = $("projectName").value.trim();
    const image = $("projectImage").value.trim();
    const category = $("projectCategory").value.trim() || "Graphic Design";

    if (!name) {
        showToast("اكتب اسم العمل أولاً");
        return;
    }

    const items = getData(STORAGE.portfolio, []);
    items.push({ name, image, category });
    setData(STORAGE.portfolio, items);

    closeModal();
    renderPortfolio();
    showToast("تمت إضافة العمل");
}

function switchSection(sectionId) {
    document.querySelectorAll(".section").forEach(s => s.classList.remove("active-section"));
    document.querySelectorAll(".nav-item").forEach(b => b.classList.remove("active"));

    const section = $(sectionId);
    if (section) section.classList.add("active-section");

    const button = document.querySelector(`[data-section="${sectionId}"]`);
    if (button) button.classList.add("active");

    const titles = {
        overview: "الرئيسية",
        content: "محتوى الموقع",
        portfolio: "معرض الأعمال",
        messages: "الرسائل",
        settings: "الإعدادات"
    };

    $("sectionTitle").textContent = titles[sectionId] || "لوحة التحكم";
}

function showDashboard() {
    $("loginScreen").classList.add("hidden");
    $("dashboard").classList.remove("hidden");
    loadContent();
    renderPortfolio();
    renderMessages();
    updateStats();
}

function logout() {
    sessionStorage.removeItem(STORAGE.auth);
    $("dashboard").classList.add("hidden");
    $("loginScreen").classList.remove("hidden");
    $("password").value = "";
}

$("loginForm").addEventListener("submit", (event) => {
    event.preventDefault();

    const username = $("username").value.trim();
    const password = $("password").value;

    if (username === DEMO_USERNAME && password === DEMO_PASSWORD) {
        sessionStorage.setItem(STORAGE.auth, "1");
        $("loginError").textContent = "";
        showDashboard();
    } else {
        $("loginError").textContent = "بيانات الدخول غير صحيحة.";
    }
});

document.querySelectorAll(".nav-item").forEach(button => {
    button.addEventListener("click", () => switchSection(button.dataset.section));
});

$("saveContent").addEventListener("click", saveContent);
$("addPortfolio").addEventListener("click", openModal);
$("closeModal").addEventListener("click", closeModal);
$("saveProject").addEventListener("click", saveProject);
$("logoutBtn").addEventListener("click", logout);

$("clearMessages").addEventListener("click", () => {
    if (!confirm("هل تريد حذف جميع الرسائل؟")) return;
    setData(STORAGE.messages, []);
    renderMessages();
    showToast("تم حذف الرسائل");
});

$("themeBtn").addEventListener("click", () => {
    document.body.classList.toggle("dark");
    localStorage.setItem(STORAGE.theme, document.body.classList.contains("dark") ? "dark" : "light");
});

$("clearData").addEventListener("click", () => {
    if (!confirm("سيتم حذف بيانات لوحة التحكم المحلية. هل أنت متأكد؟")) return;

    [STORAGE.content, STORAGE.portfolio, STORAGE.messages].forEach(key => localStorage.removeItem(key));
    loadContent();
    renderPortfolio();
    renderMessages();
    showToast("تم مسح البيانات المحلية");
});

$("portfolioModal").addEventListener("click", (event) => {
    if (event.target === $("portfolioModal")) closeModal();
});

if (localStorage.getItem(STORAGE.theme) === "dark") {
    document.body.classList.add("dark");
}

if (sessionStorage.getItem(STORAGE.auth) === "1") {
    showDashboard();
}
