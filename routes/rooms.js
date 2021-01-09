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
        "roomPic":  req.body.roomPic,
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

router.get('/getRooms',async function(req,res){

    try {

      let url = process.env.DB1;
      let client = await MongoDb.connect(url);
      let db = await client.db("2Gethr");
    
      let data = await db.collection("Rooms").find().toArray()
      await client.close();
      
      res.json({

        "Rooms" : data
      })
    
    } catch (error) {
        res.json({
            "message" : "Your Request To Add Room is Not Successful"
          })
    }
})

router.post('/roomBooking',async function(req,res){

    try {

      let url = process.env.DB1;
      let client = await MongoDb.connect(url);
      let db = await client.db("2Gethr");

      let date = req.body.dateToBook;
      let roomId = req.body.roomId;
      let requiredSlots = req.body.slotsRequired;
      let name = req.body.userName;
      let result;

      let BookingData = await db.collection("BookingData").findOne({"roomId": roomId,"dateToBook": date})
    
      if(BookingData == null) {
        let bookings=[];

        for(let index=0;index<requiredSlots.length;index++){
            bookings.push({
                "slotNumber" : requiredSlots[index],
                "userName" : name
            })
        }

        result = await db.collection("BookingData").insertOne({
            "dateToBook" : date,
            "roomId" : roomId,
            "reservations" : bookings
        })

        res.json({
            "message" : "Booking Successful"
          })
      }
      else {
          
            let availableSlots=[];
            let isAllSlotsAvailable = true;
            let reservedSlots = BookingData.reservations;


            for(let index=0;index<reservedSlots.length;index++){

                let reservedSlot = reservedSlots[index];
                let findIndex = requiredSlots.indexOf(reservedSlot.slotNumber);

                if( findIndex >= 0){
                    isAllSlotsAvailable = false;
                    let temp = requiredSlots.splice(findIndex,1);
                }
            }


            if(requiredSlots.length > 0) {

                for(let index=0;index<requiredSlots.length;index++){
                    availableSlots.push({
                        "slotNumber" : requiredSlots[index],
                        "userName" : name
                    })
                }
    
                result = await db.collection("BookingData").updateOne(
                    {"roomId": roomId,"dateToBook": date},
                    {
                        $push : { reservations :  { $each : availableSlots}}
                    }
                );

                await client.close();

                if(isAllSlotsAvailable) {
                    
                    res.json({
    
                        "message" : "All Slots Booking Successful"
                    })
                } else {
                    res.json({
    
                        "message" : "Few Slots Booking Successful"
                    })
                }
            }

      }
      await client.close();
      res.json({
    
        "message" : "Requested Slots are Not Available"
    })
    
    } catch (error) {
        res.json({
            "message" : "Your Request To Book Room is Not Successful"
          })
    }
})

router.get('/getBookings',async function(req,res){

    try {

      let url = process.env.DB1;
      let client = await MongoDb.connect(url);
      let db = await client.db("2Gethr");
    
      let data = await db.collection("BookingData").find().toArray()
      await client.close();
      
      res.json({

        "Rooms" : data
      })
    
    } catch (error) {
        res.json({
            "message" : "Your Request To Add Room is Not Successful"
          })
    }
})

module.exports = router;