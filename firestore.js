import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-app.js";
import { getFirestore, collection, doc, setDoc, deleteDoc, getDoc, getDocs, updateDoc, where,query } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBaCCt_zcOSjF5DtEura_GYwnXACXrfNFI",
    authDomain: "cut-clicker.firebaseapp.com",
    projectId: "cut-clicker",
    storageBucket: "cut-clicker.appspot.com",
    messagingSenderId: "109206316964",
    appId: "1:109206316964:web:afc1e39d157492a7ef8331",
    measurementId: "G-CQZJ9Y3EC5"
};

const app = initializeApp(firebaseConfig);
let db = getFirestore()

async function readData(_doc) {
    let data = await getDoc(doc(db, 'users', _doc))
    if (!data.exists()) return false
    return data.data()
}

async function readDataWhere(param1, param2, param3) {
    let data = await getDocs(query(collection(db, 'users'), where(param1, param2, param3)))
    return data.docs.map(doc => doc.data())
}

async function writeData(_doc, data) {
    await setDoc(doc(db, 'users', _doc), data)
}

async function updateData(_doc, data) {
    await updateDoc(doc(db, 'users', _doc), data)
}

async function getAllData() {
    let data = await getDocs(collection(db, 'users'))
    return data.docs.map(doc => doc.data())
}

export { readData, writeData, updateData, readDataWhere, getAllData }