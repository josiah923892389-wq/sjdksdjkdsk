import { useState, useEffect, useRef } from 'react';
import type { DeviceSize } from '../../types';

interface LivePreviewProps {
  html: string;
  css: string;
  js: string;
}

export const LivePreview = ({ html, css, js }: LivePreviewProps) => {
  const [deviceSize, setDeviceSize] = useState<DeviceSize>('desktop');
  const [key, setKey] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const deviceSizes = {
    desktop: { width: '100%', height: '100%' },
    tablet: { width: '768px', height: '1024px' },
    mobile: { width: '375px', height: '667px' },
  };

  const generatePreviewContent = () => {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          ${css}
        </style>
      </head>
      <body>
        ${html}
        <script>
          // Capture console logs
          (function() {
            const originalLog = console.log;
            const originalError = console.error;
            const originalWarn = console.warn;
            
            console.log = function(...args) {
              originalLog.apply(console, args);
              window.parent.postMessage({ type: 'console', method: 'log', args }, '*');
            };
            
            console.error = function(...args) {
              originalError.apply(console, args);
              window.parent.postMessage({ type: 'console', method: 'error', args }, '*');
            };
            
            console.warn = function(...args) {
              originalWarn.apply(console, args);
              window.parent.postMessage({ type: 'console', method: 'warn', args }, '*');
            };
            
            // Catch runtime errors
            window.addEventListener('error', function(e) {
              window.parent.postMessage({ 
                type: 'console', 
                method: 'error', 
                args: [e.message + ' at ' + e.filename + ':' + e.lineno] 
              }, '*');
            });
          })();
          
          ${js}
        </script>
      </body>
      </html>
    `;
  };

  const handleRefresh = () => {
    setKey(prev => prev + 1);
  };

  const handleOpenInNewTab = () => {
    const newWindow = window.open();
    if (newWindow) {
      newWindow.document.write(generatePreviewContent());
      newWindow.document.close();
    }
  };

  useEffect(() => {
    // Auto-refresh with debounce
    const timer = setTimeout(() => {
      setKey(prev => prev + 1);
    }, 500);

    return () => clearTimeout(timer);
  }, [html, css, js]);

  return (
    <div className="h-full flex flex-col bg-gray-100">
      {/* Preview toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-white border-b">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600 font-medium">Preview</span>
          
          {/* Device size toggles */}
          <div className="flex items-center space-x-1 ml-4">
            <button
              onClick={() => setDeviceSize('desktop')}
              className={`p-2 rounded ${
                deviceSize === 'desktop'
                  ? 'bg-primary-100 text-primary-600'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
              title="Desktop"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </button>
            <button
              onClick={() => setDeviceSize('tablet')}
              className={`p-2 rounded ${
                deviceSize === 'tablet'
                  ? 'bg-primary-100 text-primary-600'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
              title="Tablet"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </button>
            <button
              onClick={() => setDeviceSize('mobile')}
              className={`p-2 rounded ${
                deviceSize === 'mobile'
                  ? 'bg-primary-100 text-primary-600'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
              title="Mobile"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleRefresh}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
            title="Refresh"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
          <button
            onClick={handleOpenInNewTab}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
            title="Open in new tab"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </button>
        </div>
      </div>

      {/* Preview content */}
      <div className="flex-1 overflow-auto flex items-center justify-center p-4 bg-gray-200">
        <div
          className="bg-white shadow-lg overflow-hidden"
          style={{
            width: deviceSizes[deviceSize].width,
            height: deviceSizes[deviceSize].height,
            maxWidth: '100%',
            maxHeight: '100%',
          }}
        >
          <iframe
            key={key}
            ref={iframeRef}
            srcDoc={generatePreviewContent()}
            className="w-full h-full border-0"
            sandbox="allow-scripts allow-same-origin allow-forms"
            title="Preview"
          />
        </div>
      </div>
    </div>
  );
};
