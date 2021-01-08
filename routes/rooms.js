var express = require('express');
var router = express.Router();
const MongoDb = require('mongodb');
const dotenv = require('dotenv').config();

router.post('/addRoom',async function(req,res){

    try {

      let url = process.env.DB1;
      let client = await MongoDb.connect(url);
      let db = await client.db("2Gethr");
    
      let data = await db.collection("Rooms").insertOne({

        "name": req.body.name,
        "numberOfSeats": req.body.numberOfSeats,
        "floorNumber": req.body.floorNumber,
        "whiteboard": req.body.whiteboard,
        "conference__cost_in_credits": req.body.conference__cost_in_credits
      })
      await client.close();
      
      res.json({

        "message" : "Room Added Successfully"
      })
    
    } catch (error) {
        res.json({
            "message" : "Your Request To Add Room is Not Successful"
          })
    }
})

module.exports = router;