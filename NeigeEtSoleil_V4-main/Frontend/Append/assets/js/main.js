(function () {
  "use strict";

  console.log("🟢 Début d'exécution main.js");

  // ***************** INITIALISATION DES EFFETS GLOBAUX ***************** //

  /**
   * 🌐 Effets de scroll : Applique la classe `.scrolled` sur le body
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
   * 🆙 Initialisation du bouton scroll-top
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
    }

    window.addEventListener("load", toggleScrollTop);
    document.addEventListener("scroll", toggleScrollTop);
  }

  /**
   * ⏳ Gestion du preloader
   */
  function initPreloader() {
    const preloader = document.querySelector("#preloader");
    if (preloader) {
      window.addEventListener("load", () => preloader.remove());
    }
  }

  /**
   * 📱 Menu mobile
   */
  function initMobileNav() {
    const mobileNavToggleBtn = document.querySelector(".mobile-nav-toggle");
    if (mobileNavToggleBtn) {
      mobileNavToggleBtn.addEventListener("click", () => {
        document.querySelector("body").classList.toggle("mobile-nav-active");
        mobileNavToggleBtn.classList.toggle("bi-list");
        mobileNavToggleBtn.classList.toggle("bi-x");
      });
    }
  }

  /**
   * ✨ Initialisation des animations AOS
   */
  function initAOS() {
    if (typeof AOS !== "undefined") {
      AOS.init({ duration: 600, easing: "ease-in-out", once: true, mirror: false });
    }
  }

  /**
   * 💡 Gestion de GLightbox
   */
  function initGlightbox() {
    if (typeof GLightbox !== "undefined") {
      GLightbox({ selector: ".glightbox" });
    }
  }

  /**
   * 📊 Initialisation de PureCounter
   */
  function initPureCounter() {
    if (typeof PureCounter !== "undefined") {
      new PureCounter();
    }
  }

  /**
   * 📸 Gestion des sliders Swiper
   */
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach((swiperElement) => {
      try {
        let config = JSON.parse(swiperElement.querySelector(".swiper-config").innerHTML.trim());
        new Swiper(swiperElement, config);
      } catch (error) {
        console.error("Erreur lors de l'initialisation de Swiper :", error);
      }
    });
  }

  /**
   * 🛠️ Appel de toutes les fonctions globales
   */
  function initializeGlobals() {
    console.log("🌐 Initialisation des fonctions globales...");
    initScrollEffects();
    initScrollTop();
    initPreloader();
    initMobileNav();
    initAOS();
    initGlightbox();
    initPureCounter();
    initSwiper();
  }

  // ***************** INITIALISATION DES PAGES ***************** //

  /**
   * 📄 Détection et initialisation de la page
   */
  function initializePageScripts() {
    const page = window.location.pathname;
    console.log("🚀 Initialisation de la page :", page);

    if (page.includes("index.html")) {
      handleIndexPage();
    } else if (page.includes("add-habitation.html")) {
      handleAddHabitationPage();
    } else if (page.includes("inscription.html")) {
      handleInscriptionPage();
    } else if (page.includes("activites.html")) {
      handleActivitesPage();
    } else if (page.includes("disponibilites.html")) {
      handleDisponibilitesPage();
    } else {
      console.warn("Aucune correspondance trouvée pour l'initialisation.");
    }
  }

  // ***************** ÉCOUTEURS PRINCIPAUX ***************** //

  console.log("🔍 Ajout de l'écouteur DOMContentLoaded...");
  document.addEventListener("DOMContentLoaded", () => {
    initializeGlobals();
    initializePageScripts();
  });

})();
/**
 * 🏠 Gestion de la page index.html
 */
