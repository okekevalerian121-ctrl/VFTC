'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  Home,
  ListTodo,
  Wallet,
  User,
  Settings,
  FileText,
  TrendingUp
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Available Tasks', href: '/dashboard/tasks', icon: ListTodo },
  { name: 'My Tasks', href: '/dashboard/my-tasks', icon: FileText },
  { name: 'Wallet', href: '/dashboard/wallet', icon: Wallet },
  { name: 'Earnings', href: '/dashboard/earnings', icon: TrendingUp },
  { name: 'Profile', href: '/dashboard/profile', icon: User },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
]

export default function DashboardNav() {
  const pathname = usePathname()

  return (
    <nav className="px-3 py-4">
      <ul className="space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <li key={item.name}>
              <Link
                href={item.href}
                className={cn(
                  'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-gray-700 hover:bg-gray-100'
                )}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}