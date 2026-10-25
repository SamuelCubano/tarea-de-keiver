// Portal Trámites & Impuestos
document.addEventListener('DOMContentLoaded', () => {
  // Loader
  setTimeout(() => document.getElementById('loader')?.classList.add('hidden'), 900);

  // Clock
  const clock = document.getElementById('clock');
  setInterval(() => { if (clock) clock.textContent = new Date().toLocaleTimeString('es'); }, 1000);

  // Toast helper
  function toast(msg, type = 'info') {
    const stack = document.getElementById('toastStack');
    const el = document.createElement('div');
    el.className = 'toast ' + type;
    el.innerHTML = `<div class="toast-ico"><svg viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></svg></div><div><b>${msg}</b></div>`;
    stack.appendChild(el);
    setTimeout(() => { el.classList.add('out'); setTimeout(() => el.remove(), 400); }, 2600);
  }

  // Modal helper
  function modal(html) {
    document.getElementById('modalBody').innerHTML = html;
    document.getElementById('modalBackdrop').classList.add('open');
  }
  document.getElementById('modalClose').onclick = () => document.getElementById('modalBackdrop').classList.remove('open');
  document.getElementById('modalBackdrop').onclick = (e) => { if (e.target.id === 'modalBackdrop') e.currentTarget.classList.remove('open'); };

  // GSAP reveal
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    gsap.utils.toArray('.section').forEach(s => {
      gsap.from(s, { opacity: 0, y: 40, duration: 0.8, scrollTrigger: { trigger: s, start: 'top 85%' } });
    });
  }

  // Counters
  document.querySelectorAll('.counter').forEach(c => {
    const t = +c.dataset.target; let v = 0;
    const iv = setInterval(() => { v = Math.min(t, v + Math.ceil(t / 40)); c.textContent = v; if (v >= t) clearInterval(iv); }, 40);
  });

  // Burger
  document.getElementById('burger')?.addEventListener('click', () => document.getElementById('menu').classList.toggle('open'));

  // Identificar
  document.getElementById('btnIdentificar')?.addEventListener('click', () => {
    const u = prompt('Ingrese su cédula/usuario:');
    if (u) { document.getElementById('userChipText').textContent = u; toast('Identidad registrada: ' + u, 'info'); }
  });

  // === MODULO 1 ===
  let m1Auth = false, m1Multas = false, m1Med = false;
  const m1tarifa = { 1: 25, 2: 45, 5: 100 };
  document.getElementById('m1vigencia').addEventListener('change', (e) => {
    const v = +e.target.value;
    document.getElementById('m1tarifa').textContent = '$' + m1tarifa[v];
  });
  document.getElementById('m1auth').onclick = () => {
    const u = document.getElementById('m1user').value.trim();
    if (!u) { toast('Ingrese credencial digital', 'err'); return; }
    m1Auth = true;
    document.getElementById('m1id').textContent = 'OK';
    toast('Identidad autenticada', 'info');
  };
  document.getElementById('m1multasBtn').onclick = () => {
    if (!m1Auth) { toast('Primero autentique la identidad', 'err'); return; }
    setTimeout(() => {
      m1Multas = true;
      document.getElementById('m1multas').textContent = '0';
      document.getElementById('m1multasChip').textContent = 'Sin multas';
      document.getElementById('m1multasChip').className = 'kpi-chip ok';
      toast('Sin multas vigentes — habilitado', 'info');
    }, 700);
  };
  document.getElementById('m1medBtn').onclick = () => {
    if (!m1Auth) { toast('Primero autentique la identidad', 'err'); return; }
    setTimeout(() => {
      m1Med = true;
      document.getElementById('m1med').textContent = 'Apto';
      document.getElementById('m1medChip').textContent = 'Apto';
      toast('Certificado médico validado', 'info');
    }, 700);
  };
  document.getElementById('m1pay').onclick = () => {
    if (!m1Auth || !m1Multas || !m1Med) { toast('Complete todos los pasos previos', 'err'); return; }
    const v = +document.getElementById('m1vigencia').value;
    const qr = 'QR-' + Math.random().toString(36).slice(2, 10).toUpperCase();
    document.getElementById('m1status').textContent = 'Emitida';
    document.getElementById('m1licencia').innerHTML = `
      <div style="padding:16px;border-radius:18px;background:rgba(74,169,108,.12);border:1px solid rgba(74,169,108,.3);">
        <b style="font-family:var(--font-h);color:var(--green-900);font-size:1.2rem;">Licencia Digital</b>
        <p style="margin:8px 0;font-size:.85rem;">Vigencia: ${v} año(s) · Tarifa: $${m1tarifa[v]}</p>
        <div style="font-family:monospace;font-size:1.1rem;color:var(--sky-700);margin:10px 0;">${qr}</div>
        <small style="color:var(--ink-soft);">Código QR dinámico de verificación inmediata</small>
      </div>`;
    toast('Licencia emitida con QR dinámico', 'info');
  };

  // === MODULO 2 ===
  const predios = { 'CL-000-000': { avaluo: 1200, descuento: 10 }, 'CL-123-456': { avaluo: 3400, descuento: 5 } };
  document.getElementById('m2buscar').onclick = () => {
    const c = document.getElementById('m2clave').value.trim();
    const p = predios[c] || { avaluo: 1800, descuento: 8 };
    const total = p.avaluo - p.avaluo * (p.descuento / 100);
    document.getElementById('m2info').innerHTML = `<div style="padding:12px;border-radius:14px;background:rgba(255,255,255,.7);">
      <b>Avalúo: $${p.avaluo}</b> · Descuento: ${p.descuento}% · <b>Total: $${total.toFixed(2)}</b></div>`;
    toast('Predio encontrado', 'info');
  };
  document.getElementById('m2form').addEventListener('submit', (e) => {
    e.preventDefault();
    const c = document.getElementById('m2clave').value.trim();
    const p = predios[c] || { avaluo: 1800, descuento: 8 };
    const total = p.avaluo - p.avaluo * (p.descuento / 100);
    const qr = 'REC-' + Math.random().toString(36).slice(2, 10).toUpperCase();
    document.getElementById('m2status').textContent = 'Pagado';
    document.getElementById('m2recibo').innerHTML = `
      <div style="padding:16px;border-radius:18px;background:rgba(74,169,108,.12);border:1px solid rgba(74,169,108,.3);">
        <b style="font-family:var(--font-h);color:var(--green-900);">Recibo Oficial</b>
        <p style="margin:6px 0;font-size:.85rem;">Clave: ${c} · Total: $${total.toFixed(2)}</p>
        <div style="font-family:monospace;font-size:1.1rem;color:var(--sky-700);margin:10px 0;">${qr}</div>
        <small style="color:var(--ink-soft);">QR de validación fiscal · Estado: Pagado</small>
      </div>`;
    toast('Pago procesado — inmueble actualizado a Pagado', 'info');
  });

  // === MODULO 3 ===
  let m3Auth = false;
  document.getElementById('m3auth').onclick = () => {
    const u = document.getElementById('m3user').value.trim();
    if (!u) { toast('Ingrese cédula', 'err'); return; }
    m3Auth = true;
    document.getElementById('m3status').textContent = 'Autenticado';
    toast('Ciudadano autenticado', 'info');
  };
  document.getElementById('m3consultar').onclick = () => {
    if (!m3Auth) { toast('Primero autentique', 'err'); return; }
    toast('Acta original localizada en repositorio demográfico', 'info');
  };
  document.getElementById('m3generar').onclick = () => {
    if (!m3Auth) { toast('Primero autentique', 'err'); return; }
    const csv = 'CSV-' + Math.random().toString(36).slice(2, 12).toUpperCase();
    document.getElementById('m3acta').innerHTML = `
      <div style="padding:16px;border-radius:18px;background:rgba(74,169,108,.12);border:1px solid rgba(74,169,108,.3);">
        <b style="font-family:var(--font-h);color:var(--green-900);">Acta de Nacimiento Digital</b>
        <p style="margin:6px 0;font-size:.85rem;">Firmada electrónicamente · PDF/A · Sello TSA</p>
        <div style="font-family:monospace;font-size:1.1rem;color:var(--sky-700);margin:10px 0;">${csv}</div>
        <small style="color:var(--ink-soft);">CSV / QR de verificación externa</small>
      </div>`;
    document.getElementById('m3descargar').disabled = false;
    toast('Acta generada con firma y sello de tiempo', 'info');
  };
  document.getElementById('m3descargar').onclick = () => toast('Descargando acta PDF...', 'info');

  // KPIs
  let t = 0, p = 0, a = 0;
  setInterval(() => { t++; p++; a++; document.getElementById('kpiTramites').textContent = t; document.getElementById('kpiPagos').textContent = p; document.getElementById('kpiActas').textContent = a; }, 4000);
});
