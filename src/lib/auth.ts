import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import GitHubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials"
import { supabase, supabaseAdmin } from "@/lib/supabase"

export const authOptions: NextAuthOptions = {
  providers: [
    // Add credentials provider for email/password authentication
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          // Sign in with Supabase
          const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email: credentials.email,
            password: credentials.password,
          })

          if (authError || !authData.user) {
            return null
          }

          // Fetch user profile to get role information
          const { data: profile, error: profileError } = await supabase
            .from('user_profiles')
            .select('role')
            .eq('id', authData.user.id)
            .single()

          if (profileError) {
            console.error('Error fetching user profile:', profileError)
          }

          // Return user data for NextAuth
          return {
            id: authData.user.id,
            email: authData.user.email!,
            name: undefined, // Don't set name to avoid duplication
            image: authData.user.user_metadata?.avatar,
            role: profile?.role || 'user',
          }
        } catch (error) {
          console.error("Credentials authorization error:", error)
          return null
        }
      }
    }),
    // Only add OAuth providers if credentials are available
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET ? [GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      },
      httpOptions: {
        timeout: 10000, // 10 seconds timeout
      }
    })] : []),
    ...(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET ? [GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      httpOptions: {
        timeout: 10000, // 10 seconds timeout
      }
    })] : []),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id as string
        // Fetch additional user data from Supabase
        // Use admin client to bypass RLS policies
        const supabaseClient = supabaseAdmin || supabase;
        const { data: profile, error } = await supabaseClient
          .from('user_profiles')
          .select('*')
          .eq('id', token.id)
          .single()
        
        if (error) {
          console.error('Error fetching user profile:', error);
        }
        
        // Set username, avatar, and role
        session.user.username = profile?.username || null
        session.user.avatar = profile?.avatar || null
        session.user.role = profile?.role || 'user'
        
        // Clear name to avoid duplication
        session.user.name = undefined
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
  session: {
    strategy: 'jwt',
  },
}

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name?: string
      image?: string
      username?: string
      avatar?: string
      role?: 'user' | 'admin' | 'moderator'
    }
  }

  interface User {
    id: string
    email: string
    name?: string
    image?: string
    username?: string
    avatar?: string
    role?: 'user' | 'admin' | 'moderator'
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role?: 'user' | 'admin' | 'moderator'
  }
}