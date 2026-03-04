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

      var linkPath = href.replace(/^(?:.*\/)?/, '');

      if(path.endsWith(linkPath) || path.endsWith(href)){
        link.classList.add('active');
        link.setAttribute('aria-current','page');
      }

    }catch(e){}
  });

  // Contact form validation
  var contactForm = document.getElementById('contactForm');

  if(contactForm){

    contactForm.addEventListener('submit', function(e){

      e.preventDefault();

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

      if(!email){
        document.getElementById('login-email-error').textContent='Email requis';
        valid=false;
      } else {
        document.getElementById('login-email-error').textContent='';
      }

      if(!password){
        document.getElementById('login-password-error').textContent='Mot de passe requis';
        valid=false;
      } else {
        document.getElementById('login-password-error').textContent='';
      }

      if(!valid) return;

      var storedUser = null;

      try{
        storedUser = JSON.parse(localStorage.getItem('handicampus_user'));
      }catch(e){
        storedUser=null;
      }

      if((email === demoEmail && password === demoPass) || (storedUser && storedUser.email === email && storedUser.password === password)){

        localStorage.setItem('handicampus_session', JSON.stringify({
          email: email,
          timestamp: Date.now()
        }));

        window.location.href = 'administration.html';

      } else {

        document.getElementById('login-password-error').textContent =
        'Identifiants invalides (mode démo disponible).';

      }

    });

  }

  // Admin page guard
  if(window.location.pathname.endsWith('/pages/administration.html') ||
     window.location.pathname.endsWith('/administration.html')){

    var session = null;

    try{
      session = JSON.parse(localStorage.getItem('handicampus_session'));
    }catch(e){
      session=null;
    }

    if(!session){

      window.location.href = 'connexion.html';

    } else {

      var adminNameEl = document.getElementById('adminName');

      if(adminNameEl)
        adminNameEl.textContent = session.email;

    }

    var logoutBtn = document.getElementById('logoutBtn');

    if(logoutBtn){

      logoutBtn.addEventListener('click', function(e){

        e.preventDefault();

        localStorage.removeItem('handicampus_session');

        window.location.href = 'connexion.html';

      });

    }

  }

  // Modal vidéo témoignage (Vimeo)

  var openVideoBtn = document.getElementById('openVideoBtn');
  var videoModal = document.getElementById('videoModal');
  var closeVideoBtn = document.getElementById('closeVideoBtn');
  var videoFrame = document.getElementById('videoFrame');
  var lastFocusedElement = null;

  function openVideoModal(){

    if(!videoModal || !openVideoBtn || !videoFrame) return;

    lastFocusedElement = document.activeElement;

    var videoId = openVideoBtn.getAttribute('data-video-id') || '';

    var src = videoId
      ? 'https://player.vimeo.com/video/' + videoId + '?autoplay=1'
      : '';

    videoFrame.setAttribute('src', src);

    videoModal.hidden = false;

    if(closeVideoBtn) closeVideoBtn.focus();

  }

  function closeVideoModal(){

    if(!videoModal || !videoFrame) return;

    videoModal.hidden = true;

    videoFrame.setAttribute('src','');

    if(lastFocusedElement && typeof lastFocusedElement.focus === 'function'){
      lastFocusedElement.focus();
    }

  }

  if(openVideoBtn){
    openVideoBtn.addEventListener('click', openVideoModal);
  }

  if(closeVideoBtn){
    closeVideoBtn.addEventListener('click', closeVideoModal);
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
