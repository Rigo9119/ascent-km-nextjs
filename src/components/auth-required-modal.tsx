'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { UsersIcon, X } from "lucide-react"

interface AuthRequiredModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  description?: string
}

export default function AuthRequiredModal({
  isOpen,
  onClose,
  title = "Cuenta Requerida",
  description = "Necesitas crear una cuenta para unirte a eventos y conectar con la comunidad."
}: AuthRequiredModalProps) {
  const router = useRouter()

  const handleCreateAccount = () => {
    onClose()
    router.push('/auth?mode=sign-up')
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UsersIcon className="h-5 w-5 text-emerald-500" />
            {title}
          </DialogTitle>
          <DialogDescription className="pt-2">
            {description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleCreateAccount}
            className="flex-1 bg-emerald-500 hover:bg-emerald-600"
          >
            Crear Cuenta
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}