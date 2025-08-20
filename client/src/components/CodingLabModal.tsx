import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { MicrobitSimulator } from "./MicrobitSimulator";
import Editor from "@monaco-editor/react";

interface CodingLabModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CodeBlock {
  id: string;
  type: string;
  value: string;
  children?: CodeBlock[];
  condition?: CodeBlock;
}

export function CodingLabModal({ isOpen, onClose }: CodingLabModalProps) {
  const [activeTab, setActiveTab] = useState<'blocks' | 'code' | 'microbit'>('blocks');
  const [codeOutput, setCodeOutput] = useState<string[]>([]);
  const [currentCode, setCurrentCode] = useState('// Welcome to CodewiseHub!\n// Try typing: console.log("Hello, World!");\n\nconsole.log("Welcome to coding!");');
  const [codeBlocks, setCodeBlocks] = useState<CodeBlock[]>([]);
  const [draggedBlock, setDraggedBlock] = useState<string | null>(null);
  const { user } = useAuth();

  if (!isOpen) return null;

  const showMicrobitTab = user?.role === 'student' && user?.ageGroup === '6-11';

  // Enhanced Scratch-like block types with visual programming
  const availableBlocks = [
    // Basic blocks - Blue family
    { type: 'print', label: 'Say', value: 'Hello, World!', color: 'bg-blue-500', category: 'Basic', shape: 'rounded' },
    { type: 'number', label: 'Number', value: '42', color: 'bg-blue-600', category: 'Basic', shape: 'oval' },
    { type: 'text', label: 'Text', value: 'Hello', color: 'bg-blue-700', category: 'Basic', shape: 'oval' },
    { type: 'math', label: 'Math Operation', value: '1 + 1', color: 'bg-blue-800', category: 'Basic', shape: 'oval' },
    { type: 'variable', label: 'Set Variable', value: 'myVar = 10', color: 'bg-blue-400', category: 'Basic', shape: 'rounded' },
    
    // Micro:bit specific blocks - Green family
    { type: 'show_icon', label: 'Show Icon', value: 'heart', color: 'bg-green-500', category: 'Display', shape: 'rounded' },
    { type: 'show_text', label: 'Show Text', value: 'Hello', color: 'bg-green-600', category: 'Display', shape: 'rounded' },
    { type: 'clear_screen', label: 'Clear Screen', value: '', color: 'bg-green-700', category: 'Display', shape: 'rounded' },
    { type: 'led_on', label: 'LED On', value: '2,3', color: 'bg-green-800', category: 'Display', shape: 'rounded' },
    { type: 'led_off', label: 'LED Off', value: '2,3', color: 'bg-green-900', category: 'Display', shape: 'rounded' },
    
    // Input blocks - Purple family
    { type: 'button_a', label: 'When Button A Pressed', value: '', color: 'bg-purple-500', category: 'Input', shape: 'hat' },
    { type: 'button_b', label: 'When Button B Pressed', value: '', color: 'bg-purple-600', category: 'Input', shape: 'hat' },
    { type: 'on_shake', label: 'When Shaken', value: '', color: 'bg-purple-700', category: 'Input', shape: 'hat' },
    { type: 'button_pressed', label: 'Button A Pressed?', value: '', color: 'bg-purple-400', category: 'Input', shape: 'boolean' },
    
    // Control blocks - Orange family (Scratch-like)
    { type: 'repeat', label: 'Repeat', value: '10', color: 'bg-orange-500', category: 'Control', shape: 'c-block' },
    { type: 'forever', label: 'Forever', value: '', color: 'bg-orange-600', category: 'Control', shape: 'c-block' },
    { type: 'wait', label: 'Wait', value: '1', color: 'bg-orange-700', category: 'Control', shape: 'rounded' },
    { type: 'if', label: 'If', value: '', color: 'bg-orange-800', category: 'Control', shape: 'c-block' },
    { type: 'if_else', label: 'If Else', value: '', color: 'bg-orange-900', category: 'Control', shape: 'c-block' },
    { type: 'wait_until', label: 'Wait Until', value: '', color: 'bg-orange-400', category: 'Control', shape: 'rounded' },
    
    // Logic blocks - Pink family  
    { type: 'equals', label: 'Equals', value: '= ', color: 'bg-pink-500', category: 'Logic', shape: 'boolean' },
    { type: 'greater_than', label: 'Greater Than', value: '> ', color: 'bg-pink-600', category: 'Logic', shape: 'boolean' },
    { type: 'less_than', label: 'Less Than', value: '< ', color: 'bg-pink-700', category: 'Logic', shape: 'boolean' },
    { type: 'and', label: 'And', value: '', color: 'bg-pink-800', category: 'Logic', shape: 'boolean' },
    { type: 'or', label: 'Or', value: '', color: 'bg-pink-900', category: 'Logic', shape: 'boolean' },
    { type: 'not', label: 'Not', value: '', color: 'bg-pink-400', category: 'Logic', shape: 'boolean' },
    
    // Sensor blocks - Teal family
    { type: 'temperature', label: 'Temperature', value: '', color: 'bg-teal-500', category: 'Sensors', shape: 'oval' },
    { type: 'light_level', label: 'Light Level', value: '', color: 'bg-teal-600', category: 'Sensors', shape: 'oval' },
    { type: 'compass', label: 'Compass Heading', value: '', color: 'bg-teal-700', category: 'Sensors', shape: 'oval' },
    { type: 'accelerometer', label: 'Acceleration', value: 'x', color: 'bg-teal-800', category: 'Sensors', shape: 'oval' },
  ];

  const blockCategories = ['Basic', 'Display', 'Input', 'Control', 'Logic', 'Sensors'];

  const handleDragStart = (blockType: string) => {
    setDraggedBlock(blockType);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedBlock) {
      const blockTemplate = availableBlocks.find(b => b.type === draggedBlock);
      if (blockTemplate) {
        const newBlock: CodeBlock = {
          id: Date.now().toString(),
          type: blockTemplate.type as any,
          value: blockTemplate.value
        };
        setCodeBlocks(prev => [...prev, newBlock]);
        setTimeout(() => updateGeneratedCode(), 100);
      }
      setDraggedBlock(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const generateCodeFromBlocks = (blocks: CodeBlock[], indent: number = 0): string => {
    const indentStr = '  '.repeat(indent);
    let code = '';
    
    blocks.forEach(block => {
      switch (block.type) {
        case 'print':
          code += `${indentStr}console.log("${block.value}");\n`;
          break;
        case 'number':
        case 'text':
          code += `${indentStr}${block.value}\n`;
          break;
        case 'math':
          code += `${indentStr}console.log(${block.value});\n`;
          break;
        case 'variable':
          code += `${indentStr}${block.value};\n`;
          break;
        case 'show_icon':
          code += `${indentStr}microbit.showIcon("${block.value}");\n`;
          break;
        case 'show_text':
          code += `${indentStr}microbit.showText("${block.value}");\n`;
          break;
        case 'clear_screen':
          code += `${indentStr}microbit.clearScreen();\n`;
          break;
        case 'led_on':
          const [x, y] = block.value.split(',').map(n => parseInt(n.trim()));
          code += `${indentStr}microbit.plot(${x || 0}, ${y || 0});\n`;
          break;
        case 'led_off':
          const [x2, y2] = block.value.split(',').map(n => parseInt(n.trim()));
          code += `${indentStr}microbit.unplot(${x2 || 0}, ${y2 || 0});\n`;
          break;
        case 'button_a':
          code += `${indentStr}input.onButtonPressed(Button.A, () => {\n`;
          if (block.children) {
            code += generateCodeFromBlocks(block.children, indent + 1);
          }
          code += `${indentStr}});\n`;
          break;
        case 'button_b':
          code += `${indentStr}input.onButtonPressed(Button.B, () => {\n`;
          if (block.children) {
            code += generateCodeFromBlocks(block.children, indent + 1);
          }
          code += `${indentStr}});\n`;
          break;
        case 'on_shake':
          code += `${indentStr}input.onGesture(Gesture.Shake, () => {\n`;
          if (block.children) {
            code += generateCodeFromBlocks(block.children, indent + 1);
          }
          code += `${indentStr}});\n`;
          break;
        case 'repeat':
          code += `${indentStr}for (let i = 0; i < ${block.value || 10}; i++) {\n`;
          if (block.children) {
            code += generateCodeFromBlocks(block.children, indent + 1);
          }
          code += `${indentStr}}\n`;
          break;
        case 'forever':
          code += `${indentStr}basic.forever(() => {\n`;
          if (block.children) {
            code += generateCodeFromBlocks(block.children, indent + 1);
          }
          code += `${indentStr}});\n`;
          break;
        case 'wait':
          code += `${indentStr}basic.pause(${(parseFloat(block.value) || 1) * 1000});\n`;
          break;
        case 'if':
          const condition = block.condition ? generateConditionCode(block.condition) : 'true';
          code += `${indentStr}if (${condition}) {\n`;
          if (block.children) {
            code += generateCodeFromBlocks(block.children, indent + 1);
          }
          code += `${indentStr}}\n`;
          break;
        case 'if_else':
          const ifCondition = block.condition ? generateConditionCode(block.condition) : 'true';
          code += `${indentStr}if (${ifCondition}) {\n`;
          if (block.children && block.children[0]) {
            code += generateCodeFromBlocks([block.children[0]], indent + 1);
          }
          code += `${indentStr}} else {\n`;
          if (block.children && block.children[1]) {
            code += generateCodeFromBlocks([block.children[1]], indent + 1);
          }
          code += `${indentStr}}\n`;
          break;
        case 'temperature':
          code += `${indentStr}input.temperature()\n`;
          break;
        case 'light_level':
          code += `${indentStr}input.lightLevel()\n`;
          break;
        case 'compass':
          code += `${indentStr}input.compassHeading()\n`;
          break;
        case 'accelerometer':
          code += `${indentStr}input.acceleration(Dimension.${block.value.toUpperCase() || 'X'})\n`;
          break;
      }
    });
    
    return code;
  };

  const generateConditionCode = (condition: CodeBlock): string => {
    switch (condition.type) {
      case 'equals':
        return `${condition.value} === ${condition.children?.[0]?.value || 'true'}`;
      case 'greater_than':
        return `${condition.value} > ${condition.children?.[0]?.value || '0'}`;
      case 'less_than':
        return `${condition.value} < ${condition.children?.[0]?.value || '0'}`;
      case 'button_pressed':
        return 'input.buttonIsPressed(Button.A)';
      case 'and':
        return `(${condition.children?.[0] ? generateConditionCode(condition.children[0]) : 'true'}) && (${condition.children?.[1] ? generateConditionCode(condition.children[1]) : 'true'})`;
      case 'or':
        return `(${condition.children?.[0] ? generateConditionCode(condition.children[0]) : 'false'}) || (${condition.children?.[1] ? generateConditionCode(condition.children[1]) : 'false'})`;
      case 'not':
        return `!(${condition.children?.[0] ? generateConditionCode(condition.children[0]) : 'false'})`;
      default:
        return condition.value || 'true';
    }
  };

  const updateGeneratedCode = () => {
    let code = '// Generated from Scratch-like blocks\n\n';
    code += generateCodeFromBlocks(codeBlocks);
    setCurrentCode(code);
  };

  const removeBlock = (blockId: string) => {
    const newBlocks = codeBlocks.filter(b => b.id !== blockId);
    setCodeBlocks(newBlocks);
    setTimeout(() => updateGeneratedCode(), 100);
  };

  const updateBlockValue = (blockId: string, newValue: string) => {
    const newBlocks = codeBlocks.map(b => 
      b.id === blockId ? { ...b, value: newValue } : b
    );
    setCodeBlocks(newBlocks);
    setTimeout(() => updateGeneratedCode(), 100);
  };

  // Custom console.log implementation for output
  const executeCode = () => {
    const output: string[] = [];
    const originalConsoleLog = console.log;
    
    // Override console.log to capture output
    console.log = (...args: any[]) => {
      output.push(args.map(arg => String(arg)).join(' '));
    };

    try {
      // Execute the code
      const wrappedCode = `
        (function() {
          ${currentCode}
        })();
      `;
      eval(wrappedCode);
      
      if (output.length === 0) {
        output.push('Code executed successfully (no output)');
      }
    } catch (error) {
      output.push(`Error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      // Restore original console.log
      console.log = originalConsoleLog;
    }

    setCodeOutput(prev => [...prev, ...output.map(line => `> ${line}`)]);
  };

  const clearOutput = () => {
    setCodeOutput([]);
  };

  const runBlocksCode = () => {
    executeCode();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl max-w-[95%] max-h-[95%] w-full h-full overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold">Coding Lab</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <i className="fa-solid fa-times text-2xl"></i>
          </button>
        </div>
        
        {/* Editor Tabs */}
        <div className="editor-tabs">
          <div 
            className={`editor-tab ${activeTab === 'blocks' ? 'active' : ''}`}
            onClick={() => setActiveTab('blocks')}
          >
            <i className="fa-solid fa-puzzle-piece mr-2"></i>Blocks
          </div>
          <div 
            className={`editor-tab ${activeTab === 'code' ? 'active' : ''}`}
            onClick={() => setActiveTab('code')}
          >
            <i className="fa-solid fa-code mr-2"></i>Code
          </div>
          {showMicrobitTab && (
            <div 
              className={`editor-tab ${activeTab === 'microbit' ? 'active' : ''}`}
              onClick={() => setActiveTab('microbit')}
            >
              <i className="fa-solid fa-microchip mr-2"></i>Micro:bit
            </div>
          )}
        </div>

        {/* Editor Content */}
        <div className="flex-1 bg-white rounded-b-lg overflow-hidden" style={{ height: 'calc(100% - 140px)' }}>
          {activeTab === 'blocks' && (
            <div className="h-full flex">
              {/* Enhanced Block Palette with Categories */}
              <div className="w-80 border-r border-gray-300 p-4 overflow-y-auto">
                <h3 className="text-lg font-bold mb-4">Block Palette</h3>
                {blockCategories.map((category) => (
                  <div key={category} className="mb-6">
                    <h4 className="font-semibold text-sm uppercase tracking-wide text-gray-600 mb-3">{category}</h4>
                    <div className="space-y-2">
                      {availableBlocks
                        .filter(block => block.category === category)
                        .map((block) => (
                          <div
                            key={block.type}
                            draggable
                            onDragStart={() => handleDragStart(block.type)}
                            className={`${block.color} text-white px-3 py-2 rounded-lg cursor-grab hover:opacity-80 transition select-none shadow-md transform hover:scale-105`}
                          >
                            <div className="font-semibold text-sm">{block.label}</div>
                            {block.value && (
                              <div className="text-xs opacity-75 mt-1">{block.value}</div>
                            )}
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Block Workspace */}
              <div className="flex-1 p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold">Visual Programming</h3>
                  <button
                    onClick={runBlocksCode}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
                  >
                    <i className="fa-solid fa-play mr-2"></i>Run Blocks
                  </button>
                </div>
                
                <div 
                  className="w-full bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-6 min-h-96"
                  style={{ height: 'calc(100% - 60px)' }}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                >
                  {codeBlocks.length === 0 ? (
                    <div className="text-center text-gray-500 mt-20">
                      <i className="fa-solid fa-puzzle-piece text-4xl mb-4"></i>
                      <p>Drag blocks here to build your program</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {codeBlocks.map((block, index) => {
                        const blockDef = availableBlocks.find(b => b.type === block.type);
                        return (
                          <div key={block.id} className="flex items-center space-x-3 group">
                            <div className="text-gray-500 font-mono text-sm w-8">{index + 1}.</div>
                            <div className={`${blockDef?.color} text-white px-4 py-3 rounded-lg flex-1 shadow-lg transform transition-all hover:scale-102`}>
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <div className="font-semibold flex items-center">
                                    <span className="mr-2">🧩</span>
                                    {blockDef?.label}
                                  </div>
                                  {!['clear_screen', 'button_a', 'button_b', 'on_shake'].includes(block.type) && (
                                    <input
                                      type="text"
                                      value={block.value}
                                      onChange={(e) => updateBlockValue(block.id, e.target.value)}
                                      className="bg-white bg-opacity-20 text-white placeholder-white placeholder-opacity-50 border border-white border-opacity-30 rounded px-2 py-1 text-sm mt-2 w-full focus:bg-opacity-30 focus:outline-none"
                                      placeholder={
                                        block.type === 'show_icon' ? 'heart, smile, arrow' :
                                        block.type === 'repeat' ? 'Number of times' :
                                        block.type === 'wait' ? 'Seconds to wait' :
                                        block.type === 'if' ? 'Condition' :
                                        'Enter value...'
                                      }
                                    />
                                  )}
                                </div>
                                <button
                                  onClick={() => removeBlock(block.id)}
                                  className="text-white hover:text-red-200 ml-3 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <i className="fa-solid fa-times"></i>
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Output Console for Blocks */}
              <div className="w-80 border-l border-gray-300 p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold">Output</h3>
                  <button
                    onClick={clearOutput}
                    className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition"
                  >
                    Clear
                  </button>
                </div>
                <div className="bg-gray-900 text-green-400 rounded-lg p-4 h-96 overflow-y-auto font-mono text-sm">
                  {codeOutput.length === 0 ? (
                    <div className="text-gray-500">Output will appear here...</div>
                  ) : (
                    codeOutput.map((line, index) => (
                      <div key={index} className="mb-1">{line}</div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'code' && (
            <div className="h-full flex">
              {/* Monaco Code Editor */}
              <div className="flex-1 p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold">Code Editor</h3>
                  <button
                    onClick={executeCode}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                  >
                    <i className="fa-solid fa-play mr-2"></i>Run Code
                  </button>
                </div>
                <div className="rounded-lg border border-gray-300" style={{ height: 'calc(100% - 60px)' }}>
                  <Editor
                    height="100%"
                    defaultLanguage="javascript"
                    value={currentCode}
                    onChange={(value) => setCurrentCode(value || '')}
                    theme="vs-dark"
                    options={{
                      minimap: { enabled: false },
                      fontSize: 14,
                      lineNumbers: 'on',
                      wordWrap: 'on',
                      automaticLayout: true,
                      scrollBeyondLastLine: false,
                      tabSize: 2,
                    }}
                  />
                </div>
              </div>
              
              {/* Output Console for Code */}
              <div className="w-80 border-l border-gray-300 p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold">Console Output</h3>
                  <button
                    onClick={clearOutput}
                    className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition"
                  >
                    Clear
                  </button>
                </div>
                <div className="bg-gray-900 text-green-400 rounded-lg p-4 h-96 overflow-y-auto font-mono text-sm">
                  {codeOutput.length === 0 ? (
                    <div className="text-gray-500">Console output will appear here...</div>
                  ) : (
                    codeOutput.map((line, index) => (
                      <div key={index} className="mb-1">{line}</div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'microbit' && (
            <div className="h-full overflow-y-auto">
              <div className="grid lg:grid-cols-3 gap-6 p-6">
                {/* Micro:bit Blocks */}
                <div className="lg:col-span-2">
                  <h3 className="font-bold mb-4">Drag blocks to create your program:</h3>
                  <div className="space-y-4">
                    {/* Basic Blocks */}
                    <div className="bg-blue-100 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-800 mb-2">Basic</h4>
                      <div className="flex flex-wrap gap-2">
                        <div className="bg-blue-500 text-white px-3 py-2 rounded cursor-pointer hover:bg-blue-600 transition">
                          Show Icon
                        </div>
                        <div className="bg-blue-500 text-white px-3 py-2 rounded cursor-pointer hover:bg-blue-600 transition">
                          Show String
                        </div>
                        <div className="bg-blue-500 text-white px-3 py-2 rounded cursor-pointer hover:bg-blue-600 transition">
                          Clear Screen
                        </div>
                      </div>
                    </div>

                    {/* Input Blocks */}
                    <div className="bg-green-100 p-4 rounded-lg">
                      <h4 className="font-semibold text-green-800 mb-2">Input</h4>
                      <div className="flex flex-wrap gap-2">
                        <div className="bg-green-500 text-white px-3 py-2 rounded cursor-pointer hover:bg-green-600 transition">
                          On Button A
                        </div>
                        <div className="bg-green-500 text-white px-3 py-2 rounded cursor-pointer hover:bg-green-600 transition">
                          On Button B
                        </div>
                        <div className="bg-green-500 text-white px-3 py-2 rounded cursor-pointer hover:bg-green-600 transition">
                          On Shake
                        </div>
                      </div>
                    </div>

                    {/* LED Blocks */}
                    <div className="bg-purple-100 p-4 rounded-lg">
                      <h4 className="font-semibold text-purple-800 mb-2">LED</h4>
                      <div className="flex flex-wrap gap-2">
                        <div className="bg-purple-500 text-white px-3 py-2 rounded cursor-pointer hover:bg-purple-600 transition">
                          Turn On LED
                        </div>
                        <div className="bg-purple-500 text-white px-3 py-2 rounded cursor-pointer hover:bg-purple-600 transition">
                          Turn Off LED
                        </div>
                        <div className="bg-purple-500 text-white px-3 py-2 rounded cursor-pointer hover:bg-purple-600 transition">
                          Plot Pattern
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Program Workspace */}
                  <div className="mt-6">
                    <h4 className="font-bold mb-2">Your Program:</h4>
                    <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-6 min-h-32">
                      <p className="text-gray-500 text-center">Drag blocks here to build your program</p>
                    </div>
                  </div>
                </div>

                {/* Enhanced Micro:bit Simulator */}
                <div>
                  <MicrobitSimulator 
                    programCode={currentCode}
                    onButtonPress={(button) => {
                      setCodeOutput(prev => [...prev, `> Button ${button} pressed in simulator`]);
                    }}
                    onShake={() => {
                      setCodeOutput(prev => [...prev, `> Device shaken in simulator`]);
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
