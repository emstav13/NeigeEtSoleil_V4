<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Détails de la Location | Snowly</title>
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        body {
            font-family: 'Poppins', sans-serif;
            background-color: #f8f9fa;
            color: #333;
        }

        .navbar, .footer, .btn-primary {
            /* Réutilisation des styles donnés */
        }
        .details-section {
            padding: 4rem 0;
        }
        .details-image {
            border-radius: 15px;
            object-fit: cover;
            width: 100%;
            max-height: 500px;
        }
        .details-card {
            border-radius: 15px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            padding: 2rem;
            background-color: #fff;
        }
        .btn-book {
            background-color: #ff385c;
            border-radius: 8px;
            padding: 10px 20px;
            color: #fff;
            text-decoration: none;
            font-weight: bold;
        }
        .btn-book:hover {
            background-color: #e0314d;
        }
    </style>
</head>
<body>


<?php
// Connexion à la base de données
//$conn = new mysqli("localhost", "root", "root", "ns");
$conn = new mysqli("localhost", "root", "root", "ns");

// Vérifier la connexion
if ($conn->connect_error) {
    die("Erreur de connexion : " . $conn->connect_error);
}

// Récupérer l'ID de l'appartement depuis l'URL
$apartmentId = isset($_GET['id']) ? intval($_GET['id']) : 1;

// Vérifier si l'ID est valide
if ($apartmentId <= 0) {
    echo "<p>Appartement introuvable.</p>";
    exit();
}

// Requête pour récupérer les informations principales de l'appartement
$sql_apartment = "SELECT * FROM appartement 
                  LEFT JOIN image ON appartement.idImage = image.idImage
                  WHERE appartement.ID_Appartement = ?";
$stmt_apartment = $conn->prepare($sql_apartment);
$stmt_apartment->bind_param("i", $apartmentId);
$stmt_apartment->execute();
$result_apartment = $stmt_apartment->get_result();

if ($result_apartment->num_rows > 0) {
    $apartment = $result_apartment->fetch_assoc();
} else {
    echo "<p>Aucun appartement trouvé avec cet ID.</p>";
    exit();
}

// Requête pour récupérer toutes les images associées à l'appartement
$sql_images = "SELECT image FROM image WHERE ID_Appartement = ?";
$stmt_images = $conn->prepare($sql_images);
$stmt_images->bind_param("i", $apartmentId);
$stmt_images->execute();
$result_images = $stmt_images->get_result();

$images = [];
while ($row = $result_images->fetch_assoc()) {
    $images[] = $row['image'];
}
$startDate = isset($_GET['checkin']) ? $conn->real_escape_string($_GET['checkin']) : '';
$endDate = isset($_GET['checkout']) ? $conn->real_escape_string($_GET['checkout']) : '';

$stmt_apartment->close();
$stmt_images->close();
$conn->close();
?>

<!-- Details Section -->
<section class="details-section">
    <div class="container">
        <div class="row g-4">
            <!-- Image Carousel -->
            <div class="col-md-6">
                <div id="apartmentCarousel" class="carousel slide" data-bs-ride="carousel">
                    <!-- Carousel images -->
                    <div class="carousel-inner">
                        <?php foreach ($images as $index => $image): ?>
                            <div class="carousel-item <?php echo $index === 0 ? 'active' : ''; ?>">
                                <img src="<?php echo htmlspecialchars($image); ?>" 
                                     alt="Appartement image <?php echo $index + 1; ?>" 
                                     class="d-block w-100 carousel-main-image">
                            </div>
                        <?php endforeach; ?>
                    </div>
                    <!-- Carousel controls -->
                    <button class="carousel-control-prev" type="button" data-bs-target="#apartmentCarousel" data-bs-slide="prev">
                        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span class="visually-hidden">Previous</span>
                    </button>
                    <button class="carousel-control-next" type="button" data-bs-target="#apartmentCarousel" data-bs-slide="next">
                        <span class="carousel-control-next-icon" aria-hidden="true"></span>
                        <span class="visually-hidden">Next</span>
                    </button>
                </div>
<!-- Image Thumbnails with Arrows -->
<div class="thumbnail-container-wrapper position-relative">
    <button class="thumbnail-nav left-arrow" aria-label="Scroll left">
        &#9664; <!-- Flèche gauche -->
    </button>
    <div class="thumbnail-container">
        <div class="thumbnails">
            <?php foreach ($images as $index => $image): ?>
                <img src="<?php echo htmlspecialchars($image); ?>" 
                     alt="Miniature image <?php echo $index + 1; ?>" 
                     class="img-thumbnail thumbnail-image"
                     data-bs-target="#apartmentCarousel"
                     data-bs-slide-to="<?php echo $index; ?>">
            <?php endforeach; ?>
        </div>
    </div>
    <button class="thumbnail-nav right-arrow" aria-label="Scroll right">
        &#9654; <!-- Flèche droite -->
    </button>
