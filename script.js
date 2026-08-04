document.addEventListener('DOMContentLoaded', () => {
    const themeToggleBtn = document.getElementById('themeToggle');
    const htmlElement = document.documentElement;

    // جعل الوضع النهاري (light) هو الافتراضي
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);

    // عند الضغط على زر تبديل الثيم
    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
    });

    function setTheme(theme) {
        htmlElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);

        // تغيير أيقونة الزر
        const icon = themeToggleBtn.querySelector('i');
        if (theme === 'light') {
            icon.className = 'fas fa-moon'; // أظهِر أيقونة القمر للتحويل للوضع الليلي
        } else {
            icon.className = 'fas fa-sun'; // أظهِر أيقونة الشمس للتحويل للوضع النهاري
        }
    }

    // التمرير السلس للروابط
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            if (targetId !== '#') {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });
});
