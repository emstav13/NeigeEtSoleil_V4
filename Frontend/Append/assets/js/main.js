(function () {
  "use strict";
  console.log("🟢 Début d'exécution main.js");

  /**
   * Fonction pour appliquer la classe `.scrolled` sur le body lors du défilement
   */
  function initScrollEffects() {
    const selectBody = document.querySelector("body");
    const selectHeader = document.querySelector("#header");

    function toggleScrolled() {
      if (
        !selectHeader ||
        (!selectHeader.classList.contains("scroll-up-sticky") &&
          !selectHeader.classList.contains("sticky-top") &&
          !selectHeader.classList.contains("fixed-top"))
      )
        return;

      window.scrollY > 100
        ? selectBody.classList.add("scrolled")
        : selectBody.classList.remove("scrolled");
    }

    document.addEventListener("scroll", toggleScrolled);
    window.addEventListener("load", toggleScrolled);
  }

  /**
   * Initialisation du bouton scroll-top
   */
  function initScrollTop() {
    const scrollTop = document.querySelector(".scroll-top");

    function toggleScrollTop() {
      if (!scrollTop) return;
      window.scrollY > 100
        ? scrollTop.classList.add("active")
        : scrollTop.classList.remove("active");
    }

    if (scrollTop) {
      scrollTop.addEventListener("click", (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    } else {
      console.log("Aucun bouton scroll-top trouvé sur cette page.");
    }

    window.addEventListener("load", toggleScrollTop);
    document.addEventListener("scroll", toggleScrollTop);
  }

  /**
   * Préchargement (preloader)
   */
  function initPreloader() {
    const preloader = document.querySelector("#preloader");
    if (preloader) {
      window.addEventListener("load", () => preloader.remove());
    }
  }

  /**
   * Initialisation du menu mobile
   */
  function initMobileNav() {
    const mobileNavToggleBtn = document.querySelector(".mobile-nav-toggle");

    if (mobileNavToggleBtn) {
      mobileNavToggleBtn.addEventListener("click", () => {
        document.querySelector("body").classList.toggle("mobile-nav-active");
        mobileNavToggleBtn.classList.toggle("bi-list");
        mobileNavToggleBtn.classList.toggle("bi-x");
      });
    } else {
      console.log("Aucun bouton mobile-nav-toggle trouvé sur cette page.");
    }
  }

  /**
   * Initialisation des animations AOS
   */
  function initAOS() {
    if (typeof AOS !== "undefined") {
      AOS.init({
        duration: 600,
        easing: "ease-in-out",
        once: true,
        mirror: false,
      });
    } else {
      console.error("AOS n'est pas chargé !");
    }
  }

  /**
   * Initialisation de GLightbox
   */
  function initGlightbox() {
    if (typeof GLightbox !== "undefined") {
        GLightbox({ selector: ".glightbox" });
        console.log("✅ GLightbox initialisé avec succès !");
    } else {
        console.warn("⚠️ GLightbox n'est pas chargé !");
    }
}
console.log("🟢 exécution main.js lignes 110");
  /**
   * Initialisation de PureCounter
   */
  function initPureCounter() {
    if (typeof PureCounter !== "undefined") {
        new PureCounter();
        console.log("✅ PureCounter initialisé avec succès !");
    } else {
        console.warn("⚠️ PureCounter n'est pas chargé !");
    }
}

  // Swiper sliders
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function (swiperElement) {
      try {
        let config = JSON.parse(
          swiperElement.querySelector(".swiper-config").innerHTML.trim()
        );
        new Swiper(swiperElement, config);
        console.log("Swiper initialisé !");
      } catch (error) {
        console.error("Erreur lors de l'initialisation de Swiper :", error);
      }
    });
  }

  /**
   * Appel des fonctions globales
   */
  function initializeGlobals() {
    initScrollEffects();
    initScrollTop();
    initPreloader();
    initMobileNav();
    initAOS();
    initGlightbox();
    initPureCounter();
    initSwiper();
  }

  // Appel global
  document.addEventListener("DOMContentLoaded", initializeGlobals);
})();