</div>

            </div>

            <!-- Apartment Details -->
            <div class="col-md-6">
                <div class="details-card">
                    <h1><?php echo htmlspecialchars($apartment['Nom_Immeuble']); ?></h1>
                    <p><strong>Prix :</strong> <span class="text-danger fw-bold"><?php echo htmlspecialchars($apartment['Tarif']); ?>€ / nuit</span></p>
                    <p><strong>Capacité :</strong> <?php echo htmlspecialchars($apartment['Capacite_Accueil']); ?> personnes</p>
                    <p><strong>Adresse :</strong> <?php echo htmlspecialchars($apartment['Adresse']) . ' ' . htmlspecialchars($apartment['CP']); ?></p>
                    <a href="index.php?page=4&id=<?php echo $apartment['ID_Appartement']; ?>&checkin=<?= htmlspecialchars($startDate) ?>&checkout=<?= htmlspecialchars($endDate) ?>" class="btn btn-primary btn-book">Réserver maintenant</a>
                </div>
            </div>
        </div>
    </div>
</section>

<style>
/* Taille fixe pour le carousel */
.carousel-main-image {
    height: 400px;
    object-fit: contain;
    border-radius: 8px;
}

/* Miniatures */
.thumbnail-image {
    height: 75px;
    object-fit: cover;
    cursor: pointer;
    border: 2px solid transparent;
    border-radius: 8px;
    transition: border-color 0.3s;
}

.thumbnail-image:hover {
    border-color: #007bff;
}

/* Style de la carte des détails */
.details-card {
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 8px;
    background-color: #f9f9f9;
}
/* Conteneur défilable pour les miniatures */
.thumbnail-container {
    overflow-x: auto; /* Permet le défilement horizontal */
    white-space: nowrap; /* Garde les éléments sur une seule ligne */
    padding: 10px 0;
    border-top: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
}

/* Miniatures défilables */
.thumbnails {
    display: inline-flex; /* Les miniatures sont alignées horizontalement */
    gap: 10px; /* Espacement entre les miniatures */
}

.thumbnail-image {
    height: 75px;
    width: 75px; /* Taille uniforme des miniatures */
    object-fit: cover;
    cursor: pointer;
    border: 2px solid transparent;
    border-radius: 8px;
    transition: border-color 0.3s;
}

.thumbnail-image:hover {
    border-color: #007bff;
}

/* Cache le scroll-bar sur certains navigateurs */
.thumbnail-container::-webkit-scrollbar {
    display: none;
}

.thumbnail-container {
    -ms-overflow-style: none; /* IE */
    scrollbar-width: none; /* Firefox */
}
/* Wrapper pour positionner les flèches */
.thumbnail-container-wrapper {
    display: flex;
    align-items: center;
    position: relative;
}

/* Conteneur défilable pour les miniatures */
.thumbnail-container {
    overflow-x: auto;
    white-space: nowrap;
    padding: 10px 0;
    border-top: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
    flex-grow: 1; /* Prend tout l'espace entre les flèches */
    scroll-behavior: smooth; /* Défilement fluide */
}

/* Miniatures défilables */
.thumbnails {
    display: inline-flex;
    gap: 10px;
}

.thumbnail-image {
    height: 75px;
    width: 75px;
    object-fit: cover;
    cursor: pointer;
    border: 2px solid transparent;
    border-radius: 8px;
    transition: border-color 0.3s;
}

.thumbnail-image:hover {
    border-color: #007bff;
}

/* Cache le scroll-bar sur certains navigateurs */
.thumbnail-container::-webkit-scrollbar {
    display: none;
}

.thumbnail-container {
    -ms-overflow-style: none; /* IE */
    scrollbar-width: none; /* Firefox */
}

/* Flèches de navigation */
.thumbnail-nav {
    background-color: #fff;
    border: 1px solid #ddd;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    position: relative;
    z-index: 1;
    font-size: 18px;
    transition: background-color 0.3s;
}

.thumbnail-nav:hover {
    background-color: #007bff;
    color: #fff;
}

/* Positionnement des flèches */
.left-arrow {
    margin-right: 10px;
}

.right-arrow {
    margin-left: 10px;
}

</style>


<!-- Footer -->
<footer class="footer">
    <p>© 2024 Snowly | <a href="#">Mentions légales</a></p>
</footer>

<!-- Bootstrap JS -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/js/bootstrap.bundle.min.js"></script>
<script>
    // Rendre le défilement fluide pour les miniatures
    document.querySelector('.thumbnail-container').addEventListener('wheel', (event) => {
        event.preventDefault();
        const container = event.currentTarget;
        container.scrollLeft += event.deltaY;
    });
</script>
<script>
    // Gestion des flèches pour le défilement
    document.querySelector('.left-arrow').addEventListener('click', () => {
        const container = document.querySelector('.thumbnail-container');
        container.scrollLeft -= 100; // Défiler vers la gauche
    });

    document.querySelector('.right-arrow').addEventListener('click', () => {
        const container = document.querySelector('.thumbnail-container');
        container.scrollLeft += 100; // Défiler vers la droite
    });
</script>


</body>
</html>
