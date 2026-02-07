import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useForm, type FieldValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { projectInsertSchema, projectUpdateSchema } from "@/schemas/projects";
import { useEffect } from "react";
import { createProject, getProject, updateProject } from "@/services/api.projects";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import type { ProjectInsertDTO, ProjectUpdateDTO } from "@/schemas/projects";

const ProjectPage = () => {
    const { projectId } = useParams();
    const isEdit = Boolean(projectId);
    const navigate = useNavigate();

    const schema = isEdit ? projectUpdateSchema : projectInsertSchema;

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<FieldValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: "",
            description: "",
        },
    });

    const getErrorMessage = (fieldName: string): string | undefined => {
        const error = errors[fieldName as keyof typeof errors];
        if (error && typeof error === "object" && "message" in error) {
            return error.message as string;
        }
        return undefined;
    };

    useEffect(() => {
        if (!isEdit || !projectId) return;
        getProject(Number(projectId))
            .then((data) => {
                reset({
                    name: data.name,
                    description: data.description,
                });
            })
            .catch((err) => {
                toast.error(err instanceof Error ? err.message : "Failed to load project");
            });
    }, [isEdit, projectId, reset]);

    const onSubmit = async (data: FieldValues) => {
        try {
            if (isEdit && projectId) {
                await updateProject(Number(projectId), data as ProjectUpdateDTO);
                toast.success("Project updated successfully");
            } else {
                await createProject(data as ProjectInsertDTO);
                toast.success("Project created successfully");
            }
            navigate("/projects");
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Something went wrong");
        }
    };

    useEffect(() => {
        document.title = isEdit ? "TaskFlow - Edit Project" : "TaskFlow - New Project";
    }, [isEdit]);

    return (
        <div className="max-w-2xl mx-auto py-8">
            <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
                <h1 className="text-3xl font-bold mb-8 text-gray-800">
                    {isEdit ? "Edit Project" : "Create New Project"}
                </h1>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                        <Label htmlFor="name" className="text-gray-700 font-medium">
                            Project Name *
                        </Label>
                        <Input
                            id="name"
                            placeholder="e.g., Web Development Coursework"
                            {...register("name")}
                            className="mt-2 border-gray-300"
                        />
                        {getErrorMessage("name") && (
                            <p className="text-red-600 text-sm mt-1">{getErrorMessage("name")}</p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="description" className="text-gray-700 font-medium">
                            Description
                        </Label>
                        <textarea
                            id="description"
                            placeholder="Project description..."
                            {...register("description")}
                            className="mt-2 w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows={4}
                        />
                    </div>

                    <div className="flex gap-3 pt-6">
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                        >
                            {isSubmitting ? "Saving..." : isEdit ? "Update" : "Create"}
                        </Button>
                        <Button
                            type="button"
                            onClick={() => navigate("/projects")}
                            variant="outline"
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProjectPage;