(() => {
  document.documentElement.classList.add("js-ready");

  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          io.unobserve(entry.target);
        }
      }),
    { threshold: 0.08 },
  );
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav-links");
  nav
    ?.querySelector(`[data-nav="${document.body.dataset.page}"]`)
    ?.setAttribute("aria-current", "page");
  const closeMenu = () => {
    nav?.classList.remove("open");
    toggle?.setAttribute("aria-expanded", "false");
    toggle?.setAttribute("aria-label", "Abrir menú");
  };
  toggle?.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
  });
  nav
    ?.querySelectorAll("a")
    .forEach((link) => link.addEventListener("click", closeMenu));
  addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const mobile = matchMedia("(max-width: 800px)");
  const stages = [...document.querySelectorAll(".scroll-stage")];
  const stageProgress = new WeakMap();
  const progressBar = document.createElement("div");
  progressBar.className = "scroll-progress";
  progressBar.setAttribute("aria-hidden", "true");
  document.body.appendChild(progressBar);
  const clamp = (value, min = 0, max = 1) =>
    Math.max(min, Math.min(max, value));
  const ease = (value) => value * value * (3 - 2 * value);
  const setVar = (el, name, value) => el?.style.setProperty(name, value);
  let frame = 0;

  function resetMotion() {
    stages.forEach((stage) => {
      stageProgress.delete(stage);
      stage.querySelectorAll("[style]").forEach((el) => {
        if (
          el.matches(
            ".hero-statue,.giant-logo,.editorial-visual img,.editorial-copy,.product-hero-image,.flavor-scene-image img",
          )
        )
          el.removeAttribute("style");
      });
    });
  }

  function update() {
    frame = 0;
    progressBar.style.width = `${(100 * scrollY) / Math.max(1, document.documentElement.scrollHeight - innerHeight)}%`;
    if (reduced.matches) return;

    const isMobile = mobile.matches;
    let animating = false;
    for (const stage of stages) {
      const rect = stage.getBoundingClientRect();
      if (rect.bottom < -innerHeight || rect.top > innerHeight * 1.5) continue;

      const travel = Math.max(1, stage.offsetHeight - innerHeight);
      const target = isMobile
        ? clamp(-rect.top / Math.max(1, innerHeight * 0.92))
        : clamp(-rect.top / travel);
      const previous = stageProgress.get(stage) ?? target;
      const delta = target - previous;
      const progress =
        isMobile || Math.abs(delta) < 0.001 ? target : previous + delta * 0.18;
      stageProgress.set(stage, progress);
      if (!isMobile && Math.abs(target - progress) >= 0.001) animating = true;

      const intro = ease(clamp((progress - 0.04) / 0.3));
      const outro = ease(clamp((progress - 0.74) / 0.26));
      const depth = isMobile ? 0.24 : 1;
      const statue = stage.querySelector(".hero-statue");
      if (statue) {
        setVar(
          statue,
          "--hero-shift-x",
          `${(-10 + 34 * intro - 18 * outro) * depth}px`,
        );
        setVar(
          statue,
          "--hero-shift-y",
          `${isMobile ? -progress * 64 : progress * 42}px`,
        );
        setVar(statue, "--hero-scale", `${1 + 0.032 * progress * depth}`);
        const statueOutro = isMobile
          ? ease(clamp((progress - 0.84) / 0.16))
          : outro;
        statue.style.opacity = String(1 - statueOutro);
        const giant = stage.querySelector(".giant-logo");
        setVar(
          giant,
          "--logo-shift-y",
          `${isMobile ? -progress * 48 : progress * 38}px`,
        );
        if (giant) {
          giant.style.opacity = isMobile
            ? String(1 - ease(clamp((progress - 0.05) / 0.38)))
            : "1";
        }
      }

      const section = stage.querySelector(".editorial-section");
      const subject = stage.querySelector(".editorial-visual img");
      if (subject) {
        const direction = section?.classList.contains("reverse") ? -1 : 1;
        setVar(
          subject,
          "--editorial-shift-x",
          `${direction * (1 - intro) * 54 * depth}px`,
        );
        setVar(
          subject,
          "--editorial-shift-y",
          `${(-8 + 24 * progress) * depth}px`,
        );
        setVar(subject, "--editorial-scale", `${1 + 0.035 * progress * depth}`);
        subject.style.opacity = String(
          isMobile ? 1 : 0.86 + 0.14 * intro - 0.08 * outro,
        );
      }

      const copy = stage.querySelector(".editorial-copy");
      if (copy && !isMobile) {
        setVar(copy, "--copy-shift-x", `${-30 * (1 - intro)}px`);
        setVar(copy, "--copy-shift-y", `${18 * (1 - intro) - 10 * outro}px`);
        copy.style.opacity = String(0.7 + 0.3 * intro - 0.08 * outro);
      }

      const product = stage.querySelector(".product-hero-image");
      if (product) {
        setVar(product, "--scene-shift-x", `${12 * (1 - intro) * depth}px`);
        setVar(
          product,
          "--scene-shift-y",
          `${(-15 + 30 * progress) * depth}px`,
        );
        setVar(product, "--scene-scale", `${1 + 0.035 * progress * depth}`);
      }

      const flavor = stage.querySelector(".flavor-scene-image img");
      if (flavor) {
        const direction = stage.querySelector(".flavor-left") ? -1 : 1;
        setVar(
          flavor,
          "--scene-shift-x",
          `${direction * 8 * (1 - intro) * depth}px`,
        );
        setVar(flavor, "--scene-shift-y", `${(-13 + 26 * progress) * depth}px`);
        setVar(flavor, "--scene-scale", `${1 + 0.035 * progress * depth}`);
      }
    }
    if (animating) frame = requestAnimationFrame(update);
  }

  function schedule() {
    if (!frame) frame = requestAnimationFrame(update);
  }
  addEventListener("scroll", schedule, { passive: true });
  addEventListener(
    "resize",
    () => {
      closeMenu();
      schedule();
    },
    { passive: true },
  );
  reduced.addEventListener("change", () => {
    resetMotion();
    schedule();
  });
  mobile.addEventListener("change", () => {
    stages.forEach((stage) => stageProgress.delete(stage));
    schedule();
  });
  schedule();
})();
