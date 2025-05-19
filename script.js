const lenis = new Lenis({
   smooth: true,
   lerp: 0.03,
   scrub: true,
   smoothTouch: true,
   //scrollBehavior: 'auto',
 });

 function raf(time) {
   lenis.raf(time);
   requestAnimationFrame(raf);
}
requestAnimationFrame(raf);


let revealTriggers = [];

function initRevealTextAnimation() {
  revealTriggers.forEach(trigger => trigger.kill());
  revealTriggers = [];

  const isMobile = window.innerWidth <= 768;

  document.querySelectorAll(".reveal-text").forEach((el) => {
    if (!el.dataset.originalHtml) {
      el.dataset.originalHtml = el.innerHTML;
    } else {
      el.innerHTML = el.dataset.originalHtml;
    }

    const originalChildren = Array.from(el.childNodes);
    el.innerHTML = "";
   
    const animationElements = [];

    originalChildren.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const words = node.textContent.trim().split(/\s+/);
        words.forEach((word) => {
          if (word !== "") {
            const span = document.createElement("span");
            span.textContent = word;
            span.style.display = "inline-block";
            span.style.opacity = 0;
            span.style.paddingRight = isMobile ? "6px" : "12px";
            span.style.webkitMaskImage = "linear-gradient(90deg, #fff 33.3%, rgba(255,255,255,.1) 66.6%)";
            span.style.maskImage = "linear-gradient(90deg, #fff 33.3%, rgba(255,255,255,.1) 66.6%)";
            span.style.webkitMaskPosition = "100% 100%";
            span.style.maskPosition = "100% 100%";
            span.style.webkitMaskSize = "300% 100%";
            span.style.maskSize = "300% 100%";
            span.style.transition = "mask-position .5s ease-in-out, opacity .2s ease-in-out";
            span.style.verticalAlign = "text-top";
            el.appendChild(span);
            animationElements.push(span);
          }
        });
      } else if (
        node.nodeType === Node.ELEMENT_NODE &&
        node.classList.contains("window")
      ) {
        if (!isMobile) {
          el.appendChild(node);
          const img = node.querySelector("img");
          if (img) {
            gsap.set(img, { clipPath: "inset(0 50% 0 50%)", opacity: 0 });
            animationElements.push(img);
          }
        }
      } else {
        el.appendChild(node.cloneNode(true));
      }
    });

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: "top 70%",
        end: "bottom 70%",
        scrub: true,
				invalidateOnRefresh: true,
        //markers: true,
      }
    });

    animationElements.forEach((animEl, i) => {
      if (animEl.tagName === "IMG") {
        timeline.to(animEl, {
          clipPath: "inset(0 0% 0 0%)",
          opacity: 1,
          duration: 0.8,
        }, i * 0.8);
      } else {
        timeline.to(animEl, {
          opacity: 1,
          webkitMaskPosition: "0 100%",
          maskPosition: "0 100%",
          duration: 0.8,
        }, i * 1);
      }
    });

    revealTriggers.push(timeline.scrollTrigger);
  });

  ScrollTrigger.refresh();
}

initRevealTextAnimation();

let resizeTimeout;

window.addEventListener("resize", () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    initRevealTextAnimation();
  }, 200);
});

