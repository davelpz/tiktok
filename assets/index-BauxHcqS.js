import{p as e,P as t}from"./phaser-Dp_CM4nq.js";!function(){const e=document.createElement("link").relList;if(!(e&&e.supports&&e.supports("modulepreload"))){for(const e of document.querySelectorAll('link[rel="modulepreload"]'))t(e);new MutationObserver((e=>{for(const s of e)if("childList"===s.type)for(const e of s.addedNodes)"LINK"===e.tagName&&"modulepreload"===e.rel&&t(e)})).observe(document,{childList:!0,subtree:!0})}function t(e){if(e.ep)return;e.ep=!0;const t=function(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),"use-credentials"===e.crossOrigin?t.credentials="include":"anonymous"===e.crossOrigin?t.credentials="omit":t.credentials="same-origin",t}(e);fetch(e.href,t)}}();class s extends e.Scene{constructor(){super("Boot")}preload(){this.load.image("background","assets/images/bg.png")}create(){this.scene.start("Preloader")}}class i extends Phaser.GameObjects.Container{constructor(e,t,s,i,a){super(e,t,s),this.suit=i,this.value=a,this.isFaceUp=!1,this.isInDeck=!0,this.currentPosition=void 0,this.front=e.add.image(0,0,`card_${i}_${a}`),this.back=e.add.image(0,0,"cardback_blue"),this.add([this.back,this.front]),this.front.setVisible(!1),e.add.existing(this),this.setSize(this.front.width,this.front.height),console.log("Setting up interactive area:",this.front.width,this.front.height),this.setInteractive({useHandCursor:!0}),this.debugBounds=e.add.rectangle(0,0,this.front.width,this.front.height,16711680,.2),this.debugBounds.setVisible(!1),this.add(this.debugBounds),this.originalX=t,this.originalY=s}enableDragging(){this.setInteractive({draggable:!0}),this.scene.input.setDraggable(this)}disableDragging(){this.removeInteractive(),this.setInteractive({useHandCursor:!0}),this.input&&(this.input.draggable=!1)}setupDragEvents(){this.on("dragstart",(()=>{this.scene.children.bringToTop(this),console.log("DRAG START:",this.suit,this.value)})),this.on("drag",((e,t,s)=>{console.log("DRAGGING to:",t,s),this.x=t,this.y=s})),this.on("dragend",(()=>{console.log("DRAG END")})),console.log("Drag events initialized for:",this.suit,this.value)}flip(){if(this.scene.tweens.isTweening(this))return;const e=this.scaleX;this.scaleY,this.scene.tweens.add({targets:this,scaleX:0,duration:150,ease:"Linear",onComplete:()=>{this.isFaceUp=!this.isFaceUp,this.front.setVisible(this.isFaceUp),this.back.setVisible(!this.isFaceUp),this.scene.tweens.add({targets:this,scaleX:e,duration:150,ease:"Linear"})}}),console.log(`Flipped card: ${this.value} of ${this.suit}`)}returnToOriginalPosition(){this.scene.tweens.add({targets:this,x:this.originalX,y:this.originalY,duration:300,ease:"Back.easeOut"})}setCardBack(e){this.back.setTexture(`cardback_${e}`)}getValue(){return this.value}getSuit(){return this.suit}getNumericValue(){switch(this.value){case"ace":return 1;case"jack":return 11;case"queen":return 12;case"king":return 13;default:return parseInt(this.value)}}setHomePosition(e,t){this.originalX=e,this.originalY=t,this.x=e,this.y=t}setInDeck(e){this.isInDeck=e}}class a{constructor(e,t,s){this.scene=e,this.deckX=t,this.deckY=s,this.cards=[],this.dealtCards=[];const a=["ace","2","3","4","5","6","7","8","9","10","jack","queen","king"];["clubs","diamonds","hearts","spades"].forEach((n=>{a.forEach((a=>{const o=new i(e,t,s,n,a);o.setInDeck(!0),this.cards.push(o)}))})),this.shuffle()}updateDebugText(){this.debugText.setText(`Deck: ${this.cards.length} cards\nDealt: ${this.dealtCards.length} cards\nTotal: ${this.cards.length+this.dealtCards.length} cards`)}shuffle(){for(let e=this.cards.length-1;e>0;e--){const t=Math.floor(Math.random()*(e+1));[this.cards[e],this.cards[t]]=[this.cards[t],this.cards[e]]}this.cards.forEach(((e,t)=>{e.setPosition(this.deckX,this.deckY),e.setHomePosition(this.deckX,this.deckY),this.scene.children.bringToTop(e)}))}dealCard(){if(this.cards.length>0){const e=this.cards.pop();return e.setInDeck(!1),this.dealtCards.push(e),this.scene.children.bringToTop(e),e}return null}dealCards(e){const t=[];for(let s=0;s<e&&this.cards.length>0;s++)t.push(this.dealCard());return t}dealToPosition(e,t){const s=this.dealCards(4);return s.forEach(((s,i)=>{s&&this.scene.tweens.add({targets:s,x:e,y:t+.5*i,duration:200,ease:"Power1",onComplete:()=>{s.setHomePosition(e,t+.5*i),s.flip()}})})),s}getCardsRemaining(){return this.cards.length}resetDeck(){for(;this.dealtCards.length>0;){const e=this.dealtCards.pop();e.setInDeck(!0),this.scene.tweens.add({targets:e,x:this.deckX,y:this.deckY,duration:300,ease:"Back.easeOut",onComplete:()=>{e.isFaceUp&&e.flip()}}),this.cards.push(e)}this.scene.time.delayedCall(400,(()=>{this.shuffle(),this.updateDebugText()}))}setCardBacks(e){[...this.cards,...this.dealtCards].forEach((t=>{t.setCardBack(e)}))}isTopCard(e){return this.cards.length>0&&this.cards[this.cards.length-1]===e}handleCardClick(){console.log("Handling card click");const e=this.dealCard();if(e){const t=this.scene.cameras.main.centerX+200,s=this.scene.cameras.main.centerY;this.scene.tweens.add({targets:e,x:t,y:s,duration:200,ease:"Power1",onComplete:()=>{e.flip(),e.setHomePosition(t,s)}}),this.updateDebugText()}}}class n{constructor(e,t,s){this.scene=e,this.centerX=t,this.centerY=s;const i=Math.min(this.scene.scale.width,this.scene.scale.height);this.radius=.4*i,this.events=new Phaser.Events.EventEmitter,this.positions=new Map,this.cardStacks=new Map,this.setupClockPositions(),this.setupDropZones()}get cardScale(){return this.radius*Math.tan(Math.PI/6)*.55/234}setupClockPositions(){for(let e=1;e<=12;e++){const t=(30*(e-1)-60)*(Math.PI/180),s=this.centerX+this.radius*Math.cos(t),i=this.centerY+this.radius*Math.sin(t);this.positions.set(e,{x:s,y:i}),this.cardStacks.set(e,[])}this.positions.set(13,{x:this.centerX,y:this.centerY}),this.cardStacks.set(13,[])}debugDrawPositions(){for(let e=1;e<=13;e++){const t=this.positions.get(e);this.scene.add.circle(t.x,t.y,30,65280,.3),this.scene.add.text(t.x-5,t.y-5,e.toString(),{font:"16px Arial",fill:"#ffffff"})}}setupDropZones(){this.dropZones=new Map;for(let e=1;e<=13;e++){const t=this.positions.get(e),s=234*this.cardScale*1.1,i=333*this.cardScale*1.1,a=this.scene.add.rectangle(t.x,t.y,s,i,65280,1);this.dropZones.set(e,a)}}dealInitialCards(){const e=this.scene.deck;for(let t=1;t<=13;t++){const s=e.dealCards(4),i=this.positions.get(t);this.fixCardStackPositions(s,i),s.forEach(((e,a)=>{e.setScale(this.cardScale,this.cardScale),e.disableDragging(),e.currentPosition=t,13===t&&a===s.length-1&&(e.enableDragging(),e.flip(),this.cycleCorrectCardsToBottom(s,t,i))})),this.cardStacks.set(t,s)}}handleCardDrop(e,t){if(this.isCardInCorrectPosition(e,t)){console.log("Card placed in correct position:",e.getNumericValue());const s=this.positions.get(t),i=this.cardStacks.get(t);this.removeFromPreviousStack(e),this.addCardToStackBottom(e,i,s),e.currentPosition=t,this.updateStackDepths(i),this.cycleCorrectCardsToBottom(i,t,s),this.events.emit("cardPlaced",{card:e,position:t,stackSize:i.length}),this.checkWinCondition()}else console.log("Invalid placement for card:",e.getNumericValue(),"at position:",t),e.returnToOriginalPosition(),this.events.emit("invalidPlacement",{card:e,attemptedPosition:t})}isCardInCorrectPosition(e,t){return e.getNumericValue()===t}removeFromPreviousStack(e){if(void 0!==e.currentPosition){const t=this.cardStacks.get(e.currentPosition),s=t.indexOf(e);s>-1&&t.splice(s,1)}}addCardToStackBottom(e,t,s){t.unshift(e),this.fixCardStackPositions(t,s),e.disableDragging()}updateStackDepths(e){e.forEach(((e,t)=>{e.setDepth(t)}))}cycleCorrectCardsToBottom(e,t,s){let i=e[e.length-1],a=0;for(;i.getNumericValue()===t&&a<e.length;)i.isFaceUp||i.flip(),e.unshift(e.pop()),this.fixCardStackPositions(e,s),this.updateStackDepths(e),i=e[e.length-1],a++;i.isFaceUp||i.flip(),i.enableDragging()}fixCardStackPositions(e,t){e.forEach(((e,s)=>{this.setCardStackPosition(e,t,s)}))}setCardStackPosition(e,t,s){const i=t.y+2*s,a=t.x+2*s;e.setPosition(a,i),e.setHomePosition(a,i)}checkWinCondition(){return!!this.isKingPositionComplete()&&(this.areAllPositionsComplete()?(console.log("Game won!"),this.events.emit("gameWon")):(console.log("Game lost!"),this.events.emit("gameLost")),!0)}isKingPositionComplete(){const e=this.cardStacks.get(13);return console.log("Checking king stack:",e),4===e.length&&e.every((e=>e.isFaceUp&&13===e.getNumericValue()))}areAllPositionsComplete(){return Array.from({length:12},((e,t)=>t+1)).every((e=>this.cardStacks.get(e).every((t=>t.isFaceUp&&t.getNumericValue()===e))))}testCheckWinCondition(){class e{constructor(e,t){this.value=e,this.isFaceUp=t}getNumericValue(){return this.value}}this.cardStacks.set(13,[new e(13,!1),new e(13,!1),new e(13,!1),new e(13,!1)]);const t=this.checkWinCondition();console.log("Test 1 - King stack:",this.cardStacks.get(13)),console.assert(!1===t,"Game should continue when king position is not complete"),this.cardStacks.set(13,[new e(13,!0),new e(13,!0),new e(13,!0),new e(13,!0)]),this.cardStacks.set(1,[new e(1,!1),new e(1,!1),new e(1,!0),new e(1,!0)]);const s=this.checkWinCondition();console.log("Test 2 - King stack:",this.cardStacks.get(13)),console.log("Test 2 - Position 1:",this.cardStacks.get(1)),console.assert(!0===s,"Game should be over (lost) when king position is complete but others aren't");for(let c=1;c<=12;c++)this.cardStacks.set(c,[new e(c,!0),new e(c,!0),new e(c,!0),new e(c,!0)]);const i=this.checkWinCondition();console.log("Test 3 - All positions complete"),console.assert(!0===i,"Game should be over (won) when all positions complete"),this.cardStacks.set(13,[new e(13,!0),new e(13,!0)]),this.cardStacks.set(1,[new e(1,!0),new e(1,!0)]),this.cardStacks.set(2,[new e(2,!0),new e(2,!0)]),this.cardStacks.set(3,[new e(3,!1),new e(3,!0)]);const a=this.checkWinCondition();console.log("Test 4 - Mixed completion state"),console.assert(!0===a,"Game should be over (lost) when king complete but only some positions complete"),this.cardStacks.set(13,[new e(13,!0),new e(13,!0)]),this.cardStacks.set(1,[new e(2,!0),new e(1,!0)]);const n=this.checkWinCondition();console.log("Test 5 - Wrong cards in position"),console.assert(!0===n,"Game should be over (lost) when king complete and positions have wrong cards"),this.cardStacks.set(13,[new e(13,!0),new e(13,!0)]),this.cardStacks.set(1,[]),this.cardStacks.set(2,[new e(2,!0)]);const o=this.checkWinCondition();console.log("Test 6 - Empty stack"),console.assert(!0===o,"Game should be over (lost) when king complete and some positions empty");let r="";this.events.on("gameWon",(()=>{r="won"})),this.events.on("gameLost",(()=>{r="lost"}));for(let c=1;c<=12;c++)this.cardStacks.set(c,[new e(c,!0),new e(c,!0)]);this.cardStacks.set(13,[new e(13,!0),new e(13,!0)]),this.checkWinCondition(),console.assert("won"===r,`Expected 'won' event but got '${r}'`),r="",this.cardStacks.set(1,[new e(1,!1),new e(1,!0)]),this.checkWinCondition(),console.assert("lost"===r,`Expected 'lost' event but got '${r}'`)}}class o extends t.Scene{constructor(){super({key:"Game"})}create(){this.deck=new a(this,this.cameras.main.centerX-200,this.cameras.main.centerY),this.clock=new n(this,this.cameras.main.centerX,this.cameras.main.centerY),this.clock.dealInitialCards(),this.input.on("drag",((e,t,s,a)=>{t instanceof i?t.input.draggable?(t.x=s,t.y=a,t.setDepth(5)):console.log("Card is not draggable:",t):console.log("Not a card:",t)})),this.input.on("dragend",((e,s)=>{console.log("dragend",s);const i=s.getNumericValue(),a=this.clock.positions.get(i);t.Math.Distance.Between(s.x,s.y,a.x,a.y)<30?this.clock.handleCardDrop(s,i):s.returnToOriginalPosition()})),this.clock.events.on("gameWon",(()=>{console.log("Game Won!"),this.displayWinMessage()})),this.clock.events.on("gameLost",(()=>{console.log("Game Lost!"),this.displayLossMessage()}))}displayWinMessage(){const e=this.add.text(this.cameras.main.centerX,this.cameras.main.centerY,"You Win!",{fontSize:"48px",color:"#00FF00"});e.setOrigin(.5),e.setDepth(10)}displayLossMessage(){const e=this.add.text(this.cameras.main.centerX,this.cameras.main.centerY,"Game Over",{fontSize:"48px",color:"#FF0000"});e.setOrigin(.5),e.setDepth(10)}}class r extends e.Scene{constructor(){super("GameOver")}create(){this.cameras.main.setBackgroundColor(16711680),this.add.image(512,384,"background").setAlpha(.5),this.add.text(512,384,"Game Over",{fontFamily:"Arial Black",fontSize:64,color:"#ffffff",stroke:"#000000",strokeThickness:8,align:"center"}).setOrigin(.5),this.input.once("pointerdown",(()=>{this.scene.start("MainMenu")}))}}class c extends e.Scene{constructor(){super("MainMenu")}create(){let e=this.cameras.main.width,t=this.cameras.main.height;this.add.image(e/2,t/2,"background"),this.add.image(e/2,t/2,"logo"),this.add.text(e/2,t/2+100,"Main Menu",{fontFamily:"Arial Black",fontSize:38,color:"#ffffff",stroke:"#000000",strokeThickness:8,align:"center"}).setOrigin(.5),this.input.once("pointerdown",(()=>{this.scene.start("Game")}))}}class h extends e.Scene{constructor(){super("Preloader")}init(){let e=this.cameras.main.width,t=this.cameras.main.height;this.add.image(e/2,t/2,"background"),this.add.rectangle(e/2,t/2,e/2,32).setStrokeStyle(1,16777215);const s=this.add.rectangle(e/2-e/4+4,t/2,4,28,16777215);this.load.on("progress",(t=>{s.width=4+(e/2-8)*t}))}preload(){this.load.image("logo","assets/images/logo.png");const e=["clubs","diamonds","hearts","spades"],t=["2","3","4","5","6","7","8","9","10"],s=["ace","jack","queen","king"];e.forEach((e=>{t.forEach((t=>{this.load.image(`card_${e}_${t}`,`assets/images/cards/fronts/${e}_${t}.png`)}))})),e.forEach((e=>{s.forEach((t=>{this.load.image(`card_${e}_${t}`,`assets/images/cards/fronts/${e}_${t}.png`)}))})),this.load.image("card_joker_red","assets/images/cards/fronts/joker_red.png"),this.load.image("card_joker_black","assets/images/cards/fronts/joker_black.png"),["abstract","abstract_clouds","abstract_scene","astronaut","blue","blue2","castle","cars","fish","frog","red","red2"].forEach((e=>{this.load.image(`cardback_${e}`,`assets/images/cards/backs/${e}.png`)}))}create(){this.scene.start("MainMenu")}}function d(){const e=Math.min(window.innerWidth,window.innerHeight);return{width:e,height:e}}const l=d(),g={type:t.AUTO,parent:"game-container",width:l.width,height:l.height,backgroundColor:"#000000",scene:[s,h,c,o,r],physics:{default:"arcade",arcade:{debug:!1,gravity:{y:0}}}},u=new t.Game(g);window.addEventListener("resize",(()=>{const e=d();u.scale.resize(e.width,e.height)}));
