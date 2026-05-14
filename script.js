function toggleMenu() {
    const menu = document.querySelector(".menu-links");
    const icon = document.querySelector(".hamburger-icon");
    menu.classList.toggle("open");
    icon.classList.toggle("open");
}

document.addEventListener("DOMContentLoaded", function () {

    // Scroll animations — watches any element with data-animate="…"
    // To animate new content: add data-animate="fade-up|fade-left|fade-right|scale|fade"
    // To stagger siblings:    add data-delay="1"–"6"
    const observer = new IntersectionObserver(
        (entries) => entries.forEach(e => {
            if (e.isIntersecting) e.target.classList.add("in-view");
            else e.target.classList.remove("in-view");
        }),
        { threshold: 0.12 }
    );
    document.querySelectorAll("[data-animate]").forEach(el => observer.observe(el));

    // Nav background on scroll
    const nav = document.getElementById("desktop-nav");
    const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    // Typewriter
    const phrases = [
        "Software Engineer",
        "New Graduate · UofC",
        "Full Stack Developer",
        "Open to Full-Time Roles"
    ];
    let pi = 0, ci = 0, del = false;
    const el = document.getElementById("typed-text");

    function type() {
        const cur = phrases[pi];
        el.textContent = del ? cur.slice(0, --ci) : cur.slice(0, ++ci);

        let wait = del ? 45 : 75;
        if (!del && ci === cur.length) { wait = 2200; del = true; }
        else if (del && ci === 0)      { del = false; pi = (pi + 1) % phrases.length; wait = 380; }

        setTimeout(type, wait);
    }

    type();

    // Click burst effect
    document.addEventListener("click", (e) => {
        if (e.target.closest("a, button, input, textarea, select")) return;
        spawnClickFx(e.clientX, e.clientY);
    });
});

function spawnClickFx(x, y) {
    const colors = ["#8b5cf6", "#6366f1", "#a78bfa", "#c4b5fd"];

    for (let r = 0; r < 2; r++) {
        const ring = document.createElement("span");
        ring.className = "fx-ring";
        ring.style.cssText = `left:${x}px;top:${y}px;animation-delay:${r * 90}ms`;
        if (r === 1) ring.style.borderColor = "#6366f1";
        document.body.appendChild(ring);
        ring.addEventListener("animationend", () => ring.remove());
    }

    const count = 10;
    for (let i = 0; i < count; i++) {
        const dot = document.createElement("span");
        dot.className = "fx-dot";
        const angle = (Math.PI * 2 / count) * i;
        const dist  = 30 + Math.random() * 25;
        const dx    = Math.cos(angle) * dist;
        const dy    = Math.sin(angle) * dist;
        const size  = 2 + Math.random() * 3;
        const color = colors[Math.floor(Math.random() * colors.length)];
        dot.style.cssText = `left:${x}px;top:${y}px;width:${size}px;height:${size}px;background:${color};--dx:${dx}px;--dy:${dy}px;animation-delay:${Math.random() * 50}ms`;
        document.body.appendChild(dot);
        dot.addEventListener("animationend", () => dot.remove());
    }
}
