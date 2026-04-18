(function () {
  var ref = document.referrer || "";
  if (ref) {
    document.querySelectorAll(".UserRefererUrl").forEach(function (el) {
      el.value = ref;
    });
  }
  document.querySelectorAll(".UserRefererFormUrl").forEach(function (el) {
    el.value = location.href;
  });
})();
