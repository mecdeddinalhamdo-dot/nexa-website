// --- 1. تأثير خلفية الجرافيك والتصميم المتحركة ---
const canvas = document.getElementById('purpleWindCanvas');
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
        this.type = Math.floor(Math.random() * 4); // 0: دائرة, 1: مربع, 2: مسار فيكتور, 3: نقطة تحكم
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
            // رسم دائرة هندسية (تويتر/أشكال)
            ctx.beginPath();
            ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
            ctx.stroke();
        } else if (this.type === 1) {
            // رسم مربع حدودي (مثل حدود التصميم)
            ctx.strokeRect(-this.size / 2, -this.size / 2, this.size, this.size);
        } else if (this.type === 2) {
            // رسم مسار منحنى فيكتور (Vector Path)
            ctx.beginPath();
            ctx.moveTo(-this.size, 0);
            ctx.quadraticCurveTo(0, -this.size, this.size, 0);
            ctx.stroke();
        } else {
            // نقاط تحكم مسار الفيكتور (Anchor Points)
            ctx.fillRect(-4, -4, 8, 8);
            ctx.strokeRect(-this.size / 2, -this.size / 2, this.size, this.size);
        }

        ctx.restore();
    }
}

// إنشاء العناصر الخلفية
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
