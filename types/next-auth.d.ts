// types/next-auth.d.ts
import NextAuth, { DefaultSession } from 'next-auth';

// Menggunakan `DefaultSession` untuk memperluas antarmuka user.
declare module 'next-auth' {
  interface User {
    id: string;
    role: string;
    picture: string;
  }

  interface Session extends DefaultSession {
    user: DefaultSession['user'] & {
      id: string; // Menambahkan id
      role: string; // Menambahkan role
      picture: string; // Menambahkan picture
    };
  }

  interface CredentialsInputs {
    email: string;
    password: string;
  }
}
