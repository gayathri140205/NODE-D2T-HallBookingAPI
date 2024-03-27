const express=require('express');
const bodyParser=require('body-parser');
const app=express();

const PORT=3000;

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//Dummy data
const rooms=[];
const bookings=[];

//Define a function to generate unique booking id
function generateBookingId(){
  return bookings.length+1;
}
// Route to list all rooms
app.get('/rooms',(req,res)=>{
  res.json(rooms);
});

//Route to create a room
app.post('/create-room',(req,res)=>{
  const{ roomNumber,seatsAvailable,amenities,pricePerHour}=req.body;
  

  if(!roomNumber||!seatsAvailable||!pricePerHour){
    return res.status(400).json({message:'Room number,seats Available,pricePer hour are required'})
  }
 
  const isRoomExist=rooms.some((room)=>room.roomNumber===roomNumber);

  if(isRoomExist){
    return res.status(409).json({message:'Room number already exists'});
  }

  rooms.push({
    roomNumber,
    seatsAvailable,
    amenities,
    pricePerHour,
  });
  res.json({message:'Room created successfully'});
});

//Route to book a room
app.post('/book-room',(req,res)=>{
  const{roomId,customerName,date,startTime,endTime}=req.body;


  if (!roomId || !customerName ||!date||!startTime ||!endTime ) {
    return  res.status(400).json({ message:"RoomId,customerName,date,startTime,endTime are required" }) ;
  }


  const room=rooms.find((room)=>room.roomNumber===roomId);
  if(!room){
    return res.status(404).json({message:'Room not Found'})
  }


  const isRoomAvailable=true;
  if(!isRoomAvailable){
    return res.status(409).json({message:'Room is not available for specified time'});
  }

const bookingId=generateBookingId();

  bookings.push({
    bookingId,
    roomId,
    customerName,
    date,
    startTime,
    endTime,
    bookingDate,
    bookingStatus:'Confirmed',
  });
  res.json({message:'Room booked successfully'});
});

//Route to list all rooms with bookings
app.get('/rooms-with-bookings',(req,res)=>{
  const roomsWithBookings=rooms.map((room)=>{
  const roomBookings=bookings.filter((booking)=>booking.roomId===room.roomNumber);
    return{
      roomNumber:room.roomNumber,
      bookings:roomBookings.map((booking)=>({
        customerName:booking.customerName,
        date:booking.date,
        startTime:booking.startTime,
        endTime:booking.endTime,
        bookingStatus:booking.bookingStatus,
      })),
    };
  });
  res.json(roomsWithBookings);
});

//Route to list all customer with bookings
app.get('/customers-with-bookings',(req,res)=>{
  const customersWithBookings= bookings.map((booking)=>({
    customerName:booking.customerName,
    roomId:booking.roomId,
    date:booking.date,
    startTime:booking.startTime,
    endTime:booking.endTime,
    bookingStatus:booking.bookingStatus,
  }));
  res.json(customersWithBookings);
});

//Route to list how many times a customer has booked a room with details
app.get('/customer-booking-history/:customerName',(req,res)=>{
  const customerName=req.params.customerName;
  const customerBookingHistory=
    bookings.filter((booking)=>booking.customerName===customerName );
    //res.json(customerBookingHistory);
    res.json({message:'no such bookings'});
});
app.listen(PORT,()=>{
  console.log(`API  listening at http://locahost:${PORT}`);
});