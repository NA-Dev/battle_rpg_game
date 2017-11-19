//--- JavaScript for a battel game---//



var allyReady, foeReady, charID, allyIndex, foeIndex, names, chars, images, maxHealths, attackPowers, counterPowers, chars, round;

$(document).ready(function() {
    setup();
});

function setup() {
        chars = [];

        names = ['Rafael', 'Michaelangelo', 'Leonardo',
        'Donatelo', 'Shredder', 'Master Splinter'];

        images = ['Rafael.png', 'Michelangelo.png',
        'Leonardo.png', 'Donatelo.png', 'Shredder.png', 'Splinter.png'];

        maxHealths = [155, 160, 165, 170, 180, 150];

        initAttackPowers =  [6, 7, 8, 9, 25, 5];

        counterPowers =  [10, 12, 15, 25, 25, 24];

        round = 0;

        charGen(); //generate character objects

        $('#allyHP, #foeHP').css('width', '100%');

        allyReady = true; //ready to select ally

        $('#message').html('Who will be your Ally?);
}

function charGen() {
    //populate each index of 'chars' with info about the character
    $.each(names, function(i) {
        chars[i] = {
            index: i,
            id: 'char' + i,
            name: names[i],
            image: images[i],
            maxHealth: maxHealths[i],
            health: maxHealths[i],
            initAttackPower: initAttackPowers[i],
            attackPower: initAttackPowers[i],
            counterPower: counterPowers[i],
        };


        //create a div to hold character image and name
        $('#arena').append(
            '<div id="char' + i + '" class="img" onClick="clicked(this.id);">'
                + '<img src="assets/images/chars/' + chars[i].image + '">'
                + '<div>' + chars[i].name + '</div><div>' + chars[i].health
                + ' hp</div><div>' + chars[i].attackPower
                + ' attack</div></div>'
        );
    });
}

//lets JS know whether a clicked character is ally or foe
function clicked(iD) {
    if (allyReady == true) {
        allyIndex = iD.substr(-1);
        chooseAlly();
    }

    else if (foeReady == true) {
        foeIndex = iD.substr(-1);
        chooseFoe();
    }
}

function chooseAlly() {
    allyReady = false;

    //create div for ally character image
    $('#ally').html(
    '<div class="img">'
        + '<img src="assets/images/chars/' + chars[allyIndex].image + '">'
        + '<div>' + chars[allyIndex].name + '</div>'
        + '</div>'
    );

    //populate title with character's max health
    $('#allyTitle').text(
    'Ally  -  ' + chars[allyIndex].maxHealth + ' HP max'
    );

    //remove character from arena
    $('#char' + allyIndex).remove();

    //unhide panel containing ally info and image
    $('#allyBox').css('display', 'block');

    chooseFoeReady();
}


function chooseFoeReady() {
    //start a new round
    round++;

    //choose foe on click of character image
    $('#message').html('Round ' + round + ': Who will your Ally fight?');
    foeReady = true;
}


function chooseFoe() {
    foeReady = false;

    //create div for foe character image
    $('#foe').html(
    '<div class="img">'
        + '<img src="assets/images/chars/' + chars[foeIndex].image + '">'
        + '<div>' + chars[foeIndex].name + '</div>'
        + '</div>'
    );

    //populate title with character's max health
    $('#foeTitle').text(
    'Foe  -  ' + chars[foeIndex].maxHealth + ' HP max'
    );

    //remove character from arena
    $('#char' + foeIndex).remove();

    //unhide panel containing ally info and image
    $('#foeBox').css('display', 'block');

    refreshHP();
    startGame();
}

function refreshHP() {
    //get ally remaining health in percent and update hp bar
    var percent = (chars[allyIndex].health / chars[allyIndex].maxHealth)*100
        + '%';
    $('#allyHP').css('width', percent);


    //get foe remaining health in percent and update hp bar
    percent = (chars[foeIndex].health / chars[foeIndex].maxHealth)*100 + '%';
    $('#foeHP').css('width', percent);
}

function startGame() {
    //enable attack button
    $('#attack button').prop("disabled", false);

    //alert user to attack or quit
    $('#message').text(chars[allyIndex].name  + ' can attack '
        + chars[foeIndex].name
        + ' or run away.');
}

function attack() {
    //disable attack button
    $('#attack button').prop("disabled", true);

    //temp variable to hold original attack power / damage done
    var damage = chars[allyIndex].attackPower;

    //takes health from foe
    chars[foeIndex].health = chars[foeIndex].health
        - damage;
    //increases ally attack power
    chars[allyIndex].attackPower = damage
        + chars[allyIndex].initAttackPower;

    //alert user of damage done
    $('#message').text(chars[allyIndex].name  + ' attacked for '
        + damage + ' damage.');

    refreshHP();

    //counter attack
    counter();
}

function counter() {
    //temp variable to hold original attack power / damage done
    var damage = chars[foeIndex].attackPower;

    //takes health from foe
    chars[allyIndex].health = chars[allyIndex].health
        - damage;

    //no increase in foe attack power

    //alert user of damage done
    $('#message').append('<br>' + chars[foeIndex].name  + ' countered for '
        + damage + ' damage.');

    refreshHP();

    //check for a winner
    checkWin();
}

function checkWin() {
    //if ally and foe health are both depleted...
    if (chars[allyIndex].health < 1 && chars[foeIndex].health < 1) {

        //display negative healths as zero
        chars[foeIndex].health = chars[allyIndex].health = 0;

        //the game is a draw
        draw();
    }

    //if ally health depleted...
    else if (chars[allyIndex].health < 1) {

        //display negative health as zero
        chars[foeIndex].health = 0;

        //ally is defeated
        defeat();
    }

    //if foe health is depleted...
    else if (chars[foeIndex].health < 1) {
        //display negative health as zero
        chars[foeIndex].health = 0;

        refreshHP();

        //check if a new one can be found
        newFoe();
    }

    //otherwise, enable attack button for next attack
    else {
    $('#attack button').prop("disabled", false);
    }
}

function newFoe () {
    //replace defeated foe image with sewer cap
    $('#foe').html(
        '<div class="img"><img src="assets/images/sewer.png"></div>'
    );

    //show 'Defeated' in foe title
    $('#foeTitle').text('Foe - Defeated');

    //if all characters are not defeated...
    if (round < chars.length - 1) {
        //choose another foe
        chooseFoeReady();
    }

    //otherwise, user wins
    else {
        victory();
    };
}

function draw() {
    //update text
    $('#restart button').text('Try Again');
    $('#message').html(
        'Your powers were evenly matched. Train harder next time.'
    );
    $('#allyTitle').text('Ally - Draw');
    $('#foeTitle').text('Foe - Draw');
}

function defeat () {
    //replace defeated ally image with sewer cap, and update text
    $('#ally').html(
            '<div class="img"><img src="assets/images/sewer.png"></div>'
        );
    $('#restart button').text('Try Again');
    $('#message').html('Your Ally was defeated. Train harder next time.');
    $('#allyTitle').text('Ally - Defeated');
    $('#foeTitle').text('Foe - Victorious');
}



function victory() {
    //update text
    $('#restart button').text('Play Again');
    $('#message').html('KOWABUNGA! Your Ally fought well and won.');
    $('#allyTitle').text('Ally - Winner');
    $('#foeTitle').text('Foe - Victorious');
}


