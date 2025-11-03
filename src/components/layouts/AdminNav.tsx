'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  BarChart3,
  Users,
  ListTodo,
  FileText,
  DollarSign,
  Settings,
  CreditCard,
  MessageSquare
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: BarChart3 },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Tasks', href: '/admin/tasks', icon: ListTodo },
  { name: 'Submissions', href: '/admin/submissions', icon: FileText },
  { name: 'Transactions', href: '/admin/transactions', icon: DollarSign },
  { name: 'Withdrawals', href: '/admin/withdrawals', icon: CreditCard },
  { name: 'Support', href: '/admin/support', icon: MessageSquare },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
]

export default function AdminNav() {
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
                    ? 'bg-red-500 text-white'
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