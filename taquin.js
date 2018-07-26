$(document).ready(function(){

// Button listeners 
$('#afficher').click(function() {
    return afficher();
});

$('#brasser').click(function() {
    return brasser();
});

$(document).keyup(function(e){
    return deplacerFleche(e.which);
});

});

//variables pour suivre le statut de la partie
var tuilesBrassees = false;

var deplacements = 0;

//le chemin suivi par l'ordinateur lors du brassage. Utile pour débogger/tricher
var path = "";

// Affiche un nouveau jeu
function afficher(){
    //informations du formulaire
    var url = $('#form input[name="url"]').val();
    var nbLignes = Number($('#form input[name="lignes"]').val());
    var nbCols = Number($('#form input[name="colonnes"]').val());
    var showNumbers = $('#form input[name="numeros"]').is(':checked');
    
    var cssSheet = document.styleSheets[0];
    //support pour Internet Explorer
    var rules = cssSheet.cssRules || cssSheet.rules;
                        
    var update_properties = function(src) {
        var img = new Image();
        $(img).one('load', function() {               
            rules[14].style.setProperty("height", ""+(75/nbLignes)+"vh");
            rules[14].style.setProperty("width", ""+
                (img.width/img.height)*(75/nbCols)+"vh");
            if(src.length > 0){
                rules[14].style.setProperty("background-image", "url(\""+src+"\")");
            }
            if(showNumbers){
                rules[15].style.setProperty("visibility", "visible");
            }else{
                rules[15].style.setProperty("visibility", "hidden");
            }
        });
        if(src.length > 0){
            img.src = src;
        }else{img.src = rules[14].style.getPropertyValue("background-image").slice(5, -2);}
    };
          
    //si infos (URL, dimensions) invalides 
    if(nbLignes < 2 || nbCols < 2) {
        alert("Valeurs invalides");
        return;
    }
     
    //CSS mis à jour
    update_properties(url);     
     
    //éliminer ancienne table
    if($("table").length > 0){$("table").remove();}
     
    $("#table").append(document.createElement("table"));     
     
    var nbItems = 1;
     
    for(var i=1; i <= nbLignes; i++) {
        
        var row = document.createElement("tr");
        row.classList.add(""+i);
        $("table").append(row);
        
        for(var j=1; j <= nbCols; j++) {
            
            var item = document.createElement("td");
            var number = "<p>"+nbItems+"</p>";
            item.id = "t"+nbItems;
            $("tr."+i).append(item);
            $("td#t"+nbItems).append(number);
            //position image par ajout de règle CSS pour balisage sémantique
            cssSheet.insertRule("td#t"+nbItems+"{"+"background-position: -"+
                ((j-1)*100)+"% -"+((i-1)*100)+"%;\ "+"}", rules.length);
            
            if(nbItems == nbLignes*nbCols){
                $("td#t"+nbItems).addClass("last");
            }
            nbItems++;
        }   
    }
    
    //click listener pour jouer
    $("td").click(function() {
        return deplacer($(this));
    });
    
    tuilesBrassees = false;
    $("#deplacement").text("Déplacements : 0");
    path = ""; 
};

//Mélange les tuiles du jeu existant
function brasser(){
    
    var nbTiles = $("td").length;
    var rows = $("tr").length;
    var cols = nbTiles/rows;
    var instaWin = verifierVictoire();
    
    //le joueur veut rebrasser; tuiles remises en ordre avant brassage 
    if(tuilesBrassees){
        var current = 1;
        for(var i=1; i <= rows; i++){
            for(var j=1; j <= cols; j++){
                $("tr."+i).append($("td#t"+current));
                current++;
            }             
        }
        instaWin = true;
        path = "";
    }
    
    //brassage après une victoire; la dernière tuile doit redevenir invisible
    if(!($("td#t"+nbTiles).hasClass("last"))){
        $("td#t"+nbTiles).toggleClass("last");
    }
    
    //Brasse tant que la grille obtenue est identique à la grille de victoire
    while(instaWin){                
        for(var i=0; i < nbTiles*(nbTiles/4); i++){
            var dir = Math.floor((Math.random()*4)+1);
            autoDeplacement(dir);     
        }
        
        while($("td.last").parent().attr("class") != ""+($("tr").length)){
            autoDeplacement(2);
        }
        
        while($("td.last").attr("id") != $("td")[nbTiles-1].id){
            autoDeplacement(1);
        }
        
        instaWin = verifierVictoire();
        if(instaWin){path = "";}                
    }
        
    var found = true;
    
    //élimination des déplacements inutiles de l'ordinateur
    while(found){
        var prevPath = path;
        
        path = path.replace(/(13|31|24|42)/g, "");
        found = (path.length != prevPath.length);    
    }
 
    tuilesBrassees = true;
    deplacements = 0;
    $("#deplacement").text("Déplacements : "+deplacements);        
    alert("Nouvelle partie! Choisissez une case à bouger.")
};

