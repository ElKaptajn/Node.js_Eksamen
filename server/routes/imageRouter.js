import fs from "fs";
import { isAuthenticated } from "../security/security.js"
import { s3 } from "../database/awsConnection.js";
import { Router } from "express";
const router = Router();

import multer from "multer";
const upload = multer({ dest: 'uploads/' });

router.post('/image', isAuthenticated, upload.single('image'), (req, res) => {
    try {
        const fileContent = fs.readFileSync(req.file.path);
        const fileName = req.session.user + "$" +req.file.originalname;
        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: fileName,
            Body: fileContent,
        };

        s3.upload(params, (err, data) => {
            if (err) {
                res.status(500).send('Error uploading file');
            } else {
                const imageUrl = data.Location; 
                res.send(imageUrl); 
            }
        });
    } catch(err) {
        res.send("src/assets/images/pulling-up-training-silhouette-svgrepo-com.png")
    }
});

router.delete('/image/:imageUrl', isAuthenticated, (req, res) => {
    const imageKey = req.params.imageUrl;

    if(req.session.user !== imageKey.split("$")[0]) return res.send("You are not authorized to delete this image");
    
    if(imageKey === "src/assets/images/pulling-up-training-silhouette-svgrepo-com.png") {
        return res.send("Default image cannot be deleted");
    }

    s3.deleteObject({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: imageKey,
    }, (err, data) => {
        if (err) {
            res.status(500).send('Error deleting file');
        } else {
            res.send("Image deleted");
        }
    });
});

export default router;