package controleur;

public class Equipement {
    private int idEquipement;
    private String nomEquipement;
    private String description;
    private int idActivite;

    // Constructeur avec ID
    public Equipement(int idEquipement, String nomEquipement, String description, int idActivite) {
        this.idEquipement = idEquipement;
        this.nomEquipement = nomEquipement;
        this.description = description;
        this.idActivite = idActivite;
    }

    // Constructeur sans ID (pour insertion)
    public Equipement(String nomEquipement, String description, int idActivite) {
        this.idEquipement = 0; // Par défaut pour les nouvelles insertions
        this.nomEquipement = nomEquipement;
        this.description = description;
        this.idActivite = idActivite;
    }

    // Getters et Setters
    public int getIdEquipement() {
        return idEquipement;
    }

    public void setIdEquipement(int idEquipement) {
        this.idEquipement = idEquipement;
    }

    public String getNomEquipement() {
        return nomEquipement;
    }

    public void setNomEquipement(String nomEquipement) {
        this.nomEquipement = nomEquipement;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public int getIdActivite() {
        return idActivite;
    }

    public void setIdActivite(int idActivite) {
        this.idActivite = idActivite;
    }
}
