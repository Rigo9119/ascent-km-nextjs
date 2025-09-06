export function translateAuthError(errorMessage: string): string {
  const errorTranslations: Record<string, string> = {
    // Login errors
    'Invalid login credentials': 'Credenciales de inicio de sesión inválidas',
    'Invalid credentials': 'Credenciales inválidas',
    'Email not confirmed': 'Email no confirmado',
    'Too many requests': 'Demasiadas solicitudes',
    'Invalid email or password': 'Email o contraseña inválidos',
    'Password should be at least 6 characters': 'La contraseña debe tener al menos 6 caracteres',
    
    // Signup errors
    'User already registered': 'Usuario ya registrado',
    'Email already exists': 'El email ya existe',
    'Signup is disabled': 'El registro está deshabilitado',
    'Password is too weak': 'La contraseña es muy débil',
    'Email address is invalid': 'La dirección de email es inválida',
    
    // Network/Server errors
    'Network error': 'Error de red',
    'Unable to validate JWT': 'No se pudo validar la sesión',
    'JWT expired': 'La sesión ha expirado',
    'An unexpected error occurred': 'Ocurrió un error inesperado',
    
    // Email confirmation
    'Please check your email and click the confirmation link to complete signup.': 
      'Por favor revisa tu email y haz clic en el enlace de confirmación para completar el registro.',
    
    // Rate limiting
    'Email rate limit exceeded': 'Límite de emails excedido',
    'SMS rate limit exceeded': 'Límite de SMS excedido',
    
    // OAuth errors
    'OAuth error': 'Error de autenticación',
    'Provider not supported': 'Proveedor no soportado',
  };

  // Check for exact matches first
  if (errorTranslations[errorMessage]) {
    return errorTranslations[errorMessage];
  }

  // Check for partial matches (case insensitive)
  const lowerErrorMessage = errorMessage.toLowerCase();
  for (const [englishError, spanishError] of Object.entries(errorTranslations)) {
    if (lowerErrorMessage.includes(englishError.toLowerCase())) {
      return spanishError;
    }
  }

  // If no translation found, return the original message
  return errorMessage;
}