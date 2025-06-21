/**
 * 📌 Démarrage : Vérifie la section active et charge la bonne gestion
 */if (window.location.pathname.includes("dashboard.html") || window.location.pathname.includes("gestion_reservations.html")) {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || user.role !== "admin") {
        // Redirige uniquement si l’utilisateur est sur dashboard et pas déjà en train d’aller vers index.html#contact
        if (!window.location.href.includes("index.html#contact")) {
            window.location.replace("index.html#contact");
        }
    }
}



  
document.addEventListener("DOMContentLoaded", () => {
    console.log("✅ Script admin.js chargé !");

    const adminPages = ["dashboard.html", "gestion_reservations.html", "activites_admin.html", "logements_admin.html"];

adminPages.forEach(page => {
    if (window.location.pathname.includes(page)) {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user || user.role !== "admin") {
            window.location.replace("index.html#contact");
        }
    }
});
    // Vérifie la page active en fonction de l'URL
    const currentPage = window.location.pathname.split("/").pop();

    if (currentPage === "activites_admin.html") {
        console.log("🏔 Gestion des Activités détectée.");
        gererActivitesAdmin();
    } else if (currentPage === "logements_admin.html") {
        console.log("🏠 Gestion des Logements détectée.");
        gererLogementsAdmin();
    } else if (currentPage === "gestion_reservations.html") {
        console.log("📅 Gestion des Réservations détectée.");
        gererReservationsAdmin();
    } else if (currentPage === "dashboard.html") {
        console.log("📅 Gestion des Stats détectée.");
        gererDashboardAdmin();
    } else {
        console.log("⚠️ Page non reconnue, aucune gestion spécifique appliquée.");
    }  


    // Vérifier la connexion de l’utilisateur et effectuer une redirection selon le rôle
function handleRedirection(elementId, redirectMap) {
    const element = document.getElementById(elementId);
    if (element) {
        element.addEventListener("click", (e) => {
            e.preventDefault();

            const user = JSON.parse(localStorage.getItem("user"));

            const redirectUrl = redirectMap[user.role];
            if (redirectUrl) {
                window.location.href = redirectUrl;
            } 
        });
    }
}

   // Appels à la fonction générique pour attacher les redirections
   handleRedirection("guide-touristique", {
    client: "services-details.html",
    proprietaire: "services-details.html",
    admin: "gestion_reservations.html"
});

   handleRedirection("Assistance", "dashboard.html");
});



/**
 * 🏠 Fonction principale pour gérer la section logements
 */
