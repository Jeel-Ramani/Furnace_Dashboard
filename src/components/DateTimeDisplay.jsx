import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CalendarDays, Clock } from "lucide-react";

const DateTimeDisplay = () => {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date) => {
    return date.toLocaleDateString(undefined, {
      weekday: 'long', 
      year: 'numeric',
      month: 'long', 
      day: 'numeric',
    });
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit' 
    });
  };

  return (
    <motion.div
      className="fixed top-3 right-3 sm:top-4 sm:right-4 md:top-5 md:right-5 z-20 p-2.5 sm:p-3 md:p-3.5 bg-card/85 backdrop-blur-lg rounded-xl shadow-xl flex flex-col items-end text-sm sm:text-base text-foreground"
      initial={{ opacity: 0, x: 25 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.3, type: "spring", stiffness: 100 }}
    >
      <div className="flex items-center">
        <Clock size={18} className="mr-2 text-primary" />
        <span className="font-medium">{formatTime(currentDateTime)}</span>
      </div>
      <div className="flex items-center mt-1">
        <CalendarDays size={18} className="mr-2 text-primary" />
        <span className="font-medium">{formatDate(currentDateTime)}</span>
      </div>
    </motion.div>
  );
};

export default DateTimeDisplay;