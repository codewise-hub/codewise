import { useState, useEffect } from "react";

interface MicrobitSimulatorProps {
  onButtonPress?: (button: 'A' | 'B') => void;
  onShake?: () => void;
  programCode?: string;
}

export function MicrobitSimulator({ onButtonPress, onShake, programCode }: MicrobitSimulatorProps) {
  const [ledMatrix, setLedMatrix] = useState<boolean[]>(new Array(25).fill(false));
  const [consoleOutput, setConsoleOutput] = useState<string[]>(['> Ready to run program...']);
  const [temperature, setTemperature] = useState(20);
  const [lightLevel, setLightLevel] = useState(128);
  const [accelerometer, setAccelerometer] = useState({ x: 0, y: 0, z: 0 });
  const [compass, setCompass] = useState(0);
  const [buttonAPressed, setButtonAPressed] = useState(false);
  const [buttonBPressed, setButtonBPressed] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  // Simulate environmental changes
  useEffect(() => {
    const interval = setInterval(() => {
      setTemperature(prev => Math.max(15, Math.min(35, prev + (Math.random() - 0.5) * 2)));
      setLightLevel(prev => Math.max(0, Math.min(255, prev + (Math.random() - 0.5) * 20)));
      setCompass(prev => (prev + (Math.random() - 0.5) * 10) % 360);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  const toggleLED = (index: number) => {
    const newMatrix = [...ledMatrix];
    newMatrix[index] = !newMatrix[index];
    setLedMatrix(newMatrix);
    logToConsole(`LED ${Math.floor(index / 5)},${index % 5} ${newMatrix[index] ? 'ON' : 'OFF'}`);
  };

  const pressButton = (button: 'A' | 'B') => {
    if (button === 'A') {
      setButtonAPressed(true);
      setTimeout(() => setButtonAPressed(false), 200);
    } else {
      setButtonBPressed(true);
      setTimeout(() => setButtonBPressed(false), 200);
    }
    
    logToConsole(`Button ${button} pressed`);
    onButtonPress?.(button);
  };

  const simulateShake = () => {
    setIsShaking(true);
    setAccelerometer({ x: Math.random() * 2 - 1, y: Math.random() * 2 - 1, z: Math.random() * 2 - 1 });
    logToConsole('Shake detected!');
    onShake?.();
    setTimeout(() => {
      setIsShaking(false);
      setAccelerometer({ x: 0, y: 0, z: 0 });
    }, 500);
  };

  const showIcon = (pattern: string) => {
    const patterns: { [key: string]: boolean[] } = {
      heart: [
        false, true, false, true, false,
        true, true, true, true, true,
        true, true, true, true, true,
        false, true, true, true, false,
        false, false, true, false, false
      ],
      smile: [
        false, true, false, true, false,
        false, true, false, true, false,
        false, false, false, false, false,
        true, false, false, false, true,
        false, true, true, true, false
      ],
      arrow: [
        false, false, true, false, false,
        false, true, true, true, false,
        true, false, true, false, true,
        false, false, true, false, false,
        false, false, true, false, false
      ]
    };
    
    if (patterns[pattern]) {
      setLedMatrix(patterns[pattern]);
      logToConsole(`Showing ${pattern} icon`);
    }
  };

  const clearScreen = () => {
    setLedMatrix(new Array(25).fill(false));
    logToConsole('Screen cleared');
  };

  const showText = (text: string) => {
    logToConsole(`Displaying: "${text}"`);
    // Simple text display - show first letter pattern
    if (text.length > 0) {
      const char = text[0].toUpperCase();
      if (char === 'A') {
        setLedMatrix([
          false, true, true, true, false,
          true, false, false, false, true,
          true, true, true, true, true,
          true, false, false, false, true,
          true, false, false, false, true
        ]);
      } else if (char === 'B') {
        setLedMatrix([
          true, true, true, true, false,
          true, false, false, false, true,
          true, true, true, true, false,
          true, false, false, false, true,
          true, true, true, true, false
        ]);
      } else {
        // Default pattern for other characters
        setLedMatrix([
          true, true, true, true, true,
          true, false, false, false, true,
          true, false, false, false, true,
          true, false, false, false, true,
          true, true, true, true, true
        ]);
      }
    }
  };

  const runProgram = () => {
    logToConsole('Running program...');
    if (programCode) {
      try {
        // Simple interpreter for basic micro:bit commands
        const lines = programCode.split('\n');
        lines.forEach((line, index) => {
          setTimeout(() => {
            if (line.includes('showIcon')) {
              const match = line.match(/showIcon\(['"`](\w+)['"`]\)/);
              if (match) showIcon(match[1]);
            } else if (line.includes('showString') || line.includes('showText')) {
              const match = line.match(/show(?:String|Text)\(['"`]([^'"`]+)['"`]\)/);
              if (match) showText(match[1]);
            } else if (line.includes('clearScreen')) {
              clearScreen();
            }
          }, index * 500);
        });
      } catch (error) {
        logToConsole(`Error: ${error}`);
      }
    }
    setTimeout(() => {
      logToConsole('Program completed successfully!');
    }, 1000);
  };

  const downloadHex = () => {
    logToConsole('Downloading .hex file...');
    // Create a simple .hex file content
    const hexContent = `:020000040000FA
:10000000HELLO MICROBIT PROGRAM
:00000001FF`;
    
    const blob = new Blob([hexContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'microbit-program.hex';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const logToConsole = (message: string) => {
    setConsoleOutput(prev => [...prev, `> ${message}`].slice(-10)); // Keep last 10 messages
  };

  return (
    <div className="microbit-simulator">
      <h3 className="text-lg font-bold mb-4">Micro:bit Simulator</h3>
      
      {/* LED Matrix */}
      <div className="led-grid">
        {ledMatrix.map((isActive, index) => (
          <div
            key={index}
            className={`led ${isActive ? 'active' : ''}`}
            onClick={() => toggleLED(index)}
          />
        ))}
      </div>

      {/* Control Buttons */}
      <div className="flex justify-center space-x-4 mb-4">
        <button 
          className={`${buttonAPressed ? 'bg-yellow-600 scale-95' : 'bg-yellow-500 hover:bg-yellow-600'} text-white px-4 py-2 rounded font-bold transition transform`}
          onClick={() => pressButton('A')}
        >
          A
        </button>
        <button 
          className={`${buttonBPressed ? 'bg-yellow-600 scale-95' : 'bg-yellow-500 hover:bg-yellow-600'} text-white px-4 py-2 rounded font-bold transition transform`}
          onClick={() => pressButton('B')}
        >
          B
        </button>
      </div>

      {/* Sensor Simulation */}
      <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
        <div className="bg-blue-100 p-2 rounded">
          <div className="font-semibold">Temperature</div>
          <div className="text-blue-600">{temperature.toFixed(1)}°C</div>
        </div>
        <div className="bg-green-100 p-2 rounded">
          <div className="font-semibold">Light Level</div>
          <div className="text-green-600">{lightLevel}/255</div>
        </div>
        <div className="bg-purple-100 p-2 rounded">
          <div className="font-semibold">Compass</div>
          <div className="text-purple-600">{compass.toFixed(0)}°</div>
        </div>
        <div className="bg-orange-100 p-2 rounded">
          <div className="font-semibold">Accelerometer</div>
          <div className="text-orange-600">X:{accelerometer.x.toFixed(1)}</div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2">
        <button 
          onClick={runProgram}
          className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition"
        >
          <i className="fa-solid fa-play mr-2"></i>Run Program
        </button>
        <button 
          onClick={() => showIcon('heart')}
          className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition"
        >
          <i className="fa-solid fa-heart mr-2"></i>Show Heart
        </button>
        <button 
          onClick={() => showIcon('smile')}
          className="w-full bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600 transition"
        >
          <i className="fa-solid fa-smile mr-2"></i>Show Smile
        </button>
        <button 
          onClick={simulateShake}
          className={`w-full ${isShaking ? 'bg-red-600' : 'bg-orange-500 hover:bg-orange-600'} text-white py-2 rounded transition`}
        >
          <i className="fa-solid fa-hand-rock mr-2"></i>Shake Device
        </button>
        <button 
          onClick={clearScreen}
          className="w-full bg-gray-500 text-white py-2 rounded hover:bg-gray-600 transition"
        >
          <i className="fa-solid fa-eraser mr-2"></i>Clear Screen
        </button>
        <button 
          onClick={downloadHex}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
        >
          <i className="fa-solid fa-download mr-2"></i>Download .hex
        </button>
      </div>

      {/* Console Output */}
      <div className="mt-4">
        <h4 className="text-sm font-bold mb-2">Console:</h4>
        <div className="bg-black text-green-400 p-2 rounded text-xs font-mono h-20 overflow-y-auto">
          {consoleOutput.map((line, index) => (
            <div key={index}>{line}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
