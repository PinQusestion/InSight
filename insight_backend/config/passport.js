const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

function configurePassport(passport) {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/callback',
        accessType: 'offline', //Makes it so we get a refresh token
        prompt: 'consent'
    },
    // Getting all these from Google profile after user clicks allow
    async (accessToken, refreshToken, profile, done) => {
        const newUser = {
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            accessToken,
            refreshToken
        };

        try {
            let user = await User.findOne({ googleId: profile.id });

            if (user) {
                user.accessToken = accessToken;
                if(refreshToken) {
                    user.refreshToken = refreshToken;
                }
                await user.save();
                return done(null, user);
            } else {
                user = await User.create(newUser);
                return done(null, user);
            }
        } catch (err) {
            console.error(err);
            done(err, null);
        }
    }));
    // Storing the user id in the session
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    // Getting the user from the id stored in the session
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (err) {
            done(err, null);
        }
    }
    )
}

module.exports = configurePassport;