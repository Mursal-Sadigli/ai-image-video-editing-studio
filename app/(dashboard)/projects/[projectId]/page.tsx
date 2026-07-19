import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getProjectById, getProjectGenerations } from "@/lib/db/queries/projects";
import { users } from "@/lib/db/schema";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { az } from "date-fns/locale";

export default async function ProjectDetailsPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const userDb = await db.select().from(users).where(eq(users.clerkId, user.id)).limit(1);
  if (!userDb.length) redirect("/sign-in");

  const project = await getProjectById(projectId, userDb[0].id);
  
  if (!project) {
    redirect("/projects"); // Yaxud xəta səhifəsinə yönləndir
  }

  const generations = await getProjectGenerations(projectId, userDb[0].id);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Link href="/projects" className="text-sm text-muted-foreground flex items-center mb-2 hover:text-foreground">
            <ArrowLeft className="mr-1 h-3 w-3" />
            Layihələrə qayıt
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
          {project.description && (
            <p className="text-muted-foreground mt-1 max-w-2xl">{project.description}</p>
          )}
          <p className="text-xs text-muted-foreground mt-2">
            Son yenilənmə: {formatDistanceToNow(new Date(project.updatedAt), { addSuffix: true, locale: az })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Edit className="mr-2 h-4 w-4" />
            Redaktə et
          </Button>
          <Button variant="destructive" size="sm">
            <Trash2 className="mr-2 h-4 w-4" />
            Sil
          </Button>
        </div>
      </div>

      {/* Generations Grid */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Generasiyalar ({generations.length})</h2>
        {generations.length === 0 ? (
          <div className="p-12 text-center bg-zinc-50 dark:bg-zinc-900 rounded-lg border border-dashed">
            <p className="text-muted-foreground">Bu layihədə heç bir generasiya yoxdur.</p>
            <Button variant="link" asChild className="mt-2">
              <Link href="/studio">Studiya keç</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {generations.map((gen) => (
              <div key={gen.id} className="relative group rounded-lg overflow-hidden border bg-background aspect-square">
                {/* Bu hissəyə şəkli əlavə edəcəyik, hazırda placeholder qoyuruq */}
                <div className="absolute inset-0 bg-muted flex items-center justify-center">
                  <span className="text-xs text-muted-foreground">{gen.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
