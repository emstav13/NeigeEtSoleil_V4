package controleur;

import java.io.IOException;
import modele.Modele;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@jakarta.servlet.annotation.WebServlet("/inscription") // URL pour accéder au servlet
public class InscriptionServlet extends jakarta.servlet.http.HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        // Lire les paramètres envoyés dans la requête
        String nom = request.getParameter("nom");
        String prenom = request.getParameter("prenom");
        String email = request.getParameter("email");
        String motDePasse = request.getParameter("mot_de_passe");
        String role = request.getParameter("role");

        // Générer la date de création
        String dateCreation = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));

        // Créer un nouvel objet Utilisateur
        Utilisateur nouvelUtilisateur = new Utilisateur(nom, prenom, email, motDePasse, role, dateCreation);

        // Appeler le modèle pour insérer l'utilisateur dans la base
        try {
            Modele.insertUtilisateur(nouvelUtilisateur);
            // Réponse JSON en cas de succès
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            response.getWriter().write("{\"message\": \"Utilisateur inscrit avec succès\"}");
        } catch (Exception e) {
            // Réponse JSON en cas d'erreur
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            response.getWriter().write("{\"error\": \"Erreur lors de l'inscription de l'utilisateur\"}");
            e.printStackTrace();
        }
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        // Par exemple, une requête GET pourrait retourner tous les utilisateurs
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        try {
            response.getWriter().write(Modele.selectAllUtilisateurs().toString());
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write("{\"error\": \"Erreur lors de la récupération des utilisateurs\"}");
            e.printStackTrace();
        }
    }
}
