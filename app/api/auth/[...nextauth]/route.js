import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const OPTIONS = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Şifre", type: "password" },
      },
      async authorize(credentials) {
        // Admin kullanıcı bilgilerini kontrol et
        if (
          credentials.email === process.env.ADMIN_EMAIL &&
          credentials.password === process.env.ADMIN_PASSWORD
        ) {
          return {
            id: "1",
            name: "Admin",
            email: process.env.ADMIN_EMAIL,
            role: "admin",
          };
        }

        // Giriş başarısız
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/login", // Özel giriş sayfası (isteğe bağlı)
  },
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (token) {
        session.user.role = token.role;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 gün
  },
  secret: process.env.NEXTAUTH_SECRET || "bu-gizli-anahtari-degistirin",
};

const handler = NextAuth(OPTIONS);
export { handler as GET, handler as POST };
