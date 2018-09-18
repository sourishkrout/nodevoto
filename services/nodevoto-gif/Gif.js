'use strict';

const logger = require('../../lib/logger');
const gifCodeMap = require('../../lib/gif_codemap.json');

class Gif {
  constructor() {
    this.topGif = [
      ':musicchoice-cute-excited-3og0IPacuEoA6BBTUI:',
      ':1027kiisfm-finger-gun-wango-tango-3oKIPc4QtWXUNlfHpe:',
      ':bigbrotherca-wtf-what-1Q6yzrOnjDqTK:',
      ':comedycentral-workaholics-smile-l0Iyh6fhBXWBt3kU8:',
      ':cbs-cheers-ncis-los-angeles-3oKIPxK3KICQsFRs4M:',
      ':gotham-foxtv-fox-broadcasting-3oKIPlAKUjRpoc3duw:',
      ':funny-smile-text-mWVuNFR8CVguA:',
      ':siliconvalleyhbo-hbo-tech-xUA7bjoUNhwWVCfTR6:',
      ':nfl-258Am8OQ9QoL7miuN8:',
      ':dance-beyonce-RX7N03MEUafW8:',
      ':spongebob-cartoon-nickelodeon-thumbs-3o7absbD7PbTFQa0c8:',
      ':cat-goodbye-done-iPiUxztIL4Sl2:',
      ':david-hasselhoff-funny-crazy-jAF3mI0ja5hUk:',
      ':morning-good-vibes-3rSPmDt4h1WS7c2KgA:',
      ':win-winner-robdougie-8mdWuyUbqcOacqNWmJ:',
      ':happy-fun-excited-5Szx4RRo8hFcU4lwfD:',
      ':happy-excited-yes-3o752oaxOmmOUEvBCM:',
      ':love-cute-girl-YjF2enuCvcmDGoPiW9:',
      ':vhs-positive-vhspositive-3o7qE4opCd6f1NJeuY:',
      ':RosannaPansino-dog-hello-SHOnbgVOjmI4q6n0Gz:',
      ':reaction-mood-PO6fwUFlxcFF9ojkPQ:',
      ':bojackhorseman-3o7aD289PT63bP0p0c:',
      ':pokemon-school-college-rAm0u2k17rM3e:',
      ':dog-smile-work-xULW8FW2AcOtYCj4qs:',
      ':angry-monday-working-xiAqCzbB3eZvG:',
      ':next-pFwRzOLfuGHok:',
      ':cat-office-working-xUA7aVAw3xQ4pzYkiA:',
      ':thanks-thankyou-omerismos-jTHaR5a3B5L3jND7fP:',
      ':RobertEBlackmon-homer-simpson-wtf-7N8To79F9ny8Yfdnro:',
      ':reaction-aretha-franklin-oywxRdE6LDBESF4JbC:',
      ':thebachelorette-dance-kiss-NRtOdMpKvFDdu4O3Yp:',
      ':nehumanesociety-cat-cats-l4pTcCSqMck62swFi:',
      ':molangofficialpage-sad-tired-bummer-2bUmRLilhMNzHoSMPd:',
      ':garfield-cat-coffee-pzryvxGeykOxeC0fWb:',
      ':animation-lol-l44QmLrXyMhztpB28:',
      ':sloth-sloths-slothilda-3o6gaVztoohCD4cdAk:',
      ':oxygenmedia-side-eye-no-you-didnt-deitrick-haddon-TlK63EGn8YyRbiI6mBy:',
      ':afv-l41lFeGts4W1gbKCc:',
      ':dance-dancing-funny-l4JyOrGkMIwwGFvOg:',
      ':oscars-academy-awards-1997-l0Exg7sYYOUPDeUiA:',
      ':ussoccer-funny-lol-95Euu3wrLljyg:',
      ':justviralnet-funny-kid-5ZZSYqvcH6QppFQGI5:',
      ':airplane-i-am-serious-surely-you-cant-be-3oEjHLzm4BCF8zfPy0:',
      ':studiosoriginals-3o7btXv9i4Pnjb1m0w:',
      ':new-girl-new-girl-jess-day-newgirl-l4HofcnCafWVp7z9e:',
      ':jaydenbartels-jayden-bartels-5QLy2hJlQAsrm7ycdq:',
      ':bestfriends-3ohhwhGY6WXtejX86k:',
      ':sandiegozoo-mv2Txel3lmlA2tjlch:',
      ':love-art-cute-l0HU2sYgCZh3HiKnS:',
      ':natgeowild-pupparazzi-puppy-potty-face-uVj98vsKTb1lDRC4Hz:',
      ':netflix-dinosaur-cupcake-cupcakedino-vND72IouxKfcW6BlW2:',
      ':bestfriends-cat-reaction-2wgWuwZoxUT8ZJy9rs:',
      ':chescaleigh-9Prt3R3uE3QdCotmx9:',
      ':jimgaffigan-jim-gaffigan-4a9Tlz3Mj2LS5LMw33:',
      ':sza-l4FGDxbJmDwZhPaPC:',
      ':lildicky-lil-dicky-26FmS0Hh04k0zC9R6:',
      ':foxsearchlight-super-troopers-jay-chandrasekhar-1xo9BMTCjcKa6BnQsO:',
      ':heyviolet-3o7btWyOD1QLDZGqly:',
      ':teamcoco-httptoteamcococom2znbupz-3ov9k7AbzUYmckXSQE:',
      ':thisisgiphy-reaction-audience-3o7qDPfGhunRMZikI8:',
      ':thephizzogs-l3q2VIWn4W0z1rfos:',
      ':lego-l4q7VhGsL6BnXJrc4:',
      ':universityofkansas-cool-sunglasses-26BGG0Vj4nulivlO8:',
      ':funny-gif-artist-g-u0aCCHXiIOXA9fHOEB:',
      ':nfl-smith-trequan-tre-quan-OkjN1aAB7z7njXRLdr:',
      ':nfl-baker-mayfield-182RV9ta1F6v1iXhHl:',
      ':love-kiss-heart-xUOwGeHJEQ46pdsvWE:',
      ':studiosoriginals-valentines-day-happy-l3q2LJoEChm4UE7FS:',
      ':kawaii-dumpster-fire-1wXeLxuTVBZe0Ht7Zu:',
      ':art-cute-okay-3oxHQjb3brk6dOWBGg:',
      ':tommywiseau-football-super-bowl-xThta9MZdqAqDUvfeU:',
      ':tommywiseau-football-super-bowl-xUOwGb60WL1S0SEZEY:',
      ':cat-kitten-sleep-lck0BfsWrHeFUU63u1:',
      ':studiosoriginals-xT9IgOdxEm8gYoJblC:',
      ':alroker-al-roker-3ohzdFhIALkXTBxPkQ:',
      ':yes-100-agree-xUOwGjPHOGcv9ddpYc:',
      ':whatthefashion-love-yes-yas-fxz3b4oPaZs28sMNIf:',
      ':swizzbeatz-poison-swizz-beatz-pistol-on-my-side-dtCsOJshjPfiUyKJ2x:',
      ':musicchoice-dinah-jane-dinahjane-60rGCYzybV3uKSiPRR:',
      ':mostexpensivest-viceland-2-chainz-most-expensivest-oFRWQb3IDMcrge97mV:',
      ':mlb-fan-royals-dances-3dpU8296xMImdZwGx3:',
      ':Bad-Pug-pug-pugs-ahahah-tJOxsPuexkX4BNHcjx:',
      ':rtl5-rtl-5-hntm-hollands-next-top-model-3gOKitIckaTTDkuc74:',
      ':hallmarkmovie-the-disappearing-game-aurora-teagarden-mysteries-8UHRkgHJJwMpDsercS:',
      ':facethetruthtv-A5SyfVgTsOrzW8TPI6:',
      ':sjearthquakes-mls-san-jose-earthquakes-quakes-5pYrisHa1ai017EwbE:',
      ':hyperrpg-twitch-hyper-rpg-vcqhLPFLwsaWCOOEdk:'
    ];

    this.inMemAllGif = this.topGif.map(_em => {
      return {
        url: gifCodeMap[_em].src,
        shortcode: _em
      };
    });
  }

  getByShortcode(shortcode) {
    let found = this.inMemAllGif.filter(_em => {
      return _em.shortcode === shortcode;
    });
    logger.info(`Retrieved gif for shortcode [${shortcode}], which yielded [${found.length}] match(es).`);
    return found.length > 0 ? found[0] : null;
  }

  getList() {
    logger.info(`Returning results with [${this.inMemAllGif.length}] total entries.`);
    return this.inMemAllGif;
  }
}

module.exports = Gif;
