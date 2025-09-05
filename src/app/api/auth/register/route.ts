import { NextRequest, NextResponse } from "next/server"
import { supabase, supabaseAdmin } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const { email, password, username } = await request.json()

    if (!email || !password || !username) {
      return NextResponse.json(
        { error: "Email, password, and username are required" },
        { status: 400 }
      )
    }

    // Check if username is already taken
    const { data: existingProfile } = await supabase
      .from('user_profiles')
      .select('username')
      .eq('username', username)
      .single()

    if (existingProfile) {
      return NextResponse.json(
        { error: "Username is already taken" },
        { status: 400 }
      )
    }

    // Sign up user with Supabase
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
        },
      },
    })

    if (authError) {
      return NextResponse.json(
        { error: authError.message },
        { status: 400 }
      )
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: "Failed to create user" },
        { status: 500 }
      )
    }

    // Auto-confirm email for development
    if (supabaseAdmin) {
      try {
        await supabaseAdmin.auth.admin.updateUserById(
          authData.user.id,
          { email_confirm: true }
        );
        console.log("Email auto-confirmed for development");
      } catch (confirmError) {
        console.warn("Failed to auto-confirm email:", confirmError);
      }
    }

    // Create user profile
    // Try admin client first, fallback to regular client if service key is not configured
    const supabaseClient = supabaseAdmin || supabase;
    const { error: profileError } = await supabaseClient
      .from('user_profiles')
      .insert({
        id: authData.user.id,
        username,
        avatar: null,
      })

    if (profileError) {
      console.error("Profile creation error:", profileError)
      // Don't fail the registration if profile creation fails
      // The user can update their profile later
    }

    // Return success - frontend will handle login
    return NextResponse.json({
      message: "User created successfully",
      user: {
        id: authData.user.id,
        email: authData.user.email,
        username,
      },
      success: true,
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}