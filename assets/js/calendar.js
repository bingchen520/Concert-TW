// 活動日曆：自動讀取首頁每張 a.stub[data-dates] 卡片，不需要另外維護日曆資料
(function () {
  var root = document.getElementById("calendar");
  if (!root) return;
  function p(n) { return n < 10 ? "0" + n : "" + n; }
  var ev = {};
  document.querySelectorAll("a.stub[data-dates]").forEach(function (a, i) {
    var t = a.querySelector("strong").textContent, h = a.getAttribute("href");
    var c = a.getAttribute("data-color") ? +a.getAttribute("data-color") % 8 : i % 8;
    a.classList.add("c" + c);
    a.getAttribute("data-dates").split(",").forEach(function (d) {
      d = d.trim(); if (d) (ev[d] = ev[d] || []).push({ t: t, h: h, s: a.getAttribute("data-short") || t, c: c });
    });
  });
  var keys = Object.keys(ev).sort(), now = new Date();
  var today = now.getFullYear() + "-" + p(now.getMonth() + 1) + "-" + p(now.getDate());
  var start = keys.filter(function (k) { return k >= today; })[0] || keys[keys.length - 1] || today;
  var y = +start.slice(0, 4), m = +start.slice(5, 7) - 1;
  function render() {
    var first = new Date(y, m, 1).getDay(), days = new Date(y, m + 1, 0).getDate();
    var pre = y + "-" + p(m + 1) + "-";
    var h = '<div class="cal"><div class="cal-head"><button type="button" id="cal-prev" aria-label="上個月">‹</button><b>' +
      y + " 年 " + (m + 1) + ' 月</b><button type="button" id="cal-next" aria-label="下個月">›</button></div><div class="cal-grid">';
    "日一二三四五六".split("").forEach(function (w) { h += '<span class="w">' + w + "</span>"; });
    for (var i = 0; i < first; i++) h += "<span></span>";
    var list = [];
    for (var d = 1; d <= days; d++) {
      var k = pre + p(d), es = ev[k] || [];
      h += '<div class="d' + (k === today ? " today" : "") + (es.length ? " has" : "") + '"><span class="n">' + d + "</span>";
      es.forEach(function (e) {
        h += '<a class="m c' + e.c + '" href="' + e.h + '" title="' + e.t + '">' + e.s + "</a>";
        list.push("<li>" + (m + 1) + "/" + d + ' ｜ <a href="' + e.h + '">' + e.t + "</a></li>");
      });
      h += "</div>";
    }
    h += "</div>" + (list.length ? '<ul class="cal-list">' + list.join("") + "</ul>" : '<p class="sub">這個月還沒有活動 ☁</p>') + "</div>";
    root.innerHTML = h;
    document.getElementById("cal-prev").onclick = function () { m--; if (m < 0) { m = 11; y--; } render(); };
    document.getElementById("cal-next").onclick = function () { m++; if (m > 11) { m = 0; y++; } render(); };
  }
  render();
})();
