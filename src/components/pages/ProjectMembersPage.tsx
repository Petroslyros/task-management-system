import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { toast } from "sonner";
import { getProjectMembers, removeProjectMember, getProject } from "@/services/api.projects";
import type { ProjectMember, Project } from "@/schemas/projects";
import { Button } from "@/components/ui/button";

const ProjectMembersPage = () => {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const [members, setMembers] = useState<ProjectMember[]>([]);
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!projectId) return;
        loadData();
    }, [projectId]);

    const loadData = async () => {
        if (!projectId) return;
        try {
            setLoading(true);
            const [membersData, projectData] = await Promise.all([
                getProjectMembers(Number(projectId)),
                getProject(Number(projectId)),
            ]);
            setMembers(membersData);
            setProject(projectData);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to load data");
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveMember = async (memberId: number) => {
        if (!projectId || !window.confirm("Remove member?")) return;
        try {
            await removeProjectMember(Number(projectId), memberId);
            setMembers(members.filter((m) => m.id !== memberId));
            toast.success("Member removed");
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to remove member");
        }
    };

    return (
        <div className="py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">
                    {project?.name} - Members
                </h1>
                <Button
                    onClick={() => navigate(`/projects/${projectId}`)}
                    variant="outline"
                >
                    Back to Project
                </Button>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                        <div className="w-12 h-12 rounded-full border-4 border-blue-600 border-t-transparent animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading members...</p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {members.map((member) => (
                        <div key={member.id} className="bg-white rounded-lg shadow p-6 border border-gray-200">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800">{member.username}</h3>
                                    <p className="text-sm text-gray-600">{member.email}</p>
                                </div>
                                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                                    {member.role}
                                </span>
                            </div>

                            {member.role !== "Owner" && (
                                <Button
                                    onClick={() => handleRemoveMember(member.id)}
                                    variant="destructive"
                                    className="w-full"
                                >
                                    Remove
                                </Button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProjectMembersPage;