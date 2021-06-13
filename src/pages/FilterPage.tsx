import React from "react";
import { FileChooser } from "../components/FileChooser";
import ImageFilter from "../containers/ImageFilter";
import CloseIcon from "../icons/CloseIcon";
import DownloadIcon from "../icons/DownloadIcon";
import "./FilterPage.css";

export default function FilterPage({onClose}:{onClose: ()=> void}) {
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

  const handleDownload = () => {

  }

  return (
    <>
      <header className="filter-page__header flex-row">
        {url && <button className="icon-button" onClick={handleDownload}>
          <DownloadIcon />
        </button>}
        <div className="spacer" />
        <button className="icon-button" onClick={handleClose}>
          <CloseIcon />
        </button>
      </header>
      <section className="filter-page__content flex-col">
        {!url && <FileChooser onSelected={handleSelected}/>}
        {url && <ImageFilter url={url}/>}
      </section>
    </>
  );
}

