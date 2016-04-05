///////////////////////////////////////////////
// Spielsystem
var currentScene = null;
    var storage;
var Runde;
var noClear = false;

(function() {
    imageMode(CENTER);
    rectMode(CENTER);
    textAlign(CENTER, CENTER);
    storage = this.localStorage;
    Runde = storage.getItem("Runde") || 0;
})();
var Layer = function(zIndex, images, sounds) {
    this.zIndex = zIndex;
    this.images = images;
    this.sounds = sounds;
    this.isPaused = false;
    this.isVisible = true;
    
    this.draw = function() {};
    
    this.pause = function() {
        this.isPaused = true;
    };
    
    this.resume = function() {
        this.isPaused = false;
    };
    
    this.show = function(options) {
        this.isVisible = true;
        this.isPaused = false;
        if( this.init ) {
            this.init(options);
        }
    };

    this.hide = function() {
        this.isVisible = false;
        this.isPaused = true;
    };
};
var Scene = function() {
    this.Layers = [];
    
    this.addLayer = function(zIndex, images, sounds) {
        var layer = new Layer(zIndex, images, sounds);
        this.Layers.push(layer);
        this.Layers.sort(function(a,b) {
            return a.zIndex < b.zIndex? -1 : 1;
        });

        return layer;
    };
    
    this.each = function(cb) {
        for( var i=0 ; i<this.Layers.length ; i++ ) {
            cb(this.Layers[i]);
        }
    };
    
    this.draw = function() {
        this.each(function(layer) {
            pushMatrix();
            resetMatrix();
            if( layer.isVisible ) {
                layer.draw(layer.isPaused);
            }
            popMatrix();
        });
    };
};
var setScene = function(scene) {
    currentScene = scene;

    if( scene.init ) {
        scene.init();
    }
};
var mousePressed = function() {
    currentScene.each(function(layer) {
        if( layer.mousePressed && !layer.isPaused ) {
            layer.mousePressed(); 
        }
    });
};
var mouseMoved = function() {
    currentScene.each(function(layer) {
        if( layer.mouseMoved && !layer.isPaused ) {
            layer.mouseMoved(); 
        }
    });
};
var mouseReleased = function() {
    currentScene.each(function(layer) {
        if( layer.mouseReleased && !layer.isPaused ) {
            layer.mouseReleased(); 
        }
    });
};
var keyPressed = function() {
    currentScene.each(function(layer) {
        if( layer.keyPressed && !layer.isPaused ) {
            layer.keyPressed(); 
        }
    });
};
var keyReleased = function() {
    currentScene.each(function(layer) {
        if( layer.keyReleased && !layer.isPaused ) {
            layer.keyReleased(); 
        }
    });
};
var draw = function() {
    if( !noClear ) {
        background(250);
    }
    
    if( currentScene ) {
        currentScene.draw();
    }
};

var Texte = [ 
    "В ----- омуте ----- водятся.",
    "----- прожить – не ---- перейдти.",
    "Не всё ------, что -------.",
    "Без ---- нет -----.",
    "Любишь --------, люби и ------- возить.",
    "Других не ---- – на себя --------.",
    "---------- – мать учения.",
    "Рука руку ----.",
    "Утро вечера --------.",
    "Не имей сто ------, а имей сто ------.",
    "В ------ хорошо, а ---- лучше.",
    "----- голодного не --------.",
    "И ----- сыты и ---- целы.",
    "-- хорошо, а --- лучше.",
    "Нет ---- без -----.",
    "---- едешь – ------ будешь.",
    "На ---- и цвет --------- нет.",
    "---- раз отмерь – один раз ------.",
    "Кашу ------ не ---------.",
    "Не ------ 'гоп!', пока не ------------.",
    "Когда я -- – я ---- и ---.",
    "------- – ------.",
];
var Lösungen = [
    "тихомчерти",
    "Жизньполе",
    "золотоблестит",
    "мукинауки",
    "кататьсясаночки",
    "судипосмотри",
    "Повторение",
    "моет",
    "мудренее",
    "рублейдрузей",
    "гостяхдома",
    "Сытыйразумеет",
    "волкиовцы",
    "Умдва",
    "худадобра",
    "Тишедальше",
    "вкустоварищей",
    "Семьотрежь",
    "масломиспортишь",
    "говориперепрыгнешь",
    "емглухнем",
    "Поживёмувидим",
];

