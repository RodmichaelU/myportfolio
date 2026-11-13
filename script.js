function toggleMenu() {
    const menu = document.querySelector(".menu-links");
    const icon = document.querySelector(".hamburger-icon");
    menu.classList.toggle("open");
    icon.classList.toggle("open");
}

document.addEventListener("DOMContentLoaded", function () {

    // Scroll animations: watches any element with data-animate="…"
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
        "Open to Full-Time SWE Roles",
        "Incoming MSCS Student · Georgia Tech"
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

    // Phone skills tabs: one category visible at a time (CSS shows all on desktop)
    const skillsGrid = document.querySelector(".skills-grid");
    if (skillsGrid) {
        const groups = [...skillsGrid.querySelectorAll(".skill-group")];
        const tabs = document.createElement("div");
        tabs.className = "skill-tabs";
        tabs.setAttribute("role", "tablist");
        const show = (i) => {
            groups.forEach((g, j) => {
                g.classList.toggle("active", j === i);
                if (j === i) g.classList.add("in-view");
            });
            [...tabs.children].forEach((b, j) => b.setAttribute("aria-selected", j === i));
        };
        groups.forEach((g, i) => {
            const b = document.createElement("button");
            b.type = "button";
            b.setAttribute("role", "tab");
            b.textContent = g.dataset.short || g.querySelector("h3").textContent;
            b.addEventListener("click", () => show(i));
            tabs.appendChild(b);
        });
        skillsGrid.before(tabs);
        show(0);
    }

    // Phone project carousel: "n / total" counter + dots
    const grid  = document.querySelector(".projects-grid");
    const cards = grid ? [...grid.querySelectorAll(".project-card")] : [];
    const count = document.querySelector(".swipe-count");
    const dots  = document.querySelector(".swipe-dots");
    if (grid && count && dots && cards.length) {
        cards.forEach(() => dots.appendChild(document.createElement("span")));
        const setActive = () => {
            const step = cards[1] ? cards[1].offsetLeft - cards[0].offsetLeft : 1;
            const atEnd = grid.scrollLeft + grid.clientWidth >= grid.scrollWidth - 4;
            const i = atEnd ? cards.length - 1 : Math.round(grid.scrollLeft / step);
            count.textContent = `${i + 1} / ${cards.length}`;
            [...dots.children].forEach((d, j) => d.classList.toggle("active", j === i));
        };
        grid.addEventListener("scroll", setActive, { passive: true });
        setActive();
    }

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
