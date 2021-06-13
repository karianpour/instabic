import React from "react";
import "./FileChooser.css";

export function FileChooser({
  onSelected,
}: {
  onSelected: (url: string) => void;
}) {
  const [dragOver, setDragOver] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleSelected = (file: File) => {
    onSelected(URL.createObjectURL(file));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleIgnore(e);
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.type === "image/jpeg") {
        handleSelected(file);
      }
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === " " || e.key === "Enter") {
      inputRef.current?.click();
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLInputElement>) => {
    handleIgnore(e);
    setDragOver(false);
    if (e.dataTransfer?.files && e.dataTransfer?.files.length > 0) {
      const file = e.dataTransfer.files[0];
      console.log(file.type);
      if (file.type === "image/jpeg") {
        handleSelected(file);
      }
    }
  };

  const handleIgnore = (e: React.SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleEnter = (e: React.DragEvent<HTMLInputElement>) => {
    handleIgnore(e);
    setDragOver(true);
  };

  const handleLeave = (e: React.DragEvent<HTMLInputElement>) => {
    handleIgnore(e);
    setDragOver(false);
  };

  return (
    <div
      className={`file-chooser__container flex-col center ${
        dragOver ? "file-chooser__container__dragover" : ""
      }`}
      onDragEnter={handleEnter}
      onDragLeave={handleLeave}
      onDragOver={handleEnter}
      onDrop={handleDrop}
    >
      <label tabIndex={0} className="file-chooser__label" onKeyUp={handleKey}>
        <span>
          Click to select a photo
          <br />
          or
          <br />
          drop it here
        </span>
        <input
          type="file"
          accept="image/jpeg"
          onChange={handleChange}
          className="hidden"
          ref={inputRef}
        />
      </label>
    </div>
  );
}