////////////////////////////////////////////////
// Szenen (Scenes) und Ebenen (Layers)
var TitelSzene = new Scene();
var SpielSzene = new Scene();
var Titel;

////////////////////////////
// Titel-Szene
TitelSzene.init = function() {
    Titel.show();
};

/////////////////////////////
// Ebenen
var Titel = TitelSzene.addLayer(0, {
        // Liste der verwendeten Bilder
        Kaktus1: getImage("Spielplatz/Kaktus1"),
        Kaktus2: getImage("Spielplatz/Kaktus2"),
        Spinne: getImage("Spielplatz/Spinne"),
    },{
        // Liste der verwendeten Sounds
        Drama: getSound("Spielplatz/Drama"),
    });

Titel.init = function() {
    Titel.x = 600;
    Titel.dx = -10;
    Titel.ux = -100;
    Titel.dux = 5;
    Titel.Größe = 0;
    Titel.uFarbe = color(3, 0, 3);
    Titel.SpinneY = -250;
};

Titel.draw = function(isPaused) {
    background(148, 212, 242);
    fill(74, 15, 74);
    textSize(Titel.Größe);
    text("Sprich.Wort!", Titel.x, 170); 
    fill(Titel.uFarbe);
    textSize(25);
    image(Titel.images.Kaktus1, 340,325, 90, 150);
    
    strokeWeight(2);
    stroke(0);
    line(90, Titel.SpinneY, 90, 0 );
    image(Titel.images.Spinne, 88, Titel.SpinneY, 50, 50);
    
    if( !isPaused ) {
        if( Runde < Texte.length ) {
            var r = 1 + parseInt(Runde,0);
            text("Drücke eine Taste ...", Titel.ux, 235);
            text("Runde "+r, Titel.ux, 335);
        } else {
            text("Durchgespielt!", Titel.ux, 335);
        }
        
        Titel.x += Titel.dx;
        if( Titel.x <= 200 ) {
            Titel.dx = 0;
        }
        Titel.ux += Titel.dux;
        if( Titel.ux >= 200 ) {
            Titel.dux = 0;
        }
        Titel.SpinneY += 2;
        if( Titel.SpinneY >= 135 ) {
            Titel.SpinneY = 135;
        }
        Titel.Größe+=0.9;
        if( Titel.Größe > 70 ) {
            Titel.Größe = 70;
        }
    }
};

Titel.keyPressed = function() {
    setScene( SpielSzene );
};

Titel.keyReleased = function() {
};

Titel.mousePressed = function() {
    setScene( SpielSzene );
};

Titel.mouseMoved = function() {
};

Titel.mouseReleased = function() {
};

//////////////////////////////////////////
// Spielszene
var Spielfeld, Gewonnen, Verloren, FalscherBuchstabe, Durchgespielt;

SpielSzene.init = function() {
    Spielfeld.show();
    Gewonnen.hide();
    Verloren.hide();
    FalscherBuchstabe.hide();
    Durchgespielt.hide();
};

var Spielfeld = SpielSzene.addLayer(0,{
        Kakteen: getImage("Spielplatz/Kakteen"),
        Spinne: getImage("Spielplatz/Spinne"),
    },{
        Pieps: getSound("Spielplatz/Ticken"),
        Hallo: getSound("Spielplatz/Hallo"),
        Schuss: getSound("Spielplatz/Schuss"),
    });

Spielfeld.init = function() {
    Spielfeld.Text = Texte[Runde];
    Spielfeld.Lösung = Lösungen[Runde];
    Spielfeld.gelöst = 0;
    Spielfeld.Versuche = 3;
    Spielfeld.x = [];
    Spielfeld.y = [];
    Spielfeld.Größe = [];
    Spielfeld.dy = [];
    Spielfeld.Farbe = [];
    Spielfeld.Buchstabe = [];
    Spielfeld.Kakteen = [
        { x: 13, y: 268, Größe: 19 },
        { x: 40, y: 277, Größe: 22 },
        { x: 80, y: 286, Größe: 22 },
        { x: 93, y: 254, Größe: 20 },
        { x: 117, y: 283, Größe: 20 },
        { x: 164, y: 269, Größe: 20 },
        { x: 206, y: 249, Größe: 20 },
        { x: 240, y: 274, Größe: 19 },
        { x: 267, y: 239, Größe: 27 },
        { x: 297, y: 278, Größe: 20 },
        { x: 331, y: 262, Größe: 20 },
        { x: 369, y: 267, Größe: 20 }];
    Spielfeld.n = 10;
    Spielfeld.SpinnenX = 400;
    Spielfeld.SpinnenZähler = 1200;
    
    for( var i=0 ; i < Spielfeld.n ; i++ ) {
        Spielfeld.x[i] = random(50,350);
        Spielfeld.y[i] = 50-i*40;
        Spielfeld.Größe[i] = random(40,60);
        Spielfeld.dy[i] = random(0.15,0.6);
        Spielfeld.Farbe[i] = color(random(128,255),50,40);
        Spielfeld.Buchstabe[i] = Spielfeld.Lösung.substr(random(0,Spielfeld.Lösung.length),1);
    }
};