/**********INDEX.HTML********************** */
function handleIndexPage() {
  console.log("handleIndexPage est exécutée");
  const formLogin = document.getElementById("formLogin");
  const welcomeMessage = document.querySelector("#welcomeMessage");

  if (formLogin) {
    formLogin.addEventListener("submit", (e) => {
      e.preventDefault();

      const loginData = {
        email: document.getElementById("loginEmail").value,
        mot_de_passe: document.getElementById("loginPassword").value,
      };

      fetch("http://localhost:3000/NeigeEtSoleil_V4/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      })
        .then((response) => {
          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
          return response.json();
        })
        .then((data) => {
          if (data.utilisateur) {
            alert(`Bienvenue ${data.utilisateur.nom} ${data.utilisateur.prenom} !`);
            localStorage.setItem("user", JSON.stringify(data.utilisateur));
            window.location.href = "index.html";
          } else {
            throw new Error("Utilisateur non trouvé");
          }
        })
        .catch((error) => {
          console.error("Erreur :", error.message);
          alert("Email ou mot de passe incorrect !");
        });
    });
  }

  if (welcomeMessage) {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      welcomeMessage.innerHTML = `Bienvenue chez Neige et Soleil, ${user.nom} ${user.prenom}`;
    }
  }

  const locationLogementsDiv = document.getElementById("location-logements");
if (locationLogementsDiv) {
  const stretchedLink = locationLogementsDiv.querySelector(".stretched-link");
  if (stretchedLink) {
    stretchedLink.addEventListener("click", function (e) {
      e.preventDefault();

      // Vérifie le rôle de l'utilisateur connecté
      const user = JSON.parse(localStorage.getItem("user"));
      if (user && user.role === "proprietaire") {
        window.location.href = "add-habitation.html";
      } else if (user && user.role === "client") {
        window.location.href = "disponibilites.html";
      } else {
        alert("Vous devez être connecté pour accéder à cette fonctionnalité.");
      }
    });
  } else {
    console.error("Le lien avec la classe 'stretched-link' n'a pas été trouvé dans '#location-logements'.");
  }
} else {
  console.error("L'élément avec l'ID 'location-logements' n'existe pas !");
}

}

console.log("🟢 exécution main.js lignes 229");
document.addEventListener("DOMContentLoaded", () => {
  // Vérifie si on est sur la page index.html
  if (window.location.pathname.includes("index.html")) {
    handleIndexPage();

    const btnSeConnecter = document.getElementById("btnSeConnecter");
    const btnSInscrire = document.getElementById("btnSInscrire");

    if (btnSeConnecter && btnSInscrire) {
      const user = JSON.parse(localStorage.getItem("user"));

      if (user) {
        btnSeConnecter.textContent = "Se déconnecter";
        btnSeConnecter.removeAttribute("data-bs-toggle");
        btnSeConnecter.removeAttribute("data-bs-target");
        btnSInscrire.style.display = "none";

        btnSeConnecter.addEventListener("click", (e) => {
          e.preventDefault();
          localStorage.removeItem("user");
          alert("Vous êtes déconnecté !");
          window.location.reload();
        });
      } else {
        btnSeConnecter.textContent = "Se connecter";
        btnSInscrire.style.display = "block";
      }
    } else {
      console.warn("Les boutons de connexion/inscription ne sont pas disponibles sur cette page.");
    }
  }
});


try {
  console.log("🟢 exécution main.js lignes 264");
} catch (error) {
  console.error("🔥 Erreur détectée avant la ligne 264 :", error);
}

/*********************add-habitation.html****************************** */

