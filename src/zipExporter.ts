import JSZip from 'jszip';
import { PROJECT_FILES } from './projectFiles';

/**
 * Packs all project files into a standard Maven project zip archive
 * and triggers immediate browser download.
 */
export async function downloadProjectZip(): Promise<void> {
  const zip = new JSZip();
  const rootFolder = zip.folder('student-management-system');

  if (!rootFolder) {
    throw new Error('Could not create root zip folder');
  }

  for (const file of PROJECT_FILES) {
    rootFolder.file(file.path, file.content);
  }

  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'student-management-system.zip';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
