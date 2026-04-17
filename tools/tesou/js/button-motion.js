(function () {
  var buttonShells = document.querySelectorAll(".tesou-puyo-btn-shell");
  var subheads = document.querySelectorAll(".lp-subhead");

  if (buttonShells.length) {
    var kick = function () {
      buttonShells.forEach(function (buttonShell) {
        buttonShell.classList.remove("is-puyo-kick");
        void buttonShell.offsetWidth;
        buttonShell.classList.add("is-puyo-kick");
      });
    };

    kick();
    setInterval(kick, 2200);
    buttonShells.forEach(function (buttonShell) {
      buttonShell.addEventListener("mouseenter", kick);
      buttonShell.addEventListener("focus", kick);
    });
  }

  if (!subheads.length) return;

  subheads.forEach(function (subhead) {
    subhead.classList.add("is-scroll-pop");
  });

  if (!("IntersectionObserver" in window)) {
    subheads.forEach(function (subhead) {
      subhead.classList.add("is-inview");
    });
    return;
  }

  var observer = new IntersectionObserver(
    function (entries, io) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-inview");
        io.unobserve(entry.target);
      });
    },
    {
      threshold: 0.55,
      rootMargin: "0px 0px -24% 0px",
    }
  );

  subheads.forEach(function (subhead) {
    observer.observe(subhead);
  });
})();
