/**
 * 📌 Démarrage : Vérifie la section active et charge la bonne gestion
 */
document.addEventListener("DOMContentLoaded", () => {
    console.log("✅ Script admin.js chargé !");

    // Vérifie la page active en fonction de l'URL
    const currentPage = window.location.pathname.split("/").pop();

    if (currentPage === "activites_admin.html") {
        console.log("🏔 Gestion des Activités détectée.");
        gererActivitesAdmin();
    } else if (currentPage === "logements_admin.html") {
        console.log("🏠 Gestion des Logements détectée.");
        gererLogementsAdmin();
    } else {
        console.log("⚠️ Page non reconnue, aucune gestion spécifique appliquée.");
    }
});


/**
 * 🏠 Fonction principale pour gérer la section logements
 */
function gererLogementsAdmin() {
    afficherLogements();

    document.getElementById("ajouterLogement").addEventListener("click", async () => {
        await chargerProprietaires(); // 🟢 Charger les propriétaires avant d'afficher le modal
        const modal = new bootstrap.Modal(document.getElementById("addLogementModal"));
        modal.show();
    });
    

    document.getElementById("addLogementForm").addEventListener("submit", async (event) => {
        event.preventDefault();
    
        // 🔍 Vérifier la sélection d'un propriétaire
        const selectElement = document.getElementById("selectProprietaire");
        const idProprietaire = selectElement ? selectElement.value : null;
        
        console.log("📌 ID Propriétaire sélectionné :", idProprietaire);
    
        if (!idProprietaire) {
            alert("❌ Veuillez sélectionner un propriétaire.");
            return;
        }
    
        const formData = new FormData();
        formData.append("idProprietaire", idProprietaire);
        formData.append("nomImmeuble", document.getElementById("addNomImmeuble").value);
        formData.append("adresse", document.getElementById("addAdresse").value);
        formData.append("codePostal", document.getElementById("addCodePostal").value);
        formData.append("ville", document.getElementById("addVille").value);
        formData.append("typeLogement", document.getElementById("addTypeLogement").value);
        formData.append("surfaceHabitable", document.getElementById("addSurface").value);
        formData.append("capaciteAccueil", document.getElementById("addCapacite").value);
        formData.append("specifite", document.getElementById("addSpecifite").value);
        formData.append("photo", document.getElementById("addPhoto").files[0]);
    
        try {
            const response = await fetch("http://localhost:3000/NeigeEtSoleil_V4/logement/admin", {
                method: "POST",
                body: formData
            });
    
            if (!response.ok) throw new Error("Erreur lors de l'ajout du logement.");
    
            alert("✅ Logement ajouté avec succès !");
            location.reload();
        } catch (error) {
            console.error("❌ Erreur lors de l'ajout du logement :", error);
            alert("Impossible d'ajouter le logement.");
        }
    });
    
    /**
 * 📌 Fonction pour récupérer et afficher les logements
 */
async function afficherLogements() {
    console.log("🏠 Chargement des logements...");
    const tableBody = document.getElementById("logementsTable");
    if (!tableBody) {
        console.error("❌ Erreur : Impossible de trouver le tableau des logements.");
        return;
    }

    try {
        const response = await fetch("http://localhost:3000/NeigeEtSoleil_V4/logement/admin");
        if (!response.ok) throw new Error("Erreur lors du chargement des logements.");
        const logements = await response.json();

        tableBody.innerHTML = logements.length === 0 ? `<tr><td colspan="8" class="text-center">Aucun logement disponible</td></tr>` :
            logements.map(logement => `
                <tr>
                    <td>${logement.nom_immeuble}</td>
                    <td>${logement.adresse}, ${logement.code_postal}</td>
                    <td>${logement.ville}</td>
                    <td>${logement.type_logement}</td>
                    <td>${logement.surface_habitable} m²</td>
                    <td>${logement.capacite_accueil} pers.</td>
                    <td>${logement.proprietaire_nom} ${logement.proprietaire_prenom}</td>
                    <td>
                        <button class="btn btn-warning btn-sm edit-logement" data-id="${logement.id_logement}">✏️ Modifier</button>
                        <button class="btn btn-danger btn-sm delete-logement" data-id="${logement.id_logement}">🗑 Supprimer</button>
                    </td>
                </tr>
            `).join("");

        setTimeout(ajouterEventListenersLogements, 500);
    } catch (error) {
        console.error("❌ Erreur :", error);
        tableBody.innerHTML = `<tr><td colspan="8" class="text-center text-danger">Impossible de charger les logements.</td></tr>`;
    }
}


async function ouvrirModalModification(id) {
    try {
        console.log("📌 Ouverture du modal pour le logement ID :", id);
        
        const response = await fetch(`http://localhost:3000/NeigeEtSoleil_V4/logement/${id}`);

        console.log("🔍 Status de la réponse :", response.status);

        if (!response.ok) throw new Error("Erreur lors de la récupération du logement.");

        const logement = await response.json();
        console.log("📥 Logement récupéré :", logement); // 🔍 Vérification

        console.log("📌 Vérification des champs avant remplissage :");
console.log("editIdLogement :", document.getElementById("editIdLogement"));
console.log("editNomImmeuble :", document.getElementById("editNomImmeuble"));
console.log("editAdresse :", document.getElementById("editAdresse"));
console.log("editCodePostal :", document.getElementById("editCodePostal"));
console.log("editVille :", document.getElementById("editVille"));
console.log("editTypeLogement :", document.getElementById("editTypeLogement"));
console.log("editSurface :", document.getElementById("editSurface"));
console.log("editCapacite :", document.getElementById("editCapacite"));
console.log("editSpecifite :", document.getElementById("editSpecifite"));

        // 🏠 Pré-remplir les champs du formulaire avec les données du logement
        document.getElementById("editIdLogement").value = logement.id_logement;
        document.getElementById("editNomImmeuble").value = logement.nom_immeuble;
        document.getElementById("editAdresse").value = logement.adresse;
        document.getElementById("editCodePostal").value = logement.code_postal;
        document.getElementById("editVille").value = logement.ville;
        document.getElementById("editTypeLogement").value = logement.type_logement;
        document.getElementById("editSurface").value = logement.surface_habitable;
        document.getElementById("editCapacite").value = logement.capacite_accueil;
        document.getElementById("editSpecifite").value = logement.specifite || ""; // Evite valeur undefined

        console.log("📌 Champs pré-remplis avec succès !");

        // ✅ Afficher le modal
        const modal = new bootstrap.Modal(document.getElementById("editLogementModal"));
        modal.show();
    } catch (error) {
        console.error("❌ Erreur lors de la récupération du logement :", error);
        alert("Impossible de charger les détails du logement.");
    }
}



// 🟢 Gestion de la soumission du formulaire de modification
document.getElementById("editLogementForm").addEventListener("submit", async (event) => {
    event.preventDefault(); // ❌ Empêcher le rechargement de la page

    const idLogement = document.getElementById("editIdLogement").value;

    if (!idLogement) {
        alert("❌ Erreur : Aucun logement sélectionné.");
        return;
    }

    // 🔍 Récupérer uniquement les champs modifiés
    const logementData = {
        nom_immeuble: document.getElementById("editNomImmeuble").value,
        adresse: document.getElementById("editAdresse").value,
        code_postal: document.getElementById("editCodePostal").value,
        ville: document.getElementById("editVille").value,
        type_logement: document.getElementById("editTypeLogement").value,
        surface_habitable: document.getElementById("editSurface").value,
        capacite_accueil: document.getElementById("editCapacite").value,
        specifite: document.getElementById("editSpecifite").value
    };

    try {
        // 🚀 Envoyer uniquement les valeurs modifiées au serveur
        const response = await fetch(`http://localhost:3000/NeigeEtSoleil_V4/logement/${idLogement}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(logementData) // ✅ Envoyer en JSON
        });

        if (!response.ok) {
            throw new Error("Erreur lors de la modification du logement.");
        }

        alert("✅ Logement modifié avec succès !");
        location.reload(); // 🔄 Recharger la page pour voir les changements
    } catch (error) {
        console.error("❌ Erreur lors de la modification du logement :", error);
        alert("Impossible de modifier le logement.");
    }
});


/**
 * 🔄 Ajoute les événements sur les boutons Modifier et Supprimer (Logements)
 */
function ajouterEventListenersLogements() {
    document.querySelectorAll(".delete-logement").forEach(button => {
        button.addEventListener("click", async (event) => {
            const id = event.target.dataset.id;
            if (confirm("Voulez-vous vraiment supprimer ce logement ?")) {
                await deleteLogement(id);
            }
        });
    });

    document.querySelectorAll(".edit-logement").forEach(button => {
        button.addEventListener("click", async (event) => {
            const id = event.target.dataset.id;
            console.log("🟢 ID du logement sélectionné :", id); // ✅ Vérification
            await ouvrirModalModification(id);
        });
    });
}

/**
 * ❌ Fonction pour supprimer un logement
 */
async function deleteLogement(id) {
    try {
        const response = await fetch(`http://localhost:3000/NeigeEtSoleil_V4/logement/admin/${id}`, {
            method: "DELETE"
        });

        if (response.ok) {
            alert("Logement supprimé avec succès !");
            location.reload();
        } else {
            throw new Error("Erreur lors de la suppression.");
        }
    } catch (error) {
        console.error("❌ Erreur de suppression :", error);
        alert("Impossible de supprimer le logement.");
    }
}

/**
 * 📌 Récupère la liste des propriétaires et remplit le select
 */
async function chargerProprietaires() {
    console.log("📥 Chargement des propriétaires...");

    const selectProprietaire = document.getElementById("selectProprietaire");
    if (!selectProprietaire) {
        console.error("❌ Erreur : Impossible de trouver la liste déroulante des propriétaires.");
        return;
    }

    try {
        const response = await fetch("http://localhost:3000/NeigeEtSoleil_V4/logement/proprietaires");
        if (!response.ok) throw new Error("Erreur lors du chargement des propriétaires.");

        const proprietaires = await response.json();

        if (proprietaires.length === 0) {
            console.warn("⚠️ Aucun propriétaire disponible.");
        }

        console.log("✅ Propriétaires récupérés :", proprietaires);

        // ✅ Insérer les propriétaires dans la liste déroulante
        selectProprietaire.innerHTML = `<option value="">Sélectionner un propriétaire</option>` + 
            proprietaires.map(proprietaire => 
                `<option value="${proprietaire.id_utilisateur}">${proprietaire.nom} ${proprietaire.prenom}</option>`
            ).join("");

        console.log("🔹 Liste déroulante après mise à jour :", selectProprietaire.innerHTML);

    } catch (error) {
        console.error("❌ Erreur lors du chargement des propriétaires :", error);
    }
}

}


