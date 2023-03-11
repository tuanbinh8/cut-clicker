import { readData, readDataWhere, writeData, updateData, changeListener } from './database.js'
import allAchievements from './achievement.js'
import allItems from './item.js'

let username, point, achievements, itemsUnlocked, totalCuts, cutsClick, cutsPoopedByClicking, timePlayed, bigCutSpawned, totalItemsOwned
let bigCutAppearing = 0
let click = 0, cps
let cutsPerClick = 1
let cutsPerSecond = 0
let multiplier = 1
let clickable = true
let updateable = true

let title = document.getElementsByTagName('title')[0]
let cut = document.getElementById('cut')
let pointDis = document.getElementById('point')
let cpsDis = document.getElementById('cps')
let animationForm = document.getElementById('options')
let nameDis = document.getElementById('name')
let blur = document.getElementById('blur')
let chatTab = document.querySelectorAll('#right .tab')[3]

async function init() {
    if (localStorage.token) {
        let data = await readDataWhere('users', 'token', localStorage.token)
        console.log(data);
        if (!data) signOut()
        username = data.name
        nameDis.innerText = username
        point = Number(data.point)
        cutsPerClick = Number(data.cutsPerClick)
        totalCuts = Number(data.totalCuts)
        achievements = data.achievements || []
        for (let name in data.itemsOwned) {
            let item = getItem(name)
            if (item)
                item.owned = data.itemsOwned[name]
        }
        for (let name in data.itemsCPS) {
            let item = getItem(name)
            if (item)
                item.cps = data.itemsCPS[name]
        }
        itemsUnlocked = data.itemsUnlocked > allItems.length ? allItems.length : data.itemsUnlocked
        cutsClick = Number(data.cutsClick)
        cutsPoopedByClicking = Number(data.cutsPoopedByClicking)
        viewedChat = data.viewedChat
        timePlayed = data.timePlayed
        bigCutSpawned = Number(data.bigCutSpawned)
        regButton.remove()
        logInButton.remove()
    } else {
        point = localStorage.point ? Number(localStorage.point) : 0
        cutsPerClick = localStorage.point ? Number(localStorage.cutsPerClick) : 1
        totalCuts = localStorage.totalCuts ? Number(localStorage.totalCuts) : 0
        achievements = localStorage.achievements ? JSON.parse(localStorage.achievements) : []
        if (localStorage.itemsOwned) {
            let itemsOwned = JSON.parse(localStorage.itemsOwned)
            for (let name in itemsOwned) {
                let item = getItem(name)
                if (item)
                    item.owned = itemsOwned[name]
            }
        }
        if (localStorage.itemsCPS) {
            let itemsCPS = JSON.parse(localStorage.itemsCPS)
            for (let name in itemsCPS) {
                let item = getItem(name)
                if (item)
                    item.cps = itemsCPS[name]
            }
        }
        itemsUnlocked = localStorage.itemsUnlocked ? Number(localStorage.itemsUnlocked) : 2
        itemsUnlocked = itemsUnlocked > allItems.length ? allItems.length : itemsUnlocked
        cutsClick = localStorage.cutsClick ? Number(localStorage.cutsClick) : 0
        cutsPoopedByClicking = localStorage.cutsPoopedByClicking ? Number(localStorage.cutsPoopedByClicking) : 0
        timePlayed = localStorage.timePlayed ? Number(localStorage.timePlayed) : 0
        bigCutSpawned = localStorage.bigCutSpawned ? Number(localStorage.bigCutSpawned) : 0
        chatTab.remove()
        signOutButton.remove()
    }
    CaoCaoDiarrheaIncrease = 0.1 + allItems[6].owned * 0.1
    animationForm['cut-animation'].checked = localStorage.bigCutAnimation ? JSON.parse(localStorage.bigCutAnimation) : true
    animationForm['falling-cuts'].checked = localStorage.fallingCuts ? JSON.parse(localStorage.fallingCuts) : true
    animationForm['number-animation'].checked = localStorage.numberAnimation ? JSON.parse(localStorage.numberAnimation) : true
    pointDis.innerText = formatNumber(Math.floor(point)) + ' cut' + (point == 1 ? '' : 's')
    title.innerText = formatNumber(Math.floor(point)) + ' cut' + (point == 1 ? '' : 's')
    cpsDis.innerHTML = `per second: ${formatNumber(cutsPerSecond)}`
    loadAchievement()
    loadShop()
    loadStats()
    changeListener('chat', loadChat)
    setInterval(() => {
        timePlayed++
        cps = click
        click = 0
        addPoint(cutsPerSecond)
        let random = Math.floor(Math.random() * (1e9 + 1));
        if (random == 888) {
            unlockAchievement('A bit of luck')
        }
    }, 1000)
    setInterval(() => {
        fallingAnimationCanvas.width = document.getElementById('cut-container').offsetWidth
        fallingAnimationCanvas.height = window.innerHeight
        pointAddCanvas.width = window.innerWidth
        pointAddCanvas.height = window.innerHeight
        let leftDivs = document.querySelectorAll('#left > div')
        leftDivs[1].style.height = window.innerHeight - leftDivs[0].offsetHeight + 'px'
        let rightDivs = document.querySelectorAll('#right > div')
        rightDivs[1].style.height = window.innerHeight - rightDivs[0].offsetHeight + 'px'
    })
    blur.remove()
}

