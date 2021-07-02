const express = require('express');
const router = express.Router();
require('dotenv').config();

const User = require('../models/User');
const Appointment = require('../models/Appointment');
const {userAuth} = require('../middlewares/auth');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const {v4: uuid} = require('uuid');

// const payload = {
//   iss: process.env.APIKey,
//   exp: new Date().getTime() + 5000,
// };

// const ZOOM_TOKEN = jwt.sign(payload, process.env.APISecret);
//@ route         POST api/payment/
//@descrption      Buy therapist's appointment and confirm booking it
//@access          private
router.post('/', userAuth, async (req, res) => {
  try {
    const {appointmentId, token} = req.body;
    const user = await User.findById(req.user.id);
    const appointment = await Appointment.findById(appointmentId);
    //check if this appointment is already booked by another user before porceed to payment
    if (appointment.booking.isBooked) {
      return res
        .status(400)
        .json({msg: 'Appointment already has been booked by another user'});
    }

    const idempotencyKey = uuid();

    //create stripe payment
    const customer = await stripe.customers.create({
      email: token.email,
      source: token.id,
    });
    const result = await stripe.charges.create(
      {
        amount: appointment.fees * 100,
        currency: 'usd',
        customer: customer.id,
        receipt_email: token.email,
        description: 'Appointment booking payment',
      },
      {idempotencyKey}
    );

    // let axios_options = {
    //   url: `https://api.zoom.us/v2/users/${process.env.ZOOM_EMAIL}/meetings/`,
    //   method: 'post',

    //   headers: {
    //     Authorization: `Bearer ${ZOOM_TOKEN}`,
    //     'User-Agent': 'Zoom-api-Jwt-Request',
    //     'content-type': 'application/json',
    //   },
    //   options: {
    //     status: 'active',
    //   },
    //   json: true,

    //   data: {
    //     start_time: '2019-08-30T22:00:00Z',
    //     duration: 60,
    //   },
    // };
    // axios(axios_options)
    //   .then(function (response) {
    //     return response.data.join_url;
    //   })
    //   .then((joinUrl) => {
    //     console.log(joinUrl);
    //   });

    //if payment succeded book an appointment#############
    if (result && result.status === 'succeeded') {
      //update apoointment paymentStatus to be true then confirm booking
      const appointmentFields = {
        booking: {
          user: user,
          isBooked: true,
        },
        paymentStatus: true,
      };

      const updatedAppointment = await Appointment.findOneAndUpdate(
        {_id: appointmentId},
        {$set: appointmentFields},
        {new: true, upsert: true, setDefaultsOnInsert: true}
      );

      //fetch the auth user and make a booking after payment is succeded
      if (user.appointments.length === 0) {
        user.appointment = [];
      }

      user.appointments.unshift(updatedAppointment);
      await user.save();
    }
    // console.log({result, appointment: updatedAppointment});
    res.status(200).json({result, appointment});
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(404).json('Appointment not found');
    }
    console.error(err.message);
    return res.status(400).json('Payment failed');
  }
});

module.exports = router;

//zoom api
