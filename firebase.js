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

console.log("=================================");
console.log("Firebase berhasil diinisialisasi");
console.log("Project :", firebase.app().options.projectId);
console.log("=================================");

// ======================================================
// FUNGSI AMBIL DATA KARYAWAN - VERSI DEBUG
// ======================================================
        const snapshot = await db.collection("karyawan").get();

        alert("Jumlah dokumen: " + snapshot.size);

        snapshot.forEach(doc => {
            alert("ID: " + doc.id);
        });

        return null;

    } catch (error) {
        alert(error.message);
        console.error(error);
        return null;
    }
}

    try {
        const docRef = db.collection("karyawan").doc(cleanId);
        const doc = await docRef.get();
alert("Doc Exists = " + doc.exists);
alert(error.message);

        console.log("2. Doc Exists:", doc.exists);

        if(doc.exists){
            console.log("3. DATA KETEMU:", doc.data());
            return doc.data();
        }else{
            // Ini penting: kasih tau semua ID yg ada di Firebase
            console.warn("3. DATA TIDAK ADA untuk ID:", cleanId);
            console.log("Cek semua data di collection 'karyawan'...");
            const snapshot = await db.collection("karyawan").get();
            snapshot.forEach(d => console.log("ID di Firebase:", d.id));
            return null;
        }

    }catch(error){
        console.error("ERROR FIREBASE:", error);
        alert("Error koneksi Firebase: " + error.message);
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