import { readData, readAllData, readDataWhere, writeData, updateData, changeListener } from './database.js'
import allAchievements from './achievement.js'
import allItems from './item.js'

let cut = document.getElementById('cut')
let point = 0
let clickable = true
let username
let achievements = []
let cutsPerClick = 1
let cutsPerSecond = 0
let itemsUnlocked = 999

let pointDis = document.getElementById('point')
let cpsDis = document.getElementById('cps')
let stupidWarning = document.getElementById('stupid-warning')
let animationCheckbox = document.getElementById('animation')
let blur = document.getElementById('blur')
let nameDis = document.getElementById('name')

stupidWarning.onclick = () => stupidWarning.remove()

async function sync() {
    clickable = false
    blur.style.display = 'flex'
    let data = await readDataWhere('users', 'token', localStorage.token)
    if (!data) signOut()
    else {
        console.log(data);
        username = data.name
        nameDis.innerText = username
        point = data.point == 'Infinity' ? Infinity : data.point
        pointDis.innerText = Math.floor(point) + ' cut' + checkSingular(point)
        achievements = data.achievements || []
        data.itemsOwned.map((number, id) => {
            let item = allItems[id]
            item.owned = number
        })
        itemsUnlocked = data.itemsUnlocked
        cpsDis.innerText = 'per second: ' + formatNumber(cutsPerSecond)
        stupidWarning.remove()
        regButton.remove()
        logButton.remove()
        signOutButton.style.display = 'block'
        blur.remove()
        clickable = true
        achievements.map(achievement => {
            if (achievement.effect) achievement.effect()
        })
        init()
    }
}

function init() {
    changeListener('users', loadLeaderboard)
    loadAchievement()
    setInterval(() => {
        addPoint(cutsPerSecond)
        allItems.map((item, id) => {
            if (id + 1 > itemsUnlocked) return
            item.cutsPooped += item.cps * item.owned
        })
    }, 1000)
    loadShop()
    calculateTotalCPS()
}

animationCheckbox.checked = localStorage.animation ? JSON.parse(localStorage.animation) : true

animationCheckbox.onchange = () => {
    localStorage.animation = animationCheckbox.checked
}

//falling animation
let fallingAnimationCanvas = document.getElementById('falling-animation')
setInterval(() => {
    fallingAnimationCanvas.width = window.innerWidth
    fallingAnimationCanvas.height = window.innerHeight
})
let ctx = fallingAnimationCanvas.getContext('2d')
let fallingCuts = []

requestAnimationFrame(animate)
function animate() {
    ctx.clearRect(0, 0, fallingAnimationCanvas.width, fallingAnimationCanvas.height)
    fallingCuts.map(cut => {
        cut.y += cut.speed
        cut.update()
    })
    requestAnimationFrame(animate)
}

function fallingCut() {
    let img = new Image()
    img.src = 'img/cut.png'
    fallingCuts.push(this)
    this.x = Math.random() * fallingAnimationCanvas.offsetWidth
    this.y = 0
    this.speed = (Math.random() * 5) + 2
    this.update = () => {
        if (this.y < fallingAnimationCanvas.height) {
            ctx.drawImage(img, this.x, this.y, 75, 48.404)
        }
        else
            fallingCuts.splice(fallingCuts.indexOf(this), 1)
    }
}

cut.onclick = () => {
    if (!clickable) return
    addPoint(cutsPerClick)
    if (animationCheckbox.checked) {
        cut.width = 250
        animate()
        function animate() {
            requestAnimationFrame(() => {
                cut.width -= 2
                if (cut.width > 225) animate()
            })
        }
        new fallingCut()
    }
}

function addPoint(pointAdded) {
    if (point + pointAdded < 0) return
    point += pointAdded
    pointDis.innerText = formatNumber(Math.floor(point)) + ' cut' + checkSingular(point)
    let buyButtons = Array.from(document.querySelectorAll('#shop button'))
    buyButtons.map((button, index) => {
        let item = allItems[index]
        if (item.cost > point) button.disabled = true
        else button.disabled = false
    })
    if (point >= 1) getAchievement(0)
    // if (point >= 1000) getAchievement(3)
    // if (point >= 1000000) getAchievement(4)
    // if (point >= 1000000000) getAchievement(5)
    // if (point >= Infinity) getAchievement(1)
    update()
}
//auth
let regButton = document.getElementById('reg')
let logButton = document.getElementById('log')
let signOutButton = document.getElementById('sign-out')

