"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { Character } from "@/types";
import { generateId } from "@/lib/utils";

interface AddCharacterFormProps {
  onAdd: (character: Character) => void;
}

export function AddCharacterForm({ onAdd }: AddCharacterFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [imagePreview, setImagePreview] = useState<string>("");
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
      setError("");
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleSubmit = () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError("Character name is required.");
      return;
    }
    if (!imagePreview) {
      setError("Please upload an image.");
      return;
    }

    onAdd({
      id: generateId(),
      name: trimmedName,
      image: imagePreview,
      enabled: true,
      custom: true,
    });

    setName("");
    setImagePreview("");
    setError("");
    setIsOpen(false);
  };

  const reset = () => {
    setName("");
    setImagePreview("");
    setError("");
    setIsOpen(false);
  };

  return (
    <div className="mt-4">
      <AnimatePresence mode="wait">
        {!isOpen ? (
          <motion.div
            key="trigger"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(true)}
              className="w-full"
            >
              <Plus size={14} />
              Add Custom Character
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="border border-[rgba(197,146,26,0.3)] p-4 space-y-4 bg-[rgba(197,146,26,0.03)]">
              {/* Header */}
              <div className="flex items-center justify-between">
                <span className="font-cinzel text-xs tracking-widest uppercase text-[#d4a843]">
                  New Character
                </span>
                <button onClick={reset} className="text-[rgba(197,146,26,0.4)] hover:text-[#d4a843] cursor-pointer">
                  <X size={14} />
                </button>
              </div>

              {/* Name input */}
              <div>
                <label className="block text-xs tracking-widest uppercase text-[rgba(197,146,26,0.6)] mb-1.5">
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Character name..."
                  maxLength={30}
                  className="w-full bg-[#0a0805] border border-[rgba(197,146,26,0.25)] text-[#e8d5a3] placeholder-[rgba(197,146,26,0.2)] px-3 py-2 text-sm focus:outline-none focus:border-[#d4a843] transition-colors duration-200 font-cinzel"
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                />
              </div>

              {/* Image upload */}
              <div>
                <label className="block text-xs tracking-widest uppercase text-[rgba(197,146,26,0.6)] mb-1.5">
                  Image
                </label>
                <div
                  className="relative border-2 border-dashed border-[rgba(197,146,26,0.25)] hover:border-[rgba(197,146,26,0.5)] transition-colors duration-200 cursor-pointer"
                  style={{ minHeight: 80 }}
                  onClick={() => fileRef.current?.click()}
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                >
                  {imagePreview ? (
                    <div className="flex items-center gap-3 p-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={imagePreview}
                        alt="preview"
                        className="w-14 h-14 object-contain border border-[rgba(197,146,26,0.2)]"
                      />
                      <span className="text-xs text-[rgba(197,146,26,0.6)]">
                        Image selected. Click to change.
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-2 py-4 text-[rgba(197,146,26,0.35)]">
                      <Upload size={20} />
                      <span className="text-xs tracking-wide">
                        Click or drag image here
                      </span>
                    </div>
                  )}
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFile(file);
                    }}
                  />
                </div>
              </div>

              {/* Error */}
              <AnimatePresence>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-xs text-red-400 font-cinzel tracking-wide"
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>

              {/* Actions */}
              <div className="flex gap-3">
                <Button variant="ghost" size="sm" onClick={reset} className="flex-1">
                  Cancel
                </Button>
                <Button variant="primary" size="sm" onClick={handleSubmit} className="flex-1">
                  Add
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
