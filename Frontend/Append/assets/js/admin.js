document.addEventListener("DOMContentLoaded", () => {
    console.log("⚙️ Chargement du panneau d'administration...");
    
    // Détection automatique de la section active (logements, activités, etc.)
    const page = document.body.dataset.page;

    switch (page) {
        case "logements":
            afficherLogements();
            break;
        case "activites":
            afficherActivites();
            break;
        default:
            console.log("📌 Aucune section spécifique détectée.");
    }
});

/**
 * 📌 Fonction pour récupérer et afficher les logements
 */
async function afficherLogements() {
    console.log("🏠 Chargement des logements...");
    const tableBody = document.getElementById("logementsTable");
    const API_URL = "http://localhost:3000/NeigeEtSoleil_V4/logement/admin";

    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Erreur lors du chargement des logements.");
        const logements = await response.json();

        if (logements.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="8" class="text-center">Aucun logement disponible</td></tr>`;
            return;
        }

        tableBody.innerHTML = logements.map(logement => `
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

        document.querySelectorAll(".delete-logement").forEach(button => {
            button.addEventListener("click", async (event) => {
                const id = event.target.dataset.id;
                if (confirm("Voulez-vous vraiment supprimer ce logement ?")) {
                    await deleteLogement(id);
                }
            });
        });

        document.querySelectorAll(".edit-logement").forEach(button => {
            button.addEventListener("click", (event) => {
                const id = event.target.dataset.id;
                window.location.href = `modifier_logement.html?id=${id}`;
            });
        });

    } catch (error) {
        console.error("❌ Erreur :", error);
        tableBody.innerHTML = `<tr><td colspan="8" class="text-center text-danger">Impossible de charger les logements.</td></tr>`;
    }
}

/**
 * ❌ Fonction pour supprimer un logement
 */
async function deleteLogement(id) {
    try {
        const response = await fetch(`http://localhost:3000/NeigeEtSoleil_V4/logement/${id}`, {
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
 * 🎭 Fonction pour afficher et gérer les activités
 */
async function afficherActivites() {
    console.log("🎭 Chargement des activités...");
    // (Tu pourras ajouter ici les fonctionnalités pour les activités)
}
