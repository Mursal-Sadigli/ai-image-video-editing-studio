# Agent Prompt: AI Image & Video Editing Studio

Bu sənəd bir kodlama agentinə (Claude Code, Cursor Agent, Devin və s.) verilmək üçün hazırlanmış tam layihə brifidir. Agent bu sənədi oxuyandan sonra layihənin nə olduğunu, istifadəçilərin onu necə istifadə edəcəyini, necə qurulmalı olduğunu və hansı standartlara riayət etməli olduğunu tam anlamalıdır.

---

## 1. Layihənin mahiyyəti və mövqeləndirmə

**Bu, adi bir "AI image generator" deyil.** Əsas differensasiya nöqtəsi: **hədəf — real fotodan seçilməyən, hyper-realistic şəkil və video generasiyasıdır.** Bütün texniki qərarlar (AI provider seçimi, prompt engineering, post-processing pipeline) bu məqsədə tabe olmalıdır.

- Şəkil/video "AI görünüşlü" olmamalıdır — dəri toxuması, işıqlandırma, kölgələr, mimika təbii olmalıdır.
- Marketinq mesajı, UI mətnləri, feature adları bu mövqeni vurğulamalıdır ("Photorealistic AI", "Hyper-realistic results" kimi).
- Texniki qərarlar (hansı AI model istifadə olunur, hansı post-processing addımları əlavə olunur) bu prioritetə əsaslanmalıdır.

### Kimlər üçündür (hədəf istifadəçi profilləri)

- **E-commerce satıcıları** — məhsul şəkillərini professional studio keyfiyyətinə çatdırmaq (arxa fon dəyişimi, upscale)
- **Content creator / sosial media menecerləri** — sürətli, keyfiyyətli vizual məzmun istehsalı
- **Marketinq agentlikləri** — kampaniya üçün kütləvi, fərdiləşdirilmiş vizual istehsal
- **Fotoqraflar / dizaynerlər** — post-production işini sürətləndirmək (object removal, upscale, retouch)
- **Kiçik bizneslər** — bahalı foto çəkilişə ehtiyac qalmadan professional görüntü əldə etmək

### İstifadəçinin əsas problemi, biz necə həll edirik

İstifadəçi ya bahalı foto/video çəkilişinə pul xərcləmək, ya da "süni görünən" ucuz AI alətlərindən istifadə etmək məcburiyyətindədir. Bu platforma bu ikisinin arasındakı boşluğu doldurur: **studio keyfiyyətli nəticəni, bir neçə dəqiqədə, bir promptla.**

## 2. İstifadəçi səyahəti (User Journey) — addım-addım

Bu bölmə istifadəçinin platformada konkret olaraq nə edəcəyini təsvir edir. Agent UI/UX qərarlarını bu axına əsaslanaraq qurmalıdır.

### 2.1. Kəşf və qeydiyyat

1. İstifadəçi landing page-ə düşür (üzvi axtarış, reklam, sosial media)
2. Hero bölmədə before/after nümunələrlə "inanır"
3. "Pulsuz başla" düyməsinə basır → Clerk qeydiyyat modalı açılır (email və ya Google/Apple ilə)
4. Qeydiyyatdan sonra avtomatik `users` cədvəlində qeyd yaradılır (Clerk webhook), başlanğıc pulsuz credit verilir (məs. 20 credit)
5. İlk dəfə daxil olanda qısa onboarding: 2-3 addımlı tooltip tur ("Budur Studio", "Budur credit balansın", "İlk şəklini yarat")

### 2.2. Əsas istifadə dövrü

1. İstifadəçi Dashboard-a düşür, ya birbaşa Studio-ya keçir, ya da mövcud layihəsini açır
2. Studio-da alət seçir (məs. Image Generation), prompt yazır, parametrləri tənzimləyir
3. "Generate" düyməsinə basır → credit dəyəri əvvəlcədən göstərilir, təsdiqlədikdən sonra proses başlayır
4. Progress indiqator göstərilir (queued → processing → completed)
5. Nəticə hazır olanda önizləmə göstərilir, istifadəçi: yükləyə bilər, layihəyə saxlaya bilər, paylaşa bilər, yenidən redaktə edə bilər (upscale, bg-removal əlavə tətbiq etmək kimi)
6. Nəticə avtomatik `History`-ə düşür

### 2.3. Layihə idarəetməsi

- İstifadəçi bir neçə generasiyanı bir "Project" altında qruplaşdıra bilər (məs. "Yay kampaniyası 2026")
- Layihə daxilində bütün generasiyaları görə, silə, yenidən adlandıra bilər