regButton.onclick = async () => {
    let name = prompt('Create an username:')
    if (await readDataWhere('users', 'name', name)) {
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
    } while (await readDataWhere('users', 'token', token).length)
    function genToken() {
        function rand() {
            return Math.random().toString(36).substr(2); // remove `0.`
        };
        return rand() + rand(); // to make it longer
    }
    let itemsOwned = allItems.map(item => item.owned)
    writeData('users/' + name, {
        name,
        pass,
        point,
        token,
        achievements,
        itemsOwned,
        itemsUnlocked,
    })
    await logIn(name, pass)
}

async function logIn(name, pass) {
    let data = await readData('users/' + name)
    if (!data || pass !== data.pass) {
        alert('Invalid password or username')
        return
    }
    localStorage.token = data.token
    sync()
}

function signOut() {
    localStorage.removeItem('token')
    location.reload()
}

function update() {
    if (!username) return
    let itemsOwned = allItems.map(item => item.owned)
    updateData('users/' + username, {
        achievements,
        point: point == Infinity ? 'Infinity' : point,
        itemsOwned,
        itemsUnlocked,
    })
}

//leaderboard
let leaderboardNav = document.getElementById('leaderboard-nav')
let leaderboardDis = document.getElementById('leaderboard')

leaderboardNav.onclick = async () => {
    if (leaderboardDis.style.display == 'block')
        leaderboardDis.style.display = 'none'
    else {
        displayNavbox(leaderboardDis)
    }
}

async function loadLeaderboard() {
    leaderboardDis.innerHTML = ''
    let allUsers = Object.values(await readAllData('users') || {})
    allUsers.sort((a, b) => b.point - a.point);
    let userPlace = allUsers.findIndex(user => user.name == username)
    for (let i = 0; i <= 4; i++) {
        let user = allUsers[i]
        if (!user) break
        if (userPlace == i)
            leaderboardDis.innerHTML += `<li><b>(${i + 1}) ${user.name}: ${formatNumber(user.point)}💩</b></li>`
        else
            leaderboardDis.innerHTML += `<li>(${i + 1}) ${user.name}: ${formatNumber(user.point)}💩</li>`
    }
    if (userPlace > 4) {
        let user = allUsers[userPlace]
        leaderboardDis.innerHTML += `<li><b>(${userPlace + 1}) ${user.name}: ${formatNumber(user.point)}💩</b></li>`
    }
    // if (userPlace == 0) getAchievement(2)
    leaderboardDis.innerHTML += `<a href='leaderboard' target='_blank'>Entire Leaderboard</a>`
}

//achievement
let achievementNav = document.getElementById('achievement-nav')
let achievementDis = document.getElementById('achievement-list')
let achievementContainer = document.getElementById('achievement-container')

achievementNav.onclick = () => {
    if (achievementDis.style.display == 'block')
        achievementDis.style.display = 'none'
    else {
        loadAchievement()
        displayNavbox(achievementDis)
    }
}

function loadAchievement() {
    achievementDis.innerHTML = ''
    if (!achievements.length) achievementDis.innerHTML = 'No achievements got!'
    else achievementNav.innerText = `Achievement (${formatNumber(achievements.length)})`
    achievements.map(id => {
        let achievement = allAchievements[id]
        achievementDis.innerHTML += `<li class='achievement'>
            <div>
                <img src="${achievement.img}" alt="">
            </div>
            <div>
                <p style="color: yellow;">${achievement.name}</p>
                <p>${achievement.description}</p>
            </div>
            ${achievement.effect ? `<p class='effect'>${achievement.effectDes}</p>` : ''}
        </li>`
    })
}

