import React from "react";
import CloseIcon from "../icons/CloseIcon";
import "./ImageFilter.css";

export default function ImageFilter({onClose}:{onClose: ()=> void}) {
  const [url, setUrl] = React.useState("");

  const handleSelected = (url: string)=>{
    setUrl(url);
  }

  const handleClose = () => {
    if(url){
      setUrl("");
    }else{
      onClose();
    }
  }

  return (
    <>
      <header className="filter__header flex-row">
        <div className="spacer" />
        <button className="icon-button" onClick={handleClose}>
          <CloseIcon />
        </button>
      </header>
      <section className="filter__content flex-col">
        {!url && <FileChooser onSelected={handleSelected}/>}
        {/* {url && <Filter url={url}/>} */}
      </section>
    </>
  );
}

function FileChooser({onSelected}:{onSelected: (url: string)=>void}) {
  const [dragOver, setDragOver] = React.useState(false);

  const handleSelected = (file: File) => {
    onSelected(URL.createObjectURL(file));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleIgnore(e);
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if(file.type==='image/jpeg'){
        handleSelected(file);
      }
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLInputElement>) => {
    handleIgnore(e);
    setDragOver(false);
    if(e.dataTransfer?.files && e.dataTransfer?.files.length > 0){
      const file = e.dataTransfer.files[0];
      console.log(file.type)
      if(file.type==='image/jpeg'){
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
      className={`filter__chooser-container flex-col center ${
        dragOver ? "filter__chooser-container__dragover" : ""
      }`}
      onDragEnter={handleEnter}
      onDragLeave={handleLeave}
      onDragOver={handleEnter}
      onDrop={handleDrop}
    >
      <label
        className="filter__file-chooser"
      >
        <span>
          Click to select a photo
          <br/>
          or
          <br />
          drop it here
        </span>
        <input
          type="file"
          accept="image/jpeg"
          onChange={handleChange}
          className="hidden"
        />
      </label>
    </div>
  );
}
