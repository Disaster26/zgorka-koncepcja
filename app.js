(function(){
function init(){
  var top=document.getElementById('top'),bg=document.getElementById('burger');
  function zamknij(){top.classList.remove('open');bg.setAttribute('aria-expanded','false');bg.setAttribute('aria-label','Otwórz menu')}
  bg.addEventListener('click',function(){var o=top.classList.toggle('open');bg.setAttribute('aria-expanded',o);bg.setAttribute('aria-label',o?'Zamknij menu':'Otwórz menu')});
  document.querySelectorAll('.menu a').forEach(function(a){a.addEventListener('click',zamknij)});
  var tk=false;function sc(){if(tk)return;tk=true;requestAnimationFrame(function(){top.classList.toggle('sc',window.pageYOffset>8);tk=false})}addEventListener('scroll',sc,{passive:true});
  var links=[].slice.call(document.querySelectorAll('.menu a[href^="#"]:not(.btn)'));
  var mob=document.getElementById('mob'),hero=document.getElementById('start');
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){links.forEach(function(l){l.classList.toggle('on',l.getAttribute('href')==='#'+e.target.id)})}})},{rootMargin:'-45% 0px -50% 0px'});
    links.forEach(function(l){var t=document.querySelector(l.getAttribute('href'));if(t)io.observe(t)});
    io.observe(hero);
    new IntersectionObserver(function(es){mob.classList.toggle('widac',!es[0].isIntersecting&&es[0].boundingClientRect.top<0)}).observe(hero.querySelector('.btn'));
  }
  /* przewijane tory */
  document.querySelectorAll('[data-tor]').forEach(function(tor){
    var down=false,sx=0,sl=0,moved=false;
    function step(){var k=tor.children[0];return k?k.getBoundingClientRect().width+parseFloat(getComputedStyle(tor).columnGap||0):300}
    tor.addEventListener('pointerdown',function(e){if(e.pointerType!=='mouse'||tor.scrollWidth<=tor.clientWidth+2)return;down=true;moved=false;sx=e.clientX;sl=tor.scrollLeft});
    addEventListener('pointermove',function(e){if(!down)return;var dx=e.clientX-sx;if(Math.abs(dx)>4){moved=true;tor.classList.add('drag')}tor.scrollLeft=sl-dx});
    addEventListener('pointerup',function(){if(!down)return;down=false;tor.classList.remove('drag');if(moved){var w=step();tor.scrollTo({left:Math.round(tor.scrollLeft/w)*w,behavior:'smooth'})}});
    tor.addEventListener('click',function(e){if(moved){e.preventDefault();e.stopPropagation();moved=false}},true);
    tor.addEventListener('dragstart',function(e){e.preventDefault()});
    var nav=document.querySelector('[data-nav="'+tor.id+'"]');
    function upd(){if(!nav)return;nav.style.visibility=tor.scrollWidth>tor.clientWidth+2?'visible':'hidden'}
    if(nav)nav.querySelectorAll('button').forEach(function(b){b.addEventListener('click',function(){tor.scrollBy({left:step()*(+b.dataset.k),behavior:'smooth'})})});
    requestAnimationFrame(upd);addEventListener('resize',upd);
  });
  /* lightbox */
  var lb=document.getElementById('lb'),lbi=lb.querySelector('img'),lbc=lb.querySelector('figcaption'),grp=[],ix=0,last=null,tx0=null;
  function pokaz(){var b=grp[ix];lbi.src=b.dataset.src;lbi.alt=(b.querySelector('img')||{}).alt||'';lbc.textContent=b.dataset.cap+(grp.length>1?'  ('+(ix+1)+' / '+grp.length+')':'')}
  function otworz(b){grp=[].slice.call(document.querySelectorAll('[data-lb="'+b.dataset.lb+'"]'));ix=grp.indexOf(b);last=b;pokaz();lb.classList.add('on');document.body.style.overflow='hidden';lb.querySelector('.x').focus();var m=grp.length>1;lb.querySelector('.p').hidden=!m;lb.querySelector('.n').hidden=!m}
  function zam(){lb.classList.remove('on');document.body.style.overflow='';lbi.removeAttribute('src');if(last)last.focus()}
  function kr(d){ix=(ix+d+grp.length)%grp.length;pokaz()}
  document.querySelectorAll('[data-lb]').forEach(function(b){b.addEventListener('click',function(){otworz(b)})});
  lb.querySelector('.x').addEventListener('click',zam);lb.querySelector('.p').addEventListener('click',function(){kr(-1)});lb.querySelector('.n').addEventListener('click',function(){kr(1)});
  lb.addEventListener('click',function(e){if(e.target===lb||e.target.tagName==='FIGURE')zam()});
  lb.addEventListener('touchstart',function(e){tx0=e.touches[0].clientX},{passive:true});
  lb.addEventListener('touchend',function(e){if(tx0===null)return;var d=e.changedTouches[0].clientX-tx0;if(Math.abs(d)>50&&grp.length>1)kr(d<0?1:-1);tx0=null});
  document.addEventListener('keydown',function(e){if(lb.classList.contains('on')){if(e.key==='Escape')zam();if(e.key==='ArrowRight')kr(1);if(e.key==='ArrowLeft')kr(-1)}else if(e.key==='Escape')zamknij()});
  /* formularz pokazowy */
  var f=document.getElementById('form'),msg=document.getElementById('msg');
  f.addEventListener('submit',function(e){e.preventDefault();var ok=true;[].forEach.call(f.querySelectorAll('[required]'),function(i){var v=i.type==='checkbox'?(i.checked?'1':''):i.value.trim();var bad=!v||(i.type==='email'&&!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v));i.setAttribute('aria-invalid',bad);if(bad&&ok){ok=false;i.focus()}});if(!ok)return;msg.hidden=false;f.reset();msg.scrollIntoView({block:'nearest',behavior:'smooth'})});
  /* cookies + mapa przy przewinieciu */
  var ck=document.getElementById('cookies'),mapa=document.getElementById('mapa'),zgoda=null,widoczna=false;
  try{zgoda=localStorage.getItem('zg-cookies')}catch(e){}
  function wstawMape(){if(mapa.querySelector('iframe'))return;var i=document.createElement('iframe');i.src=mapa.dataset.src;i.title='Mapa: Wolica Pierwsza 5, 23-310 Modliborzyce';i.loading='lazy';i.referrerPolicy='no-referrer-when-downgrade';mapa.appendChild(i)}
  function moze(){if(zgoda!=='0'&&widoczna)wstawMape()}
  ck.querySelectorAll('button').forEach(function(b){b.addEventListener('click',function(){zgoda=b.dataset.c;try{localStorage.setItem('zg-cookies',zgoda)}catch(e){}ck.hidden=true;moze()})});
  document.getElementById('pokaz-mape').addEventListener('click',function(){zgoda='1';try{localStorage.setItem('zg-cookies','1')}catch(e){}ck.hidden=true;wstawMape()});
  if('IntersectionObserver' in window){new IntersectionObserver(function(es){if(es[0].isIntersecting){widoczna=true;moze()}},{rootMargin:'300px'}).observe(mapa)}else{widoczna=true;moze()}
  
  /* dalsze zdjecia w kartach dopiero po zaladowaniu strony albo przy dotknieciu toru */
  function dociagnij(){document.querySelectorAll('img[data-src]').forEach(function(i){i.srcset=i.dataset.srcset;i.src=i.dataset.src;i.removeAttribute('data-src');i.removeAttribute('data-srcset')})}
  setTimeout(dociagnij,2500);
  document.querySelectorAll('.ftor').forEach(function(f){['pointerdown','touchstart','focusin','mouseenter'].forEach(function(ev){f.addEventListener(ev,dociagnij,{passive:true,once:true})})});
  var r=document.getElementById('rok');if(r)r.textContent=new Date().getFullYear();
}
function start(){setTimeout(init,0)}
if(document.readyState==='complete')start();else addEventListener('load',start);
})();