### 2.4. Komanda işi (Team Workspace)

- Pro/Business plan istifadəçiləri komanda yarada, üzv dəvət edə bilər
- Komanda credit balansını paylaşır, layihələr komanda daxilində görünən olur
- Rol əsaslı icazələr: owner (tam nəzarət), admin (üzv idarəetməsi), editor (generasiya edə bilər), viewer (yalnız baxış)

### 2.5. Ödəniş və subscription

- İstifadəçi credit bitəndə ya birbaşa credit pack alır, ya da planını yüksəldir (upgrade)
- Stripe Checkout vasitəsilə ödəniş, uğurlu ödənişdən sonra credit balansı avtomatik yenilənir
- Billing səhifəsində keçmiş ödənişlər, invoice-lar görünür

### 2.6. Paylaşım

- İstifadəçi generasiya olunmuş nəticəni ictimai link vasitəsilə paylaşa bilər (məs. müştəriyə göstərmək üçün)
- Link opsional olaraq parol qoruması və ya son istifadə tarixi ilə məhdudlaşdırıla bilər

---

## 3. Əsas funksionallıqlar (Feature Scope)

| Modul                 | Təsvir                                                            |
| --------------------- | ----------------------------------------------------------------- |
| AI Image Generation   | Text-to-image, fotorealistik nəticə                               |
| AI Image-to-Image     | Mövcud şəkli transformasiya, stil dəyişimi, real toxuma qorunaraq |
| AI Video Generation   | Text/image-to-video                                               |
| AI Video Editing      | Video üzərində AI dəstəkli redaktə                                |
| AI Background Removal | Avtomatik arxa fon çıxarılması                                    |
| AI Upscaler           | Aşağı keyfiyyətli şəkli yüksək rezolyusiyaya yüksəltmə            |
| AI Object Removal     | Şəkildən istənməyən obyektlərin silinməsi                         |
| Credits sistemi       | Ledger əsaslı istifadə haqqı sistemi                              |
| Stripe Subscription   | Planlar (Free/Starter/Pro/Business) + credit pack satışı          |
| Team Workspace        | Komanda üzvləri, rol əsaslı icazələr                              |
| File Storage          | ImageKit.io əsaslı fayl idarəetməsi                               |
| History & Projects    | Bütün generasiyaların tarixçəsi, layihə əsaslı qruplaşdırma       |
| Share Link            | Public/parol qorunan paylaşım linkləri                            |
| Admin Panel           | İstifadəçi, ödəniş, sistem idarəetməsi                            |
| Analytics             | İstifadə statistikası, gəlir izləmə                               |

---

## 4. Landing Page — bölmə-bölmə tam təsvir

Landing page-in məqsədi: **ziyarətçini 30 saniyə ərzində inandırmaq ki, bu, real fərq yaradan alətdir**, sonra qeydiyyata yönləndirmək. Aşağıdakı sıra ilə bölmələr qurulmalıdır:

1. **Announcement bar** (opsional) — "Yeni: AI Video Generation artıq mövcuddur" kimi qısa banner, bağlana bilən
2. **Navbar** — logo, Features/Pricing/Blog linkləri, "Giriş" və "Pulsuz başla" düymələri (sağda, CTA daha vurğulu)
3. **Hero** — güclü başlıq (realizmi vurğulayan), qısa alt-mətn, əsas CTA düyməsi + "Demo-ya bax" ikinci düymə, arxa planda canlı before/after nümunə və ya video
4. **Realism comparison** — "Hansı real, hansı AI?" interaktiv bölmə, ziyarətçinin gözü ilə inandırma
5. **Logo cloud / sosial sübut** — "X şirkət/istifadəçi bizə güvənir" (əgər hələ yoxdursa, bu bölmə sonraya saxlanıla bilər)
6. **Before/After slider showcase** — bir neçə kateqoriyada (portret, məhsul, mənzərə) canlı müqayisə
7. **Features grid** — 7 əsas AI alətinin hər biri üçün ikon + qısa başlıq + 1 cümləlik izah, kart şəklində
8. **How it works** — 3 addımlı sadə proses izahı (1. Prompt yaz və ya şəkil yüklə → 2. AI generasiya edir → 3. Yüklə/paylaş)
9. **Feature showcase (deep-dive)** — ən güclü 2-3 xüsusiyyətin (məs. Image Generation, Video Generation) ekran görüntüsü ilə geniş izahı
10. **Zoom detail showcase** — şəkil detallarına yaxınlaşaraq realizmi göstərən bölmə (dəri toxuması, işıq effektləri)
11. **Use cases** — "Kimlər üçün?" (e-commerce, content creator, agentlik) kart şəklində, hər biri müvafiq feature səhifəsinə keçid verir
12. **Testimonials** — istifadəçi rəyləri, mümkünsə foto/adı ilə
13. **Stats counter** — "X milyon generasiya", "X ölkədə istifadə olunur" kimi etibar artıran rəqəmlər
14. **Pricing preview** — qısa, 3 planın kart şəklində müqayisəsi, "Bütün planlara bax" linki ilə tam pricing səhifəsinə yönləndirmə
15. **FAQ** — accordion şəklində, ən çox verilən suallar (credit necə işləyir, ləğv etmək mümkündürmü, hüquqlar kimə aiddir və s.)
16. **CTA banner** — səhifənin sonunda böyük, aydın "İndi başla" çağırışı
17. **Footer** — sitemap linkləri (Features, Pricing, Blog, Legal, Contact), sosial media ikonları, copyright

