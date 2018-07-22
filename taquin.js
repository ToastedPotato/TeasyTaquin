$(document).ready(function(){

//var deplacements = 0;

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
             document.styleSheets[0].cssRules[0].style.setProperty("--item-w", ""+(img.width/nbCols)+"px");
             document.styleSheets[0].cssRules[0].style.setProperty("--item-h", ""+(img.height/nbLignes)+"px");
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
     
     // Generate table and display image+numbers
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
            $("td#"+nbItems).attr("style", "background-position:-"+((j-1)*100)+"% -"+((i-1)*100)+"%");
            $("td#"+nbItems).click(function() {
                return deplacer($(this));
            });
            if(nbItems == nbLignes*nbCols){
                $("td#"+nbItems).addClass("last");
            }
            nbItems++;
        }   
     }
     
     $("label").css("background-color", "green"); //temp test
};

// Mélange les tuiles du jeu existant
function brasser(){
     //TODO : shuffle tiles numbers
     // update display
     $("label").css("background-color", "red"); //temp test
};

// Échange une tuile avec l'espace vide si celui-ci lui est adjacent
function deplacer($tile){
     //TODO : Gérer les déplacements verticaux
     if($tile.next().hasClass("last")){
        $tile.insertAfter("td.last");
        //deplacements++;
        return;
     }else if($tile.prev().hasClass("last")){
        $tile.insertBefore("td.last");
        //deplacements++;
        return;
     }else{
        alert("Déplacement impossible");
        return;
     }
        
};
