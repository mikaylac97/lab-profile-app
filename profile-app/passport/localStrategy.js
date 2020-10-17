
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/User.model");
const bcrypt = require("bcryptjs");


passport.use(
    "local",
    new LocalStrategy(
        {
            usernameField: "username",
        },
        (username, password, next) => {
            User.findOne({ username })
                .then((userFromDb) => {
                    if (!userFromDb) {
                        return next(null, false, {
                            message: "Incorrect username",
                        });
                    }

                    if (!bcrypt.compareSync(password, userFromDb.password)) {
                        return next(null, false, {
                            message: "Incorrect Password",
                        });
                    }

                    return next(null, userFromDb);
                })
                .catch((err) => next(err));
        }
    )
);