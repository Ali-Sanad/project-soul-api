const crypto = require('crypto');
const mongoose = require('mongoose');
const bycrpt = require('bcryptjs');
const validator = require('validator');
const TherapistSchema = new mongoose.Schema({
  fname: {
    type: String,
    required: [true, 'enter first name'],
  },
  lname: {
    type: String,
    required: [true, 'enter last name'],
  },
  email: {
    type: String,
    required: [true, 'enter email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'please enter valid email'],
  },
  password: {
    type: String,
    required: [true, 'enter password'],

    select: false,
  },
  confirmPassword: {
    type: String,
    // required: [true, "condirm password"],
    validate: {
      //on create or save
      validator: function (el) {
        return el === this.password;
      },
      message: 'password are not the same..',
    },
  },
  passwordCgangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  //therapistSessions :[{sessionDate:Date,hours:[from :nubmer, to:number ,isBooked:bool}]]
  therspistSessions: [
    {
      day: {
        type: Date,
      },
      hours: [
        {
          from: {
            type: Number,
            min: 1,
            max: 24,
          },
          to: {
            type: Number,
            min: 1,
            max: 24,
          },
          isBooked: {
            type: Boolean,
            default: false,
          },
        },
      ],
    },
  ],
  isAccepted: {
    type: Boolean,
    default: false,
  },
  passwordChangedAt: Date,

  summary: {
    type: String,
  },
  therapist_image_url: {
    //image
    type: String,
  },

  licenseOfOrganization: {
    type: String,
  },

  prefix: {
    type: String,
  },
  yearsofEeperience: {
    type: Number,
  },
  licenseNo: {
    type: Number,
  },
  mainsFocus: {
    type: [String],
    required: true,
  },
  birthOfDate: {
    type: Number,
  },
  specialties: {
    type: [String],
    required: true,
  },
  uploadCv: {
    type: String,
  },
  experience: [
    {
      title: {
        type: String,
        required: true,
      },

      location: {
        type: String,
      },
      from: {
        type: Date,
        required: true,
      },
      to: {
        type: Date,
      },
    },
  ],
  education: [
    {
      title: {
        type: String,
        required: true,
      },

      location: {
        type: String,
      },
      from: {
        type: Date,
        required: true,
      },
      to: {
        type: Date,
      },
    },
  ],
  socialLinks: {
    twitter: {
      type: String,
    },
    facebook: {
      type: String,
    },
    linkedin: {
      type: String,
    },
    instagram: {
      type: String,
    },
    youtube: {
      type: String,
    },
  },
  appointments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'appointment',
    },
  ],
});

TherapistSchema.pre('save', async function (next) {
  const salt = await bycrpt.genSalt();
  //only run if password modified
  if (!this.isModified('password')) return next();
  //hashing bycript with cost of 12
  this.password = await bycrpt.hash(this.password, salt); //defult 10
  this.confirmPassword = undefined;
  next();
});

//instance method
//return true if password is the same
TherapistSchema.methods.correctPassword = async function (
  confirmPassword,
  password
) {
  return await bycrpt.compare(confirmPassword, password);
};

TherapistSchema.statics.login = async function (email, password) {
  const therapist = await this.findOne({email}).select('+password');
  if (therapist) {
    console.log(therapist);
    if (therapist.isAccepted) {
      const auth = await bycrpt.compare(password, therapist.password);
      if (auth) {
        return therapist;
      }
      throw Error('incorrect email or password ');
    }
    throw Error('you are not allowed to log in now');
  }
  throw Error('incorrect email or password');
};
TherapistSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  console.log('rest', resetToken, 'passwordToekn', this.passwordResetToken);
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};
TherapistSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordCgangedAt = Date.now() - 1000;
  next();
});
const Therapist = mongoose.model('Therapist', TherapistSchema);
module.exports = Therapist;
