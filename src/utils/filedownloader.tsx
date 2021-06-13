export function downloadUrl(url: string, filename: string) {
  const a = document.createElement('a');
  
  a.href = url;
  a.download = filename || 'download';
  
  const clickHandler = () => {
    setTimeout(() => {
      URL.revokeObjectURL(url);
      a.removeEventListener('click', clickHandler);
    }, 150);
  };
  
  a.addEventListener('click', clickHandler, false);
  
  a.click();
  
  return a;
}