/**
 * 🎭 Fonction principale pour gérer la section des activités
 */
console.log("✅ Script admin.js chargé ! ligne 148 partie activite_admin");
function gererActivitesAdmin() {
    console.log("✅ Fonction gererActivitesAdmin() exécutée !");

    document.getElementById("editTypeActivite").addEventListener("change", (event) => {
        afficherChampsSpecifiques(event.target.value);
    });
    // ✅ Charger les activités au lancement
    afficherActivites();

    // ✅ Ajouter un événement pour l'ajout d'activité
    document.getElementById("ajouterActivite").addEventListener("click", ouvrirModalAjout);

    // ✅ Gérer la soumission du formulaire d'ajout/modification
    document.getElementById("editActiviteForm").addEventListener("submit", async (event) => {
        event.preventDefault();
        console.log("📝 Formulaire soumis !");
        

        await enregistrerActivite();
    });

    // ✅ Écouter les recherches en temps réel
    document.getElementById("searchActivity").addEventListener("input", filtrerActivites);

    /**
 * 📌 Fonction pour récupérer et afficher les activités
 */
async function afficherActivites() {
    console.log("🔍 Chargement des activités en cours...");

    try {
        const response = await fetch("http://localhost:3000/NeigeEtSoleil_V4/activites/admin");
        if (!response.ok) throw new Error("Erreur lors du chargement des activités.");
        const activites = await response.json();

        const tableBody = document.getElementById("activitesTable");
        tableBody.innerHTML = activites.length === 0 
            ? `<tr><td colspan="5" class="text-center">Aucune activité disponible</td></tr>`
            : activites.map(activite => `
                <tr>
                    <td>${activite.nom_activite}</td>
                    <td>${activite.type_activite || "Non défini"}</td>
                    <td>${activite.station_nom || "Non défini"}</td>
                    <td>${activite.prix ? parseFloat(activite.prix).toFixed(2) + " €" : "Non défini"}</td>
                    <td>
                        <button class="btn btn-warning btn-sm edit-activite" data-id="${activite.id_activite}">✏️ Modifier</button>
                        <button class="btn btn-danger btn-sm delete-activite" data-id="${activite.id_activite}">🗑 Supprimer</button>
                    </td>
                </tr>
            `).join("");

        ajouterEventListenersActivites();
    } catch (error) {
        console.error("❌ Erreur :", error);
        document.getElementById("activitesTable").innerHTML = 
            `<tr><td colspan="5" class="text-center text-danger">Impossible de charger les activités.</td></tr>`;
    }
}
/**
 * 🔄 Ajoute les événements sur les boutons Modifier et Supprimer
 */
function ajouterEventListenersActivites() {
    document.querySelectorAll(".edit-activite").forEach(button => {
        button.addEventListener("click", async (event) => {
            const id = event.target.dataset.id;
            await ouvrirModalModification(id);
        });
    });

    document.querySelectorAll(".delete-activite").forEach(button => {
        button.addEventListener("click", async (event) => {
            const id = event.target.dataset.id;
            await supprimerActivite(id);
        });
    });
}

/**
 * ➕ Ouvrir le modal pour ajouter une nouvelle activité
 */
function ouvrirModalAjout() {
    // ✅ Réinitialiser le formulaire
    document.getElementById("editActiviteForm").reset();
    document.getElementById("editIdActivite").value = ""; // Assurer que ce n'est pas une modification
    document.getElementById("specificFields").innerHTML = ""; // Vider les champs spécifiques

    // ✅ Modifier le titre du modal
    document.querySelector("#editActiviteModal .modal-title").textContent = "Ajouter une activité";

     // ✅ Sélectionner un type par défaut et afficher les champs correspondants
     const typeActiviteSelect = document.getElementById("editTypeActivite");
     typeActiviteSelect.value = "sportive";  // Mettre un type par défaut
     afficherChampsSpecifiques("sportive");  // Charger les champs spécifiques au type par défaut

    // ✅ Afficher le modal
    const modal = new bootstrap.Modal(document.getElementById("editActiviteModal"));
    modal.show();
}

/**
 * ✏️ Ouvrir le modal et pré-remplir les champs pour la modification
 */
async function ouvrirModalModification(id) {
    try {
        const response = await fetch(`http://localhost:3000/NeigeEtSoleil_V4/activites/admin/${id}`);
        if (!response.ok) throw new Error("Erreur lors de la récupération de l'activité.");

        const activite = await response.json();

        // ✅ Remplir le formulaire avec les données actuelles
        document.getElementById("editIdActivite").value = activite.id_activite;
        document.getElementById("editNomActivite").value = activite.nom_activite;
        document.getElementById("editStation").value = activite.station_nom;
        document.getElementById("editPrix").value = activite.prix;
        document.getElementById("editTypeActivite").value = activite.type_activite;

        // ✅ Adapter les champs spécifiques
        afficherChampsSpecifiques(activite.type_activite, activite);

        // ✅ Afficher le modal
        const modal = new bootstrap.Modal(document.getElementById("editActiviteModal"));
        modal.show();
    } catch (error) {
        console.error("❌ Erreur lors de la récupération de l'activité :", error);
        alert("Erreur lors du chargement de l'activité.");
    }
}

/**
 * ❌ Supprimer une activité
 */
async function supprimerActivite(id) {
    if (!confirm("Voulez-vous vraiment supprimer cette activité ?")) return;

    try {
        const response = await fetch(`http://localhost:3000/NeigeEtSoleil_V4/activites/admin/${id}`, {
            method: "DELETE",
        });

        if (!response.ok) throw new Error("Erreur lors de la suppression.");

        alert("✅ Activité supprimée avec succès !");
        afficherActivites(); // ✅ Rafraîchir la liste des activités
    } catch (error) {
        console.error("❌ Erreur lors de la suppression :", error);
        alert("Impossible de supprimer l'activité.");
    }
}
/**
 * ✅ Enregistrer une activité (Ajout ou Modification)
 */
async function enregistrerActivite() {
    console.log("🔍 Tentative d'enregistrement de l'activité..."); // Vérifier si la fonction est appelée

    const id = document.getElementById("editIdActivite").value;
    
    // ✅ Récupérer les valeurs des champs
    const nom_activite = document.getElementById("editNomActivite").value;
    const id_station = parseInt(document.getElementById("editStation").value, 10);

    const prix = document.getElementById("editPrix").value ? parseFloat(document.getElementById("editPrix").value) : null;
    const type_activite = document.getElementById("editTypeActivite").value;

    let activiteData = { nom_activite, id_station, prix, type: type_activite };

    console.log("📤 Données envoyées :", activiteData);

    // ✅ Ajouter les champs spécifiques selon le type d'activité
    switch (type_activite) {
        case "sportive":
            const typeSportElement = document.getElementById("editTypeSport");
            const niveauDifficulteElement = document.getElementById("editNiveauDifficulte");
    
            if (typeSportElement && niveauDifficulteElement) {
                activiteData.type_sport = typeSportElement.value;
                activiteData.niveau_difficulte = niveauDifficulteElement.value;
            } else {
                alert("⚠️ Les champs spécifiques pour une activité sportive ne sont pas affichés !");
                return;
            }
            break;
    
        case "culturelle":
            const dureeElement = document.getElementById("editDuree");
            const publicCibleElement = document.getElementById("editPublicCible");
    
            if (dureeElement && publicCibleElement) {
                activiteData.duree = dureeElement.value;
                activiteData.public_cible = publicCibleElement.value;
            } else {
                alert("⚠️ Les champs spécifiques pour une activité culturelle ne sont pas affichés !");
                return;
            }
            break;
    
        case "detente":
            const typeDetenteElement = document.getElementById("editTypeDetente");
            const descriptionElement = document.getElementById("editDescription");
    
            if (typeDetenteElement && descriptionElement) {
                activiteData.type_detente = typeDetenteElement.value;
                activiteData.description = descriptionElement.value;
            } else {
                alert("⚠️ Les champs spécifiques pour une activité détente ne sont pas affichés !");
                return;
            }
            break;
    
        default:
            alert("⚠️ Type d'activité invalide !");
            return;
    }
    

    const API_URL = id 
        ? `http://localhost:3000/NeigeEtSoleil_V4/activites/admin/${id}` // ✅ Mise à jour
        : "http://localhost:3000/NeigeEtSoleil_V4/activites/admin"; // ✅ Ajout

    const METHOD = id ? "PUT" : "POST";

    try {
        const response = await fetch(API_URL, {
            method: METHOD,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(activiteData),
        });

        if (!response.ok) {
            const errorMsg = await response.json();
            throw new Error(errorMsg.error || "Erreur lors de l'enregistrement.");
        }

        alert("✅ Activité enregistrée avec succès !");
        afficherActivites(); // ✅ Rafraîchir la liste des activités
    } catch (error) {
        console.error("❌ Erreur lors de l'enregistrement :", error);
        alert("Impossible d'enregistrer l'activité.");
    }
    console.log("📤 Données envoyées :", { id_station });
}
/**
 * 🎯 Afficher les champs spécifiques selon le type d'activité
 */
function afficherChampsSpecifiques(type, activite = {}) {
    const specificFields = document.getElementById("specificFields");
    specificFields.innerHTML = ""; // ✅ Vider les anciens champs

    if (type === "sportive") {
        specificFields.innerHTML = `
            <div class="mb-3">
                <label for="editTypeSport" class="form-label">Type de sport</label>
                <input type="text" id="editTypeSport" class="form-control" value="${activite.type_sport || ""}" required>
            </div>
            <div class="mb-3">
                <label for="editNiveauDifficulte" class="form-label">Niveau de difficulté</label>
                <select id="editNiveauDifficulte" class="form-control">
                    <option value="débutant" ${activite.niveau_difficulte === "débutant" ? "selected" : ""}>Débutant</option>
                    <option value="intermédiaire" ${activite.niveau_difficulte === "intermédiaire" ? "selected" : ""}>Intermédiaire</option>
                    <option value="avancé" ${activite.niveau_difficulte === "avancé" ? "selected" : ""}>Avancé</option>
                </select>
            </div>
        `;
    } else if (type === "culturelle") {
        specificFields.innerHTML = `
            <div class="mb-3">
                <label for="editDuree" class="form-label">Durée (minutes)</label>
                <input type="number" id="editDuree" class="form-control" value="${activite.duree || ""}" required>
            </div>
            <div class="mb-3">
                <label for="editPublicCible" class="form-label">Public cible</label>
                <select id="editPublicCible" class="form-control">
                    <option value="enfants" ${activite.public_cible === "enfants" ? "selected" : ""}>Enfants</option>
                    <option value="adultes" ${activite.public_cible === "adultes" ? "selected" : ""}>Adultes</option>
                    <option value="tous" ${activite.public_cible === "tous" ? "selected" : ""}>Tous</option>
                </select>
            </div>
        `;
    } else if (type === "detente") {
        specificFields.innerHTML = `
            <div class="mb-3">
                <label for="editTypeDetente" class="form-label">Type de détente</label>
                <input type="text" id="editTypeDetente" class="form-control" value="${activite.type_detente || ""}" required>
            </div>
            <div class="mb-3">
                <label for="editDescription" class="form-label">Description</label>
                <textarea id="editDescription" class="form-control">${activite.description || ""}</textarea>
            </div>
        `;
    }
}

// ✅ Ajouter un événement pour mettre à jour les champs selon le type sélectionné
document.getElementById("editTypeActivite").addEventListener("change", (event) => {
    afficherChampsSpecifiques(event.target.value);
});

/**
 * 🔍 Filtrer les activités en fonction du texte saisi
 */
function filtrerActivites() {
    const searchValue = document.getElementById("searchActivity").value.toLowerCase();
    const rows = document.querySelectorAll("#activitesTable tr");

    rows.forEach(row => {
        const nomActivite = row.cells[0]?.textContent.toLowerCase() || "";
        const typeActivite = row.cells[1]?.textContent.toLowerCase() || "";
        const station = row.cells[2]?.textContent.toLowerCase() || "";

        if (nomActivite.includes(searchValue) || typeActivite.includes(searchValue) || station.includes(searchValue)) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }
    });
}

/**
 * 🔙 Redirection vers l'accueil
 */
document.getElementById("btnRetourAccueil").addEventListener("click", () => {
    window.location.href = "index.html"; // ⚠️ Assurez-vous que `index.html` est bien le fichier d'accueil
});



}

