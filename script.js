document.addEventListener('DOMContentLoaded', function() {

  // ===== DATA DUMMY. NANTI GANTI KE FIREBASE =====
  const databaseKaryawan = {
    "EMP001": { nama: "BUDI SANTOSO", id: "EMP001", departemen: "OPERATOR", jabatan: "Staff", status: "DIJINKAN", foto: "https://placehold.co/80x80/22c55e/ffffff?text=B" },
    "EMP002": { nama: "SITI AMINAH", id: "EMP002", departemen: "SUPERVISOR", jabatan: "SPV", status: "DIJINKAN", foto: "https://placehold.co/80x80/22c55e/ffffff?text=S" },
    "EMP003": { nama: "JOKO WIDODO", id: "EMP003", departemen: "HELPER", jabatan: "Staff", status: "DITOLAK - KUOTA HABIS", foto: "https://placehold.co/80x80/ef4444/ffffff?text=J" }
  }

  let dataScanSaatIni = null;
  let html5QrCode = null;

  // ===== 1. LOGIKA GANTI TAB =====
  document.querySelectorAll('.nav-link, .quick-action-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const target = btn.getAttribute('href')?.replace('#','') || btn.dataset.target;
      
      document.querySelectorAll('.content-section').forEach(sec => sec.classList.remove('active'));
      document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
      
      document.getElementById(target).classList.add('active');
      document.querySelector(`.nav-link[href="#${target}"]`)?.classList.add('active');

      if(target === 'scan') {
        startScanner();
      } else {
        stopScanner();
      }
    });
  });

  // ===== 2. FUNGSI SCANNER QR =====
  function startScanner() {
    if(html5QrCode) return;
    if(!document.getElementById('qrReader')) return;

    html5QrCode = new Html5Qrcode("qrReader");
    const config = { fps: 10, qrbox: { width: 250, height: 250 } };

    html5QrCode.start({ facingMode: "environment" }, config, onScanSuccess)
    .catch(err => {
      document.getElementById('scanResult').innerHTML = `<p style="color:var(--danger)">Gagal buka kamera. Izinkan akses kamera dulu.</p>`;
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

    const dataUser = await getKaryawan(id);

    const resultDiv = document.getElementById("scanResult");
    const userCard = document.getElementById("userInfoCard");

    if (dataUser) {

        dataScanSaatIni = dataUser;

        resultDiv.innerHTML =
            "<p style='color:lime;font-weight:bold'>SCAN BERHASIL</p>";

        userCard.hidden = false;

        document.getElementById("infoNama").innerText = dataUser.nama;
        document.getElementById("infoID").innerText = id;
        document.getElementById("infoDepartemen").innerText = dataUser.departemen;
        document.getElementById("infoStatus").innerText = dataUser.status;

        if (dataUser.foto) {
            document.getElementById("userPhoto").src = dataUser.foto;
        }

    } else {

        resultDiv.innerHTML =
            "<p style='color:red;font-weight:bold'>DATA TIDAK DITEMUKAN</p>";

        userCard.hidden = true;
    }

    setTimeout(startScanner, 3000);
}

  // ===== 4. LOGIKA SIMPAN FORM =====
  const form = document.getElementById('formAktivitas');
  if(form) {
    form.addEventListener('submit', (e) => {
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
        operator: "Petugas"
      };

      tambahKeRiwayat(aktivitas);
      alert(`Data ${aktivitas.nama} berhasil disimpan!`);
      form.reset();
      document.getElementById('userInfoCard').hidden = true;
      dataScanSaatIni = null;
    });
  }

  // ===== 5. FUNGSI TAMBAH KE TABEL RIWAYAT =====
  function tambahKeRiwayat(data) {
    const tbody = document.getElementById('riwayatTableBody');
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
// ===========================
// PILIH QR DARI GALERI
// ===========================

const galleryBtn = document.getElementById("galleryBtn");
const galleryInput = document.getElementById("galleryInput");

// Cek dulu ada apa enggak
if(galleryBtn) {
    galleryBtn.addEventListener("click", () => {
        galleryInput.click();
    });

    galleryInput.addEventListener("change", async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            if (!html5QrCode) {
                html5QrCode = new Html5Qrcode("qrReader");
            }
            const decodedText = await html5QrCode.scanFile(file, true);
            onScanSuccess(decodedText);
        } catch (err) {
            document.getElementById("scanResult").innerHTML =
            "<p style='color:red'>QR Code tidak ditemukan pada gambar.</p>";
        }
    });
}

});