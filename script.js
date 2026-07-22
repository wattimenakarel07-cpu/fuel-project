document.addEventListener('DOMContentLoaded', function() {

  // ===== DATA DIAMBIL DARI FIREBASE =====
  let dataScanSaatIni = null;
  let html5QrCode = null;

  // ===== 0. LOAD RIWAYAT DARI LOCALSTORAGE SAAT BUKA APP =====
  loadRiwayat();

  // ===== 1. LOGIKA GANTI TAB =====
  document.querySelectorAll('.nav-link,.quick-action-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const target = btn.getAttribute('href')?.replace('#','') || btn.dataset.target;

      document.querySelectorAll('.content-section').forEach(sec => sec.classList.remove('active'));
      document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));

      const section = document.getElementById(target);
      const navLink = document.querySelector(`.nav-link[href="#${target}"]`);
      if(section) section.classList.add('active');
      if(navLink) navLink.classList.add('active');

      if(target === 'scan') {
        startScanner();
      } else {
        stopScanner();
      }
    });
  });

  // ===== 2. FUNGSI SCANNER QR =====
  function startScanner() {
    const qrReader = document.getElementById('qrReader');
    if(!qrReader) return;
    if(html5QrCode) return;

    html5QrCode = new Html5Qrcode("qrReader");
    const config = { fps: 10, qrbox: { width: 250, height: 250 } };

    html5QrCode.start({ facingMode: "environment" }, config, onScanSuccess)
  .catch(err => {
      const scanResult = document.getElementById('scanResult');
      if(scanResult) scanResult.innerHTML = `<p style="color:var(--danger)">Gagal buka kamera. Izinkan akses kamera dulu.</p>`;
    });
  }

  function stopScanner() {
    if(html5QrCode) {
      html5QrCode.stop().then(() => {
        html5QrCode.clear();
        html5QrCode = null;
      }).catch(err => console.log(err));
    }
  }

  // ===== 3. SAAT QR BERHASIL DI SCAN =====
  async function onScanSuccess(decodedText) {
    stopScanner();
    const id = decodedText.trim();
console.log("QR Asli:", decodedText);
console.log("ID yang dicari:", id);

    const dataUser = await getKaryawan(id);

    const resultDiv = document.getElementById("scanResult");
    const userCard = document.getElementById("userInfoCard");

    if (dataUser) {
        dataScanSaatIni = {
    id: id,
    ...dataUser
};

        if(resultDiv) resultDiv.innerHTML = `
        <div style="background:#0f172a;padding:15px;border-radius:12px;border:1px solid #22c55e;">
            <h3 style="color:#22c55e;margin-bottom:10px;">✅ Data ditemukan</h3>
            <p><b>Nama :</b> ${dataUser.nama}</p>
            <p><b>ID :</b> ${id}</p>
            <p><b>Departemen :</b> ${dataUser.departemen}</p>
            <p><b>Status :</b> ${dataUser.status}</p>
        </div>`;

        if(userCard) userCard.hidden = false;

        const infoNama = document.getElementById("infoNama");
        const infoID = document.getElementById("infoID");
        const infoDepartemen = document.getElementById("infoDepartemen");
        const infoStatus = document.getElementById("infoStatus");
        const userPhoto = document.getElementById("userPhoto");

        if(infoNama) infoNama.innerText = dataUser.nama;
        if(infoID) infoID.innerText = id;
        if(infoDepartemen) infoDepartemen.innerText = dataUser.departemen;
        if(userPhoto && dataUser.foto) userPhoto.src = dataUser.foto;

        // ===== 4. WARNA STATUS =====
        if(infoStatus){
            infoStatus.innerText = dataUser.status;
            if(dataUser.status === "DIJINKAN"){
                infoStatus.style.background="#22c55e";
            }else{
                infoStatus.style.background="#ef4444";
            }
        }

    } else {
        if(resultDiv) resultDiv.innerHTML = "<p style='color:red;font-weight:bold'>DATA TIDAK DITEMUKAN</p>";
        if(userCard) userCard.hidden = true;
    }

    setTimeout(startScanner, 3000);
  }

  // ===== 4. LOGIKA SIMPAN FORM =====
  const form = document.getElementById('formAktivitas');
  if(form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      if(!dataScanSaatIni) {
        alert("Scan QR Karyawan dulu!");
        return;
      }

      const aktivitas = {
        tanggal: new Date().toLocaleString('id-ID'),
        nama: dataScanSaatIni.nama,
        id: dataScanSaatIni.id,
        jenisBBM: document.getElementById('jenisBBM').value,
        liter: document.getElementById('jumlahLiter').value,
        kendaraan: document.getElementById('nomorKendaraan').value,
        operator: "Petugas",
        sync: false // 1. TAMBAH INI
      };

      tambahKeRiwayat(aktivitas);

      // ===== 5. SIMPAN KE LOCALSTORAGE =====
      let riwayat = JSON.parse(localStorage.getItem("riwayat")) || [];
      riwayat.unshift(aktivitas);
      localStorage.setItem("riwayat", JSON.stringify(riwayat));

      // ===== 9. COBA SIMPAN KE FIREBASE JIKA ONLINE =====
      if(navigator.onLine) {
          const berhasil = await simpanKeFirebase(aktivitas);
          if(berhasil) {
              aktivitas.sync = true;
              // 2. UPDATE LOCALSTORAGE BIAR GAK KE-SYNC 2X
              const index = riwayat.findIndex(item => item.tanggal === aktivitas.tanggal && item.id === aktivitas.id);
              if(index!== -1) riwayat[index].sync = true;
              localStorage.setItem("riwayat", JSON.stringify(riwayat));
          }
      }

      alert(`Data ${aktivitas.nama} berhasil disimpan!`);
      form.reset();
      const userCard = document.getElementById('userInfoCard');
      if(userCard) userCard.hidden = true;
      dataScanSaatIni = null;
    });
  }

  // ===== 5. FUNGSI TAMBAH KE TABEL RIWAYAT =====
  function tambahKeRiwayat(data) {
    const tbody = document.getElementById('riwayatTableBody');
    if(!tbody) return;
    const row = `
      <tr>
        <td>${data.tanggal}</td>
        <td>${data.nama}</td>
        <td>${data.jenisBBM}</td>
        <td>${data.liter} L</td>
        <td>${data.operator}</td>
      </tr>
    `;
    tbody.insertAdjacentHTML('afterbegin', row);
  }

  // ===== 6. LOAD RIWAYAT DARI LOCALSTORAGE =====
  function loadRiwayat(){
    const tbody = document.getElementById("riwayatTableBody");
    if(!tbody) return;
    tbody.innerHTML="";
    const riwayat = JSON.parse(localStorage.getItem("riwayat")) || [];
    riwayat.forEach(data=>{
        tbody.insertAdjacentHTML("beforeend",`
        <tr>
        <td>${data.tanggal}</td>
        <td>${data.nama}</td>
        <td>${data.jenisBBM}</td>
        <td>${data.liter} L</td>
        <td>${data.operator}</td>
        </tr>
        `);
    });
  }

  // ===========================
  // PILIH QR DARI GALERI
  // ===========================
  const galleryBtn = document.getElementById("galleryBtn");
  const galleryInput = document.getElementById("galleryInput");

  if(galleryBtn && galleryInput) {
      galleryBtn.addEventListener("click", () => {
          galleryInput.click();
      });

      galleryInput.addEventListener("change", async (e) => {
          const file = e.target.files[0];
          if (!file) return;

          // ===== 2. STOP SCANNER DULU =====
          if (html5QrCode && html5QrCode.isScanning) {
              await html5QrCode.stop();
          }

          try {
              if (!html5QrCode) {
                  html5QrCode = new Html5Qrcode("qrReader");
              }
              const decodedText = await html5QrCode.scanFile(file, true);
              onScanSuccess(decodedText);
          } catch (err) {
              const scanResult = document.getElementById("scanResult");
              if(scanResult) scanResult.innerHTML = "<p style='color:red'>QR Code tidak ditemukan pada gambar.</p>";
          }
      });
  }

  // ===== 10. FUNGSI SIMPAN KE FIREBASE =====
  async function simpanKeFirebase(data) {
      try {
          await db.collection("riwayat").add(data);
          console.log("Tersimpan ke Firebase:", data.nama);
          return true;
      } catch(error) {
          console.error("Gagal ke Firebase:", error);
          return false;
      }
  }

  // ===== 11. FUNGSI SINKRONISASI OTOMATIS =====
  async function sinkronkanRiwayat() {
      let riwayat = JSON.parse(localStorage.getItem("riwayat")) || [];
      if(riwayat.length === 0) return;

      const riwayatBelumSync = riwayat.filter(item =>!item.sync);

      if(riwayatBelumSync.length > 0) {
          for(let i = 0; i < riwayatBelumSync.length; i++) {
              const berhasil = await simpanKeFirebase(riwayatBelumSync[i]);
              if(berhasil) {
                  riwayatBelumSync[i].sync = true;
              }
          }
          localStorage.setItem("riwayat", JSON.stringify(riwayat));
          alert(`${riwayatBelumSync.length} data berhasil disinkronkan`);
      }
  }

  // Auto sync saat online
  window.addEventListener('online', () => {
      sinkronkanRiwayat();
  });
const btnTest = document.getElementById("btnTestFirebase");

if (btnTest) {
    btnTest.addEventListener("click", async () => {

        const id = "2409059";

        const data = await getKaryawan(id);

        if (!data) {
            alert("Data tidak ditemukan!");
            return;
        }

        document.getElementById("infoNama").innerText = data.nama || "-";
        document.getElementById("infoID").innerText = id;
        document.getElementById("infoDepartemen").innerText = data.departemen || "-";
        document.getElementById("infoStatus").innerText = data.status || "-";

        if (data.foto) {
            document.getElementById("userPhoto").src = data.foto;
        }

        document.getElementById("userInfoCard").hidden = false;

        alert("Berhasil mengambil data dari Firebase!");
    });
}

}); // penutup DOMContentLoaded