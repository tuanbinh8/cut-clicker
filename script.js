import { readData, writeData, updateData, readDataWhere, getAllData } from './firestore.js'
import { advancements as allAdvancements } from './advancement.js'
let cut = document.getElementById('cut')
let point = 0
let click = 0
let pointDis = document.getElementById('point')
let cpsDis = document.getElementById('cps')
let stupidWarning = document.getElementById('stupid-warning')
let blur = document.getElementById('blur')
let nameDis = document.getElementById('name')
let leaderboardButton = document.getElementById('_leaderboard')
let leaderboardDis = document.getElementById('leaderboard')
let advancementButton = document.getElementById('_advancement')
let advancementDis = document.getElementById('advancement-list')
let regButton = document.getElementById('reg')
let logButton = document.getElementById('log')
let signOutButton = document.getElementById('sign-out')
let advancementBox = document.getElementById('advancement')
let advancementImg = document.querySelector('#advancement img')
let advancementNameDis = document.querySelector('#advancement .name')
let username
let advancements = []

async function sync() {
    blur.style.display = 'flex'
    stupidWarning.remove()
    let data = await readDataWhere('token', '==', localStorage.token)
    if (!data.length) signOut()
    else {
        username = data[0].name
        nameDis.innerText = username
        point = data[0].point
        pointDis.innerText = 'Cut: ' + point
        advancements = data[0].advancements
        regButton.remove()
        logButton.remove()
        signOutButton.style.display = 'block'
        blur.remove()
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
    img.src = 'img/cut.png'
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

    if (point == 1) getAdvancement(0)
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
        point,
        token,
        advancements: [],
    })
    await logIn(name, pass)
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

setInterval(async () => {
    if (username) await update()
}, 60000)

document.onvisibilitychange = async () => {
    if (username) await update()
}

async function update() {
    await updateData(username, {
        point,
        advancements,
    })
}

leaderboardButton.onclick = async () => {
    if (username) await update()
    if (leaderboardDis.style.display == 'block')
        leaderboardDis.style.display = 'none'
    else {
        await loadLeaderboard()
        leaderboardDis.style.display = 'block'
    }
}

async function loadLeaderboard() {
    leaderboardDis.innerHTML = ''
    let allUsers = await getAllData()
    allUsers.sort(function (a, b) { return b.point - a.point });
    let userPlace = allUsers.findIndex(user => user.name == username)
    for (let i = 0; i <= 9; i++) {
        let user = allUsers[i]
        if (!user) break
        if (userPlace == i)
            leaderboardDis.innerHTML += `<li><b>(${userPlace + 1}) ${allUsers[userPlace].name}: ${allUsers[userPlace].point}💩</b></li>`
        else
            leaderboardDis.innerHTML += `<li>(${i + 1}) ${user.name}: ${user.point}💩</li>`
    }
    if (userPlace > 9) {
        leaderboardDis.innerHTML += `<li>(${userPlace + 1}) ${allUsers[userPlace].name}: ${allUsers[userPlace].point}💩</li>`
    }
}
// setInterval(() => { cut.click() }, 45)

advancementButton.onclick = () => {
    if (advancementDis.style.display == 'block')
        advancementDis.style.display = 'none'
    else {
        loadAdvancement()
        advancementDis.style.display = 'block'
    }
}
function loadAdvancement() {
    advancementDis.innerHTML = ''
    advancements.map(id => {
        let advancement = allAdvancements[id]
        advancementDis.innerHTML += `<li>
        <div>
        <img src='${advancement.img}'>
        <p>${advancement.name}</p>
        </div>
        <p class='description'>${advancement.description}</p>
        </li>`
    })
}
function getAdvancement(id) {
    if (advancements.indexOf(id) > -1) return
    advancements.push(id)
    loadAdvancement()
    let advancement = allAdvancements[id]
    advancementImg.src = advancement.img
    advancementNameDis.innerText = advancement.name
    advancementBox.style.zIndex = 3
    animate()
    function animate() {
        requestAnimationFrame(() => {
            advancementBox.style.opacity = Number(advancementBox.style.opacity) + 0.05
            if (Number(advancementBox.style.opacity) < 1) animate()
        })
    }
    setTimeout(() => {
        animate1()
        advancementBox.style.zIndex = -1
    }, 3000)
    function animate1() {
        requestAnimationFrame(() => {
            advancementBox.style.opacity = Number(advancementBox.style.opacity) - 0.05
            if (Number(advancementBox.style.opacity) > 0) animate1()
        })
    }
}

getAdvancement(1)