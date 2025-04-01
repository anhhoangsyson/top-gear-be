import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Users } from '../../api/users/schema/user.schema';
import bcrypt from 'bcryptjs';

import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt';
passport.use(
  new LocalStrategy(
    {
      usernameField: 'usersname',
      passwordField: 'password',
    },
    async (usersname, password, done) => {
      try {
        console.log(usersname, password);

        const user = await Users.findOne({ usersname });
        if (!user) {
          return done(null, false, { message: 'Incorrect username.' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    },
  ),
);

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET as string,
    },
    async (jwtPayload, done) => {
      try {
        const user = await Users.findById(jwtPayload.id);
        if (!user) {
          return done(null, false);
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    },
  ),
);

export default passport;
