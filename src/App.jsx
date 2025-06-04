import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TemperatureDisplay from "@/components/TemperatureDisplay";
import TemperatureChart from "@/components/TemperatureChart";
import TemperatureControls from "@/components/TemperatureControls";
import DateTimeDisplay from "@/components/DateTimeDisplay";
import CompanyLogo from "@/components/CompanyLogo";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import http from "http";

const App = () => {
  const { toast } = useToast();
  const [currentTemp, setCurrentTemp] = useState(22.5);
  const [setTemp, _setSetTemp] = useState(parseFloat(localStorage.getItem("setTemp")) || 23);
  const [tempTolerance, setTempTolerance] = useState(parseFloat(localStorage.getItem("setTempTolerance")) || 1);
  const [offset, setOffset] = useState(parseFloat(localStorage.getItem("offset")) || 0);
  const [temperatureHistory, setTemperatureHistory] = useState([]);
  const [activeView, setActiveView] = useState("dashboard");
  const [backgroundClass, setBackgroundClass] = useState("bg-status-normal");
  const [chartColor, setChartColor] = useState('#0369a1');

  const addTemperatureRecord = (temp) => {
    setTemperatureHistory(prev => {
      const newHistory = [...prev, parseFloat(calcTemp(temp)).toFixed(1)];
      return newHistory.length > 20 ? newHistory.slice(newHistory.length - 20) : newHistory;
    });
  };

  const setSetTemp = (value) => {
    localStorage.setItem("setTemp", value);
    _setSetTemp(value);
  } 

  const calcTemp = temp => {
    const fourMa = localStorage.getItem("val4MA") || 0;
    const twentyMa = localStorage.getItem("val20MA") || 300;
    const actcurrentTemp = fourMa + (((temp / 10) - 4) / 16) * (twentyMa - fourMa);
    return parseFloat(actcurrentTemp) + parseFloat(offset);
  }

  useEffect(() => {
    // const interval = setInterval(() => {
    //   const diff = setTemp - currentTemp;
    //   const randomFactor = (Math.random() - 0.5) * 0.4;
    //   let change;
    //   if (Math.abs(diff) < 0.2) {
    //     change = randomFactor * 0.2;
    //   } else {
    //     change = diff * 0.1 + randomFactor;
    //   }
    //   const newTemp = Math.round((currentTemp + change) * 10) / 10;

    //   setCurrentTemp(newTemp);
    //   addTemperatureRecord(newTemp);
    //   // setCurrentTemp(40);
    //   // addTemperatureRecord(40);
    const interval = setInterval(() => {
      fetch("http://localhost:3001/temperature")
        .then((res) => res.json()
        )
        .then((data) => {
          const newTemp = data.temperature;
          setCurrentTemp(newTemp);
          addTemperatureRecord(newTemp);
        })
        .catch(err => {
          console.error("Error fetching Modbus data:", err);
        });
    }, 3000);

    return () => clearInterval(interval);
  }, [currentTemp, setTemp, offset]);

  useEffect(() => {
    const difference = calcTemp(currentTemp) - setTemp;
    if (difference > tempTolerance) {
      setBackgroundClass("bg-status-hot");
      setChartColor('#ef4444')
    } else if (difference < -1 * tempTolerance) {
      setBackgroundClass("bg-status-cold");
      setChartColor('#0369a1')
    } else {
      setBackgroundClass("bg-status-normal");
      setChartColor('#15803d')
    }
  }, [currentTemp, setTemp, tempTolerance, offset]);


  return (
    <div className={`min-h-screen flex flex-col p-2 sm:p-4 md:p-6 transition-colors duration-500 ease-in-out ${backgroundClass}`}>
      <TemperatureControls
        setTemp={setTemp}
        setSetTemp={setSetTemp}
        tempTolerance={tempTolerance}
        setTempTolerance={setTempTolerance}
        currentTemp={currentTemp}
        setCurrentTemp={setCurrentTemp}
        mainOffset={offset}
        mainSetOffset={setOffset}
        addTemperatureRecord={addTemperatureRecord}
        activeView={activeView}
        setActiveView={setActiveView}
        toast={toast}
      />
      <DateTimeDisplay />

      <AnimatePresence mode="wait">
        {activeView === "dashboard" && (
          <motion.main
            key="dashboard"
            className="flex-grow flex flex-col items-center justify-center w-full max-w-6xl mx-auto px-2 sm:px-0 pt-10 sm:pt-12 md:pt-8" // Increased max-width
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center justify-center mb-4 sm:mb-6 w-full">
              <CompanyLogo />
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-center ml-3 sm:ml-4 text-foreground tracking-tight">
                Furnace Monitor
              </h1>
            </div>

            <div className="w-full grid grid-cols-1 md:grid-cols-7 gap-4 sm:gap-6"> {/* Changed to 7 cols for finer control */}
              <motion.div
                className="md:col-span-3 h-full" // Live monitor takes 3/7
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <TemperatureDisplay
                  currentTemp={currentTemp}
                  setTemp={setTemp}
                  tempTolerance={tempTolerance}
                  offset={offset}
                />
              </motion.div>

              <motion.div
                className="md:col-span-4 graph-container min-h-[300px] sm:min-h-[350px] md:min-h-[420px] p-3 sm:p-4 md:p-5 rounded-2xl flex flex-col" // Graph takes 4/7
                initial={{ x: 30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-foreground mb-2 sm:mb-3">Temperature History</h2>
                <div className="flex-grow">
                  <TemperatureChart temperatureHistory={temperatureHistory} color={chartColor} />
                </div>
              </motion.div>
            </div>
          </motion.main>
        )}
      </AnimatePresence>

      <Toaster />
    </div>
  );
};

export default App;