### Ayrıca marketing səhifələri (navbar/footer-dən əlçatan)

- `/pricing` — tam qiymət planları + credit pack-lar + müqayisə cədvəli
- `/features/[tool]` — hər AI aləti üçün ayrıca SEO-optimallaşdırılmış səhifə
- `/use-cases/[type]` — hədəf auditoriyaya görə ayrıca səhifələr
- `/blog` — content marketing üçün məqalə siyahısı və tək məqalə səhifələri
- `/changelog` — yeniliklərin izlənməsi
- `/about`, `/contact`
- `/legal/{terms,privacy,refund-policy}`

---

## 5. Dashboard və Sidebar — tam struktur

İstifadəçi qeydiyyatdan keçəndən sonra düşdüyü əsas mühit budur. Sidebar sabit, sol tərəfdə, collapse oluna bilən olmalıdır (shadcn `sidebar` komponenti ilə).

### Sidebar naviqasiyası (yuxarıdan aşağı)

```
[Logo / Workspace seçici (əgər team varsa, dropdown ilə team dəyişmək)]

── Əsas ──
📊 Dashboard              → ümumi icmal
🎨 Studio                 → alt-menyu açılır (aşağıda)
📁 Projects               → bütün layihələr
🕓 History                → bütün keçmiş generasiyalar

── Studio alt-menyusu (Studio üzərinə klikləyəndə açılır) ──
   🖼️ Image Generation
   🔄 Image-to-Image
   🎬 Video Generation
   ✂️ Video Editing
   🪄 Background Removal
   📈 Upscaler
   🧹 Object Removal

── Komanda ──
👥 Team                   → yalnız Pro/Business planında görünür
🔗 Shared Links           → istifadəçinin yaratdığı bütün share link-lər

── Alt hissə (sidebar-ın aşağısında sabit) ──
💳 Credits balansı göstəricisi + "Credit al" düyməsi
⚙️ Settings
❓ Help / Support
👤 User menu (avatar, profil, çıxış)
```

**Admin olan istifadəçilər üçün** sidebar-ın altında əlavə "Admin Panel" linki görünür (yalnız `role === 'admin'` olduqda).

### Dashboard ana səhifəsi (`/dashboard`) — məzmunu

1. **Xoş gəldin başlığı** — istifadəçinin adı, qısa salamlama
2. **Credit balansı kartı** — qalan credit, bu ay istifadə olunan miqdar, "Credit al" düyməsi
3. **Sürətli başlanğıc** — 7 AI alətinin kiçik ikonlu kartları, birbaşa Studio-ya keçid
4. **Son layihələr** — 4-6 ən son layihənin şəkil önizləməsi ilə grid
5. **Son generasiyalar** — kiçik horizontal scroll şəklində son 10 generasiya
6. **İstifadə statistikası qrafiki** — son 30 gün ərzində neçə generasiya edilib (chart.js/recharts ilə sadə line/bar chart)
7. **Plan statusu** — hazırkı plan, yenilənmə tarixi, "Planı yüksəlt" CTA (əgər Free plandadırsa)

---

## 6. Studio — hər alətin iş prinsipi

Studio, platformanın "iş sahəsidir". Hər alət oxşar UI pattern-i izləməlidir ki, istifadəçi bir dəfə öyrənəndən sonra hamısını intuitiv istifadə etsin.

### Ümumi Studio layout-u (bütün alətlər üçün)