function handleIndexPage() {
  console.log("📌 handleIndexPage est bien exécutée !");
  
  const formLogin = document.getElementById("formLogin");
  const welcomeMessage = document.querySelector("#welcomeMessage");
  const btnSeConnecter = document.getElementById("btnSeConnecter");
  const btnSInscrire = document.getElementById("btnSInscrire");

  // 🔑 Gestion du formulaire de connexion
  if (formLogin) {
    formLogin.addEventListener("submit", async (e) => {
      e.preventDefault();
      const loginData = {
        email: document.getElementById("loginEmail").value,
        mot_de_passe: document.getElementById("loginPassword").value,
      };

      try {
        const response = await fetch("http://localhost:3000/NeigeEtSoleil_V4/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(loginData),
        });

        if (!response.ok) throw new Error(`Erreur : ${response.statusText}`);
        const data = await response.json();

        if (data.utilisateur) {
          alert(`Bienvenue ${data.utilisateur.nom} ${data.utilisateur.prenom} !`);
          localStorage.setItem("user", JSON.stringify(data.utilisateur));
          localStorage.setItem("userRole", data.utilisateur.role);
          updateAuthButtons(true); // Mise à jour des boutons après connexion
          window.location.href = "index.html";
          console.log("✅ DEBUG après login : utilisateur sauvegardé →", data.utilisateur);

        } else {
          throw new Error("Utilisateur non trouvé");
        }
      } catch (error) {
        console.error("❌ Erreur lors de la connexion :", error);
        alert("Email ou mot de passe incorrect !");
      }
    });
  }

  // 📢 Message de bienvenue pour l'utilisateur connecté
  if (welcomeMessage) {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      welcomeMessage.innerHTML = `Bienvenue chez Neige et Soleil, ${user.nom} ${user.prenom}`;
    }
  }

  // 🔄 Mise à jour des boutons connexion/déconnexion
  function updateAuthButtons(isLoggedIn) {
    if (isLoggedIn) {
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
  }

  // Initialisation des boutons en fonction de l'état de connexion
  const user = JSON.parse(localStorage.getItem("user"));
  updateAuthButtons(!!user);

  // 🔗 Redirection selon le rôle utilisateur pour le lien "Logements"
  const locationLogementsDiv = document.getElementById("location-logements");
  if (locationLogementsDiv) {
    const stretchedLink = locationLogementsDiv.querySelector(".stretched-link");
    if (stretchedLink) {
      stretchedLink.addEventListener("click", (e) => {
        e.preventDefault();
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) {
          alert("Vous devez être connecté pour accéder à cette fonctionnalité.");
          return;
        }

        switch (user.role) {
          case "proprietaire":
            window.location.href = "add-habitation.html";
            break;
          case "client":
            window.location.href = "disponibilites.html";
            break;
          case "admin":
            window.location.href = "logements_admin.html";
            break;
          default:
            alert("Rôle utilisateur inconnu !");
        }
      });
    }
  }

const guidesTouristiquesLink = document.getElementById("guidesTouristiquesLink");
if (guidesTouristiquesLink) {
    guidesTouristiquesLink.addEventListener("click", (e) => {
        e.preventDefault();
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) {
            alert("Vous devez être connecté pour accéder à cette fonctionnalité.");
            return;
        }

        if (user.role === "client" || user.role === "proprietaire") {
            window.location.href = "services-details.html";
        } else if (user.role === "admin") {
            window.location.href = "gestion_reservations.html";
        } else {
            alert("Rôle utilisateur inconnu !");
        }
    });
}

const assistanceLink = document.getElementById("assistanceLink");
if (assistanceLink) {
    assistanceLink.addEventListener("click", (e) => {
        e.preventDefault();
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) {
            alert("Vous devez être connecté pour accéder à cette fonctionnalité.");
            return;
        }

        if (user.role === "client" || user.role === "proprietaire") {
            window.location.replace("index.html#contact");
        } else if (user.role === "admin") {
            window.location.href = "dashboard.html";
        } else {
            alert("Rôle utilisateur inconnu !");
        }
    });
}



  // 🎯 Gestion du lien "Activités" : Redirection selon le rôle
  const activitesLink = document.getElementById("activitesLink");
  if (activitesLink) {
    const user = JSON.parse(localStorage.getItem("user"));
    const userRole = user ? user.role : null;
    activitesLink.setAttribute("href", userRole === "admin" ? "activites_admin.html" : "activites.html");
  }
}

