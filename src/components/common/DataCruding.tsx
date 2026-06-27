import { useState, useRef, useEffect, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import { useTheme } from "../theme/ThemeContext"; // તમારી ThemeContext ફાઇલ પાથ અહીં કન્ફર્મ કરી લેવો
import { HiDotsVertical } from "react-icons/hi";

interface DataCrudingProps {
  onEdit: () => void;
  onDelete: () => void;
  editLabel?: string;
  deleteLabel?: string;
}

export default function DataCruding({
  onEdit,
  onDelete,
  editLabel = "Edit",
  deleteLabel = "Delete",
}: DataCrudingProps) {
  const { theme } = useTheme(); // true = Dark, false = Light
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const MENU_WIDTH = 112; // w-28

  // બટનની પોઝિશન પ્રમાણે ડ્રોપડાઉનનું coordinate ગણવા માટે
  // (table ની overflow-x-auto boundary ની બહાર portal થી render કરવા માટે જરૂરી)
  const updatePosition = () => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    setCoords({
      top: rect.bottom + 4, // mt-1 જેવો ગેપ
      left: rect.right - MENU_WIDTH, // જમણી બાજુ align (right-0 જેવું)
    });
  };

  useLayoutEffect(() => {
    if (isOpen) updatePosition();
  }, [isOpen]);

  // મેનુની બહાર ક્લિક / scroll / resize થાય તો બંધ કરવા માટે
  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      const clickedButton = buttonRef.current?.contains(target);
      const clickedMenu = menuRef.current?.contains(target);
      if (!clickedButton && !clickedMenu) setIsOpen(false);
    }
    function handleScrollOrResize() {
      updatePosition();
    }

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScrollOrResize, true);
    window.addEventListener("resize", handleScrollOrResize);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScrollOrResize, true);
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, [isOpen]);

  // Esc દબાવવાથી પણ બંધ થાય
  useEffect(() => {
    function handleEsc(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <>
      {/* 3-Dots બટન */}
      <button
        ref={buttonRef}
        type="button"
        onClick={(e) => {
          e.stopPropagation(); // રો (Row) પર ક્લિક ઇવેન્ટ ટ્રિગર ન થાય તે માટે
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

      {/* ડ્રોપડાઉન — body પર portal થી render, એટલે કોઈ પણ
          overflow-hidden / overflow-x-auto parent (દા.ત. Table) એને clip નહીં કરી શકે */}
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
            {/* Edit બટન */}
            <button
              type="button"
              role="menuitem"
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
                setIsOpen(false);
              }}
              className={`w-full text-left px-3 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer ${
                theme ? "hover:bg-gray-700" : "hover:bg-neutral-100"
              }`}
            >
              {editLabel}
            </button>

            <button
              type="button"
              role="menuitem"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
                setIsOpen(false);
              }}
              className={`w-full text-left px-3 py-1.5 text-xs font-semibold rounded-lg text-red-500 transition cursor-pointer ${
                theme ? "hover:bg-red-950/30" : "hover:bg-red-50"
              }`}
            >
              {deleteLabel}
            </button>
          </div>,
          document.body
        )}
    </>
  );
}