```
┌─────────────────────────────────────────────────┐
│  Sol panel (parametrlər)   │   Sağ panel (nəticə) │
│  ─────────────────────     │   ──────────────────  │
│  - Prompt / şəkil yükləmə   │   - Boş vəziyyətdə:   │
│  - Stil seçimi              │     "Nəticə burada    │
│  - Aspect ratio             │      görünəcək"       │
│  - Keyfiyyət/resolution     │   - Generasiya vaxtı: │
│  - Əlavə parametrlər        │     progress bar      │
│  - Credit dəyəri göstəricisi│   - Hazır olanda:      │
│  - [Generate] düyməsi       │     önizləmə + yüklə/  │
│                             │     saxla/paylaş       │
└─────────────────────────────────────────────────┘
       Aşağıda: bu sessiyada edilən son generasiyalar (kiçik thumbnail sırası)
```

### Alət-spesifik təfərrüatlar

- **Image Generation:** Prompt sahəsi (uzun mətn dəstəyi), stil presetləri (photorealistic, cinematic, studio-lighting və s. — amma defolt həmişə fotorealizmə əyilir), aspect ratio seçimi (1:1, 16:9, 9:16, 4:3), neçə variant generasiya olunacağı (1/2/4)
- **Image-to-Image:** Şəkil yükləmə (drag-drop), transformasiya gücü slider-i (nə qədər orijinala sadiq qalsın), prompt (istəyə uyğun dəyişiklik təsviri)
- **Video Generation:** Prompt və ya başlanğıc şəkil, video müddəti seçimi (5s/10s), aspect ratio, kamera hərəkəti presetləri (əgər provider dəstəkləyirsə)
- **Video Editing:** Video yükləmə, redaktə növü seçimi (trim, style transfer, obyekt izləmə və s. — provider imkanlarına bağlıdır)
- **Background Removal:** Şəkil yükləmə, avtomatik emal, nəticədə şəffaf/ağ/xüsusi rəng arxa fon seçimi
- **Upscaler:** Şəkil yükləmə, hədəf rezolyusiya seçimi (2x, 4x), "face enhance" toggle (üz detallarını yaxşılaşdırmaq üçün)
- **Object Removal:** Şəkil yükləmə, fırça vasitəsilə silinəcək sahəni işarələmə (canvas-based mask tool), AI həmin sahəni doldurur

### Generasiya zamanı UX prinsipləri

- Credit dəyəri **generasiyadan əvvəl** aydın göstərilməlidir, sürprizlə istifadəçini qarşılamaq olmaz
- Balans kifayət etmirsə, "Generate" düyməsi deaktiv olmaq əvəzinə klikləndikdə credit alma modalına yönləndirməlidir
- Uzun sürən generasiyalarda (video) istifadəçi səhifəni tərk edə bilər, nəticə hazır olanda bildiriş (in-app + email) göndərilməlidir
- Hər nəticənin yanında sürətli əməliyyatlar: yüklə, paylaş, layihəyə əlavə et, silə, "yenidən bu parametrlərlə generasiya et"

---

## 7. Digər vacib səhifə və funksiyalar

- **Projects səhifəsi:** Grid/list görünüş keçidi, axtarış, filtrasiya (tarix, tip), yeni layihə yaratma
- **History səhifəsi:** Bütün generasiyaların xronoloji siyahısı, tip üzrə filtr (image/video/bg-removal və s.), status filtri (completed/failed)
- **Team səhifəsi:** Üzv siyahısı, rol dəyişdirmə, dəvət göndərmə (email ilə), credit istifadəsi üzvlər üzrə bölgü
- **Billing səhifəsi:** Hazırkı plan, keçmiş invoice-lar, credit pack alma, plan dəyişdirmə/ləğv etmə
- **Settings səhifəsi:** Profil məlumatları, şifrə/auth idarəetməsi (Clerk vasitəsilə), bildiriş seçimləri, API açarları (əgər gələcəkdə public API təklif olunacaqsa)
- **Admin Panel:**
  - Users idarəetməsi (axtarış, bloklama, credit əl ilə düzəliş)
  - Transactions/Revenue icmalı
  - Analytics dashboard (istifadə, gəlir, aktiv istifadəçi qrafikləri)
  - Sistem sağlamlığı (uğursuz generasiyalar, AI provider xətaları)

---

## 8. Texniki Stack (məcburi)

