'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Icons } from "@/components/ui/icons"
import Link from "next/link"

export default function SignUp() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [username, setUsername] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [googleAvailable, setGoogleAvailable] = useState(true)
  const [githubAvailable, setGithubAvailable] = useState(true)
  const router = useRouter()

  // Check if Google and GitHub services are accessible
  useEffect(() => {
    const checkServicesAccess = async () => {
      // Check Google
      try {
        await fetch('https://www.google.com', { 
          mode: 'no-cors'
        });
        setGoogleAvailable(true);
      } catch (error) {
        setGoogleAvailable(false);
      }
      
      // Check GitHub
      try {
        await fetch('https://github.com', { 
          mode: 'no-cors'
        });
        setGithubAvailable(true);
      } catch (error) {
        setGithubAvailable(false);
      }
    };
    
    checkServicesAccess();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (password !== confirmPassword) {
      setError("Passwords don't match")
      return
    }

    setIsLoading(true)
    setError("")
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          username,
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        // Auto-login after successful registration
        const result = await signIn('credentials', {
          email,
          password,
          redirect: true,
          callbackUrl: "/",
        });
        
        // If signIn doesn't redirect automatically, handle it manually
        if (!result?.error) {
          router.push("/");
          router.refresh();
        } else {
          console.log("Auto-login failed, redirecting to sign in page");
          router.push("/auth/signin?message=Registration+successful");
        }
      } else {
        setError(data.error || "Registration failed")
      }
    } catch (error) {
      console.error("Sign up error:", error)
      setError("An error occurred during registration")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Card className="w-[400px]">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Create an account</CardTitle>
          <CardDescription className="text-center">
            Enter your information to create your account
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-1 gap-4">
            <Button 
              variant="outline" 
              disabled={isLoading || !githubAvailable}
              onClick={() => router.push('/api/auth/signin?provider=github')}
            >
              <Icons.gitHub className="mr-2 h-4 w-4" />
              GitHub
              {!githubAvailable && (
                <span className="ml-2 text-xs text-orange-600">
                  (网络不可用)
                </span>
              )}
            </Button>
            <Button 
              variant="outline" 
              disabled={isLoading || !googleAvailable}
              onClick={() => router.push('/api/auth/signin?provider=google')}
            >
              <Icons.google className="mr-2 h-4 w-4" />
              Google
              {!googleAvailable && (
                <span className="ml-2 text-xs text-orange-600">
                  (网络不可用)
                </span>
              )}
            </Button>
            {(!googleAvailable || !githubAvailable) && (
              <div className="text-xs text-gray-500 text-center">
                提示：{!googleAvailable && 'Google'}{!googleAvailable && !githubAvailable && ' 和 '}{!githubAvailable && 'GitHub'} 服务在当前网络环境下可能不可用，建议使用邮箱注册
              </div>
            )}
          </div>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          {error && (
            <div className="text-red-500 text-sm text-center mb-4">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="grid gap-2">
              <div className="grid gap-1">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  placeholder="username"
                  type="text"
                  autoCapitalize="none"
                  autoCorrect="off"
                  disabled={isLoading}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="grid gap-1">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  placeholder="name@example.com"
                  type="email"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect="off"
                  disabled={isLoading}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-1">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  placeholder="Password"
                  type="password"
                  autoCapitalize="none"
                  autoComplete="new-password"
                  disabled={isLoading}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="grid gap-1">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  placeholder="Confirm Password"
                  type="password"
                  autoCapitalize="none"
                  autoComplete="new-password"
                  disabled={isLoading}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <Button disabled={isLoading} className="w-full">
                {isLoading && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                )}
                Create Account
              </Button>
            </div>
          </form>
          <div className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/auth/signin" className="underline underline-offset-4 hover:text-primary">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}