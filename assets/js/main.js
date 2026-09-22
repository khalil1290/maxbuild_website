(function(){
  "use strict";

  // AOS
  AOS.init({duration:600,easing:'ease-in-out',once:true,mirror:false});

// Preloader
(function(){
  var start = Date.now(), MIN = 1600; // minimum time (ms) so the animation can play
  window.addEventListener('load', function(){
    var p = document.getElementById('preloader');
    if(!p) return;
    setTimeout(function(){
      p.classList.add('hide');
      setTimeout(function(){ p.style.display = 'none'; }, 650);
    }, Math.max(0, MIN - (Date.now() - start)));
  });
})();

  // Header scroll class
  var header = document.getElementById('header');
  window.addEventListener('scroll', function(){
    if(window.scrollY > 80){ header.classList.add('scrolled'); }
    else { header.classList.remove('scrolled'); }
  });

  // Scroll top button
  var scrollTop = document.getElementById('scroll-top');
  window.addEventListener('scroll', function(){
    if(window.scrollY > 300){ scrollTop.classList.add('active'); }
    else { scrollTop.classList.remove('active'); }
  });

  // Mobile nav toggle
  var toggle = document.querySelector('.mobile-nav-toggle');
  var navmenu = document.querySelector('.navmenu');
  if(toggle){
    toggle.addEventListener('click', function(){
      document.body.classList.toggle('mobile-nav-active');
      toggle.classList.toggle('bi-list');
      toggle.classList.toggle('bi-x');
    });
  }

  // Close mobile nav on link click
  document.querySelectorAll('.navmenu a').forEach(function(link){
    link.addEventListener('click', function(){
      if(document.body.classList.contains('mobile-nav-active')){
        document.body.classList.remove('mobile-nav-active');
        if(toggle){ toggle.classList.add('bi-list'); toggle.classList.remove('bi-x'); }
      }
    });
  });

  // Active nav link on scroll
  var sections = document.querySelectorAll('section[id]');
  var navLinks = document.querySelectorAll('.navmenu a');
  window.addEventListener('scroll', function(){
    var pos = window.scrollY + 120;
    sections.forEach(function(sec){
      var top = sec.offsetTop;
      var bottom = top + sec.offsetHeight;
      var id = sec.getAttribute('id');
      if(pos >= top && pos < bottom){
        navLinks.forEach(function(l){ l.classList.remove('active'); });
        var active = document.querySelector('.navmenu a[href="#'+id+'"]');
        if(active) active.classList.add('active');
      }
    });
  });

  // Hero carousel manual cycle
  var items = document.querySelectorAll('#hero-carousel .carousel-item');
  var current = 0;
  if(items.length > 1){
    setInterval(function(){
      items[current].classList.remove('active');
      items[current].style.opacity = 0;
      current = (current + 1) % items.length;
      items[current].classList.add('active');
      items[current].style.opacity = 1;
    }, 5000);
  }

})();
