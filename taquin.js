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
     var showNumbers = $('#form input[name="numeros"]').val();
     
     // if not valid, display message 
     if(!url || !nbLignes || !nbCols) {
       //TODO : test if valid, display message
       return;
     }
     
     // Generate table
     $("#table").append(document.createElement("table"));     
     for(var i=0; i < nbLignes; i++) {
        $("table").append(document.createElement("tr"));
        
     }
     for(var j=0; j < nbCols; j++) {
       $("tr").append(document.createElement("td"));
     }
     
     // Display image and numbers 
     //TODO : crop image/display correct cell numbers
     $("td").text(nbCols * nbLignes).css("background-color", "yellow");
     $("td").append(document.createElement("img"));
     $("img").attr("src", url).attr("alt", "my image");

     $("label").css("background-color", "green"); //temp test
};

// Mélange les tuiles du jeu existant
function brasser(){
     //TODO : shuffle tiles numbers
     // update display
     $("label").css("background-color", "red"); //temp test
};