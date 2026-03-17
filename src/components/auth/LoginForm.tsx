import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

interface LoginFormProps extends React.ComponentProps<"div"> {
  onSwitchToSignup?: () => void
}

export function LoginForm({ onSwitchToSignup }: LoginFormProps) {
  return (
    <Card className="border-border bg-card shadow-none">
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-xl">Welcome back</CardTitle>
        <CardDescription>Sign in to your account to continue</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={(e) => e.preventDefault()}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="login-email">Email</FieldLabel>
              <Input id="login-email" type="email" placeholder="m@example.com" required />
            </Field>
            <Field>
              <div className="flex items-center justify-between">
                <FieldLabel htmlFor="login-password">Password</FieldLabel>
                <a
                  href="#"
                  className="text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground transition-colors"
                >
                  Forgot password?
                </a>
              </div>
              <Input id="login-password" type="password" required />
            </Field>
            <Button type="submit" className="w-full">
              Sign In
            </Button>
            <FieldDescription className="text-center">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={onSwitchToSignup}
                className="underline underline-offset-2 hover:text-foreground transition-colors"
              >
                Create one
              </button>
            </FieldDescription>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