Spielfeld.draw = function(isPaused) {
    background(210, 250, 250);
    image(Spielfeld.images.Kakteen, 200, 290);
    fill(255, 255, 15);
    noStroke();
    rect(200,375,400,50);
    if( !isPaused ) {
        noStroke();
        
        for( var i=0 ; i < Spielfeld.n ; i++ ) {
            translate(Spielfeld.x[i], Spielfeld.y[i]);
            fill(Spielfeld.Farbe[i]);
            ellipse(0,0,Spielfeld.Größe[i],Spielfeld.Größe[i]);
            fill(0);
            textSize(25);
            text(Spielfeld.Buchstabe[i],0,0);
            resetMatrix();
                
            Spielfeld.y[i] += Spielfeld.dy[i];
                
            if( Spielfeld.pieks(i) ) {
                
                if( Spielfeld.Buchstabe[i] === Spielfeld.Lösung.substr(0,1) ) {
                    var bs = Spielfeld.Lösung[0],
                        pos = Spielfeld.Text.search("-");
                    debug("bs="+bs+", pos="+pos);                    
                    Spielfeld.Text = Spielfeld.Text.substr(0,pos)+
                                        bs+Spielfeld.Text.substr(pos+1);
                    Spielfeld.Lösung = Spielfeld.Lösung.substr(1);
                    playSound(Spielfeld.sounds.Hallo);
                    if( Spielfeld.Lösung.length === 0 ) {
                        Spielfeld.pause();
                        storage.setItem("Runde", ++Runde);
                        if( Runde < Texte.length ) {
                            Gewonnen.show();
                        } else {
                            Durchgespielt.show();
                        }
                    }
                } else {

                    playSound(Spielfeld.sounds.Schuss);
                    FalscherBuchstabe.show();
                    break;
                }
                Spielfeld.y[i] = -50;
                Spielfeld.Buchstabe[i] = Spielfeld.Lösung.substr(
                                            random(0,Spielfeld.Lösung.length),1);
            }
        }
    }

    fill(0);
    textSize(22);
    text(Spielfeld.Text,200,357);
    
    Spielfeld.SpinnenX = max(Spielfeld.SpinnenX-5,0);
    for( var i=0 ; i<Spielfeld.Versuche ; i++ ) {
        image(Spielfeld.images.Spinne, 
              Spielfeld.SpinnenX+20+i*(30+Spielfeld.SpinnenX/3), 
              385, 
              25, 25);

        if( Spielfeld.SpinnenZähler > 0 ) {
            textSize(12);
            fill(240, 60, 60);
            text("Für mehr Spinnen klicke",240+Spielfeld.SpinnenX*1.5, 378);   
            text("drei Ballons gleichzeitig weg.",240+Spielfeld.SpinnenX*2, 390);
            Spielfeld.SpinnenZähler--;
        }
    }
};

Spielfeld.pieks = function(ball) {
    var x = Spielfeld.x[ball], 
        y = Spielfeld.y[ball],
        Größe = Spielfeld.Größe[ball];
        
    for( var i=0 ; i<Spielfeld.Kakteen.length ; i++ ) {
        var kaktus = Spielfeld.Kakteen[i];
        
        if( dist(kaktus.x, kaktus.y, x, y) < (Größe + kaktus.Größe)/2 ) {
            return true;
        }
    }
    
    return false;
};

Spielfeld.keyPressed = function() {
};

Spielfeld.keyReleased = function() {
};

