const functions = require("firebase-functions");
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "databaseURL",
});

exports.createToken = functions.https.onCall((data, context) => {
    const access_token = data.access_token;

    return admin
        .auth()
        .createCustomToken(access_token)
        .then((customToken) => {
            return { status: "success", customToken: customToken };
        })
        .catch((error) => {
            return {
                status: "error",
                error: error.errorInfo,
                access_token: access_token,
            };
        });
});
