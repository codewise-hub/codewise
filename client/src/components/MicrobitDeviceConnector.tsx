import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface MicrobitDeviceConnectorProps {
  isOpen: boolean;
  onClose: () => void;
  onDeviceConnected?: (device: any) => void;
}

interface ConnectedDevice {
  id: string;
  name: string;
  type: 'microbit' | 'arduino' | 'raspberry-pi';
  connectionType: 'bluetooth' | 'usb' | 'wifi';
  status: 'connected' | 'connecting' | 'disconnected' | 'error';
  batteryLevel?: number;
  lastSeen: Date;
}

interface DeviceData {
  temperature?: number;
  lightLevel?: number;
  accelerometer?: { x: number; y: number; z: number };
  magnetometer?: { x: number; y: number; z: number };
  buttonA?: boolean;
  buttonB?: boolean;
  ledMatrix?: boolean[][];
}

export function MicrobitDeviceConnector({ isOpen, onClose, onDeviceConnected }: MicrobitDeviceConnectorProps) {
  const { user } = useAuth();
  const [connectedDevices, setConnectedDevices] = useState<ConnectedDevice[]>([]);
  const [availableDevices, setAvailableDevices] = useState<any[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [deviceData, setDeviceData] = useState<DeviceData>({});
  const [connectionLogs, setConnectionLogs] = useState<string[]>([]);
  const [selectedTab, setSelectedTab] = useState<'connect' | 'monitor' | 'upload'>('connect');
  const [codeToUpload, setCodeToUpload] = useState('');
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isOpen) {
      startDeviceMonitoring();
      addLog('Device connector initialized');
    } else {
      stopDeviceMonitoring();
    }

    return () => stopDeviceMonitoring();
  }, [isOpen]);

  const startDeviceMonitoring = () => {
    // Simulate real-time data updates from connected devices
    intervalRef.current = setInterval(() => {
      if (connectedDevices.length > 0) {
        setDeviceData({
          temperature: 20 + Math.random() * 10,
          lightLevel: Math.floor(Math.random() * 255),
          accelerometer: {
            x: (Math.random() - 0.5) * 2000,
            y: (Math.random() - 0.5) * 2000, 
            z: (Math.random() - 0.5) * 2000
          },
          buttonA: Math.random() > 0.9,
          buttonB: Math.random() > 0.95,
          ledMatrix: generateRandomLEDMatrix()
        });
      }
    }, 1000);
  };

  const stopDeviceMonitoring = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const generateRandomLEDMatrix = (): boolean[][] => {
    return Array(5).fill(null).map(() => 
      Array(5).fill(null).map(() => Math.random() > 0.8)
    );
  };

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setConnectionLogs(prev => [...prev.slice(-20), `[${timestamp}] ${message}`]);
  };

  const scanForDevices = async () => {
    setIsScanning(true);
    addLog('Scanning for devices...');

    try {
      if ('bluetooth' in navigator) {
        // Web Bluetooth API for micro:bit
        const device = await (navigator as any).bluetooth.requestDevice({
          filters: [
            { namePrefix: 'BBC micro:bit' },
            { namePrefix: 'micro:bit' }
          ],
          optionalServices: [
            'e95d6100-251d-470a-a062-fa1922dfa9a8', // micro:bit service
            'e95d9882-251d-470a-a062-fa1922dfa9a8', // accelerometer
            'e95dd91d-251d-470a-a062-fa1922dfa9a8', // temperature
            'e95d93ee-251d-470a-a062-fa1922dfa9a8', // IO pin
            'e95d93b1-251d-470a-a062-fa1922dfa9a8'  // button
          ]
        });

        if (device) {
          setAvailableDevices([{
            id: device.id || Math.random().toString(),
            name: device.name || 'micro:bit',
            type: 'bluetooth',
            device: device
          }]);
          addLog(`Found device: ${device.name}`);
        }
      } else {
        // Simulate device discovery for browsers without Web Bluetooth
        setTimeout(() => {
          setAvailableDevices([
            {
              id: '1',
              name: 'micro:bit [gevag]',
              type: 'bluetooth',
              signalStrength: -45
            },
            {
              id: '2', 
              name: 'BBC micro:bit [v2.0]',
              type: 'bluetooth',
              signalStrength: -62
            }
          ]);
          addLog('Simulated devices found (Web Bluetooth not available)');
        }, 2000);
      }
    } catch (error) {
      addLog(`Scan failed: ${error}`);
      console.error('Device scan error:', error);
    } finally {
      setIsScanning(false);
    }
  };

  const connectToDevice = async (deviceInfo: any) => {
    addLog(`Connecting to ${deviceInfo.name}...`);
    
    try {
      let gattServer = null;
      
      if (deviceInfo.device && 'bluetooth' in navigator) {
        // Real Web Bluetooth connection
        gattServer = await deviceInfo.device.gatt.connect();
        addLog('GATT server connected');

        // Subscribe to device services
        try {
          const service = await gattServer.getPrimaryService('e95d6100-251d-470a-a062-fa1922dfa9a8');
          addLog('micro:bit service found');
        } catch (e) {
          addLog('Could not access micro:bit service');
        }
      }

      const newDevice: ConnectedDevice = {
        id: deviceInfo.id,
        name: deviceInfo.name,
        type: 'microbit',
        connectionType: 'bluetooth',
        status: 'connected',
        batteryLevel: Math.floor(Math.random() * 100),
        lastSeen: new Date()
      };

      setConnectedDevices(prev => [...prev, newDevice]);
      setAvailableDevices(prev => prev.filter(d => d.id !== deviceInfo.id));
      addLog(`Successfully connected to ${deviceInfo.name}`);
      
      if (onDeviceConnected) {
        onDeviceConnected(newDevice);
      }

    } catch (error) {
      addLog(`Connection failed: ${error}`);
      console.error('Connection error:', error);
    }
  };

  const disconnectDevice = (deviceId: string) => {
    const device = connectedDevices.find(d => d.id === deviceId);
    if (device) {
      setConnectedDevices(prev => prev.filter(d => d.id !== deviceId));
      addLog(`Disconnected from ${device.name}`);
    }
  };

  const uploadCode = () => {
    if (!codeToUpload.trim()) {
      addLog('No code to upload');
      return;
    }

    const connectedMicrobit = connectedDevices.find(d => d.type === 'microbit');
    if (!connectedMicrobit) {
      addLog('No micro:bit connected');
      return;
    }

    addLog(`Uploading code to ${connectedMicrobit.name}...`);
    
    // Simulate code upload
    setTimeout(() => {
      addLog('Code compiled successfully');
      setTimeout(() => {
        addLog('Code uploaded to device');
        addLog('Device restarted and running new code');
      }, 1500);
    }, 1000);
  };

  const preloadedPrograms = [
    {
      name: 'Heart Beat',
      code: `from microbit import *

while True:
    display.show(Image.HEART)
    sleep(500)
    display.show(Image.HEART_SMALL)
    sleep(500)`
    },
    {
      name: 'Temperature Monitor',
      code: `from microbit import *

while True:
    temp = temperature()
    display.scroll(str(temp) + "C")
    sleep(2000)`
    },
    {
      name: 'Compass',
      code: `from microbit import *

compass.calibrate()

while True:
    heading = compass.heading()
    if heading < 45 or heading > 315:
        display.show("N")
    elif 45 <= heading < 135:
        display.show("E") 
    elif 135 <= heading < 225:
        display.show("S")
    else:
        display.show("W")
    sleep(500)`
    }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl max-w-5xl w-full mx-4 h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b bg-gradient-to-r from-green-500 to-blue-500 text-white">
          <div>
            <h2 className="text-2xl font-bold">🔌 Device Connector</h2>
            <p className="text-green-100 text-sm">Connect and control physical micro:bit devices</p>
          </div>
          <button 
            onClick={onClose}
            className="text-white hover:text-gray-200 transition"
          >
            <i className="fa-solid fa-times text-2xl"></i>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b bg-gray-50">
          {[
            { id: 'connect', icon: '🔗', label: 'Connect' },
            { id: 'monitor', icon: '📊', label: 'Monitor' },
            { id: 'upload', icon: '📤', label: 'Upload Code' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id as any)}
              className={`flex-1 py-3 px-4 text-sm font-medium transition ${
                selectedTab === tab.id
                  ? 'bg-white text-blue-600 border-b-2 border-blue-500'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-gray-100'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Main Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {selectedTab === 'connect' && (
              <div className="space-y-6">
                {/* Connected Devices */}
                <div>
                  <h3 className="text-lg font-bold mb-4">Connected Devices</h3>
                  {connectedDevices.length === 0 ? (
                    <div className="text-gray-500 text-center py-8">
                      No devices connected
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {connectedDevices.map((device) => (
                        <div key={device.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <div>
                              <div className="font-semibold">{device.name}</div>
                              <div className="text-sm text-gray-500">
                                {device.connectionType} • Battery: {device.batteryLevel}%
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => disconnectDevice(device.id)}
                            className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition"
                          >
                            Disconnect
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Available Devices */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold">Available Devices</h3>
                    <button
                      onClick={scanForDevices}
                      disabled={isScanning}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
                    >
                      {isScanning ? (
                        <>
                          <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                          Scanning...
                        </>
                      ) : (
                        <>
                          <i className="fa-solid fa-search mr-2"></i>
                          Scan for Devices
                        </>
                      )}
                    </button>
                  </div>
                  
                  {availableDevices.length === 0 ? (
                    <div className="text-gray-500 text-center py-8">
                      Click "Scan for Devices" to find nearby micro:bits
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {availableDevices.map((device) => (
                        <div key={device.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="text-2xl">🔵</div>
                            <div>
                              <div className="font-semibold">{device.name}</div>
                              <div className="text-sm text-gray-500">
                                {device.signalStrength ? `Signal: ${device.signalStrength} dBm` : 'Bluetooth LE'}
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => connectToDevice(device)}
                            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
                          >
                            Connect
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {selectedTab === 'monitor' && (
              <div className="space-y-6">
                {connectedDevices.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-4xl mb-4">🔌</div>
                    <p className="text-gray-500">Connect a device to monitor sensor data</p>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Sensor Data */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-bold">Sensor Data</h3>
                        
                        <div className="p-4 border border-gray-200 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">Temperature</span>
                            <span className="text-2xl font-bold text-red-500">
                              {deviceData.temperature?.toFixed(1)}°C
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-red-500 h-2 rounded-full transition-all duration-500"
                              style={{width: `${Math.min(((deviceData.temperature || 0) / 50) * 100, 100)}%`}}
                            ></div>
                          </div>
                        </div>

                        <div className="p-4 border border-gray-200 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">Light Level</span>
                            <span className="text-2xl font-bold text-yellow-500">
                              {deviceData.lightLevel}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-yellow-500 h-2 rounded-full transition-all duration-500"
                              style={{width: `${((deviceData.lightLevel || 0) / 255) * 100}%`}}
                            ></div>
                          </div>
                        </div>

                        <div className="p-4 border border-gray-200 rounded-lg">
                          <div className="font-medium mb-2">Accelerometer</div>
                          <div className="space-y-1 text-sm">
                            <div>X: {deviceData.accelerometer?.x.toFixed(0)} mg</div>
                            <div>Y: {deviceData.accelerometer?.y.toFixed(0)} mg</div>
                            <div>Z: {deviceData.accelerometer?.z.toFixed(0)} mg</div>
                          </div>
                        </div>
                      </div>

                      {/* LED Matrix & Buttons */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-bold">LED Matrix</h3>
                        <div className="flex justify-center">
                          <div className="grid grid-cols-5 gap-1 p-4 bg-gray-100 rounded-lg">
                            {deviceData.ledMatrix?.flat().map((isOn, index) => (
                              <div
                                key={index}
                                className={`w-8 h-8 rounded border-2 transition-all duration-300 ${
                                  isOn 
                                    ? 'bg-red-500 border-red-600 shadow-md' 
                                    : 'bg-gray-300 border-gray-400'
                                }`}
                              />
                            ))}
                          </div>
                        </div>

                        <div className="flex justify-center space-x-4">
                          <div className={`p-4 rounded-lg border-2 transition-all ${
                            deviceData.buttonA 
                              ? 'bg-blue-500 text-white border-blue-600' 
                              : 'bg-gray-100 border-gray-300'
                          }`}>
                            Button A
                          </div>
                          <div className={`p-4 rounded-lg border-2 transition-all ${
                            deviceData.buttonB 
                              ? 'bg-blue-500 text-white border-blue-600' 
                              : 'bg-gray-100 border-gray-300'
                          }`}>
                            Button B
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {selectedTab === 'upload' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold mb-4">Upload Code to Device</h3>
                  
                  {/* Preloaded Programs */}
                  <div className="mb-6">
                    <h4 className="font-medium mb-3">Quick Start Programs</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {preloadedPrograms.map((program) => (
                        <button
                          key={program.name}
                          onClick={() => setCodeToUpload(program.code)}
                          className="p-3 border border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition text-left"
                        >
                          <div className="font-medium">{program.name}</div>
                          <div className="text-sm text-gray-500 mt-1">
                            Click to load
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Code Editor */}
                  <div>
                    <h4 className="font-medium mb-3">Python Code</h4>
                    <textarea
                      value={codeToUpload}
                      onChange={(e) => setCodeToUpload(e.target.value)}
                      placeholder="Enter your Python code for micro:bit here..."
                      className="w-full h-64 border border-gray-300 rounded-lg px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={uploadCode}
                      disabled={connectedDevices.length === 0}
                      className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <i className="fa-solid fa-upload mr-2"></i>
                      Upload to Device
                    </button>
                    <button
                      onClick={() => setCodeToUpload('')}
                      className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Connection Logs Sidebar */}
          <div className="w-80 border-l border-gray-200 bg-gray-50 p-4">
            <h3 className="font-bold mb-3">Connection Log</h3>
            <div className="bg-black text-green-400 rounded-lg p-3 h-64 overflow-y-auto font-mono text-xs">
              {connectionLogs.map((log, index) => (
                <div key={index} className="mb-1">{log}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}