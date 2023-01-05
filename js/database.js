import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-app.js";
import { getDatabase, ref, set, onValue, child, push, update, query } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyCb2PDHH7ObEatiB9diIuzgbHIo95vmG3I",
    authDomain: "cut-clicker-494b3.firebaseapp.com",
    databaseURL: "https://cut-clicker-494b3-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "cut-clicker-494b3",
    storageBucket: "cut-clicker-494b3.appspot.com",
    messagingSenderId: "1015148425003",
    appId: "1:1015148425003:web:715526f720dda26403df6e",
    measurementId: "G-10QTWY1QNQ"
};

const app = initializeApp(firebaseConfig);
let db = getDatabase()

function readData(path) {
    const _ref = ref(db, path);
    return new Promise((resolve, reject) => {
        ;
        onValue(_ref, (snapshot) => {
            resolve(snapshot.val())
        });
    })
}

async function readDataWhere(path, property, value) {
    let allData = await readData(path)
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

export { readData, readDataWhere, writeData, updateData, changeListener }