import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

interface SignupFormProps extends React.ComponentProps<"div"> {
  onSwitchToLogin?: () => void
}

export function SignupForm({ onSwitchToLogin }: SignupFormProps) {
  return (
    <Card className="border-border bg-card shadow-none">
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-xl">Create your account</CardTitle>
        <CardDescription>Enter your details below to get started</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={(e) => e.preventDefault()}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="signup-name">Full Name</FieldLabel>
              <Input id="signup-name" type="text" placeholder="John Doe" required />
            </Field>
            <Field>
              <FieldLabel htmlFor="signup-email">Email</FieldLabel>
              <Input id="signup-email" type="email" placeholder="m@example.com" required />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field>
                <FieldLabel htmlFor="signup-password">Password</FieldLabel>
                <Input id="signup-password" type="password" required />
              </Field>
              <Field>
                <FieldLabel htmlFor="signup-confirm">Confirm</FieldLabel>
                <Input id="signup-confirm" type="password" required />
              </Field>
            </div>
            <FieldDescription>Must be at least 8 characters long.</FieldDescription>
            <Button type="submit" className="w-full">
              Create Account
            </Button>
            <FieldDescription className="text-center">
              Already have an account?{" "}
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="underline underline-offset-2 hover:text-foreground transition-colors"
              >
                Sign in
              </button>
            </FieldDescription>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
