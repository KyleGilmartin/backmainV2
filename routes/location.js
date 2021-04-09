import express from 'express';
import ValidationMiddleware from '../middleware/validation';
import db from '../models/playerService';
import { fdb, admin } from '../config/firebase-admin'
const { v4: uuidv4 } = require("uuid");
import Multer from 'multer'
const router = express.Router();

const imageUpload = Multer({
    storage: Multer.MemoryStorage,
    limits: {
      fileSize: 5 * 1024 * 1024
    },
    fileFilter: (req, file, cb) => {
      if (["image/png", 
          "image/jpg", 
          "image/jpeg"
          ].includes(file.mimetype)
      ) cb(null, true)
      else cb(new Error('Image format not supported'))
    }
  });


router.post('/', (req, res) => {
    db.createLocation(req, res);
});

router.get('/', (req, res) => {
  db.readLocations(req, res);

})
router.post('/post',  imageUpload.single("image"), async(req, res, next) => {
    console.log("hitting")
    const file = req.file;
    if(!file) throw new Error("file not found");
    let {description, location, latitude, longitude, uid} = req.body;
    let user = await fdb.collection('users').doc(uid).get();
    if (!user.exists) throw new Error("User not found")
    let imageUrl  = await uploadImageToBucket(file)
    let postRef = fdb.collection('posts').doc();
    req.body.image = imageUrl;
    db.createLocation(req, res);
    let post = await postRef.set({
        id: postRef.id,
        location: location,
        description: description,
        coordinates: new admin.firestore.GeoPoint(parseFloat(latitude), parseFloat(longitude)),
        uid: user.id,
        image: imageUrl,
        created: admin.firestore.Timestamp.fromDate(new Date())
    })
    if(post) {
        return res.json({
            success : true,
            msg: "success fully added post information",
        })
    }
    return res.json({success : false})
})

// To add: a put request to update a book.
//

router.get('/', (req, res) => {
    db.readLocations(req, res);
})

router.get('/:id', [ValidationMiddleware.validJWTNeeded, (req, res) => {

    db.readLocation(req, res);

}])
router.delete('/:id', (req, res) => {
  console.log('new',req.params);
  db.deleteLocations(req, res);
})
router.put('/:id', (req, res) => {
  console.log('new',req.params,req.body);
  db.updateLocations(req, res);
})

const uploadImageToBucket = async (file) => {
    return new Promise((resolve, reject) => {
      let uuid = uuidv4();
      let bucket = admin.storage().bucket("locationapp-9a780.appspot.com");
      let gcsFileName = `posts/${uuid}-${file.originalname}`;
      let blob = bucket.file(gcsFileName);
      let stream = blob.createWriteStream({
        resumable: false,
        metadata : {
          gzip: true,
          contentType: file.mimetype,
          metadata: {
            firebaseStorageDownloadTokens: uuid
          }
        }
      });
      stream.on('error', (err) => {
        reject("An error occured during image uploading");
      });
      stream.on('finish', () => {
        // we can also use blob.metadata.name instead of gcsfilename
        resolve(`https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${gcsFileName.replace(/\//g,'%2F')}?alt=media&token=${uuid}`);
      });
      stream.end(file.buffer);
    });
  }
  




export default router;