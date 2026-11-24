(function(){
  var P = window.PORTFOLIO || {}, U = P.ui || {};
  var $ = function(id){return document.getElementById(id)};
  function el(tag, cls, text){var e=document.createElement(tag); if(cls) e.className=cls; if(text!=null) e.textContent=text; return e}
  function add(parent){for(var i=1;i<arguments.length;i++) if(arguments[i]) parent.appendChild(arguments[i]); return parent}
  // "plain *highlight* plain" -> text with <em>
  function rich(node, str){
    node.textContent="";
    String(str).split("*").forEach(function(part,i){ if(!part) return; node.appendChild(i%2 ? el("em",null,part) : document.createTextNode(part)); });
  }

  // static labels
  Array.prototype.forEach.call(document.querySelectorAll("[data-t]"), function(n){ var k=n.getAttribute("data-t"); if(U[k]!=null) rich(n, U[k]); });
  document.querySelector("nav").setAttribute("aria-label", U.navAria);
  var sw = $("langSw"); sw.textContent = U.langLabel; sw.href = U.langHref;

  // name (first word plain, rest highlighted)
  var first = P.name.split(" ")[0], rest = P.name.split(" ").slice(1).join(" ");
  var nm = $("navName"); nm.textContent=""; add(nm, document.createTextNode(first+" "), el("span",null,rest));
  var h1 = $("h1"); h1.textContent=""; add(h1, document.createTextNode(first+" "), el("em",null,rest));
  $("role").textContent = P.role;
  $("tagline").textContent = P.tagline;
  $("intro").textContent = P.intro;

  var wa = "https://wa.me/" + P.whatsapp + "?text=" + encodeURIComponent(U.waMsg);
  ["navWa","heroWa","ctaWa"].forEach(function(id){$(id).href=wa});
  $("ctaMail").href = "mailto:" + P.email;

  P.services.slice(0,5).forEach(function(s){
    var li = el("li"); add(li, el("span",null,s.t), el("span",null,"✦")); $("heroList").appendChild(li);
  });

  var shown = (P.stats||[]).filter(function(s){return s.value && String(s.value).trim()});
  if(shown.length){
    $("statsBand").hidden=false;
    shown.forEach(function(s){ var d=el("div","stat"); add(d, el("b",null,s.value), el("span",null,s.label)); $("stats").appendChild(d)});
  }

  P.about.forEach(function(t){$("aboutText").appendChild(el("p",null,t))});
  (P.strengths||[]).forEach(function(t){$("strengths").appendChild(el("li",null,t))});
  P.split.forEach(function(s){
    var d=el("div"); var b=el("b",null,s.value+" "); b.appendChild(el("small",null,s.unit));
    add(d,b,el("span",null,s.text)); $("split").appendChild(d);
  });
  U.profile.forEach(function(r){ var li=el("li"); add(li, el("span",null,r[0]), el("span",null,r[1])); $("profile").appendChild(li); });

  P.services.forEach(function(s){var a=el("article"); add(a, el("h3",null,s.t), el("p",null,s.d)); $("svc").appendChild(a)});
  P.process.forEach(function(s,i){var d=el("div"); add(d, el("i",null,"0"+(i+1)), el("h3",null,s.t), el("p",null,s.d)); $("steps").appendChild(d)});

  var KEYS = ["followers","posts","topReel","views","likes"];
  P.clients.filter(function(c){return !c.hidden}).forEach(function(c){
    var card = el("article","client");
    var top = el("div","c-top");
    var initial = (c.name.replace(/[^A-Za-z؀-ۿ]/g,"")||"•").charAt(0).toUpperCase();
    var info = el("div"); add(info, el("h3",null,c.name), el("div","h",c.handle));
    add(top, el("div","mono",initial), info); card.appendChild(top);
    var tags = el("div","tags");
    if(c.field) tags.appendChild(el("span","tag",c.field));
    if(c.start) tags.appendChild(el("span","tag",c.start));
    if(c.ongoing) tags.appendChild(el("span","tag",U.ongoing));
    if(tags.children.length) card.appendChild(tags);
    if(c.role) card.appendChild(el("p",null,U.rolePrefix+c.role));
    var k = el("div","kpis");
    KEYS.forEach(function(key){
      var v=c.metrics&&c.metrics[key]; if(v&&String(v).trim()){var d=el("div","kpi"); add(d, el("b",null,v), el("span",null,(key==="topReel"&&c.topReelLabel)||U.kpi[key])); k.appendChild(d)}
    });
    if(k.children.length) card.appendChild(k);
    if(c.result) card.appendChild(el("p",null,c.result));
    if(c.url){ var act = el("div","actions"); var a = el("a","btn btn-ghost btn-sm",U.openAccount); a.href=c.url; a.target="_blank"; a.rel="noopener"; act.appendChild(a);
    card.appendChild(act); }
    $("clientList").appendChild(card);
  });

  P.samples.forEach(function(s){
    var c = P.clients.filter(function(x){return x.id===s.client})[0]; if(!c) return;
    var box = el("div","sample");
    var head = el("div","s-head"); add(head, el("h3",null,c.name), el("span","badge",U.badge)); box.appendChild(head);
    var reels = el("div","reels");
    s.reels.forEach(function(r){
      var d = el("div","reel"); d.appendChild(el("h4",null,U.reelPrefix+r.title));
      var dl = el("dl"), L=U.labels;
      [[L.hook,r.hook],[L.scenes,r.scenes],[L.voice,r.voice],[L.screen,r.screen],[L.cta,r.cta],[L.caption,r.caption]].forEach(function(p){ add(dl, el("dt",null,p[0]), el("dd",null,p[1])) });
      d.appendChild(dl); reels.appendChild(d);
    });
    box.appendChild(reels);
    var caps = el("div","caps");
    s.captions.forEach(function(x){var d=el("div","cap"); add(d, el("b",null,U.capPrefix+x.kind), el("p",null,x.text)); caps.appendChild(d)});
    box.appendChild(caps);
    $("sampleList").appendChild(box);
  });

  [["WhatsApp","+"+P.whatsapp],["Email",P.email]].forEach(function(r){
    var li=el("li"); add(li, el("span",null,r[0]), el("b",null,r[1])); $("cinfo").appendChild(li);
  });
  $("asof").textContent = U.asOfText + P.asOf + ".";
  $("copy").textContent = "© " + P.year + " " + P.name;
})();