function handleAddHabitationPage() {
  console.log("handleAddHabitationPage est exécutée");

  document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM entièrement chargé");

    // Récupération des informations de l'utilisateur dans le localStorage
    const proprietaire = JSON.parse(localStorage.getItem("user"));
    console.log("Contenu du localStorage (user) :", proprietaire);

    const idProprietaireField = document.getElementById("idProprietaire");

    if (!idProprietaireField) {
      console.error("Le champ 'idProprietaire' est introuvable !");
      return;
    }

    if (proprietaire && proprietaire.id_utilisateur) {
      idProprietaireField.value = proprietaire.id_utilisateur; // Assigne l'ID du propriétaire
      console.log("ID du propriétaire assigné :", proprietaire.id_utilisateur);
    } else {
      alert("Erreur : utilisateur non trouvé. Veuillez vous reconnecter.");
      window.location.href = "index.html"; // Redirige vers l'index
    }
  });

  const form = document.getElementById("addHabitationForm");

  console.log("Formulaire trouvé :", form);

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      console.log("Événement 'submit' déclenché");

      // Créer un FormData pour inclure le fichier et les autres données
      const formData = new FormData();
      formData.append("idLogement", null); // Ajout explicite pour respecter le backend
      formData.append("idProprietaire", document.getElementById("idProprietaire").value);
      formData.append("nomImmeuble", document.getElementById("nomImmeuble").value.trim());
      formData.append("adresse", document.getElementById("adresse").value.trim());
      formData.append("codePostal", document.getElementById("codePostal").value.trim());
      formData.append("ville", document.getElementById("ville").value.trim());
      formData.append("typeLogement", document.getElementById("typeLogement").value.trim());
      formData.append("surfaceHabitable", document.getElementById("surfaceHabitable").value.trim());
      formData.append("capaciteAccueil", document.getElementById("capaciteAccueil").value.trim());
      formData.append("specifite", document.getElementById("specifite").value.trim());

      // Ajout de la photo
      const photoFile = document.getElementById("photo").files[0];
      if (photoFile) {
        formData.append("photo", photoFile);
        console.log("Photo ajoutée :", photoFile.name);
      } else {
        console.warn("Aucune photo ajoutée !");
      }

      // Effectuer la requête vers le backend
      fetch("http://localhost:3000/NeigeEtSoleil_V4/logement", {
        method: "POST",
        body: formData, // Utilisation de FormData pour inclure le fichier
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Erreur lors de l'ajout du logement");
          }
          return response.json();
        })
        .then((data) => {
          // Message de succès
          console.log(data.message); // Facultatif : afficher le message dans la console
          alert("Logement ajouté avec succès !");
          form.reset(); // Réinitialise le formulaire
        })
        .catch((error) => {
          console.error("Erreur :", error.message);
          alert("Erreur lors de l'ajout du logement. Veuillez réessayer !");
        });
    });
  }
  
  console.log("🟢 exécution main.js lignes 348");
/*************************inscription.html*********************************** */

function handleInscriptionPage() {
  console.log("handleInscriptionPage est exécutée");
  const formInscription = document.getElementById("formInscription");

  if (formInscription) {
    formInscription.addEventListener("submit", (e) => {
      e.preventDefault();

      const formData = {
        nom: document.getElementById("nom").value,
        prenom: document.getElementById("prenom").value,
        email: document.getElementById("email").value,
        motDePasse: document.getElementById("mot_de_passe").value,
        role: document.getElementById("role").value,
      };

      fetch("http://localhost:3000/NeigeEtSoleil_V4/inscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
        .then((response) => {
          if (!response.ok)
            throw new Error(`HTTP error! status: ${response.status}`);
          return response.json();
        })
        .then(() => {
          alert("Inscription réussie !");
          window.location.reload();
        })
        .catch((error) => {
          console.error("Erreur lors de l'inscription :", error.message);
          alert(`Une erreur est survenue : ${error.message}`);
        });
    });
  }
}
};
/****************Disponibilites************************* */

