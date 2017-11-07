export class UtilisateurBase {
    utilisateurs: string[] = [];

    public existe(utilisateurChoisi: string): boolean {
        if (this.utilisateurs.length === 0) {
            return false;
        }
        for (let utilisateur of this.utilisateurs) {
            if (utilisateur === utilisateurChoisi) {
                return true;
            }
        }
        return false;
    }

    public ajouterUtilisateur(utilisateurChoisi: string): boolean {
        if (!this.existe(utilisateurChoisi)) {
            this.utilisateurs.push(utilisateurChoisi);
            return true;
        }
        else {
            return false;
        }
    }

    public enleverUtilisateur(utilisateurParti: string): boolean {
        let index = this.utilisateurs.indexOf(utilisateurParti);
        if (index > -1) {
            this.utilisateurs.splice(index, 1);
            return true;
        }
        return false;
    }
}
