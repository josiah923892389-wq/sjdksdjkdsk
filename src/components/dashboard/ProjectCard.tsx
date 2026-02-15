import type { Project } from '../../types';
import { useNavigate } from 'react-router-dom';
import { Button } from '../common/Button';

interface ProjectCardProps {
  project: Project;
  onDelete: (id: string) => void;
}

export const ProjectCard = ({ project, onDelete }: ProjectCardProps) => {
  const navigate = useNavigate();

  const handleOpen = () => {
    navigate(`/workspace/${project.id}`);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this project?')) {
      onDelete(project.id);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 hover:border-primary-500 hover:shadow-lg transition-all duration-300 overflow-hidden group">
      {/* Preview */}
      <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center cursor-pointer" onClick={handleOpen}>
        <div className="text-center">
          <svg className="w-16 h-16 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
          <p className="text-sm text-gray-500">Website Preview</p>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">
          {project.name}
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Updated {formatDate(project.updated_at)}
        </p>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          <Button
            size="sm"
            onClick={handleOpen}
            className="flex-1"
          >
            Open
          </Button>
          <button
            onClick={handleDelete}
            className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete project"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
