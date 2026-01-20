// main.js - Comportements JS pour HANDICAMPUS
// Fonctions: menu toggle, nav active, forms (contact/newsletter), login simulation, admin guard

document.addEventListener('DOMContentLoaded', function(){
  // Menu toggle for small screens
  var menuToggle = document.querySelector('.menu-toggle');
  var navList = document.querySelector('.nav-list');
  if(menuToggle && navList){
    menuToggle.addEventListener('click', function(){
      var expanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', String(!expanded));
      navList.classList.toggle('show');
    });
  }

  // Set active nav link based on current pathname
  var path = window.location.pathname.replace(/\\\\/g, '/');
  var navLinks = document.querySelectorAll('.nav-list a');
  navLinks.forEach(function(link){
    try{
      var href = link.getAttribute('href');
      if(!href) return;
      // Normalize relative links
      var linkPath = href.replace(/^(?:.*\/)?/, '');
      if(path.endsWith(linkPath) || path.endsWith(href)){
        link.classList.add('active');
        link.setAttribute('aria-current','page');
      }
    }catch(e){/* ignore */}
  });

  // Contact form validation and submission (simulate)
  var contactForm = document.getElementById('contactForm');
  if(contactForm){
    contactForm.addEventListener('submit', function(e){
      e.preventDefault();
      // Simple client-side validation
      var valid = true;
      var required = contactForm.querySelectorAll('[aria-required="true"]');
      required.forEach(function(el){
        var errEl = document.getElementById(el.id + '-error');
        if(!el.value || el.value.trim() === ''){
          valid = false;
          if(errEl) errEl.textContent = 'Ce champ est requis.';
        } else {
          if(errEl) errEl.textContent = '';
        }
      });
      if(!valid) return;
      // Simulate send: show success message
      var success = document.getElementById('formSuccess');
      if(success){
        contactForm.style.display = 'none';
        success.style.display = 'block';
      } else {
        alert('Message envoyé. Merci.');
        contactForm.reset();
      }
    });
  }

  // Newsletter subscribe
  var newsletterForm = document.getElementById('newsletterForm');
  if(newsletterForm){
    newsletterForm.addEventListener('submit', function(e){
      e.preventDefault();
      var email = newsletterForm.querySelector('input[type="email"]');
      if(email && email.checkValidity()){
        // simple feedback
        alert('Merci ! Vous êtes inscrit(e) à la newsletter.');
        newsletterForm.reset();
      } else {
        email.focus();
      }
    });
  }

  // Login form simulation
  var loginForm = document.getElementById('loginForm');
  if(loginForm){
    var demoEmail = 'demo@handicampus.fr';
    var demoPass = 'demo123';
    loginForm.addEventListener('submit', function(e){
      e.preventDefault();
      var email = document.getElementById('login-email').value.trim();
      var password = document.getElementById('login-password').value;
      var valid = true;
      if(!email){document.getElementById('login-email-error').textContent='Email requis'; valid=false;} else {document.getElementById('login-email-error').textContent=''}
      if(!password){document.getElementById('login-password-error').textContent='Mot de passe requis'; valid=false;} else {document.getElementById('login-password-error').textContent=''}
      if(!valid) return;

      // Demo credentials OR any stored user in localStorage
      var storedUser = null;
      try{ storedUser = JSON.parse(localStorage.getItem('handicampus_user')); }catch(e){storedUser=null}
      if((email === demoEmail && password === demoPass) || (storedUser && storedUser.email === email && storedUser.password === password)){
        // Save simple session
        localStorage.setItem('handicampus_session', JSON.stringify({email: email, timestamp: Date.now()}));
        // redirect to admin if present
        window.location.href = 'administration.html';
      } else {
        document.getElementById('login-password-error').textContent = 'Identifiants invalides (mode démo disponible).';
      }
    });

    // Password toggle
    var toggle = document.getElementById('togglePassword');
    if(toggle){
      toggle.addEventListener('click', function(){
        var pwd = document.getElementById('login-password');
        if(pwd){
          if(pwd.type === 'password'){pwd.type='text'; this.setAttribute('aria-pressed','true'); this.textContent='🙈';}
          else {pwd.type='password'; this.setAttribute('aria-pressed','false'); this.textContent='👁️';}
        }
      });
    }
  }

  // Admin page guard: redirect to connexion si pas de session
  if(window.location.pathname.endsWith('/pages/administration.html') || window.location.pathname.endsWith('/administration.html')){
    var session = null;
    try{ session = JSON.parse(localStorage.getItem('handicampus_session')); }catch(e){session=null}
    if(!session){
      // not logged in
      window.location.href = 'connexion.html';
    } else {
      // set admin name if stored
      var adminNameEl = document.getElementById('adminName');
      if(adminNameEl) adminNameEl.textContent = session.email;
    }
    // logout button
    var logoutBtn = document.getElementById('logoutBtn');
    if(logoutBtn){
      logoutBtn.addEventListener('click', function(e){
        e.preventDefault();
        localStorage.removeItem('handicampus_session');
        window.location.href = 'connexion.html';
      });
    }
  }

  // If administration.html is in pages/ path
  if(window.location.pathname.endsWith('/pages/administration.html')){
    var session = null;
    try{ session = JSON.parse(localStorage.getItem('handicampus_session')); }catch(e){session=null}
    if(!session){ window.location.href = 'connexion.html'; }
    var logoutBtn2 = document.getElementById('logoutBtn');
    if(logoutBtn2){ logoutBtn2.addEventListener('click', function(e){ e.preventDefault(); localStorage.removeItem('handicampus_session'); window.location.href = 'connexion.html'; }); }
  }

  // Modal vidéo témoignage (page d'accueil)
  var openVideoBtn = document.getElementById('openVideoBtn');
  var videoModal = document.getElementById('videoModal');
  var closeVideoBtn = document.getElementById('closeVideoBtn');
  var videoFrame = document.getElementById('videoFrame');
  var lastFocusedElement = null;

  function openVideoModal(){
    if(!videoModal || !openVideoBtn || !videoFrame) return;
    lastFocusedElement = document.activeElement;
    var videoId = openVideoBtn.getAttribute('data-video-id') || '';
    var start = openVideoBtn.getAttribute('data-video-start');
    var base = videoId ? 'https://www.youtube.com/embed/' + videoId : '';
    var params = '?autoplay=1&rel=0';
    if(start){ params += '&start=' + encodeURIComponent(start); }
    var src = base ? base + params : '';
    videoFrame.setAttribute('src', src);
    videoModal.hidden = false;
    closeVideoBtn && closeVideoBtn.focus();
  }

  function closeVideoModal(){
    if(!videoModal || !videoFrame) return;
    videoModal.hidden = true;
    videoFrame.setAttribute('src', '');
    if(lastFocusedElement && typeof lastFocusedElement.focus === 'function'){
      lastFocusedElement.focus();
    }
  }

  if(openVideoBtn && videoModal){
    openVideoBtn.addEventListener('click', function(){
      openVideoModal();
    });
  }

  if(closeVideoBtn){
    closeVideoBtn.addEventListener('click', function(){
      closeVideoModal();
    });
  }

  if(videoModal){
    videoModal.addEventListener('click', function(e){
      if(e.target && e.target.hasAttribute('data-modal-close')){
        closeVideoModal();
      }
    });

    document.addEventListener('keydown', function(e){
      if(!videoModal.hidden && e.key === 'Escape'){
        closeVideoModal();
      }
    });
  }

});
