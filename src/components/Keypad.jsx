import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Delete } from "lucide-react";

const Keypad = ({ value, onChange, onSubmit }) => {
  const buttons = [
    "1", "2", "3",
    "4", "5", "6",
    "7", "8", "9",
    ".", "0", 
  ];

  const handleButtonClick = (char) => {
    if (char === "." && value.includes(".")) return;
    if (value.length >= 6 && char !== ".") return; // Limit input length
    onChange(value + char);
  };

  const handleDelete = () => {
    onChange(value.slice(0, -1));
  };

  return (
    <motion.div 
      className="flex flex-col items-center p-3 sm:p-4 bg-card rounded-lg shadow-xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="w-full mb-3 sm:mb-4 p-3 text-3xl sm:text-4xl font-bold text-right border border-border rounded-md bg-background text-foreground min-h-[60px] sm:min-h-[70px]">
        {value || "0"}°C
      </div>
      <div className="grid grid-cols-3 gap-2 sm:gap-3 w-full">
        {buttons.map((btn) => (
          <motion.button
            key={btn}
            onClick={() => handleButtonClick(btn)}
            className="keypad-button" // text-2xl sm:text-3xl is in index.css
            whileHover={{ scale: 1.05, backgroundColor: "hsl(var(--accent))" }}
            whileTap={{ scale: 0.95 }}
          >
            {btn}
          </motion.button>
        ))}
         <motion.button
            onClick={handleDelete}
            className="keypad-button" // text-2xl sm:text-3xl is in index.css
            whileHover={{ scale: 1.05, backgroundColor: "hsl(var(--accent))" }}
            whileTap={{ scale: 0.95 }}
          >
            <Delete size={28} className="sm:h-8 sm:w-8"/>
          </motion.button>
      </div>
      <Button onClick={onSubmit} className="w-full mt-3 sm:mt-4 text-lg sm:text-xl py-3 bg-primary hover:bg-primary/90">
        Set Temperature
      </Button>
    </motion.div>
  );
};

export default Keypad;