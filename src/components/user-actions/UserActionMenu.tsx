import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { HiDotsVertical, HiEye, HiPencil, HiTrash } from "react-icons/hi";
import { useTheme } from "../theme/ThemeContext";

interface UserActionMenuProps {
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export default function UserActionMenu({ onView, onEdit, onDelete }: UserActionMenuProps) {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const MENU_WIDTH = 140;

  const updatePosition = () => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    setCoords({
      top: rect.bottom + 4,
      left: rect.right - MENU_WIDTH,
    });
  };

  useLayoutEffect(() => {
    if (isOpen) updatePosition();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (!buttonRef.current?.contains(target) && !menuRef.current?.contains(target)) {
        setIsOpen(false);
      }
    };

    const handleScrollOrResize = () => updatePosition();

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScrollOrResize, true);
    window.addEventListener("resize", handleScrollOrResize);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScrollOrResize, true);
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

  const handleAction = (callback: () => void) => {
    callback();
    setIsOpen(false);
  };

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen((prev) => !prev);
        }}
        aria-haspopup="true"
        aria-expanded={isOpen}
        className={`p-2 rounded-full border transition-colors cursor-pointer flex items-center justify-center ${
          theme
            ? "border-gray-700 bg-gray-800 text-gray-400 hover:text-white"
            : "border-neutral-200 bg-neutral-50 text-neutral-500 hover:bg-neutral-100"
        }`}
      >
        <HiDotsVertical className="text-sm" />
      </button>

      {isOpen &&
        createPortal(
          <div
            ref={menuRef}
            role="menu"
            style={{ top: coords.top, left: coords.left, width: MENU_WIDTH }}
            className={`fixed z-9999 rounded-xl shadow-xl border p-1 origin-top-right ${
              theme
                ? "bg-gray-800 border-gray-700 text-white"
                : "bg-white border-neutral-100 text-neutral-700"
            }`}
          >
            <button
              type="button"
              role="menuitem"
              onClick={(e) => {
                e.stopPropagation();
                handleAction(onView);
              }}
              className={`w-full flex items-center gap-2 text-left px-3 py-2 text-xs font-semibold rounded-lg transition cursor-pointer ${
                theme ? "hover:bg-gray-700" : "hover:bg-neutral-100"
              }`}
            >
              <HiEye className="text-sm" />
              View
            </button>

            <button
              type="button"
              role="menuitem"
              onClick={(e) => {
                e.stopPropagation();
                handleAction(onEdit);
              }}
              className={`w-full flex items-center gap-2 text-left px-3 py-2 text-xs font-semibold rounded-lg transition cursor-pointer ${
                theme ? "hover:bg-gray-700" : "hover:bg-neutral-100"
              }`}
            >
              <HiPencil className="text-sm" />
              Edit
            </button>

            <button
              type="button"
              role="menuitem"
              onClick={(e) => {
                e.stopPropagation();
                handleAction(onDelete);
              }}
              className={`w-full flex items-center gap-2 text-left px-3 py-2 text-xs font-semibold rounded-lg text-red-500 transition cursor-pointer ${
                theme ? "hover:bg-red-950/30" : "hover:bg-red-50"
              }`}
            >
              <HiTrash className="text-sm" />
              Delete
            </button>
          </div>,
          document.body
        )}
      
    </>
  );
}
