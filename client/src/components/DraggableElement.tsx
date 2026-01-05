import { useState, useRef, useEffect } from "react";
import { X, RotateCw, Move } from "lucide-react";
import { Button } from "./ui/button";

export interface GraphicElement {
  id: string;
  svg: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  zIndex: number;
}

interface DraggableElementProps {
  element: GraphicElement;
  onUpdate: (element: GraphicElement) => void;
  onRemove: (id: string) => void;
  isSelected: boolean;
  onSelect: () => void;
  containerWidth: number;
  containerHeight: number;
}

export default function DraggableElement({
  element,
  onUpdate,
  onRemove,
  isSelected,
  onSelect,
  containerWidth,
  containerHeight,
}: DraggableElementProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const elementRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest(".resize-handle")) {
      setIsResizing(true);
    } else {
      setIsDragging(true);
    }
    setDragStart({ x: e.clientX, y: e.clientY });
    onSelect();
    e.preventDefault();
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;
      
      const newX = Math.max(0, Math.min(containerWidth - element.width, element.x + deltaX));
      const newY = Math.max(0, Math.min(containerHeight - element.height, element.y + deltaY));
      
      onUpdate({ ...element, x: newX, y: newY });
      setDragStart({ x: e.clientX, y: e.clientY });
    } else if (isResizing) {
      const deltaX = e.clientX - dragStart.x;
      const newWidth = Math.max(40, Math.min(300, element.width + deltaX));
      const newHeight = Math.max(40, Math.min(300, element.height + deltaX));
      
      onUpdate({ ...element, width: newWidth, height: newHeight });
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
  };

  useEffect(() => {
    if (isDragging || isResizing) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, isResizing, dragStart]);

  const handleRotate = () => {
    onUpdate({ ...element, rotation: (element.rotation + 45) % 360 });
  };

  return (
    <div
      ref={elementRef}
      className={`absolute cursor-move ${isSelected ? "ring-2 ring-primary" : ""}`}
      style={{
        left: `${element.x}px`,
        top: `${element.y}px`,
        width: `${element.width}px`,
        height: `${element.height}px`,
        transform: `rotate(${element.rotation}deg)`,
        zIndex: element.zIndex,
      }}
      onMouseDown={handleMouseDown}
    >
      <div
        className="w-full h-full"
        dangerouslySetInnerHTML={{ __html: element.svg }}
      />
      
      {isSelected && (
        <>
          {/* Botões de controle */}
          <div className="absolute -top-10 left-0 flex gap-1 bg-white rounded-lg shadow-lg p-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={handleRotate}
              className="h-8 w-8 p-0"
            >
              <RotateCw className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onRemove(element.id)}
              className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Handle de redimensionamento */}
          <div
            className="resize-handle absolute bottom-0 right-0 w-4 h-4 bg-primary rounded-full cursor-se-resize"
            style={{ transform: "translate(50%, 50%)" }}
          />
        </>
      )}
    </div>
  );
}
