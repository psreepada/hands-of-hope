import { AlertTriangle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface SupabaseConfigErrorProps {
  error?: string
}

export function SupabaseConfigError({ error }: SupabaseConfigErrorProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-6 h-6 text-yellow-600" />
          </div>
          <CardTitle className="text-xl">Configuration Required</CardTitle>
          <CardDescription>
            {error || "The application needs to be configured before it can be used."}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-gray-600">
          <div className="space-y-2">
            <p>To set up this application:</p>
            <ol className="list-decimal list-inside space-y-1 ml-4">
              <li>Create a Supabase project at <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">supabase.com</a></li>
              <li>Get your project URL and anon key from the API settings</li>
              <li>Set the following environment variables:</li>
            </ol>
            <div className="bg-gray-100 p-3 rounded-md font-mono text-xs mt-3">
              <div>NEXT_PUBLIC_SUPABASE_URL=your_url_here</div>
              <div>NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key_here</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