function update() {
    unlockAllPossibleAchievement()
    if (!updateable) return
    let itemsCPS = {}
    allItems.map(item => itemsCPS[item.name] = item.cps)
    let itemsOwned = {}
    allItems.map(item => itemsOwned[item.name] = item.owned)

    if (username) {
        updateData('users/' + username, {
            point: String(point),
            cutsPerClick: String(cutsPerClick),
            achievements,
            itemsCPS,
            itemsOwned,
            itemsUnlocked,
            totalCuts: String(totalCuts),
            cutsClick: String(cutsClick),
            cutsPoopedByClicking: String(cutsPoopedByClicking),
            viewedChat,
            timePlayed,
            bigCutSpawned: String(bigCutSpawned),
        })
    } else {
        localStorage.point = point
        localStorage.cutsPerClick = cutsPerClick
        localStorage.achievements = JSON.stringify(achievements)
        localStorage.itemsCPS = JSON.stringify(itemsCPS)
        localStorage.itemsOwned = JSON.stringify(itemsOwned)
        localStorage.itemsUnlocked = itemsUnlocked
        localStorage.totalCuts = totalCuts
        localStorage.cutsClick = cutsClick
        localStorage.cutsPoopedByClicking = cutsPoopedByClicking
        localStorage.timePlayed = timePlayed
        localStorage.bigCutSpawned = bigCutSpawned
    }
}

animationForm.onchange = () => {
    localStorage.bigCutAnimation = animationForm['cut-animation'].checked
    localStorage.fallingCuts = animationForm['falling-cuts'].checked
    localStorage.numberAnimation = animationForm['number-animation'].checked
}


cut.onclick = (event) => {
    if (!clickable) return
    click++
    cutsClick++
    cutsPoopedByClicking += cutsPerClick
    if (animationForm['cut-animation'].checked) {
        cut.width = 300
        animate()
        function animate() {
            requestAnimationFrame(() => {
                cut.width -= 2
                if (cut.width > 275) animate()
            })
        }
    }
    if (animationForm['falling-cuts'].checked) new fallingCut()
    if (animationForm['number-animation'].checked) new pointAdd(event.clientX, event.clientY, cutsPerClick)
    let random = Math.floor(Math.random() * 1001);
    if (random == 88) {
        new bigCut()
        bigCutSpawned++
        bigCutAppearing++
        multiplier *= 8.88
    }
    addPoint(cutsPerClick)
}

cut.ondragstart = function () { return false; };

function addPoint(pointAdded) {
    if (point + pointAdded < 0) return
    if (pointAdded > 0)
        totalCuts += pointAdded
    point += pointAdded
    pointDis.innerText = formatNumber(Math.floor(point)) + ' cut' + (point == 1 ? '' : 's')
    title.innerText = formatNumber(Math.floor(point)) + ' cut' + (point == 1 ? '' : 's')
    let buyButtons = Array.from(document.querySelectorAll('#shop button'))
    buyButtons.map((button, index) => {
        let item = allItems[index]
        if (item.cost > point) button.disabled = true
        else button.disabled = false
    })
    loadStats()
    update()
}

//falling animation
let fallingAnimationCanvas = document.getElementById('falling-animation')
let fallingAnimationCtx = fallingAnimationCanvas.getContext('2d')
let fallingCuts = []

requestAnimationFrame(fallingAnimate)
function fallingAnimate() {
    fallingAnimationCtx.clearRect(0, 0, fallingAnimationCanvas.width, fallingAnimationCanvas.height)
    fallingCuts.map(cut => {
        cut.y += cut.speed
        cut.update()
    })
    requestAnimationFrame(fallingAnimate)
}

function fallingCut() {
    let img = new Image()
    img.src = 'img/cut.png'
    fallingCuts.push(this)
    this.x = Math.random() * fallingAnimationCanvas.width
    this.y = 0
    this.speed = (Math.random() * 5) + 2
    this.update = () => {
        if (this.y < window.innerHeight)
            fallingAnimationCtx.drawImage(img, this.x, this.y, 75, 48)
        else
            fallingCuts.splice(fallingCuts.indexOf(this), 1)
    }
}

//point add animation
let pointAddCanvas = document.getElementById('point-add')
let pointAddCtx = pointAddCanvas.getContext('2d')
let pointAddTexts = []

requestAnimationFrame(pointAddAnimate)
function pointAddAnimate() {
    pointAddCtx.font = "25px Arial";
    pointAddCtx.clearRect(0, 0, pointAddCanvas.width, pointAddCanvas.height)
    pointAddTexts.map(text => {
        text.y -= 2
        text.opacity -= 0.01
        text.update()
    })
    requestAnimationFrame(pointAddAnimate)
}

