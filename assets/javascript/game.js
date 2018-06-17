/**********************************************
*Author: Baruch Flores                        *
*Homework 4: jQuery Assignment            	  *
*UCB Extension - Full-Stack Bootcamp          *
*June 2018                                    *
***********************************************/


// Global Flags
var isHeroPicked = false; //flags if hero has been chosen
var characterLock = false; //controls character selection area
var attackLock = false; //enables/disables attack button events

//List of characters
var characterList = [];

//Stores the index in characterList of current fighters 
var HeroId;
var EnemyId;


class Character {
    constructor(name, hp, ap, cap, auAttack, auDie) {
        this.name = name;
        this.hp = hp;
        this.initialHp = hp; //for progress bar
        this.ap = ap;
        this.initialAp = ap; //for power build up
        this.cap = cap;
        // this.img = "assets/images/" + this.name + ".png";
        this.ico = "assets/images/" + this.name + "_ico.jpg";
        this.img = "assets/images/" + this.name + ".gif";
        this.auAttack = auAttack;
        this.auDie = auDie;
    }

    increaseAp() {
        this.ap += this.initialAp;
    }

    reduceHp(amount) {
        this.hp -= amount;
    }

    isAlive() {
        return this.hp > 0;
    }

    printIco() {
        var card = $("<div>");
        card.addClass("card bg-transparent float-left char_ico")
            .css({ "width": "auto", "height": "auto", "margin-right": "2rem" })
            .attr("data-ico-name", this.name);

        var hp = $("<p>");
        hp.addClass("card-text text-center m-0 p-0")
            .css("font-size", ".7rem")
            .text(this.hp);

        var img = $("<img>");
        img.addClass("card-img-top img-fluid img-thumbnail ico")
            .attr("src", this.ico)
            .attr("alt", "character icon")
            .css({ "width": "100px", "height": "100px" });


        var cardBody = $("<div>");
        cardBody.addClass("card-body p-0");

        var name = $("<p>");
        name.addClass("card-text text-center")
            .text(this.name);

        card.append(hp)
            .append(img)
            .append(cardBody.append(name));

        return card;
    }

    printImg() {
        var card = $("<div>");
        card.addClass("card mx-auto char_img p-0 bg-transparent")
            .css({ "height": "1px" })
            .attr("data-img-name", this.name);

        var name = $("<h3>");
        name.addClass("card-text text-center my-4 p-0 character_name")
            .css("font-size", "1.2rem")
            .text(this.name);


        var img = $("<img>");
        img.addClass("card-img-top img-fluid mx-auto img")
            .attr("src", this.img)
            .attr("alt", "character image")
            .css({ "width": "175px", "height": "250px", "box-sizing": "content-box" });

        var cardBody = $("<div>");
        cardBody.addClass("card-body p-0");

        var progress = $("<div>");
        progress.addClass("progress mt-5 border border-warning")
            .css("width", "100%");

        var healthProgress = $("<div>");
        healthProgress.addClass("progress-bar progress-bar-striped progress-bar-animated")
            .attr({ "role": "progressbar", "aria-valuenow": this.hp, "valuemin": "0", "aria-valuemax": this.initialHp, "style": "width: 100%" })
            .text(this.hp);

        card.append(name)
            .append(img)
            .append(cardBody.append(progress.append(healthProgress)));

        return card;
    }
}


//Initializes the game engine
function initEngine() {

    var Ryu = new Character("Ryu", 100, 4, 6, "auHadoken", "auDie");
    var Dhalsim = new Character("Dhalsim", 100, 2, 13, "auYogaFlame", "auDie");
    var EHonda = new Character("EHonda", 100, 6, 3, "auDufgoi", "auDie");
    var Chunli = new Character("Chunli", 100, 3, 8, "auBirdKick", "auDieChunli");
    characterList = [Ryu, Dhalsim, EHonda, Chunli];

    // Character audio maps
    for (var i = 0; i < characterList.length; i++) {

        audioMap.set(characterList[i].auAttack, createAudio(characterList[i].auAttack, "assets/audio/" + characterList[i].auAttack + ".mp3"));
        audioMap.set(characterList[i].auDie, createAudio(characterList[i].auDie, "assets/audio/" + characterList[i].auDie + ".mp3"));
    }

    isHeroPicked = false;
    characterLock = false;
    attackLock = false;
    HeroId = undefined;
    EnemyId = undefined;

    console.log(characterList);


    //Cleans up the character selection area
    $(".char_ico").remove();
    $(".char_ico_null").remove();

    //Prints the fighter list on the character selection area
    characterList.forEach(function (fighter) {
        $(".char_selection").append(fighter.printIco());
    });
}