/**
 * 🏢 Gestion de la page add-habitation.html
 */
function handleAddHabitationPage() {
  console.log("👐 handleAddHabitationPage() est exécutée");

  /**
 * 📌 Fonction pour récupérer et afficher les logements du propriétaire connecté
 */
async function fetchAndDisplayLogements() {
  console.log("🏠 Chargement des logements du propriétaire...");

  // Récupération de l'utilisateur depuis le localStorage
  const proprietaire = JSON.parse(localStorage.getItem("user"));

  if (!proprietaire || !proprietaire.id_utilisateur) {
    console.error("❌ Impossible de récupérer l'utilisateur connecté.");
    document.getElementById("noLogementsMessage").style.display = "block";
    return;
  }

  const idProprietaire = Number(proprietaire.id_utilisateur);
  console.log("🔍 ID du propriétaire récupéré :", idProprietaire);

  try {
    // Appel à l'API pour récupérer les logements
    const response = await fetch(`http://localhost:3000/NeigeEtSoleil_V4/logement/mes-logements/${idProprietaire}`)

    if (!response.ok) throw new Error("Erreur lors de la récupération des logements");

    const logements = await response.json();
    console.log("📥 Logements récupérés :", logements);

    const container = document.getElementById("mesLogementsContainer");
    container.innerHTML = ""; // Nettoyage du conteneur

    if (logements.length === 0) {
      document.getElementById("noLogementsMessage").style.display = "block";
      return;
    }

    document.getElementById("noLogementsMessage").style.display = "none";

    // Génération des cartes pour chaque logement
    logements.forEach(logement => {
      const logementCard = `
        <div class="col">
          <div class="card shadow-lg">
            <img src="assets/img/habitation/${logement.photo}" class="card-img-top" alt="${logement.nom_immeuble}">
            <div class="card-body">
              <h5 class="card-title">${logement.nom_immeuble}</h5>
              <p class="card-text">
                <strong>Adresse :</strong> ${logement.adresse} <br>
                <strong>Ville :</strong> ${logement.ville} <br>
                <strong>Type :</strong> ${logement.type_logement} <br>
                <strong>Capacité :</strong> ${logement.capacite_accueil} personnes <br>
                <strong>Surface :</strong> ${logement.surface_habitable} m² <br>
                <strong>Spécificité :</strong> ${logement.specifite || "Aucune"} 
              </p>
            </div>
          </div>
        </div>
      `;

      container.innerHTML += logementCard;
    });

  } catch (error) {
    console.error("❌ Erreur lors de la récupération des logements :", error);
    document.getElementById("noLogementsMessage").style.display = "block";
  }
}


  document.addEventListener("DOMContentLoaded", function () {
    console.log("🌐 DOM entièrement chargé pour add-habitation.html");

    // Récupération des données du localStorage
    const proprietaire = JSON.parse(localStorage.getItem("user"));
    console.log("🔍 Contenu du localStorage (user) :", proprietaire);

    // Vérifier si l'ID est bien présent dans le localStorage
    if (!proprietaire || !proprietaire.id_utilisateur) {
      console.error("❌ L'utilisateur dans localStorage ne contient pas 'id_utilisateur'");
      alert("Erreur : utilisateur non trouvé. Veuillez vous reconnecter.");
      localStorage.removeItem("user");
      window.location.href = "index.html";
      return;
    }

    const idProprietaire = Number(proprietaire.id_utilisateur);

    if (isNaN(idProprietaire) || idProprietaire <= 0) {
      console.error("❌ ID du propriétaire est invalide :", proprietaire.id_utilisateur);
      alert("Erreur : ID du propriétaire est invalide. Veuillez vous reconnecter.");
      localStorage.removeItem("user");
      window.location.href = "index.html";
      return;
    }

    console.log("✅ ID du propriétaire récupéré depuis localStorage :", idProprietaire);
  });

  fetchAndDisplayLogements();

  const form = document.getElementById("addHabitationForm");

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      console.log("📤 Soumission du formulaire de logement");

      // Récupération correcte de l'ID du propriétaire DIRECTEMENT depuis localStorage
      const proprietaire = JSON.parse(localStorage.getItem("user"));
      const idProprietaire = Number(proprietaire?.id_utilisateur);

      if (isNaN(idProprietaire) || idProprietaire <= 0) {
        alert("Erreur : ID du propriétaire non valide. Veuillez vous reconnecter.");
        return;
      }

      console.log("🎯 ID récupéré pour soumission :", idProprietaire);

      // Création de FormData sans compter sur l'input hidden
      const formData = new FormData();
      formData.append("idProprietaire", idProprietaire);
      formData.append("nomImmeuble", document.getElementById("nomImmeuble").value);
      formData.append("adresse", document.getElementById("adresse").value);
      formData.append("codePostal", document.getElementById("codePostal").value);
      formData.append("ville", document.getElementById("ville").value);
      formData.append("typeLogement", document.getElementById("typeLogement").value);
      formData.append("surfaceHabitable", document.getElementById("surfaceHabitable").value);
      formData.append("capaciteAccueil", document.getElementById("capaciteAccueil").value);
      formData.append("specifite", document.getElementById("specifite").value);

      // Vérifier et ajouter le fichier photo
      const photoFile = document.getElementById("photo").files[0];
      if (photoFile) {
        formData.append("photo", photoFile);
        console.log("📸 Photo ajoutée :", photoFile.name);
      } else {
        console.warn("⚠️ Aucune photo ajoutée !");
      }

      // Log des valeurs envoyées pour debug
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      try {
        const response = await fetch("http://localhost:3000/NeigeEtSoleil_V4/logement", {
          method: "POST",
          body: formData,
        });

        const responseText = await response.text();
        console.log("📥 Réponse brute du serveur :", responseText);

        if (!response.ok) {
          throw new Error(responseText || "Erreur lors de l'ajout du logement");
        }

        const data = JSON.parse(responseText);
        console.log("✅ Réponse du serveur :", data);

        alert("Logement ajouté avec succès !");
        form.reset();

        fetchAndDisplayLogements(); // ✅ Rafraîchir la liste des logements après l'ajout
      } catch (error) {
        console.error("❌ Erreur lors de l'ajout du logement :", error.message);
        alert(`Erreur lors de l'ajout du logement : ${error.message}`);
      }
    });
  } else {
    console.warn("⚠️ Aucun formulaire 'addHabitationForm' trouvé !");
  }
}




