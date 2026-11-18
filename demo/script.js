(() => {
    // Nav: border once scrolled, menu button on small screens
    const nav    = document.getElementById("nav");
    const toggle = document.getElementById("nav-toggle");
    const links  = document.getElementById("nav-links");

    const setMenu = (open) => {
        links.classList.toggle("open", open);
        toggle.setAttribute("aria-expanded", String(open));
    };
    toggle.addEventListener("click", () => setMenu(toggle.getAttribute("aria-expanded") !== "true"));
    links.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });

    const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    // Scroll reveal: each element fades in once and is then left alone.
    // Items that arrive together are staggered slightly, capped so nothing waits long.
    const revealables = document.querySelectorAll(".reveal");
    if ("IntersectionObserver" in window) {
        const io = new IntersectionObserver((entries) => {
            let n = 0;
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                const el = entry.target;
                io.unobserve(el);
                setTimeout(() => el.classList.add("in"), Math.min(n++, 4) * 70);
            });
        }, { threshold: 0.08 });
        revealables.forEach((el) => io.observe(el));
    } else {
        revealables.forEach((el) => el.classList.add("in"));
    }

    // Phone: "show more" buttons for the folded lists
    document.querySelectorAll("[data-expand]").forEach((btn) => {
        const target = document.getElementById(btn.dataset.expand);
        const label  = btn.textContent;
        btn.addEventListener("click", () => {
            const open = target.toggleAttribute("data-expanded");
            btn.setAttribute("aria-expanded", String(open));
            btn.textContent = open ? "Show less" : label;
            if (open) target.querySelectorAll(".reveal").forEach((el) => el.classList.add("in"));
        });
    });

    // Phone: featured project carousel counter and dots
    const track = document.getElementById("features");
    const count = document.getElementById("swipe-count");
    const dots  = document.getElementById("swipe-dots");
    const cards = track ? [...track.children] : [];
    if (track && count && dots && cards.length > 1) {
        cards.forEach(() => dots.appendChild(document.createElement("span")));
        const update = () => {
            const step  = cards[1].offsetLeft - cards[0].offsetLeft || 1;
            const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
            const i     = track.scrollLeft < 4 ? 0 : atEnd ? cards.length - 1 : Math.round(track.scrollLeft / step);
            count.textContent = `${i + 1} / ${cards.length}`;
            [...dots.children].forEach((d, j) => d.classList.toggle("on", j === i));
        };
        track.addEventListener("scroll", update, { passive: true });
        window.addEventListener("resize", update, { passive: true });
        update();
    }

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Typewriter (restored from the live site)
    const typed = document.getElementById("typed-text");
    if (typed && !reduceMotion) {
        const phrases = [
            "Software Engineer",
            "New Graduate · UofC",
            "Full Stack Developer",
            "Open to Full-Time SWE Roles",
            "Incoming MSCS Student · Georgia Tech"
        ];
        let pi = 0, ci = phrases[0].length, del = false;
        const tick = () => {
            const cur = phrases[pi];
            typed.textContent = del ? cur.slice(0, --ci) : cur.slice(0, ++ci);
            let wait = del ? 45 : 75;
            if (!del && ci === cur.length) { wait = 2200; del = true; }
            else if (del && ci === 0)      { del = false; pi = (pi + 1) % phrases.length; wait = 380; }
            setTimeout(tick, wait);
        };
        // The first phrase is already in the HTML, so start by holding it, then erasing
        del = true;
        setTimeout(tick, 2200);
    }

    // Click burst on empty space (restored from the live site)
    if (!reduceMotion) {
        const colors = ["#8b5cf6", "#6366f1", "#a78bfa", "#c4b5fd"];
        document.addEventListener("click", (e) => {
            if (e.target.closest("a, button, input, textarea, select")) return;
            const { clientX: x, clientY: y } = e;
            for (let r = 0; r < 2; r++) {
                const ring = document.createElement("span");
                ring.className = "fx-ring";
                ring.style.cssText = `left:${x}px;top:${y}px;animation-delay:${r * 90}ms`;
                if (r === 1) ring.style.borderColor = "#6366f1";
                document.body.appendChild(ring);
                ring.addEventListener("animationend", () => ring.remove());
            }
            for (let i = 0; i < 10; i++) {
                const dot   = document.createElement("span");
                const angle = (Math.PI * 2 / 10) * i;
                const dist  = 30 + Math.random() * 25;
                const size  = 2 + Math.random() * 3;
                dot.className = "fx-dot";
                dot.style.cssText = `left:${x}px;top:${y}px;width:${size}px;height:${size}px;` +
                    `background:${colors[Math.floor(Math.random() * colors.length)]};` +
                    `--dx:${Math.cos(angle) * dist}px;--dy:${Math.sin(angle) * dist}px;animation-delay:${Math.random() * 50}ms`;
                document.body.appendChild(dot);
                dot.addEventListener("animationend", () => dot.remove());
            }
        });
    }

    // Demo only: show or hide the ✎ notes
    const notesBtn = document.getElementById("notes-toggle");
    if (notesBtn) {
        notesBtn.addEventListener("click", () => {
            const off = document.body.classList.toggle("notes-off");
            notesBtn.textContent = off ? "Show ✎ notes" : "Hide ✎ notes";
            notesBtn.setAttribute("aria-pressed", String(!off));
        });
    }
})();