Spielfeld.mousePressed = function() {
    var Zähler = 0;
    for( var i=0 ; i < Spielfeld.n ; i++ ) {
        if( dist(mouseX, mouseY, Spielfeld.x[i], Spielfeld.y[i]) < Spielfeld.Größe[i]/2) {
            if( Spielfeld.Buchstabe[i] === Spielfeld.Lösung.substr(0,1) ) {
                playSound(Spielfeld.sounds.Schuss);
                FalscherBuchstabe.show();
                break;
            }
            Spielfeld.y[i] = -50;
            Spielfeld.Buchstabe[i] = Spielfeld.Lösung.substr(
                                        random(0,Spielfeld.Lösung.length),1);
            Zähler++;
            playSound(Spielfeld.sounds.Pieps);
        }
    }
    
    if( Zähler >= 3 ) {
        Spielfeld.Versuche = min(++Spielfeld.Versuche, 12);
        playSound(Spielfeld.sounds.Hallo);
    }
};

Spielfeld.mouseMoved = function() {
};

Spielfeld.mouseReleased = function() {
};

var Gewonnen = SpielSzene.addLayer(2,{
        Rob: getImage("Spielplatz/Rob_entspannt"),
    },{
        Yeah: getSound("Spielplatz/Schlagzeug"),
    });

Gewonnen.init = function() {
    Gewonnen.x = 200;        // x-Position
    Gewonnen.y = 200;        // y-Position
    Gewonnen.dx = 5;         // Bewegungsrichtung und -geschwindigkeit von x
    Gewonnen.dy = -0.3;      // Bewegungsrichtung und -geschwindigkeit von y
    Gewonnen.winkel = 40;
    
    playSound(Gewonnen.sounds.Yeah);
};

Gewonnen.Ludmilla = function() {

    pushMatrix();
    rotate(Gewonnen.winkel);
    // Monde
    stroke(0,0,0);
    fill(255, 255, 255);
    ellipse(50, -50, 20, 20);
    fill(255, 255, 255);
    ellipse(-50, 50, 20, 20);
    fill(255, 255, 255);
    ellipse(-50, -50, 20, 20);
    fill(255, 255, 255);
    ellipse(50, 50, 20, 20);
    
    popMatrix();
    rotate(0);
    // Planet
    fill(255, 255, 255);
    ellipse(0, 0, 77, -13);
    
    stroke(255, 255, 255);
    fill(255, 255, 255);
    ellipse(0, 0, 35, 35);
    image(Gewonnen.images.Rob,0,0,61,27);
};

Gewonnen.draw = function(isPaused) {
    background(120, 23, 120);        // Hintergrund löschen
    
    resetMatrix();          
    translate(Gewonnen.x, Gewonnen.y);
    Gewonnen.Ludmilla();
    
    Gewonnen.x = Gewonnen.x + Gewonnen.dx;
    Gewonnen.y = Gewonnen.y + Gewonnen.dy;
    Gewonnen.winkel = Gewonnen.winkel +100000000000000000000;
    
    if( Gewonnen.x < 70 || Gewonnen.x > 320 ) {
        Gewonnen.dx = -Gewonnen.dx;           
    }
    
    if( Gewonnen.y < 70 || Gewonnen.y > 320 ) { 
        Gewonnen.dy = -Gewonnen.dy;           
    }
    
    fill(154, 240, 118);
    textSize(60);
    text("Gewonnen!", 0, -110);
    textSize(30);
    text("Nächste Runde: "+(Runde+1)+"!", 0, 110);
};

Gewonnen.keyPressed = function() {
    setScene( TitelSzene );
};

Gewonnen.keyReleased = function() {
};

Gewonnen.mousePressed = function() {
};

Gewonnen.mouseMoved = function() {
};

Gewonnen.mouseReleased = function() {
};


var Verloren = SpielSzene.addLayer(2,{
    Bild: getImage("Spielplatz/Bus")
}, {
    Drama: getSound("Spielplatz/Drama")
});

Verloren.init = function() {
    playSound(Verloren.sounds.Drama);
};

Verloren.draw = function(isPaused) {
    fill(255, 0, 0);
    textSize(50);
    text("Verloren ...", 200, 200);
    textSize(30);
    text("Drücke eine Taste.", 200, 300);
};

Verloren.keyPressed = function() {
    setScene( TitelSzene );
};

Verloren.keyReleased = function() {
};

Verloren.mousePressed = function() {
};

