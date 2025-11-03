'use client'

import { useState } from 'react'
import { signOut, useSession } from 'next-auth/react'
import { Button } from '@/components/ui/Button'
import { formatCurrency } from '@/lib/utils'
import { User as UserIcon, Settings, LogOut, Wallet } from 'lucide-react'

interface UserMenuProps {
  session: any
}

export function UserMenu({ session }: UserMenuProps) {
  const { data: currentSession } = useSession()
  const userSession = currentSession || session
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

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
    <div className="relative">
      <Button
        variant="ghost"
        className="relative h-10 w-10 rounded-full"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
          {userInitials}
        </div>
      </Button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border">
            <div className="px-4 py-2 border-b">
              <p className="text-sm font-medium text-gray-900">{userSession?.user?.email}</p>
              <p className="text-xs text-gray-500">{userSession?.user?.tier} Member</p>
              <p className="text-xs text-gray-500">Balance: {formatCurrency(userSession?.user?.walletBalance || 0)}</p>
            </div>

            <div className="py-1">
              <a href="/dashboard/profile" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                <UserIcon className="mr-2 h-4 w-4" />
                Profile
              </a>
              <a href="/dashboard/wallet" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                <Wallet className="mr-2 h-4 w-4" />
                Wallet
              </a>
              <a href="/dashboard/settings" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </a>
              <div className="border-t my-1"></div>
              <button
                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                onClick={handleSignOut}
                disabled={loading}
              >
                <LogOut className="mr-2 h-4 w-4" />
                {loading ? 'Signing out...' : 'Sign out'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}