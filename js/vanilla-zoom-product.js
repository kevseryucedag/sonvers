


(function injectVanillaZoomCss() {
  if (document.getElementById("vanilla-zoom-css")) return;
  const css = `
  .vz-zoom-window {
    position: absolute;
    top: 0;
    left: 100%;
    margin-left: 20px;
    width: 400px;
    height: 400px;
    border: 2px solid rgba(0,0,0,.1);
    box-shadow: 0 8px 24px rgba(0,0,0,.1);
    background-repeat: no-repeat;
    background-position: center center;
    background-size: 100% 100%;
    display: none;
    pointer-events: none;
  }
  .vz-wrap { position: relative; display: inline-block; }
  .vz-thumb { cursor: pointer; max-width: 80px; }
  .vz-hidden { display: none !important; }
  @media (max-width: 768px) {
    .vz-zoom-window { position: fixed; right: 12px; left: auto; top: 12px; margin: 0; width: 55vw; height: 55vw; z-index: 9999; }
  }`;
  const style = document.createElement("style");
  style.id = "vanilla-zoom-css";
  style.textContent = css;
  document.head.appendChild(style);
})();


function bootstrapVanillaZoom(opts) {
  const {
    imgEl,            
    zoomWindowWidth = 400,
    zoomWindowHeight = 400,
    zoomOffsetX = 20,
    container 
  } = opts || {};

  if (!imgEl) throw new Error("bootstrapVanillaZoom: imgEl is required");

  
  let wrapper = container;
  if (!wrapper) {
    wrapper = document.createElement("div");
    wrapper.className = "vz-wrap";
    imgEl.replaceWith(wrapper);
    wrapper.appendChild(imgEl);
  } else {
    wrapper.classList.add("vz-wrap");
  }

 
  const zoom = document.createElement("div");
  zoom.className = "vz-zoom-window";
  zoom.style.width = `${zoomWindowWidth}px`;
  zoom.style.height = `${zoomWindowHeight}px`;
  if (!window.matchMedia("(max-width: 768px)").matches) {
    zoom.style.marginLeft = `${zoomOffsetX}px";
  }
  wrapper.appendChild(zoom);

  // Natural image metrics
  let nat = { w: 0, h: 0 };

  function computeNaturalSize(img) {
    if (img.naturalWidth && img.naturalHeight) {
      nat.w = img.naturalWidth;
      nat.h = img.naturalHeight;
      return;
    }
    const tmp = new Image();
    tmp.onload = () => { nat.w = tmp.width; nat.h = tmp.height; };
    tmp.src = img.src;
  }

  function showZoom() {
    if (!imgEl.complete || nat.w === 0 || nat.h === 0) return;
    zoom.style.display = "block";
  }
  function hideZoom() { zoom.style.display = "none"; }

  function onMove(e) {
    if (!imgEl.complete || nat.w === 0 || nat.h === 0) return;

    const rect = imgEl.getBoundingClientRect();
    const pageX = (e.touches ? e.touches[0].clientX : e.clientX);
    const pageY = (e.touches ? e.touches[0].clientY : e.clientY);

    const x = pageX - rect.left;
    const y = pageY - rect.top;

    if (x < 0 || y < 0 || x > rect.width || y > rect.height) {
      hideZoom();
      return;
    }

    const nx = x / rect.width;
    const ny = y / rect.height;

    const bgW = (nat.w / rect.width) * zoom.clientWidth;
    const bgH = (nat.h / rect.height) * zoom.clientHeight;

    const bgX = (nx * (bgW - zoom.clientWidth)) * -1;
    const bgY = (ny * (bgH - zoom.clientHeight)) * -1;

    zoom.style.backgroundPosition = `${bgX}px ${bgY}px`;
    showZoom();
  }

  // Touch toggle
  let touchActive = false;
  function onTouchStart(e) {
    touchActive = !touchActive;
    if (!touchActive) { hideZoom(); return; }
    onMove(e);
  }

  // Public API
  function setImage(src) {
    hideZoom();
    imgEl.src = src;
    zoom.style.backgroundImage = `url("${src}")`;
    if (imgEl.complete) computeNaturalSize(imgEl);
    else {
      imgEl.addEventListener("load", () => computeNaturalSize(imgEl), { once: true });
      imgEl.addEventListener("error", () => console.error("Image failed:", src), { once: true });
    }
  }

  // Bind events
  wrapper.addEventListener("mousemove", onMove);
  wrapper.addEventListener("mouseleave", hideZoom);
  wrapper.addEventListener("touchstart", onTouchStart, { passive: true });
  wrapper.addEventListener("touchmove", onMove, { passive: true });
  wrapper.addEventListener("touchend", () => {}, { passive: true });

  // Initial image
  setImage(imgEl.getAttribute("data-zoom-image") || imgEl.src);

  return {
    setImage,
    destroy: () => {
      hideZoom();
      wrapper.removeEventListener("mousemove", onMove);
      wrapper.removeEventListener("mouseleave", hideZoom);
      wrapper.removeEventListener("touchstart", onTouchStart);
      wrapper.removeEventListener("touchmove", onMove);
      wrapper.removeEventListener("touchend", () => {});
      zoom.remove();
      wrapper.classList.remove("vz-wrap");
    }
  };
}

// Expose to window for non-module usage
window.bootstrapVanillaZoom = bootstrapVanillaZoom;

// -------- (Optional) Product page wiring --------
// If your page uses the earlier product JSON structure and IDs, you can keep this block.
// Otherwise, remove it and wire bootstrapVanillaZoom yourself.
async function loadProduct() {
  const urlParams = new URLSearchParams(window.location.search);
  const productID = urlParams.get("id");

  const res = await fetch("products.json", { cache: "no-store" });
  if (!res.ok) {
    console.error("products.json fetch failed");
    return;
  }
  const products = await res.json();

  const p = products.find(x => String(x.id) === String(productID));
  if (!p) return;

  document.getElementById("pTitle") && (document.getElementById("pTitle").innerText = p.title ?? "");
  document.getElementById("pPrice") && (document.getElementById("pPrice").innerText = p.price ?? "");
  document.getElementById("pOldPrice") && (document.getElementById("pOldPrice").innerText = p.oldPrice ?? "");
  document.getElementById("pHighlights") && (document.getElementById("pHighlights").innerHTML = Array.isArray(p.highlights) ? p.highlights.join("<br>") : "");
  document.getElementById("pDesc") && (document.getElementById("pDesc").innerText = p.description ?? "");

  const mainImg = document.getElementById("mainImg");
  if (!mainImg) {
    console.warn("#mainImg not found");
    return;
  }

  // Clean old plugin artifacts if any
  document.querySelectorAll(".zoomContainer,.zoomLens,.zoomWindow").forEach(n => n.remove());

  const vz = bootstrapVanillaZoom({
    imgEl: mainImg,
    zoomWindowWidth: 400,
    zoomWindowHeight: 400,
    zoomOffsetX: 20
  });

  const images = Array.isArray(p.images) ? p.images.filter(Boolean) : [];
  const thumbRow = document.getElementById("thumbRow");
  if (thumbRow) {
    thumbRow.innerHTML = images.map(src => `<img src="${src}" class="vz-thumb">`).join("");
    thumbRow.addEventListener("click", (e) => {
      const t = e.target;
      if (t && t.tagName === "IMG") {
        const newSrc = t.getAttribute("src");
        vz.setImage(newSrc);
      }
    });
  }

  if (images.length) vz.setImage(images[0]);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", loadProduct);
} else {
  loadProduct();
}
