const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const User = require("../models/user");
const Profile = require("../models/profile");

// Google OAuth Strategy Configuration
const googleClientId = process.env.GOOGLE_CLIENT_ID || "PLACEHOLDER_GOOGLE_CLIENT_ID";
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET || "PLACEHOLDER_GOOGLE_CLIENT_SECRET";

if (googleClientId !== "PLACEHOLDER_GOOGLE_CLIENT_ID") {
  passport.use(
    new GoogleStrategy(
      {
        clientID: googleClientId,
        clientSecret: googleClientSecret,
        callbackURL: `${process.env.BACKEND_URL || "http://localhost:4000"}/api/v1/auth/google/callback`,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
          const googleId = profile.id;

          let user = await User.findOne({ $or: [{ googleId }, { email }] });

          if (user) {
            if (!user.googleId) {
              user.googleId = googleId;
              if (profile.photos && profile.photos[0] && !user.profilePic) {
                user.profilePic = profile.photos[0].value;
              }
              await user.save();
            }
            return done(null, user);
          }

          // Create new user profile
          const newProfile = await Profile.create({
            bio: "",
            about: "",
            name: `${profile.name?.givenName || "User"} ${profile.name?.familyName || ""}`.trim(),
          });

          // Create user
          user = await User.create({
            firstName: profile.name?.givenName || "Google",
            lastName: profile.name?.familyName || "User",
            email: email || `${googleId}@google.oauth`,
            googleId,
            profilePic: profile.photos && profile.photos[0] ? profile.photos[0].value : "",
            profile: newProfile._id,
          });

          return done(null, user);
        } catch (error) {
          return done(error, null);
        }
      }
    )
  );
}

// Facebook OAuth Strategy Configuration
const facebookAppId = process.env.FACEBOOK_APP_ID || "PLACEHOLDER_FACEBOOK_APP_ID";
const facebookAppSecret = process.env.FACEBOOK_APP_SECRET || "PLACEHOLDER_FACEBOOK_APP_SECRET";

if (facebookAppId !== "PLACEHOLDER_FACEBOOK_APP_ID") {
  passport.use(
    new FacebookStrategy(
      {
        clientID: facebookAppId,
        clientSecret: facebookAppSecret,
        callbackURL: `${process.env.BACKEND_URL || "http://localhost:4000"}/api/v1/auth/facebook/callback`,
        profileFields: ["id", "emails", "name", "picture.type(large)"],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
          const facebookId = profile.id;

          let user = await User.findOne({ $or: [{ facebookId }, { email }] });

          if (user) {
            if (!user.facebookId) {
              user.facebookId = facebookId;
              await user.save();
            }
            return done(null, user);
          }

          const newProfile = await Profile.create({
            bio: "",
            about: "",
            name: `${profile.name?.givenName || "User"} ${profile.name?.familyName || ""}`.trim(),
          });

          user = await User.create({
            firstName: profile.name?.givenName || "Facebook",
            lastName: profile.name?.familyName || "User",
            email: email || `${facebookId}@facebook.oauth`,
            facebookId,
            profilePic: profile.photos && profile.photos[0] ? profile.photos[0].value : "",
            profile: newProfile._id,
          });

          return done(null, user);
        } catch (error) {
          return done(error, null);
        }
      }
    )
  );
}

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;
