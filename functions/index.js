const functions = require('firebase-functions');
const admin = require('firebase-admin');

var serviceAccount = require("./permission.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://care-giver-project.firebaseio.com"
});

const express = require('express');
const app = express();
const db = admin.firestore();

const cors = require('cors');
app.use( cors( {origin:true} ) );


//Routes
app.get('/api/get', (req, res) => {
    return res.status(200).send('Hello World!');
})

//Create
//Post
app.post('/api/create', (req, res) => {

    (async () => {

        try
        {
            await db.collection('epochs').doc('/'+ req.body.userId +'/').create({
                userId: req.body.userId,
                userAccessToken : req.body.userAccessToken,
                summaryId : req.body.summaryId, 
                activityType : req.body.activityType,
                activeKilocalories : req.body.activeKilocalories,
                steps : req.body.steps,
                distanceInMeters : req.body.distanceInMeters,
                durationInSeconds : req.body.durationInSeconds,
                activeTimeInSeconds : req.body.activeTimeInSeconds,
                startTimeInSeconds : req.body.startTimeInSeconds,
                startTimeOffsetInSeconds : req.body.startTimeOffsetInSeconds,
                met : req.body.met,
                intensity : req.body.intensity,
                meanMotionIntensity : req.body.meanMotionIntensity,
                maxMotionIntensity : req.body.maxMotionIntensity,
            })

            return res.status(200).send();
        }
        catch (error)
        {
            console.log(error);
            return res.status(500).send(error);
        }
    })();
});


//Read
app.get('/api/read/:id', (req, res) => {
    (async () =>{
        try {
            const document = db.collection('users').doc(req.params.id);
            let users = await document.get();
            let response = users.data();

            return res.status(200).send(response);
        } catch (error){
            console.log(error);
            return res.status(500).send(error);
        }
    })();

});

//Read all users
app.get('/api/read', (req, res) => {
    (async () => {
        try {
            let query = db.collection('users');
            let response = [];

            await query.get().then(querySnapshot => {
                let docs = querySnapshot.docs; //the result of query

                for(let doc of docs)
                {
                    const seletedItem = {
                        id: doc.id,
                        email: doc.data().email,
                        displayName: doc.data().displayName
                    };
                    response.push(seletedItem);
                }
                return response;
            })
            return res.status(200).send(response);
        } catch (error){
            console.log(error);
            return res.status(500).send(error);
        }
    })();

});

//Update
//PUT
app.put('/api/update/:id', (req, res) => {
    (async () => {
        try {
            const document = db.collection('users').doc(req.params.id);
            await document.update({
                email: req.body.email,
                displayName: req.body.displayName
            });

            return res.status(200).send(response);
        } catch (error){
            console.log(error);
            return res.status(500).send(error);
        }
    })();

});

//Delete
app.delete('/api/delete/:id', (req, res) => {
    (async () => {
        try {
            const document = db.collection('users').doc(req.params.id);
            await document.delete();

            return res.status(200).send(response);
        } catch (error){
            console.log(error);
            return res.status(500).send(error);
        }
    })();

});

//Export the api to Firebase Cloud Functions
exports.app = functions.https.onRequest(app);
