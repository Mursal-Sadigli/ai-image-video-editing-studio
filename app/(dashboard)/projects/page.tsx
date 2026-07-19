import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getUserProjects } from "@/lib/db/queries/projects";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Plus, FolderOpen, MoreVertical, Calendar } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { az } from "date-fns/locale";
import { CreateProjectDialog } from "@/components/dashboard/create-project-dialog";

export default async function ProjectsPage() {
  const user = await currentUser();
  
  if (!user) {
    redirect("/sign-in");
  }

  // Fetch projects from DB
  const projectsList = await getUserProjects(user.id);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Layihələr</h1>
          <p className="text-muted-foreground mt-1">Bütün işlərinizi bir yerdə idarə edin.</p>
        </div>
        <div>
          <CreateProjectDialog>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Yeni Layihə
            </Button>
          </CreateProjectDialog>
        </div>
      </div>

      {projectsList.length === 0 ? (
        <Card className="border-dashed bg-transparent">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
            <div className="h-12 w-12 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center mb-4">
              <FolderOpen className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">Heç bir layihə yoxdur</h3>
            <p className="max-w-sm mx-auto mb-6">
              İlk layihənizi yaradaraq generasiyalarınızı qruplaşdırmağa başlayın.
            </p>
            <CreateProjectDialog>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Layihə yarat
              </Button>
            </CreateProjectDialog>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {projectsList.map((project) => (
            <Link key={project.id} href={`/projects/${project.id}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer h-full group">
                <CardHeader className="p-4 pb-2 relative">
                  <div className="flex justify-between items-start">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                      <FolderOpen className="h-5 w-5 text-primary" />
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                  <CardTitle className="text-base font-semibold line-clamp-1">{project.name}</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <CardDescription className="line-clamp-2">
                    {project.description || "Təsvir yoxdur"}
                  </CardDescription>
                </CardContent>
                <CardFooter className="p-4 pt-0 text-xs text-muted-foreground flex items-center gap-1.5 mt-auto">
                  <Calendar className="h-3 w-3" />
                  {formatDistanceToNow(new Date(project.updatedAt), { addSuffix: true, locale: az })} yenilənib
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
