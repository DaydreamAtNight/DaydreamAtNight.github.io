document.addEventListener("DOMContentLoaded", function () {
  // Homepage only
  const isHome = window.location.pathname === "/" || window.location.pathname === "/index.html";
  if (!isHome) return;

  const banner = document.getElementById("banner");
  if (!banner) return;

  // 1. Sleek entrance loading page (ONLY on first entry of the browser session)
  const isFirstVisit = !sessionStorage.getItem("shourou_entered");
  let preloader = null;

  if (isFirstVisit) {
    sessionStorage.setItem("shourou_entered", "true");

    preloader = document.createElement("div");
    preloader.id = "site-preloader";
    preloader.className = "site-preloader";
    preloader.innerHTML = `
      <div class="preloader-inner">
        <div class="preloader-spinner"></div>
        <div class="preloader-title">ShouRou</div>
        <div class="preloader-sub">DaydreamAtNight</div>
      </div>
    `;
    document.body.appendChild(preloader);
  }

  function dismissPreloader() {
    if (preloader) {
      preloader.classList.add("fade-out");
      setTimeout(function () {
        if (preloader && preloader.parentNode) {
          preloader.parentNode.removeChild(preloader);
          preloader = null;
        }
      }, 500);
    }
  }

  // Safety timer: maximum 1.5 seconds so it NEVER blocks the visitor
  if (isFirstVisit) {
    setTimeout(dismissPreloader, 1500);
  }

  // 2. Setup video element with complete Safari WebKit autoplay compliance
  const video = document.createElement("video");
  video.autoplay = true;
  video.muted = true;
  video.defaultMuted = true; // Essential for Safari autoplay
  video.loop = true;
  video.playsInline = true;
  video.preload = "auto";

  video.setAttribute("muted", "");
  video.setAttribute("playsinline", "");
  video.setAttribute("webkit-playsinline", "");
  video.setAttribute("autoplay", "");
  video.className = "banner-video";

  // Dismiss loading screen when video begins rendering
  video.addEventListener("playing", dismissPreloader, { once: true });
  video.addEventListener("timeupdate", dismissPreloader, { once: true });
  video.addEventListener("canplaythrough", dismissPreloader, { once: true });

  // 3. Fast Codec Detection:
  // Detect Safari / WebKit on macOS and iOS
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent) ||
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

  // Safari does not decode AV1 inside WebM containers, causing it to freeze or stall.
  // Route Safari directly to hardware-accelerated H.264 MP4. Chrome/Firefox get WebM.
  if (!isSafari && (video.canPlayType('video/webm; codecs="av01.0.08M.10"') || video.canPlayType('video/webm'))) {
    video.src = "/img/aaaad.webm";
  } else {
    video.src = "/img/aaaad.mp4";
  }

  // Fallback in case WebM cannot be decoded
  video.addEventListener("error", function () {
    if (video.src.endsWith("/aaaad.mp4")) {
      dismissPreloader();
      return;
    }
    console.log("WebM unavailable, falling back to H.264 MP4");
    video.src = "/img/aaaad.mp4";
    video.load();
    const p = video.play();
    if (p !== undefined) {
      p.then(dismissPreloader).catch(dismissPreloader);
    }
  });

  banner.insertBefore(video, banner.firstChild);

  // Trigger load and play
  video.load();
  const playPromise = video.play();
  if (playPromise !== undefined) {
    playPromise.then(dismissPreloader).catch(function () {
      dismissPreloader();
    });
  }
});