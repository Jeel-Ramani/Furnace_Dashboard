import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Minus, Plus } from 'lucide-react';
import { Input } from "@/components/ui/input";

function CustomNumericInput({ id, placeholder, value, setValue }) {
    const [wValue, _setWValue] = useState(value);
    const [isLongPressing, setIsLongPressing] = useState(false);
    const timerRef = useRef(null);
    const intervalRef = useRef(null);
    var increment = 0;

    const setWValue = v => {
        _setWValue(v);
        setValue(v);
    }

    const startPressTimer = (multiplier) => {
        timerRef.current = setTimeout(() => {
            setIsLongPressing(true);
            intervalRef.current = setInterval(() => increaseValueLP(.1 * multiplier), 5); // Implement this
        }, 500); // 500ms for long press
    };

    const clearPressTimer = () => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            clearInterval(intervalRef.current);
            timerRef.current = null;
            intervalRef.current = null;
            if (!isLongPressing) {
                onClick();
            }
            setIsLongPressing(false);
        }
    };

    const increaseValueLP = (diff) => {
        increment += diff;
        console.log(increment.toFixed(1));
        var val = (parseFloat(wValue) + increment).toFixed(1);
        setWValue(val);
        return val;
    }

    const increaseValue = (diff) => {
        console.log(wValue, diff)
        var val = (parseFloat(wValue) + diff).toFixed(1);
        setWValue(val);
        return val;
    }

    return (
        <div className="d-flex" style={{ display: 'flex' }}>
            <Button
                className="bg-primary text-white mr-2"
                onMouseDown={_ => startPressTimer(-1)}
                onMouseUp={clearPressTimer}
                onMouseLeave={clearPressTimer}
                onTouchStart={_ => startPressTimer(-1)}
                onTouchEnd={clearPressTimer}
                onClick={() => increaseValue(-0.1)}>
                <Minus></Minus>
            </Button>
            <Input
                id={id}
                type="number"
                placeholder={placeholder}
                value={wValue}
                onChange={(e) => setWValue(e.target.value)}
                className="bg-input text-foreground placeholder:text-muted-foreground text-base sm:text-lg p-2.5 sm:p-3"
            />
            <Button
                className="bg-primary text-white ml-2"
                onMouseDown={_ => startPressTimer(1)}
                onMouseUp={clearPressTimer}
                onMouseLeave={clearPressTimer}
                onTouchStart={_ => startPressTimer(1)}
                onTouchEnd={clearPressTimer}
                onClick={() => increaseValue(0.1)}>
                <Plus></Plus>
            </Button>
        </div>
    );
}

export default CustomNumericInput;