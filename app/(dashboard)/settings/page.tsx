"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function SettingsPage() {
  return (
    <div className="p-6 max-w-3xl mx-auto w-full">
      <h1 className="text-3xl font-bold mb-6">Tənzimləmələr</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Profil və Hesab</CardTitle>
          <CardDescription>
            Tətbiq tənzimləmələri və hesab detalları burada yer alacaq. (Tezliklə!)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-zinc-500">
            Süni intellekt modelləri artıq tamamilə pulsuz və daxili olaraq işləyir. API açarı əlavə etməyə ehtiyac yoxdur.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
