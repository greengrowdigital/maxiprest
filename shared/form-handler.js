/* MaxiPrest — Lógica del formulario, validación, uploads y submit */
(function () {
  const WEBHOOK_URL = 'https://gaelale.app.n8n.cloud/webhook/maxiprest-application';
  const PHONE_INTL = '50765180901';
  const MAX_FILE_MB = 5;
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];

  const ICON_DOC = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M9 13h6M9 17h6"/></svg>`;

  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.from((ctx || document).querySelectorAll(sel)); }
  function fmtSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }

  function calcAge(birthStr) {
    if (!birthStr) return 0;
    const b = new Date(birthStr);
    if (isNaN(b)) return 0;
    const now = new Date();
    let age = now.getFullYear() - b.getFullYear();
    const m = now.getMonth() - b.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < b.getDate())) age--;
    return age;
  }

  function setError(field, msg) {
    const wrapper = field.closest('.mp-field') || field.parentElement;
    if (!wrapper) return;
    wrapper.classList.add('is-error');
    let err = wrapper.querySelector('.mp-error-msg');
    if (err && msg) err.textContent = msg;
  }
  function clearError(field) {
    const wrapper = field.closest('.mp-field') || field.parentElement;
    if (wrapper) wrapper.classList.remove('is-error');
  }

  function initUpload(zone) {
    const input = zone.querySelector('input[type=file]');
    const preview = zone.querySelector('.mp-upload-preview');
    const thumb = zone.querySelector('.mp-upload-thumb');
    const nameEl = zone.querySelector('.mp-upload-name');
    const sizeEl = zone.querySelector('.mp-upload-size');
    const removeBtn = zone.querySelector('.mp-upload-remove');
    const errMsg = zone.parentElement.querySelector('.mp-error-msg');

    function showError(text) {
      if (errMsg) { errMsg.textContent = text; }
      zone.parentElement.classList.add('is-error');
    }
    function clearErr() { zone.parentElement.classList.remove('is-error'); }

    function setFile(file) {
      if (!file) return;
      if (!ALLOWED_TYPES.includes(file.type)) {
        showError('Formato no permitido. Usa JPG, PNG, WEBP o PDF.');
        input.value = '';
        return;
      }
      if (file.size > MAX_FILE_MB * 1024 * 1024) {
        showError(`El archivo supera ${MAX_FILE_MB}MB.`);
        input.value = '';
        return;
      }
      clearErr();
      nameEl.textContent = file.name;
      sizeEl.textContent = fmtSize(file.size);
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          thumb.innerHTML = `<img src="${e.target.result}" alt="">`;
        };
        reader.readAsDataURL(file);
      } else {
        thumb.innerHTML = ICON_DOC;
      }
      zone.classList.add('has-file');
    }

    input.addEventListener('change', (e) => {
      const f = e.target.files && e.target.files[0];
      if (f) setFile(f);
    });

    ['dragenter', 'dragover'].forEach(ev => zone.addEventListener(ev, (e) => {
      e.preventDefault(); e.stopPropagation();
      zone.classList.add('is-dragover');
    }));
    ['dragleave', 'drop'].forEach(ev => zone.addEventListener(ev, (e) => {
      e.preventDefault(); e.stopPropagation();
      zone.classList.remove('is-dragover');
    }));
    zone.addEventListener('drop', (e) => {
      const f = e.dataTransfer.files && e.dataTransfer.files[0];
      if (f) {
        const dt = new DataTransfer();
        dt.items.add(f);
        input.files = dt.files;
        setFile(f);
      }
    });

    if (removeBtn) removeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      input.value = '';
      zone.classList.remove('has-file');
      thumb.innerHTML = ICON_DOC;
    });
  }

  function validate(form) {
    let valid = true;
    $$('.mp-field.is-error', form).forEach(f => f.classList.remove('is-error'));

    const requiredFields = $$('input[data-required="true"], select[data-required="true"], textarea[data-required="true"]', form);
    requiredFields.forEach(field => {
      if (field.type === 'file') return;
      const val = (field.value || '').trim();
      if (!val) { setError(field, 'Campo obligatorio'); valid = false; }
    });

    const email = form.email;
    if (email && email.value && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.value)) {
      setError(email, 'Email no válido'); valid = false;
    }

    const tel = form.telefono;
    if (tel && tel.value && !/^\d{4}-?\d{4}$/.test(tel.value.replace(/\s/g, ''))) {
      setError(tel, 'Teléfono panameño (8 dígitos)'); valid = false;
    }

    const fNac = form.fechaNacimiento;
    if (fNac && fNac.value) {
      const age = calcAge(fNac.value);
      if (age < 20) { setError(fNac, 'Debes tener al menos 20 años'); valid = false; }
      if (age > 100) { setError(fNac, 'Fecha no válida'); valid = false; }
    }

    const ingreso = form.ingresoMensual;
    if (ingreso && ingreso.value) {
      const n = Number(ingreso.value);
      if (isNaN(n) || n < 600) { setError(ingreso, 'Ingreso mínimo B/. 600 para aplicar'); valid = false; }
    }

    const aTerm = form.aceptaTerminos;
    const aAPC = form.aceptaAPC;
    if (aTerm && !aTerm.checked) {
      aTerm.closest('.mp-check').style.color = 'var(--mp-error)';
      valid = false;
    } else if (aTerm) {
      aTerm.closest('.mp-check').style.color = '';
    }
    if (aAPC && !aAPC.checked) {
      aAPC.closest('.mp-check').style.color = 'var(--mp-error)';
      valid = false;
    } else if (aAPC) {
      aAPC.closest('.mp-check').style.color = '';
    }

    const pepRadios = form.querySelectorAll('input[name=esPEP]');
    if (pepRadios.length && !Array.from(pepRadios).some(r => r.checked)) {
      valid = false;
      pepRadios[0].closest('.mp-field')?.classList.add('is-error');
    }

    $$('.mp-upload[data-required="true"]', form).forEach(zone => {
      const input = zone.querySelector('input[type=file]');
      if (!input.files || !input.files.length) {
        zone.parentElement.classList.add('is-error');
        const errMsg = zone.parentElement.querySelector('.mp-error-msg');
        if (errMsg) errMsg.textContent = 'Documento obligatorio';
        valid = false;
      }
    });

    if (!valid) {
      const firstError = form.querySelector('.is-error');
      if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    return valid;
  }

  function buildWhatsAppSummary(form) {
    const f = new FormData(form);
    const lines = [
      '*NUEVA SOLICITUD DE PRESTAMO - MaxiPrest*',
      '',
      `*Nombre:* ${f.get('nombres')} ${f.get('apellidos')}`,
      `*Documento:* ${f.get('tipoDocumento')} ${f.get('documentoP1')}-${f.get('documentoP2')}`,
      `*Telefono:* +507 ${f.get('telefono')}`,
      `*Email:* ${f.get('email')}`,
      `*Monto solicitado:* ${f.get('montoSolicitado')}`,
      `*Lugar de trabajo:* ${f.get('lugarLabora')}`,
      `*Ingreso mensual:* B/. ${f.get('ingresoMensual')}`,
      `*Provincia trabajo:* ${f.get('provinciaTrabajo')}`,
      '',
      '_Los documentos completos fueron enviados al correo._',
      `_Enviado: ${new Date().toLocaleString('es-PA')}_`
    ];
    return lines.join('\n');
  }

  function showOverlay(state, opts) {
    let overlay = $('#mpOverlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'mp-overlay';
      overlay.id = 'mpOverlay';
      document.body.appendChild(overlay);
    }

    overlay.innerHTML = '';

    if (state === 'loading') {
      overlay.innerHTML = `
        <div class="mp-spinner"></div>
        <div class="mp-overlay-title">Enviando solicitud…</div>
        <div class="mp-overlay-sub">Estamos guardando tus documentos de forma segura.</div>
      `;
    } else if (state === 'success') {
      overlay.innerHTML = `
        <svg class="mp-check-svg" viewBox="0 0 100 100" aria-hidden="true">
          <circle cx="50" cy="50" r="40"/>
          <path d="M30 52 L45 67 L72 38"/>
        </svg>
        <div class="mp-overlay-title">¡Solicitud enviada!</div>
        <div class="mp-overlay-sub">Te contactaremos por WhatsApp en menos de 24 horas. Abrimos WhatsApp para darle seguimiento ahora mismo.</div>
        <a id="mpOverlayWa" class="mp-btn mp-btn-gold-solid" href="#">Abrir WhatsApp</a>
      `;
      if (opts && opts.whatsappUrl) {
        $('#mpOverlayWa').href = opts.whatsappUrl;
        setTimeout(() => { window.open(opts.whatsappUrl, '_blank'); }, 1400);
      }
    } else if (state === 'error') {
      overlay.innerHTML = `
        <svg width="80" height="80" viewBox="0 0 100 100" fill="none" stroke="#B91C1C" stroke-width="3" aria-hidden="true">
          <circle cx="50" cy="50" r="40"/>
          <path d="M35 35 L65 65 M65 35 L35 65"/>
        </svg>
        <div class="mp-overlay-title">No pudimos enviar tu solicitud</div>
        <div class="mp-overlay-sub">${(opts && opts.message) || 'Intenta de nuevo o contáctanos directamente por WhatsApp.'}</div>
        <div style="display:flex; gap:12px; flex-wrap:wrap; justify-content:center;">
          <button id="mpOverlayRetry" class="mp-btn mp-btn-gold">Reintentar</button>
          <a class="mp-btn mp-btn-ghost" href="https://wa.me/${PHONE_INTL}" target="_blank">Ir a WhatsApp</a>
        </div>
      `;
      $('#mpOverlayRetry').addEventListener('click', () => {
        overlay.classList.remove('is-active');
        document.body.style.overflow = '';
      });
    }

    overlay.classList.add('is-active');
    document.body.style.overflow = 'hidden';
  }

  async function submitApplication(form) {
    if (!validate(form)) return;

    const data = new FormData(form);
    data.append('submittedAt', new Date().toISOString());
    data.append('source', 'maxiprest-demo');

    showOverlay('loading');

    try {
      const res = await fetch(WEBHOOK_URL, { method: 'POST', body: data });
      if (!res.ok && res.status !== 200) {
        throw new Error('HTTP ' + res.status);
      }
      const waUrl = `https://wa.me/${PHONE_INTL}?text=${encodeURIComponent(buildWhatsAppSummary(form))}`;
      showOverlay('success', { whatsappUrl: waUrl });
      try { form.reset(); $$('.mp-upload.has-file').forEach(z => z.classList.remove('has-file')); } catch (e) {}
    } catch (err) {
      console.error('MaxiPrest submit error', err);
      showOverlay('error', { message: 'Hubo un problema enviando la solicitud. Revisa tu conexión e intenta de nuevo.' });
    }
  }

  function init() {
    const form = document.getElementById('mpForm');
    if (!form) return;

    $$('.mp-upload', form).forEach(initUpload);

    $$('.mp-input, .mp-select, .mp-textarea', form).forEach(field => {
      field.addEventListener('input', () => clearError(field));
      field.addEventListener('change', () => clearError(field));
    });

    const fNac = form.fechaNacimiento;
    if (fNac) {
      fNac.addEventListener('blur', () => {
        if (!fNac.value) return;
        const age = calcAge(fNac.value);
        if (age < 20) setError(fNac, 'Debes tener al menos 20 años para aplicar');
        else if (age > 100) setError(fNac, 'Fecha no válida');
      });
      fNac.addEventListener('change', () => {
        if (!fNac.value) return;
        const age = calcAge(fNac.value);
        if (age < 20) setError(fNac, 'Debes tener al menos 20 años para aplicar');
      });
    }

    const ingreso = form.ingresoMensual;
    if (ingreso) {
      const check = () => {
        if (!ingreso.value) return;
        const n = Number(ingreso.value);
        if (isNaN(n) || n < 600) setError(ingreso, 'Ingreso mínimo B/. 600 para aplicar');
      };
      ingreso.addEventListener('blur', check);
      ingreso.addEventListener('change', check);
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      submitApplication(form);
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