function handleDisponibilitesPage() {
  console.log("📌 handleDisponibilitesPage est exécutée");

  const searchForm = document.getElementById("searchForm");
  const resultsContainer = document.getElementById("results");
  const btnMesReservations = document.getElementById("btnMesReservations");
  const reservationsContainer = document.getElementById("reservationsContainer");

  if (!searchForm || !resultsContainer || !btnMesReservations || !reservationsContainer) {
    console.error("❌ Un ou plusieurs éléments nécessaires ne sont pas trouvés !");
    return;
  }

  // 🔍 Recherche de logements disponibles
  searchForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    console.log("📌 Formulaire soumis");

    // Récupération des valeurs du formulaire
    const searchParams = {
      ville: document.getElementById("ville").value.trim(),
      dateDebut: document.getElementById("dateDebut").value,
      dateFin: document.getElementById("dateFin").value,
      prixMin: document.getElementById("prixMin").value,
      prixMax: document.getElementById("prixMax").value,
      capaciteAccueil: document.getElementById("capaciteAccueil").value,
      type_logement: document.getElementById("type_logement").value,
    };

    console.log("🔍 Paramètres de recherche :", searchParams);

    try {
      const queryParams = new URLSearchParams(
        Object.entries(searchParams).filter(([_, value]) => value !== "")
      ).toString();
      const url = `http://localhost:3000/NeigeEtSoleil_V4/disponibilites/disponibles?${queryParams}`;

      console.log("📡 Requête envoyée à l'URL :", url);

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Erreur API : ${response.statusText}`);
      }

      const logements = await response.json();
      console.log("📥 Réponse reçue :", logements);

      displayResults(logements);
    } catch (error) {
      console.error("❌ Erreur lors de la recherche :", error.message);
      resultsContainer.innerHTML = `<div class="alert alert-danger text-center">
        Une erreur est survenue lors de la recherche : ${error.message}
      </div>`;
    }
  });

  // 🏠 Affichage des logements disponibles
  function displayResults(logements) {
    console.log("🔍 Logements reçus dans displayResults:", logements);


    if (logements.length === 0) {
      resultsContainer.innerHTML = `<div class="alert alert-warning text-center">
        Aucun logement disponible pour les critères sélectionnés.
      </div>`;
      return;
    }

    const resultsHTML = logements.map((logement) => {
      // Vérification et correction du chemin de l'image
      const imageSrc = logement.photo && logement.photo.trim() !== "" 
        ? `http://localhost:3000/assets/img/habitation/${logement.photo}`
        : "http://localhost:3000/assets/img/habitation/default.jpg";

      return `
        <div class="card mb-3">
          <div class="row g-0">
            <div class="col-md-4">
              <img src="${imageSrc}" class="img-fluid rounded-start" alt="${logement.nom_immeuble}" 
                   onerror="this.onerror=null; this.src='http://localhost:3000/assets/img/habitation/default.jpg'; console.error('❌ Image non trouvée:', this.src);">
            </div>
            <div class="col-md-8">
              <div class="card-body">
                <h5 class="card-title">${logement.nom_immeuble}</h5>
                <p class="card-text">
                  <strong>Adresse :</strong> ${logement.adresse}<br>
                  <strong>Ville :</strong> ${logement.ville}<br>
                  <strong>Type :</strong> ${logement.type_logement}<br>
                  <strong>Surface :</strong> ${logement.surface_habitable} m²<br>
                  <strong>Capacité :</strong> ${logement.capacite_accueil} personnes<br>
                  <strong>Prix :</strong> ${logement.prix !== null ? logement.prix + " €" : "Non défini"}<br>
                  <strong>Saison :</strong> ${logement.saison_nom !== null ? logement.saison_nom : "Non définie"}
                </p>
                <button class="btn btn-success reserver-btn" 
                    data-id-logement="${logement.id_logement}" 
                    data-date-debut="${document.getElementById('dateDebut').value}" 
                    data-date-fin="${document.getElementById('dateFin').value}">
                    Réserver
                </button>
              </div>
            </div>
          </div>
        </div>`;
    }).join("");

    resultsContainer.innerHTML = resultsHTML;

    // Ajout des événements pour les boutons de réservation
    document.querySelectorAll(".reserver-btn").forEach((button) => {
      button.addEventListener("click", handleReservation);
    });
  }

  // 🛒 Fonction pour gérer la réservation
  function handleReservation(event) {
    event.preventDefault();
    const button = event.target;
    const idLogement = button.getAttribute("data-id-logement");
    const dateDebut = button.getAttribute("data-date-debut");
    const dateFin = button.getAttribute("data-date-fin");

    if (!idLogement || !dateDebut || !dateFin) {
      alert("Données de réservation manquantes !");
      return;
    }

    fetch("http://localhost:3000/NeigeEtSoleil_V4/reservation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idLogement, dateDebut, dateFin }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erreur lors de la réservation.");
        }
        return response.json();
      })
      .then((data) => {
        alert("Réservation effectuée avec succès !");
        window.location.reload();
      })
      .catch((error) => {
        console.error("Erreur :", error);
        alert("Impossible d'effectuer la réservation.");
      });
  }


 