Verloren.mouseMoved = function() {
};

Verloren.mouseReleased = function() {
};


var FalscherBuchstabe = SpielSzene.addLayer(2);

FalscherBuchstabe.init = function() {
    FalscherBuchstabe.x = [];
    FalscherBuchstabe.y = [];
    FalscherBuchstabe.Größe = [];
    FalscherBuchstabe.Farbe = [];
    FalscherBuchstabe.Verzögerung = [];

    for( var i=0 ; i < Spielfeld.n ; i++ ) {
        FalscherBuchstabe.x.push(Spielfeld.x[i]);
        FalscherBuchstabe.y.push(Spielfeld.y[i]);
        FalscherBuchstabe.Größe.push(Spielfeld.Größe[i]);
        FalscherBuchstabe.Farbe.push(Spielfeld.Farbe[i]);
        FalscherBuchstabe.Verzögerung.push(random(60,90));

        Spielfeld.y[i] = -50-i*30;
        Spielfeld.Buchstabe[i] = Spielfeld.Lösung.substr(
            random(0,Spielfeld.Lösung.length),1
        );
    }

    FalscherBuchstabe.tx = 1000;
    FalscherBuchstabe.Zähler = 70;
    FalscherBuchstabe.Deckkraft = 100;
    
    Spielfeld.Versuche--;
    if( Spielfeld.Versuche < 0 ) {
        FalscherBuchstabe.hide();
        Spielfeld.hide();
        //Gewonnen.show();        
        Verloren.show();        
    }
};

FalscherBuchstabe.draw = function(isPaused) {
    for( var i=0 ; i<FalscherBuchstabe.x.length ; i++) {
        fill(FalscherBuchstabe.Farbe[i]);
        ellipse(FalscherBuchstabe.x[i], FalscherBuchstabe.y[i],
                FalscherBuchstabe.Größe[i], FalscherBuchstabe.Größe[i]);
                    
        if( FalscherBuchstabe.Verzögerung[i] > FalscherBuchstabe.Zähler ) {
            FalscherBuchstabe.x[i] += random(0, 1);
            FalscherBuchstabe.y[i] += random(0, 1);
            FalscherBuchstabe.Größe[i] += 3.0;
            FalscherBuchstabe.Farbe[i] = color(200,50,40,FalscherBuchstabe.Deckkraft);
        }
    }
    
    FalscherBuchstabe.tx -= 17;

    fill(62, 145, 29);
    textSize(150);
    text("Falscher Buchstabe!", FalscherBuchstabe.tx, 80);

    FalscherBuchstabe.Deckkraft -= 4;

    if( --FalscherBuchstabe.Zähler === 0 ) {
        FalscherBuchstabe.hide();
    }
};

FalscherBuchstabe.keyPressed = function() {
    setScene( TitelSzene );
};

FalscherBuchstabe.keyReleased = function() {
};

FalscherBuchstabe.mousePressed = function() {
};

FalscherBuchstabe.mouseMoved = function() {
};

FalscherBuchstabe.mouseReleased = function() {
};


var Durchgespielt = SpielSzene.addLayer(2, {
    Bild: getImage("Spielplatz/Bus")
}, {
    Lachen: getSound("Spielplatz/HässlichesLachen")
});

