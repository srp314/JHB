(function(){
  var SHEET_WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbzJ0WMoSI3s_UVWTsx6cOZf5S-l1o0Is8cOUI_2i0luAYo9u3DGo55jno1CApB1huKh/exec';

  var backdrop = document.createElement('div');
  backdrop.className = 'quote-backdrop';
  backdrop.innerHTML =
    '<div class="quote-modal" role="dialog" aria-modal="true" aria-labelledby="quoteTitle">' +
      '<button type="button" class="quote-modal__close" id="quoteClose" aria-label="Cerrar">&times;</button>' +
      '<div class="eyebrow">Cotización</div>' +
      '<h2 class="ls" id="quoteTitle">Solicitar cotización</h2>' +
      '<p class="quote-modal__sub">Completá tus datos y te contactamos a la brevedad.</p>' +
      '<form id="quoteForm" class="quote-form">' +
        '<div class="quote-form__field">' +
          '<label for="qName">Nombre y apellido</label>' +
          '<input type="text" id="qName" name="name" required>' +
        '</div>' +
        '<div class="quote-form__field">' +
          '<label for="qPhone">Nro. de teléfono</label>' +
          '<input type="tel" id="qPhone" name="phone" required>' +
        '</div>' +
        '<div class="quote-form__field">' +
          '<label for="qEmail">Correo electrónico</label>' +
          '<input type="email" id="qEmail" name="email" required>' +
        '</div>' +
        '<div class="quote-form__field">' +
          '<label for="qLocation">Ciudad / Provincia</label>' +
          '<div class="quote-form__location">' +
            '<input type="text" id="qLocation" name="location" placeholder="Ej: Córdoba, Córdoba">' +
            '<button type="button" class="btn btn--outline btn--small" id="qLocationBtn">Usar mi ubicación actual</button>' +
          '</div>' +
          '<p class="quote-form__hint">Opcional — tu navegador va a pedirte permiso antes de compartirla.</p>' +
        '</div>' +
        '<div class="quote-form__field">' +
          '<label for="qMessage">Mensaje</label>' +
          '<textarea id="qMessage" name="message" rows="4" placeholder="Contanos qué producto te interesa"></textarea>' +
        '</div>' +
        '<p class="quote-form__status" id="quoteStatus"></p>' +
        '<button type="submit" class="btn btn--solid btn--block" id="quoteSubmit">Enviar cotización</button>' +
      '</form>' +
    '</div>';
  document.body.appendChild(backdrop);

  var form = document.getElementById('quoteForm');
  var nameInput = document.getElementById('qName');
  var locationInput = document.getElementById('qLocation');
  var locationBtn = document.getElementById('qLocationBtn');
  var closeBtn = document.getElementById('quoteClose');
  var status = document.getElementById('quoteStatus');
  var submitBtn = document.getElementById('quoteSubmit');

  function openModal(){
    backdrop.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    nameInput.focus();
  }
  function closeModal(){
    backdrop.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.js-quote-btn').forEach(function(btn){
    btn.addEventListener('click', function(e){
      e.preventDefault();
      openModal();
    });
  });

  closeBtn.addEventListener('click', closeModal);
  backdrop.addEventListener('click', function(e){
    if (e.target === backdrop) closeModal();
  });
  document.addEventListener('keydown', function(e){
    if (e.key === 'Escape' && backdrop.classList.contains('is-open')) closeModal();
  });

  locationBtn.addEventListener('click', function(){
    if (!navigator.geolocation){
      status.textContent = 'Tu navegador no permite compartir ubicación. Completá el campo a mano.';
      status.classList.add('is-visible');
      return;
    }
    locationBtn.disabled = true;
    locationBtn.textContent = 'Buscando…';
    navigator.geolocation.getCurrentPosition(function(pos){
      var lat = pos.coords.latitude.toFixed(5);
      var lng = pos.coords.longitude.toFixed(5);
      locationInput.value = 'Lat ' + lat + ', Long ' + lng;
      locationBtn.disabled = false;
      locationBtn.textContent = 'Usar mi ubicación actual';
    }, function(){
      status.textContent = 'No pudimos acceder a tu ubicación. Completá el campo a mano.';
      status.classList.add('is-visible');
      locationBtn.disabled = false;
      locationBtn.textContent = 'Usar mi ubicación actual';
    }, { timeout: 10000 });
  });

  form.addEventListener('submit', function(e){
    e.preventDefault();
    if (!form.checkValidity()){
      form.reportValidity();
      return;
    }

    var payload = new URLSearchParams({
      nombre: nameInput.value.trim(),
      telefono: document.getElementById('qPhone').value.trim(),
      email: document.getElementById('qEmail').value.trim(),
      ubicacion: locationInput.value.trim(),
      mensaje: document.getElementById('qMessage').value.trim(),
      pagina: window.location.pathname.split('/').pop() || 'index.html'
    });

    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando…';
    status.classList.remove('is-visible');

    fetch(SHEET_WEBHOOK_URL, {
      method: 'POST',
      mode: 'no-cors',
      body: payload
    }).then(function(){
      status.textContent = '¡Gracias! Te contactamos a la brevedad.';
      status.classList.add('is-visible');
      submitBtn.disabled = false;
      submitBtn.textContent = 'Enviar cotización';
      form.reset();
      setTimeout(closeModal, 2200);
    }).catch(function(){
      status.textContent = 'No pudimos enviar tu consulta. Revisá tu conexión e intentá de nuevo.';
      status.classList.add('is-visible');
      submitBtn.disabled = false;
      submitBtn.textContent = 'Enviar cotización';
    });
  });
})();