// 🛒 Récupération des réservations
if (btnMesReservations) {
  btnMesReservations.addEventListener("click", async () => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      alert("Vous devez être connecté pour voir vos réservations !");
      return;
    }

    const url = `http://localhost:3000/NeigeEtSoleil_V4/disponibilites/mes-reservations/${user.id_utilisateur}`;
    console.log("📡 URL des réservations :", url);

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des réservations.");
      }

      const reservations = await response.json();
      displayReservations(reservations);
    } catch (error) {
      console.error("❌ Erreur lors de la récupération des réservations :", error.message);
      reservationsContainer.innerHTML = `<div class="alert alert-danger text-center">
        Une erreur est survenue : ${error.message}
      </div>`;
    }
  });
} else {
  console.warn("⚠️ Le bouton btnMesReservations n'a pas été trouvé sur cette page.");
}


  // 📝 Affichage des réservations
  function displayReservations(reservations) {
    console.log("Affichage des réservations :", reservations);

    if (reservations.length === 0) {
        reservationsContainer.innerHTML = `
            <div class="alert alert-warning text-center" role="alert">
                Vous n'avez aucune réservation.
            </div>`;
        return;
    }

    const reservationsHTML = reservations
        .map((reservation) => {
            return `
                <div class="card mb-3">
                    <div class="card-body">
                        <h5 class="card-title">${reservation.logement_nom}</h5>
                        <p class="card-text">
                            <strong>Adresse :</strong> ${reservation.adresse || "Adresse non disponible"}<br>
                            <strong>Dates :</strong> Du ${new Date(reservation.date_debut).toLocaleDateString()} au ${new Date(reservation.date_fin).toLocaleDateString()}<br>
                            <strong>Statut :</strong> ${reservation.statut}
                        </p>
                        <button class="btn btn-danger annuler-btn" data-id-reservation="${reservation.id_reservation}">
                            Annuler
                        </button>
                    </div>
                </div>`;
        })
        .join("");

    reservationsContainer.innerHTML = reservationsHTML;

    // Ajouter des événements pour les boutons "Annuler"
    const annulerButtons = document.querySelectorAll(".annuler-btn");
    annulerButtons.forEach((button) => {
        button.addEventListener("click", handleCancelReservation);
    });
}


  // 🛑 Annulation de réservation
  async function handleCancelReservation(event) {
    const button = event.target;
    const idReservation = button.getAttribute("data-id-reservation");

    console.log("ID de la réservation à annuler :", idReservation);

    try {
        const response = await fetch(`http://localhost:3000/NeigeEtSoleil_V4/disponibilites/annuler-reservation/${idReservation}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" }
        });

        if (!response.ok) {
            throw new Error("Erreur lors de l'annulation.");
        }

        alert("Réservation annulée avec succès !");
        button.closest(".card").remove();
    } catch (error) {
        console.error("Erreur lors de l'annulation :", error.message);
        alert("Impossible d'annuler la réservation.");
    }
}

console.log("🟢 exécution main.js lignes 632");
}

/******************* les activités***********************/
function handleActivitesPage() {
  console.log("📌 handleActivitesPage() est bien exécutée !");
  
  async function fetchAndDisplayActivites(url, container) {
      console.log(`📡 Tentative de récupération des activités depuis ${url}...`);

      try {
          const response = await fetch(url);
          console.log(`📡 Requête envoyée vers ${url}`);

          if (!response.ok) {
              throw new Error(`Erreur API : ${response.statusText}`);
          }

          const activites = await response.json();
          console.log("📥 Réponse API reçue :", activites);

          if (activites.length === 0) {
              container.innerHTML = `<div class="alert alert-warning text-center">Aucune activité disponible.</div>`;
              return;
          }

          container.innerHTML = activites.map((activite) => `
              <div class="col-md-6 col-lg-4">
                  <div class="card">
                      <img src="http://localhost:3000/${activite.image}" class="card-img-top">
                      <div class="card-body">
                          <h5 class="card-title">${activite.nom_activite}</h5>
                          <button class="btn btn-primary reserver-btn" data-id="${activite.id_activite}">Réserver</button>
                      </div>
                  </div>
              </div>`).join("");

      } catch (error) {
          console.error("❌ Erreur lors du chargement des activités :", error);
          container.innerHTML = `<div class="alert alert-danger text-center">Impossible de charger les activités.</div>`;
      }
  }

  fetchAndDisplayActivites("http://localhost:3000/NeigeEtSoleil_V4/activites/sportives", document.getElementById("sportContainer"));
  fetchAndDisplayActivites("http://localhost:3000/NeigeEtSoleil_V4/activites/culturelles", document.getElementById("culturelleContainer"));
  fetchAndDisplayActivites("http://localhost:3000/NeigeEtSoleil_V4/activites/detente", document.getElementById("detenteContainer"));
}


console.log("🟢 exécution main.js lignes 680 tout just avant la fonction initializePageScripts");
/************************ Initialisation dynamique***************** */
function initializePageScripts() {
  const page = window.location.pathname;
  console.log("🚀 initializePageScripts() est bien appelée !");
  console.log("🌍 Page chargée :", page);  // Vérifie le chemin de la page actuelle

  if (page.includes("index.html")) {
      handleIndexPage();
      console.log("Initialisation de handleIndexPage");
  } else if (page.includes("add-habitation.html")) {
      handleAddHabitationPage();
      console.log("Initialisation de handleAddHabitationPage");
  } else if (page.includes("inscription.html")) {
      handleInscriptionPage();
      console.log("Initialisation de handleInscriptionPage");
  } else if (page.includes("activites.html")|| page.endsWith("activities.html")) {  // Vérifie si on est bien sur activites.html
      console.log("✅ Détection de activites.html, exécution de handleActivitesPage");
      handleActivitesPage();
  } else if (page.includes("disponibilites.html")){
    console.log("✅ Détection de disponibilites.html, exécution de handleActivitesPage");
    handleDisponibilitesPage();
  } 
  else {
      console.warn("Aucune correspondance trouvée pour l'initialisation.");
  }
}

console.log("🔍 Tentative d'ajout de l'écouteur DOMContentLoaded...");
document.addEventListener("DOMContentLoaded", initializePageScripts);
console.log("✅ Écouteur DOMContentLoaded ajouté !");

initializePageScripts(); // 🔥 Force l'exécution immédiate
console.log("🟢 exécution main.js lignes 709 et fin de main.js");


console.log("Appel direct de handleAddHabitationPage");
handleAddHabitationPage();