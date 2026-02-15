import { useState } from 'react';
import { useProjects } from '../../context/ProjectContext';
import { Sidebar } from './Sidebar';
import { ProjectCard } from './ProjectCard';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { useNavigate } from 'react-router-dom';

export const Dashboard = () => {
  const { projects, loading, createProject, deleteProject } = useProjects();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [creating, setCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleCreateProject = async () => {
    if (!projectName.trim()) return;

    setCreating(true);
    try {
      const project = await createProject(projectName);
      setIsModalOpen(false);
      setProjectName('');
      navigate(`/workspace/${project.id}`);
    } catch (error) {
      console.error('Error creating project:', error);
      alert('Failed to create project. Please try again.');
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    try {
      await deleteProject(id);
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Failed to delete project. Please try again.');
    }
  };

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Projects</h1>
            <p className="text-gray-600">Create and manage your website projects</p>
          </div>

          {/* Actions bar */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>New Project</span>
            </Button>
          </div>

          {/* Projects grid */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <LoadingSpinner size="lg" />
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-20">
              <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {searchQuery ? 'No projects found' : 'No projects yet'}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchQuery
                  ? 'Try a different search term'
                  : 'Create your first project to get started'}
              </p>
              {!searchQuery && (
                <Button onClick={() => setIsModalOpen(true)}>
                  Create Your First Project
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onDelete={handleDeleteProject}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Project Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setProjectName('');
        }}
        title="Create New Project"
      >
        <div className="space-y-4">
          <Input
            type="text"
            label="Project Name"
            placeholder="My Awesome Website"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleCreateProject();
              }
            }}
          />
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => {
                setIsModalOpen(false);
                setProjectName('');
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateProject}
              loading={creating}
              disabled={!projectName.trim()}
            >
              Create Project
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
