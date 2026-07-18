"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

export default function SettingsPage() {
  const [falKey, setFalKey] = useState("")
  const [openaiKey, setOpenaiKey] = useState("")
  const [replicateKey, setReplicateKey] = useState("")
  const [googleKey, setGoogleKey] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null)

  useEffect(() => {
    // Fetch existing keys on load
    fetch("/api/user/settings")
      .then(res => res.json())
      .then(data => {
        if (data.keys) {
          setFalKey(data.keys.falApiKey || "")
          setOpenaiKey(data.keys.openaiApiKey || "")
          setReplicateKey(data.keys.replicateApiKey || "")
          setGoogleKey(data.keys.googleApiKey || "")
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch("/api/user/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ falApiKey: falKey, openaiApiKey: openaiKey, replicateApiKey: replicateKey, googleApiKey: googleKey })
      })

      if (res.ok) {
        setMessage({ type: 'success', text: "API açarlarınız təhlükəsiz şəkildə qeyd olundu." })
        setTimeout(() => setMessage(null), 3000)
      } else {
        throw new Error("Xəta baş verdi")
      }
    } catch (error) {
      setMessage({ type: 'error', text: "Açarlarınızı saxlamaq mümkün olmadı." })
      setTimeout(() => setMessage(null), 3000)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-6 max-w-3xl mx-auto w-full">
      <h1 className="text-3xl font-bold mb-6">Tənzimləmələr</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>API Açarları (Bring Your Own Key)</CardTitle>
          <CardDescription>
            Tətbiqin xidmətlərindən istifadə etmək üçün öz şəxsi API açarlarınızı əlavə edin. Sizin açarlarınız heç bir halda başqaları ilə paylaşılmır.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {message && (
            <div className={`p-3 rounded-md text-sm font-medium ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {message.text}
            </div>
          )}
          {loading ? (
            <div className="flex items-center justify-center p-4"><Loader2 className="animate-spin w-6 h-6 text-zinc-500" /></div>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="fal">Fal.ai API Açarı</Label>
                <Input 
                  id="fal" 
                  type="password" 
                  placeholder="Məsələn: 699477ee-bc8b-4dc4...:03243..."
                  value={falKey}
                  onChange={(e) => setFalKey(e.target.value)}
                />
                <p className="text-sm text-zinc-500">Flux modelləri və sürətli şəkil generasiyası üçün istifadə olunur.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="replicate">Replicate API Açarı</Label>
                <Input 
                  id="replicate" 
                  type="password" 
                  placeholder="r8_..."
                  value={replicateKey}
                  onChange={(e) => setReplicateKey(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="openai">OpenAI API Açarı</Label>
                <Input 
                  id="openai" 
                  type="password" 
                  placeholder="sk-..."
                  value={openaiKey}
                  onChange={(e) => setOpenaiKey(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="google">Google Gemini API Açarı</Label>
                <Input 
                  id="google" 
                  type="password" 
                  placeholder="AIzaSy..."
                  value={googleKey}
                  onChange={(e) => setGoogleKey(e.target.value)}
                />
              </div>
            </>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={handleSave} disabled={loading || saving} className="w-full sm:w-auto">
            {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            Yadda Saxla
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
