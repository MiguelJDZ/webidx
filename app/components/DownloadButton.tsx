import React from 'react';
import JSZip from 'jszip';
import { Download } from 'lucide-react';

interface File {
  name: string;
  content: string;
  type: 'file' | 'folder';
  children?: File[];
}

interface DownloadButtonProps {
  files: File[];
}

const DownloadButton: React.FC<DownloadButtonProps> = ({ files }) => {
  const createZip = async (files: File[], zip: JSZip, path: string = '') => {
    for (const file of files) {
      if (file.type === 'file') {
        zip.file(path + file.name, file.content);
      } else if (file.type === 'folder' && file.children) {
        await createZip(file.children, zip, path + file.name + '/');
      }
    }
  };

  const handleDownload = async () => {
    const zip = new JSZip();
    await createZip(files, zip);
    const content = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(content);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'project.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button
      onClick={handleDownload}
      className="flex items-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-2 sm:py-2 sm:px-4 rounded text-xs sm:text-sm"
    >
      <Download className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
      <span className="hidden sm:inline">Download Project</span>
      <span className="sm:hidden">Download</span>
    </button>
  );
};

export default DownloadButton;