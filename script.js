import { readData, writeData, updateData, readDataWhere, getAllData } from './firestore.js'
let cut = document.getElementById('cut')
let point = 0
let click = 0
let cpsDis = document.getElementById('cps')
let pointDis = document.getElementById('point')
let blur = document.getElementById('blur')
let nameDis = document.getElementById('name')
let leaderboardButton = document.getElementById('_leaderboard')
let leaderboardDis = document.getElementById('leaderboard')
let regButton = document.getElementById('reg')
let logButton = document.getElementById('log')
let signOutButton = document.getElementById('sign-out')
let username

async function sync() {
    blur.style.display = 'flex'
    let data = await readDataWhere('token', '==', localStorage.token)
    if (!data.length) signOut()
    else {
        username = data[0].name
        nameDis.innerText = username
        point = data[0].point
        pointDis.innerText = 'Cut: ' + point
        regButton.style.display = 'none'
        logButton.style.display = 'none'
        signOutButton.style.display = 'block'
        blur.style.display = 'none'
    }
}

if (localStorage.token) sync()

setInterval(() => {
    cpsDis.innerText = 'CPS: ' + click
    if (click >= 25) {
        point = 0
        alert('Your point was reset for cheating')
    }
    click = 0
}, 1000)

cut.onclick = () => {
    click++
    point++
    pointDis.innerText = 'Cut: ' + point
    cut.width = 250
    animate()
    function animate() {
        requestAnimationFrame(() => {
            cut.width -= 2
            if (cut.width > 225) animate()
        })
    }
    let img = document.createElement('img')
    img.width = 75
    img.style.position = 'absolute'
    img.style.top = 0
    img.src = 'cut.png'
    let left = Math.random() * (window.innerWidth - img.width)
    img.style.left = left + 'px'
    document.body.appendChild(img)
    animate1()
    function animate1() {
        requestAnimationFrame(() => {
            img.style.top = (img.offsetTop + 5) + 'px'
            if (img.offsetTop < (window.innerHeight - img.width)) animate1()
            else img.remove()
        })
    }

}

regButton.onclick = async () => {
    let name = prompt('Create an username:')
    if ((await readDataWhere('name', '==', name)).length) {
        alert('This username has already been used')
        return
    }
    if (name && name !== '') {
        let pass = prompt('Create a password:')
        if (pass && pass !== '') await register(name, pass)
    }
}

logButton.onclick = async () => {
    let name = prompt('Enter your username:')
    if (name && name !== '') {
        let pass = prompt('Enter your password:')
        if (pass && pass !== '') await logIn(name, pass)
    }
}

signOutButton.onclick = () => {
    signOut()
}

async function register(name, pass) {
    let token
    do {
        token = genToken()
    } while (await readDataWhere('token', '==', token).length)
    function genToken() {
        function rand() {
            return Math.random().toString(36).substr(2); // remove `0.`
        };
        return rand() + rand(); // to make it longer
    }

    await writeData(name, {
        name,
        pass,
        point: 0,
        token,
    })
}

async function logIn(name, pass) {
    let data = await readData(name)
    if (pass !== data.pass) {
        alert('Invalid password or username')
        return
    }
    console.log(data);
    localStorage.token = data.token
    sync()
}

function signOut() {
    localStorage.removeItem('token')
    location.reload()
}
window.onunload = async () => {
    if (username) await update()
}
document.onvisibilitychange = async () => {
    if (username) await update()
}

async function update() {
    await updateData(username, { point, })
}

leaderboardButton.onclick = async () => {
    leaderboardDis.style.display = leaderboardDis.style.display == 'block' ? 'none' : 'block'
    leaderboardDis.style.left = leaderboardButton.offsetLeft + 'px'
    await update()
    await loadLeaderboard()
}

async function loadLeaderboard() {
    leaderboardDis.innerHTML = ''
    let allUsers = await getAllData()
    allUsers.sort(function (a, b) { return b.point - a.point });
    let userPlace = allUsers.findIndex(user => user.name == username)
    for (let i = 0; i <= 9; i++) {
        let user = allUsers[i]
        if (userPlace == i)
            leaderboardDis.innerHTML += `<li><b>(${userPlace + 1}) ${allUsers[userPlace].name}: ${allUsers[userPlace].point}💩</b></li>`
        else
            leaderboardDis.innerHTML += `<li>(${i + 1}) ${user.name}: ${user.point}💩</li>`
    }
    if (userPlace > 9) {
        leaderboardDis.innerHTML += `<li>(${userPlace + 1}) ${allUsers[userPlace].name}: ${allUsers[userPlace].point}💩</li>`
    }
}