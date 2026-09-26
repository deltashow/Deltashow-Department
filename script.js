// 1. Dynamic Background Canvas
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');
let shapes = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Shape {
    constructor() {
        this.reset();
    }
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 14 + 6;
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.speedY = (Math.random() - 0.5) * 0.4;
        this.opacity = Math.random() * 0.2 + 0.05;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
            this.reset();
        }
    }
    draw() {
        ctx.save();
        ctx.fillStyle = `rgba(255, 215, 0, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

function initShapes() {
    shapes = [];
    const count = window.innerWidth < 768 ? 12 : 20;
    for (let i = 0; i < count; i++) {
        shapes.push(new Shape());
    }
}

function animateShapes() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    shapes.forEach(shape => {
        shape.update();
        shape.draw();
    });
    requestAnimationFrame(animateShapes);
}

initShapes();
animateShapes();

// 2. Places Data (الأربعة معارض الأساسية)
const places = [
    {
        id: 1,
        name: "تجمع المطاعم والبراندات بممر جامعة دمياط",
        category: "مولات وفرص تجارية",
        location: "📍 طريق الجامعة - دمياط الجديدة",
        coverImage: "images/بحر ط الجديدة 3.jpeg",
        mapUrl: "https://maps.google.com",
        album: [
            "images/موريا مول 1.jpeg",
            "images/موريا مول 2.jpeg",
            "images/موريا مول 3.jpeg"
        ]
    },
    {
        id: 2,
        name: "معرض صور موريا مول والفرص التجارية",
        category: "مولات وفرص تجارية",
        location: "📍 موريا مول - دمياط الجديدة",
        coverImage: "images/موريا مول 1.jpeg",
        mapUrl: "https://maps.google.com",
        album: [
            "images/موريا مول 1.jpeg",
            "images/موريا مول 2.jpeg",
            "images/موريا مول 3.jpeg"
        ]
    },
    {
        id: 3,
        name: "معرض صور بحر وشاطئ دمياط الجديدة",
        category: "معارض صور ومعالم",
        location: "📍 كورنيش وشاطئ دمياط الجديدة",
        coverImage: "images/بحر ط الجديدة 1.jpeg",
        mapUrl: "https://maps.google.com",
        album: [
            "images/بحر ط الجديدة 1.jpeg",
            "images/بحر ط الجديدة 2.jpeg",
            "images/بحر ط الجديدة 3.jpeg"
        ]
    },
    {
        id: 4,
        name: "معرض صور الحي المتميز والمنطقة التجارية",
        category: "مولات وفرص تجارية",
        location: "📍 الحي المتميز - دمياط الجديدة",
        coverImage: "images/التمميز دمياط الجديدة .jpeg",
        mapUrl: "https://maps.google.com",
        album: [
            "images/موريا مول 1.jpeg",
            "images/موريا مول 2.jpeg",
            "images/موريا مول 3.jpeg"
        ]
    }
];

// Hide Intro Loader on load
document.addEventListener("DOMContentLoaded", () => {
    const loader = document.getElementById("introLoader");
    setTimeout(() => {
        if (loader) {
            loader.style.opacity = "0";
            loader.style.visibility = "hidden";
        }
    }, 1000);

    renderGallery(places);
});

// Render Main Gallery Grid
function renderGallery(items) {
    const gallery = document.getElementById('placeGallery');
    gallery.innerHTML = '';

    if (items.length === 0) {
        gallery.innerHTML = '<p style="grid-column: 1/-1; text-align: center; font-size: 1rem; color: #a0aec0; padding: 30px;">لا توجد نتائج متطابقة.</p>';
        return;
    }

    items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'card';
        card.onclick = () => openModal(item.id);

        card.innerHTML = `
            <div class="card-media">
                <img src="${item.coverImage}" alt="${item.name}" loading="lazy">
                <span class="video-badge"><i class="fa-solid fa-images"></i> معرض موسع</span>
                <div class="play-overlay">
                    <i class="fa-solid fa-eye"></i>
                </div>
            </div>
            <div class="card-body">
                <span class="card-tag">${item.category}</span>
                <h3 class="card-title">${item.name}</h3>
                <div class="card-location">${item.location}</div>
                <button class="btn-view">
                    <i class="fa-solid fa-eye"></i> استعرض المعرض
                </button>
            </div>
        `;
        gallery.appendChild(card);
    });
}

// Open Modal Window
function openModal(id) {
    const place = places.find(p => p.id === id);
    if (!place) return;

    document.getElementById('modalTitle').innerText = place.name;
    document.getElementById('modalLocation').innerText = place.location;

    const playerContainer = document.getElementById('modalPlayerContainer');
    playerContainer.innerHTML = `<img src="${place.coverImage}" alt="${place.name}">`;

    document.getElementById('modalMapBtn').href = place.mapUrl || '#';
    document.getElementById('modalBookBtn').href = `https://wa.me/201515323172?text=أود%20الاستفسار%20عن%20موقع%20${encodeURIComponent(place.name)}`;

    const galleryContainer = document.getElementById('modalGallery');
    galleryContainer.innerHTML = '';

    if (place.album && place.album.length > 0) {
        place.album.forEach(imgUrl => {
            const img = document.createElement('img');
            img.src = imgUrl;
            img.alt = place.name;
            galleryContainer.appendChild(img);
        });
    }

    document.getElementById('mediaModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('mediaModal').style.display = 'none';
}

window.onclick = function(event) {
    const modal = document.getElementById('mediaModal');
    if (event.target === modal) {
        closeModal();
    }
};

// Search & Filter Categories
document.getElementById('searchInput').addEventListener('input', (e) => {
    const text = e.target.value.toLowerCase();
    const filtered = places.filter(p =>
        p.name.toLowerCase().includes(text) || p.location.toLowerCase().includes(text) || p.category.toLowerCase().includes(text)
    );
    renderGallery(filtered);
});

function filterCategory(cat, event) {
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    if (cat === 'all') {
        renderGallery(places);
    } else {
        const filtered = places.filter(p => p.category === cat);
        renderGallery(filtered);
    }
}