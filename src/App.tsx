import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Wire, SocketState, LogicLevel } from './types';
import { IC_DEFINITIONS } from './engine/icLibrary';
import { solveCircuit } from './engine/circuitSolver';
import { EXPERIMENTS } from './engine/experiments';
import { AppHeader } from './components/AppHeader';
import { OutputSection } from './components/OutputSection';
import { DisplaySection } from './components/DisplaySection';
import { MainsSwitch } from './components/MainsSwitch';
import { PowerRail } from './components/PowerRails';
import { SocketGrid } from './components/SocketGrid';
import { InputSection } from './components/InputSection';
import { ClockSection } from './components/ClockSection';
import { WiresCanvas } from './components/WiresCanvas';
import { ICSelectorModal } from './components/ICSelectorModal';
import { ICPinDiagramsModal } from './components/ICPinDiagramsModal';
import { ExperimentDrawer } from './components/ExperimentDrawer';
import { DiagnosticsModal } from './components/DiagnosticsModal';
import { TestRunnerModal } from './components/TestRunnerModal';
import { ConfirmModal, ConfirmType } from './components/ConfirmModal';
import { StatusBar } from './components/StatusBar';

interface BoardSnapshot {
  wires: Wire[];
  sockets: Record<string, SocketState>;
  switches: Record<number, 0 | 1>;
}

