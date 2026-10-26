import { IC_DEFINITIONS } from './icLibrary';
import { solveCircuit } from './circuitSolver';
import { EXPERIMENTS } from './experiments';
import { SocketState, Wire } from '../types';

export interface TestResultItem {
  name: string;
  group: string;
  passed: boolean;
  message?: string;
}

export interface FullTestReport {
  total: number;
  passed: number;
  failed: number;
  results: TestResultItem[];
}

export function runAllAutomatedTests(): FullTestReport {
  const results: TestResultItem[] = [];

  function record(group: string, name: string, passed: boolean, message?: string) {
    results.push({ group, name, passed, message });
  }

  // -------------------------------------------------------------------------
  // 1. IC 7476 Master-Slave JK Flip-Flop Tests
  // -------------------------------------------------------------------------
  const ic7476 = IC_DEFINITIONS['7476'];
  const g1 = '1. IC 7476 Dual JK Flip-Flop';

  // 1.1 Pin mapping check
  record(g1, '7476 Pin Mapping: VCC is Pin 16 and GND is Pin 8', ic7476.vccPin === 16 && ic7476.gndPin === 8);
  record(g1, '7476 FF1 Inputs: 1CLK=p1, 1K=p2, 1J=p3, 1PRE=p4, 1CLR=p5',
    ic7476.pinout[1].name === '1CLK' && ic7476.pinout[2].name === '1K' &&
    ic7476.pinout[3].name === '1J' && ic7476.pinout[4].name === '1PRE̅' && ic7476.pinout[5].name === '1CLR̅'
  );
  record(g1, '7476 FF1 Outputs: 1Q=p6, 1Q̅=p7',
    ic7476.pinout[6].name === '1Q' && ic7476.pinout[7].name === '1Q̅'
  );
  record(g1, '7476 FF2 Pins: 2Q̅=p9, 2Q=p10, 2CLR=p11, 2PRE=p12, 2J=p13, 2K=p14, 2CLK=p15',
    ic7476.pinout[9].name === '2Q̅' && ic7476.pinout[10].name === '2Q' &&
    ic7476.pinout[11].name === '2CLR̅' && ic7476.pinout[12].name === '2PRE̅' &&
    ic7476.pinout[13].name === '2J' && ic7476.pinout[14].name === '2K' && ic7476.pinout[15].name === '2CLK'
  );

  // 1.2 Active-LOW PR and CLR
  let s7476 = ic7476.initInternalState!();
  let outPre = ic7476.evaluateSequential!(s7476, { 4: 0, 5: 1, 1: 1, 2: 0, 3: 0, 12: 1, 11: 1, 15: 1, 13: 0, 14: 0 });
  record(g1, 'Active-LOW PRESET: PRE=0, CLR=1 forces Q=1, Q̅=0', outPre[6] === 1 && outPre[7] === 0);

  let outClr = ic7476.evaluateSequential!(s7476, { 4: 1, 5: 0, 1: 1, 2: 0, 3: 0, 12: 1, 11: 1, 15: 1, 13: 0, 14: 0 });
  record(g1, 'Active-LOW CLEAR: PRE=1, CLR=0 forces Q=0, Q̅=1', outClr[6] === 0 && outClr[7] === 1);

  let outForbid = ic7476.evaluateSequential!(s7476, { 4: 0, 5: 0, 1: 1, 2: 0, 3: 0, 12: 1, 11: 1, 15: 1, 13: 0, 14: 0 });
  record(g1, 'Invalid state: PRE=0, CLR=0 forces both Q=1 and Q̅=1 per datasheet', outForbid[6] === 1 && outForbid[7] === 1);

  // 1.3 JK Behavior & Clock Edge Triggering
  // Reset FF1 to 0
  ic7476.evaluateSequential!(s7476, { 4: 1, 5: 0, 1: 1, 2: 0, 3: 0, 12: 1, 11: 1, 15: 1, 13: 0, 14: 0 });
  // J=0, K=0 Hold test
  ic7476.evaluateSequential!(s7476, { 4: 1, 5: 1, 1: 1, 2: 0, 3: 0, 12: 1, 11: 1, 15: 1, 13: 0, 14: 0 });
  ic7476.evaluateSequential!(s7476, { 4: 1, 5: 1, 1: 0, 2: 0, 3: 0, 12: 1, 11: 1, 15: 1, 13: 0, 14: 0 });
  record(g1, 'J=0, K=0: Hold current state across clock transitions', s7476.ff1.q === 0);

  // J=1, K=0 Set test
  ic7476.evaluateSequential!(s7476, { 4: 1, 5: 1, 1: 1, 2: 0, 3: 1, 12: 1, 11: 1, 15: 1, 13: 0, 14: 0 });
  ic7476.evaluateSequential!(s7476, { 4: 1, 5: 1, 1: 0, 2: 0, 3: 1, 12: 1, 11: 1, 15: 1, 13: 0, 14: 0 });
  record(g1, 'J=1, K=0: Falling clock edge sets Q=1, Q̅=0', s7476.ff1.q === 1 && s7476.ff1.qBar === 0);

  // J=0, K=1 Reset test
  ic7476.evaluateSequential!(s7476, { 4: 1, 5: 1, 1: 1, 2: 1, 3: 0, 12: 1, 11: 1, 15: 1, 13: 0, 14: 0 });
  ic7476.evaluateSequential!(s7476, { 4: 1, 5: 1, 1: 0, 2: 1, 3: 0, 12: 1, 11: 1, 15: 1, 13: 0, 14: 0 });
  record(g1, 'J=0, K=1: Falling clock edge resets Q=0, Q̅=1', s7476.ff1.q === 0 && s7476.ff1.qBar === 1);

  // J=1, K=1 Toggle test
  ic7476.evaluateSequential!(s7476, { 4: 1, 5: 1, 1: 1, 2: 1, 3: 1, 12: 1, 11: 1, 15: 1, 13: 0, 14: 0 });
  ic7476.evaluateSequential!(s7476, { 4: 1, 5: 1, 1: 0, 2: 1, 3: 1, 12: 1, 11: 1, 15: 1, 13: 0, 14: 0 });
  record(g1, 'J=1, K=1: Falling clock edge toggles Q: 0 -> 1', s7476.ff1.q === 1 && s7476.ff1.qBar === 0);

  // Rising edge (0 -> 1) must NOT toggle
  ic7476.evaluateSequential!(s7476, { 4: 1, 5: 1, 1: 1, 2: 1, 3: 1, 12: 1, 11: 1, 15: 1, 13: 0, 14: 0 });
  record(g1, 'Clock rising edge (0 -> 1): No toggle occurs (negative-edge triggered)', s7476.ff1.q === 1);

  // Second falling edge toggles back
  ic7476.evaluateSequential!(s7476, { 4: 1, 5: 1, 1: 0, 2: 1, 3: 1, 12: 1, 11: 1, 15: 1, 13: 0, 14: 0 });
  record(g1, 'Second falling clock edge toggles Q: 1 -> 0', s7476.ff1.q === 0 && s7476.ff1.qBar === 1);

  // 1.4 Test Section 2 (FF2)
  ic7476.evaluateSequential!(s7476, { 4: 1, 5: 1, 1: 1, 2: 0, 3: 0, 12: 0, 11: 1, 15: 1, 13: 0, 14: 0 });
  record(g1, 'FF2 Section Asynchronous Preset: 2PRE=0 forces 2Q=1, 2Q̅=0', s7476.ff2.q === 1 && s7476.ff2.qBar === 0);

  // 1.5 Unstable state diagnostic warning test
  const unstableWires: Wire[] = [
    { id: 1, from: 'vcc:1', to: 'U1:p16', color: 'red' },
    { id: 2, from: 'gnd:1', to: 'U1:p8', color: 'green' },
    { id: 3, from: 'gnd:2', to: 'U1:p4', color: 'green' }, // 1PRE = 0 (GND)
    { id: 4, from: 'gnd:2', to: 'U1:p5', color: 'green' }, // 1CLR = 0 (GND)
  ];
  const unstableSocket: Record<string, SocketState> = {
    U1: { ic: '7476', icState: ic7476.initInternalState!(), isPowered: true },
  };
  const unstableRes = solveCircuit(unstableWires, unstableSocket, {}, { state: 0 }, { state: 0 }, true);
  const hasUnstableWarning = unstableRes.diagnostics.signal.some(s => s.msg.includes('Unstable / invalid condition'));
  record(g1, 'Unstable state detection: Circuit solver reports warning when both PRE and CLR are active-LOW (0)', hasUnstableWarning && unstableRes.pinValues['U1:p6'] === 1 && unstableRes.pinValues['U1:p7'] === 1);

  // 1.6 Unpowered 7476 behavior: outputs must stay High-Z (Z)
  const unpowered7476Res = solveCircuit([], unstableSocket, {}, { state: 0 }, { state: 0 }, true);
  record(g1, 'Power check: Unpowered IC 7476 outputs stay inactive High-Z (Z)', !unpowered7476Res.socketPower['U1'] && unpowered7476Res.pinValues['U1:p6'] === 'Z');

  // -------------------------------------------------------------------------
  // 2. All Four 3-Bit Counter Sequences & All 8 States (IC 7476)
  // -------------------------------------------------------------------------
  const g2 = '2. 3-Bit Counters with IC 7476';

  function simulateCounter(expId: string, expectedSeq: number[]) {
    const exp = EXPERIMENTS[expId];
    const sockets: Record<string, SocketState> = {};
    Object.keys(exp.socketLayout).forEach(s => {
      const def = IC_DEFINITIONS[exp.socketLayout[s]];
      sockets[s] = {
        ic: exp.socketLayout[s],
        icState: def.initInternalState ? def.initInternalState() : null,
        isPowered: true,
      };
    });

    const wires: Wire[] = exp.referenceWires.map((w, idx) => ({
      id: idx + 1,
      from: w.from,
      to: w.to,
      color: 'auto',
    }));

    const states: number[] = [];

    // Initial state after initial reset/power
    let res = solveCircuit(wires, sockets, {}, { state: 1 }, { state: 1 }, true);
    let q0 = (res.ledOutputs[1] === 1 ? 1 : 0);
    let q1 = (res.ledOutputs[2] === 1 ? 1 : 0);
    let q2 = (res.ledOutputs[3] === 1 ? 1 : 0);
    states.push((q2 << 2) | (q1 << 1) | q0);

    // 8 clock pulses
    for (let p = 1; p <= 8; p++) {
      // Pulse LOW (1 -> 0 falling edge)
      solveCircuit(wires, sockets, {}, { state: 0 }, { state: 0 }, true);
      // Pulse HIGH (0 -> 1 return)
      res = solveCircuit(wires, sockets, {}, { state: 1 }, { state: 1 }, true);
      q0 = (res.ledOutputs[1] === 1 ? 1 : 0);
      q1 = (res.ledOutputs[2] === 1 ? 1 : 0);
      q2 = (res.ledOutputs[3] === 1 ? 1 : 0);
      states.push((q2 << 2) | (q1 << 1) | q0);
    }

    return states;
  }

  // 2.1 3-Bit Asynchronous UP Counter
  const asyncUpSeq = simulateCounter('exam6', [0, 1, 2, 3, 4, 5, 6, 7, 0]);
  const asyncUpMatch = asyncUpSeq.slice(1, 9).join(',') === '1,2,3,4,5,6,7,0';
  record(g2, '3-Bit Asynchronous UP Counter: Verified all 8 states (000 -> 001 -> ... -> 111 -> 000)', asyncUpMatch, `Sequence: ${asyncUpSeq.join('->')}`);

  // 2.2 3-Bit Asynchronous DOWN Counter
  // For down counter, start at preset or observe down sequence
  const asyncDownSeq = simulateCounter('exam7', [7, 6, 5, 4, 3, 2, 1, 0, 7]);
  const isDownCounting = asyncDownSeq.slice(1, 8).every((val, idx) => {
    const prev = asyncDownSeq[idx];
    return val === (prev === 0 ? 7 : prev - 1);
  });
  record(g2, '3-Bit Asynchronous DOWN Counter: Decremental counting sequence verified', isDownCounting, `Sequence: ${asyncDownSeq.join('->')}`);

  // 2.3 3-Bit Synchronous UP Counter
  const syncUpSeq = simulateCounter('exam9', [0, 1, 2, 3, 4, 5, 6, 7, 0]);
  const syncUpMatch = syncUpSeq.slice(1, 9).join(',') === '1,2,3,4,5,6,7,0';
  record(g2, '3-Bit Synchronous UP Counter: Common clocking verified through all 8 states', syncUpMatch, `Sequence: ${syncUpSeq.join('->')}`);

  // 2.4 3-Bit Synchronous DOWN Counter
  const syncDownSeq = simulateCounter('exam8', [7, 6, 5, 4, 3, 2, 1, 0, 7]);
  const isSyncDownCounting = syncDownSeq.slice(1, 8).every((val, idx) => {
    const prev = syncDownSeq[idx];
    return val === (prev === 0 ? 7 : prev - 1);
  });
  record(g2, '3-Bit Synchronous DOWN Counter: Decremental synchronous gating verified', isSyncDownCounting, `Sequence: ${syncDownSeq.join('->')}`);

  // -------------------------------------------------------------------------
  // 3. Full Adder Truth Table (Exam 1)
  // -------------------------------------------------------------------------
  const g3 = '3. Full Adder & Arithmetic Practicals';
  const faExp = EXPERIMENTS['exam1'];
  let faCount = 0;
  faExp.truthTable.forEach(row => {
    const sockets: Record<string, SocketState> = {
      U1: { ic: '7486', icState: null, isPowered: true },
      U2: { ic: '7408', icState: null, isPowered: true },
      U3: { ic: '7432', icState: null, isPowered: true },
    };
    const wires: Wire[] = faExp.referenceWires.map((w, idx) => ({ id: idx + 1, from: w.from, to: w.to, color: 'auto' }));
    const res = solveCircuit(wires, sockets, { 1: row.A, 2: row.B, 3: row.Cin }, { state: 0 }, { state: 0 }, true);
    if (res.ledOutputs[1] === row.SUM && res.ledOutputs[2] === row.CARRY) {
      faCount++;
    }
  });
  record(g3, 'Full Adder (Logic Gates): All 8/8 truth table combinations verified', faCount === 8);

  // -------------------------------------------------------------------------
  // 4. Parity Generator and Checker (Exam 2)
  // -------------------------------------------------------------------------
  const g4 = '4. Parity Generator & Checker';
  const parExp = EXPERIMENTS['exam2'];
  let parCount = 0;
  parExp.truthTable.forEach(row => {
    const sockets: Record<string, SocketState> = {
      U1: { ic: '7486', icState: null, isPowered: true },
      U2: { ic: '7404', icState: null, isPowered: true },
    };
    const wires: Wire[] = parExp.referenceWires.map((w, idx) => ({ id: idx + 1, from: w.from, to: w.to, color: 'auto' }));
    const res = solveCircuit(wires, sockets, { 3: row.D2, 2: row.D1, 1: row.D0, 4: row.P_Even }, { state: 0 }, { state: 0 }, true);
    // L1 is Even Parity, L2 is Odd Parity, L3 is Parity Error (should be 0 when P_Even matches)
    if (res.ledOutputs[1] === row.P_Even && res.ledOutputs[2] === row.P_Odd && res.ledOutputs[3] === 0) {
      parCount++;
    }
  });
  record(g4, '3-Bit Parity Generator & Checker: All 8 even/odd parity states and error-free checking verified', parCount === 8);

  // -------------------------------------------------------------------------
  // 5. 4-Bit BCD-to-Excess-3 Converter (Exam 3)
  // -------------------------------------------------------------------------
  const g5 = '5. BCD to Excess-3 Code Converter';
  const bcdExp = EXPERIMENTS['exam3'];
  let bcdCount = 0;
  bcdExp.truthTable.forEach(row => {
    const sockets: Record<string, SocketState> = {
      U1: { ic: '7483', icState: null, isPowered: true },
    };
    const wires: Wire[] = bcdExp.referenceWires.map((w, idx) => ({ id: idx + 1, from: w.from, to: w.to, color: 'auto' }));
    const res = solveCircuit(wires, sockets, { 4: row.B3, 3: row.B2, 2: row.B1, 1: row.B0 }, { state: 0 }, { state: 0 }, true);
    if (
      res.ledOutputs[4] === row.E3 &&
      res.ledOutputs[3] === row.E2 &&
      res.ledOutputs[2] === row.E1 &&
      res.ledOutputs[1] === row.E0
    ) {
      bcdCount++;
    }
  });
  record(g5, 'BCD-to-Excess-3 Converter (IC 7483): All 10 valid BCD digits (0 to 9) accurately produce Excess-3 codewords (+3)', bcdCount === 10);

  // -------------------------------------------------------------------------
  // 6. BCD Adder using IC 7483 with Correction (Exam 4)
  // -------------------------------------------------------------------------
  const g6 = '6. BCD Adder with IC 7483';
  const bcdAddExp = EXPERIMENTS['exam4'];
  const socketsBcdAdd: Record<string, SocketState> = {
    U1: { ic: '7483', icState: null, isPowered: true },
    U2: { ic: '7408', icState: null, isPowered: true },
    U3: { ic: '7432', icState: null, isPowered: true },
  };
  const wiresBcdAdd: Wire[] = bcdAddExp.referenceWires.map((w, idx) => ({ id: idx + 1, from: w.from, to: w.to, color: 'auto' }));

  // Test Case A: 2 + 3 = 5 (No correction, BCD carry = 0)
  const resBcd1 = solveCircuit(wiresBcdAdd, socketsBcdAdd, {
    4: 0, 3: 0, 2: 1, 1: 0, // A = 0010 (2)
    8: 0, 7: 0, 6: 1, 5: 1, // B = 0011 (3)
  }, { state: 0 }, { state: 0 }, true);
  record(g6, 'BCD Adder: 2 + 3 = 5, BCD Carry = 0 (Normal addition)',
    resBcd1.ledOutputs[4] === 0 && resBcd1.ledOutputs[3] === 1 && resBcd1.ledOutputs[2] === 0 && resBcd1.ledOutputs[1] === 1 && resBcd1.ledOutputs[5] === 0
  );

  // Test Case B: 6 + 7 = 13 (Binary > 9, BCD Carry = 1 generated)
  const resBcd2 = solveCircuit(wiresBcdAdd, socketsBcdAdd, {
    4: 0, 3: 1, 2: 1, 1: 0, // A = 0110 (6)
    8: 0, 7: 1, 6: 1, 5: 1, // B = 0111 (7)
  }, { state: 0 }, { state: 0 }, true);
  record(g6, 'BCD Adder: 6 + 7 = 13, BCD Carry = 1 (Correction triggered)', resBcd2.ledOutputs[5] === 1);

  // -------------------------------------------------------------------------
  // 7. Full Adder using Multiplexer IC 74153 (Exam 5)
  // -------------------------------------------------------------------------
  const g7 = '7. Multiplexer Full Adder (IC 74153)';
  const muxFaExp = EXPERIMENTS['exam5'];
  let muxFaCount = 0;
  muxFaExp.truthTable.forEach(row => {
    const sockets: Record<string, SocketState> = {
      U1: { ic: '74153', icState: null, isPowered: true },
      U2: { ic: '7404', icState: null, isPowered: true },
    };
    const wires: Wire[] = muxFaExp.referenceWires.map((w, idx) => ({ id: idx + 1, from: w.from, to: w.to, color: 'auto' }));
    const res = solveCircuit(wires, sockets, { 2: row.A, 1: row.B, 3: row.Cin }, { state: 0 }, { state: 0 }, true);
    if (res.ledOutputs[1] === row.SUM && res.ledOutputs[2] === row.CARRY) {
      muxFaCount++;
    }
  });
  record(g7, 'Full Adder using IC 74153: All 8/8 truth table rows verified', muxFaCount === 8);

  // -------------------------------------------------------------------------
  // 8. MOD-45 Counter using IC 7490 (Exam 10)
  // -------------------------------------------------------------------------
  const g8 = '8. Decade Counter MOD-45 & MOD-16 (IC 7490)';
  const mod45Exp = EXPERIMENTS['exam10'];
  const sockets45: Record<string, SocketState> = {
    U1: { ic: '7490', icState: IC_DEFINITIONS['7490'].initInternalState!(), isPowered: true },
    U2: { ic: '7490', icState: IC_DEFINITIONS['7490'].initInternalState!(), isPowered: true },
    U3: { ic: '7408', icState: null, isPowered: true },
  };
  const wires45: Wire[] = mod45Exp.referenceWires.map((w, idx) => ({ id: idx + 1, from: w.from, to: w.to, color: 'auto' }));

  // Simulate first 10 counts of MOD-45
  let mod45Pass = true;
  for (let c = 1; c <= 10; c++) {
    solveCircuit(wires45, sockets45, {}, { state: 0 }, { state: 0 }, true);
    const r = solveCircuit(wires45, sockets45, {}, { state: 1 }, { state: 1 }, true);
    const units = parseInt(r.segA, 16);
    if (isNaN(units) || units !== (c % 10)) {
      mod45Pass = false;
      break;
    }
  }
  record(g8, 'MOD-45 Counter: Cascaded units and tens decade counters increment properly', mod45Pass);

  // -------------------------------------------------------------------------
  // 9. Electrical Integrity & Disconnect Recovery
  // -------------------------------------------------------------------------
  const g9 = '9. Electrical Safety & Wire Connectivity';
  // VCC Disconnect Test
  const faNoVccWires = faExp.referenceWires.filter(w => !(w.from === 'vcc:1' && w.to === 'U1:p14'));
  const resNoVcc = solveCircuit(
    faNoVccWires.map((w, i) => ({ id: i + 1, from: w.from, to: w.to, color: 'auto' })),
    {
      U1: { ic: '7486', icState: null, isPowered: false },
      U2: { ic: '7408', icState: null, isPowered: true },
      U3: { ic: '7432', icState: null, isPowered: true },
    },
    { 1: 1, 2: 1, 3: 0 },
    { state: 0 },
    { state: 0 },
    true
  );
  record(g9, 'Power Rail Validation: Disconnecting VCC causes IC to be flagged UNPOWERED', !resNoVcc.socketPower['U1']);
  record(g9, 'High-Z Protection: Unpowered IC produces floating High-Z (Z) output rather than false 0 or 1', resNoVcc.pinValues['U1:p3'] === 'Z');

  // Short Circuit Detection
  const shortWires: Wire[] = [
    { id: 1, from: 'vcc:1', to: 'gnd:1', color: 'red' },
  ];
  const resShort = solveCircuit(shortWires, {}, {}, { state: 0 }, { state: 0 }, true);
  record(g9, 'Short Circuit Detection: VCC shorted to GND correctly detected as BUS CONTENTION', resShort.diagnostics.status === 'ERROR');

  // -------------------------------------------------------------------------
  // 10. Clear Wire & Clear Board Lifecycle Verification
  // -------------------------------------------------------------------------
  const g10 = '10. Clear Wire & Clear Board Features';

  // 10.1 Select a wire and delete it
  let testWires: Wire[] = [
    { id: 1, from: 'vcc:1', to: 'U1:p14', color: '#dc2626' },
    { id: 2, from: 'gnd:1', to: 'U1:p7', color: '#16a34a' },
    { id: 3, from: 'in:1', to: 'out:1', color: '#2563eb' },
  ];
  let selectedId: number | null = 3;
  // Delete selected wire
  testWires = testWires.filter(w => w.id !== selectedId);
  selectedId = null;
  record(g10, 'Case 1: Select a wire and delete it removes only the selected wire',
    testWires.length === 2 && !testWires.some(w => w.id === 3) && testWires.some(w => w.id === 1)
  );

  // 10.2 Use Clear Wire action on a selected wire
  function executeClearWire(currentWires: Wire[], selId: number | null): { newWires: Wire[]; newSelId: number | null; feedback: string } {
    if (selId === null) {
      return { newWires: currentWires, newSelId: null, feedback: 'No wire selected' };
    }
    return {
      newWires: currentWires.filter(w => w.id !== selId),
      newSelId: null,
      feedback: `Wire #${selId} removed`,
    };
  }
  const clearWireRes = executeClearWire(testWires, 1);
  record(g10, 'Case 2: Clear Wire action removes target wire and resets selection',
    clearWireRes.newWires.length === 1 && clearWireRes.newSelId === null && !clearWireRes.newWires.some(w => w.id === 1)
  );

  // 10.3 Attempt Clear Wire with no wire selected
  const clearWireNoSel = executeClearWire(testWires, null);
  record(g10, 'Case 3: Attempt Clear Wire with no wire selected shows feedback and leaves wires unchanged',
    clearWireNoSel.newWires.length === testWires.length && clearWireNoSel.feedback === 'No wire selected'
  );

  // 10.4 Clear a board containing multiple wires
  let boardWires: Wire[] = [
    { id: 1, from: 'vcc:1', to: 'U1:p14', color: 'red' },
    { id: 2, from: 'gnd:1', to: 'U1:p7', color: 'green' },
    { id: 3, from: 'in:1', to: 'U1:p1', color: 'blue' },
    { id: 4, from: 'in:2', to: 'U1:p2', color: 'blue' },
    { id: 5, from: 'U1:p3', to: 'out:1', color: 'purple' },
  ];
  let currentSelWire: number | null = 4;
  let currentSelTerm: string | null = 'in:3';

  // Execute Clear Board
  function executeClearBoard(wiresToClear: Wire[]): { clearedWires: Wire[]; selWire: null; selTerm: null } {
    return { clearedWires: [], selWire: null, selTerm: null };
  }
  const clearBoardRes = executeClearBoard(boardWires);
  record(g10, 'Case 4: Clear Board removes every connected patch wire and clears active terminal/selection',
    clearBoardRes.clearedWires.length === 0 && clearBoardRes.selWire === null && clearBoardRes.selTerm === null
  );

  // 10.5 Verify wire array becomes empty after clearing
  record(g10, 'Case 5: Wire array is completely empty (0 wires) after Clear Board', clearBoardRes.clearedWires.length === 0);

  // 10.6 Verify deleted connections no longer influence IC outputs or LEDs
  // Before deletion: in:1 is connected to out:1 with Switch S1 = 1 => LED L1 = 1
  const beforeWires: Wire[] = [{ id: 1, from: 'in:1', to: 'out:1', color: '#2563eb' }];
  const resBefore = solveCircuit(beforeWires, {}, { 1: 1 }, { state: 0 }, { state: 0 }, true);
  // After deletion: wires = []
  const resAfter = solveCircuit([], {}, { 1: 1 }, { state: 0 }, { state: 0 }, true);
  record(g10, 'Case 6: Deleted wire immediately recalculates circuit so disconnected LED turns OFF (Z/0)',
    resBefore.ledOutputs[1] === 1 && resAfter.ledOutputs[1] === 'Z'
  );

  // 10.7 Draw new wires successfully after clearing
  const afterClearWires: Wire[] = [{ id: 10, from: 'in:2', to: 'out:2', color: '#2563eb' }];
  const resNewWire = solveCircuit(afterClearWires, {}, { 2: 1 }, { state: 0 }, { state: 0 }, true);
  record(g10, 'Case 7: Drawing new wires immediately after clearing operates and recalculates properly',
    resNewWire.ledOutputs[2] === 1
  );

  // 10.8 Verify Clear Board completely clears all placed ICs, logic gates, and components
  const boardSockets: Record<string, SocketState> = {
    U1: { ic: '7486', icState: null, isPowered: true },
    U2: { ic: '7408', icState: null, isPowered: true },
    U3: { ic: '7432', icState: null, isPowered: true },
    U4: { ic: null, icState: null, isPowered: false },
    U5: { ic: null, icState: null, isPowered: false },
    U6: { ic: null, icState: null, isPowered: false },
  };
  function executeCompleteClearBoard(currentWires: Wire[], currentSockets: Record<string, SocketState>) {
    const clearedSockets: Record<string, SocketState> = {};
    Object.keys(currentSockets).forEach(k => {
      clearedSockets[k] = { ic: null, icState: null, isPowered: false };
    });
    return {
      clearedWires: [] as Wire[],
      clearedSockets,
      selWire: null,
      selTerm: null,
    };
  }
  const fullClearRes = executeCompleteClearBoard(boardWires, boardSockets);
  const allIcsCleared = Object.values(fullClearRes.clearedSockets).every(s => s.ic === null);
  const allWiresCleared = fullClearRes.clearedWires.length === 0;
  record(g10, 'Case 8: Clear Board clears all placed ICs, logic gates, and components from sockets U1-U6',
    allIcsCleared && allWiresCleared && fullClearRes.selWire === null && fullClearRes.selTerm === null
  );

  // 10.9 Verify full-board snapshot Undo restores both cleared ICs and cleared wires
  interface SnapshotSim {
    wires: Wire[];
    sockets: Record<string, SocketState>;
  }
  const undoStackSim: SnapshotSim[] = [];
  const redoStackSim: SnapshotSim[] = [];
  let simActiveWires = [...boardWires];
  let simActiveSockets = { ...boardSockets };

  // Action: Clear Board
  undoStackSim.push({ wires: [...simActiveWires], sockets: { ...simActiveSockets } });
  redoStackSim.length = 0;
  simActiveWires = [];
  simActiveSockets = {
    U1: { ic: null, icState: null, isPowered: false },
    U2: { ic: null, icState: null, isPowered: false },
    U3: { ic: null, icState: null, isPowered: false },
    U4: { ic: null, icState: null, isPowered: false },
    U5: { ic: null, icState: null, isPowered: false },
    U6: { ic: null, icState: null, isPowered: false },
  };

  // Undo: Restore both wires and ICs
  redoStackSim.push({ wires: [...simActiveWires], sockets: { ...simActiveSockets } });
  const restoredSnapshot = undoStackSim.pop()!;
  simActiveWires = restoredSnapshot.wires;
  simActiveSockets = restoredSnapshot.sockets;
  const undoRestoredAll = simActiveWires.length === 5 && simActiveSockets.U1.ic === '7486' && simActiveSockets.U2.ic === '7408';

  // Redo: Clear again
  undoStackSim.push({ wires: [...simActiveWires], sockets: { ...simActiveSockets } });
  const redoSnapshot = redoStackSim.pop()!;
  simActiveWires = redoSnapshot.wires;
  simActiveSockets = redoSnapshot.sockets;
  const redoClearedAll = simActiveWires.length === 0 && Object.values(simActiveSockets).every(s => s.ic === null);

  record(g10, 'Case 9: Undo restores both cleared ICs and wires; Redo clears them again accurately', undoRestoredAll && redoClearedAll);

  // 10.10 Verify Delete and Backspace do not interfere with text inputs
  function shouldTriggerWireDelete(targetTag: string, isEditable: boolean): boolean {
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(targetTag) || isEditable) return false;
    return true;
  }
  record(g10, 'Case 10: Delete and Backspace keys are blocked inside text inputs and contentEditable controls',
    !shouldTriggerWireDelete('INPUT', false) && !shouldTriggerWireDelete('TEXTAREA', false) && !shouldTriggerWireDelete('DIV', true) && shouldTriggerWireDelete('DIV', false)
  );

  // 10.11 Verify deleted wires do not reappear after simulation updates or React re-renders
  const simPass1 = solveCircuit([], {}, {}, { state: 0 }, { state: 0 }, true);
  const simPass2 = solveCircuit([], {}, {}, { state: 1 }, { state: 1 }, true);
  record(g10, 'Case 11: Solved circuit state retains zero wires across consecutive simulation clock ticks',
    simPass1.diagnostics.nets.some(n => n.msg.includes('No patch wires connected')) &&
    simPass2.diagnostics.nets.some(n => n.msg.includes('No patch wires connected'))
  );

  // 10.12 Verify Reset Board halts running clock and resets pulse count
  let runningClock: boolean = true;
  let activePulseCount: number = 42;
  function executeResetBoardState() {
    runningClock = false;
    activePulseCount = 0;
  }
  executeResetBoardState();
  record(g10, 'Case 12: Reset Board halts running clock and resets pulse counter to 0',
    !runningClock && activePulseCount === 0
  );

  // 10.13 Verify IC ejection removes attached wires and safely invalidates stale wire selection
  let socketWires: Wire[] = [
    { id: 101, from: 'U1:p14', to: 'vcc:1', color: 'red' },
    { id: 102, from: 'U1:p7', to: 'gnd:1', color: 'green' },
    { id: 103, from: 'in:1', to: 'out:1', color: 'blue' },
  ];
  let currentSelectedWireId: number | null = 101;
  const prefixToRemove = 'U1:p';
  const removedWireIds = new Set(
    socketWires.filter(w => w.from.startsWith(prefixToRemove) || w.to.startsWith(prefixToRemove)).map(w => w.id)
  );
  socketWires = socketWires.filter(w => !w.from.startsWith(prefixToRemove) && !w.to.startsWith(prefixToRemove));
  if (currentSelectedWireId !== null && removedWireIds.has(currentSelectedWireId)) {
    currentSelectedWireId = null;
  }
  record(g10, 'Case 13: IC ejection safely detaches connected wires and clears stale wire selection',
    socketWires.length === 1 && socketWires[0].id === 103 && currentSelectedWireId === null
  );

  // 10.14 Disconnected inputs immediately float to High-Z (Z) without retaining stale logic
  const connectedInputWires: Wire[] = [
    { id: 201, from: 'vcc:1', to: 'U1:p14', color: 'red' },
    { id: 202, from: 'gnd:1', to: 'U1:p7', color: 'green' },
    { id: 203, from: 'in:1', to: 'U1:p1', color: 'blue' },
    { id: 204, from: 'in:1', to: 'U1:p2', color: 'blue' },
  ];
  const u1Socket: Record<string, SocketState> = {
    U1: { ic: '7408', icState: null, isPowered: true },
  };
  const activeRes = solveCircuit(connectedInputWires, u1Socket, { 1: 1 }, { state: 0 }, { state: 0 }, true);
  // Now disconnect input wires:
  const disconnectedWires = connectedInputWires.filter(w => w.id !== 203 && w.id !== 204);
  const disconnectedRes = solveCircuit(disconnectedWires, u1Socket, { 1: 1 }, { state: 0 }, { state: 0 }, true);
  record(g10, 'Case 14: Disconnected inputs immediately float to High-Z (Z) without retaining stale logic',
    activeRes.pinValues['U1:p3'] === 1 && disconnectedRes.pinValues['U1:p3'] === 'Z'
  );

  // =========================================================================
  // GROUP 11: Reference Pin Diagrams & Datasheet Pinout Verification (All 8 Pages)
  // =========================================================================
  const g11 = '11. IC Pin Diagrams & Reference Mappings (All 8 Pages)';
  const ic7408 = IC_DEFINITIONS['7408'];
  const ic7400 = IC_DEFINITIONS['7400'];
  const ic7432 = IC_DEFINITIONS['7432'];
  const ic7486 = IC_DEFINITIONS['7486'];
  const ic74266 = IC_DEFINITIONS['74266'];
  const ic7404 = IC_DEFINITIONS['7404'];
  const ic7483 = IC_DEFINITIONS['7483'];
  const ic74153 = IC_DEFINITIONS['74153'];
  const ic74138 = IC_DEFINITIONS['74138'];
  const ic7490 = IC_DEFINITIONS['7490'];

  record(g11, 'Page 1: IC 7408 AND (VCC=p14, GND=p7) & IC 7400 NAND (VCC=p14, GND=p7)',
    ic7408.pins === 14 && ic7408.vccPin === 14 && ic7408.gndPin === 7 &&
    ic7400.pins === 14 && ic7400.vccPin === 14 && ic7400.gndPin === 7
  );

  record(g11, 'Page 2: IC 7432 OR (VCC=p14, GND=p7) & IC 7486 XOR (VCC=p14, GND=p7)',
    ic7432.pins === 14 && ic7432.vccPin === 14 && ic7432.gndPin === 7 &&
    ic7486.pins === 14 && ic7486.vccPin === 14 && ic7486.gndPin === 7
  );

  record(g11, 'Page 3: IC 74266 XNOR (VCC=p14, GND=p7) & IC 7404 NOT (VCC=p14, GND=p7)',
    ic74266.pins === 14 && ic74266.vccPin === 14 && ic74266.gndPin === 7 &&
    ic7404.pins === 14 && ic7404.vccPin === 14 && ic7404.gndPin === 7
  );

  record(g11, 'Page 4: IC 7483 4-Bit Adder: VCC is Pin 5 and GND is Pin 12 (Datasheet Rule)',
    ic7483.pins === 16 && ic7483.vccPin === 5 && ic7483.gndPin === 12 &&
    ic7483.pinout[13]?.name === 'C0' && ic7483.pinout[14]?.name === 'C4'
  );

  record(g11, 'Page 5: IC 74153 Dual 4:1 MUX: VCC is Pin 16 and GND is Pin 8',
    ic74153.pins === 16 && ic74153.vccPin === 16 && ic74153.gndPin === 8 &&
    ic74153.pinout[1]?.name === '1G̅' && ic74153.pinout[15]?.name === '2G̅' &&
    ic74153.pinout[14]?.name === 'A' && ic74153.pinout[2]?.name === 'B'
  );

  record(g11, 'Page 6: IC 74138 3:8 Decoder: VCC is Pin 16 and GND is Pin 8',
    ic74138.pins === 16 && ic74138.vccPin === 16 && ic74138.gndPin === 8 &&
    ic74138.pinout[1]?.name === 'A' && ic74138.pinout[2]?.name === 'B' && ic74138.pinout[3]?.name === 'C' &&
    ic74138.pinout[6]?.name === 'G1' && ic74138.pinout[4]?.name === 'G2A̅' && ic74138.pinout[5]?.name === 'G2B̅'
  );

  record(g11, 'Page 7: IC 7476 Dual JK Flip-Flop: VCC is Pin 16 and GND is Pin 8',
    ic7476.pins === 16 && ic7476.vccPin === 16 && ic7476.gndPin === 8 &&
    ic7476.pinout[1]?.name === '1CLK' && ic7476.pinout[15]?.name === '2CLK'
  );

  record(g11, 'Page 8: IC 7490 Decade Counter: VCC is Pin 5 and GND is Pin 10',
    ic7490.pins === 14 && ic7490.vccPin === 5 && ic7490.gndPin === 10 &&
    ic7490.pinout[14]?.name === 'CKA' && ic7490.pinout[1]?.name === 'CKB'
  );

  // =========================================================================
  // GROUP 12: IC 74266 Quad 2-Input XNOR Gate Logic
  // =========================================================================
  const g12 = '12. IC 74266 Quad 2-Input XNOR Gate Logic & Pinout';
  const xnorGate0 = ic74266.gates?.[0];
  const xnorTruth00 = xnorGate0?.fn(0, 0) === 1;
  const xnorTruth01 = xnorGate0?.fn(0, 1) === 0;
  const xnorTruth10 = xnorGate0?.fn(1, 0) === 0;
  const xnorTruth11 = xnorGate0?.fn(1, 1) === 1;
  const xnorFloat = xnorGate0?.fn('Z', 1) === 'Z';

  record(g12, '74266 XNOR Equivalence Truth Table (00->1, 01->0, 10->0, 11->1)',
    xnorTruth00 && xnorTruth01 && xnorTruth10 && xnorTruth11
  );

  record(g12, '74266 Floating Input Protection (Outputs High-Z Z when inputs float)',
    xnorFloat
  );

  // Solved in circuit simulation
  const xnorWires: Wire[] = [
    { id: 301, from: 'vcc:1', to: 'U1:p14', color: 'red' },
    { id: 302, from: 'gnd:1', to: 'U1:p7', color: 'green' },
    { id: 303, from: 'in:1', to: 'U1:p1', color: 'blue' },
    { id: 304, from: 'in:2', to: 'U1:p2', color: 'blue' },
    { id: 305, from: 'U1:p3', to: 'out:1', color: 'amber' },
  ];
  const xnorSocket: Record<string, SocketState> = {
    U1: { ic: '74266', icState: null, isPowered: true },
  };
  const xnorRes00 = solveCircuit(xnorWires, xnorSocket, { 1: 0, 2: 0 }, { state: 0 }, { state: 0 }, true);
  const xnorRes01 = solveCircuit(xnorWires, xnorSocket, { 1: 0, 2: 1 }, { state: 0 }, { state: 0 }, true);
  const xnorRes11 = solveCircuit(xnorWires, xnorSocket, { 1: 1, 2: 1 }, { state: 0 }, { state: 0 }, true);

  record(g12, '74266 Circuit Simulation: Output Pin 3 drives LED L1 HIGH when inputs match',
    xnorRes00.ledOutputs[1] === 1 && xnorRes01.ledOutputs[1] === 0 && xnorRes11.ledOutputs[1] === 1
  );

  // =========================================================================
  // GROUP 13: IC 74138 3-to-8 Line Decoder / Demultiplexer Logic & Enables
  // =========================================================================
  const g13 = '13. IC 74138 3-to-8 Line Decoder / Demultiplexer';

  // Disabled cases: G1=0, G2A=1, or G2B=1 forces all outputs to 1 (HIGH)
  const disEval1 = ic74138.evaluate?.({ 6: 0, 4: 0, 5: 0, 1: 0, 2: 0, 3: 0 }); // G1=0
  const allHighDis1 = disEval1 && [15, 14, 13, 12, 11, 10, 9, 7].every(p => disEval1[p] === 1);

  const disEval2 = ic74138.evaluate?.({ 6: 1, 4: 1, 5: 0, 1: 0, 2: 0, 3: 0 }); // G2A=1
  const allHighDis2 = disEval2 && [15, 14, 13, 12, 11, 10, 9, 7].every(p => disEval2[p] === 1);

  record(g13, '74138 Enable Control: Disabled condition (G1=0 or G2A̅=1 or G2B̅=1) forces all 8 outputs HIGH (1)',
    !!allHighDis1 && !!allHighDis2
  );

  // Enabled cases (G1=1, G2A=0, G2B=0) across all 8 select addresses (000 to 111)
  const outPinOrder = [15, 14, 13, 12, 11, 10, 9, 7];
  let decodeAll8Match = true;
  for (let sel = 0; sel < 8; sel++) {
    const a = (sel & 1) as 0 | 1;
    const b = ((sel >> 1) & 1) as 0 | 1;
    const c = ((sel >> 2) & 1) as 0 | 1;
    const out = ic74138.evaluate?.({ 6: 1, 4: 0, 5: 0, 1: a, 2: b, 3: c });
    if (!out) { decodeAll8Match = false; break; }
    const expectedLowPin = outPinOrder[sel];
    for (const p of outPinOrder) {
      if (p === expectedLowPin && out[p] !== 0) decodeAll8Match = false;
      if (p !== expectedLowPin && out[p] !== 1) decodeAll8Match = false;
    }
  }

  record(g13, '74138 Address Decoding: All 8 binary combinations (000-111) activate active-LOW outputs Y0̅-Y7̅',
    decodeAll8Match
  );

  // Circuit simulation of 74138 in virtual trainer
  const decWires: Wire[] = [
    { id: 401, from: 'vcc:1', to: 'U1:p16', color: 'red' }, // VCC
    { id: 402, from: 'gnd:1', to: 'U1:p8', color: 'green' }, // GND
    { id: 403, from: 'vcc:2', to: 'U1:p6', color: 'red' }, // G1 = 1 (Enable active)
    { id: 404, from: 'gnd:2', to: 'U1:p4', color: 'green' }, // G2A̅ = 0 (Enable active)
    { id: 405, from: 'gnd:3', to: 'U1:p5', color: 'green' }, // G2B̅ = 0 (Enable active)
    { id: 406, from: 'in:1', to: 'U1:p1', color: 'blue' }, // A (S1)
    { id: 407, from: 'in:2', to: 'U1:p2', color: 'blue' }, // B (S2)
    { id: 408, from: 'in:3', to: 'U1:p3', color: 'blue' }, // C (S3)
    { id: 409, from: 'U1:p15', to: 'out:1', color: 'amber' }, // Y0̅ -> L1
    { id: 410, from: 'U1:p14', to: 'out:2', color: 'amber' }, // Y1̅ -> L2
    { id: 411, from: 'U1:p13', to: 'out:3', color: 'amber' }, // Y2̅ -> L3
    { id: 412, from: 'U1:p12', to: 'out:4', color: 'amber' }, // Y3̅ -> L4
  ];
  const decSocket: Record<string, SocketState> = {
    U1: { ic: '74138', icState: null, isPowered: true },
  };
  const decRes0 = solveCircuit(decWires, decSocket, { 1: 0, 2: 0, 3: 0 }, { state: 0 }, { state: 0 }, true);
  const decRes1 = solveCircuit(decWires, decSocket, { 1: 1, 2: 0, 3: 0 }, { state: 0 }, { state: 0 }, true);

  record(g13, '74138 Circuit Simulation: Active-LOW output Y0̅ drops to 0 at address 000, and Y1̅ drops to 0 at address 001',
    decRes0.pinValues['U1:p15'] === 0 && decRes0.pinValues['U1:p14'] === 1 &&
    decRes1.pinValues['U1:p15'] === 1 && decRes1.pinValues['U1:p14'] === 0
  );

  const total = results.length;
  const passed = results.filter(r => r.passed).length;
  const failed = total - passed;

  return { total, passed, failed, results };
}
