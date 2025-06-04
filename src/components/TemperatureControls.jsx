import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, Settings, Thermometer, X as CloseIcon, ArrowLeft, Diff, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import Keypad from "@/components/Keypad";
import CustomNumericInput from "./CustomNumericInput";

const TemperatureControls = ({
  setTemp,
  setSetTemp,
  tempTolerance,
  setTempTolerance,
  currentTemp,
  setCurrentTemp,
  addTemperatureRecord,
  mainOffset,
  mainSetOffset,
  activeView,
  setActiveView,
  toast
}) => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [tempInputValue, setTempInputValue] = useState(setTemp.toString());
  const [tempToleranceInputValue, setTempToleranceInputValue] = useState(tempTolerance.toString());

  const [fourMA, setFourMA] = useState(localStorage.getItem("val4MA") || 0);
  const [twentyMA, setTwentyMA] = useState(localStorage.getItem("val20MA") || 300);
  const [offset, setOffset] = useState(parseFloat(localStorage.getItem("offset")) || 0);


  const handleSetTemperatureSubmit = () => {
    const newTemp = parseFloat(tempInputValue);
    if (isNaN(newTemp) || newTemp < 0 || newTemp > 1000) { // Wider range for furnace
      toast({
        title: "Invalid Temperature",
        description: "Please enter a temperature between 0°C and 1000°C.",
        variant: "destructive",
      });
      return;
    }
    setSetTemp(newTemp);//////////////////////////////////////////////////////////////
    toast({
      title: "Temperature Updated",
      description: `Target temperature set to ${newTemp.toFixed(1)}°C.`,
    });
    setActiveView("dashboard");
    setIsSheetOpen(false);
  };

  const handleSetTemperatureToleranceSubmit = () => {
    const newTempTolerance = parseFloat(tempToleranceInputValue);
    if (isNaN(newTempTolerance) || newTempTolerance < 0 || newTempTolerance > 1000) { // Wider range for furnace
      toast({
        title: "Invalid Temperature Tolerance",
        description: "Please enter a temperature between 0°C and 1000°C.",
        variant: "destructive",
      });
      return;
    }
    setTempTolerance(newTempTolerance);//////////////////////////////////////////////////////////////
    localStorage.setItem("setTempTolerance", newTempTolerance)
    toast({
      title: "Temperature Tolerance Updated",
      description: `Temperature Tolerance set to +/-${newTempTolerance.toFixed(1)}°C.`,
    });
    setActiveView("dashboard");
    setIsSheetOpen(false);
  };

  const handleCalibrationSubmit = () => {///////////////////////////////////////////////////////
    const val4MA = parseFloat(fourMA);
    const val20MA = parseFloat(twentyMA);
    const valOffset = parseFloat(offset);
    localStorage.setItem("val20MA", val20MA);
    localStorage.setItem("val4MA", val4MA);
    localStorage.setItem("offset", valOffset);
    mainSetOffset(valOffset);

    if (isNaN(val4MA) || isNaN(val20MA)) {
      toast({
        title: "Invalid Input",
        description: "Please enter valid numbers for 4mA and 20mA values.",
        variant: "destructive",
      });
      return;
    }

    const simulatedOffset = (val4MA - 10 + val20MA - 50) * 0.01;
    const newCurrentTemp = currentTemp + simulatedOffset;
    // setCurrentTemp(newCurrentTemp);
    // addTemperatureRecord(newCurrentTemp);

    toast({
      title: "Calibration Submitted",
      description: `Sensor calibration data (4mA: ${val4MA}, 20mA: ${val20MA}) processed. Temp adjusted by ${simulatedOffset.toFixed(1)}°C.`,
    });
    setFourMA(localStorage.getItem('val4MA'));
    setTwentyMA(localStorage.getItem('val20MA'));
    setOffset(localStorage.getItem('offset'));
    setActiveView("dashboard");
    setIsSheetOpen(false);
  };

  const add = (txt, value) => {
    console.log('add');
    return parseFloat(txt)
  }

  const renderContent = () => {
    switch (activeView) {
      case "setTemperature":
        return (
          <motion.div
            key="setTemperature"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="p-3 sm:p-4 flex flex-col h-full"
          >
            <div className="flex items-center mb-4 sm:mb-6">
              <Button variant="ghost" size="icon" onClick={() => setActiveView("menu")} className="mr-2 text-foreground hover:bg-secondary/50">
                <ArrowLeft className="h-5 w-5 sm:h-6 sm:w-6" />
              </Button>
              <h2 className="text-lg sm:text-xl font-semibold text-foreground">Set Target Temperature</h2>
            </div>
            <div className="flex-grow">
              <Keypad
                value={tempInputValue}
                onChange={setTempInputValue}
                onSubmit={handleSetTemperatureSubmit}
              />
            </div>
          </motion.div>
        );
      case "setTemperatureTolerance":
        return (
          <motion.div
            key="setTemperatureTolerance"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="p-3 sm:p-4 flex flex-col h-full"
          >
            <div className="flex items-center mb-4 sm:mb-6">
              <Button variant="ghost" size="icon" onClick={() => setActiveView("menu")} className="mr-2 text-foreground hover:bg-secondary/50">
                <ArrowLeft className="h-5 w-5 sm:h-6 sm:w-6" />
              </Button>
              <h2 className="text-lg sm:text-xl font-semibold text-foreground">Set Temperature Tolerance</h2>
            </div>
            <div className="flex-grow">
              <Keypad
                value={tempToleranceInputValue}
                onChange={setTempToleranceInputValue}
                onSubmit={handleSetTemperatureToleranceSubmit}
              />
            </div>
          </motion.div>
        );
      case "calibrateSensor":
        return (
          <motion.div
            key="calibrateSensor"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="p-3 sm:p-4"
          >
            <div className="flex items-center mb-4 sm:mb-6">
              <Button variant="ghost" size="icon" onClick={() => setActiveView("menu")} className="mr-2 text-foreground hover:bg-secondary/50">
                <ArrowLeft className="h-5 w-5 sm:h-6 sm:w-6" />
              </Button>
              <h2 className="text-lg sm:text-xl font-semibold text-foreground">Calibrate Sensor</h2>
            </div>
            <div className="space-y-3 sm:space-y-4">
              <div>
                <label htmlFor="4ma_value" className="block text-sm font-medium text-muted-foreground mb-1">4mA Value (e.g., 0°C)</label>
                {/* <Input
                  id="4ma_value"
                  type="number"
                  placeholder="Enter value for 4mA"
                  value={fourMA}
                  onChange={(e) => setFourMA(e.target.value)}
                  className="bg-input text-foreground placeholder:text-muted-foreground text-base sm:text-lg p-2.5 sm:p-3"
                /> */}
                <CustomNumericInput id="4ma_value" placeholder="Enter value for 4mA" value={fourMA} setValue={v => setFourMA(v)}></CustomNumericInput>
              </div>
              <div>
                <label htmlFor="20ma_value" className="block text-sm font-medium text-muted-foreground mb-1">20mA Value (e.g., 100°C test)</label>
                {/* <div className="d-flex" style={{display: 'flex'}}>
                  <LongPressButton className="bg-primary text-white mr-2" onClick={() => setTwentyMA(parseFloat(twentyMA) - 0.1)}  onLongPress={() => setTwentyMA(parseFloat(twentyMA) - 0.5)}><Minus></Minus></LongPressButton>
                  <Input
                  id="20ma_value"
                  type="number"
                  placeholder="Enter value for 20mA"
                  value={twentyMA}
                  onChange={(e) => setTwentyMA(e.target.value)}
                  className="bg-input text-foreground placeholder:text-muted-foreground text-base sm:text-lg p-2.5 sm:p-3"
                />
                  <LongPressButton className="bg-primary text-white mr-2" onClick={() => setTwentyMA(parseFloat(twentyMA) + 0.1)}  onLongPress={() => setTwentyMA(parseFloat(twentyMA) + 0.5)}><Plus></Plus></LongPressButton>
                </div> */}
                <CustomNumericInput id="20ma_value" placeholder="Enter value for 20mA" value={twentyMA} setValue={v => setTwentyMA(v)}></CustomNumericInput>
              </div>
              <div>
                <label htmlFor="offset" className="block text-sm font-medium text-muted-foreground mb-1">Offset</label>
                {/* <Input
                  id="offset"
                  type="number"
                  placeholder="Enter value for Offset"
                  value={offset}
                  onChange={(e) => setOffset(e.target.value)}
                  className="bg-input text-foreground placeholder:text-muted-foreground text-base sm:text-lg p-2.5 sm:p-3"
                /> */}
                <CustomNumericInput id="offset" placeholder="Enter value for Offset" value={offset} setValue={v => setOffset(v)}></CustomNumericInput>
              </div>

              <Button onClick={handleCalibrationSubmit} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-base sm:text-lg py-2.5 sm:py-3">
                Submit Calibration
              </Button>
            </div>
          </motion.div>
        );
      case "menu":
      default:
        return (
          <motion.div
            key="menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <SheetHeader className="mb-4 sm:mb-6 p-3 sm:p-4 border-b border-border">
              <SheetTitle className="text-xl sm:text-2xl font-bold text-primary">Menu</SheetTitle>
            </SheetHeader>
            <div className="space-y-2 sm:space-y-3 p-3 sm:p-4">
              <motion.div
                className="flex items-center p-3 sm:p-3.5 rounded-lg cursor-pointer hover:bg-secondary/60 transition-colors"
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setTempInputValue(setTemp.toString());
                  setActiveView("setTemperature");
                }}
              >
                <Thermometer className="h-5 w-5 sm:h-6 sm:w-6 mr-3 text-primary" />
                <span className="font-medium text-foreground text-base sm:text-lg">Set Temperature</span>
              </motion.div>
              <motion.div
                className="flex items-center p-3 sm:p-3.5 rounded-lg cursor-pointer hover:bg-secondary/60 transition-colors"
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setTempToleranceInputValue(tempTolerance.toString());
                  setActiveView("setTemperatureTolerance");
                }}
              >
                <Diff className="h-5 w-5 sm:h-6 sm:w-6 mr-3 text-primary" />
                <span className="font-medium text-foreground text-base sm:text-lg">Set Temperature Tolerance</span>
              </motion.div>
              <motion.div
                className="flex items-center p-3 sm:p-3.5 rounded-lg cursor-pointer hover:bg-secondary/60 transition-colors"
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveView("calibrateSensor")}
              >
                <Settings className="h-5 w-5 sm:h-6 sm:w-6 mr-3 text-primary" />
                <span className="font-medium text-foreground text-base sm:text-lg">Calibrate Sensor</span>
              </motion.div>
            </div>
          </motion.div>
        );
    }
  };

  return (
    <div className="fixed top-2 left-2 sm:top-3 sm:left-3 md:top-4 md:left-4 z-50">
      <Sheet open={isSheetOpen} onOpenChange={(open) => {
        setIsSheetOpen(open);
        if (!open) setActiveView("dashboard");
        else setActiveView("menu");
      }}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="rounded-full bg-card/80 backdrop-blur-sm shadow-lg hover:bg-accent/30 border-primary/50 text-primary h-10 w-10 sm:h-12 sm:w-12">
            <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="menu-container w-[280px] sm:w-[320px] md:w-[350px] p-0 flex flex-col" // Added flex flex-col
          onCloseAutoFocus={(e) => e.preventDefault()} // Prevents focus shift on close
        >
          <AnimatePresence mode="wait">
            {renderContent()}
          </AnimatePresence>
          <SheetClose className="absolute right-3 top-3 sm:right-4 sm:top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary text-foreground">
            {/* <CloseIcon className="h-4 w-4 sm:h-5 sm:w-5" /> */}
            <span className="sr-only">Close</span>
          </SheetClose>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default TemperatureControls;