/** *************************
 *  Prints a fighter on the arena section
 *  .html() -> writes html code to the selector
    .find() -> returns the first object that passes the comparison test
    this -> refers to a String Object given by the second argument of find() ---> $(this).data("ico-name")
 *  *************************
 */

function printFighter(selector, fighterName) {

    $(selector).html(characterList.find(function (fighter) {
        return fighter.name === this.toString();
    }, fighterName).printImg());

    //Mirror enemy image
    if (selector == ".enemy") {
        $(".card[data-img-name='" + fighterName + "'] img:nth-child(2)").css({ "transform": "scaleX(-1)" });
    }

    $(".card[data-img-name='" + fighterName + "']").animate({ "width": "auto", "height": "360px" }, 250);

}

function removeCharacterIcon(characterIcon) {

    if ($(".char_ico").length > 1) {
        characterIcon.animate({ width: 0, height: 0 }, 500, () => {
            characterIcon.remove();
        })
    }
    else {
        //instead of removing it, just hide it so the DOM rendering does not alter the game visuals (grid)
        //change the class too, so function isWinner() works properly
        characterIcon.addClass("char_ico_null");
        characterIcon.removeClass("char_ico");
        characterIcon.animate({ "opacity": "0" }, 500, () => {
            characterIcon.css("display: hidden");
        })
    }
}

function findFighter(fighterName) {
    return characterList.findIndex(function (fighter) {
        return fighter.name === this.toString();
    }, fighterName);
}

function updateHealthBar(fighterId, selector) {

    var healthBar = $(selector).find(".progress-bar");
    var percentage = (characterList[fighterId].hp * 100) / characterList[fighterId].initialHp;

    if (characterList[fighterId].hp < 0) {
        percentage = 0;
        characterList[fighterId].hp = 0;
    }

    healthBar.attr("aria-valuenow", characterList[fighterId].hp)
        .attr("style", "width: " + percentage + "%")
        .text(characterList[fighterId].hp + "%");
}

function removeFighter(selector) {

    $(selector + " .char_img").toggle("slow");

}

function isWinner() {

    console.log(characterList[HeroId].hp);
    return ((($(".char_ico").length) == 0) && (characterList[HeroId].hp > 0) || (($(".char_ico").length) == 0) && (characterList[HeroId].hp <= 0) && (characterList[EnemyId].hp <= 0));
}

function updateGameMessage(message, opacity) {

    if (!message && !opacity) {
        $(".game_message").animate({ "opacity": opacity }, 250, function () {
            $(".game_message").html("&nbsp;");
        });
    }
    else {

        $(".game_message").queue(function () {
            $(this).text(message).dequeue();
        });

        $(".game_message").animate({ "opacity": opacity }, 250);

    }
}

function printRestartBtn() {

    // Execute the following after the last animation on .attack finishes
    $(".attack").queue(function () {

        $(".btn-attack").off("click"); //unbinds the event handler previously attached to the DOM
        $(".btn-attack").addClass("btn-rst");
        $(".btn-rst").removeClass("btn-attack");

        $(".btn-rst").on("click", function () { //binds up the new handler
            newGame(false);
        });

        $(".btn-rst").text("Restart");
        $(".attack h2").text("");
        $(this).dequeue();
    });

    $(".attack").fadeIn(500);
}

function attack() {
    if (!attackLock) {

        cloneAndPlay(audioMap.get("auPunch"));


        //Reduce enemy's HP
        characterList[EnemyId].reduceHp(characterList[HeroId].ap);
        updateHealthBar(EnemyId, ".enemy");

        //Reduce Hero's HP
        characterList[HeroId].reduceHp(characterList[EnemyId].cap);
        updateHealthBar(HeroId, ".hero");

        //Increase Hero AP
        characterList[HeroId].increaseAp();

        //is anyone defeated ?
        if (!characterList[EnemyId].isAlive() || !characterList[HeroId].isAlive()) {
            attackLock = true;
            $(".attack").fadeOut({
                "duration": 500, "complete": function () {
                    attackLock = false;
                }
            });
            console.log((($(".char_ico").length) == 0) && (characterList[HeroId].hp > 0));

            //did the player win the game?
            if (isWinner()) {
                cloneAndPlay(audioMap.get(characterList[EnemyId].auDie));
                removeFighter(".enemy");
                console.log("Player won!");
                updateGameMessage("Congrats!  You win!", 1);
                $(".game_message").queue(function () {
                    cloneAndPlay(audioMap.get("auYouWin"));
                    $(this).dequeue();
                });
                //TODO: update total wins
                printRestartBtn();
                // Plays victory audio after restart button shows up
                $(".attack").queue(function () {
                    cloneAndPlay(audioMap.get(characterList[HeroId].auAttack));
                    $(this).dequeue();
                });
            }
            else {
                //is enemy defeated?
                if (!characterList[EnemyId].isAlive()) {
                    cloneAndPlay(audioMap.get(characterList[EnemyId].auDie));
                    removeFighter(".enemy");
                    console.log("Enemy was defeated!");
                    updateGameMessage("You won the fight.\nChoose another enemy", 1);
                    $(".game_message").queue(function () {
                        cloneAndPlay(audioMap.get("auPerfect"));
                        $(this).dequeue();
                    });
                    characterLock = false;
                }
                else {
                    cloneAndPlay(audioMap.get(characterList[HeroId].auDie));
                    removeFighter(".hero");
                    console.log("Player lost the game!");
                    updateGameMessage("Ohh noo..  You lose!", 1);
                    $(".game_message").queue(function () {
                        cloneAndPlay(audioMap.get("auYouLose"));
                        $(this).dequeue();
                    });
                    //TODO update total losses
                    printRestartBtn();
                }
            }
        }
    }
}

function selectCharacter(that) {
    if (!isHeroPicked) {
        printFighter(".hero", that.data("ico-name"));
        isHeroPicked = true;
        removeCharacterIcon(that);
        updateGameMessage("", 0);
        updateGameMessage("Choose your Enemy", 1);
        HeroId = findFighter(that.data("ico-name"));
    }
    else {
        if (!characterLock) {
            characterLock = true;
            printFighter(".enemy", that.data("ico-name"));
            removeCharacterIcon(that);
            $(".attack").fadeIn(500)
                .queue(function () {
                    cloneAndPlay(audioMap.get("auFight"));
                })
                .dequeue();
            updateGameMessage("", 0);
            EnemyId = findFighter(that.data("ico-name"));
        }
    }
}

function restoreAttackBtn() {

    $(".attack").fadeOut(250);

    // Execute the following after the last animation on .attack finishes
    $(".attack").queue(function () {

        $(".btn-rst").off("click"); //unbinds the event handler previously attached to the DOM
        $(".btn-rst").addClass("btn-attack");
        $(".btn-attack").removeClass("btn-rst");

        $(".btn-attack").on("click", function () { //binds up the new handler
            attack();
        });

        $(".btn-attack").text("");
        $(".attack h2").text("Fight!");
        $(this).dequeue();
    });

}


function initHtml(firstGame) {
    updateGameMessage("", 0);
    updateGameMessage("Choose your character", 1);

    //attach the click event listener to all character icons
    $(".char_ico").click(function () {
        selectCharacter($(this));
        cloneAndPlay(audioMap.get("auCharConfirmation"));

    });

    if (!firstGame) {
        restoreAttackBtn();
        // clean the arena section
        $(".hero *").hide("slow");
        $(".enemy *").hide("slow");
    }
    else
        $(".btn-attack").on("click", function () {
            attack();
        });

    //Event Audio: Character selection
    $(".char_ico").mouseenter(function () {
        cloneAndPlay(audioMap.get("auCharSelection"));
    });
}



function newGame(firstGame) {

    initEngine();
    initHtml(firstGame);

}


$(document).ready(function () {
    loadSoundTrack();
    newGame(true);
});