function pointAdd(x, y, pointAdded) {
    pointAddTexts.push(this)
    this.y = y
    this.opacity = 1
    this.speed = (Math.random() * 5) + 2
    this.update = () => {
        pointAddCtx.fillStyle = `rgb(0,0,0,${this.opacity})`;
        if (this.opacity)
            pointAddCtx.fillText(`+${formatNumber(pointAdded)}💩`, x, this.y)
        else
            pointAddTexts.splice(pointAddTexts.indexOf(this), 1)
    }
}

//Kingkongdara's big cut
function bigCut() {
    let img = new Image()
    img.src = 'img/big-cut.jpg'
    fallingCuts.push(this)
    this.isBig = true
    this.x = Math.random() * fallingAnimationCanvas.width
    this.y = 0
    this.speed = Math.random() + 0.1
    this.update = () => {
        if (this.y < window.innerHeight) {
            fallingAnimationCtx.drawImage(img, this.x, this.y, 75, 100)
            calculateTotalCPS()
        } else {
            multiplier /= 8.88
            calculateTotalCPS()
            bigCutAppearing--
            fallingCuts.splice(fallingCuts.indexOf(this), 1)
        }
    }
}

//auth
let regButton = document.getElementById('register')
let logInButton = document.getElementById('log-in')
let signOutButton = document.getElementById('sign-out')

