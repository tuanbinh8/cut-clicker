let allAchievements =
    [
        // Cuts had (done)
        {
            name: 'Beginning',
            img: 'img/cut.png',
            description: 'Poop the first cut',
        },
        {
            name: 'Pooper',
            img: 'img/pooper.png',
            description: 'Have 1000 cuts',
            effect: 'Every items and clicking are 2 times as efficient',
        },
        {
            name: 'Crazy \'bout cuts!',
            img: 'img/crazy.png',
            description: 'Have 1 million cuts',
            effect: '<li>Every items and clicking are 3 times as efficient</li><li>From now on, each item bought boosts 0.1 CPS for clicking</li>',
        },
        {
            name: 'Cut billionaire',
            img: 'img/elon.png',
            description: 'Have 1 billion cuts',
            effect: '<li>Every items and clicking are 4 times as efficient</li><li>From now on, each item bought boosts 1 CPS for clicking</li>',
        },
        {
            name: 'Cut monopoly',
            img: 'img/monopoly.jpg',
            description: 'Have 1 trillion cuts',
            effect: '<li>Every items and clicking are 5 times as efficient</li><li>From now on, each item bought boosts 5 CPS for clicking</li>',
        },
        {
            name: 'Cover the world with cuts',
            img: 'img/cover.png',
            description: 'Have 1 quadrillion cuts',
            effect: '<li>Every items and clicking are 6 times as efficient</li><li>From now on, each item bought boosts 10 CPS for clicking</li>',
        },
        {
            name: '1 google cuts',
            img: 'img/google.png',
            description: 'Have 1e100 cuts',
            effect: 'Every items and clicking are 10 times as efficient',
        },
        {
            name: 'Can\'t count more cut',
            img: 'img/infinite.png',
            description: 'Have infinite cut',
        },
        {
            name: 'Buggy cuts',
            img: 'img/bug.png',
            description: 'Have NaN or undefined cuts',
        },
        //Cuts pooped in total
        {
            name: 'Pooped 1 thousand cuts in total',
            img: 'img/bug.png',
            description: 'Pooped 1 thousand cuts in total',
            effect: '+25% Cuts per second',
        },
        {
            name: 'Pooped 1 million cuts in total',
            img: 'img/bug.png',
            description: 'Pooped 1 million cuts in total',
            effect: '+50% Cuts per second',
        },
        {
            name: 'Let\'s rewind',
            img: 'img/rewind.png',
            description: 'Pooped 1 billion cuts in total',
            effect: '+75% Cuts per second',
        },
        {
            name: 'Pooped 1 trillion cuts in total',
            img: 'img/bug.png',
            description: 'Pooped 1 trillion cuts in total',
            effect: '+100% Cuts per second',
        },
        //clicking
        {
            name: 'Pooping cursor',
            img: 'img/cursor.png',
            description: 'Pooped 1000 cuts from clicking',
            effect: 'Clicking is twice as efficient',
        },
        {
            name: 'Pooped 1 million cuts from clicking',
            img: 'img/cursor.png',
            description: 'Pooped 1 million cuts from clicking',
            effect: 'Clicking is 3 times as efficient',
        },
        {
            name: 'Pooped 1 billion cuts from clicking',
            img: 'img/cursor.png',
            description: 'Pooped 1 billion cuts from clicking',
            effect: 'Clicking is 4 times as efficient',
        },
        {
            name: 'Pooped 1 trillion cuts from clicking',
            img: 'img/cursor.png',
            description: 'Pooped 1 trillion cuts from clicking',
            effect: 'Clicking is 5 times as efficient',
        },
        //CPS (done)
        {
            name: 'Normal pooper',
            img: 'img/fast-cut.jpg',
            description: 'Poop 1 cut per second',
        },
        {
            name: 'Super pooper',
            img: 'img/super-pooper.jpg',
            description: 'Poop 1000 cuts per second',
            effect: '+25% Cuts per second',
        },
        {
            name: 'Cut speedrunner',
            img: 'img/dream-poop.jpg',
            description: 'Poop 1 million cuts per second',
            effect: '+50% Cuts per second',
        },
        {
            name: 'Fast & Cut',
            img: 'img/fast-cut.jpg',
            description: 'Poop 1 billion cuts per second',
            effect: '+75% Cuts per second',
        },
        {
            name: 'World\'s fastest industry',
            img: 'img/fastest-industry.png',
            description: 'Poop 1 trillion cuts per second',
            effect: '+100% Cuts per second',
        },
        //Items owned
        {
            name: 'Own 100 items',
            img: 'img/kindergarten.jpg',
            description: 'Own 100 items',
            effect: '+25% Cuts per second'
        },
        {
            name: 'Own 200 items',
            img: 'img/kindergarten.jpg',
            description: 'Own 200 items',
            effect: '+50% Cuts per second'
        },
        {
            name: 'Own 500 items',
            img: 'img/kindergarten.jpg',
            description: 'Own 500 items',
            effect: '+75% Cuts per second'
        },
        {
            name: 'Own 1000 items',
            img: 'img/kindergarten.jpg',
            description: 'Own 1000 items',
            effect: '+100% Cuts per second'
        },
        //Baby (done)
        {
            name: 'Who needs a potty?',
            img: 'img/pot.png',
            description: 'Own 1 baby',
        },
        {
            name: 'Kindergarten',
            img: 'img/kindergarten.jpg',
            description: 'Own 50 babies',
            effect: 'Babies are twice as efficient'
        },
        {
            name: 'Let\'s save the world from population ageing',
            img: 'img/population-ageing.jpg',
            description: 'Own 100 babies',
            effect: 'Babies are 3 times as efficient'
        },
        {
            name: 'Baby labour',
            img: 'img/baby-labour.png',
            description: 'Own 200 babies',
            effect: 'Babies are 4 times as efficient'
        },
        {
            name: 'Baby invasion',
            img: 'img/baby-invasion.png',
            description: 'Own 300 babies',
            effect: 'Babies are 5 times as efficient'
        },
        //Dog (done)
        {
            name: 'Wolf wolf',
            img: 'img/dog.png',
            description: 'Own 1 dog',
        },
        {
            name: 'Have they bitten you?',
            img: 'img/dogbite.jpg',
            description: 'Own 50 dogs',
            effect: 'Dogs are twice as efficient'
        },
        {
            name: 'Have you fed them?',
            img: 'img/dog-food.jpg',
            description: 'Own 100 dogs',
            effect: 'Dogs are 3 times as efficient'
        },
        {
            name: 'You must be tired',
            img: 'img/cleaning-poop.png',
            description: 'Own 200 dogs',
            effect: 'Dogs are 4 times as efficient'
        },
        {
            name: 'Dog army',
            img: 'img/dog-army.jpg',
            description: 'Own 300 dogs',
            effect: 'Dogs are 5 times times as efficient'
        },
        //Neighbor
        {
            name: 'Own 1 neighbor',
            img: 'img/neighbor.png',
            description: 'Own 1 neighbor',
        },
        {
            name: 'Own 50 neighbors',
            img: 'img/neighbor.png',
            description: 'Own 50 neighbors',
            effect: 'Neighbors are twice times as efficient'
        },
        {
            name: 'Own 100 neighbors',
            img: 'img/neighbor.png',
            description: 'Own 100 neighbors',
            effect: 'Neighbors are 3 times times as efficient'
        },
        {
            name: 'Own 200 neighbors',
            img: 'img/neighbor.png',
            description: 'Own 200 neighbors',
            effect: 'Neighbors are 4 times times as efficient'
        },
        {
            name: 'Own 300 neighbors',
            img: 'img/neighbor.png',
            description: 'Own 300 neighbors',
            effect: 'Neighbors are 5 times times as efficient'
        },
        //Human (done)
        {
            name: '1 human',
            img: 'img/human.png',
            description: 'Own 1 human',
        },
        {
            name: '50 humans',
            img: 'img/human.png',
            description: 'Own 50 humans',
            effect: 'Humans are twice as efficient'
        },
        {
            name: '100 humans',
            img: 'img/human.png',
            description: 'Own 100 humans',
            effect: 'Humans are 3 times as efficient'
        },
        {
            name: '200 humans',
            img: 'img/human.png',
            description: 'Own 200 humans',
            effect: 'Humans are 4 times as efficient'
        },
        {
            name: '300 humans',
            img: 'img/human.png',
            description: 'Own 300 humans',
            effect: 'Humans are 5 times as efficient'
        },
        //Harry
        {
            name: 'Eats vegetables everyday',
            img: 'img/harry.png',
            description: 'Own 1 Harry',
        },
        {
            name: 'A chaotic family',
            img: 'img/chaotic-family.png',
            description: 'Own 50 Harry',
            effect: 'Harry are twice as efficient'
        },
        {
            name: 'Own 100 Harry',
            img: 'img/chaotic-family.png',
            description: 'Own 100 Harry',
            effect: 'Harry are 3 times as efficient'
        },
        {
            name: 'Own 200 Harry',
            img: 'img/chaotic-family.png',
            description: 'Own 200 Harry',
            effect: 'Harry are 4 times as efficient'
        },
        {
            name: 'Own 300 Harry',
            img: 'img/chaotic-family.png',
            description: 'Own 300 Harry',
            effect: 'Harry are 5 times as efficient'
        },
        //Robot
        {
            name: 'Peep po peep',
            img: 'img/robot.png',
            description: 'Own 1 robot',
        },
        {
            name: 'Own 50 robots',
            img: 'img/robot.png',
            description: 'Own 50 robots',
            effect: 'Robots are twice as efficient'
        },
        {
            name: 'Own 100 robots',
            img: 'img/robot.png',
            description: 'Own 100 robots',
            effect: 'Robots are 3 times as efficient'
        },
        {
            name: 'Own 200 robots',
            img: 'img/robot.png',
            description: 'Own 200 robots',
            effect: 'Robots are 4 times as efficient'
        },
        {
            name: 'Own 300 robots',
            img: 'img/robot.png',
            description: 'Own 300 robots',
            effect: 'Robots are 5 times as efficient'
        },
        //Avocado
        {
            name: 'First mukbang',
            img: 'img/first-mukbang.jpg',
            description: 'Own 1 Nikocado Avocado',
        },
        {
            name: 'Own 50 Nikocado Avocado',
            img: 'img/first-mukbang.jpg',
            description: 'Own 50 Nikocado Avocado',
            effect: 'Nikocado Avocado are twice as efficient'
        },
        {
            name: 'Own 100 Nikocado Avocado',
            img: 'img/first-mukbang.jpg',
            description: 'Own 50 Nikocado Avocado',
            effect: 'Nikocado Avocado are 3 times as efficient'
        },
        {
            name: 'Own 200 Nikocado Avocado',
            img: 'img/first-mukbang.jpg',
            description: 'Own 50 Nikocado Avocado',
            effect: 'Nikocado Avocado are 4 times as efficient'
        },
        {
            name: 'Own 300 Nikocado Avocado',
            img: 'img/first-mukbang.jpg',
            description: 'Own 50 Nikocado Avocado',
            effect: 'Nikocado Avocado are 5 times as efficient'
        },
        //Cao Cao (done)
        {
            name: 'Time travel',
            img: 'img/time-travel.jpg',
            description: 'Own 1 Cao Cao',
        },
        {
            name: 'More troops, more cuts.',
            img: 'img/caocao.jpg',
            description: 'Own 50 Cao Cao',
            effect: 'Cao Cao are twice as efficient',
        },
        {
            name: 'Any who stand in my way shall be 💩 down!',
            img: 'img/caocao.jpg',
            description: 'Own 100 Cao Cao',
            effect: 'Cao Cao are 3 times as efficient',
        },
        {
            name: 'Has anyone not got diarrhea yet?',
            img: 'img/diarrhea.jpeg',
            description: 'Own 200 Cao Cao',
            effect: 'Cao Cao are 4 times as efficient',
        },
        {
            name: 'Unify China',
            img: 'img/unified-china.jpg',
            description: 'Own 300 Cao Cao',
            effect: 'Cao Cao are 5 times as efficient',
        },
        //Hacker
        {
            name: 'stealCut()',
            img: 'img/stealCut.png',
            description: 'Own 1 hacker',
        },
        {
            name: 'Own 50 hackers',
            img: 'img/stealCut.png',
            description: 'Own 50 hackers',
            effect: 'Cao Cao are twice as efficient',
        },
        {
            name: 'Own 100 hackers',
            img: 'img/stealCut.png',
            description: 'Own 100 hackers',
            effect: 'Cao Cao are 3 times as efficient',
        },
        {
            name: 'Own 200 hackers',
            img: 'img/stealCut.png',
            description: 'Own 200 hackers',
            effect: 'Cao Cao are 4 times as efficient',
        },
        {
            name: 'Own 300 hackers',
            img: 'img/stealCut.png',
            description: 'Own 300 hackers',
            effect: 'Cao Cao are 5 times as efficient',
        },
        //God
        {
            name: 'God does exist,... at least from now',
            img: 'img/god.jpg',
            description: 'Own 1 god',
        },
        {
            name: 'Multi-god',
            img: 'img/multi-god.jpg',
            description: 'Own 50 gods',
            effect: 'Gods are twice as efficient',
        },
        {
            name: 'Own 100 gods',
            img: 'img/multi-god.jpg',
            description: 'Own 100 gods',
            effect: 'Gods are 3 times as efficient',
        },
        {
            name: 'Own 200 gods',
            img: 'img/multi-god.jpg',
            description: 'Own 200 gods',
            effect: 'Gods are 4 times as efficient',
        },
        {
            name: 'Own 300 gods',
            img: 'img/multi-god.jpg',
            description: 'Own 300 gods',
            effect: 'Gods are 5 times as efficient',
        },
        //big cut
        {
            name: '"I forgot to flush the toilet" said Kingkongdara',
            img: 'img/big-cut.jpg',
            description: 'Spawn 1 Kingkongdara\'s big cut',
        },
        {
            name: '"I had some delicious stew for lunch" said Kingkongdara',
            img: 'img/stew.png',
            description: 'Spawn 2 Kingkongdara\'s big cut at once',
            effect: '+30% Cuts per second',
        },
        {
            name: 'Spawned 5 Kingkongdara\'s big cut',
            img: 'img/stew.png',
            description: 'Spawned 5 Kingkongdara\'s big cut',
            effect: '+50% Cuts per second',
        },
        //else
        {
            name: 'A bit of luck',
            img: 'img/lucky.png',
            description: 'You have a 1/1 billion chance every second of getting this achievement',
            effect: 'Clicking and every items are 10 times as efficient',
        },
        {
            name: 'Autoclicker',
            img: 'img/autoclicker.jpg',
            description: 'Click the cut in at least 25 clicks per second',
        },
    ]

export default allAchievements
