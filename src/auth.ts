import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import connectDb from "./lib/connectDB";
import User from "./model/user.model";
import bcrypt from "bcryptjs";
import Google from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, request ) {
        await connectDb();
        const email = credentials.email as string;
        const password = credentials.password as string;

        const user = await User.findOne({ email });
        if (!user) {
          throw new Error("User are not Found");
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          throw new Error("Invalid password");
        }

        return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
        }

        // Add your user authentication logic here
        // For example, you can query your database to verify the user
      },
    }),

    Google({
      clientId: process.env.AUTH_GOOGLE_ID as string,
      clientSecret: process.env.AUTH_GOOGLE_SECRET as string,
    }),

  ],

  callbacks: {
    async signIn({user, account}){
      if(account?.provider === 'google'){
        await connectDb()
        let DBUser = await User.findOne({email:user.email})
        if(!DBUser){
          DBUser = await User.create({
            name: user.name,
            email: user.email,
            image: user.image,
            role: 'user',
            password: '' // Empty password for OAuth users
          })
        }
        user.id = DBUser._id.toString()
        user.role = DBUser.role.toString()
      }
      return true
    },


    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = user.role;
        token.name = user.name;
      }

      return token;
    },

    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.role = token.role as string ;
      }
      return session;
    },
  },

  pages:{
    signIn: '/login',
    error: '/login',
  },

  session: {
    strategy: 'jwt',
    maxAge: 10 * 24 * 60 * 60, //10days 10 * 24 * 60 * 60,
  },


  // Add debug logging for development
  debug: process.env.NODE_ENV === 'development',

});
