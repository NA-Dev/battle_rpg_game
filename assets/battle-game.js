//--- JavaScript for ______---//


// stop();
// function stop() {
//     confirm('yes');
//     setTimeout((go),300);
// }
// function go() {
//     console.log('yessssssssss');
// }


// setInterval(function() {
//     $('#attack').toggleClass('hover')}, 1000);


var allyReady, foeReady, charID, allyIndex, foeIndex, names, chars, images, maxHealths, attackPowers, counterPowers, chars;

$(document).ready(function() {
    setup();
});

function setup() {
        round = 1;
        chars = [];
        names = ['Rafael', 'Michaelangelo', 'Leonardo',
        'Donatelo', 'Shredder', 'Splinter'];

        images = ['Rafael.png', 'Michelangelo.png',
        'Leonardo.png', 'Donatelo.png', 'Shredder.png', 'Splinter.png'];

        maxHealths = [12, 13, 14, 15, 16, 17];

        initAttackPowers =  [6, 8, 10, 12, 14, 16];

        counterPowers =  [6, 10, 14, 18, 20, 22];

        ready = false;

        charGen();
};

function charGen() {
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
            status: 'none',
            location: '#arena',
        };

        $(chars[i].location).append(
            '<div id="char' + i + '" class="img" onClick="clicked(this.id);">'
                + '<img src="assets/images/chars/' + chars[i].image + '">'
                + '<div>' + chars[i].name + '</div>'
                + '</div>'
        );
    });
    chooseAllyReady();
};

function chooseAllyReady() {
    $('#message').html('Select an Ally');
    allyReady = true;
};

function clicked(id) {
    if (allyReady == true) {
        allyIndex = id.substr(-1);
        chooseAlly();
    }

    else if (foeReady == true) {
        foeIndex = id.substr(-1);
        chooseFoe();
    }
}

function chooseAlly() {
    allyReady = false;
    chars[allyIndex].location = '#ally';

    $(chars[allyIndex].location).append(
    '<div class="img char">'
        + '<img src="assets/images/chars/' + chars[allyIndex].image + '">'
        + '<div>' + chars[allyIndex].name + '</div>'
        + '</div>'
    );

    $(chars[allyIndex].location).prepend(
    '<h3>Ally  -  ' + chars[allyIndex].health + ' HP max</h3>'
    );

    $('#char' + allyIndex).remove();

    $('#ally').css('display', 'block');

    chooseFoeReady();
};

function chooseFoeReady() {
    $('#message').html('Round ' + round + ': Select a Foe');
    foeReady = true;
};

function chooseFoe() {
    foeReady = false;

    $('#foe').append(
    '<div class="img char">'
        + '<img src="assets/images/chars/' + chars[foeIndex].image + '">'
        + '<div>' + chars[foeIndex].name + '</div>'
        + '</div>'
    );

    $('#foe').prepend(
    '<h3>Foe  -  ' + chars[foeIndex].health + ' HP max</h3>'
    );

    $('#char' + foeIndex).remove();


    $('#foe').css('display', 'block');

    refreshHP();
    startGame();
};

function startGame() {
    $('#attack').removeClass('inactive');
    $('#attack').attr('onclick', 'attack(); return false;');
    var temp =
    $('#message').text(chars[allyIndex].name  + ' can attack '
        + chars[foeIndex].name
        + ' or run away.');
};

function attack() {
    chars[foeIndex].health = chars[foeIndex].health - chars[allyIndex].attackPower;
    chars[allyIndex].attackPower = chars[allyIndex].attackPower + chars[allyIndex].initAttackPower;
    counter();
    checkWin();
    refreshHP();
};

function counter() {
    chars[allyIndex].health = chars[allyIndex].health - chars[foeIndex].attackPower;
    chars[foeIndex].attackPower = chars[foeIndex].attackPower + chars[foeIndex].initAttackPower;
    checkWin();
    refreshHP();
};

function checkWin() {
    if (chars[allyIndex].health < 1) {
        defeat();
    }
    else if (chars[foeIndex].health < 1) {
        chars[foeIndex].health =0;
        round = round + 1;
        $('#foe').remove();
        refreshHP();
        newFoe();
    };
};

function refreshHP() {
    var percent = (chars[allyIndex].health / chars[allyIndex].maxHealth)*100 + '%';
    $('#allyHP').css('width', percent);
    percent = (chars[foeIndex].health / chars[foeIndex].maxHealth)*100 + '%';
    $('#foeHP').css('width', percent);
};

function newFoe () {
    if (round < chars.length) {
        chooseFoeReady();
    }
    else {
        victory();
    }

};

function defeat () {
    $('#ally').remove();
    $('#attack').css('display', 'none');
    $('#restart').html('Play Again');
    $('#message').html('You were defeated. Train harder and ask for a rematch');
    $('#foe').html(
    '<h2>Foe  -  Victorious</h2><hr><div class="img char">'
        + '<img src="assets/images/chars/' + chars[foeIndex].image + '">'
        + '<div>' + chars[foeIndex].name + '</div>'
        + '</div>'
    );
};


function victory() {
    $('#foe').remove();
    $('#attack').css('display', 'none');
    $('#restart').html('Play Again');
    $('#message').html('You were victorious! Way to go!');
    $('#ally').html(
    '<h2>Ally  -  Victorious</h2><hr><div class="img char">'
        + '<img src="assets/images/chars/' + chars[foeIndex].image + '">'
        + '<div>' + chars[foeIndex].name + '</div>'
        + '</div>'
    );

};

//     function checkwin
//             if ally hp<=0
//                 then ally isDefeated = true,
//                 foe isVictorious = true,
//                 win message
//             if foe hp<=0
//                 then ally isVictorious = true,
//                 foe isDefeated = true,
//                 foe isInArena = true,