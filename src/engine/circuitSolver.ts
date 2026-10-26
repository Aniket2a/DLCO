import { LogicLevel, Wire, SocketState, DiagnosticsReport } from '../types';
import { IC_DEFINITIONS } from './icLibrary';

export interface SolverResult {
  pinValues: Record<string, LogicLevel>;
  nets: Record<string, string>;
  netValues: Record<string, LogicLevel>;
  netDrivers: Record<string, Array<{ tid: string; val: 0 | 1; desc: string }>>;
  socketPower: Record<string, boolean>;
  ledOutputs: Record<number, LogicLevel>;
  segA: string;
  segB: string;
  probe: LogicLevel;
  diagnostics: DiagnosticsReport;
}

export function solveCircuit(
  wires: Wire[],
  sockets: Record<string, SocketState>,
  switches: Record<number, 0 | 1>,
  clockState: { state: 0 | 1 },
  pulserState: { state: 0 | 1 },
  mainsPower: boolean
): SolverResult {
  // Step 1: Initialize Disjoint-Set (Union-Find)
  const parent: Record<string, string> = {};

  function find(x: string): string {
    if (parent[x] === undefined) parent[x] = x;
    if (parent[x] !== x) parent[x] = find(parent[x]);
    return parent[x];
  }

  function union(a: string, b: string) {
    const rootA = find(a);
    const rootB = find(b);
    if (rootA !== rootB) parent[rootB] = rootA;
  }

  // Union all connected wire terminals
  wires.forEach(w => {
    union(w.from, w.to);
  });

  const socketPower: Record<string, boolean> = {};

  if (!mainsPower) {
    Object.keys(sockets).forEach(s => {
      socketPower[s] = false;
    });
    return {
      pinValues: {},
      nets: parent,
      netValues: {},
      netDrivers: {},
      socketPower,
      ledOutputs: {},
      segA: '—',
      segB: '—',
      probe: 'Z',
      diagnostics: {
        power: [{ type: 'warn', msg: 'Trainer Mains Power is OFF. Toggle power switch ON.' }],
        signal: [],
        nets: [],
        status: 'CHECK',
        summary: 'Trainer power is OFF. Switch on mains power to operate.',
      },
    };
  }

  // Step 2: Validate IC Power Connections
  Object.keys(sockets).forEach(sockId => {
    const sock = sockets[sockId];
    if (!sock || !sock.ic) {
      socketPower[sockId] = false;
      return;
    }
    const icDef = IC_DEFINITIONS[sock.ic];
    if (!icDef) {
      socketPower[sockId] = false;
      return;
    }

    const vccTid = `${sockId}:p${icDef.vccPin}`;
    const gndTid = `${sockId}:p${icDef.gndPin}`;

    const vccNet = find(vccTid);
    const gndNet = find(gndTid);

    // Direct check: is vccNet tied to any board vcc terminal?
    const hasVcc = Object.keys(parent).some(
      tid => tid.startsWith('vcc:') && find(tid) === vccNet
    );
    // Direct check: is gndNet tied to any board gnd terminal?
    const hasGnd = Object.keys(parent).some(
      tid => tid.startsWith('gnd:') && find(tid) === gndNet
    );

    // Also verify VCC and GND are not shorted together
    const isShorted = hasVcc && hasGnd && vccNet === gndNet;
    socketPower[sockId] = hasVcc && hasGnd && !isShorted;
  });

  // Step 3: Register primary drivers by terminal ID
  const driversByTid: Record<string, { val: 0 | 1; desc: string }> = {};

  function setDriver(tid: string, val: 0 | 1, desc: string) {
    driversByTid[tid] = { val, desc };
  }

  function removeDriver(tid: string) {
    delete driversByTid[tid];
  }

  // Power rails (10 VCC terminals, 10 GND terminals)
  for (let i = 1; i <= 10; i++) {
    setDriver(`vcc:${i}`, 1, `VCC (+5V Rail #${i})`);
    setDriver(`gnd:${i}`, 0, `GND (0V Ground Rail #${i})`);
  }

  // Input switches (S1 to S16)
  for (let i = 1; i <= 16; i++) {
    const swVal = switches[i] !== undefined ? switches[i] : 0;
    setDriver(`in:${i}`, swVal, `Switch S${i}`);
  }

  // Clock terminals
  setDriver('clk:main', clockState.state, 'Clock Main (CLK)');
  setDriver('clk:bar', clockState.state === 1 ? 0 : 1, 'Clock Bar (CLK̅)');
  setDriver('clk:pulse', pulserState.state, 'Manual Pulser Output');

  function getNetDrivers() {
    const netDrivers: Record<string, Array<{ tid: string; val: 0 | 1; desc: string }>> = {};
    Object.keys(driversByTid).forEach(tid => {
      const net = find(tid);
      if (!netDrivers[net]) netDrivers[net] = [];
      netDrivers[net].push({ tid, val: driversByTid[tid].val, desc: driversByTid[tid].desc });
    });
    return netDrivers;
  }

  // Step 4: Multi-pass topological propagation
  const pinValues: Record<string, LogicLevel> = {};
  let changed = true;
  let iteration = 0;
  const maxIterations = 30;

  while (changed && iteration++ < maxIterations) {
    changed = false;

    // Resolve current net levels from drivers
    const netDrivers = getNetDrivers();
    const netValues: Record<string, LogicLevel> = {};
    Object.keys(netDrivers).forEach(net => {
      const drivers = netDrivers[net];
      const has1 = drivers.some(d => d.val === 1);
      const has0 = drivers.some(d => d.val === 0);

      if (has1 && has0) {
        netValues[net] = 'CONFLICT';
      } else if (has1) {
        netValues[net] = 1;
      } else if (has0) {
        netValues[net] = 0;
      } else {
        netValues[net] = 'Z';
      }
    });

    function readTerminal(tid: string): LogicLevel {
      const net = find(tid);
      return netValues[net] !== undefined ? netValues[net] : 'Z';
    }

    // Evaluate each socket
    Object.keys(sockets).forEach(sockId => {
      const sock = sockets[sockId];
      if (!sock || !sock.ic) return;
      const icDef = IC_DEFINITIONS[sock.ic];
      if (!icDef) return;

      const isPowered = socketPower[sockId];

      if (!isPowered) {
        // Unpowered IC: outputs are High-Z
        Object.keys(icDef.pinout).forEach(pStr => {
          const p = Number(pStr);
          if (icDef.pinout[p]?.type === 'out') {
            const outTid = `${sockId}:p${p}`;
            if (pinValues[outTid] !== 'Z') {
              pinValues[outTid] = 'Z';
              changed = true;
            }
            removeDriver(outTid);
          }
        });
        return;
      }

      // Combinational logic gates (7400, 7404, 7408, 7432, 7486)
      if (icDef.gates) {
        icDef.gates.forEach(g => {
          const inVals = g.inputs.map(p => {
            const v = readTerminal(`${sockId}:p${p}`);
            return v === 'CONFLICT' ? 'Z' : v;
          });
          const outVal = g.fn(...inVals);
          const outTid = `${sockId}:p${g.output}`;
          const prevVal = pinValues[outTid];

          if (prevVal !== outVal) {
            pinValues[outTid] = outVal;
            changed = true;
          }
          if (outVal === 0 || outVal === 1) {
            setDriver(outTid, outVal, `${sockId} Output Pin ${g.output} (${icDef.pinout[g.output]?.name})`);
          } else {
            removeDriver(outTid);
          }
        });
      }

      // 7483 4-Bit Binary Full Adder
      else if (sock.ic === '7483' && icDef.evaluate) {
        const inputMap: Record<number, 0 | 1 | 'Z'> = {};
        for (let p = 1; p <= 16; p++) {
          const v = readTerminal(`${sockId}:p${p}`);
          inputMap[p] = v === 0 || v === 1 ? v : 'Z';
        }
        const outMap = icDef.evaluate(inputMap);
        [9, 6, 2, 15, 14].forEach(p => {
          const outTid = `${sockId}:p${p}`;
          const outVal = outMap[p];
          if (pinValues[outTid] !== outVal) {
            pinValues[outTid] = outVal;
            changed = true;
          }
          if (outVal === 0 || outVal === 1) {
            setDriver(outTid, outVal, `${sockId} Output Pin ${p} (${icDef.pinout[p]?.name})`);
          } else {
            removeDriver(outTid);
          }
        });
      }

      // 74153 Dual 4:1 Multiplexer
      else if (sock.ic === '74153' && icDef.evaluate) {
        const inputMap: Record<number, 0 | 1 | 'Z'> = {};
        for (let p = 1; p <= 16; p++) {
          const v = readTerminal(`${sockId}:p${p}`);
          inputMap[p] = v === 0 || v === 1 ? v : 'Z';
        }
        const outMap = icDef.evaluate(inputMap);
        [7, 9].forEach(p => {
          const outTid = `${sockId}:p${p}`;
          const outVal = outMap[p];
          if (pinValues[outTid] !== outVal) {
            pinValues[outTid] = outVal;
            changed = true;
          }
          if (outVal === 0 || outVal === 1) {
            setDriver(outTid, outVal, `${sockId} Output Pin ${p} (${icDef.pinout[p]?.name})`);
          } else {
            removeDriver(outTid);
          }
        });
      }

      // 74151 8:1 Multiplexer
      else if (sock.ic === '74151' && icDef.evaluate) {
        const inputMap: Record<number, 0 | 1 | 'Z'> = {};
        for (let p = 1; p <= 16; p++) {
          const v = readTerminal(`${sockId}:p${p}`);
          inputMap[p] = v === 0 || v === 1 ? v : 'Z';
        }
        const outMap = icDef.evaluate(inputMap);
        [5, 6].forEach(p => {
          const outTid = `${sockId}:p${p}`;
          const outVal = outMap[p];
          if (pinValues[outTid] !== outVal) {
            pinValues[outTid] = outVal;
            changed = true;
          }
          if (outVal === 0 || outVal === 1) {
            setDriver(outTid, outVal, `${sockId} Output Pin ${p} (${icDef.pinout[p]?.name})`);
          } else {
            removeDriver(outTid);
          }
        });
      }

      // 74138 3-to-8 Line Decoder
      else if (sock.ic === '74138' && icDef.evaluate) {
        const inputMap: Record<number, 0 | 1 | 'Z'> = {};
        for (let p = 1; p <= 16; p++) {
          const v = readTerminal(`${sockId}:p${p}`);
          inputMap[p] = v === 0 || v === 1 ? v : 'Z';
        }
        const outMap = icDef.evaluate(inputMap);
        [15, 14, 13, 12, 11, 10, 9, 7].forEach(p => {
          const outTid = `${sockId}:p${p}`;
          const outVal = outMap[p] !== undefined ? outMap[p] : 'Z';
          if (pinValues[outTid] !== outVal) {
            pinValues[outTid] = outVal;
            changed = true;
          }
          if (outVal === 0 || outVal === 1) {
            setDriver(outTid, outVal, `${sockId} Output Pin ${p} (${icDef.pinout[p]?.name})`);
          } else {
            removeDriver(outTid);
          }
        });
      }

      // 7476 Dual JK Flip-Flop
      else if (sock.ic === '7476' && icDef.evaluateSequential) {
        if (!sock.icState) sock.icState = icDef.initInternalState!();
        const inputMap: Record<number, 0 | 1 | 'Z'> = {};
        for (let p = 1; p <= 16; p++) {
          const v = readTerminal(`${sockId}:p${p}`);
          inputMap[p] = v === 0 || v === 1 ? v : 'Z';
        }
        const outMap = icDef.evaluateSequential(sock.icState, inputMap, false);
        [6, 7, 10, 9].forEach(p => {
          const outTid = `${sockId}:p${p}`;
          const outVal = outMap[p];
          if (pinValues[outTid] !== outVal) {
            pinValues[outTid] = outVal;
            changed = true;
          }
          if (outVal === 0 || outVal === 1) {
            setDriver(outTid, outVal, `${sockId} Output Pin ${p} (${icDef.pinout[p]?.name})`);
          } else {
            removeDriver(outTid);
          }
        });
      }

      // 7490 Decade Counter
      else if (sock.ic === '7490' && icDef.evaluateSequential) {
        if (!sock.icState) sock.icState = icDef.initInternalState!();
        const inputMap: Record<number, 0 | 1 | 'Z'> = {};
        for (let p = 1; p <= 14; p++) {
          const v = readTerminal(`${sockId}:p${p}`);
          inputMap[p] = v === 0 || v === 1 ? v : 'Z';
        }
        const outMap = icDef.evaluateSequential(sock.icState, inputMap, false);
        [12, 9, 8, 11].forEach(p => {
          const outTid = `${sockId}:p${p}`;
          const outVal = outMap[p];
          if (pinValues[outTid] !== outVal) {
            pinValues[outTid] = outVal;
            changed = true;
          }
          if (outVal === 0 || outVal === 1) {
            setDriver(outTid, outVal, `${sockId} Output Pin ${p} (${icDef.pinout[p]?.name})`);
          } else {
            removeDriver(outTid);
          }
        });
      }
    });
  }

  // Final Net Values
  const finalNetDrivers = getNetDrivers();
  const finalNetValues: Record<string, LogicLevel> = {};
  Object.keys(finalNetDrivers).forEach(net => {
    const drivers = finalNetDrivers[net];
    const has1 = drivers.some(d => d.val === 1);
    const has0 = drivers.some(d => d.val === 0);

    if (has1 && has0) {
      finalNetValues[net] = 'CONFLICT';
    } else if (has1) {
      finalNetValues[net] = 1;
    } else if (has0) {
      finalNetValues[net] = 0;
    } else {
      finalNetValues[net] = 'Z';
    }
  });

  function getTerminalNetValue(tid: string): LogicLevel {
    const net = find(tid);
    return finalNetValues[net] !== undefined ? finalNetValues[net] : 'Z';
  }

  // Output LEDs (L1 to L16)
  const ledOutputs: Record<number, LogicLevel> = {};
  for (let i = 1; i <= 16; i++) {
    ledOutputs[i] = getTerminalNetValue(`out:${i}`);
  }

  // 7-Segment Displays
  function decode7Seg(prefix: 'a' | 'b'): string {
    const b3 = getTerminalNetValue(`seg:${prefix}3`);
    const b2 = getTerminalNetValue(`seg:${prefix}2`);
    const b1 = getTerminalNetValue(`seg:${prefix}1`);
    const b0 = getTerminalNetValue(`seg:${prefix}0`);

    if (b3 !== 'Z' || b2 !== 'Z' || b1 !== 'Z' || b0 !== 'Z') {
      const v3 = b3 === 1 ? 1 : 0;
      const v2 = b2 === 1 ? 1 : 0;
      const v1 = b1 === 1 ? 1 : 0;
      const v0 = b0 === 1 ? 1 : 0;
      const num = (v3 << 3) | (v2 << 2) | (v1 << 1) | v0;
      return num.toString(16).toUpperCase();
    }
    return '—';
  }

  const segA = decode7Seg('a');
  const segB = decode7Seg('b');
  const probe = getTerminalNetValue('probe');

  // Diagnostics Generation
  const diagnostics = generateDiagnostics(sockets, socketPower, finalNetDrivers, wires, parent, finalNetValues);

  return {
    pinValues,
    nets: parent,
    netValues: finalNetValues,
    netDrivers: finalNetDrivers,
    socketPower,
    ledOutputs,
    segA,
    segB,
    probe,
    diagnostics,
  };
}

