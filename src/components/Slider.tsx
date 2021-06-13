import "./Slider.css";

export default function Slider({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(parseInt(e.currentTarget.value) / 100);
  };

  return (
    <div className="">
      <input
        type="range"
        min="1"
        max="100"
        step="5"
        value={value * 100}
        className="slider"
        onChange={handleChange}
      />
    </div>
  );
}
