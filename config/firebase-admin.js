const admin = require("firebase-admin");

const serviceAccount = require("../private/service-account.json");

// initialize admin-sdk
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://locationapp-9a780-default-rtdb.firebaseio.com"
});

// initialize firestore
let fdb = admin.firestore();
const settings = { timestampsInSnapshots: true };
fdb.settings(settings);

module.exports = { admin, fdb };
