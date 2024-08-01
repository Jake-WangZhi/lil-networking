interface Props {
  activeIndex: number;
  numDots: number;
  onDotClick: (index: number) => void;
}

export const Paginator = ({ activeIndex, numDots, onDotClick }: Props) => {
  return (
    <div className="flex justify-center space-x-2 mt-4">
      {Array.from({ length: numDots }).map((_, index) => (
        <span
          key={index}
          onClick={() => onDotClick(index)}
          className={`block cursor-pointer ${
            index === activeIndex
              ? "w-6 h-3 bg-light-blue border rounded-lg border-light-blue"
              : "w-3 h-3 bg-[rgba(255,255,255,0.7)] rounded-full"
          }`}
          style={{
            transition: "background-color 0.3s, width 0.3s",
          }}
        />
      ))}
    </div>
  );
};