/**
 * 📅 Gestion de la page disponibilites.html
 */
function handleDisponibilitesPage() {
  console.log("📌 handleDisponibilitesPage() est bien exécutée !");

  const searchForm = document.getElementById("searchForm");
  const resultsContainer = document.getElementById("results");
  const btnMesReservations = document.getElementById("btnMesReservations");
  const reservationsContainer = document.getElementById("reservationsContainer");

  if (!searchForm || !resultsContainer || !btnMesReservations || !reservationsContainer) {
    console.error("❌ Un ou plusieurs éléments nécessaires ne sont pas trouvés !");
    return;
  }

  // 🔍 Gestion de la recherche de logements
  searchForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    console.log("📤 Formulaire de recherche soumis");

    const searchParams = {
      ville: document.getElementById("ville").value.trim(),
      dateDebut: document.getElementById("dateDebut").value,
      dateFin: document.getElementById("dateFin").value,
      prixMin: document.getElementById("prixMin").value,
      prixMax: document.getElementById("prixMax").value,
      capaciteAccueil: document.getElementById("capaciteAccueil").value,
      type_logement: document.getElementById("type_logement").value,
    };

    try {
      const queryParams = new URLSearchParams(
        Object.entries(searchParams).filter(([_, value]) => value !== "")
      ).toString();
      const url = `http://localhost:3000/NeigeEtSoleil_V4/disponibilites/disponibles?${queryParams}`;

      console.log("📡 Requête envoyée à :", url);
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Erreur API : ${response.statusText}`);

      const logements = await response.json();
      displayResults(logements);
    } catch (error) {
      console.error("❌ Erreur lors de la recherche :", error);
      resultsContainer.innerHTML = `<div class="alert alert-danger text-center">
        Une erreur est survenue lors de la recherche : ${error.message}
      </div>`;
    }
  });

  /**
   * 🏠 Affichage des résultats de recherche
   */
  function displayResults(logements) {
    console.log("🔍 Logements reçus :", logements);

    if (logements.length === 0) {
      resultsContainer.innerHTML = `<div class="alert alert-warning text-center">
        Aucun logement disponible pour les critères sélectionnés.
      </div>`;
      return;
    }

    resultsContainer.innerHTML = logements.map((logement) => createLogementCard(logement)).join("");

    // Gestion des boutons "Réserver"
    document.querySelectorAll(".reserver-btn").forEach((btn) => {
      btn.addEventListener("click", handleReservation);
    });
}

function createLogementCard(logement) {
  const imageSrc = logement.photo?.trim() !== "" 
    ? `http://localhost:3000/assets/img/habitation/${logement.photo}` 
    : "http://localhost:3000/assets/img/habitation/default.jpg";

  const saisonsHTML = logement.saisons.map(saison => `
      <li>${saison.jours} jours en ${saison.saison} (Prix: ${saison.prix_par_nuit}€/nuit)</li>
  `).join("");

  return `
    <div class="card mb-3">
      <div class="row g-0">
        <div class="col-md-4">
          <img src="${imageSrc}" class="img-fluid rounded-start" alt="${logement.nom_immeuble}">
        </div>
        <div class="col-md-8">
          <div class="card-body">
            <h5 class="card-title">${logement.nom_immeuble}</h5>
            <p class="card-text">
              <strong>Adresse :</strong> ${logement.adresse}<br>
              <strong>Ville :</strong> ${logement.ville}<br>
              <strong>Type :</strong> ${logement.type_logement}<br>
              <strong>Prix Total :</strong> ${logement.prix_total} €<br>
              <strong>Répartition des saisons :</strong>
              <ul>${saisonsHTML}</ul>
            </p>
            <button class="btn btn-success reserver-btn" data-id-logement="${logement.id_logement}" data-prix="${logement.prix_total}">Réserver</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

  
  /**
   * 🛏️ Gestion de la réservation via modal
   */
  function handleReservation(event) {
    const idLogement = event.target.dataset.idLogement;
    const prixParJour = parseFloat(event.target.dataset.prix);
  
    if (isNaN(prixParJour) || prixParJour <= 0) {
      alert("Le prix par jour est incorrect ou manquant.");
      return;
    }
  
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      alert("Vous devez être connecté pour effectuer une réservation !");
      return;
    }
  
    document.getElementById("modalNom").value = user.nom || "";
    document.getElementById("modalPrenom").value = user.prenom || "";
    document.getElementById("modalEmail").value = user.email || "";
    document.getElementById("modalLogementId").value = idLogement;
  
    const dateDebut = document.getElementById("dateDebut").value;
    const dateFin = document.getElementById("dateFin").value;
    document.getElementById("modalDateDebut").value = dateDebut || "";
    document.getElementById("modalDateFin").value = dateFin || "";
  
    calculateTotalPrice(dateDebut, dateFin, prixParJour);
  
    const reservationModal = new bootstrap.Modal(document.getElementById("reservationModal"));
    reservationModal.show();
  
    const reservationForm = document.getElementById("reservationForm");
    reservationForm.onsubmit = async (submitEvent) => {
      submitEvent.preventDefault();
      if (!document.getElementById("modalDateDebut").value || !document.getElementById("modalDateFin").value) {
        alert("Veuillez renseigner les dates de début et de fin !");
        return;
      }
      await confirmReservation(user, idLogement, reservationModal);
    };
  }
  
  function calculateTotalPrice(dateDebut, dateFin, prixParJour) {
    const prixTotalInput = document.getElementById("prixTotal");
  
    if (!prixTotalInput) {
      console.error("❌ L'élément avec l'ID 'prixTotal' est introuvable.");
      return;
    }
  
    if (dateDebut && dateFin) {
      const startDate = new Date(dateDebut);
      const endDate = new Date(dateFin);
  
      if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime()) && endDate >= startDate) {
        const nbJours = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;  // Inclure le jour de début
        const prixTotal = nbJours * prixParJour;
        prixTotalInput.value = `${prixTotal.toFixed(2)} €`;
      } else {
        prixTotalInput.value = "Dates invalides";
      }
    } else {
      prixTotalInput.value = "Erreur dans les dates";
    }
  }
  
  
  /**
   * 🛡️ Confirmation de la réservation
   */
  async function confirmReservation(user, idLogement, reservationModal) {
    const dateDebut = document.getElementById("modalDateDebut").value;
    const dateFin = document.getElementById("modalDateFin").value;

    const reservationData = {
      id_utilisateur: user.id_utilisateur,
      id_logement: idLogement,
      date_debut: dateDebut,
      date_fin: dateFin,
    };

    try {
      const response = await fetch("http://localhost:3000/NeigeEtSoleil_V4/disponibilites/reservation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reservationData),
      });

      if (!response.ok) throw new Error("Erreur lors de la réservation.");
      alert("Réservation confirmée !");
      reservationModal.hide();
      window.location.reload();
    } catch (error) {
      console.error("❌ Erreur lors de la réservation :", error);
      alert("Impossible d'effectuer la réservation.");
    }
  }


  btnMesReservations.addEventListener("click", async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.id_utilisateur) {
      alert("Vous devez être connecté pour voir vos réservations !");
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:3000/NeigeEtSoleil_V4/disponibilites/mes-reservations/${user.id_utilisateur}`);
      if (!response.ok) throw new Error(`Erreur : ${response.statusText}`);
  
      const reservations = await response.json();
      displayReservations(reservations);
    } catch (error) {
      console.error("❌ Erreur lors de la récupération des réservations :", error);
      reservationsContainer.innerHTML = `<div class="alert alert-danger text-center">
        Une erreur est survenue lors de la récupération des réservations.
      </div>`;
    }
  });
  
  /* Voir mes reservation */
  function displayReservations(reservations) {
    if (reservations.length === 0) {
      reservationsContainer.innerHTML = `<div class="alert alert-warning text-center">
        Vous n'avez aucune réservation.
      </div>`;
      return;
    }
  
    const reservationsHTML = reservations.map((reservation) => `
      <div class="card mb-3">
        <div class="card-body">
          <h5 class="card-title">${reservation.logement_nom}</h5>
          <p class="card-text">
            <strong>Adresse :</strong> ${reservation.adresse}<br>
            <strong>Dates :</strong> Du ${new Date(reservation.date_debut).toLocaleDateString()} 
            au ${new Date(reservation.date_fin).toLocaleDateString()}<br>
            <strong>Statut :</strong> ${reservation.statut}
          </p>
        </div>
      </div>
    `).join("");
  
    reservationsContainer.innerHTML = reservationsHTML;
  }
  
}

