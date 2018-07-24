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

// Affiche un nouveau jeu
function afficher(){
    //Get info from form
    var url = $('#form input[name="url"]').val();
    var nbLignes = Number($('#form input[name="lignes"]').val());
    var nbCols = Number($('#form input[name="colonnes"]').val());
    var showNumbers = $('#form input[name="numeros"]').is(':checked');
                        
    var update_properties = function(src) {
        var img = new Image();
        $(img).one('load', function() {
            var cssSheet = document.styleSheets[0];
            //if someone is using Internet Explorer
            var rules = cssSheet.cssRules || cssSheet.rules;   
            rules[14].style.setProperty("height", ""+(75/nbLignes)+"vh");
            rules[14].style.setProperty("width", ""+(img.width/img.height)*(75/nbCols)+"vh");
            if(src.length > 0){
                rules[14].style.setProperty("background-image", "url("+src+")");
            }else{rules[14].style.setProperty("background-image", "url(default.jpg)");}
            if(showNumbers){
                rules[15].style.setProperty("visibility", "visible");
            }else{
                rules[15].style.setProperty("visibility", "hidden");
            }
        });
        if(src.length > 0){
            img.src = src;
        }else{img.src = "default.jpg";}
    };
          
    // if not valid, display message 
    if(nbLignes < 2 || nbCols < 2) {
        alert("Valeurs invalides");
        return;
    }
     
    //updating the CSS custom properties
    update_properties(url);     
     
    //Remove old table (if applicable), generate table and display img+numbers
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
            $("td#t"+nbItems).attr("style", "background-position:-"+
                ((j-1)*100)+"% -"+((i-1)*100)+"%");
            
            if(nbItems == nbLignes*nbCols){
                $("td#t"+nbItems).addClass("last");
            }
            nbItems++;
        }   
    }
    
    //click listener added to the shuffled tiles to permit play
    $("td").click(function() {
        return deplacer($(this));
    });
    
    tuilesBrassees = false;
    $("#deplacement").text("Déplacements : 0");
     
};

//Mélange les tuiles du jeu existant
function brasser(){
    
    var nbTiles = $("td").length;
    
    //Brasse tant que la grille obtenue est identique à la grille de victoire
    do{
        for(var i=0; i < nbTiles*nbTiles/4; i++){
            var dir = Math.floor((Math.random()*4)+1);
            autoDeplacement(dir);    
        }
        
        while($("td.last").parent().attr("class") != ""+($("tr").length)){
            autoDeplacement(2);
        }
        
        while($("td.last").attr("id") != $("td")[nbTiles-1].id){
            autoDeplacement(1);
        }
                
    }while (verifierVictoire() == true);
 
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
     var tilePosition = $parentRow.children().index(document.getElementById($tile.attr("id")));
          
     if($next.hasClass("last")){
        //droite
        $tile.insertAfter($next);
        deplacements++;
        $("#deplacement").text("Déplacements : "+deplacements);
     }else if($previous.hasClass("last")){
        //gauche
        $tile.insertBefore($previous);
        deplacements++;
        $("#deplacement").text("Déplacements : "+deplacements);
     }else if($parentRow.prev().children().eq(tilePosition).hasClass("last")){
        //haut
        $tile.insertBefore("td.last");
        if($previous.length!= 0){
            $("td.last").insertAfter($previous);
        }else{
            $("td.last").insertBefore($next);
        }
        deplacements++;
        $("#deplacement").text("Déplacements : "+deplacements);
     }else if($parentRow.next().children().eq(tilePosition).hasClass("last")){
        //bas
        $tile.insertBefore("td.last");
        if($previous.length!= 0){
            $("td.last").insertAfter($previous);
        }else{
            $("td.last").insertBefore($next);
        }
        deplacements++;
        $("#deplacement").text("Déplacements : "+deplacements);
     }else{
        return;
     }
     
    if(verifierVictoire()) {
        appliquerVictoire();
    }
};

function deplacerFleche(key){
    if(!tuilesBrassees){return;}
    
    var id = $(".last").attr("id");
    var position = $(".last").parent().children().index(document.getElementById(id));
    var $adjacentUp = $(".last").parent().prev().children().eq(position);
    var $adjacentDown = $(".last").parent().next().children().eq(position);
          
    switch (key){
        
        case 37:
            //left
            if($(".last").next().length != 0){
                $(".last").insertAfter($(".last").next());
                deplacements++;
            }
            break;
            
        case 38:
            //up
            if($adjacentDown.length != 0){
                var $previous = $adjacentDown.prev();
                var $next = $adjacentDown.next();
                
                $adjacentDown.insertBefore("td.last");
                
                if($previous.length != 0){
                    $("td.last").insertAfter($previous);
                }else{
                    $("td.last").insertBefore($next);
                }
                deplacements++;
            }
            break;
            
        case 39:
            //right
            if($(".last").prev().length != 0){
                $(".last").insertBefore($(".last").prev());
                deplacements++;
            }
            break;
            
        case 40:
            //down
            if($adjacentUp.length != 0){
                var $previous = $adjacentUp.prev();
                var $next = $adjacentUp.next();
                
                $adjacentUp.insertBefore("td.last");
                
                if($previous.length != 0){
                    $("td.last").insertAfter($previous);
                }else{
                    $("td.last").insertBefore($next);
                }
                deplacements++;
            }
            break;
    }
    
    $("#deplacement").text("Déplacements : "+deplacements);
    
    if(verifierVictoire()) {
        appliquerVictoire();
    }
};

function autoDeplacement(dir){
    
    var id = $(".last").attr("id");
    var position = $(".last").parent().children().index(document.getElementById(id));
    var $adjacentUp = $(".last").parent().prev().children().eq(position);
    var $adjacentDown = $(".last").parent().next().children().eq(position);
          
    switch (dir){
        
        case 1:
            //left
            if($(".last").next().length != 0){
                $(".last").insertAfter($(".last").next());
            }
            break;
            
        case 2:
            //up
            if($adjacentDown.length != 0){
                var $previous = $adjacentDown.prev();
                var $next = $adjacentDown.next();
                
                $adjacentDown.insertBefore("td.last");
                
                if($previous.length != 0){
                    $("td.last").insertAfter($previous);
                }else{
                    $("td.last").insertBefore($next);
                }
            }
            break;
            
        case 3:
            //right
            if($(".last").prev().length != 0){
                $(".last").insertBefore($(".last").prev());
            }
            break;
            
        case 4:
            //down
            if($adjacentUp.length != 0){
                var $previous = $adjacentUp.prev();
                var $next = $adjacentUp.next();
                
                $adjacentUp.insertBefore("td.last");
                
                if($previous.length != 0){
                    $("td.last").insertAfter($previous);
                }else{
                    $("td.last").insertBefore($next);
                }
            }
            break;
    }
    return;
    
}

function verifierVictoire(){
    
    var tiles = $("td");
    
    for(var i=0; i < tiles.length; i++){
        if(tiles[i].id != $("td#t"+(i+1)).attr("id")) {   
            return false;
        }
    
    }
    
    return true;
};


function appliquerVictoire(){
    alert("Félicitations! Vous avez gagné avec " + deplacements + " déplacements.");
    tuilesBrassees = false;
    deplacements = 0;
    $("#deplacement").text("Déplacements : "+deplacements);
};
