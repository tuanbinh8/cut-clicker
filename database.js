import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-app.js";
import { getDatabase, ref, set, onValue, child, push, update, query, orderByChild } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyBaCCt_zcOSjF5DtEura_GYwnXACXrfNFI",
    authDomain: "cut-clicker.firebaseapp.com",
    databaseURL: "https://cut-clicker-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "cut-clicker",
    storageBucket: "cut-clicker.appspot.com",
    messagingSenderId: "109206316964",
    appId: "1:109206316964:web:afc1e39d157492a7ef8331",
    measurementId: "G-CQZJ9Y3EC5"
};

const app = initializeApp(firebaseConfig);
let db = getDatabase()

function readData(path) {
    const _ref = ref(db, path);
    return new Promise((resolve, reject) => {
        onValue(_ref, (snapshot) => {
            resolve(snapshot.val())
        });
    })
}

function readAllData(path) {
    const _ref = ref(db, path);
    return new Promise((resolve, reject) => {
        onValue(_ref, (snapshot) => {
            resolve(snapshot.val())
        });
    })
}

async function readDataWhere(path, property, value) {
    let allData = await readAllData(path)
    let result
    for (let data in allData) {
        if (allData[data][property] == value) {
            result = allData[data]
            break
        }
    }
    return result
}

function writeData(path, data) {
    set(ref(db, path), data);
}

async function updateData(path, data) {
    await update(ref(db, path), data);
}

function changeListener(path, cb) {
    const _ref = ref(db, path);
    onValue(_ref, (snapshot) => {
        cb(snapshot.val())
    });
}

export { readData, readAllData, readDataWhere, writeData, updateData, changeListener }