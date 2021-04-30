class Carte {


    constructor(eltHtml, valeur, couleur) {
       this.carteHtml = eltHtml;
       this.valeur = valeur;
       this.couleur = couleur;

       this.carteHtml.ctrl = this;


       this.carteHtml.addEventListener("dragstart", (e) => this.drag(e));
       this.carteHtml.addEventListener("dragover", ( event ) => {
           // prevent default to allow drop
           event.preventDefault();
           console.log("drag over sur "+this.carteHtml.id);
       });
       this.carteHtml.addEventListener("drop", (e) => this.dropUneAutreCarteCarte(e));

    }


    drag(e) {
        e.dataTransfer.setData("text/id", this.carteHtml.id);
    }

    dropUneAutreCarteCarte(e) {
        console.log("drop sur "+this.carteHtml.id+" de "+e.dataTransfer.getData("text/id"));
    }


}