async function gererLogementsAdmin() {
    console.log("🚀 Initialisation de la gestion des logements...");
  
    // Charger et afficher les logements
    await afficherLogements();
  
    // Ajouter un logement
    document.getElementById("ajouterLogement").addEventListener("click", async () => {
      await chargerProprietaires(); 
      const modal = new bootstrap.Modal(document.getElementById("addLogementModal"));
      modal.show();
    });
  
    // Soumission du formulaire d'ajout
    document.getElementById("addLogementForm").addEventListener("submit", async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
    
        // Vérification de toutes les entrées dans FormData
        for (const [key, value] of formData.entries()) {
            console.log(`${key}: ${value}`);
        }
    
        if (!formData.get("idProprietaire")) {
            alert("❌ Veuillez sélectionner un propriétaire.");
            return;
        }
    
        try {
            const response = await fetch("http://localhost:3000/NeigeEtSoleil_V4/logement", {
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
    
  }
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
  
      tableBody.innerHTML = logements.length === 0
        ? `<tr><td colspan="8" class="text-center">Aucun logement disponible</td></tr>`
        : logements.map(logement => `
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
  
      ajouterEventListenersLogements();
    } catch (error) {
      console.error("❌ Erreur lors du chargement des logements :", error);
      tableBody.innerHTML = `<tr><td colspan="8" class="text-center text-danger">Impossible de charger les logements.</td></tr>`;
    }
  }
    // 🔄 Ajoute les événements sur les boutons Modifier et Supprimer
function ajouterEventListenersLogements() {
    document.querySelectorAll(".edit-logement").forEach(button => {
      button.addEventListener("click", async (event) => {
        const id = event.target.dataset.id;
        await ouvrirModalModification(id);  // 📌 Appelle la fonction pour modifier le logement
      });
    });
  
    document.querySelectorAll(".delete-logement").forEach(button => {
      button.addEventListener("click", async (event) => {
        const id = event.target.dataset.id;
        if (confirm("Voulez-vous vraiment supprimer ce logement ?")) {
          await deleteLogement(id);  // 📌 Appelle la fonction pour supprimer le logement
        }
      });
    });
  }
  async function ouvrirModalModification(id) {
    try {
      const response = await fetch(`http://localhost:3000/NeigeEtSoleil_V4/logement/${id}`);
      if (!response.ok) throw new Error("Erreur lors de la récupération du logement.");
  
      const logement = await response.json();
      remplirFormulaireModification(logement);  // Fonction qui remplit les champs du formulaire avec les données
  
      const modal = new bootstrap.Modal(document.getElementById("editLogementModal"));
      modal.show();
    } catch (error) {
      console.error("❌ Erreur lors de la récupération du logement :", error);
      alert("Impossible de charger les détails du logement.");
    }
  }
  async function deleteLogement(id) {
    try {
      const response = await fetch(`http://localhost:3000/NeigeEtSoleil_V4/logement/admin/${id}`, {
        method: "DELETE"
      });
  
      if (!response.ok) throw new Error("Erreur lors de la suppression du logement.");
      
      alert("✅ Logement supprimé avec succès !");
      location.reload();  // 🔄 Recharge la page pour mettre à jour la liste
    } catch (error) {
      console.error("❌ Erreur lors de la suppression :", error);
      alert("Impossible de supprimer le logement.");
    }
  }

  //Cette fonction remplit les champs du formulaire avec les données récupérées.
  function remplirFormulaireModification(data) {
    document.getElementById("editIdLogement").value = data.id_logement;
    document.getElementById("editNomImmeuble").value = data.nom_immeuble;
    document.getElementById("editAdresse").value = data.adresse;
    document.getElementById("editCodePostal").value = data.code_postal;
    document.getElementById("editVille").value = data.ville;
    document.getElementById("editTypeLogement").value = data.type_logement;
    document.getElementById("editSurface").value = data.surface_habitable;
    document.getElementById("editCapacite").value = data.capacite_accueil;
    document.getElementById("editSpecifite").value = data.specifite || "";  

    // ✅ Assurez-vous que les champs sont modifiables
    document.getElementById("editNomImmeuble").readOnly = false;
    document.getElementById("editAdresse").readOnly = false;
    document.getElementById("editCodePostal").readOnly = false;
    document.getElementById("editVille").readOnly = false;
    document.getElementById("editTypeLogement").disabled = false;
    document.getElementById("editSurface").readOnly = false;
    document.getElementById("editCapacite").readOnly = false;
    document.getElementById("editSpecifite").readOnly = false;
}

  async function chargerProprietaires() {
    const selectProprietaire = document.getElementById("selectProprietaire");
    console.log("Options dans la liste :", selectProprietaire.options.length);
    if (!selectProprietaire) {
      console.error("❌ Erreur : Impossible de trouver la liste déroulante des propriétaires.");
      return;
    }
    try {
      const response = await fetch("http://localhost:3000/NeigeEtSoleil_V4/logement/proprietaires");
      if (!response.ok) throw new Error("Erreur lors du chargement des propriétaires.");
      const proprietaires = await response.json();
      selectProprietaire.innerHTML = proprietaires.map(
        proprietaire => `<option value="${proprietaire.id_utilisateur}">${proprietaire.nom} ${proprietaire.prenom}</option>`
      ).join("");
    } catch (error) {
      console.error("❌ Erreur lors du chargement des propriétaires :", error);
    }
  }
    
  async function fetchData(url, method = "GET", body = null) {
    const options = {
      method,
      headers: { "Content-Type": "application/json" }
    };
    if (body) options.body = body instanceof FormData ? body : JSON.stringify(body);
    const response = await fetch(url, options);
    if (!response.ok) throw new Error(`Erreur : ${response.statusText}`);
    return response.json();
  }

  const editForm = document.getElementById("editLogementForm");

if (editForm) {
  editForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const idLogement = document.getElementById("editIdLogement").value;

    const logementData = {
      nomImmeuble: document.getElementById("editNomImmeuble").value.trim(),
      adresse: document.getElementById("editAdresse").value.trim(),
      codePostal: document.getElementById("editCodePostal").value.trim(),
      ville: document.getElementById("editVille").value.trim(),
      typeLogement: document.getElementById("editTypeLogement").value.trim(),
      surfaceHabitable: document.getElementById("editSurface").value || null,
      capaciteAccueil: document.getElementById("editCapacite").value || null,
      specifite: document.getElementById("editSpecifite").value.trim() || null,
    };

    console.log("📌 Données envoyées :", logementData);

    try {
      // Ajout d'un indicateur de chargement
      editForm.querySelector("button[type='submit']").textContent = "Modification en cours...";

      const response = await fetch(`http://localhost:3000/NeigeEtSoleil_V4/logement/${idLogement}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(logementData),
      });

      if (!response.ok) throw new Error("Erreur lors de la modification du logement.");

      alert("✅ Logement modifié avec succès !");
      location.reload();
    } catch (error) {
      console.error("❌ Erreur lors de la modification :", error);
      alert("Impossible de modifier le logement.");
    } finally {
      // Remettre le texte d'origine sur le bouton après l’opération
      editForm.querySelector("button[type='submit']").textContent = "Sauvegarder";
    }
  });
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

/**
 * 📅 Fonction principale pour gérer la gestion des réservations des clients
 */

                    // Stocker les réservations globales pour faciliter le filtre et la recherche
                    let allReservations = [];
function gererReservationsAdmin() {
    console.log("📌 Gestion des réservations en cours...");

    fetchReservations();
// 🔄 Récupère les réservations et affiche uniquement celles en attente
async function fetchReservations() {
    try {
        const response = await fetch("http://localhost:3000/NeigeEtSoleil_V4/disponibilites/reservations-en-attente");
        const reservations = await response.json();

        if (!response.ok) {
            throw new Error(reservations.error || "Erreur lors de la récupération des réservations.");
        }

        // ✅ Vérifie si l'élément `reservationTable` existe
        const reservationTable = document.getElementById("reservationTable");
        if (!reservationTable) {
            console.error("❌ Erreur : Élément 'reservationTable' introuvable dans le DOM.");
            return;
        }

        // ✅ Vérifie si la liste est vide
        if (Array.isArray(reservations) && reservations.length === 0) {
            console.log("⚠️ Aucune réservation en attente.");
            reservationTable.innerHTML = `
                <tr>
                    <td colspan="8" style="text-align: center; padding: 10px;">Aucune réservation en attente.</td>
                </tr>
            `;
            return;
        }

        console.log("✅ Réservations récupérées :", reservations);
        displayReservations(reservations);
    } catch (error) {
        console.error("❌ Erreur lors de la récupération :", error.message);
    }
}



    // 📌 Affiche les réservations en attente dans le tableau
    function displayReservations(reservations) {
        const tableBody = document.getElementById("reservationsTableBody");
        tableBody.innerHTML = ""; // Vide le tableau avant d'ajouter les nouvelles données

        reservations.forEach(reservation => {
            if (reservation.statut !== "reserve") return; // Afficher uniquement les réservations en attente

            const row = document.createElement("tr");
            row.innerHTML = `
            <td>${reservation.id_reservation || 'N/A'}</td>
            <td>${reservation.nom_client ? reservation.nom_client + " " + reservation.prenom_client : 'N/A'}</td>
            <td>${reservation.email_client || 'N/A'}</td>
            <td>${reservation.logement || 'N/A'}</td>
            <td>${reservation.adresse || 'N/A'}</td>
            <td>${reservation.date_debut ? new Date(reservation.date_debut).toLocaleDateString("fr-FR") : 'N/A'}</td>
            <td>${reservation.date_fin ? new Date(reservation.date_fin).toLocaleDateString("fr-FR") : 'N/A'}</td>
            <td><span class="badge ${getBadgeClass(reservation.statut)}">${reservation.statut || 'N/A'}</span></td>

            <td>
                <button class="btn btn-success confirm-btn" data-id="${reservation.id_reservation}">✅ Confirmer</button>
                <button class="btn btn-danger cancel-btn" data-id="${reservation.id_reservation}">❌ Annuler</button>
                <button class="btn btn-primary envoyer-contrat" data-id="${reservation.id_reservation}">📩 Envoyer Contrat</button>
            </td>
        `;

        console.log(getBadgeClass("confirmed"));  // Attendu : "bg-success"
console.log(getBadgeClass("pending"));    // Attendu : "bg-warning"
console.log(getBadgeClass("cancelled"));  // Attendu : "bg-danger"
console.log(getBadgeClass("unknown"));    // Attendu : "bg-secondary"

        document.querySelectorAll(".envoyer-contrat").forEach(button => {
            button.addEventListener("click", async (event) => {
                const idReservation = event.target.dataset.id;
                console.log(`📩 Envoi du contrat pour la réservation ID : ${idReservation}`);
                await envoyerContrat(idReservation);
            });
        });
                

// 🔹 **Sélection des boutons après l'ajout du HTML**
const confirmButton = row.querySelector(".confirm-btn");
const cancelButton = row.querySelector(".cancel-btn");

// 🔹 **Ajout des événements `click`**
confirmButton.addEventListener("click", function() {
    confirmerReservation(reservation.id_reservation);
});

cancelButton.addEventListener("click", function() {
    annulerReservation(reservation.id_reservation);
});

        


            tableBody.appendChild(row);
        });

        // Ajoute les événements aux boutons
        document.querySelectorAll(".confirmer-btn").forEach(btn => {
            btn.addEventListener("click", confirmReservation);
        });

        document.querySelectorAll(".annuler-btn").forEach(btn => {
            btn.addEventListener("click", cancelReservation);
        });
    }

    // 🎯 Recherche et filtrage
document.getElementById("searchInput").addEventListener("input", function () {
    const searchTerm = this.value.toLowerCase();
    const filteredReservations = allReservations.filter(reservation =>
        reservation.nom_client.toLowerCase().includes(searchTerm) ||
        reservation.prenom_client.toLowerCase().includes(searchTerm)
    );
    displayReservations(filteredReservations);
});

document.getElementById("filterStatus").addEventListener("change", function () {
    const selectedStatus = this.value;
    const filteredReservations = selectedStatus === "all"
        ? allReservations
        : allReservations.filter(reservation => reservation.statut === selectedStatus);
    displayReservations(filteredReservations);
});
// 🌟 Fonction pour obtenir la classe de badge en fonction du statut
function getBadgeClass(status) {
    switch (status) {
        case "confirmed": return "bg-success";
        case "pending": return "bg-warning";
        case "cancelled": return "bg-danger";
        default: return "bg-secondary";
    }
}

    // ✅ Fonction pour confirmer une réservation
    async function confirmReservation(event) {
        const idReservation = event.target.getAttribute("data-id");

        try {
            const response = await fetch(`http://localhost:3000/NeigeEtSoleil_V4/valider-reservation/${idReservation}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" }
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || "Erreur lors de la confirmation.");
            }

            alert("✅ Réservation confirmée !");
            
            // 📧 Envoi du contrat après confirmation
            await envoyerContrat(idReservation);

            fetchReservations(); // Recharge les réservations mises à jour
        } catch (error) {
            console.error("❌ Erreur lors de la confirmation :", error.message);
            alert("Impossible de confirmer la réservation.");
        }
    }

    // ❌ Fonction pour annuler une réservation
    async function cancelReservation(event) {
        const idReservation = event.target.getAttribute("data-id");

        const confirmation = confirm("Êtes-vous sûr de vouloir annuler cette réservation ?");
        if (!confirmation) return;

        try {
            const response = await fetch(`http://localhost:3000/NeigeEtSoleil_V4/annuler-reservation/${idReservation}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" }
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || "Erreur lors de l'annulation.");
            }

            alert("❌ Réservation annulée.");
            fetchReservations(); // Recharge les réservations mises à jour
        } catch (error) {
            console.error("❌ Erreur lors de l'annulation :", error.message);
            alert("Impossible d'annuler la réservation.");
        }
    }

    // 📧 Fonction pour envoyer le contrat au client
    async function envoyerContrat(idReservation) {
        try {
            console.log(`📜 Génération du contrat pour la réservation ID : ${idReservation}...`);
            
            // 🔄 Génération du contrat
            const generateResponse = await fetch(`http://localhost:3000/NeigeEtSoleil_V4/disponibilites/generer-contrat/${idReservation}`, { method: "GET" });
            if (!generateResponse.ok) {
                const errorData = await generateResponse.json();
                throw new Error(errorData.error || "Échec de la génération du contrat.");
            }
            console.log("✅ Contrat généré avec succès !");
            
            // 📧 Envoi du contrat
            console.log(`📧 Envoi du contrat pour la réservation ID : ${idReservation}...`);
            const sendResponse = await fetch(`http://localhost:3000/NeigeEtSoleil_V4/disponibilites/envoyer-contrat/${idReservation}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" }
            });
            
            // 🔍 Vérifier si l'envoi a réussi
            if (!sendResponse.ok) {
                const errorData = await sendResponse.json();
                throw new Error(errorData.error || "Erreur lors de l'envoi du contrat.");
            }
    
            const sendData = await sendResponse.json();
            console.log("✅ Réponse du serveur :", sendData);
            alert("📧 Contrat envoyé avec succès !");
            
        } catch (error) {
            console.error("❌ Erreur lors de l'envoi du contrat :", error.message);
    
            // 🛑 Gérer les erreurs réseau (Failed to fetch)
            if (error.message === "Failed to fetch") {
                alert("❌ Erreur réseau : Impossible de contacter le serveur.");
            } else {
                alert("❌ Impossible d'envoyer le contrat. Vérifie si la réservation est valide et si le contrat a été généré.");
            }
        }
    }
    
    


    // Fonction pour confirmer la réservation
function confirmerReservation(idReservation) {
    fetch(`http://localhost:3000/NeigeEtSoleil_V4/disponibilites/gestion-reservation/${idReservation}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "confirmer" }) // ✅ Envoi de l'action correcte
    })
    .then(response => response.json())
    .then(data => {
        console.log("✅ Réservation confirmée :", data);
        alert("Réservation confirmée avec succès !");
        location.reload(); // Recharge la page
    })
    .catch(error => console.error("❌ Erreur lors de la confirmation :", error));
}

// Fonction pour annuler la réservation
function annulerReservation(idReservation) {
    fetch(`http://localhost:3000/NeigeEtSoleil_V4/disponibilites/gestion-reservation/${idReservation}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "annuler" }) // ✅ Envoi de l'action correcte
    })
    .then(response => response.json())
    .then(data => {
        console.log("❌ Réservation annulée :", data);
        alert("Réservation annulée avec succès !");
        location.reload(); // Recharge la page
    })
    .catch(error => console.error("❌ Erreur lors de l'annulation :", error));
}


}

/**
 * 📊 Fonction principale pour gérer la section Dashboard
 */
function gererDashboardAdmin() {
    console.log("📊 Chargement du Dashboard...");

    // Initialisation des graphiques
    let chartReservationsMois, chartRevenusStation, chartActivitesPopulaires, chartRevenusSaisonLogement;

    // Charger les statistiques globales
    chargerStatistiquesGlobales();

    // Charger les graphiques
    chargerGraphiqueReservationsMois();
    chargerGraphiqueRevenusStation();
    chargerGraphiqueActivitesPopulaires();


    // Charger les tableaux
    chargerTableauTopClients();
    
}

/**
 * 📌 Fonction pour charger les statistiques globales
 */
    async function chargerStatistiquesGlobales() {
    console.log("📊 Chargement des statistiques globales...");

    try {
        const response = await fetch("http://localhost:3000/NeigeEtSoleil_V4/stats/globales");
        if (!response.ok) throw new Error("Erreur lors du chargement des statistiques globales.");
        
        const stats = await response.json();
        console.log("✅ Statistiques globales :", stats);

        document.getElementById("totalReservations").textContent = stats.total_reservations_logement;
        document.getElementById("totalLogements").textContent = stats.total_logements;
        document.getElementById("totalActivites").textContent = stats.total_reservations_activite;
        document.getElementById("revenuTotal").textContent = `${stats.revenu_total.toLocaleString()} €`;


    } catch (error) {
        console.error("❌ Erreur :", error);
        alert("Erreur lors du chargement des statistiques globales.");
    }
}

/**
 * 📊 Fonction pour charger le graphique des réservations par mois
 */
let chartReservationsMois = null;

async function chargerGraphiqueReservationsMois() {
    console.log("📊 Chargement du graphique : Réservations par Mois...");

    try {
        const response = await fetch("http://localhost:3000/NeigeEtSoleil_V4/stats/reservations-par-mois");
        if (!response.ok) throw new Error("Erreur lors du chargement des réservations par mois.");

        const data = await response.json();
        console.log("✅ Données Réservations par Mois :", data);

        const mois = data.map(item => `${item.mois} ${item.annee}`);
        const nombreReservations = data.map(item => item.nombre_reservations);

        const ctx = document.getElementById("chartReservationsMois").getContext("2d");

        if (chartReservationsMois instanceof Chart) {
            chartReservationsMois.destroy();
        }

        chartReservationsMois = new Chart(ctx, {
            type: "bar",
            data: {
                labels: mois,
                datasets: [{
                    label: "Réservations",
                    data: nombreReservations,
                    backgroundColor: "rgba(54, 162, 235, 0.6)",
                    borderColor: "rgba(54, 162, 235, 1)",
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

    } catch (error) {
        console.error("❌ Erreur :", error);
        alert("Erreur lors du chargement du graphique des réservations par mois.");
    }
}


/**
 * 📊 Fonction pour charger le graphique des revenus par station
 */
window.chartRevenusStation = undefined;

async function chargerGraphiqueRevenusStation() {
  console.log("📊 Chargement du graphique : Revenus par Station...");

  try {
    const response = await fetch("http://localhost:3000/NeigeEtSoleil_V4/stats/revenus-par-station", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        date_debut: "2000-01-01",
        date_fin: "2100-12-31"
      })
    });

    if (!response.ok) throw new Error("Erreur lors du chargement des revenus par station.");
    const data = await response.json();
    console.log("✅ Données Revenus par Station :", data);

    const stations = data.map(item => item.nom_station);
    const revenus = data.map(item => item.revenu_total);

    const ctx = document.getElementById("chartRevenusStation").getContext("2d");
    if (window.chartRevenusStation) window.chartRevenusStation.destroy();

    window.chartRevenusStation = new Chart(ctx, {
      type: "pie",
      data: {
        labels: stations,
        datasets: [{
          label: "Revenus (€)",
          data: revenus,
          backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"]
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom' }
        }
      }
    });

  } catch (error) {
    console.error("❌ Erreur :", error);
    alert("Erreur lors du chargement des revenus par station.");
  }
}


/**
 * 📊 Fonction pour charger le graphique des activités les plus populaires
 */
window.chartActivitesPopulaires = null;

async function chargerGraphiqueActivitesPopulaires() {
    console.log("📊 Chargement du graphique : Activités les Plus Populaires...");

    try {
        const response = await fetch("http://localhost:3000/NeigeEtSoleil_V4/stats/activites-populaires");
        if (!response.ok) throw new Error("Erreur lors du chargement des activités populaires.");

        const data = await response.json();
        console.log("✅ Données Activités Populaires :", data);

        const activites = data.map(item => item.nom_activite);
        const nombreReservations = data.map(item => item.nombre_reservations);

        const ctx = document.getElementById("chartActivitesPopulaires").getContext("2d");

        // Vérification et destruction du graphique s'il existe déjà
        if (window.chartActivitesPopulaires) {
            window.chartActivitesPopulaires.destroy();
        }

        // Création du nouveau graphique
        window.chartActivitesPopulaires = new Chart(ctx, {
            type: "bar",
            data: {
                labels: activites,
                datasets: [{
                    label: "Nombre de Réservations",
                    data: nombreReservations,
                    backgroundColor: "rgba(75, 192, 192, 0.6)",
                    borderColor: "rgba(75, 192, 192, 1)",
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        beginAtZero: true
                    }
                }
            }
        });

    } catch (error) {
        console.error("❌ Erreur :", error);
        alert("Erreur lors du chargement du graphique des activités populaires.");
    }
}


/**
 * 📋 Fonction pour charger le tableau des Top 5 Clients
 */
async function chargerTableauTopClients() {
    console.log("📋 Chargement du tableau : Top 5 des Clients...");

    try {
        const response = await fetch("http://localhost:3000/NeigeEtSoleil_V4/stats/top-clients/5");
        if (!response.ok) throw new Error("Erreur lors du chargement du Top 5 des clients.");

        const data = await response.json();
        console.log("✅ Données Top Clients :", data);

        const tbody = document.getElementById("topClients");
        tbody.innerHTML = data.map((client, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${client.nom_client || "N/A"}</td>
            <td>${client.prenom_client || "N/A"}</td>
            <td>${client.email_client || "N/A"}</td>
            <td>${client.nombre_reservations || 0}</td>
        </tr>
    `).join("");
    


    } catch (error) {
        console.error("❌ Erreur :", error);
        alert("Erreur lors du chargement du tableau des Top Clients.");
    }
}
  