function generateDiagnostics(
  sockets: Record<string, SocketState>,
  socketPower: Record<string, boolean>,
  netDrivers: Record<string, Array<{ tid: string; val: 0 | 1; desc: string }>>,
  wires: Wire[],
  parent: Record<string, string>,
  netValues: Record<string, LogicLevel>
): DiagnosticsReport {
  const power: Array<{ type: 'ok' | 'warn' | 'err' | 'info'; msg: string }> = [];
  const signal: Array<{ type: 'ok' | 'warn' | 'err' | 'info'; msg: string }> = [];
  const nets: Array<{ type: 'ok' | 'warn' | 'err' | 'info'; msg: string }> = [];

  let hasErrors = false;
  let hasWarnings = false;

  let seatedCount = 0;

  function find(x: string): string {
    let curr = x;
    while (parent[curr] !== undefined && parent[curr] !== curr) {
      curr = parent[curr];
    }
    return curr;
  }

  function getVal(tid: string): LogicLevel {
    const net = find(tid);
    return netValues[net] !== undefined ? netValues[net] : 'Z';
  }

  Object.keys(sockets).forEach(sockId => {
    const sock = sockets[sockId];
    if (!sock || !sock.ic) return;
    seatedCount++;
    const icDef = IC_DEFINITIONS[sock.ic];
    if (!icDef) return;

    if (!socketPower[sockId]) {
      hasErrors = true;
      const msg = `IC ${sockId} (${sock.ic}) is UNPOWERED. Connect Pin ${icDef.vccPin} to VCC (+5V) and Pin ${icDef.gndPin} to GND.`;
      power.push({ type: 'err', msg });
    } else {
      power.push({ type: 'ok', msg: `IC ${sockId} (${sock.ic}) VCC (Pin ${icDef.vccPin}) & GND (Pin ${icDef.gndPin}) connected properly.` });
    }

    // Check for 7476 unstable state: PRE=0 and CLR=0 simultaneously
    if (sock.ic === '7476' && socketPower[sockId]) {
      const v1Pre = getVal(`${sockId}:p4`);
      const v1Clr = getVal(`${sockId}:p5`);
      const v2Pre = getVal(`${sockId}:p12`);
      const v2Clr = getVal(`${sockId}:p11`);

      if (v1Pre === 0 && v1Clr === 0) {
        hasWarnings = true;
        signal.push({
          type: 'warn',
          msg: `IC ${sockId} (7476 FF1): Unstable / invalid condition! Both 1PRE̅ (Pin 4) and 1CLR̅ (Pin 5) are active-LOW (0) simultaneously. Both 1Q and 1Q̅ are forced HIGH.`,
        });
      }
      if (v2Pre === 0 && v2Clr === 0) {
        hasWarnings = true;
        signal.push({
          type: 'warn',
          msg: `IC ${sockId} (7476 FF2): Unstable / invalid condition! Both 2PRE̅ (Pin 12) and 2CLR̅ (Pin 11) are active-LOW (0) simultaneously. Both 2Q and 2Q̅ are forced HIGH.`,
        });
      }
    }

    // Check for floating inputs on powered ICs
    if (socketPower[sockId]) {
      Object.keys(icDef.pinout).forEach(pStr => {
        const p = Number(pStr);
        const pinInfo = icDef.pinout[p];
        if (pinInfo.type === 'in' || pinInfo.type === 'clk') {
          const tid = `${sockId}:p${p}`;
          const isWired = wires.some(w => w.from === tid || w.to === tid);
          if (!isWired) {
            hasWarnings = true;
            signal.push({ type: 'warn', msg: `${sockId} Pin ${p} (${pinInfo.name}) is FLOATING (unconnected).` });
          }
        }
      });
    }
  });

  if (seatedCount === 0) {
    power.push({ type: 'info', msg: 'No ICs seated in trainer sockets.' });
  }

  // Check for bus conflicts / short circuits
  Object.keys(netDrivers).forEach(net => {
    const drivers = netDrivers[net];
    const has1 = drivers.some(d => d.val === 1);
    const has0 = drivers.some(d => d.val === 0);
    if (has1 && has0) {
      hasErrors = true;
      const driverNames = drivers.map(d => d.desc).join(', ');
      signal.push({ type: 'err', msg: `BUS CONTENTION / SHORT CIRCUIT on net! Opposing signals driven by: ${driverNames}` });
    }
  });

  if (signal.length === 0) {
    signal.push({ type: 'ok', msg: 'No signal conflicts or floating inputs detected.' });
  }

  // Populate active nets list
  const netGroups: Record<string, Set<string>> = {};
  wires.forEach(w => {
    function find(x: string): string {
      let curr = x;
      while (parent[curr] !== undefined && parent[curr] !== curr) {
        curr = parent[curr];
      }
      return curr;
    }
    const netId = find(w.from);
    if (!netGroups[netId]) netGroups[netId] = new Set();
    netGroups[netId].add(w.from);
    netGroups[netId].add(w.to);
  });

  const netKeys = Object.keys(netGroups);
  if (netKeys.length === 0) {
    nets.push({ type: 'info', msg: 'No patch wires connected on board.' });
  } else {
    netKeys.forEach((k, idx) => {
      const terms = Array.from(netGroups[k]).join(' ⟷ ');
      nets.push({ type: 'info', msg: `Net #${idx + 1}: ${terms}` });
    });
  }

  let status: 'HEALTHY' | 'CHECK' | 'ERROR' = 'HEALTHY';
  let summary = 'All circuits, power rails, and connected nets are operating normally.';

  if (hasErrors) {
    status = 'ERROR';
    summary = 'Critical Electrical Warnings: Resolve unpowered ICs or short circuits.';
  } else if (hasWarnings) {
    status = 'CHECK';
    summary = 'Circuit Advisory: Some IC inputs are floating or unconnected.';
  }

  return {
    power,
    signal,
    nets,
    status,
    summary,
  };
}