// Échange une tuile avec l'espace vide si celui-ci lui est adjacent
function deplacer($tile){
    if(!tuilesBrassees){return;}
     
    var $next = $tile.next();
    var $previous = $tile.prev();
    var $parentRow = $tile.parent();
    var tilePosition = $parentRow.children().index($tile[0]);
          
    if($next.hasClass("last")){
        //droite
        $tile.insertAfter($next);
        deplacements++;
    }else if($previous.hasClass("last")){
        //gauche
        $tile.insertBefore($previous);
        deplacements++;
    }else if($parentRow.prev().children().eq(tilePosition).hasClass("last")){
        //haut
        permutationVerticale($("td.last"), $tile);
        deplacements++;
    }else if($parentRow.next().children().eq(tilePosition).hasClass("last")){
        //bas
        permutationVerticale($("td.last"), $tile);
        deplacements++;
    }else{
        return;
    }
    
    $("#deplacement").text("Déplacements : "+deplacements); 
    if(verifierVictoire()) {appliquerVictoire();}
};

function deplacerFleche(key){
    if(!tuilesBrassees){return;}
    
    var $last = $(".last");
    var position = $last.parent().children().index($last[0]);
    var $adjacentUp = $last.parent().prev().children().eq(position);
    var $adjacentDown = $last.parent().next().children().eq(position);
          
    switch (key){
        
        case 37:
            //gauche
            if($last.next().length != 0){
                $last.insertAfter($last.next());
                deplacements++;
            }
            break;
            
        case 38:
            //haut
            if($adjacentDown.length != 0){
                permutationVerticale($last, $adjacentDown);
                deplacements++;
            }
            break;
            
        case 39:
            //droite
            if($last.prev().length != 0){
                $last.insertBefore($last.prev());
                deplacements++;
            }
            break;
            
        case 40:
            //bas
            if($adjacentUp.length != 0){
                permutationVerticale($last, $adjacentUp);
                deplacements++;
            }
            break;
    }
    
    $("#deplacement").text("Déplacements : "+deplacements);
    
    if(verifierVictoire()) {appliquerVictoire();}
};

//méthode pour le brassage
function autoDeplacement(dir){
    
    var $last = $(".last");
    var position = $last.parent().children().index($last[0]);
    var $adjacentUp = $last.parent().prev().children().eq(position);
    var $adjacentDown = $last.parent().next().children().eq(position);
          
    switch (dir){
        
        case 1:
            //gauche
            if($last.next().length != 0){
                $last.insertAfter($last.next());
                path+= ""+dir;
            }
            break;
            
        case 2:
            //haut
            if($adjacentDown.length != 0){
                permutationVerticale($last, $adjacentDown);
                path+= ""+dir;
            }
            break;
            
        case 3:
            //droite
            if($last.prev().length != 0){
                $last.insertBefore($last.prev());
                path+= ""+dir;
            }
            break;
            
        case 4:
            //bas
            if($adjacentUp.length != 0){
                permutationVerticale($last, $adjacentUp);
                path+= ""+dir;                                
            }
            break;
    }
    return;
    
}

//permuter 2 tuiles verticalement
function permutationVerticale($tile, $adjacent){
    var $previous = $adjacent.prev();
    var $next = $adjacent.next();
    
    $adjacent.insertBefore($tile);
    
    if($previous.length != 0){
        $tile.insertAfter($previous);
    }else{
        $tile.insertBefore($next);
    }

}

function verifierVictoire(){
    
    var tiles = $("td");
    
    for(var i=0; i < tiles.length; i++){
        if(tiles[i].id != "t"+(i+1)) {   
            return false;
        }    
    }
    
    return true;
};


function appliquerVictoire(){
    alert("Félicitations! Vous avez gagné avec "+deplacements+" déplacements.\n Solution optimale: "+path.length+" déplacements.");
    
    //dernière tuile visible pour récompenser le joueur
    $("td#t"+$("td").length).toggleClass("last");
    
    tuilesBrassees = false;
    deplacements = 0;
    $("#deplacement").text("Déplacements : "+deplacements);
    path = "";
};
