$(document).ready(function(){

// Button listeners 
$('#afficher').click(function() {
    return afficher();
});

$('#brasser').click(function() {
    return brasser();
});

});

// Affiche un nouveau jeu
function afficher(){
     //Get info from form
     var url = $('#form input[name="url"]').val();
     var nbLignes = $('#form input[name="lignes"]').val();
     var nbCols = $('#form input[name="colonnes"]').val();
     var showNumbers = $('#form input[name="numeros"]').is(':checked');
                        
     var update_properties = function(src) {
         var img = new Image();
         $(img).one('load', function() {
             document.styleSheets[0].cssRules[0].style.setProperty("--item-w", ""+(img.width/nbCols-2*nbCols)+"px");
             document.styleSheets[0].cssRules[0].style.setProperty("--item-h", ""+(img.height/nbLignes-2*nbLignes)+"px");
             document.styleSheets[0].cssRules[0].style.setProperty("--img-src", "url("+url+")");
             document.styleSheets[0].cssRules[0].style.setProperty("--font-s", ""+Math.max((img.height/(10*nbLignes)), 30)+"px");
             if(showNumbers){
                document.styleSheets[0].cssRules[0].style.setProperty("--visible", "visible");
             }
         });
         img.src = src;
     };
          
     // if not valid, display message 
     if(!url || !nbLignes || !nbCols) {
       //TODO : test if valid, display message
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
            item.id = ""+nbItems;
            $("tr."+i).append(item);
            $("td#"+nbItems).append(number);
            $("td#"+nbItems).attr("style", "background-position:-"+
                ((j-1)*100)+"% -"+((i-1)*100)+"%");
            
            if(nbItems == nbLignes*nbCols){
                $("td#"+nbItems).addClass("last");
            }
            nbItems++;
        }   
     }
     
};

//Mélange les tuiles du jeu existant
function brasser(){
    //TODO : Find an algorithm that involes less nested loops?
    var nbTiles = $("td").length;
    var nbRows = $("tr").length;
    var nbCols = nbTiles/nbRows;
    var usedIds = [];
     
    for(var i=1; i <= nbRows; i++){
        for (var j=0; j < nbCols; j++){
            
            var tileId = 0;
           
            //find a new random tile that isn't the last one
            do{
                tileId = Math.floor((Math.random()*(nbTiles-1))+1);
            }while($.inArray(tileId, usedIds) != -1);
            
            //add the tile to table and its id to the list of used tiles
            $("tr."+i).append($("td#"+tileId));
            usedIds.push(tileId);
            
            //to leave an empty space for final tile
            if(i == nbRows && j == nbCols-2){j++}
        }
    }
     
    $("tr."+nbRows).append($("td#"+nbTiles));
     
    //click listener added to the shuffled tiles to permit play
    $("td").click(function() {
        return deplacer($(this));
    });
    
    //arrow key listener added to document
    $(document).keyup(function(e){
        return deplacerFleche(e.which);
    });
     
};

// Échange une tuile avec l'espace vide si celui-ci lui est adjacent
function deplacer($tile){
     //TODO : Mettre à jour nombre déplacements
     var $next = $tile.next();
     var $previous = $tile.prev();
     var $parentRow = $tile.parent();
     var tilePosition = $parentRow.children().index(document.getElementById($tile.attr("id")));
          
     if($next.hasClass("last")){
        //droite
        $tile.insertAfter($next);
        //deplacements++;
        return;
     }else if($previous.hasClass("last")){
        //gauche
        $tile.insertBefore($previous);
        //deplacements++;
        return;
     }else if($parentRow.prev().children().eq(tilePosition).hasClass("last")){
        //haut
        $tile.insertBefore("td.last");
        if($previous.length!= 0){
            $("td.last").insertAfter($previous);
        }else{
            $("td.last").insertBefore($next);
        }
        //deplacements++
        return;
     }else if($parentRow.next().children().eq(tilePosition).hasClass("last")){
        //bas
        $tile.insertBefore("td.last");
        if($previous.length!= 0){
            $("td.last").insertAfter($previous);
        }else{
            $("td.last").insertBefore($next);
        }
        //deplacements++
        return;
     }else{
        return;
     }
        
};

function deplacerFleche(key){
    
    //TODO : Mettre à jour nombre déplacements
    var id = $(".last").attr("id");
    var position = $(".last").parent().children().index(document.getElementById(id));
    var $adjacentUp = $(".last").parent().prev().children().eq(position);
    var $adjacentDown = $(".last").parent().next().children().eq(position);
          
    switch (key){
        
        case 37:
            //left
            if($(".last").next().length != 0){
                $(".last").insertAfter($(".last").next());
                //deplacements++;
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
                //deplacements++
            }
            break;
            
        case 39:
            //right
            if($(".last").prev().length != 0){
                $(".last").insertBefore($(".last").prev());
                //deplacements++;
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
                //deplacements++
            }
            break;
    }
};
