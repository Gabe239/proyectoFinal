import passport from 'passport';
import User from '../dao/models/userModel.js';
import MailingService from '../config/mailing.js';
import jwt from 'jsonwebtoken';
import { PRIVATE_KEY } from '../utils.js';
import nodemailer from 'nodemailer';
import config from '../config/env-config.js';

const mailConfig = {
  service: 'gmail',
  auth: {
      user: config.mailing.user,
      pass: config.mailing.password,
  },
}

const transport = nodemailer.createTransport(mailConfig);

export const registerUser = (req, res, next) => {
  passport.authenticate('local-signup', (err, user, info) => {
    if (err) {
      return res.status(500).send({ status: 'error', error: 'An error occurred' });
    }
    if (!user) {
      return res.status(400).send({ status: 'error', error: info.message });
    }
    req.login(user, (err) => {
      if (err) {
        return next(err);
      }
      res.send({ status: 'success', message: 'User registered' });
    });
  })(req, res, next);
};

export const loginUser = (req, res, next) => {
  passport.authenticate('local-login', (err, user, info) => {
    if (err) {
      return res.status(500).json({ error: 'An error occurred' });
    }
    if (!user) {
      return res.status(400).json({ error: info.message });
    }

    req.login(user, (err) => {
      if (err) {
        return next(err);
      }



      req.session.user = {
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        age: user.age,
        role: user.role,
      };

      return res.json({ status: "success", payload: user, message: "First login successful! :)" });
    });
  })(req, res, next);
};

export const logoutUser = (req, res) => {
  req.session.destroy();
  res.redirect('/login');
};

export const githubAuth = passport.authenticate('github', { scope: ['user:email'] });

export const githubAuthCallback = passport.authenticate('github', { failureRedirect: '/login' }, (req, res) => {
  req.session.user = req.user;
  res.redirect('/');
});

export const recoverMail = async (req, res) => {

  

  const email = req.params.email;
  try {
    const userEmail = await User.findOne({ email });
    if (!userEmail) {
      console.error(err);
      return res.status(404).json({ message: 'User not found' });
    }
    const token = jwt.sign({ email }, PRIVATE_KEY, { expiresIn: '1h' });

    const myMail = {
      from: `Coder test <${config.mailing.user}>` ,
      to: email,
      subject: 'Password Reset',
      text: `Click the following link to reset your password: http://localhost:8080/api/sessions/reset-password/${token}`,
    };


    transport.sendMail(myMail, (error, info) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ message: 'Failed to send reset email' });
      } else {
        console.log('Email sent: ' + info.response);
        return res.status(200).json({ message: 'Password reset link sent' });
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

export const resetPassword = async (req, res) => {
  try {
    const decoded = jwt.verify(token, PRIVATE_KEY);
    const { email } = decoded;

    User.findOneAndUpdate({ email }, { password: newPassword }, (err, doc) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
      } else {
        if (!doc) {
          res.status(404).json({ message: 'User not found' });
        } else {
          res.status(200).json({ message: 'Password reset successful' });
        }
      }
    });
  }
  catch (err) {
    // If the token is invalid or has expired, you will catch an error here
    console.error(err);
    res.status(401).json({ message: 'Invalid or expired token' });
  }
}


