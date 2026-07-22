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

// ======================================================
// FIRESTORE DATABASE
// ======================================================

const db = firebase.firestore();

// ======================================================
// FUNGSI AMBIL DATA KARYAWAN
// ======================================================

async function getKaryawan(id) {

    console.log("Mencari:", id);

    try {

        const doc = await db.collection("karyawan").doc(id).get();

        console.log("Doc Exists:", doc.exists);

        if(doc.exists){

            console.log(doc.data());

            return doc.data();

        }else{

            console.log("DATA TIDAK ADA");

            return null;

        }

    }catch(error){

        console.error("ERROR FIREBASE:", error);

        return null;

    }

}
// ======================================================
// FUNGSI TAMBAH KARYAWAN
// ======================================================

async function tambahKaryawan(id, data) {
  try {
    await db.collection("karyawan").doc(id).set(data);
    alert("Data karyawan berhasil disimpan.");
  } catch (error) {
    console.error(error);
    alert("Gagal menyimpan data.");
  }
}

// ======================================================
// FUNGSI UPDATE KARYAWAN
// ======================================================

async function updateKaryawan(id, data) {
  try {
    await db.collection("karyawan").doc(id).update(data);
    alert("Data berhasil diperbarui.");
  } catch (error) {
    console.error(error);
  }
}

// ======================================================
// FUNGSI HAPUS KARYAWAN
// ======================================================

async function hapusKaryawan(id) {
  try {
    await db.collection("karyawan").doc(id).delete();
    alert("Data berhasil dihapus.");
  } catch (error) {
    console.error(error);
  }
}

// ==============================
// TEST KONEKSI FIREBASE
// ==============================

db.collection("karyawan")
  .doc("hfnc-kwp-2409059")
  .get()
  .then((doc) => {

    alert("Firebase jalan");

    if (doc.exists) {

      alert("Nama : " + doc.data().nama);

    } else {

      alert("Data tidak ditemukan");

    }

  })
  .catch((error) => {

    alert(error.message);

  });