import React, { ForwardedRef, forwardRef, useEffect, useImperativeHandle } from "react";
import "./ImageFilter.css";
import { FabricJSCanvas, useFabricJSEditor } from "fabricjs-react";
import { fabric } from "fabric";

const MAIN_IMAGE_KEY = "main-image";

function getScaleAndPositionContain (oImg: fabric.Image, canvas: fabric.Canvas) {
  const canvasWidth = canvas.width!;
  const canvasHeight = canvas.height!;
  const imgWidth = oImg.width!;
  const imgHeight = oImg.height!;
  const scale = Math.min(canvasHeight / imgHeight, canvasWidth / imgWidth);
  const left = (canvasWidth - (imgWidth * scale)) / 2;
  const top = (canvasHeight - (imgHeight * scale)) / 2;
  return {scale, left, top};
}

function getScaleAndPositionCover (oImg: fabric.Image, canvas: fabric.Canvas) {
  const canvasWidth = canvas.width!;
  const canvasHeight = canvas.height!;
  const imgWidth = oImg.width!;
  const imgHeight = oImg.height!;
  const scale = Math.max(canvasHeight / imgHeight, canvasWidth / imgWidth);
  const left = (canvasWidth - (imgWidth * scale)) / 2;
  const top = (canvasHeight - (imgHeight * scale)) / 2;
  return {scale, left, top};
}

function getMainImage (canvas: fabric.Canvas | undefined) {
  if(!canvas) return;
  const mainImage = canvas.getObjects().find( o => o.name === MAIN_IMAGE_KEY);
  return mainImage as fabric.Image;
}

interface FilterType {
  name: string;
  createFilters: ()=> fabric.IBaseFilter[];
}

const Filters: FilterType[] = [
  {
    name: "No filter",
    createFilters: () => {
      return [];
    },
  },
  {
    name: "Blur",
    createFilters: () => {
      return [new (fabric.Image.filters as any).Blur({
        blur: 0.1,
      })];
    },
  },
  {
    name: "Vintage",
    createFilters: () => {
      return [new (fabric.Image.filters as any).Vintage()];
    },
  },
  {
    name: "Sepia",
    createFilters: () => {
      return [new fabric.Image.filters.Sepia({
        sepia: 0.5,
      })];
    },
  },
];

type ImageFilterProps = { url: string };

export type ImageFilterRef = {
  getImageUrl: () => string | undefined,
}

export default forwardRef<ImageFilterRef, ImageFilterProps>(ImageFilter);

function ImageFilter({ url }: ImageFilterProps, ref: ForwardedRef<ImageFilterRef>) {
  const { editor, onReady } = useFabricJSEditor();

  useImperativeHandle(ref, () => ({
    getImageUrl: () => {
      return editor?.canvas.toDataURL({
        format: 'jpeg',
        quality: 0.85,
      });
    },
  }));

  const handleApplyFilter = (filter: FilterType) => {
    const mainImage = getMainImage(editor?.canvas);
    if(!mainImage) return;
    mainImage.filters?.splice(0, mainImage.filters.length);
    mainImage.filters?.push(...filter.createFilters());
    mainImage.applyFilters();
    editor!.canvas.renderAll();
  };

  const handleResize = () => {
    const mainImage = getMainImage(editor?.canvas);
    if(mainImage){
      const {scale, left, top} = getScaleAndPositionContain(mainImage, editor!.canvas);
      mainImage.scale(scale);
      mainImage.left = left;
      mainImage.top = top;
      editor!.canvas.renderAll();
    }
  }

  useEffect(()=>{
    if(editor){
      window.addEventListener('resize', handleResize);
    }
    return ()=> {
      window.removeEventListener('resize', handleResize);
    }
  });

  useEffect(() => {
    if(!editor) return;
    const mainImage = getMainImage(editor?.canvas);
    if(mainImage) return;

    fabric.Image.fromURL(url, function (oImg) {
      oImg.name = MAIN_IMAGE_KEY;
      const {scale, left, top} = getScaleAndPositionContain(oImg, editor!.canvas);
      oImg.scale(scale);
      oImg.left = left;
      oImg.top = top;
      oImg.selectable = false;
      oImg.hoverCursor = "default";
      editor.canvas.add(oImg);
    });
  });

  return (
    <div className="image-filter__root flex-col flex-grow">
      <FabricJSCanvas
        className="image-filter__content flex-grow"
        onReady={onReady}
      ></FabricJSCanvas>
      <div className="filter__options-container">
        <div className="filter__options flex-row">
          {Filters.map((filter) => (
            <Filter
              key={filter.name}
              url={url}
              filter={filter}
              onApplyFilter={handleApplyFilter}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function Filter({
  url,
  filter,
  onApplyFilter,
}: {
  url: string,
  filter: FilterType;
  onApplyFilter: (filter: FilterType) => void;
}) {
  const { editor, onReady } = useFabricJSEditor();

  const handleClick = () => {
    onApplyFilter(filter);
  };

  const handleKeyup = (e: React.KeyboardEvent) => {
    if(e.key===' ' || e.key==='Enter'){
      onApplyFilter(filter);
    }
  };

  React.useEffect(() => {
    if(!editor) return;
    const mainImage = getMainImage(editor?.canvas);
    if(mainImage) return;

    fabric.Image.fromURL(url, function (oImg) {
      oImg.name = MAIN_IMAGE_KEY;
      const {scale, left, top} = getScaleAndPositionCover(oImg, editor!.canvas);
      oImg.scale(scale);
      oImg.selectable = false;
      oImg.left = left;
      oImg.top = top;
      oImg.filters?.push(...filter.createFilters());
      oImg.applyFilters();
      oImg.hoverCursor = "pointer";
      editor.canvas.add(oImg);
    });
  });

  return (
    <div className="flex-col" onClick={handleClick} onKeyUp={handleKeyup} tabIndex={0}>
      <label className="filter__label">{filter.name}</label>
      <FabricJSCanvas
        className="filter__thumbnail"
        onReady={onReady}
      ></FabricJSCanvas>
    </div>
  );
}
