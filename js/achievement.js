import allItems from './item.js';
import { cutsPerClick, changeItemCPS, changeCPC, changePoint } from './script.js'

let allAchievements =
    [
        // Cuts had
        {
            name: 'Beginning',
            img: 'img/cut.png',
            description: 'Poop the first cut',
        },
        {
            name: 'Pooper',
            img: 'img/pooper.png',
            description: 'Have 1000 cuts',
        },
        {
            name: 'Crazy \'bout cuts!',
            img: 'img/crazy.png',
            description: 'Have 1 million cuts',
            effect: () => {
                allItems.map((item, id) => {
                    changeItemCPS(id, item.cps * 2)
                })
            },
            effectDes: 'Every items are twice as efficient',
        },
        {
            name: 'Cut billionaire',
            img: 'img/elon.png',
            description: 'Have 1 billion cuts',
            effect: () => {
                allItems.map((item, id) => {
                    changeItemCPS(id, item.cps * 2)
                })
            },
            effectDes: 'Every items are twice as efficient',
        },
        {
            name: 'Cut legendary',
            img: 'img/legendary.png',
            description: 'Have 1 trillion cuts',
            effect: () => {
                allItems.map((item, id) => {
                    changeItemCPS(id, item.cps * 2)
                })
            },
            effectDes: 'Every items are twice as efficient',
        },
        {
            name: '1 google cuts',
            img: 'img/google.png',
            description: 'Have 1e100 cuts',
            effect: () => {
                allItems.map((item, id) => {
                    changeItemCPS(id, item.cps * 5)
                })
            },
            effectDes: 'Every items are 5 times as efficient',
        },
        {
            name: 'Can\'t count more cut',
            img: 'img/infinite.png',
            description: 'Have infinite cut',
        },
        {
            name: 'Buggy cuts',
            img: 'img/bug.png',
            description: 'Have NaN cuts',
        },
        //CPS
        //Items
        {
            name: 'First item',
            img: 'img/cart.png',
            description: 'Buy a item for the first time',
        },
        //Baby
        {
            name: 'Who needs a potty?',
            img: 'img/pot.png',
            description: 'Own 1 baby',
        },
        {
            name: 'Kindergarten',
            img: 'img/kindergarten.jpg',
            description: 'Own 100 babies',
        },
        //Dog
        {
            name: 'Wolf wolf',
            img: 'img/dog.png',
            description: 'Own 1 dog',
        },
        //Robot
        {
            name: 'Peep po peep',
            img: 'img/robot.png',
            description: 'Own 1 robot',
        },
        //Cao Cao
        {
            name: 'Run',
            img: 'img/chase.png',
            description: 'Own 1 Cao Cao',
        },
        {
            name: 'I\'d rather betray the world than let the world betray me',
            img: 'img/kingdom.jpg',
            description: 'Own 100 Cao Cao',
            effect: () => {
                changePoint(0)
            },
            effectDes: 'Deduct all of your point',
        },
        //Leaderboard
        {
            name: 'Become the King',
            img: 'img/crown.png',
            description: 'Get in top 1 in the leaderboard',
        },
        {
            name: 'The 100th most popular pooper',
            img: 'img/crown.png',
            description: 'Get in top 100 in the leaderboard',
        },
        {
            name: 'Beat up the other',
            img: 'img/up.png',
            description: 'Rank up',
        },
        //else
        {
            name: 'Lucky',
            img: 'img/lucky.png',
            description: 'You have a 1/1 billion chance every second of getting this achievement',
            effect: () => {
                changeCPC(cutsPerClick * 10)
                allItems.map((item, id) => {
                    changeItemCPS(id, item.cps * 10)
                })
            },
            effectDes: 'Clicking and every items are 10 times as efficient',
        },
        {
            name: 'Only hackers can hack, not you',
            img: 'img/hacker.jpg',
            description: '',
            effect: () => {
                changeCPC(cutsPerClick * 10)
                allItems.map((item, id) => {
                    changeItemCPS(id, item.cps * 10)
                })
            },
            effectDes: 'Reset your game, except for the items\' cost',
        }
    ]

export default allAchievements