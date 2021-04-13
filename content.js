if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", afterDOMLoaded);
} else {
  afterDOMLoaded();
}

function afterDOMLoaded() {
  function parseUrl(url) {
    url = url || "";
    const match = url.match(
      /(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]{11})/
    );
    return match && match[1];
  }

  function pauseVideo($frame) {
    $frame.contentWindow.postMessage(
      '{"event":"command","func":"pauseVideo","args":""}',
      "https://www.youtube.com"
    );
  }

  document.addEventListener("click", (e) => {
    const youtubeLink = 'a[href^="https://www.youtube.com/watch?v="]';

    if (!e.target.matches(`div[role="feed"] ${youtubeLink} img`)) {
      return;
    }

    const $link = e.target.closest(youtubeLink);

    const youtubeId = parseUrl($link.href);
    if (!youtubeId) {
      return;
    }

    e.preventDefault();
    document.querySelectorAll(".yt4fb-frame").forEach(pauseVideo);
    $link.parentNode.innerHTML = `<div class=\"yt4fb-frame-wrapper\"><svg viewbox=\"0 0 16 9\"></svg><iframe class=\"yt4fb-frame\" src=\"//www.youtube.com/embed/${youtubeId}?enablejsapi=1&autoplay=1\" allowfullscreen=\"\" frameborder=\"0\"></iframe></div>`;
  });

  document.addEventListener(
    "play",
    (e) => {
      if (e.target.matches("video")) {
        document.querySelectorAll(".yt4fb-frame").forEach(pauseVideo);
      }
    },
    true
  );
}
