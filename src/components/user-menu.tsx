'use client'

import { User, Settings, LogOut, Heart, Sun, Moon, Monitor } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuPortal } from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useTheme } from "next-themes";

export function UserMenu() {
  const { user, signOut, isLoading } = useAuth();
  const { setTheme } = useTheme();

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (isLoading) {
    return <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />;
  }

  if (!user) {
    return (
      <div className="flex gap-2">
        <Button
          onClick={() => window.location.href = '/auth?mode=login'}
          variant="outline"
          size="sm"
        >
          Iniciar Sesión
        </Button>
        <Button
          onClick={() => window.location.href = '/auth?mode=sign-up'}
          size="sm"
          className="bg-emerald-500 hover:bg-emerald-600"
        >
          Registrarse
        </Button>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.user_metadata?.avatar_url} alt={user.email || ''} />
            <AvatarFallback>
              {user.email?.charAt(0).toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            <p className="font-medium">{user.user_metadata?.full_name || user.email}</p>
            <p className="w-[200px] truncate text-sm text-muted-foreground">
              {user.email}
            </p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => window.location.href = '/profile'}>
          <User className="mr-2 h-4 w-4" />
          Perfil
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => window.location.href = '/favourites'}>
          <Heart className="mr-2 h-4 w-4" />
          Favoritos
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => window.location.href = '/settings'}>
          <Settings className="mr-2 h-4 w-4" />
          Configuración
        </DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Sun className="mr-2 h-4 w-4" />
            Tema
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuItem onClick={() => setTheme('light')}>
                <Sun className="mr-2 h-4 w-4" />
                Claro
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('dark')}>
                <Moon className="mr-2 h-4 w-4" />
                Oscuro
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('system')}>
                <Monitor className="mr-2 h-4 w-4" />
                Sistema
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Cerrar Sesión
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