/**
 * 🎯 Gestion de la page activites.html
 */
function handleActivitesPage() {
  console.log("📌 handleActivitesPage() est bien exécutée !");

  async function fetchAndDisplayActivites(url, container) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Erreur API : ${response.statusText}`);
      const activites = await response.json();

      if (activites.length === 0) {
        container.innerHTML = `<div class="alert alert-warning text-center">Aucune activité disponible.</div>`;
        return;
      }

      container.innerHTML = activites.map((activite) => createActiviteCard(activite)).join("");
    } catch (error) {
      console.error("❌ Erreur lors du chargement des activités :", error);
      container.innerHTML = `<div class="alert alert-danger text-center">Impossible de charger les activités.</div>`;
    }
  }

  /**
   * 🎫 Création de la carte d’activité
   */
  function createActiviteCard(activite) {
    return `
      <div class="col-md-6 col-lg-4">
        <div class="card activite-card">
          <img src="http://localhost:3000/${activite.image}" class="card-img-top">
          <div class="card-body">
            <h5 class="card-title">${activite.nom_activite}</h5>
            <button class="btn btn-info voir-details" data-id="${activite.id_activite}">Voir</button>
            <div class="activite-details" id="details-${activite.id_activite}" style="display: none;">
              <p><strong>Station :</strong> ${activite.station_nom || "Non spécifié"}</p>
              <p><strong>Prix :</strong> ${activite.prix ? activite.prix + " €" : "Non défini"}</p>
              ${activite.description ? `<p><strong>Description :</strong> ${activite.description}</p>` : ""}
            </div>
            <button class="btn btn-primary reserver-btn" data-id="${activite.id_activite}" data-prix="${activite.prix}">
              Réserver
            </button>
          </div>  
        </div>
      </div>
    `;
  }

  // 🔄 Charger les activités
  fetchAndDisplayActivites("http://localhost:3000/NeigeEtSoleil_V4/activites/sportives", document.getElementById("sportContainer"));
  fetchAndDisplayActivites("http://localhost:3000/NeigeEtSoleil_V4/activites/culturelles", document.getElementById("culturelleContainer"));
  fetchAndDisplayActivites("http://localhost:3000/NeigeEtSoleil_V4/activites/detente", document.getElementById("detenteContainer"));

  // 📋 Gestion des clics sur les boutons "Voir" et "Réserver"
  document.addEventListener("click", (event) => {
    if (event.target.classList.contains("voir-details")) handleVoirDetails(event);
    if (event.target.classList.contains("reserver-btn")) handleReservation(event);
  });

  /**
   * 📖 Voir les détails de l’activité
   */
  function handleVoirDetails(event) {
    const activiteId = event.target.dataset.id;
    const detailsDiv = document.getElementById(`details-${activiteId}`);
    if (detailsDiv) {
      detailsDiv.style.display = detailsDiv.style.display === "none" ? "block" : "none";
      event.target.textContent = detailsDiv.style.display === "none" ? "Voir" : "Masquer";
    }
  }

  /**
   * 🛏️ Gestion du modal de réservation d’activité
   */
  function handleReservation(event) {
    const idActivite = event.target.dataset.id;
    const prixParPersonne = parseFloat(event.target.dataset.prix);
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      alert("Vous devez être connecté pour réserver une activité.");
      return;
    }

    // Pré-remplir les champs du modal
    document.getElementById("reservationDate").value = "";
    document.getElementById("nombrePersonnes").value = 1;
    document.getElementById("prixParPersonne").value = prixParPersonne.toFixed(2);
    document.getElementById("prixTotal").value = prixParPersonne.toFixed(2);

    const reservationModal = new bootstrap.Modal(document.getElementById("reservationModal"));
    reservationModal.show();

    // 📊 Calcul dynamique du prix total
    document.getElementById("nombrePersonnes").addEventListener("input", (event) => {
      const nombrePersonnes = parseInt(event.target.value) || 1;
      const prixTotal = prixParPersonne * nombrePersonnes;
      document.getElementById("prixTotal").value = prixTotal.toFixed(2);
    });

    // 📩 Gestion de la soumission du formulaire
    document.getElementById("reservationForm").onsubmit = async (submitEvent) => {
      submitEvent.preventDefault();
      await confirmReservation(user, idActivite, reservationModal);
    };
  }

  /**
   * 📩 Envoi des données de réservation au backend
   */
  async function confirmReservation(user, idActivite, reservationModal) {
    const dateReservation = document.getElementById("reservationDate").value;
    const nombrePersonnes = parseInt(document.getElementById("nombrePersonnes").value);
    const prixTotal = parseFloat(document.getElementById("prixTotal").value);

    const reservationData = {
      id_utilisateur: user.id_utilisateur,
      id_activite: idActivite,
      date_reservation: dateReservation,
      nombre_personnes: nombrePersonnes,
      prix_total: prixTotal,
    };

    try {
      const response = await fetch("http://localhost:3000/NeigeEtSoleil_V4/activites/reserver", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reservationData),
      });

      if (!response.ok) throw new Error("Erreur lors de la réservation.");
      alert("Réservation effectuée avec succès !");
      reservationModal.hide();
      document.querySelectorAll(".modal-backdrop").forEach((el) => el.remove());
    } catch (error) {
      console.error("❌ Erreur lors de la réservation :", error);
      alert("Impossible d'effectuer la réservation.");
    }
  }

  async function fetchReservationsActivites(userId, container) {
    try {
      const response = await fetch(`http://localhost:3000/NeigeEtSoleil_V4/activites/mes-reservations/${userId}`);
      if (!response.ok) throw new Error(`Erreur API : ${response.statusText}`);
      const reservations = await response.json();
  
      if (reservations.length === 0) {
        container.innerHTML = `<div class="alert alert-warning text-center">Aucune réservation d'activité trouvée.</div>`;
        return;
      }
  
      container.innerHTML = reservations.map((reservation) => createReservationCard(reservation)).join("");
    } catch (error) {
      console.error("❌ Erreur lors de la récupération des réservations :", error);
      container.innerHTML = `<div class="alert alert-danger text-center">Impossible de charger les réservations.</div>`;
    }
  }
  
  function createReservationCard(reservation) {
    return `
      <div class="card mb-3">
        <div class="card-body">
          <h5 class="card-title">${reservation.nom_activite}</h5>
          <p class="card-text">
            <strong>Date :</strong> ${new Date(reservation.date_reservation).toLocaleDateString()}<br>
            <strong>Nombre de personnes :</strong> ${reservation.nombre_personnes}<br>
            <strong>Prix total :</strong> ${reservation.prix_total ? parseFloat(reservation.prix_total).toFixed(2) : "0.00"} €
          </p>
        </div>
      </div>
    `;
  }
  const reservationsContainer = document.getElementById("reservationsContainer");
  const user = JSON.parse(localStorage.getItem("user"));
  
  if (user) {
    fetchReservationsActivites(user.id_utilisateur, reservationsContainer);
  }
    
}
/**
 * ✍️ Gestion de la page inscription.html
 */
