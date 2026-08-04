// إزالة شاشة التحميل بعد تحميل الصفحة
window.addEventListener('load', () => {
    setTimeout(() => {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.style.opacity = '0';
            setTimeout(() => {
                overlay.style.display = 'none';
            }, 300);
        }
    }, 1500);
});

// تبديل الوضع الداكن/الفاتح
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

if (themeToggle) {
    const themeIcon = themeToggle.querySelector('i');
    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        if (body.classList.contains('dark-mode')) {
            themeIcon.className = 'fas fa-sun';
        } else {
            themeIcon.className = 'fas fa-moon';
        }
    });
}

// تحديد الأداة النشطة
const toolButtons = document.querySelectorAll('.tool-btn[data-tool]');
toolButtons.forEach(button => {
    button.addEventListener('click', () => {
        toolButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        const tool = button.getAttribute('data-tool');
        console.log(`تم اختيار الأداة: ${tool}`);
    });
});

// التحكم في المنزلقات والأشكال
const opacitySlider = document.getElementById('opacitySlider');
const blurSlider = document.getElementById('blurSlider');
const sizeSlider = document.getElementById('sizeSlider');
const speedSlider = document.getElementById('speedSlider');

const opacityValue = document.getElementById('opacityValue');
const blurValue = document.getElementById('blurValue');
const sizeValue = document.getElementById('sizeValue');
const speedValue = document.getElementById('speedValue');

const designShapes = document.querySelectorAll('.design-shape');
const designElement = document.getElementById('designElement');

if (opacitySlider && opacityValue) {
    opacitySlider.addEventListener('input', () => {
        const value = opacitySlider.value;
        opacityValue.textContent = `${value}%`;
        designShapes.forEach(shape => {
            shape.style.opacity = value / 100;
        });
    });
}

if (blurSlider && blurValue) {
    blurSlider.addEventListener('input', () => {
        const value = blurSlider.value;
        blurValue.textContent = `${value}px`;
        designShapes.forEach(shape => {
            shape.style.filter = `blur(${value}px)`;
        });
    });
}

if (sizeSlider && sizeValue) {
    sizeSlider.addEventListener('input', () => {
        const value = sizeSlider.value;
        sizeValue.textContent = `${value}%`;
        if (designElement) {
            designElement.style.transform = `scale(${value / 100})`;
        }
    });
}

if (speedSlider && speedValue) {
    speedSlider.addEventListener('input', () => {
        const value = speedSlider.value;
        speedValue.textContent = `${value}s`;
        designShapes.forEach(shape => {
            shape.style.animationDuration = `${value}s`;
        });
    });
}

