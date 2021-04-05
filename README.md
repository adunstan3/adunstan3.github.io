# 205 Galaga
Lowell Deschenes, Sam Pitonyak, Andrew Dunstan
---
For our final project, we are working on an implementation of the arcade game Galaga.
The bulk of the work is done in javascript with the p5 animation library. We save
high scores using google firebase. Because we use firebase for scores, we can keep
the project as a static website. We are hosting on github's static hosting service.

### Running our code:
We are using content delivery networks to load our libraries. This means you can
download and run the source code without worrying about dependencies.
We are using image assets in the project, which means you will need to put the
site on a live server on your localhost. This is simple to do.
- [Webstorm instructions](https://blog.jetbrains.com/webstorm/2013/03/built-in-server-in-webstorm-6/)
- [Atom instructions](https://atom.io/packages/atom-live-server)
- [NPM instructions](https://www.npmjs.com/package/live-server) (Works for every editor)

If you don't need the code to run on your machine, then follow the link to view
our progress.

<p align="center"><a href="https://adunstan3.github.io/">Our Galaga Site</a></p>

### Sprint 1 Tasks:
- Create base structure for the game (game class, object handler, etc) (21)
- Do UI design to get a feel for how everything should look (don’t need to implement
  everything till second sprint) (13)
- Level indicator (no end level right now, just basic increments) (5) used to
  increase enemies and there speed/rate of fire
- Create player and computer icons (not detailed / can be just shapes) (5)
- Point system for each level (3)
- Create the bullets for both user and computer (13)
- Create enemy class (13)
- Create functionality based on enemy ship
- Create player class (8)
- Create flight path function for enemy ships  (13)
- Create simple html and css for website (5)