```
Framework:        Next.js 16 (App Router, Server Components default)
Dil:               TypeScript (strict mode)
UI:                shadcn/ui (style: new-york, base color: zinc, CSS variables: yes)
Auth:              Clerk
Ödəniş:            Stripe (Subscriptions + one-off credit packs)
Fayl saxlama:      ImageKit.io
Verilənlər bazası: PostgreSQL (Neon, serverless)
ORM:               Drizzle ORM
Queue/Background:  Inngest (AI generation asinxron emalı üçün)
State (server):    TanStack Query (React Query)
State (client):    Zustand (yalnız kompleks UI state üçün)
Validasiya:        Zod (form + API input)
Email:             Resend + React Email
İkonlar:           lucide-react (shadcn defolt)
Animasiya:         Framer Motion (marketing səhifələr üçün)
Paket meneceri:    pnpm
```

**Dizayn dili:** Ağ, təmiz, müasir (minimal). Gradient, kölgə, dekorativ effektlər minimuma endirilməli. Boşluqdan (whitespace) səxavətlə istifadə edilməli. `shadcn` "new-york" style-ı bu istiqamətə uyğundur.

---

## 9. Layihə strukturu

Aşağıdakı qovluq strukturuna **ciddi şəkildə** riayət et. Route group-lar (`(marketing)`, `(auth)`, `(dashboard)`, `(admin)`) URL-ə təsir etmir, məntiqi ayırma üçündür.

```
app/
├── (marketing)/                 # Landing, pricing, blog, features, legal
├── (auth)/                      # Clerk sign-in / sign-up
├── (dashboard)/                 # Studio, projects, history, team, billing, settings
├── (admin)/                     # Admin-only panel
├── share/[token]/               # Public share link görünüşü
├── api/
│   ├── webhooks/{clerk,stripe}/
│   ├── ai/{generate-image,generate-video,image-to-image,video-editing,
│   │        remove-background,upscale,remove-object,status/[jobId]}/
│   ├── credits/{balance,history}/
│   ├── projects/, files/, share/, team/
│
components/
├── ui/                           # shadcn generated — əl ilə redaktə etmə
├── studio/                       # AI tool interfeysləri
├── dashboard/, admin/, billing/, marketing/, shared/
│
lib/
├── db/{index.ts, schema.ts, queries/}
├── ai/{providers/, agents/, credit-costs.ts}
├── stripe/, imagekit/, clerk/, validations/, utils/
│
hooks/, types/, config/, drizzle/migrations/
```

Tam detallı struktur üçün əlavə edilmiş `ai-studio-architecture.md` sənədinə istinad et (əgər mövcuddursa).

---

## 10. Verilənlər bazası

Neon PostgreSQL sxemi əvvəlcədən hazırlanıb (bax: `ai-studio-architecture.md`). Agent bu sxemə **tam uyğun** Drizzle ORM `schema.ts` faylını yaratmalıdır. Əsas cədvəllər:

`users`, `teams`, `team_members`, `team_invites`, `subscriptions`, `credit_transactions`, `credit_packs`, `projects`, `files`, `generations`, `share_links`, `analytics_events`, `daily_usage_stats`, `admin_audit_logs`.

**Kritik qayda:** `credits_balance` heç vaxt birbaşa update olunmamalıdır — hər dəyişiklik `credit_transactions` cədvəlinə ledger yazısı kimi əlavə olunmalı, balans bu yazılardan hesablanmalı və ya trigger/application-level transaction ilə sync olunmalıdır.

---

## 11. AI Generation axını (memarlıq qaydası)

Video/şəkil generasiyası uzun çəkə bilər (10san–5dəq) — **heç vaxt sync API route-da gözləmə**. Axın belə olmalıdır:

1. İstifadəçi request göndərir → API route credit balansını yoxlayır → `generations` cədvəlinə `status: 'queued'` yazısı yaradılır
2. Inngest event trigger olunur, arxa planda AI provider çağırılır
3. Nəticə hazır olanda `generations.status` → `completed`/`failed` yenilənir, fayl ImageKit-ə yüklənir, `files` cədvəlinə yazılır
4. Client tərəf TanStack Query ilə polling və ya webhook-driven update ilə nəticəni göstərir
5. Credit yalnız uğurlu generasiyadan sonra çıxılır (uğursuz olsa, refund/heç çıxılmır)

---

## 12. Kodlama standartları

