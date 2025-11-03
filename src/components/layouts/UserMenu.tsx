'use client'

import { useState } from 'react'
import { signOut, useSession } from 'next-auth/react'
import { Button } from '@/components/ui/Button'
import { formatCurrency } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu'
import { User as UserIcon, Settings, LogOut, Wallet } from 'lucide-react'

interface UserMenuProps {
  session: any
}

export function UserMenu({ session }: UserMenuProps) {
  const { data: currentSession } = useSession()
  const userSession = currentSession || session
  const [loading, setLoading] = useState(false)

  const handleSignOut = async () => {
    setLoading(true)
    try {
      await signOut({ callbackUrl: '/' })
    } catch (error) {
      console.error('Sign out error:', error)
    } finally {
      setLoading(false)
    }
  }

  const userInitials = userSession?.user?.email
    ?.split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'U'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage src="" alt={userSession?.user?.email || ''} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {userInitials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {userSession?.user?.email}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {userSession?.user?.tier} Member
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              Balance: {formatCurrency(userSession?.user?.walletBalance || 0)}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <UserIcon className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Wallet className="mr-2 h-4 w-4" />
          <span>Wallet</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-red-600 cursor-pointer"
          onClick={handleSignOut}
          disabled={loading}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>{loading ? 'Signing out...' : 'Sign out'}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}