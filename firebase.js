// ======================================================
// FIREBASE CONFIG
// Fuel Management System
// ======================================================

const firebaseConfig = {
  apiKey: "AIzaSyDvP56jnAHqdAq2uPaVMnk_4wBmMt5_bJM",
  authDomain: "fuel-project-e128c.firebaseapp.com",
  projectId: "fuel-project-e128c",
  storageBucket: "fuel-project-e128c.firebasestorage.app",
  messagingSenderId: "702150234067",
  appId: "1:702150234067:web:7ed98001051c15cec06926"
};

// ======================================================
// INISIALISASI FIREBASE
// ======================================================
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
alert("firebase.js berhasil dimuat");

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

alert("firebase.js berhasil dimuat");
alert(firebase.app().options.projectId);


// ===== BATAS AKHIR =====

console.log("=================================");
console.log("Firebase berhasil diinisialisasi");
console.log("Project :", firebase.app().options.projectId);
console.log("=================================");

console.log("=================================");
console.log("Firebase berhasil diinisialisasi");
console.log("Project :", firebase.app().options.projectId);
console.log("=================================");

// ======================================================
// FUNGSI AMBIL DATA KARYAWAN
// ======================================================
async function getKaryawan(id) {

    const cleanId = id.trim();

    try {

        const doc = await db.collection("karyawan").doc(cleanId).get();

        alert("Doc Exists = " + doc.exists);

        if (doc.exists) {
            return doc.data();
        }

        return null;

    } catch (error) {
        alert("Error Firebase: " + error.message);
        console.error(error);
        return null;
    }
}
// ======================================================
// FUNGSI TAMBAH KARYAWAN
// ======================================================
async function tambahKaryawan(id, data) {
  try {
    const cleanId = id.trim();
    await db.collection("karyawan").doc(cleanId).set(data);
    alert("Data karyawan berhasil disimpan: " + cleanId);
  } catch (error) {
    console.error(error);
    alert("Gagal menyimpan data: " + error.message);
  }
}

// ======================================================
// FUNGSI UPDATE & HAPUS
// ======================================================
async function updateKaryawan(id, data) {
  try {
    await db.collection("karyawan").doc(id.trim()).update(data);
    alert("Data berhasil diperbarui.");
  } catch (error) { console.error(error); }
}

async function hapusKaryawan(id) {
  try {
    await db.collection("karyawan").doc(id.trim()).delete();
    alert("Data berhasil dihapus.");
  } catch (error) { console.error(error); }
}

// ==============================
// HAPUS DULU TEST INI. UDAH GA DIPAKE
// ==============================
// db.collection("karyawan").doc("hfnc-kwp-2409059").get()...