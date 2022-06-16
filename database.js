import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-app.js";
import { getDatabase, ref, set, onValue, child, push, update } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-database.js";

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

function readData(name) {
    const _ref = ref(db, 'users/' + name);
    return new Promise((resolve, reject) => {
        onValue(_ref, (snapshot) => {
            resolve(snapshot.val())
        });
    })
}

function readAllData() {
    const _ref = ref(db, 'users/');
    return new Promise((resolve, reject) => {
        onValue(_ref, (snapshot) => {
            resolve(snapshot.val())
        });
    })
}
async function readDataWhere(property, value) {
    let allData = await readAllData()
    let result
    for (let data in allData) {
        if (allData[data][property] == value) {
            result = allData[data]
            break
        }
    }
    return result
}
function writeData(name, data) {
    set(ref(db, 'users/' + name), data);
}

function updateData(name, data) {
    update(ref(db, 'users/' + name), data);
}

export { readData, readAllData, readDataWhere, writeData, updateData }
