function initReveal() {
    const items = document.querySelectorAll('.reveal');
    if (!items.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    items.forEach((item) => observer.observe(item));
}

function initParticles(canvasId = 'particles-bg') {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const reduceMotion = false;
    let w, h, particles = [];

    function resize() {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
    }
    resize();

    const count = window.innerWidth < 700 ? 35 : 70;
    for (let i = 0; i < count; i++) {
        particles.push({
            x: Math.random() * w,
            y: Math.random() * h,
            r: Math.random() * 1.6 + 0.4,
            vy: Math.random() * 0.25 + 0.05,
            color: Math.random() > 0.5 ? '99,102,241' : '34,211,238'
        });
    }

    function draw() {
        ctx.clearRect(0, 0, w, h);
        particles.forEach((p) => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${p.color},0.5)`;
            ctx.fill();
            if (!reduceMotion) {
                p.y -= p.vy;
                if (p.y < 0) p.y = h;
            }
        });
        requestAnimationFrame(draw);
    }
    draw();

    window.addEventListener('resize', resize);
}

const COIN_IDS = ['bitcoin', 'ethereum', 'solana', 'binancecoin', 'ripple', 'cardano', 'dogecoin', 'tether', 'usd-coin', 'tron', 'avalanche-2', 'polkadot'];

async function fetchLivePrices() {
    const ids = COIN_IDS.join(',');
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`;

    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error('Error de red al pedir precios');
        const data = await res.json();
        updatePriceElements(data);
    } catch (err) {
        console.warn('No se pudieron traer precios en vivo:', err);
    }
}

function updatePriceElements(data) {
    Object.keys(data).forEach((id) => {
        const priceEl = document.querySelector(`[data-coin-price="${id}"]`);
        const changeEl = document.querySelector(`[data-coin-change="${id}"]`);
        const price = data[id].usd;
        const change = data[id].usd_24h_change;

        if (priceEl) {
            priceEl.textContent = price >= 1
                ? `$${price.toLocaleString('en-US', { maximumFractionDigits: 2 })}`
                : `$${price.toFixed(4)}`;
        }
        if (changeEl && typeof change === 'number') {
            const up = change >= 0;
            changeEl.textContent = `${up ? '▲' : '▼'} ${Math.abs(change).toFixed(2)}%`;
            changeEl.classList.remove('up', 'down');
            changeEl.classList.add(up ? 'up' : 'down');
        }
    });
}

function initLivePrices(refreshSeconds = 30) {
    if (!document.querySelector('[data-coin-price]')) return;
    fetchLivePrices();
    setInterval(fetchLivePrices, refreshSeconds * 1000);
}

function createCoin3D(containerId, opts = {}) {
    const container = document.getElementById(containerId);
    if (!container || typeof THREE === 'undefined') return;

    const color = opts.color ?? 0xf7931a;
    const letter = opts.letter ?? 'B';
    const interactive = opts.interactive ?? true;
    const size = opts.size ?? 1;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const keyLight = new THREE.PointLight(0xffffff, 1.8, 20);
    keyLight.position.set(3, 3, 4);
    scene.add(keyLight);
    const rimLight = new THREE.PointLight(0xffffff, 1.2, 20);
    rimLight.position.set(-3, -2, 3);
    scene.add(rimLight);

    function createFaceTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');
        const cx = 256, cy = 256;

        ctx.fillStyle = `#${color.toString(16).padStart(6, '0')}`;
        ctx.beginPath();
        ctx.arc(cx, cy, 256, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = 'rgba(255,255,255,0.5)';
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.arc(cx, cy, 236, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 220px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(letter, cx, cy + 20);

        return new THREE.CanvasTexture(canvas);
    }

    const faceTexture = createFaceTexture();
    const sideMaterial = new THREE.MeshStandardMaterial({ color, metalness: 0.85, roughness: 0.25 });
    const faceMaterial = new THREE.MeshStandardMaterial({ map: faceTexture, metalness: 0.15, roughness: 0.55 });

    const geometry = new THREE.CylinderGeometry(1.4 * size, 1.4 * size, 0.3 * size, 64, 1, false);
    const coin = new THREE.Mesh(geometry, [sideMaterial, faceMaterial, faceMaterial]);
    coin.rotation.x = Math.PI / 2;
    scene.add(coin);

    const ringGeometry = new THREE.TorusGeometry(1.45 * size, 0.02, 16, 80);
    const ringMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 1, roughness: 0.15 });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    scene.add(ring);

    let mouseX = 0;
    if (interactive) {
        container.addEventListener('mousemove', (e) => {
            const rect = container.getBoundingClientRect();
            mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
        });
    }

    function animate() {
        coin.rotation.z += 0.01;
        ring.rotation.z += 0.01;
        if (interactive) {
            coin.rotation.y += (mouseX * 0.6 - coin.rotation.y) * 0.05;
            ring.rotation.y = coin.rotation.y;
        }
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    }
    animate();

    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initReveal();
    initParticles();
    initLivePrices();
});