regButton.onclick = async () => {
    if (!navigator.onLine) {
        alert('No Internet connection!')
        return
    }
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

logInButton.onclick = async () => {
    if (!navigator.onLine) {
        alert('No Internet connection!')
        return
    }
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
    if (confirm('Do you want to copy your local data to this account')) {
        let itemsOwned = {}
        allItems.map(item => itemsOwned[item.name] = item.owned)
        let itemsCPS = {}
        allItems.map(item => itemsCPS[item.name] = item.cps)
        writeData('users/' + name, {
            name,
            pass,
            token,
            point: String(point),
            cutsPerClick: String(cutsPerClick),
            totalCuts: String(totalCuts),
            achievements,
            itemsOwned,
            itemsCPS,
            itemsUnlocked,
            cutsClick: String(cutsClick),
            cutsPoopedByClicking: String(cutsPoopedByClicking),
            viewedChat: chatLength,
            timePlayed,
            bigCutSpawned: String(bigCutSpawned),
        })
    } else {
        let itemsOwned = {}
        allItems.map(item => itemsOwned[item.name] = 0)
        let itemsCPS = {}
        allItems.map((item, id) => itemsCPS[item.name] = [0.1, 3, 10, 50, 350, 2500, 13000, 100000, 900000, 3212345][id])
        writeData('users/' + name, {
            name,
            pass,
            token,
            point: 0,
            cutsPerClick: 1,
            achievements: [],
            itemsCPS,
            itemsOwned,
            itemsUnlocked: 2,
            totalCuts: 0,
            cutsClick: 0,
            cutsPoopedByClicking: 0,
            viewedChat: chatLength,
            timePlayed: 0,
            bigCutSpawned: 0,
        })
    }
    await logIn(name, pass)
}

async function logIn(name, pass) {
    let data = await readData('users/' + name)
    if (!data || pass !== data.pass) {
        alert('Invalid password or username')
        return
    }
    localStorage.token = data.token
    location.reload()
}

function signOut() {
    localStorage.removeItem('token')
    location.reload()
}

//box
let boxTabs = Array.from(document.querySelectorAll('#right .tab'))
boxTabs.map((tab, index) => {
    tab.onclick = () => {
        let boxs = Array.from(document.querySelectorAll('#right .box'))
        boxs.map(box => box.style.display = 'none')
        boxs[index].style.display = index == 1 || index == 3 ? 'flex' : 'block'
        let tabs = Array.from(document.querySelectorAll('#right .tab'))
        tabs.map(tab => tab.className = 'tab')
        tabs[index].classList.add('active')
        if (index == 3) viewedChat = chatLength
        showUnseenChatNumber()
    }
})

//stats & options
let statsList = document.getElementById('stats')

function loadStats() {
    totalItemsOwned = 0
    allItems.map(item => {
        totalItemsOwned += item.owned
    })
    statsList.innerHTML = `
    <li>Cuts being had: ${formatNumber(point)}💩</li>
    <li>Cuts pooped in total: ${formatNumber(totalCuts)}💩</li>
    <li>Cuts per click: ${formatNumber(cutsPerClick)}💩</li>
    <li>Cuts per second: ${formatNumber(cutsPerSecond / multiplier)}💩 x ${formatNumber(multiplier * 100)}%</li>
    <li>Items owned: ${formatNumber(totalItemsOwned)}🧍</li>
    <li>Click: ${formatNumber(cutsClick)}🖱️</li>
    <li>Cuts pooped by clicking: ${formatNumber(cutsPoopedByClicking)}💩</li>
    <li>Kingkongdara's big cuts spawned: ${formatNumber(bigCutSpawned)}</li>
    <li>Clicks per second: ${cps}🖱️</li>
    <li>Achievement unlocked: ${achievements.length}/${allAchievements.length} (${Math.round(achievements.length / allAchievements.length * 100)}%)</li>
    <li>Time played: ${convertTime(timePlayed)}</li>
    `
}

let importSaveButton = document.getElementById('import-save')
let exportSaveButton = document.getElementById('export-save')
let clearSaveButton = document.getElementById('clear-save')

clearSaveButton.onclick = async () => {
    updateable = false
    if (!confirm('ARE YOU SURE???\nYou will lose all of your progress, including your cuts, achievements, items,...!!!')) return
    if (!confirm('THINK AGAIN!!!\nWE WILL NOT TAKE RESPONSIBILITY FOR IT!!!')) return
    clickable = false
    let flushContainer = document.getElementById('flush')
    flushContainer.style.display = 'block'
    cut.style.zIndex = 999
    new Audio('fart.mp3').play()
    let rotation = 0
    animate()
    function animate() {
        requestAnimationFrame(() => {
            rotation += 5
            cut.style.rotate = rotation + 'deg'
            cut.width--
            if (cut.width) animate()
        })
    }
    setTimeout(() => {
        location.reload()
    }, 4400)
    if (username) {
        let itemsOwned = {}
        allItems.map(item => itemsOwned[item.name] = 0)
        let itemsCPS = {}
        allItems.map((item, id) => itemsCPS[item.name] = [0.1, 3, 10, 50, 350, 2500, 13000, 100000, 900000, 3212345][id])
        updateData('users/' + username, {
            point: 0,
            achievements: [],
            itemsCPS,
            itemsOwned,
            itemsUnlocked: 2,
            totalCuts: 0,
            cutsClick: 0,
            cutsPoopedByClicking: 0,
            viewedChat: chatLength,
            timePlayed: 0,
            bigCutSpawned: 0,
        })
    } else {
        localStorage.clear()
    }
}

importSaveButton.onclick = () => {
    var element = document.createElement('input');
    element.type = 'file'
    element.onchange = () => {
        let file = element.files[0]
        let fileReader = new FileReader()
        fileReader.onload = () => {
            console.log(JSON.parse(fileReader.result));
            importSave(JSON.parse(fileReader.result));
        }
        fileReader.readAsText(file)
    }
    element.click()
}

function importSave({
    point,
    totalCuts,
    achievements,
    itemsOwned,
    itemsCPS,
    itemsUnlocked,
    cutsClick,
    cutsPoopedByClicking,
    viewedChat,
    timePlayed,
    bigCutSpawned,
}) {
    updateable = false
    if (username) {
        updateData('users/' + username, {
            point,
            totalCuts,
            achievements: achievements || [],
            itemsOwned,
            itemsCPS,
            itemsUnlocked,
            cutsClick,
            cutsPoopedByClicking,
            viewedChat,
            timePlayed,
            bigCutSpawned
        })
    } else {
        localStorage.point = point
        localStorage.achievements = achievements || []
        localStorage.itemsCPS = itemsCPS
        localStorage.itemsOwned = itemsOwned
        localStorage.itemsUnlocked = itemsUnlocked
        localStorage.totalCuts = totalCuts
        localStorage.cutsClick = cutsClick
        localStorage.cutsPoopedByClicking = cutsPoopedByClicking
        localStorage.timePlayed = timePlayed
        localStorage.bigCutSpawned = bigCutSpawned
    }
    location.reload()
}

exportSaveButton.onclick = async () => {
    exportSave('save.json', JSON.stringify(username ? await readData('users/' + username) : localStorage))
}

function exportSave(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
    element.click();
}

//achievement
let achievementList = document.getElementById('achievement-list')
let achievementUnlockContainer = document.getElementById('achievement-unlock-container')
let achievementInforBox = document.getElementById('achievement-infor')

function loadAchievement() {
    achievementList.innerHTML = `<p>Achievement unlocked: ${achievements.length}/${allAchievements.length} (${Math.round(achievements.length / allAchievements.length * 100)}%)</p>`
    allAchievements.map(achievement => {
        let li = document.createElement('li')
        if (achievements.includes(achievement.name)) {
            li.innerHTML = achievement.img ? `<img src='${achievement.img}'>` : achievement.name
            li.onmouseover = () => {
                achievementInforBox.innerHTML = `<div class='main'>
                    <div>
                        ${achievement.img ? `<img class='icon' src="${achievement.img}" alt="">` : ''}
                    </div>
                    <div>
                        <p style="color: yellow;">${achievement.name}</p>
                        <p>${achievement.description}</p>
                    </div>
                </div>
                ${achievement.effect ? `<hr><p class='effect'>Effect: ${achievement.effect}</p>` : ''}`
                let rect = li.getBoundingClientRect()
                achievementInforBox.style.top = rect.bottom + achievementInforBox.offsetHeight > window.innerHeight ? rect.y - achievementInforBox.offsetHeight + 'px' : rect.bottom + 'px'
                achievementInforBox.style.left = `min(${window.innerWidth - 355}px,${rect.x}px)`
                achievementInforBox.style.opacity = 1
            }
            li.onmouseout = () => achievementInforBox.style.opacity = 0
        } else li.innerHTML = `<img src='data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='>`
        achievementList.appendChild(li)
    })
}

function unlockAchievement(name) {
    let achievement = allAchievements.filter(achievement => achievement.name == name)[0]
    if (achievements.includes(name) || !achievement) return
    achievements.push(name)
    emitAchievementEffect(name)
    update()
    loadAchievement()
    let achievementBox = document.createElement('li')
    achievementBox.className = 'achievement'
    achievementBox.innerHTML = `<div class='main'>
    <div>
    <img class="icon" src="${achievement.img}" alt="">
</div>
<div>
    <p style="color: yellow;">Achievement unlocked!</p>
    <p>${achievement.name}</p>
</div>
</div>`
    achievementUnlockContainer.appendChild(achievementBox)
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
}

function unlockAllPossibleAchievement() {
    //Cuts had
    if (point >= 1) unlockAchievement('Beginning')
    if (point >= 1000) unlockAchievement('Pooper')
    if (point >= 1e6) unlockAchievement('Crazy \'bout cuts!')
    if (point >= 1e9) unlockAchievement('Cut billionaire')
    if (point >= 1e12) unlockAchievement('Cut monopoly')
    if (point >= 1e15) unlockAchievement('Cover the world with cuts')
    if (point >= 1e100) unlockAchievement('1 google cuts')
    if (point == Infinity) unlockAchievement('Can\'t count more cut')
    if (Number.isNaN(point)) unlockAchievement('Buggy cuts')
    //Cuts pooped in total
    if (totalCuts >= 1000) unlockAchievement('Pooped 1 thousand cuts in total')
    if (totalCuts >= 1e6) unlockAchievement('Pooped 1 million cuts in total')
    if (totalCuts >= 1e9) unlockAchievement('Let\'s rewind')
    if (totalCuts >= 1e12) unlockAchievement('Pooped 1 trillion cuts in total')
    //clicking
    if (cutsPoopedByClicking >= 1000) unlockAchievement('Pooping cursor')
    if (cutsPoopedByClicking >= 1e6) unlockAchievement('Pooped 1 million cuts from clicking')
    if (cutsPoopedByClicking >= 1e9) unlockAchievement('Pooped 1 billion cuts from clicking')
    if (cutsPoopedByClicking >= 1e12) unlockAchievement('Pooped 1 trillion cuts from clicking')
    //CPS
    if (cutsPerSecond >= 1) unlockAchievement('Normal pooper')
    if (cutsPerSecond >= 1000) unlockAchievement('Super pooper')
    if (cutsPerSecond >= 1e6) unlockAchievement('Cut speedrunner')
    if (cutsPerSecond >= 1e9) unlockAchievement('Fast & Cut')
    if (cutsPerSecond >= 1e12) unlockAchievement('World\'s fastest industry')
    //Items owned
    if (totalItemsOwned >= 100) unlockAchievement('Own 100 items')
    if (totalItemsOwned >= 200) unlockAchievement('Own 200 items')
    if (totalItemsOwned >= 500) unlockAchievement('Own 500 items')
    if (totalItemsOwned >= 1000) unlockAchievement('Own 1000 items')
    //Baby
    if (getItem('baby').owned >= 1) unlockAchievement('Who needs a potty?')
    if (getItem('baby').owned >= 50) unlockAchievement('Kindergarten')
    if (getItem('baby').owned >= 100) unlockAchievement('Let\'s save the world from population ageing')
    if (getItem('baby').owned >= 200) unlockAchievement('Baby labour')
    if (getItem('baby').owned >= 300) unlockAchievement('Baby invasion')
    //Dog
    if (getItem('dog').owned >= 1) unlockAchievement('Wolf wolf')
    if (getItem('dog').owned >= 50) unlockAchievement('Have they bitten you?')
    if (getItem('dog').owned >= 100) unlockAchievement('Have you fed them?')
    if (getItem('dog').owned >= 200) unlockAchievement('You must be tired')
    if (getItem('dog').owned >= 300) unlockAchievement('Dog army')
    //Neighbor
    if (getItem('neighbor').owned >= 1) unlockAchievement('Own 1 neighbor')
    if (getItem('neighbor').owned >= 50) unlockAchievement('Own 50 neighbors')
    if (getItem('neighbor').owned >= 100) unlockAchievement('Own 100 neighbors')
    if (getItem('neighbor').owned >= 200) unlockAchievement('Own 200 neighbors')
    if (getItem('neighbor').owned >= 300) unlockAchievement('Own 300 neighbors')
    //Human
    if (getItem('human').owned >= 1) unlockAchievement('1 human')
    if (getItem('human').owned >= 50) unlockAchievement('50 humans')
    if (getItem('human').owned >= 100) unlockAchievement('100 humans')
    if (getItem('human').owned >= 200) unlockAchievement('200 humans')
    if (getItem('human').owned >= 300) unlockAchievement('300 humans')
    //Harry
    if (getItem('Harry').owned >= 1) unlockAchievement('Eats vegetables everyday')
    if (getItem('Harry').owned >= 50) unlockAchievement('A chaotic family')
    if (getItem('Harry').owned >= 100) unlockAchievement('Own 100 Harry')
    if (getItem('Harry').owned >= 200) unlockAchievement('Own 200 Harry')
    if (getItem('Harry').owned >= 300) unlockAchievement('Own 300 Harry')
    //Robot
    if (getItem('robot').owned >= 1) unlockAchievement('Peep po peep')
    if (getItem('robot').owned >= 50) unlockAchievement('Own 50 robots')
    if (getItem('robot').owned >= 100) unlockAchievement('Own 100 robots')
    if (getItem('robot').owned >= 200) unlockAchievement('Own 200 robots')
    if (getItem('robot').owned >= 300) unlockAchievement('Own 300 robots')
    //Avocado
    if (getItem('Nikocado Avocado').owned >= 1) unlockAchievement('First mukbang')
    if (getItem('Nikocado Avocado').owned >= 50) unlockAchievement('Own 50 Nikocado Avocado')
    if (getItem('Nikocado Avocado').owned >= 100) unlockAchievement('Own 100 Nikocado Avocado')
    if (getItem('Nikocado Avocado').owned >= 200) unlockAchievement('Own 200 Nikocado Avocado')
    if (getItem('Nikocado Avocado').owned >= 300) unlockAchievement('Own 300 Nikocado Avocado')
    //Cao Cao
    if (getItem('Cao Cao').owned >= 1) unlockAchievement('Time travel')
    if (getItem('Cao Cao').owned >= 50) unlockAchievement('More troops, more cuts.')
    if (getItem('Cao Cao').owned >= 100) unlockAchievement('Any who stand in my way shall be 💩 down!')
    if (getItem('Cao Cao').owned >= 200) unlockAchievement('Has anyone not got diarrhea yet?')
    if (getItem('Cao Cao').owned >= 300) unlockAchievement('Unify China')
    //Hacker
    if (getItem('hacker').owned >= 1) unlockAchievement('stealCut()')
    if (getItem('hacker').owned >= 50) unlockAchievement('Own 50 hackers')
    if (getItem('hacker').owned >= 100) unlockAchievement('Own 100 hackers')
    if (getItem('hacker').owned >= 200) unlockAchievement('Own 200 hackers')
    if (getItem('hacker').owned >= 300) unlockAchievement('Own 300 hackers')
    //God
    if (getItem('God').owned >= 1) unlockAchievement('God does exist,... at least from now')
    if (getItem('God').owned >= 50) unlockAchievement('Multi-god')
    if (getItem('God').owned >= 100) unlockAchievement('Own 100 gods')
    if (getItem('God').owned >= 200) unlockAchievement('Own 200 gods')
    if (getItem('God').owned >= 300) unlockAchievement('Own 300 gods')
    //big cut
    if (bigCutSpawned >= 1) unlockAchievement('"I forgot to flush the toilet" said Kingkongdara')
    if (bigCutAppearing >= 2) unlockAchievement('"I had some delicious stew for lunch" said Kingkongdara')
    if (bigCutSpawned >= 5) unlockAchievement('Spawned 5 Kingkongdara\'s big cut')
    //else
    if (click >= 25) unlockAchievement('Autoclicker')
}

function emitAchievementEffect(name) {
    switch (name) {
        //Cuts had
        case 'Pooper':
            multilyEveryItemsAndClickingEfficient(2)
            break
        case 'Crazy \'bout cuts!':
            multilyEveryItemsAndClickingEfficient(3)
            break
        case 'Cut billionaire':
            multilyEveryItemsAndClickingEfficient(4)
            break
        case 'Cut monopoly':
            multilyEveryItemsAndClickingEfficient(5)
            break
        case 'Cover the world with cuts':
            multilyEveryItemsAndClickingEfficient(6)
            break
        case '1 google cuts':
            multilyEveryItemsAndClickingEfficient(10)
            break
        //Cuts pooped in total
        case 'Pooped 1 thousand cuts in total':
            cutsPerSecond += cutsPerSecond / 4
            break
        case 'Pooped 1 trillion cuts in total':
            cutsPerSecond += cutsPerSecond / 2
            break
        case 'Let\'s rewind':
            cutsPerSecond += cutsPerSecond / 4 * 3
            break
        case 'Pooped 1 trillion cuts in total':
            cutsPerSecond * 2
            break
        //clicking
        case 'Pooping cursor':
            cutsPerClick *= 2
            break
        case 'Pooped 1 million cuts from clicking':
            cutsPerClick *= 3
            break
        case 'Pooped 1 billion cuts from clicking':
            cutsPerClick *= 4
            break
        case 'Pooped 1 trillion cuts from clicking':
            cutsPerClick *= 5
            break
        //CPS
        case 'Super pooper':
            cutsPerSecond += cutsPerSecond / 4
            break
        case 'Cut speedrunner':
            cutsPerSecond += cutsPerSecond / 2
            break
        case 'Fast & Cut':
            cutsPerSecond += cutsPerSecond / 4 * 3
            break
        case 'World\'s fastest industry':
            cutsPerSecond *= 2
            break
        //Items owned
        case 'Own 100 items':
            cutsPerSecond += cutsPerSecond / 4
            break
        case 'Own 200 items':
            cutsPerSecond += cutsPerSecond / 2
            break
        case 'Own 500 items':
            cutsPerSecond += cutsPerSecond / 4 * 3
            break
        case 'Own 1000 items':
            cutsPerSecond *= 2
            break
        //Baby
        case 'Kindergarten':
            multilyItemEfficient('baby', 2)
            break
        case 'Let\'s save the world from population ageing':
            multilyItemEfficient('baby', 3)
            break
        case 'Baby labour':
            multilyItemEfficient('baby', 4)
            break
        case 'Baby invasion':
            multilyItemEfficient('baby', 5)
            break
        //Dog
        case 'Have they bitten you?':
            multilyItemEfficient('dog', 2)
            break
        case 'Have you fed them?':
            multilyItemEfficient('dog', 3)
            break
        case 'You must be tired':
            multilyItemEfficient('dog', 4)
            break
        case 'Dog army':
            multilyItemEfficient('dog', 5)
            break
        //Neighbor
        case 'Own 50 neighbors':
            multilyItemEfficient('neighbor', 2)
            break
        case 'Own 100 neighbors':
            multilyItemEfficient('neighbor', 3)
            break
        case 'Own 200 neighbors':
            multilyItemEfficient('neighbor', 4)
            break
        case 'Own 300 neighbors':
            multilyItemEfficient('neighbor', 5)
            break
        //Human
        case '50 humans':
            multilyItemEfficient('human', 2)
            break
        case '100 humans':
            multilyItemEfficient('human', 3)
            break
        case '200 humans':
            multilyItemEfficient('human', 4)
            break
        case '300 humans':
            multilyItemEfficient('human', 5)
            break
        //Harry
        case 'A chaotic family':
            multilyItemEfficient('Harry', 2)
            break
        case 'Own 100 Harry':
            multilyItemEfficient('Harry', 3)
            break
        case 'Own 200 Harry':
            multilyItemEfficient('Harry', 4)
            break
        case 'Own 300 Harry':
            multilyItemEfficient('Harry', 5)
            break
        //Robot
        case 'Own 50 robots':
            multilyItemEfficient('robot', 2)
            break
        case 'Own 100 robots':
            multilyItemEfficient('robot', 3)
            break
        case 'Own 200 robots':
            multilyItemEfficient('robot', 4)
            break
        case 'Own 300 robots':
            multilyItemEfficient('robot', 5)
            break
        //Avocado
        case 'Own 50 Nikocado Avocado':
            multilyItemEfficient('Nikocado Avocado', 2)
            break
        case 'Own 100 Nikocado Avocado':
            multilyItemEfficient('Nikocado Avocado', 3)
            break
        case 'Own 200 Nikocado Avocado':
            multilyItemEfficient('Nikocado Avocado', 4)
            break
        case 'Own 300 Nikocado Avocado':
            multilyItemEfficient('Nikocado Avocado', 5)
            break
        //Cao Cao
        case 'More troops, more cuts.':
            multilyItemEfficient('Cao Cao', 2)
            break
        case 'Any who stand in my way shall be 💩 down!':
            multilyItemEfficient('Cao Cao', 3)
            break
        case 'Has anyone not got diarrhea yet?':
            multilyItemEfficient('Cao Cao', 4)
            break
        case 'Unify China':
            multilyItemEfficient('Cao Cao', 5)
            break
        //Hacker
        case 'Own 50 hackers':
            multilyItemEfficient('hacker', 2)
            break
        case 'Own 100 hackers':
            multilyItemEfficient('hacker', 3)
            break
        case 'Own 200 hackers':
            multilyItemEfficient('hacker', 4)
            break
        case 'Own 300 hackers':
            multilyItemEfficient('hacker', 5)
            break
        //God
        case 'Multi-god':
            multilyItemEfficient('God', 2)
            break
        case 'Own 100 gods':
            multilyItemEfficient('God', 3)
            break
        case 'Own 200 gods':
            multilyItemEfficient('God', 4)
            break
        case 'Own 300 gods':
            multilyItemEfficient('God', 5)
            break
        //big cut
        case '"I had some delicious stew for lunch" said Kingkongdara':
            cutsPerSecond * 130 / 100
            update()
            break
        case 'Spawned 5 Kingkongdara\'s big cut':
            cutsPerSecond * 150 / 100
            update()
            break
        //else
        case 'A bit of luck':
            multilyEveryItemsAndClickingEfficient(10)
            break
    }
    function multilyItemEfficient(name, n) {
        let item = allItems.filter(item => item.name == name)[0]
        item.cps *= n
        loadShop()
    }
    function multilyEveryItemsAndClickingEfficient(n) {
        allItems.map(item => {
            item.cps *= n
        })
        cutsPerClick *= n
        loadShop()
    }
    update()
}

//shop
let shopContainer = document.getElementById('shop')
let CaoCaoDiarrheaIncrease

function loadShop() {
    shopContainer.innerHTML = ''
    for (let i = 0; i < itemsUnlocked; i++) {
        let item = allItems[i]
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
    }
    let buyButtons = Array.from(document.querySelectorAll('#shop button'))
    buyButtons.map((button, index) => {
        button.onclick = () => buyItem(index)
        let item = allItems[index]
        if (item.cost > point) button.disabled = true
        else button.disabled = false
    })
    calculateTotalCPS()
}

function buyItem(id) {
    let item = allItems[id]
    addPoint(-item.cost)
    item.owned++
    itemsUnlocked = id + 2 > itemsUnlocked && id + 2 <= allItems.length ? id + 2 : itemsUnlocked
    if (item.name == 'Cao Cao') {
        for (let i = 0; i < itemsUnlocked; i++) {
            let item = allItems[i]
            if (item.owned > 0) {
                item.cps += CaoCaoDiarrheaIncrease
            }
        }
        CaoCaoDiarrheaIncrease += 0.1
    }
    if (achievements.includes('Cover the world with cuts')) cutsPerClick += 10
    else if (achievements.includes('Cut monopoly')) cutsPerClick += 5
    else if (achievements.includes('Cut billionaire')) cutsPerClick++
    else if (achievements.includes('Crazy \'bout cuts!')) cutsPerClick += 0.1
    loadShop()
    loadStats()
    update()
}

function getItem(name) {
    return allItems.filter(item => item.name == name)[0]
}

//chat
let chatBox = document.getElementById('chat')
let chatList = document.getElementById('chat-list')
let chatForm = document.getElementById('chat-form')
let unseenChatNumberElement = document.getElementById('unseen-chat')
let chatLength
let viewedChat = 0

chatForm.onsubmit = (event) => {
    event.preventDefault()
    if (chatForm.input.value == '') return
    updateData('chat', {
        length: chatLength + 1,
        [chatLength]: {
            username,
            text: chatForm.input.value,
        }
    })
    chatForm.input.value = ''
}

async function loadChat() {
    chatLength = await readData('chat/length')
    if (chatBox.style.display == 'flex') viewedChat = chatLength
    showUnseenChatNumber()
    chatList.innerHTML = ''
    let allChatData = Object.values(await readData('chat') || [])
    allChatData.map(data => {
        if (typeof data == 'object') {
            let li = document.createElement('li')
            li.innerHTML = `<b>${data.username}:</b> `
            let span = document.createElement('span')
            span.innerText = data.text
            li.appendChild(span)
            chatList.appendChild(li)
        }
    })
}

function showUnseenChatNumber() {
    let unseenChatNumber = chatLength - viewedChat
    unseenChatNumberElement.innerText = chatLength - viewedChat
    unseenChatNumberElement.style.display = unseenChatNumber ? 'inline' : 'none'
    update()
}

//else
window.onoffline = () => signOut()
init()

function calculateTotalCPS() {
    cutsPerSecond = 0
    allItems.map((item, id) => {
        cutsPerSecond += item.cps * item.owned
    })
    cutsPerSecond *= multiplier
    cutsPerSecond = Number(cutsPerSecond.toFixed(3))
    cpsDis.innerText = 'per second: ' + formatNumber(cutsPerSecond)
    loadStats()
    update()
}

function formatNumber(number) {
    if (!number && number != 0) return
    number = number >= 1e21 ? number : Number(number.toFixed(3))
    let str = ''
    let _number = number
    let units = ['million', 'billion', 'trillion', 'quadrillion', 'quintillion']
    units.map((unit, index) => {
        let powOf10 = 10 ** (3 * (index + 2))
        if (number >= powOf10 && number < 1e21) {
            _number = number / powOf10
            str = unit
        }
    })
    number = _number >= 1e21 ? _number : _number.toLocaleString('en')
    return `${number}${str ? ' ' + str : ''}`
}

function convertTime(second) {
    let day = Math.floor(second / 86400)
    let hour = Math.floor((second - 86400 * day) / 3600)
    let minute = Math.floor((second - 86400 * day - 3600 * hour) / 60)
    second = second - 86400 * day - 3600 * hour - 60 * minute
    return (day + (day == 1 ? ' day ' : ' days ')) + (hour + (hour == 1 ? ' hour ' : ' hours ')) + (minute + (minute == 1 ? ' minute ' : ' minutes ')) + (second + (second == 1 ? ' second ' : ' seconds '))
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// devMode()
function devMode() {
    point = 1e10
    itemsUnlocked = allItems.length
    achievements = allAchievements.map(a => a.name)
}