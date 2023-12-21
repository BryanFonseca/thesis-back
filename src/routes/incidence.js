import express from "express";
import { User } from "../sequelize/sequelize.js";
import WebPush from "web-push";

const router = express.Router();

// TODO: Enviar notificación push a guardia

router.post("/api/incidence", async (req, res) => {
    // TODO: Insertar en tabla de incidencia el usuario, su ubicación y el guardia más cercano
    // TODO: Esto implica que se debe tener la ubicación del guardia. El endpoint que recibe la ubicación
    // TODO: debe guardarlo en un campo (lat & lng)

    /*
        Esto puede implementarse con un campo nullable. O ser una entidad a parte.  
        Tal vez podría haber una entidad aparte 'Ubicación' que podría conseguirse desde los usuarios, es decir
        usuario.getUbicacion() cuando el usuario tenga tipo 'GUARDIA'.
        Qué sucedería su heredo en una clase Guardia el modelo Estudiante y 
    */

    // Hacer select de usuarios que sean guardias, conseguir ubicación y quedarnos con el más cercano.


    const users = await User.findAll();
    for (const { pushSubscription } of users) {
        if (!pushSubscription) continue;
        const notificationResult = await WebPush.sendNotification(
            pushSubscription,
            JSON.stringify({
                body: "Some body yo",
            })
        );
        console.log(notificationResult);
    }
    res.status(200).send({});
});

export default router;
