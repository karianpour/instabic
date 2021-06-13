import React, {
  ForwardedRef,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import "./ImageFilter.css";
import { FabricJSCanvas, useFabricJSEditor } from "fabricjs-react";
import { fabric } from "fabric";
import Slider from "../components/Slider";
import CloseIcon from "../icons/CloseIcon";

const MAIN_IMAGE_KEY = "main-image";

function getScaleAndPositionContain(oImg: fabric.Image, canvas: fabric.Canvas) {
  const canvasWidth = canvas.width!;
  const canvasHeight = canvas.height!;
  const imgWidth = oImg.width!;
  const imgHeight = oImg.height!;
  const scale = Math.min(canvasHeight / imgHeight, canvasWidth / imgWidth);
  const left = (canvasWidth - imgWidth * scale) / 2;
  const top = (canvasHeight - imgHeight * scale) / 2;
  return { scale, left, top };
}

function getScaleAndPositionCover(oImg: fabric.Image, canvas: fabric.Canvas) {
  const canvasWidth = canvas.width!;
  const canvasHeight = canvas.height!;
  const imgWidth = oImg.width!;
  const imgHeight = oImg.height!;
  const scale = Math.max(canvasHeight / imgHeight, canvasWidth / imgWidth);
  const left = (canvasWidth - imgWidth * scale) / 2;
  const top = (canvasHeight - imgHeight * scale) / 2;
  return { scale, left, top };
}

function getMainImage(canvas: fabric.Canvas | undefined) {
  if (!canvas) return;
  const mainImage = canvas.getObjects().find((o) => o.name === MAIN_IMAGE_KEY);
  return mainImage as fabric.Image;
}

interface FilterType {
  name: string;
  defaultStrength: number;
  createFilters?: (strength: number) => fabric.IBaseFilter[];
}

const AvailableFilters: FilterType[] = [
  {
    name: "No filter",
    defaultStrength: 0,
  },
  {
    name: "Blur",
    defaultStrength: 0.1,
    createFilters: (strength) => {
      return [
        new (fabric.Image.filters as any).Blur({
          blur: strength,
        }),
      ];
    },
  },
  {
    name: "Vintage",
    defaultStrength: 0.2,
    createFilters: (strength) => {
      return [new (fabric.Image.filters as any).Vintage()];
    },
  },
  {
    name: "Sepia",
    defaultStrength: 0.2,
    createFilters: (strength) => {
      return [new fabric.Image.filters.Sepia()];
    },
  },
];

type ImageFilterProps = { url: string };

export type ImageFilterRef = {
  getImageUrl: () => string | undefined;
};

export default forwardRef<ImageFilterRef, ImageFilterProps>(ImageFilter);

function ImageFilter(
  { url }: ImageFilterProps,
  ref: ForwardedRef<ImageFilterRef>
) {
  const { editor, onReady } = useFabricJSEditor();

  useImperativeHandle(ref, () => ({
    getImageUrl: () => {
      return editor?.canvas.toDataURL({
        format: "jpeg",
        quality: 0.85,
      });
    },
  }));

  const handleApplyFilter = (filter: FilterType, strength: number) => {
    const mainImage = getMainImage(editor?.canvas);
    if (!mainImage) return;
    mainImage.filters?.splice(0, mainImage.filters.length);
    mainImage.filters?.push(...(filter.createFilters?.(strength) || []));
    mainImage.applyFilters();
    editor!.canvas.renderAll();
  };

  const handleResize = () => {
    const mainImage = getMainImage(editor?.canvas);
    if (mainImage) {
      const { scale, left, top } = getScaleAndPositionContain(
        mainImage,
        editor!.canvas
      );
      mainImage.scale(scale);
      mainImage.left = left;
      mainImage.top = top;
      editor!.canvas.renderAll();
    }
  };

  useEffect(() => {
    if (editor) {
      window.addEventListener("resize", handleResize);
    }
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  });

  useEffect(() => {
    if (!editor) return;
    const mainImage = getMainImage(editor?.canvas);
    if (mainImage) return;

    fabric.Image.fromURL(url, function (oImg) {
      oImg.name = MAIN_IMAGE_KEY;
      const { scale, left, top } = getScaleAndPositionContain(
        oImg,
        editor!.canvas
      );
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
      <div className="filter__options-container relative">
        {<Filters url={url} onApplyFilter={handleApplyFilter} />}
      </div>
    </div>
  );
}

function Filters({
  url,
  onApplyFilter,
}: {
  url: string;
  onApplyFilter: (filter: FilterType, strength: number) => void;
}) {
  const [selected, setSelected] = useState("");

  const handleSelected = (name: string) => {
    setSelected(name);
  };

  return (
    <div className="filter__options flex-row">
      {AvailableFilters.map((filter) => (
        <Filter
          key={filter.name}
          url={url}
          filter={filter}
          onApplyFilter={onApplyFilter}
          selected={selected}
          onSelected={handleSelected}
        />
      ))}
    </div>
  );
}

function Filter({
  url,
  filter,
  onApplyFilter,
  selected,
  onSelected,
}: {
  url: string;
  filter: FilterType;
  onApplyFilter: (filter: FilterType, strength: number) => void;
  selected: string;
  onSelected: (name: string) => void;
}) {
  const { editor, onReady } = useFabricJSEditor();
  const [strength, setStrength] = useState(filter.defaultStrength);
  const [valueMode, setValueMode] = useState(false);

  const handleApply = () => {
    if (selected === filter.name) {
      if (filter.createFilters) {
        setValueMode(true);
      }
    } else {
      onApplyFilter(filter, strength);
      onSelected(filter.name);
    }
  };

  const handleClose = () => {
    setValueMode(false);
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleApply();
  };

  const handleKeyup = (e: React.KeyboardEvent) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();
      handleApply();
    }
  };

  const handleChange = (value: number) => {
    setStrength(value);
    onApplyFilter(filter, value);
  };

  useEffect(() => {
    if (!editor) return;
    const mainImage = getMainImage(editor?.canvas);
    if (mainImage) return;

    fabric.Image.fromURL(url, function (oImg) {
      oImg.name = MAIN_IMAGE_KEY;
      const { scale, left, top } = getScaleAndPositionCover(
        oImg,
        editor!.canvas
      );
      oImg.scale(scale);
      oImg.selectable = false;
      oImg.left = left;
      oImg.top = top;
      oImg.filters?.push(...(filter.createFilters?.(strength) || []));
      oImg.applyFilters();
      oImg.hoverCursor = "pointer";
      editor.canvas.add(oImg);
    });
  });

  return (
    <div
      className="flex-col"
      onKeyUp={handleKeyup}
      onPointerUp={handleClick}
      tabIndex={0}
    >
      <label className="filter__label">{filter.name}</label>
      <FabricJSCanvas
        className="filter__thumbnail"
        onReady={onReady}
      ></FabricJSCanvas>
      {valueMode && (
        <SelectValue
          value={strength}
          onChange={handleChange}
          onClose={handleClose}
        />
      )}
    </div>
  );
}

function SelectValue({
  value,
  onChange,
  onClose,
}: {
  value: number;
  onChange: (value: number) => void;
  onClose: () => void;
}) {
  return (
    <div className="filter__select-value flex-row center">
      <button
        className="icon-button filter__select-value-close"
        onClick={onClose}
      >
        <CloseIcon />
      </button>
      <Slider value={value} onChange={onChange} />
    </div>
  );
}
