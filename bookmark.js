
(function(){
  console.log('Menjalankan form koreksi otomatis...');
  const t = new Date(), d = t.getDate(), m = t.getMonth() + 1;
  const formPopup = document.createElement('div');
  formPopup.id = 'formKoreksiPopup';
  Object.assign(formPopup.style, {
    position: 'fixed',
    top: '10%',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    borderRadius: '12px',
    padding: '20px',
    zIndex: '9999',
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
    width: '60%',
    maxWidth: '1000px',
    opacity: '0',
    transition: 'opacity 0.3s ease'
  });

  const payOptions = ['HSPAY','LNPAY','ONPAY','POPAY','VTPAY']
    .map(opt => `<option value="${opt}">${opt}</option>`).join('');
  const allOpts = Array.from(document.querySelectorAll('select.rekadd option'));
  const mapRek = {};
  const labelOptions = allOpts.map(opt => {
    const label = opt.textContent.trim().toUpperCase();
    mapRek[label] = opt.value;
    return `<option value="${label}">${label}</option>`;
  }).join('');

  formPopup.innerHTML = `
  <style>
    .form-row { display: flex; justify-content: space-between; gap: 10px; margin-bottom: 15px; flex-wrap: wrap; }
    .form-col { flex: 1; display: flex; flex-direction: column; min-width: 120px; }
    .form-col.shortest { flex: 0 0 50px; }
    .form-col.rek-asal { flex: 0 0 140px; }
    .form-col label { margin-bottom: 5px; font-weight: bold; font-size: 13px; }
    .form-col input, .form-col select { padding: 8px; border: 1px solid #ccc; border-radius: 10px; }
    .button-row { display: flex; justify-content: flex-end; gap: 10px; margin-top: 10px; }
    .btn-success { background-color: #4CAF50; border: none; padding: 10px 20px; color: white; border-radius: 20px; cursor: pointer; font-weight: bold; }
    .btn-danger { background-color: #f44336; border: none; padding: 10px 20px; color: white; border-radius: 20px; cursor: pointer; font-weight: bold; }
    .credit { text-align: center; margin-top: 15px; font-size: 12px; color: #999; }
    @keyframes glowSuccess {
      0% { box-shadow: 0 0 5px lime; background-color: #4CAF50; }
      50% { box-shadow: 0 0 20px lime; background-color: #43A047; }
      100% { box-shadow: 0 0 5px lime; background-color: #4CAF50; }
    }
    .glowSuccess { animation: glowSuccess 0.8s ease; color: white; }
  </style>
  <div class="form-row">
    <div class="form-col rek-asal">
      <label>Jenis Payment</label>
      <select id="paySource">${payOptions}</select>
    </div>
    <div class="form-col">
      <label>Rek Tujuan</label>
      <input list="rekeningList" id="targetBank" placeholder="Rek Tujuan">
    </div>
    <div class="form-col">
      <label>Jumlah</label>
      <input type="text" id="amountInput" placeholder="Jumlah">
    </div>
    <div class="form-col shortest">
      <label>Tgl</label>
      <input type="number" id="tglInput" value="${d}" min="1" max="31">
    </div>
    <div class="form-col shortest">
      <label>Bulan</label>
      <input type="number" id="blnInput" value="${m}" min="1" max="12">
    </div>
  </div>
  <datalist id="rekeningList">${labelOptions}</datalist>
  <div class="button-row">
    <button id="submitKoreksi" class="btn-success">KONFIRMASI</button>
    <button id="closePopup" class="btn-danger">BATALKAN</button>
  </div>
  <div class="credit">Credit: Dhika</div>`;

  document.body.appendChild(formPopup);
  requestAnimationFrame(() => formPopup.style.opacity = '1');

  document.getElementById('amountInput').addEventListener('input', function() {
    let v = this.value.replace(/\D/g,'');
    this.value = v.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  });

  document.getElementById('closePopup').onclick = function() {
    document.body.removeChild(formPopup);
  };

  document.getElementById('submitKoreksi').onclick = function() {
    const src = document.getElementById('paySource').value.trim(),
          label = document.getElementById('targetBank').value.trim().toUpperCase(),
          bank = mapRek[label],
          amt = parseFloat(document.getElementById('amountInput').value.replace(/\./g,'')),
          tgl = document.getElementById('tglInput').value,
          bln = document.getElementById('blnInput').value;
    if (!src || !bank || !amt || !tgl || !bln) {
      alert('Harap isi semua kolom!');
      return;
    }
    document.querySelector('select.rekadd').value = bank;
    document.querySelector('select.catadd').value = 'KOREKSI';
    document.querySelector('select.opadd').value = 'plus';
    document.querySelector('input.amountadd').value = amt;
    document.querySelector('input.deskripsiadd').value = `UANG MASUK DARI ${src} ${tgl}/${bln}`;
    console.log('Entri koreksi berhasil:', document.querySelector('input.deskripsiadd').value);
    this.classList.add('glowSuccess');
    setTimeout(() => {
      document.body.removeChild(formPopup);
      document.querySelector('a.btn-success').click();
    }, 850);
  };
})();
