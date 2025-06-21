package modele;

import org.mindrot.jbcrypt.BCrypt;

public class GenererUnHash {
    public static void main(String[] args) {
        String hash = org.mindrot.jbcrypt.BCrypt.hashpw("test123", org.mindrot.jbcrypt.BCrypt.gensalt());
        System.out.println("Nouveau hash : " + hash);
        


    }
}

