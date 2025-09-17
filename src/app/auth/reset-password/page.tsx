'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createSbBrowserClient } from '@/lib/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { Eye, EyeOff, Lock, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isValidSession, setIsValidSession] = useState(false)
  const [isChecking, setIsChecking] = useState(true)
  
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createSbBrowserClient()

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error || !session) {
          setIsValidSession(false)
        } else {
          setIsValidSession(true)
        }
      } catch (error) {
        console.error('Error checking session:', error)
        setIsValidSession(false)
      } finally {
        setIsChecking(false)
      }
    }

    checkSession()
  }, [supabase])

  const validatePassword = (password: string) => {
    const minLength = password.length >= 8
    const hasUpperCase = /[A-Z]/.test(password)
    const hasLowerCase = /[a-z]/.test(password)
    const hasNumbers = /\d/.test(password)
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)

    return {
      minLength,
      hasUpperCase,
      hasLowerCase,
      hasNumbers,
      hasSpecialChar,
      isValid: minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar
    }
  }

  const passwordValidation = validatePassword(password)
  const passwordsMatch = password === confirmPassword && password.length > 0

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!passwordValidation.isValid) {
      toast.error('La contraseña no cumple con todos los requisitos')
      return
    }

    if (!passwordsMatch) {
      toast.error('Las contraseñas no coinciden')
      return
    }

    setIsLoading(true)

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      })

      if (error) throw error

      toast.success('¡Contraseña actualizada exitosamente!')
      
      // Redirect to login after a short delay
      setTimeout(() => {
        router.push('/auth?mode=login')
      }, 2000)

    } catch (error) {
      console.error('Error updating password:', error)
      toast.error('Error al actualizar la contraseña')
    } finally {
      setIsLoading(false)
    }
  }

  if (isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando sesión...</p>
        </div>
      </div>
    )
  }

  if (!isValidSession) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <Lock className="w-6 h-6 text-red-600" />
            </div>
            <CardTitle className="text-red-600">Enlace no válido o expirado</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600">
              El enlace para restablecer tu contraseña ha expirado o no es válido.
            </p>
            <div className="space-y-2">
              <Link href="/auth?mode=reset">
                <Button className="w-full bg-emerald-500 hover:bg-emerald-600">
                  Solicitar nuevo enlace
                </Button>
              </Link>
              <Link href="/auth?mode=login">
                <Button variant="outline" className="w-full">
                  Volver al inicio de sesión
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
            <Lock className="w-6 h-6 text-emerald-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Crear nueva contraseña
          </CardTitle>
          <p className="text-gray-600 mt-2">
            Ingresa tu nueva contraseña segura
          </p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleUpdatePassword} className="space-y-6">
            {/* New Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Nueva contraseña</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ingresa tu nueva contraseña"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Password Requirements */}
            {password && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Requisitos de contraseña:</p>
                <div className="space-y-1">
                  {[
                    { check: passwordValidation.minLength, text: "Mínimo 8 caracteres" },
                    { check: passwordValidation.hasUpperCase, text: "Al menos 1 mayúscula" },
                    { check: passwordValidation.hasLowerCase, text: "Al menos 1 minúscula" },
                    { check: passwordValidation.hasNumbers, text: "Al menos 1 número" },
                    { check: passwordValidation.hasSpecialChar, text: "Al menos 1 símbolo" },
                  ].map((req, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <CheckCircle 
                        className={`h-4 w-4 ${req.check ? 'text-green-500' : 'text-gray-300'}`}
                      />
                      <span className={`text-sm ${req.check ? 'text-green-700' : 'text-gray-500'}`}>
                        {req.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirma tu nueva contraseña"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
              {confirmPassword && !passwordsMatch && (
                <p className="text-sm text-red-600">Las contraseñas no coinciden</p>
              )}
              {confirmPassword && passwordsMatch && (
                <p className="text-sm text-green-600">Las contraseñas coinciden ✓</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-emerald-500 hover:bg-emerald-600"
              disabled={isLoading || !passwordValidation.isValid || !passwordsMatch}
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Actualizando...</span>
                </div>
              ) : (
                'Actualizar contraseña'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link 
              href="/auth?mode=login" 
              className="text-sm text-gray-600 hover:text-emerald-600"
            >
              ← Volver al inicio de sesión
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}