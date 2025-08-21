import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface RoboticsLabModalProps {
  isOpen: boolean;
  onClose: () => void;
  activity?: any;
}

interface RobotCommand {
  id: string;
  type: 'move' | 'turn' | 'led' | 'sensor' | 'wait' | 'loop';
  parameters: any;
  description: string;
}

interface RobotPosition {
  x: number;
  y: number;
  angle: number;
}

export function RoboticsLabModal({ isOpen, onClose, activity }: RoboticsLabModalProps) {
  const { user } = useAuth();
  const [commands, setCommands] = useState<RobotCommand[]>([]);
  const [selectedCommand, setSelectedCommand] = useState<string>('move');
  const [robotPosition, setRobotPosition] = useState<RobotPosition>({ x: 400, y: 300, angle: 0 });
  const [isRunning, setIsRunning] = useState(false);
  const [currentCommandIndex, setCurrentCommandIndex] = useState(-1);
  const [connectedDevice, setConnectedDevice] = useState<any>(null);
  const [labMode, setLabMode] = useState<'visual' | 'blocks' | 'code'>('visual');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const isLittleCoder = user?.ageGroup === '6-11';

  const commandTypes = [
    { 
      id: 'move', 
      label: 'Move Forward', 
      icon: '⬆️', 
      parameters: { distance: 100 },
      color: '#3B82F6' 
    },
    { 
      id: 'turn', 
      label: 'Turn', 
      icon: '↻', 
      parameters: { angle: 90, direction: 'right' },
      color: '#10B981' 
    },
    { 
      id: 'led', 
      label: 'LED Display', 
      icon: '💡', 
      parameters: { pattern: 'heart', brightness: 9 },
      color: '#F59E0B' 
    },
    { 
      id: 'sensor', 
      label: 'Read Sensor', 
      icon: '📡', 
      parameters: { type: 'temperature' },
      color: '#8B5CF6' 
    },
    { 
      id: 'wait', 
      label: 'Wait', 
      icon: '⏱️', 
      parameters: { duration: 1000 },
      color: '#EF4444' 
    },
    { 
      id: 'loop', 
      label: 'Repeat', 
      icon: '🔄', 
      parameters: { times: 3, commands: [] },
      color: '#EC4899' 
    }
  ];

  useEffect(() => {
    if (isOpen) {
      drawCanvas();
    }
  }, [isOpen, robotPosition, currentCommandIndex]);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#F3F4F6';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = '#E5E7EB';
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 50) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 50) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Draw activity-specific elements
    if (activity?.type === 'maze') {
      drawMaze(ctx);
    } else if (activity?.type === 'line-following') {
      drawPath(ctx);
    }

    // Draw robot
    drawRobot(ctx, robotPosition.x, robotPosition.y, robotPosition.angle);

    // Draw path preview
    if (commands.length > 0) {
      drawCommandPath(ctx);
    }
  };

  const drawMaze = (ctx: CanvasRenderingContext2D) => {
    // Simple maze walls
    ctx.fillStyle = '#374151';
    const walls = [
      { x: 100, y: 100, width: 200, height: 20 },
      { x: 100, y: 200, width: 20, height: 200 },
      { x: 400, y: 150, width: 20, height: 150 },
      { x: 500, y: 250, width: 150, height: 20 }
    ];
    walls.forEach(wall => {
      ctx.fillRect(wall.x, wall.y, wall.width, wall.height);
    });

    // Goal
    ctx.fillStyle = '#10B981';
    ctx.fillRect(700, 500, 50, 50);
    ctx.fillStyle = '#ffffff';
    ctx.font = '16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🎯', 725, 535);
  };

  const drawPath = (ctx: CanvasRenderingContext2D) => {
    // Draw line to follow
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(50, 300);
    ctx.quadraticCurveTo(400, 100, 750, 300);
    ctx.quadraticCurveTo(400, 500, 50, 300);
    ctx.stroke();
  };

  const drawRobot = (ctx: CanvasRenderingContext2D, x: number, y: number, angle: number) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((angle * Math.PI) / 180);

    // Robot body
    ctx.fillStyle = currentCommandIndex >= 0 ? '#EF4444' : '#3B82F6';
    ctx.fillRect(-15, -15, 30, 30);

    // Direction indicator
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(10, -5, 8, 10);

    // Sensors
    ctx.fillStyle = '#10B981';
    ctx.fillRect(-12, -12, 6, 6);
    ctx.fillRect(6, -12, 6, 6);

    ctx.restore();
  };

  const drawCommandPath = (ctx: CanvasRenderingContext2D) => {
    let currentPos = { ...robotPosition };
    
    ctx.strokeStyle = '#8B5CF6';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);

    commands.forEach((command, index) => {
      if (command.type === 'move') {
        const distance = command.parameters.distance;
        const newX = currentPos.x + Math.cos((currentPos.angle * Math.PI) / 180) * distance;
        const newY = currentPos.y + Math.sin((currentPos.angle * Math.PI) / 180) * distance;

        ctx.beginPath();
        ctx.moveTo(currentPos.x, currentPos.y);
        ctx.lineTo(newX, newY);
        ctx.stroke();

        currentPos.x = newX;
        currentPos.y = newY;
      } else if (command.type === 'turn') {
        currentPos.angle += command.parameters.direction === 'right' ? 
          command.parameters.angle : -command.parameters.angle;
      }
    });

    ctx.setLineDash([]);
  };

  const addCommand = () => {
    const commandType = commandTypes.find(ct => ct.id === selectedCommand);
    if (!commandType) return;

    const newCommand: RobotCommand = {
      id: Date.now().toString(),
      type: selectedCommand as any,
      parameters: { ...commandType.parameters },
      description: `${commandType.label} - ${JSON.stringify(commandType.parameters)}`
    };

    setCommands(prev => [...prev, newCommand]);
  };

  const removeCommand = (commandId: string) => {
    setCommands(prev => prev.filter(cmd => cmd.id !== commandId));
  };

  const executeCommands = async () => {
    if (commands.length === 0) return;

    setIsRunning(true);
    let currentPos = { ...robotPosition };

    for (let i = 0; i < commands.length; i++) {
      setCurrentCommandIndex(i);
      const command = commands[i];
      
      // Send to connected device if available
      if (connectedDevice) {
        await sendCommandToDevice(command);
      }

      // Simulate command execution
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Update visual position
      if (command.type === 'move') {
        const distance = command.parameters.distance;
        currentPos.x += Math.cos((currentPos.angle * Math.PI) / 180) * distance;
        currentPos.y += Math.sin((currentPos.angle * Math.PI) / 180) * distance;
      } else if (command.type === 'turn') {
        currentPos.angle += command.parameters.direction === 'right' ? 
          command.parameters.angle : -command.parameters.angle;
      }

      setRobotPosition({ ...currentPos });
    }

    setCurrentCommandIndex(-1);
    setIsRunning(false);
  };

  const sendCommandToDevice = async (command: RobotCommand) => {
    // Convert command to micro:bit Python code
    let pythonCode = '';
    
    switch (command.type) {
      case 'move':
        pythonCode = `
from microbit import *
import radio

radio.config(channel=7)
radio.send("move:${command.parameters.distance}")
sleep(${command.parameters.distance * 10})
`;
        break;
      case 'turn':
        pythonCode = `
from microbit import *
import radio

radio.config(channel=7)
radio.send("turn:${command.parameters.direction}:${command.parameters.angle}")
sleep(500)
`;
        break;
      case 'led':
        pythonCode = `
from microbit import *

if "${command.parameters.pattern}" == "heart":
    display.show(Image.HEART)
elif "${command.parameters.pattern}" == "happy":
    display.show(Image.HAPPY)
else:
    display.show("${command.parameters.pattern}")
sleep(1000)
`;
        break;
      case 'wait':
        pythonCode = `
from microbit import *
sleep(${command.parameters.duration})
`;
        break;
    }

    console.log('Sending to device:', pythonCode);
    // Here you would send the actual command to the connected micro:bit
  };

  const resetRobot = () => {
    setRobotPosition({ x: 400, y: 300, angle: 0 });
    setCurrentCommandIndex(-1);
  };

  const generateBlocksView = () => {
    return (
      <div className="space-y-3">
        <div className="text-sm font-medium text-gray-700 mb-3">Drag blocks to create your program:</div>
        <div className="grid grid-cols-2 gap-3">
          {commandTypes.map((cmdType) => (
            <div
              key={cmdType.id}
              className="p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 cursor-pointer transition"
              onClick={() => {
                setSelectedCommand(cmdType.id);
                addCommand();
              }}
            >
              <div className="flex items-center space-x-2">
                <span className="text-2xl">{cmdType.icon}</span>
                <span className="text-sm font-medium">{cmdType.label}</span>
              </div>
            </div>
          ))}
        </div>

        {commands.length > 0 && (
          <div className="mt-4">
            <div className="text-sm font-medium text-gray-700 mb-2">Your Program:</div>
            <div className="space-y-2">
              {commands.map((command, index) => {
                const cmdType = commandTypes.find(ct => ct.id === command.type);
                return (
                  <div
                    key={command.id}
                    className={`flex items-center justify-between p-3 rounded-lg border-2 ${
                      currentCommandIndex === index ? 'border-red-400 bg-red-50' : 'border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">{cmdType?.icon}</span>
                      <span className="font-medium">{cmdType?.label}</span>
                      <span className="text-sm text-gray-500">
                        {JSON.stringify(command.parameters)}
                      </span>
                    </div>
                    <button
                      onClick={() => removeCommand(command.id)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <i className="fa-solid fa-trash text-sm"></i>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  const generateCodeView = () => {
    let pythonCode = `from microbit import *
import radio

# Initialize
radio.config(channel=7)
display.show(Image.HAPPY)

# Main program
`;

    commands.forEach((command) => {
      switch (command.type) {
        case 'move':
          pythonCode += `
# Move forward ${command.parameters.distance} units
radio.send("move:${command.parameters.distance}")
sleep(${command.parameters.distance * 10})
`;
          break;
        case 'turn':
          pythonCode += `
# Turn ${command.parameters.direction} ${command.parameters.angle} degrees  
radio.send("turn:${command.parameters.direction}:${command.parameters.angle}")
sleep(500)
`;
          break;
        case 'led':
          pythonCode += `
# Display ${command.parameters.pattern}
display.show(Image.${command.parameters.pattern.toUpperCase()})
sleep(1000)
`;
          break;
        case 'wait':
          pythonCode += `
# Wait ${command.parameters.duration}ms
sleep(${command.parameters.duration})
`;
          break;
      }
    });

    pythonCode += `
# Program complete
display.show(Image.YES)`;

    return (
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">Generated Python Code:</span>
          <button className="text-blue-500 hover:text-blue-700 text-sm">
            <i className="fa-solid fa-copy mr-1"></i>Copy Code
          </button>
        </div>
        <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm font-mono">
          {pythonCode}
        </pre>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl max-w-7xl w-full mx-4 h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <div>
            <h2 className="text-2xl font-bold">🤖 Robotics Visual Lab</h2>
            <p className="text-blue-100 text-sm">
              {activity?.title || 'Design robot commands and test them visually'}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="text-white hover:text-gray-200 transition"
          >
            <i className="fa-solid fa-times text-2xl"></i>
          </button>
        </div>

        {/* Mode Tabs */}
        <div className="flex border-b bg-gray-50">
          {[
            { id: 'visual', label: 'Visual Programming', icon: '🎮' },
            { id: 'blocks', label: 'Block Coding', icon: '🧩' },
            { id: 'code', label: 'Python Code', icon: '💻' }
          ].map((mode) => (
            <button
              key={mode.id}
              onClick={() => setLabMode(mode.id as any)}
              className={`flex-1 py-3 px-4 text-sm font-medium transition ${
                labMode === mode.id
                  ? 'bg-white text-blue-600 border-b-2 border-blue-500'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-gray-100'
              }`}
            >
              {mode.icon} {mode.label}
            </button>
          ))}
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Canvas Area */}
          <div className="flex-1 p-4 bg-gray-50">
            <div className="bg-white rounded-lg p-4 h-full flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg">
                  {activity?.title || 'Robot Simulation'}
                </h3>
                <div className="flex space-x-2">
                  <button
                    onClick={resetRobot}
                    className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600 transition"
                  >
                    Reset
                  </button>
                  <button
                    onClick={executeCommands}
                    disabled={isRunning || commands.length === 0}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition disabled:opacity-50"
                  >
                    {isRunning ? 'Running...' : 'Run Program'}
                  </button>
                </div>
              </div>
              
              <canvas
                ref={canvasRef}
                width={800}
                height={600}
                className="border border-gray-300 rounded-lg flex-1"
              />
            </div>
          </div>

          {/* Command Panel */}
          <div className="w-80 border-l border-gray-200 bg-white p-4 overflow-y-auto">
            {labMode === 'visual' && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-lg mb-3">Command Center</h3>
                  
                  <div className="space-y-3">
                    <select
                      value={selectedCommand}
                      onChange={(e) => setSelectedCommand(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {commandTypes.map((cmd) => (
                        <option key={cmd.id} value={cmd.id}>
                          {cmd.icon} {cmd.label}
                        </option>
                      ))}
                    </select>

                    <button
                      onClick={addCommand}
                      className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
                    >
                      Add Command
                    </button>
                  </div>
                </div>

                {/* Command List */}
                <div>
                  <h4 className="font-medium mb-2">Program ({commands.length} commands)</h4>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {commands.map((command, index) => {
                      const cmdType = commandTypes.find(ct => ct.id === command.type);
                      return (
                        <div
                          key={command.id}
                          className={`p-3 rounded-lg border text-sm ${
                            currentCommandIndex === index 
                              ? 'border-red-400 bg-red-50' 
                              : 'border-gray-200 bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <span>{cmdType?.icon}</span>
                              <span className="font-medium">{index + 1}. {cmdType?.label}</span>
                            </div>
                            <button
                              onClick={() => removeCommand(command.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <i className="fa-solid fa-trash text-xs"></i>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Device Connection Status */}
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Device Connection</span>
                    <div className={`w-3 h-3 rounded-full ${connectedDevice ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  </div>
                  <p className="text-xs text-gray-500">
                    {connectedDevice ? 'Connected to micro:bit' : 'No device connected'}
                  </p>
                </div>
              </div>
            )}

            {labMode === 'blocks' && generateBlocksView()}
            {labMode === 'code' && generateCodeView()}
          </div>
        </div>
      </div>
    </div>
  );
}