Durchgespielt.init = function() {
    
    Durchgespielt.z=0;
    Durchgespielt.Sonne = {
        Durchmesser     : 86,
        Mutter          : null,
        Farbe           : color(239, 247, 13),
        Umlaufbahn      : 0,
        Geschwindigkeit : 0.2,
        Winkel          : 0,
        x               : 0,
        y               : 0
    };
    Durchgespielt.Erde = {
        Durchmesser : 10,
        Mutter      : Durchgespielt.Sonne,
        Farbe       : color(38, 38, 224),
        Umlaufbahn  : 198,
        Geschwindigkeit: 0.3,
        Winkel      : 0,
        Name        : "Erde",
    };
    Durchgespielt.Mond = {
        Durchmesser :3,
        Mutter      : Durchgespielt.Erde,
        Farbe       : color(106, 131, 133),
        Umlaufbahn  : 11,
        Geschwindigkeit: -2.0,
        Winkel      : 0,
        Name        : "Mond",
    };
    Durchgespielt.master = {
        Durchmesser     : 20,
        Mutter          : Durchgespielt.Sonne,
        Farbe           : color(250, 137, 8),
        Umlaufbahn      : 145,
        Geschwindigkeit : -2.0,
        Winkel          :0,
        Name            : "master",
    };
    Durchgespielt.jupiter = {   
        Durchmesser     : 8,
        Mutter          : Durchgespielt.master,
        Farbe           : color(255, 0, 0),
        Umlaufbahn      : 21,
        Geschwindigkeit : 2.9,
        Winkel          : 0,
        Name            : "jupiter",
    };
    Durchgespielt.Mars = {
        Durchmesser     : 11,
        Mutter          : Durchgespielt.Sonne,
        Farbe           : color(191, 145, 145),
        Umlaufbahn      : 26,
        Geschwindigkeit : 6.1,
        Winkel          : 0,
        Name            : "Mars",
        
    };
    Durchgespielt.Blu = {
        Durchmesser     : 19,
        Mutter          : null,
        Farbe           : color(221, 0, 255),
        Umlaufbahn      : 0,
        Geschwindigkeit : 0,
        Winkel          : 0,
        Name            : "Blu"     
    
    };
    Durchgespielt.bumbum ={
        Durchmesser : 27,
        Mutter      : Durchgespielt.Sonne,
        Farbe       :color(212, 12, 12),
        Umlaufbahn  : 85,
        Geschwindigkeit  : 4.7,
        Winkel      : 0,
        Name        : "bumbum",
        
    };
    Durchgespielt.traum =  {
        Durchmesser : 18,
        Mutter      : Durchgespielt.Sonne,
        Farbe       :color(255, 0, 0),
        Umlaufbahn  : 60,
        Geschwindigkeit :6.8,
        Winkel      : 0,
        Name        :"traum",
    };
    Durchgespielt.mama = {
        Durchmesser : 8,
        Mutter      : Durchgespielt.bumbum,
        Farbe       :color(0, 0, 0),
        Umlaufbahn  : 20,
        Geschwindigkeit :13.2,
        Winkel      : 0,
        Name        :"mama",
    };   
    Durchgespielt.Planeten = [
        Durchgespielt.Sonne, 
        Durchgespielt.Erde, 
        Durchgespielt.Mond, 
        Durchgespielt.master,
        Durchgespielt.jupiter,
        Durchgespielt.Mars,
        Durchgespielt.Blu,
        Durchgespielt.bumbum,
        Durchgespielt.traum,
        Durchgespielt.mama
    ];
 
    noClear = true;
    background(255);
    stroke(0);
    strokeWeight(1);
    
    playSound(Durchgespielt.sounds.Lachen);
};

Durchgespielt.draw = function(isPaused) {
    translate(200,200);
    for( var i=0 ; i < 10 ; i++ ) {
        var planet = Durchgespielt.Planeten[i];
        
        planet.x = 0;
        planet.y = 0;
        
        if( planet.Mutter !== null ) {
            planet.x = planet.Mutter.x + 
                    cos(planet.Winkel)*planet.Umlaufbahn;
            planet.y = planet.Mutter.y + 
                    sin(planet.Winkel)*planet.Umlaufbahn;
        }
    
        fill(planet.Farbe);
        ellipse(planet.x, planet.y, 
                planet.Durchmesser, planet.Durchmesser);
                
        planet.Winkel += planet.Geschwindigkeit;
        
        
        if(keyIsPressed ){
           text(planet.Name, planet.x, planet.y -20);
        }
    }
    if(Durchgespielt.z%-3 === 0){
        for(var i=0 ;i<Durchgespielt.Planeten.length ; i++) {
            var planet = Durchgespielt.Planeten[i];
        
            planet.Farbe = color(random(0,255),
                             random(0,255),
                             random(0,255));     
        }    
    }
    Durchgespielt.z++;

    fill(random(0,80), random(50,130), 217);
    textSize(60);
    text("Durchgespielt!", 0, -160);
    fill(random(0,255), random(0,255), random(128,255));
    textSize(45);
    text("Gratulation!", random(-80,80), random(140,180));
};

Durchgespielt.keyPressed = function() {
    noClear = false;
    setScene( TitelSzene );
};

Durchgespielt.keyReleased = function() {
};

Durchgespielt.mousePressed = function() {
};

Durchgespielt.mouseMoved = function() {
};

Durchgespielt.mouseReleased = function() {
};


setScene( TitelSzene );