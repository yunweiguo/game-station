'use client'

import { signIn, getProviders } from "next-auth/react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Icons } from "@/components/ui/icons"
import Link from "next/link"
import { useTranslations } from 'next-intl'

export default function SignIn() {
  const t = useTranslations('auth')
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [providers, setProviders] = useState<Record<string, { id: string; name: string }> | null>(null)
  const [googleAvailable, setGoogleAvailable] = useState(true)
  const [githubAvailable, setGithubAvailable] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const getAuthProviders = async () => {
      const providers = await getProviders()
      setProviders(providers)
    }
    getAuthProviders()
    
    // Check if Google and GitHub services are accessible
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
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    
    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })
      
      if (result?.ok) {
        router.push("/auth/callback")
      } else {
        setError(t('errors.invalidCredentials'))
      }
    } catch (error) {
      console.error("Sign in error:", error)
      setError(t('errors.general'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleOAuthSignIn = (providerId: string) => {
    signIn(providerId, { callbackUrl: "/auth/callback" })
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Card className="w-[400px]">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">{t('signIn.title')}</CardTitle>
          <CardDescription className="text-center">
            {t('signIn.description')}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-1 gap-4">
            {providers &&
              Object.values(providers)
                .filter((provider) => provider.id !== "credentials")
                .map((provider) => (
                  <Button
                    key={provider.id}
                    variant="outline"
                    onClick={() => handleOAuthSignIn(provider.id)}
                    disabled={isLoading || 
                      (provider.id === "google" && !googleAvailable) || 
                      (provider.id === "github" && !githubAvailable)
                    }
                  >
                    {provider.id === "github" ? (
                      <Icons.gitHub className="mr-2 h-4 w-4" />
                    ) : (
                      <Icons.google className="mr-2 h-4 w-4" />
                    )}
                    {provider.name}
                    {provider.id === "google" && !googleAvailable && (
                      <span className="ml-2 text-xs text-orange-600">
                        ({t('errors.serviceUnavailable')})
                      </span>
                    )}
                    {provider.id === "github" && !githubAvailable && (
                      <span className="ml-2 text-xs text-orange-600">
                        ({t('errors.serviceUnavailable')})
                      </span>
                    )}
                  </Button>
                ))}
            {(!googleAvailable || !githubAvailable) && (
              <div className="text-xs text-gray-500 text-center">
                {t('errors.serviceUnavailableTip', {
                  services: [
                    !googleAvailable && 'Google',
                    !githubAvailable && 'GitHub'
                  ].filter(Boolean).join(' and ')
                })}
              </div>
            )}
          </div>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                {t('orContinueWith')}
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
                <Label htmlFor="email">{t('email')}</Label>
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
                <Label htmlFor="password">{t('password')}</Label>
                <Input
                  id="password"
                  placeholder={t('password')}
                  type="password"
                  autoCapitalize="none"
                  autoComplete="current-password"
                  disabled={isLoading}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button disabled={isLoading} className="w-full">
                {isLoading && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                )}
                {t('signIn.title')}
              </Button>
            </div>
          </form>
          <div className="text-center text-sm text-muted-foreground">
            {t('noAccount')}{" "}
            <Link href="/auth/signup" className="underline underline-offset-4 hover:text-primary">
              {t('signUp.title')}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}