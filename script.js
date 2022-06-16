import { readData, readAllData, readDataWhere, writeData, updateData, changeListener } from './database.js'
import { advancements as allAdvancements } from './advancement.js'
let cut = document.getElementById('cut')
let point = 0
let clickable = true
let click = 0
let pointDis = document.getElementById('point')
let cpsDis = document.getElementById('cps')
let stupidWarning = document.getElementById('stupid-warning')
let animationCheckbox = document.getElementById('animation')
let blur = document.getElementById('blur')
let nameDis = document.getElementById('name')
let leaderboardButton = document.getElementById('_leaderboard')
let leaderboardDis = document.getElementById('leaderboard')
let advancementButton = document.getElementById('_advancement')
let advancementDis = document.getElementById('advancement-list')
let regButton = document.getElementById('reg')
let logButton = document.getElementById('log')
let signOutButton = document.getElementById('sign-out')
let advancementContainer = document.getElementById('advancement-container')
let username
let advancements = []

async function sync() {
    clickable = false
    blur.style.display = 'flex'
    stupidWarning.remove()
    let data = await readDataWhere('token', localStorage.token)
    if (!data) signOut()
    else {
        username = data.name
        nameDis.innerText = username
        point = data.point
        pointDis.innerText = 'Cut: ' + point
        advancements = Object.values(data.advancements || {})
        regButton.remove()
        logButton.remove()
        signOutButton.style.display = 'block'
        blur.remove()
        clickable = true
        changeListener(loadLeaderboard)
    }
}

if (localStorage.token) sync()
else changeListener(loadLeaderboard)

setInterval(() => {
    cpsDis.innerText = 'CPS: ' + click
    if (click >= 25) {
        point = 0
        alert('Your point was reset for cheating')
        update()
        getAdvancement(3)
    }
    click = 0
}, 1000)

animationCheckbox.checked = localStorage.animation ? JSON.parse(localStorage.animation) : true

animationCheckbox.onchange = () => {
    localStorage.animation = animationCheckbox.checked
}

cut.onclick = () => {
    if (!clickable) return
    click++
    point++
    pointDis.innerText = 'Cut: ' + point
    if (animationCheckbox.checked) {
        cut.width = 250
        animate()
        function animate() {
            requestAnimationFrame(() => {
                cut.width -= 2
                if (cut.width > 225) animate()
            })
        }
    }
    if (animationCheckbox.checked) {
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
    }

    if (point == 1) getAdvancement(0)
    if (point == 1000) getAdvancement(4)
    if (point == 1000000) getAdvancement(5)
    if (point == 1000000000) getAdvancement(6)
    if (point == Infinity) getAdvancement(1)
    update()
}

regButton.onclick = async () => {
    let name = prompt('Create an username:')
    if (await readDataWhere('name', name)) {
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
    } while (await readDataWhere('token', token).length)
    function genToken() {
        function rand() {
            return Math.random().toString(36).substr(2); // remove `0.`
        };
        return rand() + rand(); // to make it longer
    }

    writeData(name, {
        name,
        pass,
        point,
        token,
        advancements: Object.assign({}, advancements),
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

function update() {
    if (!username) return
    updateData(username, {
        point,
        advancements: Object.assign({}, advancements),
    })
}

leaderboardButton.onclick = async () => {
    if (leaderboardDis.style.display == 'block')
        leaderboardDis.style.display = 'none'
    else
        leaderboardDis.style.display = 'block'
}

async function loadLeaderboard() {
    leaderboardDis.innerHTML = ''
    let allUsers = Object.values(await readAllData())
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
    if (userPlace == 0) {
        getAdvancement(2)
    }
}

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
    if (!advancements.length) advancementDis.innerHTML = 'No advancement made!'
    advancements.map(id => {
        let advancement = allAdvancements[id]
        advancementDis.innerHTML += `<div class='advancement'>
            <div>
                <img src="${advancement.img}" alt="">
            </div>
            <div>
                <p style="color: yellow;">Advancement made!</p>
                <p>${advancement.name}</p>
            </div>
            <p class='description'>${advancement.description}</p>
        </div>`
    })
}

function getAdvancement(id) {
    if (advancements.indexOf(id) > -1) return
    advancements.push(id)
    update()
    loadAdvancement()
    let advancement = allAdvancements[id]
    let advancementBox = document.createElement('div')
    advancementBox.className = 'advancement'
    advancementBox.innerHTML = `<div>
    <img src="${advancement.img}" alt="">
</div>
<div>
    <p style="color: yellow;">Advancenent made!</p>
    <p>${advancement.name}</p>
</div>`
    advancementContainer.appendChild(advancementBox)
    if (animationCheckbox.checked) {
        animate()
        function animate() {
            requestAnimationFrame(() => {
                advancementBox.style.opacity = Number(advancementBox.style.opacity) + 0.05
                if (Number(advancementBox.style.opacity) < 1) animate()
            })
        }
        setTimeout(() => {
            animate1()
        }, 3000)
        function animate1() {
            requestAnimationFrame(() => {
                advancementBox.style.opacity = Number(advancementBox.style.opacity) - 0.05
                if (Number(advancementBox.style.opacity) > 0) animate1()
                else advancementBox.remove()
            })
        }
    } else {
        setTimeout(() => {
            advancementBox.remove()
        }, 3000)
    }
}