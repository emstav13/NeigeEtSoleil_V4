(function () {
  "use strict";

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
    } else {
      console.error("GLightbox n'est pas chargé !");
    }
  }

  /**
   * Initialisation de PureCounter
   */
  function initPureCounter() {
    try {
      new PureCounter();
      console.log("PureCounter initialisé avec succès !");
    } catch (error) {
      console.error("Erreur lors de l'initialisation de PureCounter :", error);
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


console.log("main.js chargé")
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
/****************Disponibilites************************* */

function handleDisponibilitesPage() {
  console.log("handleDisponibilitesPage est exécutée");

  const searchForm = document.getElementById("searchForm");
  const resultsContainer = document.getElementById("results");

  if (!searchForm || !resultsContainer) {
      console.error("Formulaire ou conteneur de résultats introuvable !");
      return;
  }

  searchForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      console.log("Formulaire soumis");

      // Récupération des valeurs des champs du formulaire
      const searchParams = {
          ville: document.getElementById("ville").value.trim(),
          dateDebut: document.getElementById("dateDebut").value,
          dateFin: document.getElementById("dateFin").value,
          prixMin: document.getElementById("prixMin").value,
          prixMax: document.getElementById("prixMax").value,
          capaciteAccueil: document.getElementById("capaciteAccueil").value,
          type_logement: document.getElementById("type_logement").value,
      };

      console.log("Paramètres de recherche :", searchParams);

      try {
          // Construction de l'URL avec les paramètres
          const queryParams = new URLSearchParams(
              Object.entries(searchParams).filter(([_, value]) => value !== "")
          ).toString();
          const url = `http://localhost:3000/NeigeEtSoleil_V4/disponibilites/disponibles?${queryParams}`;

          console.log("Requête envoyée à l'URL :", url);

          // Appel API
          const response = await fetch(url);
          if (!response.ok) {
              throw new Error(`Erreur API : ${response.statusText}`);
          }

          const logements = await response.json();
          console.log("Réponse reçue :", logements);

          // Affichage des résultats
          displayResults(logements);
      } catch (error) {
          console.error("Erreur lors de la recherche :", error.message);
          resultsContainer.innerHTML = `
              <div class="alert alert-danger text-center" role="alert">
                  Une erreur est survenue lors de la recherche : ${error.message}
              </div>`;
      }
  });

  function displayResults(logements) {
      console.log("Affichage des résultats :", logements);

      if (logements.length === 0) {
          resultsContainer.innerHTML = `
              <div class="alert alert-warning text-center" role="alert">
                  Aucun logement disponible pour les critères sélectionnés.
              </div>`;
          return;
      }

      const resultsHTML = logements
          .map((logement) => {
              return `
                  <div class="card mb-3">
                      <div class="row g-0">
                          <div class="col-md-4">
                              <img src="${logement.photo || 'https://via.placeholder.com/150'}" class="img-fluid rounded-start" alt="${logement.nom_immeuble}">
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
                                      <strong>Spécificités :</strong> ${logement.specifite || 'N/A'}<br>
                                      <strong>Prix :</strong> ${logement.prix} €<br>
                                      <strong>Saison :</strong> ${logement.saison_nom}
                                  </p>
                              </div>
                          </div>
                      </div>
                  </div>`;
          })
          .join("");

      resultsContainer.innerHTML = resultsHTML;
  }
}

/************************ Initialisation dynamique***************** */
function initializePageScripts() {
  const page = window.location.pathname;

  if (page.includes("index.html")) {
    handleIndexPage();
    console.log("Initialisation de handleIndexPage");
  } else if (page.includes("add-habitation.html")) {
    console.log("Initialisation de handleAddHabitationPage"); 
    handleAddHabitationPage();
  } else if (page.includes("inscription.html")) {
    handleInscriptionPage();
    console.log("Initialisation de handleInscriptionPage");
  }else if (page.includes("disponibilites.html")) {
    console.log("Initialisation de handleDisponibilitesPage détectée");
    handleDisponibilitesPage();
}
}

document.addEventListener("DOMContentLoaded", initializePageScripts);
console.log("Le DOM est complètement chargé");  
}
console.log("Appel direct de handleAddHabitationPage");
handleAddHabitationPage();
