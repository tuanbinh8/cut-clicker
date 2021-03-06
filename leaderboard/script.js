import { readData, readDataWhere, changeListener } from '../js/database.js'
let username
let leaderboardDis = document.getElementById('leaderboard')

async function sync() {
    let data = await readDataWhere('users', 'token', localStorage.token)
    if (!data) {
        localStorage.removeItem('token')
        location.reload()
    } else {
        username = data.name
        changeListener('users', loadLeaderboard)
    }
}

if (localStorage.token) sync()
else changeListener('users', loadLeaderboard)

async function loadLeaderboard() {
    leaderboardDis.innerHTML = ''
    let allUsers = Object.values(await readData('users'))
    allUsers.sort(function (a, b) { return b.point - a.point });
    let userPlace = allUsers.findIndex(user => user.name == username)
    for (let i = 0; i < allUsers.length; i++) {
        let user = allUsers[i]
        if (!user) break
        if (userPlace == i)
            leaderboardDis.innerHTML += `<li><b>(${i + 1}) ${user.name}: ${user.point}💩</b></li>`
        else
            leaderboardDis.innerHTML += `<li>(${i + 1}) ${user.name}: ${user.point}💩</li>`
    }
}