function getAchievement(id) {
    if (achievements.indexOf(id) > -1) return
    let fart = new Audio('fart.mp3')
    fart.play()
    achievements.push(id)
    update()
    loadAchievement()
    let achievement = allAchievements[id]
    if (achievement.effect) achievement.effect()
    let achievementBox = document.createElement('div')
    achievementBox.className = 'achievement'
    achievementBox.innerHTML = `<div>
    <img src="${achievement.img}" alt="">
</div>
<div>
    <p style="color: yellow;">Achievement get!</p>
    <p>${achievement.name}</p>
</div>`
    achievementContainer.appendChild(achievementBox)
    if (animationCheckbox.checked) {
        animate()
        function animate() {
            requestAnimationFrame(() => {
                achievementBox.style.opacity = Number(achievementBox.style.opacity) + 0.05
                if (Number(achievementBox.style.opacity) < 1) animate()
            })
        }
        setTimeout(() => {
            animate1()
        }, 3000)
        function animate1() {
            requestAnimationFrame(() => {
                achievementBox.style.opacity = Number(achievementBox.style.opacity) - 0.05
                if (Number(achievementBox.style.opacity) > 0) animate1()
                else achievementBox.remove()
            })
        }
    } else {
        setTimeout(() => {
            achievementBox.remove()
        }, 3000)
    }
}

//shop
let shopNav = document.getElementById('shop-nav')
let shopContainer = document.getElementById('shop')

setInterval(() => {
    shopContainer.style.top = shopNav.offsetTop + shopNav.offsetHeight + 'px'
    shopContainer.style.height = window.innerHeight - shopContainer.offsetTop + 'px'
})

shopNav.onclick = () => {
    if (shopContainer.style.display == 'block')
        shopContainer.style.display = 'none'
    else
        displayNavbox(shopContainer)
}

function loadShop() {
    shopContainer.innerHTML = ''
    allItems.map((item, id) => {
        if (id + 1 > itemsUnlocked) return
        item.cost = Math.round(item.baseCost * (1.2 ** item.owned))
        shopContainer.innerHTML += `<li>
        <img src="${item.img}" alt="">
        <div>
            <b><p class='name'>${capitalizeFirstLetter(item.name)}: ${formatNumber(item.cps)} CpS</p></b>
            <p>${item.description}</p>
            <button>Buy: ${formatNumber(item.cost)}💩</button>
            <span>Owned: ${formatNumber(item.owned)}</span>
        </div>
        </li>`
    })
    let buyButtons = Array.from(document.querySelectorAll('#shop button'))
    buyButtons.map((button, index) => {
        button.onclick = () => buyItem(index)
        let item = allItems[index]
        if (item.cost > point) button.disabled = true
        else button.disabled = false
    })
}

function buyItem(id) {
    // getAchievement(6)
    let item = allItems[id]
    addPoint(-item.cost)
    item.owned++
    itemsUnlocked = id + 2 > itemsUnlocked ? id + 2 : itemsUnlocked
    loadShop()
    calculateTotalCPS()
    update()
}

//else
if (localStorage.token) sync()
else {
    init()
}
console.log('%cBE CAREFUL!!!', 'color:red; font-size:30px;font-weight:bold;');
console.log('If someone told you to copy-and-paste something here, don\'t do it! It could allow them to take over your account, delete all of your cuts, do many other harmful things... or it might give you more cuts 💩💩💩')

function calculateTotalCPS() {
    cutsPerSecond = 0
    allItems.map((item, id) => {
        cutsPerSecond += item.cps * item.owned
    })
    cutsPerSecond = Number(cutsPerSecond.toFixed(3))
    console.log(formatNumber(cutsPerSecond));
    cpsDis.innerText = 'per second: ' + formatNumber(cutsPerSecond)
}

function formatNumber(number) {
    number = number >= 1e21 ? number : Number(number.toFixed(3))
    let str = ''
    let units = ['million', 'billion', 'trillion', 'quadrillion', 'quintillion']
    units.map((unit, index) => {
        let powOf10 = 10 ** (3 * (index + 2))
        if (number >= powOf10 && number < 1e21) {
            number = (Number(number.toFixed(3)) / powOf10)
            str = unit
        }
    })
    return `${number.toLocaleString()}${str ? ' ' + str : ''}`
}

function checkSingular(number, isVerb) {
    if (number == 1) return isVerb ? 's' : ''
    return isVerb ? '' : 's'
}

function displayNavbox(navbox) {
    let navboxs = document.getElementsByClassName('navbox')
    for (let element of navboxs) {
        element.style.display = 'none'
    }
    navbox.style.display = 'block'
}

function changeItemCPS(id, newCps) {
    let item = allItems[id]
    item.cps = newCps
    loadShop()
    calculateTotalCPS()
}

function changeCPC(newCPC) {
    cutsPerClick = newCPC
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export { cutsPerClick, changeItemCPS, changeCPC }