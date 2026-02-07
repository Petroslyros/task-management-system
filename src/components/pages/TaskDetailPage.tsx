import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import { getTask, addComment, deleteComment, updateTaskStatus } from "@/services/api.tasks";
import type { Task, TaskCommentReadOnlyDTO } from "@/schemas/tasks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";

const TaskDetailPage = () => {
    const { projectId, taskId } = useParams();
    const { username } = useAuth();
    const [task, setTask] = useState<Task | null>(null);
    const [loading, setLoading] = useState(false);
    const [commentText, setCommentText] = useState("");
    const [submittingComment, setSubmittingComment] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!projectId || !taskId) return;
        loadTask();
    }, [projectId, taskId]);

    const loadTask = async () => {
        if (!projectId || !taskId) return;
        try {
            setLoading(true);
            const data = await getTask(Number(projectId), Number(taskId));
            setTask(data);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to load task");
        } finally {
            setLoading(false);
        }
    };

    const handleAddComment = async () => {
        if (!projectId || !taskId || !commentText.trim()) return;
        try {
            setSubmittingComment(true);
            await addComment(Number(projectId), Number(taskId), { content: commentText });
            setCommentText("");
            await loadTask();
            toast.success("Comment added");
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to add comment");
        } finally {
            setSubmittingComment(false);
        }
    };

    const handleDeleteComment = async (commentId: number) => {
        if (!projectId || !taskId || !window.confirm("Delete comment?")) return;
        try {
            await deleteComment(Number(projectId), Number(taskId), commentId);
            await loadTask();
            toast.success("Comment deleted");
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to delete comment");
        }
    };

    const handleStatusChange = async (newStatus: string) => {
        if (!projectId || !taskId) return;
        try {
            await updateTaskStatus(Number(projectId), Number(taskId), newStatus);
            await loadTask();
            toast.success("Status updated");
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to update status");
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="w-12 h-12 rounded-full border-4 border-blue-600 border-t-transparent animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading task...</p>
                </div>
            </div>
        );
    }

    if (!task) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-600">Task not found</p>
                <Button
                    onClick={() => navigate(`/projects/${projectId}/tasks`)}
                    className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
                >
                    Back to Tasks
                </Button>
            </div>
        );
    }

    return (
        <div className="py-8 container mx-auto px-4">
            <Button
                onClick={() => navigate(`/projects/${projectId}/tasks`)}
                variant="outline"
                className="mb-6"
            >
                ← Back to Tasks
            </Button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
                        <h1 className="text-3xl font-bold text-gray-800 mb-4">{task.title}</h1>
                        <p className="text-gray-600 mb-6">{task.description}</p>

                        <div className="flex gap-4 mb-6">
                            <select
                                value={task.status}
                                onChange={(e) => handleStatusChange(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="Backlog">Backlog</option>
                                <option value="InProgress">In Progress</option>
                                <option value="Review">Review</option>
                                <option value="Done">Done</option>
                            </select>

                            <Button
                                onClick={() => navigate(`/projects/${projectId}/tasks/${taskId}/edit`)}
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                                Edit
                            </Button>
                        </div>
                    </div>

                    {/* Comments Section */}
                    <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Comments ({task.commentCount})</h2>

                        {/* Add Comment */}
                        <div className="mb-6">
                            <div className="flex gap-2">
                                <Input
                                    placeholder="Add a comment..."
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                    onKeyPress={(e) => e.key === "Enter" && handleAddComment()}
                                    className="flex-1 border-gray-300"
                                />
                                <Button
                                    onClick={handleAddComment}
                                    disabled={submittingComment || !commentText.trim()}
                                    className="bg-blue-600 hover:bg-blue-700 text-white"
                                >
                                    {submittingComment ? "..." : "Post"}
                                </Button>
                            </div>
                        </div>

                        {/* Comments List */}
                        <div className="space-y-4">
                            {task.comments.length === 0 ? (
                                <p className="text-gray-500 text-center py-4">No comments yet</p>
                            ) : (
                                task.comments.map((comment: TaskCommentReadOnlyDTO) => (
                                    <div key={comment.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <p className="font-semibold text-gray-800">{comment.username}</p>
                                                <p className="text-xs text-gray-500">
                                                    {new Date(comment.createdDate).toLocaleString()}
                                                </p>
                                            </div>
                                            {comment.username === username && (
                                                <Button
                                                    onClick={() => handleDeleteComment(comment.id)}
                                                    size="sm"
                                                    variant="destructive"
                                                >
                                                    Delete
                                                </Button>
                                            )}
                                        </div>
                                        <p className="text-gray-700">{comment.content}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
                        <h3 className="font-semibold text-gray-800 mb-4">Task Details</h3>
                        <div className="space-y-3 text-sm">
                            <div>
                                <p className="text-gray-600">Status</p>
                                <p className="font-medium text-gray-800">{task.status}</p>
                            </div>
                            <div>
                                <p className="text-gray-600">Priority</p>
                                <p className="font-medium text-gray-800">{task.priority}</p>
                            </div>
                            <div>
                                <p className="text-gray-600">Assigned To</p>
                                <p className="font-medium text-gray-800">{task.assignedToUsername || "Unassigned"}</p>
                            </div>
                            {task.dueDate && (
                                <div>
                                    <p className="text-gray-600">Due Date</p>
                                    <p className="font-medium text-gray-800">{new Date(task.dueDate).toLocaleDateString()}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskDetailPage;