// Defines all audio elements
var audioMap = new Map();

audioMap.set("auIntro", createAudio("auIntro", "assets/audio/auIntro.mp3"));
audioMap.set("auCharSelection", createAudio("auCharSelection", "assets/audio/auCharSelection.mp3"));
audioMap.set("auCharConfirmation", createAudio("auCharConfirmation", "assets/audio/auCharConfirmation.mp3"));
audioMap.set("auPunch", createAudio("auPunch", "assets/audio/auPunch.mp3"));
audioMap.set("auFight", createAudio("auFight", "assets/audio/auFight.mp3"));
audioMap.set("auDie", createAudio("auDie", "assets/audio/auDie.mp3"));
audioMap.set("auPerfect", createAudio("auPerfect", "assets/audio/auPerfect.mp3"));
audioMap.set("auYouWin", createAudio("auYouWin", "assets/audio/auYouWin.mp3"));
audioMap.set("auYouLose", createAudio("auYouLose", "assets/audio/auYouLose.mp3"));
audioMap.set("auGameOver", createAudio("auGameOver", "assets/audio/auGameOver.mp3"));
audioMap.set("auGameSong1", createAudio("auGameSong1", "assets/audio/auGameSong1.mp3"));

var soundTrack = audioMap.get("auGameSong1")[0];

function createAudio(id, src) {

    var audio = $("<audio>");
    var source = $("<source>");
    source.attr("src", src)
        .attr("id", id);
    audio.append(source);
    return audio;
}

//Sound FX
function cloneAndPlay(audio) {
    var hack = audio.clone(true);
    hack[0].play();
}

//Loads Game Sound Track

function loadSoundTrack() {

    //Game Sound Track Button
    $(".sound_track").click(function() {
        if (soundTrack.paused) {
            $(this).addClass("btn-info");
            $(this).removeClass("btn-secondary");
            soundTrack.play();
        }
        else {
            $(this).addClass("btn-secondary");
            $(this).removeClass("btn-info");
            soundTrack.pause();

            console.log($(this));
        }

    });
}






