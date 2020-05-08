# [Course](https://www.udemy.com/course/phaser-game-development/)

Although slightly outdated, still a valuable course in terms of concepts and seeing immediately how to apply them on games. Even with good documentation, the framework is quite big and maybe a little overwhelming at first, so a guide through main concepts is undoubtedly valuable.

In this repo I followed the exercises with a bit of modifications, like adding webpack and babel. Something to be noted is that the course uses version 2.6.2, and right now the world fancies version 3. This is not a big bummer, since the basic game concepts remain with some changes on names (eg: state/scene). Also adding webpack with version 3 was considerably easier.

While following I noticed many `this` juggling, and prototype inheritance that you need to do on js, but that thanks to ES6 gods and proper project configuration is redundant. Many of the changes on the games are on this regard. Understandably version 3 addresses most of this issues and gives (in my opinion) a cleaner API.

Biggest change is on the last project, Candy Matching, which I wanted to be closer to a real setup, so I used Phaser 3. You have to take your time to get used to Phaser docs to translate concepts between versions, but they're great. Version 3 has cleaner docs, API, and many things made easier (pooling is almost transparent). I recommend having also the examples page open, the example page helps as a guide through docs, when you can't find something on docs.

If a future me is looking for a starting point on configs, he should look to Candy Matching. By the way, that game is not completed because of my stubborness on not following any of what Pablo said (indeed closer to a real setup...), anyway right now I won't debug it 'cause there're more things to debug.
