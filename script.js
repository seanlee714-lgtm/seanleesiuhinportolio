(() => {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // project briefs
  document.querySelectorAll(".name").forEach((b) => {
    b.addEventListener("click", () => {
      const open = b.getAttribute("aria-expanded") !== "true";
      b.setAttribute("aria-expanded", String(open));
      document.getElementById(b.getAttribute("aria-controls")).hidden = !open;
    });
  });

  // rule book pages
  document.querySelectorAll("[data-pages]").forEach((el) => {
    const n = +el.dataset.count;
    for (let i = 1; i <= n; i++) {
      const img = new Image();
      img.src = `media/${el.dataset.pages}-${String(i).padStart(2, "0")}.jpg`;
      img.alt = `Page ${i}`;
      img.loading = "lazy";
      img.width = 1800; img.height = 1014;
      el.append(img);
    }
  });

  // full-screen viewers
  const pauseIn = (root) => root.querySelectorAll("video").forEach((v) => { v.pause(); v.muted = true; });
  document.querySelectorAll("[data-open]").forEach((b) => {
    b.addEventListener("click", () => {
      const d = document.getElementById(b.dataset.open);
      d.showModal();
      d.querySelector(".viewer").scrollTop = 0;
    });
  });
  document.querySelectorAll("dialog").forEach((d) => {
    d.querySelector(".close").addEventListener("click", () => d.close());
    d.addEventListener("close", () => { pauseIn(d); d.querySelectorAll(".reel").forEach(setLabel); });
  });

  // reels: tap for sound, one at a time
  const reels = [...document.querySelectorAll(".reel")];
  function setLabel(r) {
    const muted = r.querySelector("video").muted;
    r.querySelector(".snd").textContent = muted ? "Sound off" : "Sound on";
    r.classList.toggle("on", !muted);
  }
  reels.forEach((r) => {
    const v = r.querySelector("video");
    r.addEventListener("click", () => {
      const willUnmute = v.muted;
      reels.forEach((o) => { if (o !== r) { o.querySelector("video").muted = true; setLabel(o); } });
      v.muted = !willUnmute;
      if (v.paused) v.play().catch(() => {});
      setLabel(r);
    });
  });

  if (reduce) { document.querySelectorAll("video.still").forEach((v) => v.pause()); return; }
  if (!("IntersectionObserver" in window)) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      const v = e.target.querySelector("video");
      if (e.intersectionRatio > 0.5) { v.preload = "auto"; v.play().catch(() => {}); }
      else { v.pause(); }
    });
  }, { threshold: [0, 0.5, 1] });
  reels.forEach((r) => io.observe(r));
})();