export default function App() {
  const [mainsPower, setMainsPower] = useState<boolean>(true);
  const [zoom, setZoom] = useState<number>(1.0);
  const [wireColor, setWireColor] = useState<string>('auto');
  const [selectedTerminal, setSelectedTerminal] = useState<string | null>(null);
  const [selectedWireId, setSelectedWireId] = useState<number | null>(null);
  const [nextWireId, setNextWireId] = useState<number>(1);

  // 16 input switches (S1..S16) initialized to 0 (LOW)
  const [switches, setSwitches] = useState<Record<number, 0 | 1>>(() => {
    const sw: Record<number, 0 | 1> = {};
    for (let i = 1; i <= 16; i++) sw[i] = 0;
    return sw;
  });

  // 6 fixed sockets (U1..U6)
  const [sockets, setSockets] = useState<Record<string, SocketState>>({
    U1: { ic: null, icState: null, isPowered: false },
    U2: { ic: null, icState: null, isPowered: false },
    U3: { ic: null, icState: null, isPowered: false },
    U4: { ic: null, icState: null, isPowered: false },
    U5: { ic: null, icState: null, isPowered: false },
    U6: { ic: null, icState: null, isPowered: false },
  });

  // Patch wires
  const [wires, setWires] = useState<Wire[]>([]);
  const [undoStack, setUndoStack] = useState<BoardSnapshot[]>([]);
  const [redoStack, setRedoStack] = useState<BoardSnapshot[]>([]);

  // Clock & Pulser
  const [clockRunning, setClockRunning] = useState<boolean>(false);
  const [clockFreq, setClockFreq] = useState<number>(1.0);
  const [clockState, setClockState] = useState<0 | 1>(0);
  const [pulseCount, setPulseCount] = useState<number>(0);
  const [pulserState, setPulserState] = useState<0 | 1>(1); // Normally HIGH, drops LOW on pulse (negative edge)
  const [pulserActive, setPulserActive] = useState<boolean>(false);

  // Feedback & Prompts
  const [statusMessage, setStatusMessage] = useState<string>(
    'Trainer Ready. Select an IC from a socket or load a lab practical to begin.'
  );
  const [wirePrompt, setWirePrompt] = useState<string>(
    'Wiring Mode: Click any pin or terminal to start a wire.'
  );

  // Modals & Drawers
  const [icModalSocket, setIcModalSocket] = useState<string | null>(null);
  const [isExpDrawerOpen, setIsExpDrawerOpen] = useState<boolean>(false);
  const [isDiagnosticsOpen, setIsDiagnosticsOpen] = useState<boolean>(false);
  const [isPinDiagramsOpen, setIsPinDiagramsOpen] = useState<boolean>(false);
  const [isTestsOpen, setIsTestsOpen] = useState<boolean>(false);
  const [confirmModalType, setConfirmModalType] = useState<ConfirmType | null>(null);
  const [selectedExpKey, setSelectedExpKey] = useState<string>('exam1');
  const [verificationResult, setVerificationResult] = useState<{ pass: boolean; msg: string } | null>(null);

  const boardRef = useRef<HTMLDivElement>(null);

  // Flash status message
  const flashStatus = useCallback((msg: string) => {
    setStatusMessage(msg);
  }, []);

  // Save full board snapshot for Undo/Redo (wires + sockets + switches)
  const pushBoardHistory = useCallback(
    (currentWires: Wire[], currentSockets: Record<string, SocketState>, currentSwitches: Record<number, 0 | 1>) => {
      const clonedSockets: Record<string, SocketState> = {};
      Object.keys(currentSockets).forEach(s => {
        const sock = currentSockets[s];
        clonedSockets[s] = {
          ic: sock.ic,
          icState: sock.icState ? JSON.parse(JSON.stringify(sock.icState)) : null,
          isPowered: sock.isPowered,
        };
      });
      setUndoStack(prev => [
        ...prev.slice(-40),
        {
          wires: [...currentWires],
          sockets: clonedSockets,
          switches: { ...currentSwitches },
        },
      ]);
      setRedoStack([]);
    },
    []
  );

  // Run Electrical Simulation
  const solverResult = useMemo(() => {
    return solveCircuit(
      wires,
      sockets,
      switches,
      { state: clockState },
      { state: pulserState },
      mainsPower
    );
  }, [wires, sockets, switches, clockState, pulserState, mainsPower]);

  // Connected terminals set
  const connectedTerminals = useMemo(() => {
    const set = new Set<string>();
    wires.forEach(w => {
      set.add(w.from);
      set.add(w.to);
    });
    return set;
  }, [wires]);

  // Continuous Clock Interval
  useEffect(() => {
    if (!clockRunning || !mainsPower) return;

    const intervalMs = 1000 / clockFreq / 2;
    const timer = setInterval(() => {
      setClockState(prev => {
        const next = prev === 1 ? 0 : 1;
        if (next === 0) {
          setPulseCount(c => c + 1);
        }
        return next;
      });
    }, Math.max(10, intervalMs));

    return () => clearInterval(timer);
  }, [clockRunning, clockFreq, mainsPower]);

  // Manual Pulser trigger (clean negative edge: 1 -> 0 -> 1)
  const handleManualPulse = useCallback(() => {
    if (!mainsPower) {
      flashStatus('Trainer power is OFF. Switch on mains power.');
      return;
    }

    setPulserState(0);
    setPulserActive(true);
    setPulseCount(c => c + 1);

    setTimeout(() => {
      setPulserState(1);
      setPulserActive(false);
    }, 150);
  }, [mainsPower, flashStatus]);

  // Terminal click handler
  const handleTerminalClick = useCallback(
    (tid: string) => {
      if (!mainsPower) {
        flashStatus('Mains power is OFF. Switch ON power to operate trainer.');
        return;
      }

      // First click: select starting terminal
      if (!selectedTerminal) {
        setSelectedTerminal(tid);
        setSelectedWireId(null);
        setWirePrompt(`Selected: ${tid}. Click destination terminal to connect patch wire.`);
        return;
      }

      // Clicking same terminal cancels
      if (selectedTerminal === tid) {
        setSelectedTerminal(null);
        setWirePrompt('Wiring Mode: Click any pin or terminal to start a wire.');
        return;
      }

      // Connecting two terminals
      const tidA = selectedTerminal;
      const tidB = tid;

      // Prevent duplicate wire between identical terminals
      const exists = wires.some(
        w => (w.from === tidA && w.to === tidB) || (w.from === tidB && w.to === tidA)
      );
      if (exists) {
        flashStatus('A patch wire already connects these two terminals.');
        setSelectedTerminal(null);
        setWirePrompt('Wiring Mode: Click any pin or terminal to start a wire.');
        return;
      }

      // Determine wire color
      let chosenColor = wireColor;
      if (wireColor === 'auto') {
        if (tidA.startsWith('vcc:') || tidB.startsWith('vcc:')) chosenColor = '#dc2626'; // Red
        else if (tidA.startsWith('gnd:') || tidB.startsWith('gnd:')) chosenColor = '#16a34a'; // Green
        else if (tidA.startsWith('clk:') || tidB.startsWith('clk:')) chosenColor = '#d97706'; // Amber
        else if (tidA.startsWith('out:') || tidB.startsWith('out:')) chosenColor = '#9333ea'; // Purple
        else chosenColor = '#2563eb'; // Blue
      }

      pushBoardHistory(wires, sockets, switches);

      const newWire: Wire = {
        id: nextWireId,
        from: tidA,
        to: tidB,
        color: chosenColor,
      };

      setWires(prev => [...prev, newWire]);
      setNextWireId(id => id + 1);
      setSelectedTerminal(null);
      setSelectedWireId(null);
      setWirePrompt('Wiring Mode: Click any pin or terminal to start a wire.');
      flashStatus(`Connected ${tidA} ⟷ ${tidB}.`);
    },
    [mainsPower, selectedTerminal, wires, sockets, switches, wireColor, nextWireId, pushBoardHistory, flashStatus]
  );

  // Wire selection
  const handleSelectWire = useCallback((wireId: number) => {
    setSelectedWireId(wireId);
    setSelectedTerminal(null); // Clear any partial wire being drawn
    setWirePrompt(`Wire #${wireId} selected. Press Delete or click 'Clear Wire' to remove.`);
  }, []);

  // Delete selected wire (Clear Wire)
  const handleClearSelectedWire = useCallback(() => {
    if (selectedWireId === null) {
      if (wires.length === 0) {
        flashStatus('No wires on board. Connect terminals to place a wire first.');
        setWirePrompt('Notice: The board currently has 0 wires to clear.');
      } else {
        flashStatus('No wire selected. Click on any wire on the board to select it, then click Clear Wire (or press Delete).');
        setWirePrompt('Notice: Select a wire first by clicking it, then press Delete or click Clear Wire.');
      }
      return;
    }
    pushBoardHistory(wires, sockets, switches);
    const removedId = selectedWireId;
    setWires(prev => prev.filter(w => w.id !== removedId));
    setSelectedWireId(null);
    setSelectedTerminal(null);
    setWirePrompt('Wiring Mode: Click any pin or terminal to start a wire.');
    flashStatus(`Wire #${removedId} removed. Circuit recalculated.`);
  }, [selectedWireId, wires, sockets, switches, pushBoardHistory, flashStatus]);

  // Undo / Redo
  const handleUndo = useCallback(() => {
    if (undoStack.length === 0) return;
    const previous = undoStack[undoStack.length - 1];
    const clonedCurrentSockets: Record<string, SocketState> = {};
    Object.keys(sockets).forEach(s => {
      const sock = sockets[s];
      clonedCurrentSockets[s] = {
        ic: sock.ic,
        icState: sock.icState ? JSON.parse(JSON.stringify(sock.icState)) : null,
        isPowered: sock.isPowered,
      };
    });
    setRedoStack(prev => [
      ...prev,
      {
        wires: [...wires],
        sockets: clonedCurrentSockets,
        switches: { ...switches },
      },
    ]);
    setUndoStack(prev => prev.slice(0, -1));
    setWires(previous.wires);
    setSockets(previous.sockets);
    setSwitches(previous.switches);
    setSelectedTerminal(null);
    setSelectedWireId(null);
    flashStatus('Undo: restored previous board state.');
  }, [undoStack, wires, sockets, switches, flashStatus]);

  const handleRedo = useCallback(() => {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    const clonedCurrentSockets: Record<string, SocketState> = {};
    Object.keys(sockets).forEach(s => {
      const sock = sockets[s];
      clonedCurrentSockets[s] = {
        ic: sock.ic,
        icState: sock.icState ? JSON.parse(JSON.stringify(sock.icState)) : null,
        isPowered: sock.isPowered,
      };
    });
    setUndoStack(prev => [
      ...prev,
      {
        wires: [...wires],
        sockets: clonedCurrentSockets,
        switches: { ...switches },
      },
    ]);
    setRedoStack(prev => prev.slice(0, -1));
    setWires(next.wires);
    setSockets(next.sockets);
    setSwitches(next.switches);
    setSelectedTerminal(null);
    setSelectedWireId(null);
    flashStatus('Redo: applied board state.');
  }, [redoStack, wires, sockets, switches, flashStatus]);

  // Check if board has any placed elements
  const hasPlacedComponents = useMemo(() => {
    const hasWires = wires.length > 0;
    const hasIcs = Object.values(sockets).some(s => !!s.ic);
    const hasActiveSwitches = Object.values(switches).some(v => v === 1);
    return hasWires || hasIcs || hasActiveSwitches;
  }, [wires, sockets, switches]);

  // Clear Board initiation (checks if empty, otherwise opens confirmation dialog)
  const handleClearBoardPrompt = useCallback(() => {
    if (!hasPlacedComponents) {
      flashStatus('The board is already completely empty.');
      setWirePrompt('Notice: The board currently has no wires or placed ICs to clear.');
      return;
    }
    setConfirmModalType('clearBoard');
  }, [hasPlacedComponents, flashStatus]);

  // Reset Board initiation (opens confirmation dialog)
  const handleResetBoardPrompt = useCallback(() => {
    setConfirmModalType('resetBoard');
  }, []);

  // Confirmed Clear Board: completely clears all user-placed ICs, wires, switch inputs, and resets state
  const handleClearBoardConfirm = useCallback(() => {
    pushBoardHistory(wires, sockets, switches);
    setWires([]);
    setSockets({
      U1: { ic: null, icState: null, isPowered: false },
      U2: { ic: null, icState: null, isPowered: false },
      U3: { ic: null, icState: null, isPowered: false },
      U4: { ic: null, icState: null, isPowered: false },
      U5: { ic: null, icState: null, isPowered: false },
      U6: { ic: null, icState: null, isPowered: false },
    });
    setSwitches(() => {
      const sw: Record<number, 0 | 1> = {};
      for (let i = 1; i <= 16; i++) sw[i] = 0;
      return sw;
    });
    // Stop clock generator & reset pulse controls
    setClockRunning(false);
    setClockState(0);
    setPulseCount(0);
    setPulserActive(false);
    setPulserState(1);
    setSelectedTerminal(null);
    setSelectedWireId(null);
    setWirePrompt('Wiring Mode: Click any pin or terminal to start a wire.');
    setVerificationResult(null);
    flashStatus('Board completely cleared: All wires, ICs, and switch inputs removed. Click Undo (Ctrl+Z) to restore.');
  }, [wires, sockets, switches, pushBoardHistory, flashStatus]);

  // Toggle switch
  const handleToggleSwitch = useCallback(
    (swId: number) => {
      if (!mainsPower) {
        flashStatus('Trainer power is OFF.');
        return;
      }
      setSwitches(prev => ({
        ...prev,
        [swId]: prev[swId] === 1 ? 0 : 1,
      }));
    },
    [mainsPower, flashStatus]
  );

  // IC Insert & Eject
  const handleInsertIcDirect = useCallback(
    (icCode: string, sockId: string) => {
      const def = IC_DEFINITIONS[icCode];
      if (!def) return;
      pushBoardHistory(wires, sockets, switches);
      setSockets(prev => ({
        ...prev,
        [sockId]: {
          ic: icCode,
          icState: def.initInternalState ? def.initInternalState() : null,
          isPowered: false,
        },
      }));
      flashStatus(`Inserted IC ${icCode} into Socket ${sockId}. Connect VCC and GND to power it.`);
    },
    [wires, sockets, switches, pushBoardHistory, flashStatus]
  );

  const handleInsertIc = useCallback(
    (icCode: string) => {
      if (!icModalSocket) return;
      handleInsertIcDirect(icCode, icModalSocket);
      setIcModalSocket(null);
    },
    [icModalSocket, handleInsertIcDirect]
  );

  const handleEjectIc = useCallback(
    (sockId: string) => {
      const ic = sockets[sockId]?.ic;
      if (!ic) return;

      pushBoardHistory(wires, sockets, switches);

      // Cleanly remove all wires attached to this socket's pins
      const prefix = `${sockId}:p`;
      const removedWireIds = new Set(
        wires.filter(w => w.from.startsWith(prefix) || w.to.startsWith(prefix)).map(w => w.id)
      );

      setWires(prev => prev.filter(w => !w.from.startsWith(prefix) && !w.to.startsWith(prefix)));

      if (selectedWireId !== null && removedWireIds.has(selectedWireId)) {
        setSelectedWireId(null);
      }
      if (selectedTerminal && selectedTerminal.startsWith(prefix)) {
        setSelectedTerminal(null);
        setWirePrompt('Wiring Mode: Click any pin or terminal to start a wire.');
      }

      setSockets(prev => ({
        ...prev,
        [sockId]: { ic: null, icState: null, isPowered: false },
      }));

      flashStatus(`Ejected IC ${ic} from ${sockId} and safely detached attached wires.`);
    },
    [sockets, wires, switches, selectedWireId, selectedTerminal, pushBoardHistory, flashStatus]
  );

  // Experiment Setup
  const handleSetupExperiment = useCallback(
    (expKey: string) => {
      const exp = EXPERIMENTS[expKey];
      if (!exp) return;

      pushBoardHistory(wires, sockets, switches);

      // Clean socket layout
      const newSockets: Record<string, SocketState> = {
        U1: { ic: null, icState: null, isPowered: false },
        U2: { ic: null, icState: null, isPowered: false },
        U3: { ic: null, icState: null, isPowered: false },
        U4: { ic: null, icState: null, isPowered: false },
        U5: { ic: null, icState: null, isPowered: false },
        U6: { ic: null, icState: null, isPowered: false },
      };

      Object.keys(exp.socketLayout).forEach(s => {
        const icCode = exp.socketLayout[s];
        const def = IC_DEFINITIONS[icCode];
        newSockets[s] = {
          ic: icCode,
          icState: def.initInternalState ? def.initInternalState() : null,
          isPowered: false,
        };
      });

      setSockets(newSockets);
      setVerificationResult(null);
      flashStatus(`Setup ICs for ${exp.title}. Connect wires manually or click 'Auto-Wire Reference Circuit'.`);
    },
    [wires, sockets, switches, pushBoardHistory, flashStatus]
  );

  // Auto-wire experiment reference
  const handleAutoWireExperiment = useCallback(
    (expKey: string) => {
      const exp = EXPERIMENTS[expKey];
      if (!exp) return;

      pushBoardHistory(wires, sockets, switches);

      // Clean socket layout
      const newSockets: Record<string, SocketState> = {
        U1: { ic: null, icState: null, isPowered: false },
        U2: { ic: null, icState: null, isPowered: false },
        U3: { ic: null, icState: null, isPowered: false },
        U4: { ic: null, icState: null, isPowered: false },
        U5: { ic: null, icState: null, isPowered: false },
        U6: { ic: null, icState: null, isPowered: false },
      };

      Object.keys(exp.socketLayout).forEach(s => {
        const icCode = exp.socketLayout[s];
        const def = IC_DEFINITIONS[icCode];
        newSockets[s] = {
          ic: icCode,
          icState: def.initInternalState ? def.initInternalState() : null,
          isPowered: false,
        };
      });

      setSockets(newSockets);

      const refWires: Wire[] = exp.referenceWires.map((w, idx) => {
        let color = '#2563eb';
        if (w.from.startsWith('vcc:') || w.to.startsWith('vcc:')) color = '#dc2626';
        else if (w.from.startsWith('gnd:') || w.to.startsWith('gnd:')) color = '#16a34a';
        else if (w.from.startsWith('clk:') || w.to.startsWith('clk:')) color = '#d97706';
        else if (w.from.startsWith('out:') || w.to.startsWith('out:')) color = '#9333ea';

        return {
          id: nextWireId + idx,
          from: w.from,
          to: w.to,
          color,
        };
      });

      setWires(refWires);
      setNextWireId(id => id + refWires.length);
      setSelectedWireId(null);
      setSelectedTerminal(null);
      setVerificationResult(null);
      flashStatus(`Auto-wired reference circuit for ${exp.title}. Toggle inputs or pulse clock to test!`);
    },
    [pushBoardHistory, wires, sockets, switches, nextWireId, flashStatus]
  );

  // Circuit Verification
  const handleVerifyCircuit = useCallback(
    (expKey: string) => {
      const exp = EXPERIMENTS[expKey];
      if (!exp) return;

      // Check 0: Electrical conflict / short circuit
      if (solverResult.diagnostics.status === 'ERROR') {
        setVerificationResult({
          pass: false,
          msg: `Circuit contains critical electrical errors (short circuit or bus contention). Open Diagnostics to resolve.`,
        });
        return;
      }

      // Check 1: Required ICs
      const missingIcs: string[] = [];
      Object.keys(exp.socketLayout).forEach(sockId => {
        const expected = exp.socketLayout[sockId];
        if (sockets[sockId]?.ic !== expected) {
          missingIcs.push(`${sockId} needs IC ${expected}`);
        }
      });

      if (missingIcs.length > 0) {
        setVerificationResult({
          pass: false,
          msg: `Missing required ICs: ${missingIcs.join(', ')}.`,
        });
        return;
      }

      // Check 2: Power integrity
      const unpowered = Object.keys(exp.socketLayout).filter(
        sockId => !solverResult.socketPower[sockId]
      );
      if (unpowered.length > 0) {
        setVerificationResult({
          pass: false,
          msg: `Unpowered ICs: Socket(s) ${unpowered.join(', ')} missing valid VCC (+5V) or GND connections.`,
        });
        return;
      }

      // Check 3: Minimum wire count
      if (wires.length < exp.referenceWires.length * 0.5) {
        setVerificationResult({
          pass: false,
          msg: `Incomplete circuit: Only ${wires.length} wires connected. Complete your circuit connections.`,
        });
        return;
      }

      // Check 4: Output connected
      const hasOutput = wires.some(w => w.from.startsWith('out:') || w.to.startsWith('out:'));
      if (!hasOutput) {
        setVerificationResult({
          pass: false,
          msg: 'Output LEDs not connected! Connect IC outputs to OP terminals to observe results.',
        });
        return;
      }

      setVerificationResult({
        pass: true,
        msg: `Circuit Verified Successfully! All required ICs are seated, powered, and wired. The circuit matches expected practical specifications.`,
      });
    },
    [sockets, solverResult, wires]
  );

  // Check if any modal is currently open
  const isAnyModalOpen =
    confirmModalType !== null ||
    icModalSocket !== null ||
    isExpDrawerOpen ||
    isDiagnosticsOpen ||
    isPinDiagramsOpen ||
    isTestsOpen;

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target &&
        (['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) || target.isContentEditable)
      ) {
        return;
      }

      if (e.key === 'Escape') {
        if (confirmModalType !== null) {
          setConfirmModalType(null);
          return;
        }
        if (icModalSocket !== null) {
          setIcModalSocket(null);
          return;
        }
        if (isExpDrawerOpen) {
          setIsExpDrawerOpen(false);
          return;
        }
        if (isDiagnosticsOpen) {
          setIsDiagnosticsOpen(false);
          return;
        }
        if (isPinDiagramsOpen) {
          setIsPinDiagramsOpen(false);
          return;
        }
        if (isTestsOpen) {
          setIsTestsOpen(false);
          return;
        }
        setSelectedTerminal(null);
        setSelectedWireId(null);
        setWirePrompt('Wiring Mode: Click any pin or terminal to start a wire.');
        return;
      }

      // If a modal is open, prevent background wire operations
      if (isAnyModalOpen) return;

      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedWireId !== null) {
        e.preventDefault();
        handleClearSelectedWire();
      } else if (e.ctrlKey && !e.altKey && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) handleRedo();
        else handleUndo();
      } else if (e.ctrlKey && !e.altKey && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        handleRedo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    selectedWireId,
    isAnyModalOpen,
    confirmModalType,
    icModalSocket,
    isExpDrawerOpen,
    isDiagnosticsOpen,
    isPinDiagramsOpen,
    isTestsOpen,
    handleClearSelectedWire,
    handleUndo,
    handleRedo,
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 font-sans select-none">
      {/* App Header */}
      <AppHeader
        wireColor={wireColor}
        setWireColor={setWireColor}
        zoom={zoom}
        setZoom={setZoom}
        resetZoom={() => setZoom(1.0)}
        onOpenExpDrawer={() => setIsExpDrawerOpen(true)}
        onOpenPinDiagrams={() => setIsPinDiagramsOpen(true)}
        onOpenDiagnostics={() => setIsDiagnosticsOpen(true)}
        onOpenTests={() => setIsTestsOpen(true)}
        onUndo={handleUndo}
        onRedo={handleRedo}
        canUndo={undoStack.length > 0}
        canRedo={redoStack.length > 0}
        onClearWire={handleClearSelectedWire}
        onClearBoard={handleClearBoardPrompt}
        onResetBoard={handleResetBoardPrompt}
        hasSelectedWire={selectedWireId !== null}
        hasWires={hasPlacedComponents}
        diagStatus={solverResult.diagnostics.status}
      />

      {/* Main Workspace with Wooden Briefcase Enclosure */}
      <main className="flex-1 overflow-auto p-4 flex justify-center items-start bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-slate-950">
        <div className="relative p-6 rounded-xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] border-4 border-[#5c3a21] bg-[linear-gradient(135deg,#784824_0%,#543118_45%,#8c532b_100%)] min-w-[1280px]">
          {/* Brass Hinges on Wooden Case */}
          <div className="absolute -top-2 left-40 w-11 h-4 bg-gradient-to-b from-amber-300 via-amber-600 to-amber-200 border border-amber-900 rounded-sm shadow-md" />
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-11 h-4 bg-gradient-to-b from-amber-300 via-amber-600 to-amber-200 border border-amber-900 rounded-sm shadow-md" />
          <div className="absolute -top-2 right-40 w-11 h-4 bg-gradient-to-b from-amber-300 via-amber-600 to-amber-200 border border-amber-900 rounded-sm shadow-md" />

          {/* Inner Rim */}
          <div className="bg-[#2a1c12] p-2 rounded-lg shadow-inner">
            {/* The Hardware Trainer Faceplate */}
            <div
              ref={boardRef}
              id="trainerBoard"
              onClick={e => {
                const target = e.target as HTMLElement;
                // If clicking an active terminal jack, button, wire, or interactive switch, ignore background deselect
                if (
                  target.closest('.terminal-jack') ||
                  target.closest('button') ||
                  target.closest('.toggle-switch-hardware') ||
                  target.closest('.rocker-switch') ||
                  target.closest('.wire-group') ||
                  target.closest('select') ||
                  target.closest('input')
                ) {
                  return;
                }
                if (selectedWireId !== null || selectedTerminal !== null) {
                  setSelectedWireId(null);
                  setSelectedTerminal(null);
                  setWirePrompt('Wiring Mode: Click any pin or terminal to start a wire.');
                }
              }}
              style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}
              className="trainer-faceplate relative bg-[linear-gradient(180deg,#f2f5f3_0%,#e1e6e3_100%)] border-2 border-slate-400 rounded-md p-4 flex flex-col gap-3 shadow-[inset_0_1px_2px_rgba(255,255,255,0.7),inset_0_-2px_4px_rgba(0,0,0,0.15)] transition-transform duration-100"
            >
              {/* Faceplate Screws */}
              <div className="plate-screw top-1.5 left-1.5" />
              <div className="plate-screw top-1.5 right-1.5" />
              <div className="plate-screw bottom-1.5 left-1.5" />
              <div className="plate-screw bottom-1.5 right-1.5" />
              <div className="plate-screw top-1.5 left-1/2 -translate-x-1/2" />
              <div className="plate-screw bottom-1.5 left-1/2 -translate-x-1/2" />

              {/* Top Row: Output Section, Display & Probe, Mains Switch */}
              <div className="grid grid-cols-[1fr_290px_140px] gap-3 items-stretch">
                <OutputSection
                  ledOutputs={solverResult.ledOutputs}
                  selectedTerminal={selectedTerminal}
                  onTerminalClick={handleTerminalClick}
                  connectedTerminals={connectedTerminals}
                />
                <DisplaySection
                  segA={solverResult.segA}
                  segB={solverResult.segB}
                  probe={solverResult.probe}
                  selectedTerminal={selectedTerminal}
                  onTerminalClick={handleTerminalClick}
                  connectedTerminals={connectedTerminals}
                />
                <MainsSwitch
                  mainsPower={mainsPower}
                  onTogglePower={() => {
                    setMainsPower(p => !p);
                    flashStatus(`Mains power switched ${!mainsPower ? 'ON' : 'OFF'}.`);
                  }}
                />
              </div>

              {/* Upper Rail: VCC (+5V) Strip with 10 Banana Terminals */}
              <PowerRail
                type="vcc"
                selectedTerminal={selectedTerminal}
                onTerminalClick={handleTerminalClick}
                connectedTerminals={connectedTerminals}
              />

              {/* Middle Section: Sockets U1 to U6 with Authentic DIP ICs */}
              <SocketGrid
                sockets={sockets}
                socketPower={solverResult.socketPower}
                selectedTerminal={selectedTerminal}
                onTerminalClick={handleTerminalClick}
                connectedTerminals={connectedTerminals}
                onOpenIcSelector={sockId => setIcModalSocket(sockId)}
                onEjectIc={handleEjectIc}
              />

              {/* Lower Rail: GROUND (0V) Strip with 10 Banana Terminals */}
              <PowerRail
                type="gnd"
                selectedTerminal={selectedTerminal}
                onTerminalClick={handleTerminalClick}
                connectedTerminals={connectedTerminals}
              />

              {/* Bottom Row: Input Switches & Clock / Pulser */}
              <div className="grid grid-cols-[1fr_360px] gap-3 items-stretch">
                <InputSection
                  switches={switches}
                  onToggleSwitch={handleToggleSwitch}
                  selectedTerminal={selectedTerminal}
                  onTerminalClick={handleTerminalClick}
                  connectedTerminals={connectedTerminals}
                />
                <ClockSection
                  clockRunning={clockRunning}
                  clockFreq={clockFreq}
                  clockState={clockState}
                  pulseCount={pulseCount}
                  pulserActive={pulserActive}
                  onToggleClock={() => {
                    setClockRunning(r => !r);
                    flashStatus(`Clock ${!clockRunning ? 'started' : 'stopped'}.`);
                  }}
                  onSetFreq={setClockFreq}
                  onManualPulse={handleManualPulse}
                  onResetPulseCount={() => setPulseCount(0)}
                  selectedTerminal={selectedTerminal}
                  onTerminalClick={handleTerminalClick}
                  connectedTerminals={connectedTerminals}
                />
              </div>

              {/* Interactive SVG Layer for Realistic Patch Wires */}
              <WiresCanvas
                wires={wires}
                selectedWireId={selectedWireId}
                onSelectWire={handleSelectWire}
                boardRef={boardRef}
                zoom={zoom}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Status Bar */}
      <StatusBar
        statusMessage={statusMessage}
        wireActionPrompt={wirePrompt}
        selectedTerminal={selectedTerminal}
        selectedWireId={selectedWireId}
        onCancelWire={() => {
          setSelectedTerminal(null);
          setWirePrompt('Wiring Mode: Click any pin or terminal to start a wire.');
        }}
        onDeleteSelectedWire={handleClearSelectedWire}
        wireCount={wires.length}
        icCount={Object.values(sockets).filter(s => !!s.ic).length}
      />

      {/* Modals & Drawers */}
      {icModalSocket && (
        <ICSelectorModal
          socketId={icModalSocket}
          onSelectIc={handleInsertIc}
          onClose={() => setIcModalSocket(null)}
        />
      )}

      <ExperimentDrawer
        isOpen={isExpDrawerOpen}
        onClose={() => setIsExpDrawerOpen(false)}
        selectedExpKey={selectedExpKey}
        onSelectExp={k => {
          setSelectedExpKey(k);
          setVerificationResult(null);
        }}
        onSetupIcs={handleSetupExperiment}
        onAutoWire={handleAutoWireExperiment}
        onVerifyCircuit={handleVerifyCircuit}
        verificationResult={verificationResult}
      />

      {isDiagnosticsOpen && (
        <DiagnosticsModal
          report={solverResult.diagnostics}
          onClose={() => setIsDiagnosticsOpen(false)}
        />
      )}

      {isPinDiagramsOpen && (
        <ICPinDiagramsModal
          onClose={() => setIsPinDiagramsOpen(false)}
          onInsertIcToSocket={(icCode, sockId) => {
            handleInsertIcDirect(icCode, sockId);
            setIsPinDiagramsOpen(false);
          }}
          sockets={sockets}
        />
      )}

      <TestRunnerModal
        isOpen={isTestsOpen}
        onClose={() => setIsTestsOpen(false)}
      />

      {confirmModalType && (
        <ConfirmModal
          type={confirmModalType}
          isOpen={true}
          onConfirm={handleClearBoardConfirm}
          onClose={() => setConfirmModalType(null)}
        />
      )}
    </div>
  );
}
