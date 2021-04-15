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

  function pauseAll() {
    document.querySelectorAll(".yt4fb-frame").forEach(pauseVideo);
  }

  function createVideoPlayer(youtubeId) {
    const $frame = document.createElement("iframe");
    $frame.setAttribute("class", "yt4fb-frame");
    $frame.setAttribute(
      "src",
      `https://www.youtube.com/embed/${youtubeId}?enablejsapi=1&autoplay=1`
    );
    $frame.setAttribute("allowfullscreen", "");
    $frame.setAttribute("frameborder", "0");

    const $wrapper = document.createElement("div");
    $wrapper.setAttribute("class", "yt4fb-wrapper");

    $wrapper.append($frame, createInfoBar());

    return $wrapper;
  }

  function createInfoBar() {
    const $extname = document.createElement("a");
    $extname.setAttribute("class", "yt4fb-extname");
    $extname.setAttribute(
      "href",
      typeof browser !== "undefined"
        ? browser.runtime.getManifest().homepage_url
        : "#"
    );
    $extname.setAttribute("target", "_blank");
    $extname.appendChild(
      document.createTextNode("YouTube Player for Facebook")
    );

    const $button = document.createElement("button");
    $button.appendChild(document.createTextNode("Pause All"));

    const $div = document.createElement("div");
    $div.setAttribute("class", "yt4fb-ctrl-pause-all");
    $div.appendChild($button);

    const $info = document.createElement("div");
    $info.setAttribute("class", "yt4fb-info");

    $info.append($extname, $div);
    return $info;
  }

  document.addEventListener("click", (e) => {
    const youtubeLink = 'a[href^="https://www.youtube.com/watch?v="]';

    if (!e.target.matches(`${youtubeLink} img`)) {
      return;
    }

    const $link = e.target.closest(youtubeLink);

    const youtubeId = parseUrl($link.href);
    if (!youtubeId) {
      return;
    }

    e.preventDefault();
    pauseAll();
    $link.parentNode.replaceChild(createVideoPlayer(youtubeId), $link);
  });

  document.addEventListener("click", (e) => {
    if (
      e.target.matches(".yt4fb-ctrl-pause-all, .yt4fb-ctrl-pause-all > button")
    ) {
      pauseAll();
    }
  });

  document.addEventListener(
    "play",
    function onFacebookNativeVideoPlayed(e) {
      if (e.target.matches("video")) {
        pauseAll();
      }
    },
    true
  );
}
