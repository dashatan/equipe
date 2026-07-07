import { LoginForm } from '@/features/auth/components/LoginForm'

export default function AuthPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/20 p-4">
      <LoginForm />
    </div>
  )
}
