import React from "react";
import { motion } from "framer-motion";
import { Thermometer, TrendingUp, TrendingDown, CheckCircle2, AlertTriangle } from "lucide-react";

const TemperatureDisplay = ({ currentTemp, setTemp, tempTolerance }) => {
  // const getTemperatureColorClass = (temp) => {
  //   const diff = temp - setTemp;
  //   if (diff > 2) return "text-red-500";
  //   if (diff < -2) return "text-blue-400";
  //   if (diff > 0.5) return "text-orange-500";
  //   if (diff < -0.5) return "text-sky-500";
  //   return "text-green-500";
  // };
  const fourMa = localStorage.getItem("val4MA") || 0;
  const twentyMa = localStorage.getItem("val20MA") || 300;
  const actcurrentTemp = fourMa + (((currentTemp / 10) - 4) / 16) * (twentyMa - fourMa);
  const tempDifference = actcurrentTemp - setTemp;
  let statusText, StatusIcon, statusColorClass, statusTextClass, alertState;

  if (Math.abs(tempDifference) < tempTolerance) {
    statusText = "Optimal";
    StatusIcon = CheckCircle2;
    statusColorClass = "bg-green-100 text-green-700";
    statusTextClass = "text-green-700";
    alertState = false;
  } else if (tempDifference > tempTolerance) {
    statusText = `${tempDifference.toFixed(1)}°C Over`;
    StatusIcon = TrendingUp;
    statusColorClass = "bg-orange-100 text-orange-700";
    statusTextClass = "text-red-500";
    alertState = true;
  } else {
    statusText = `${Math.abs(tempDifference).toFixed(1)}°C Under`;
    StatusIcon = TrendingDown;
    statusColorClass = "bg-sky-100 text-sky-700";
    statusTextClass = "text-sky-700";
    alertState = false;
  }

  // Determine if warning should be shown
  const showWarning = actcurrentTemp > setTemp;

  return (
    <motion.div
      className="temperature-card rounded-2xl p-4 sm:p-6 flex flex-col items-center justify-around h-full shadow-xl min-h-[320px] sm:min-h-[380px] md:min-h-[420px]"
    >
      <motion.div
        className="flex items-center justify-center"
        initial={{ y: -15, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        <Thermometer className="h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9 mr-2.5 text-primary" />
        <h2 className="text-xl sm:text-xl md:text-2xl font-semibold text-foreground">Live Monitor</h2>
        {showWarning && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="ml-2.5 relative group"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
            </motion.div>
            <span className="absolute hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 -top-10 left-1/2 transform -translate-x-1/2">
              Warning: Temperature above target!
            </span>
          </motion.div>
        )}
      </motion.div>

      <div className="flex flex-col items-center my-4 sm:my-5">
        <div className="flex items-baseline">
          {alertState && <AlertTriangle className="mr-2 text-red-500 blinking" style={{ height: '4rem', width: 'auto' }} />}
          <motion.span
            // className={`temperature-display-text text-7xl sm:text-8xl md:text-9xl font-bold ${getTemperatureColorClass(currentTemp)}`}
            className={`text-7xl sm:text-8xl md:text-10xl font-bold ${statusTextClass}`}
            key={actcurrentTemp}
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 200, damping: 15 }}
          >
            {(actcurrentTemp / 1).toFixed(2)}
          </motion.span>
          <span className={`text-3xl sm:text-4xl md:text-5xl ml-1.5 ${statusTextClass}`}>°C </span>
          {showWarning && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              className="ml-2.5 relative group"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                {/* < AlertTriangle className="h-8 w-8 sm:h-9 sm:w-9 text-red-500" /> */}
              </motion.div>
              <span className="absolute hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 -top-10 left-1/2 transform -translate-x-1/2">
                Warning: Temperature above target!
              </span>
            </motion.div>
          )}

        </div>

        <motion.p
          className="mt-1.5 text-base text-dark sm:text-3xl font-bold text-muted-foreground text-neutral-800"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          Current Temperature
        </motion.p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
        <motion.div
          className="flex flex-col items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <div className="flex items-baseline">
            <span className="text-2xl sm:text-3xl md:text-4xl font-semibold text-red-500">
              {setTemp.toFixed(2)}
            </span>
            <span className="text-lg sm:text-2xl md:text-4xl ml-1 text-red-500">°C</span>
          </div>
          <p className="text-base sm:text-lg text-muted-foreground">Target Temperature</p>
        </motion.div>

        <motion.div
          className={`mt-4 sm:mt-0 flex items-center px-3.5 py-2.5 sm:px-5 sm:py-3 rounded-full text-sm sm:text-base md:text-lg font-medium ${statusColorClass}`}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.4, type: "spring", stiffness: 150 }}
        >
          <StatusIcon size={18} className="mr-2 sm:mr-2.5" />
          {statusText}
        </motion.div>
      </div>
    </motion.div>
  );
}


export default TemperatureDisplay;