- **TypeScript strict mode**, `any` tipindən qaçın.
- Server Components defolt olsun, `"use client"` yalnız lazım olduqda (interaktivlik, hook istifadəsi).
- Bütün API route-larda **Zod ilə input validasiyası məcburidir**.
- Bütün form-lar `react-hook-form` + `zodResolver` ilə qurulmalıdır.
- Component adları `PascalCase`, fayl adları `kebab-case`.
- Hər AI API route-da: auth yoxlaması (Clerk) → credit yoxlaması → validasiya → əməliyyat. Bu sıra pozulmamalıdır.
- `components/ui/` qovluğuna əl ilə dəyişiklik etmə — yalnız `shadcn add` ilə idarə et.
- Server-side error-lar loglanmalı (Sentry inteqrasiyası nəzərdə tutulur, hələ optional).
- Bütün pul/credit əməliyyatları database transaction daxilində icra olunmalıdır (atomicity).

---

## 13. Təhlükəsizlik tələbləri

- Admin panelə giriş `middleware.ts`-də `role === 'admin'` yoxlaması ilə qorunmalıdır.
- Stripe webhook-ları signature verification olmadan **qəbul edilməməlidir**.
- Rate limiting (Upstash) ictimai/pulsuz endpoint-lərdə tətbiq olunmalıdır.
- İstifadəçi yüklədiyi fayllar ImageKit-ə göndərilməzdən əvvəl tip/ölçü validasiyasından keçməlidir.
- Share link-lər üçün `expires_at` və opsional parol dəstəyi tətbiq olunmalıdır.

---

## 14. İnkişaf prioritetləri (mərhələli yanaşma)

Agent layihəni bu ardıcıllıqla qurmalıdır, hər mərhələ əvvəlkindən asılıdır:

1. **Fundament:** Next.js layihə qurulumu, shadcn init, Drizzle + Neon bağlantısı, `.env` strukturu
2. **Auth:** Clerk inteqrasiyası, `users` cədvəli ilə webhook sync
3. **Layout:** Dashboard sidebar/layout, marketing layout (ayrı-ayrı)
4. **Core DB əməliyyatları:** Projects, files CRUD
5. **Bir AI tool tam axını:** Yalnız `image-generation`-u başdan-sona (UI → API → Inngest → credit deduction → history) tam işlək hala gətir, sonra qalan alətlər eyni pattern-i təkrarlayır
6. **Credits + Stripe:** Subscription axını, webhook handler-lər
7. **Qalan AI alətləri:** Eyni pattern üzrə əlavə et
8. **Team Workspace**
9. **Admin panel + Analytics**
10. **Marketing/landing səhifələr**
11. **Polish:** Email bildirişləri, rate limiting, error tracking

**Vacib qayda:** Agent bütün layihəni bir dəfəyə yazmağa cəhd etməməlidir. Hər mərhələdən sonra dayanıb, işlək vəziyyəti təsdiqləməlidir.

---

## 15. Environment Variables (nümunə)

```env
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
CLERK_WEBHOOK_SECRET=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=

# Neon
DATABASE_URL=

# ImageKit
IMAGEKIT_PUBLIC_KEY=
IMAGEKIT_PRIVATE_KEY=
IMAGEKIT_URL_ENDPOINT=

# AI Providers (seçiləcək provider-ə görə doldurulacaq)
AI_IMAGE_PROVIDER_API_KEY=
AI_VIDEO_PROVIDER_API_KEY=

# Inngest
INNGEST_EVENT_KEY=
INNGEST_SIGNING_KEY=

# Resend
RESEND_API_KEY=

# Upstash (rate limiting)
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

---

## 16. Nəyi ETMƏMƏLİ

- shadcn `components/ui` fayllarını əl ilə modifikasiya etmə.
- AI generation-ı sync API route-da işlətmə (timeout riski).
- Credit balansını birbaşa `UPDATE users SET credits_balance = ...` ilə dəyişmə — ledger vasitəsilə et.
- Stripe secret key-ləri və ya digər həssas dəyərləri client-side koda yazma.
- `localStorage`/`sessionStorage`-dan həssas data (token, credit balansı) saxlamaq üçün istifadə etmə — server-source-of-truth olmalıdır.
- Bir mərhələni bitirmədən növbətinə keçmə (məs. auth işləmədən dashboard UI-a keçmə).

---

## Agentə son təlimat

Bu sənədi oxuduqdan sonra, əvvəlcə **14-cü bənddəki mərhələ 1 və 2-ni** (Fundament + Auth) tamamla, sonra dayanıb nəticəni bildir. Hər addımda etdiyin dəyişiklikləri qısaca izah et, amma lazımsız uzun izahatlardan qaçın — kod və struktur özü danışmalıdır.