function handleInscriptionPage() {
  console.log("📌 handleInscriptionPage() est bien exécutée !");

  const formInscription = document.getElementById("formInscription");

  if (formInscription) {
    formInscription.addEventListener("submit", async (e) => {
      e.preventDefault(); // Bloque le rechargement de la page
      console.log("📤 Soumission du formulaire d'inscription");

      // Récupération des valeurs du formulaire
      const formData = {
        nom: document.getElementById("nom").value.trim(),
        prenom: document.getElementById("prenom").value.trim(),
        email: document.getElementById("email").value.trim(),
        motDePasse: document.getElementById("mot_de_passe").value.trim(),
        role: document.getElementById("role").value,
      };

      console.log("📨 Données envoyées :", formData);

      try {
        const response = await fetch("http://localhost:3000/NeigeEtSoleil_V4/inscription", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (!response.ok) throw new Error(`Erreur : ${response.statusText}`);
        const result = await response.json();
        console.log("✅ Réponse du serveur :", result);

        alert("Inscription réussie !");
        formInscription.reset(); // Réinitialise le formulaire
        window.location.reload(); // Recharge la page après l'inscription
      } catch (error) {
        console.error("❌ Erreur lors de l'inscription :", error.message);
        alert(`Erreur lors de l'inscription : ${error.message}`);
      }
    });
  } else {
    console.warn("⚠️ Aucun formulaire d'inscription trouvé !");
  }
}
