import allItems from './item.js';
import { cutsPerClick, changeItemCPS, changeCPC } from './script.js'

let allAchievements =
    [
        // Cuts had
        {
            name: 'The start',
            img: 'img/cut.png',
            description: 'Poop the first cut',
        },
        {
            name: 'Pooper',
            img: 'img/many-cuts.png',
            description: 'Have 1000 cuts',
        },
        {
            name: 'Crazy \'bout cuts!',
            img: 'img/crazy.png',
            description: 'Have 1 million cuts',
        },
        {
            name: 'Cut billionaire',
            img: 'img/billionaire.png',
            description: 'Have 1 billion cuts',
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
        {
            name: 'Casual pooping',
            img: 'img/apocalypse.png',
            description: 'Poop 1 cut per second',
        },
        {
            name: 'Cut apocalypse',
            img: 'img/apocalypse.png',
            description: 'Poop infinite cuts per second',
        },
        //Items
        {
            name: 'First item',
            img: 'img/cart.png',
            description: 'Buy a item for the first time',
        },
        //Leaderboard
        {
            name: 'Become the King',
            img: 'img/crown.png',
            description: 'Get in top 1',
            effect: () => {
                allItems.map(item => {
                    item.cps *= 2
                })
            },
            effectDes: 'All of your items are twice as efficient',
        },
    ]

export default allAchievements