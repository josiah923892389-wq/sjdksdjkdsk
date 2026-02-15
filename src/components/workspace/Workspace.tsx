import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProjects } from '../../context/ProjectContext';
import { CodeEditor } from './CodeEditor';
import { AIChat } from './AIChat';
import { LivePreview } from './LivePreview';
import { LoadingSpinner } from '../common/LoadingSpinner';

type FileType = 'html' | 'css' | 'js';

export const Workspace = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { projects, currentProject, setCurrentProject, updateProject } = useProjects();
  
  const [activeFile, setActiveFile] = useState<FileType>('html');
  const [html, setHtml] = useState('');
  const [css, setCss] = useState('');
  const [js, setJs] = useState('');
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Load project
  useEffect(() => {
    if (id) {
      const project = projects.find(p => p.id === id);
      if (project) {
        setCurrentProject(project);
        setHtml(project.html);
        setCss(project.css);
        setJs(project.js);
      } else {
        // Project not found, redirect to dashboard
        navigate('/dashboard');
      }
    }
  }, [id, projects, setCurrentProject, navigate]);

  // Auto-save
  useEffect(() => {
    if (!currentProject || !id) return;

    const timer = setTimeout(async () => {
      if (html !== currentProject.html || css !== currentProject.css || js !== currentProject.js) {
        setSaving(true);
        try {
          await updateProject(id, { html, css, js });
          setLastSaved(new Date());
        } catch (error) {
          console.error('Error saving project:', error);
        } finally {
          setSaving(false);
        }
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [html, css, js, currentProject, id, updateProject]);

  const handleCodeGenerated = (code: { html?: string; css?: string; js?: string }) => {
    if (code.html) setHtml(code.html);
    if (code.css) setCss(code.css);
    if (code.js) setJs(code.js);
  };

  const getCurrentFileContent = () => {
    switch (activeFile) {
      case 'html': return html;
      case 'css': return css;
      case 'js': return js;
    }
  };

  const handleFileContentChange = (value: string) => {
    switch (activeFile) {
      case 'html': setHtml(value); break;
      case 'css': setCss(value); break;
      case 'js': setJs(value); break;
    }
  };

  if (!currentProject) {
    return (
      <div className="h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-900">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-gray-300 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h1 className="text-lg font-semibold text-white">{currentProject.name}</h1>
          
          {/* Save status */}
          <div className="text-sm text-gray-400">
            {saving ? (
              <span className="flex items-center space-x-2">
                <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Saving...</span>
              </span>
            ) : lastSaved ? (
              <span>Saved {lastSaved.toLocaleTimeString()}</span>
            ) : null}
          </div>
        </div>

        {/* File tabs */}
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setActiveFile('html')}
            className={`px-4 py-2 rounded-t transition-colors ${
              activeFile === 'html'
                ? 'bg-gray-900 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            index.html
          </button>
          <button
            onClick={() => setActiveFile('css')}
            className={`px-4 py-2 rounded-t transition-colors ${
              activeFile === 'css'
                ? 'bg-gray-900 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            styles.css
          </button>
          <button
            onClick={() => setActiveFile('js')}
            className={`px-4 py-2 rounded-t transition-colors ${
              activeFile === 'js'
                ? 'bg-gray-900 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            script.js
          </button>
        </div>
      </div>

      {/* Main workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* AI Chat - Left */}
        <div className="w-80 border-r border-gray-700 overflow-hidden">
          <AIChat
            onCodeGenerated={handleCodeGenerated}
            currentCode={{ html, css, js }}
          />
        </div>

        {/* Code Editor - Center */}
        <div className="flex-1 overflow-hidden">
          <CodeEditor
            value={getCurrentFileContent()}
            language={activeFile === 'html' ? 'html' : activeFile === 'css' ? 'css' : 'javascript'}
            onChange={handleFileContentChange}
          />
        </div>

        {/* Live Preview - Right */}
        <div className="w-[600px] border-l border-gray-700 overflow-hidden">
          <LivePreview html={html} css={css} js={js} />
        </div>
      </div>
    </div>
  );
};
