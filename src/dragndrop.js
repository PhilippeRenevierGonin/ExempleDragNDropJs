class Plateau {
    constructor(eltHtml) {
        this.plateauHtml = eltHtml;

        this.plateauHtml.addEventListener("dragover", ( event ) => {
            // prevent default to allow drop
            event.preventDefault();
            console.log("dragover sur plateau")
        });

        this.plateauHtml.addEventListener("drop", (e) => this.dropUneCarte(e));

    }

    dropUneCarte(event) {
        let carteDéplacée = document.getElementById(event.dataTransfer.getData("text/id"));
        carteDéplacée.ctrl.memoriserAnciennePosition();

        let positionDuPlateau = this.plateauHtml.getBoundingClientRect();

        let xInit = parseInt(event.dataTransfer.getData("text/posX"));
        let yInit = parseInt(event.dataTransfer.getData("text/posY"));
        let x = event.clientX - positionDuPlateau.x - xInit;
        let y = event.clientY - positionDuPlateau.y - yInit;

        carteDéplacée.style.left=""+x+"px";
        carteDéplacée.style.top=""+y+"px";

    }

}


class Carte {

    static ESPACEMENT = 20; //px


    constructor(eltHtml, valeur, couleur) {
       this.carteHtml = eltHtml;
       this.valeur = valeur;
       this.couleur = couleur;

       this.carteHtml.ctrl = this;


       this.carteHtml.addEventListener("dragstart", (e) => this.drag(e));
       this.carteHtml.addEventListener("dragover", ( event ) => {
           // prevent default to allow drop
           event.preventDefault();
           event.stopPropagation();
           console.log("drag over sur "+this.carteHtml.id);
       });
       this.carteHtml.addEventListener("drop", (e) => this.dropUneAutreCarte(e));

               // creation de la minature
               let span = document.createElement("span");
               span.innerHTML = ""+valeur;
               span.className = couleur;
               this.carteHtml.appendChild(span);
    }


    memoriserAnciennePosition() {
        let monStyle = getComputedStyle(this.carteHtml);
        let gauche = parseInt(monStyle["left"]);
        let haut = parseInt(monStyle["top"]);

        this.ancienGauche = gauche;
        this.ancientHaut = haut;
    }

    restaurer() {
        this.carteHtml.style.left=""+this.ancienGauche+"px";
        this.carteHtml.style.top=""+this.ancientHaut+"px";
    }

    drag(e) {
        e.stopPropagation();

        e.dataTransfer.setData("text/id", this.carteHtml.id);
        
        // position de la souris sur la carte
        // calcul car rien de standard
        let positionDeLaCarte = this.carteHtml.getBoundingClientRect();
        let x = e.clientX - positionDeLaCarte.x; // layerX n'est pas standard, on calcul
        let y = e.clientY - positionDeLaCarte.y;
        e.dataTransfer.setData("text/posX", x);
        e.dataTransfer.setData("text/posY", y);

    }

    dropUneAutreCarte(e) {
        e.stopPropagation();
        console.log("drop sur "+this.carteHtml.id+" de "+e.dataTransfer.getData("text/id"));
        let carteDéplacée = document.getElementById(e.dataTransfer.getData("text/id"));
        // console.log("drop possible ? "+this.peutRecevoir(carteDéplacée.ctrl));
        
        if (this.peutRecevoir(carteDéplacée.ctrl)) {
            carteDéplacée.ctrl.memoriserAnciennePosition();
            console.log("déplacement possible");
            let monStyle = getComputedStyle(this.carteHtml);
            let gauche = parseInt(monStyle["left"]);
            carteDéplacée.style.left=""+gauche+"px";
            let haut = parseInt(monStyle["top"]);
            carteDéplacée.style.top=""+(haut+Carte.ESPACEMENT)+"px";

            
            let zindex = parseInt(monStyle["z-index"]);
            carteDéplacée.style.zIndex = zindex+1;
            

        } else {
            console.log("déplacement impossible");
        }
    
    }


    peutRecevoir(carte) {
        return ((this.couleur !== carte.couleur) && (this.valeur === carte.valeur+1))
    }
}