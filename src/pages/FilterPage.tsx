import React, { useRef } from "react";
import { FileChooser } from "../components/FileChooser";
import ImageFilter, { ImageFilterRef } from "../containers/ImageFilter";
import CloseIcon from "../icons/CloseIcon";
import DownloadIcon from "../icons/DownloadIcon";
import { downloadUrl } from "../utils/filedownloader";
import "./FilterPage.css";

export default function FilterPage({ onClose }: { onClose: () => void }) {
  const [url, setUrl] = React.useState("");
  const imageRef = useRef<ImageFilterRef>(null);

  const handleSelected = (url: string) => {
    setUrl(url);
  };

  const handleClose = () => {
    if (url) {
      setUrl("");
    } else {
      onClose();
    }
  };

  const handleDownload = () => {
    const dataUrl = imageRef.current?.getImageUrl();
    if (dataUrl) {
      downloadUrl(dataUrl, "image.jpeg");
    }
  };

  return (
    <>
      <header className="filter-page__header flex-row">
        {url && (
          <button className="icon-button" onClick={handleDownload}>
            <DownloadIcon />
          </button>
        )}
        <div className="spacer" />
        <button className="icon-button" onClick={handleClose}>
          <CloseIcon />
        </button>
      </header>
      <section className="filter-page__content flex-col">
        {!url && <FileChooser onSelected={handleSelected} />}
        {url && <ImageFilter url={url} ref={imageRef} />}
      </section>
    </>
  );
}
