import { ICDefinition, IC7476State, IC7490State } from '../types';

export const IC_DEFINITIONS: Record<string, ICDefinition> = {
  '7400': {
    name: '7400 Quad 2-Input NAND Gate',
    package: '14-Pin DIP',
    pins: 14,
    vccPin: 14,
    gndPin: 7,
    pinout: {
      1: { name: '1A', type: 'in', gate: 0, arg: 0, desc: 'Gate 1 Input A' },
      2: { name: '1B', type: 'in', gate: 0, arg: 1, desc: 'Gate 1 Input B' },
      3: { name: '1Y', type: 'out', gate: 0, desc: 'Gate 1 Output Y' },
      4: { name: '2A', type: 'in', gate: 1, arg: 0, desc: 'Gate 2 Input A' },
      5: { name: '2B', type: 'in', gate: 1, arg: 1, desc: 'Gate 2 Input B' },
      6: { name: '2Y', type: 'out', gate: 1, desc: 'Gate 2 Output Y' },
      7: { name: 'GND', type: 'gnd', desc: 'Ground Reference (0V)' },
      8: { name: '3Y', type: 'out', gate: 2, desc: 'Gate 3 Output Y' },
      9: { name: '3A', type: 'in', gate: 2, arg: 0, desc: 'Gate 3 Input A' },
      10: { name: '3B', type: 'in', gate: 2, arg: 1, desc: 'Gate 3 Input B' },
      11: { name: '4Y', type: 'out', gate: 3, desc: 'Gate 4 Output Y' },
      12: { name: '4A', type: 'in', gate: 3, arg: 0, desc: 'Gate 4 Input A' },
      13: { name: '4B', type: 'in', gate: 3, arg: 1, desc: 'Gate 4 Input B' },
      14: { name: 'VCC', type: 'vcc', desc: 'Positive Supply (+5V)' },
    },
    gates: [
      { inputs: [1, 2], output: 3, fn: (a, b) => (a === 'Z' || b === 'Z' ? 'Z' : a === 1 && b === 1 ? 0 : 1) },
      { inputs: [4, 5], output: 6, fn: (a, b) => (a === 'Z' || b === 'Z' ? 'Z' : a === 1 && b === 1 ? 0 : 1) },
      { inputs: [9, 10], output: 8, fn: (a, b) => (a === 'Z' || b === 'Z' ? 'Z' : a === 1 && b === 1 ? 0 : 1) },
      { inputs: [12, 13], output: 11, fn: (a, b) => (a === 'Z' || b === 'Z' ? 'Z' : a === 1 && b === 1 ? 0 : 1) },
    ],
  },

  '7404': {
    name: '7404 Hex Inverter (NOT Gates)',
    package: '14-Pin DIP',
    pins: 14,
    vccPin: 14,
    gndPin: 7,
    pinout: {
      1: { name: '1A', type: 'in', gate: 0, desc: 'Inverter 1 Input' },
      2: { name: '1Y', type: 'out', gate: 0, desc: 'Inverter 1 Output' },
      3: { name: '2A', type: 'in', gate: 1, desc: 'Inverter 2 Input' },
      4: { name: '2Y', type: 'out', gate: 1, desc: 'Inverter 2 Output' },
      5: { name: '3A', type: 'in', gate: 2, desc: 'Inverter 3 Input' },
      6: { name: '3Y', type: 'out', gate: 2, desc: 'Inverter 3 Output' },
      7: { name: 'GND', type: 'gnd', desc: 'Ground Reference (0V)' },
      8: { name: '4Y', type: 'out', gate: 3, desc: 'Inverter 4 Output' },
      9: { name: '4A', type: 'in', gate: 3, desc: 'Inverter 4 Input' },
      10: { name: '5Y', type: 'out', gate: 4, desc: 'Inverter 5 Output' },
      11: { name: '5A', type: 'in', gate: 4, desc: 'Inverter 5 Input' },
      12: { name: '6Y', type: 'out', gate: 5, desc: 'Inverter 6 Output' },
      13: { name: '6A', type: 'in', gate: 5, desc: 'Inverter 6 Input' },
      14: { name: 'VCC', type: 'vcc', desc: 'Positive Supply (+5V)' },
    },
    gates: [
      { inputs: [1], output: 2, fn: a => (a === 'Z' ? 'Z' : a === 1 ? 0 : 1) },
      { inputs: [3], output: 4, fn: a => (a === 'Z' ? 'Z' : a === 1 ? 0 : 1) },
      { inputs: [5], output: 6, fn: a => (a === 'Z' ? 'Z' : a === 1 ? 0 : 1) },
      { inputs: [9], output: 8, fn: a => (a === 'Z' ? 'Z' : a === 1 ? 0 : 1) },
      { inputs: [11], output: 10, fn: a => (a === 'Z' ? 'Z' : a === 1 ? 0 : 1) },
      { inputs: [13], output: 12, fn: a => (a === 'Z' ? 'Z' : a === 1 ? 0 : 1) },
    ],
  },

  '7408': {
    name: '7408 Quad 2-Input AND Gate',
    package: '14-Pin DIP',
    pins: 14,
    vccPin: 14,
    gndPin: 7,
    pinout: {
      1: { name: '1A', type: 'in', gate: 0, arg: 0, desc: 'Gate 1 Input A' },
      2: { name: '1B', type: 'in', gate: 0, arg: 1, desc: 'Gate 1 Input B' },
      3: { name: '1Y', type: 'out', gate: 0, desc: 'Gate 1 Output Y' },
      4: { name: '2A', type: 'in', gate: 1, arg: 0, desc: 'Gate 2 Input A' },
      5: { name: '2B', type: 'in', gate: 1, arg: 1, desc: 'Gate 2 Input B' },
      6: { name: '2Y', type: 'out', gate: 1, desc: 'Gate 2 Output Y' },
      7: { name: 'GND', type: 'gnd', desc: 'Ground Reference (0V)' },
      8: { name: '3Y', type: 'out', gate: 2, desc: 'Gate 3 Output Y' },
      9: { name: '3A', type: 'in', gate: 2, arg: 0, desc: 'Gate 3 Input A' },
      10: { name: '3B', type: 'in', gate: 2, arg: 1, desc: 'Gate 3 Input B' },
      11: { name: '4Y', type: 'out', gate: 3, desc: 'Gate 4 Output Y' },
      12: { name: '4A', type: 'in', gate: 3, arg: 0, desc: 'Gate 4 Input A' },
      13: { name: '4B', type: 'in', gate: 3, arg: 1, desc: 'Gate 4 Input B' },
      14: { name: 'VCC', type: 'vcc', desc: 'Positive Supply (+5V)' },
    },
    gates: [
      { inputs: [1, 2], output: 3, fn: (a, b) => (a === 'Z' || b === 'Z' ? 'Z' : a === 1 && b === 1 ? 1 : 0) },
      { inputs: [4, 5], output: 6, fn: (a, b) => (a === 'Z' || b === 'Z' ? 'Z' : a === 1 && b === 1 ? 1 : 0) },
      { inputs: [9, 10], output: 8, fn: (a, b) => (a === 'Z' || b === 'Z' ? 'Z' : a === 1 && b === 1 ? 1 : 0) },
      { inputs: [12, 13], output: 11, fn: (a, b) => (a === 'Z' || b === 'Z' ? 'Z' : a === 1 && b === 1 ? 1 : 0) },
    ],
  },

  '7432': {
    name: '7432 Quad 2-Input OR Gate',
    package: '14-Pin DIP',
    pins: 14,
    vccPin: 14,
    gndPin: 7,
    pinout: {
      1: { name: '1A', type: 'in', gate: 0, arg: 0, desc: 'Gate 1 Input A' },
      2: { name: '1B', type: 'in', gate: 0, arg: 1, desc: 'Gate 1 Input B' },
      3: { name: '1Y', type: 'out', gate: 0, desc: 'Gate 1 Output Y' },
      4: { name: '2A', type: 'in', gate: 1, arg: 0, desc: 'Gate 2 Input A' },
      5: { name: '2B', type: 'in', gate: 1, arg: 1, desc: 'Gate 2 Input B' },
      6: { name: '2Y', type: 'out', gate: 1, desc: 'Gate 2 Output Y' },
      7: { name: 'GND', type: 'gnd', desc: 'Ground Reference (0V)' },
      8: { name: '3Y', type: 'out', gate: 2, desc: 'Gate 3 Output Y' },
      9: { name: '3A', type: 'in', gate: 2, arg: 0, desc: 'Gate 3 Input A' },
      10: { name: '3B', type: 'in', gate: 2, arg: 1, desc: 'Gate 3 Input B' },
      11: { name: '4Y', type: 'out', gate: 3, desc: 'Gate 4 Output Y' },
      12: { name: '4A', type: 'in', gate: 3, arg: 0, desc: 'Gate 4 Input A' },
      13: { name: '4B', type: 'in', gate: 3, arg: 1, desc: 'Gate 4 Input B' },
      14: { name: 'VCC', type: 'vcc', desc: 'Positive Supply (+5V)' },
    },
    gates: [
      { inputs: [1, 2], output: 3, fn: (a, b) => (a === 'Z' || b === 'Z' ? 'Z' : a === 1 || b === 1 ? 1 : 0) },
      { inputs: [4, 5], output: 6, fn: (a, b) => (a === 'Z' || b === 'Z' ? 'Z' : a === 1 || b === 1 ? 1 : 0) },
      { inputs: [9, 10], output: 8, fn: (a, b) => (a === 'Z' || b === 'Z' ? 'Z' : a === 1 || b === 1 ? 1 : 0) },
      { inputs: [12, 13], output: 11, fn: (a, b) => (a === 'Z' || b === 'Z' ? 'Z' : a === 1 || b === 1 ? 1 : 0) },
    ],
  },

  '7486': {
    name: '7486 Quad 2-Input XOR Gate',
    package: '14-Pin DIP',
    pins: 14,
    vccPin: 14,
    gndPin: 7,
    pinout: {
      1: { name: '1A', type: 'in', gate: 0, arg: 0, desc: 'Gate 1 Input A' },
      2: { name: '1B', type: 'in', gate: 0, arg: 1, desc: 'Gate 1 Input B' },
      3: { name: '1Y', type: 'out', gate: 0, desc: 'Gate 1 Output Y' },
      4: { name: '2A', type: 'in', gate: 1, arg: 0, desc: 'Gate 2 Input A' },
      5: { name: '2B', type: 'in', gate: 1, arg: 1, desc: 'Gate 2 Input B' },
      6: { name: '2Y', type: 'out', gate: 1, desc: 'Gate 2 Output Y' },
      7: { name: 'GND', type: 'gnd', desc: 'Ground Reference (0V)' },
      8: { name: '3Y', type: 'out', gate: 2, desc: 'Gate 3 Output Y' },
      9: { name: '3A', type: 'in', gate: 2, arg: 0, desc: 'Gate 3 Input A' },
      10: { name: '3B', type: 'in', gate: 2, arg: 1, desc: 'Gate 3 Input B' },
      11: { name: '4Y', type: 'out', gate: 3, desc: 'Gate 4 Output Y' },
      12: { name: '4A', type: 'in', gate: 3, arg: 0, desc: 'Gate 4 Input A' },
      13: { name: '4B', type: 'in', gate: 3, arg: 1, desc: 'Gate 4 Input B' },
      14: { name: 'VCC', type: 'vcc', desc: 'Positive Supply (+5V)' },
    },
    gates: [
      { inputs: [1, 2], output: 3, fn: (a, b) => (a === 'Z' || b === 'Z' ? 'Z' : (a ^ b) as 0 | 1) },
      { inputs: [4, 5], output: 6, fn: (a, b) => (a === 'Z' || b === 'Z' ? 'Z' : (a ^ b) as 0 | 1) },
      { inputs: [9, 10], output: 8, fn: (a, b) => (a === 'Z' || b === 'Z' ? 'Z' : (a ^ b) as 0 | 1) },
      { inputs: [12, 13], output: 11, fn: (a, b) => (a === 'Z' || b === 'Z' ? 'Z' : (a ^ b) as 0 | 1) },
    ],
  },

  '7476': {
    name: '7476 Dual Master-Slave JK Flip-Flop with Preset & Clear',
    package: '16-Pin DIP',
    pins: 16,
    // Exact standard DIP-16 mapping: VCC is Pin 16 and GND is Pin 8
    vccPin: 16,
    gndPin: 8,
    pinout: {
      1: { name: '1CLK', type: 'clk', desc: 'FF1 Negative-Edge Clock Input' },
      2: { name: '1K', type: 'in', desc: 'FF1 K Input' },
      3: { name: '1J', type: 'in', desc: 'FF1 J Input' },
      4: { name: '1PRE̅', type: 'in', desc: 'FF1 Active-LOW Preset' },
      5: { name: '1CLR̅', type: 'in', desc: 'FF1 Active-LOW Clear' },
      6: { name: '1Q', type: 'out', desc: 'FF1 True Output Q' },
      7: { name: '1Q̅', type: 'out', desc: 'FF1 Complementary Output Q̅' },
      8: { name: 'GND', type: 'gnd', desc: 'Ground Reference (0V)' },
      9: { name: '2Q̅', type: 'out', desc: 'FF2 Complementary Output Q̅' },
      10: { name: '2Q', type: 'out', desc: 'FF2 True Output Q' },
      11: { name: '2CLR̅', type: 'in', desc: 'FF2 Active-LOW Clear' },
      12: { name: '2PRE̅', type: 'in', desc: 'FF2 Active-LOW Preset' },
      13: { name: '2J', type: 'in', desc: 'FF2 J Input' },
      14: { name: '2K', type: 'in', desc: 'FF2 K Input' },
      15: { name: '2CLK', type: 'clk', desc: 'FF2 Negative-Edge Clock Input' },
      16: { name: 'VCC', type: 'vcc', desc: 'Positive Supply (+5V)' },
    },
    initInternalState: (): IC7476State => ({
      ff1: { q: 0, qBar: 1, lastClk: 'Z', unstable: false },
      ff2: { q: 0, qBar: 1, lastClk: 'Z', unstable: false },
    }),
    evaluateSequential: function (state: IC7476State, inputs: Record<number, 0 | 1 | 'Z'>) {
      function updateSection(
        ff: { q: 0 | 1; qBar: 0 | 1; lastClk: 0 | 1 | 'Z'; masterJ?: 0 | 1; masterK?: 0 | 1; unstable?: boolean },
        pre: 0 | 1 | 'Z',
        clr: 0 | 1 | 'Z',
        clk: 0 | 1 | 'Z',
        j: 0 | 1 | 'Z',
        k: 0 | 1 | 'Z'
      ) {
        // Asynchronous active-LOW controls take absolute priority over clock and data
        if (pre === 0 && clr === 0) {
          // Unstable/forbidden condition per manufacturer datasheet: both outputs are forced HIGH
          ff.unstable = true;
          ff.q = 1;
          ff.qBar = 1;
        } else if (pre === 0) {
          ff.unstable = false;
          ff.q = 1;
          ff.qBar = 0;
        } else if (clr === 0) {
          ff.unstable = false;
          ff.q = 0;
          ff.qBar = 1;
        } else {
          // Normal clocked operation: both active-LOW controls inactive (tied HIGH or TTL floating)
          ff.unstable = false;
          // Master-Slave operation:
          // While clock is HIGH (1), the master latch samples J and K inputs
          if (clk === 1) {
            if (j !== 'Z') ff.masterJ = j;
            if (k !== 'Z') ff.masterK = k;
          }
          // On the falling edge of clock (1 -> 0), the slave latch updates outputs using the sampled master state
          else if (ff.lastClk === 1 && clk === 0) {
            const effJ = ff.masterJ !== undefined ? ff.masterJ : (j === 1 ? 1 : 0);
            const effK = ff.masterK !== undefined ? ff.masterK : (k === 1 ? 1 : 0);

            if (effJ === 0 && effK === 0) {
              // Hold state: Q(t+1) = Q(t)
            } else if (effJ === 0 && effK === 1) {
              // Reset: Q(t+1) = 0
              ff.q = 0;
              ff.qBar = 1;
            } else if (effJ === 1 && effK === 0) {
              // Set: Q(t+1) = 1
              ff.q = 1;
              ff.qBar = 0;
            } else if (effJ === 1 && effK === 1) {
              // Toggle: Q(t+1) = Q'(t)
              const nextQ = ff.q === 1 ? 0 : 1;
              ff.q = nextQ;
              ff.qBar = nextQ === 1 ? 0 : 1;
            }

            // Clear master latch after transfer to slave
            ff.masterJ = undefined;
            ff.masterK = undefined;
          }
        }
        if (clk !== 'Z' && clk !== undefined) {
          ff.lastClk = clk;
        }
      }

      // Update FF1: PRE=Pin 4, CLR=Pin 5, CLK=Pin 1, J=Pin 3, K=Pin 2
      updateSection(state.ff1, inputs[4], inputs[5], inputs[1], inputs[3], inputs[2]);
      // Update FF2: PRE=Pin 12, CLR=Pin 11, CLK=Pin 15, J=Pin 13, K=Pin 14
      updateSection(state.ff2, inputs[12], inputs[11], inputs[15], inputs[13], inputs[14]);

      return {
        6: state.ff1.q,
        7: state.ff1.qBar,
        10: state.ff2.q,
        9: state.ff2.qBar,
      };
    },
  },

  '7483': {
    name: '7483 4-Bit Binary Full Adder with Fast Carry',
    package: '16-Pin DIP',
    pins: 16,
    // Standard 7483 DIP-16: VCC is Pin 5, GND is Pin 12
    vccPin: 5,
    gndPin: 12,
    pinout: {
      1: { name: 'A4', type: 'in', desc: 'Operand A Bit 4 (MSB)' },
      2: { name: 'S3', type: 'out', desc: 'Sum Bit 3 Output' },
      3: { name: 'A3', type: 'in', desc: 'Operand A Bit 3' },
      4: { name: 'B3', type: 'in', desc: 'Operand B Bit 3' },
      5: { name: 'VCC', type: 'vcc', desc: 'Positive Supply (+5V)' },
      6: { name: 'S2', type: 'out', desc: 'Sum Bit 2 Output' },
      7: { name: 'B2', type: 'in', desc: 'Operand B Bit 2' },
      8: { name: 'A2', type: 'in', desc: 'Operand A Bit 2' },
      9: { name: 'S1', type: 'out', desc: 'Sum Bit 1 Output (LSB)' },
      10: { name: 'A1', type: 'in', desc: 'Operand A Bit 1 (LSB)' },
      11: { name: 'B1', type: 'in', desc: 'Operand B Bit 1 (LSB)' },
      12: { name: 'GND', type: 'gnd', desc: 'Ground Reference (0V)' },
      13: { name: 'C0', type: 'in', desc: 'Carry In' },
      14: { name: 'C4', type: 'out', desc: 'Carry Out (MSB Carry)' },
      15: { name: 'S4', type: 'out', desc: 'Sum Bit 4 Output (MSB)' },
      16: { name: 'B4', type: 'in', desc: 'Operand B Bit 4 (MSB)' },
    },
    evaluate: function (inputs: Record<number, 0 | 1 | 'Z'>) {
      const a1 = inputs[10], a2 = inputs[8], a3 = inputs[3], a4 = inputs[1];
      const b1 = inputs[11], b2 = inputs[7], b3 = inputs[4], b4 = inputs[16];
      const c0 = inputs[13];

      // If critical inputs are floating Z, outputs are Z
      if (c0 === 'Z' || a1 === 'Z' || b1 === 'Z' || a2 === 'Z' || b2 === 'Z' || a3 === 'Z' || b3 === 'Z' || a4 === 'Z' || b4 === 'Z') {
        return { 9: 'Z', 6: 'Z', 2: 'Z', 15: 'Z', 14: 'Z' };
      }

      // Bit 1
      const sum1 = a1 ^ b1 ^ c0;
      const c1 = (a1 & b1) | (c0 & (a1 ^ b1));

      // Bit 2
      const sum2 = a2 ^ b2 ^ c1;
      const c2 = (a2 & b2) | (c1 & (a2 ^ b2));

      // Bit 3
      const sum3 = a3 ^ b3 ^ c2;
      const c3 = (a3 & b3) | (c2 & (a3 ^ b3));

      // Bit 4
      const sum4 = a4 ^ b4 ^ c3;
      const c4 = (a4 & b4) | (c3 & (a4 ^ b4));

      return {
        9: sum1 as 0 | 1,
        6: sum2 as 0 | 1,
        2: sum3 as 0 | 1,
        15: sum4 as 0 | 1,
        14: c4 as 0 | 1,
      };
    },
  },

  '74153': {
    name: '74153 Dual 4-Line to 1-Line Data Selector / Multiplexer',
    package: '16-Pin DIP',
    pins: 16,
    vccPin: 16,
    gndPin: 8,
    pinout: {
      1: { name: '1G̅', type: 'in', desc: 'MUX 1 Active-LOW Strobe / Enable' },
      2: { name: 'B', type: 'in', desc: 'Common Select Input S1 (MSB)' },
      3: { name: '1C3', type: 'in', desc: 'MUX 1 Data Input 3' },
      4: { name: '1C2', type: 'in', desc: 'MUX 1 Data Input 2' },
      5: { name: '1C1', type: 'in', desc: 'MUX 1 Data Input 1' },
      6: { name: '1C0', type: 'in', desc: 'MUX 1 Data Input 0' },
      7: { name: '1Y', type: 'out', desc: 'MUX 1 Output' },
      8: { name: 'GND', type: 'gnd', desc: 'Ground Reference (0V)' },
      9: { name: '2Y', type: 'out', desc: 'MUX 2 Output' },
      10: { name: '2C0', type: 'in', desc: 'MUX 2 Data Input 0' },
      11: { name: '2C1', type: 'in', desc: 'MUX 2 Data Input 1' },
      12: { name: '2C2', type: 'in', desc: 'MUX 2 Data Input 2' },
      13: { name: '2C3', type: 'in', desc: 'MUX 2 Data Input 3' },
      14: { name: 'A', type: 'in', desc: 'Common Select Input S0 (LSB)' },
      15: { name: '2G̅', type: 'in', desc: 'MUX 2 Active-LOW Strobe / Enable' },
      16: { name: 'VCC', type: 'vcc', desc: 'Positive Supply (+5V)' },
    },
    evaluate: function (inputs: Record<number, 0 | 1 | 'Z'>) {
      const a = inputs[14]; // S0
      const b = inputs[2];  // S1
      const g1 = inputs[1]; // 1G'
      const g2 = inputs[15]; // 2G'

      let y1: 0 | 1 | 'Z' = 'Z';
      let y2: 0 | 1 | 'Z' = 'Z';

      // Section 1
      if (g1 === 1) {
        y1 = 0; // Disabled outputs LOW per TI datasheet
      } else if (g1 === 0) {
        if (a !== 'Z' && b !== 'Z') {
          const sel = (b << 1) | a;
          const pins1: Record<number, number> = { 0: 6, 1: 5, 2: 4, 3: 3 };
          const inVal = inputs[pins1[sel]];
          y1 = inVal !== undefined ? inVal : 'Z';
        }
      }

      // Section 2
      if (g2 === 1) {
        y2 = 0; // Disabled outputs LOW
      } else if (g2 === 0) {
        if (a !== 'Z' && b !== 'Z') {
          const sel = (b << 1) | a;
          const pins2: Record<number, number> = { 0: 10, 1: 11, 2: 12, 3: 13 };
          const inVal = inputs[pins2[sel]];
          y2 = inVal !== undefined ? inVal : 'Z';
        }
      }

      return {
        7: y1,
        9: y2,
      };
    },
  },

  '7490': {
    name: '7490 Decade & Binary Counter (Divide-by-2 and Divide-by-5)',
    package: '14-Pin DIP',
    pins: 14,
    vccPin: 5,
    gndPin: 10,
    pinout: {
      1: { name: 'CKB', type: 'clk', desc: 'Divide-by-5 Negative-Edge Clock Input' },
      2: { name: 'R0(1)', type: 'in', desc: 'Reset to 0 Gated Input 1' },
      3: { name: 'R0(2)', type: 'in', desc: 'Reset to 0 Gated Input 2' },
      4: { name: 'NC', type: 'nc', desc: 'No Internal Connection' },
      5: { name: 'VCC', type: 'vcc', desc: 'Positive Supply (+5V)' },
      6: { name: 'R9(1)', type: 'in', desc: 'Set to 9 Gated Input 1' },
      7: { name: 'R9(2)', type: 'in', desc: 'Set to 9 Gated Input 2' },
      8: { name: 'QC', type: 'out', desc: 'Counter Output C (Weight 4)' },
      9: { name: 'QB', type: 'out', desc: 'Counter Output B (Weight 2)' },
      10: { name: 'GND', type: 'gnd', desc: 'Ground Reference (0V)' },
      11: { name: 'QD', type: 'out', desc: 'Counter Output D (Weight 8 / MSB)' },
      12: { name: 'QA', type: 'out', desc: 'Counter Output A (Weight 1 / LSB)' },
      13: { name: 'NC', type: 'nc', desc: 'No Internal Connection' },
      14: { name: 'CKA', type: 'clk', desc: 'Divide-by-2 Negative-Edge Clock Input' },
    },
    initInternalState: (): IC7490State => ({
      qa: 0,
      b5Count: 0, // 0 to 4
      lastCka: 1,
      lastCkb: 0,
    }),
    evaluateSequential: function (state: IC7490State, inputs: Record<number, 0 | 1 | 'Z'>) {
      const r01 = inputs[2], r02 = inputs[3];
      const r91 = inputs[6], r92 = inputs[7];
      const cka = inputs[14] === undefined ? 'Z' : inputs[14];
      const ckb = inputs[1] === undefined ? 'Z' : inputs[1];

      // Master Reset: R0(1)=1 AND R0(2)=1 => 0000
      if (r01 === 1 && r02 === 1) {
        state.qa = 0;
        state.b5Count = 0;
        state.lastCkb = 0;
      }
      // Master Set: R9(1)=1 AND R9(2)=1 => 1001 (BCD 9)
      else if (r91 === 1 && r92 === 1) {
        state.qa = 1;
        state.b5Count = 4; // QD=1, QC=0, QB=0, QA=1
        state.lastCkb = 1;
      } else {
        // Divide-by-2: negative edge on CKA (1 -> 0)
        if (state.lastCka === 1 && cka === 0) {
          state.qa = state.qa === 1 ? 0 : 1;
        }

        // Divide-by-5: negative edge on CKB (1 -> 0)
        // If CKB is externally wired, use inputs[1]. If wired to QA or internally cascaded:
        const effectiveCkb = (ckb !== undefined && ckb !== 'Z') ? ckb : state.qa;
        if (state.lastCkb === 1 && effectiveCkb === 0) {
          state.b5Count = (state.b5Count + 1) % 5;
        }

        if (cka !== 'Z') state.lastCka = cka;
        state.lastCkb = effectiveCkb;
      }

      // Decode divide-by-5 state into B, C, D bits per 7490 truth table:
      // b5Count 0 => QD=0, QC=0, QB=0
      // b5Count 1 => QD=0, QC=0, QB=1
      // b5Count 2 => QD=0, QC=1, QB=0
      // b5Count 3 => QD=0, QC=1, QB=1
      // b5Count 4 => QD=1, QC=0, QB=0
      let qb: 0 | 1 = 0, qc: 0 | 1 = 0, qd: 0 | 1 = 0;
      if (state.b5Count === 1) { qb = 1; qc = 0; qd = 0; }
      else if (state.b5Count === 2) { qb = 0; qc = 1; qd = 0; }
      else if (state.b5Count === 3) { qb = 1; qc = 1; qd = 0; }
      else if (state.b5Count === 4) { qb = 0; qc = 0; qd = 1; }

      return {
        12: state.qa,
        9: qb,
        8: qc,
        11: qd,
      };
    },
  },

  '74151': {
    name: '74151 8-Line to 1-Line Data Selector / Multiplexer',
    package: '16-Pin DIP',
    pins: 16,
    vccPin: 16,
    gndPin: 8,
    pinout: {
      1: { name: 'D3', type: 'in', desc: 'Data Input 3' },
      2: { name: 'D2', type: 'in', desc: 'Data Input 2' },
      3: { name: 'D1', type: 'in', desc: 'Data Input 1' },
      4: { name: 'D0', type: 'in', desc: 'Data Input 0' },
      5: { name: 'Y', type: 'out', desc: 'True Data Output Y' },
      6: { name: 'W', type: 'out', desc: 'Complementary Output W (Y̅)' },
      7: { name: 'G̅', type: 'in', desc: 'Active-LOW Strobe / Enable' },
      8: { name: 'GND', type: 'gnd', desc: 'Ground Reference (0V)' },
      9: { name: 'C', type: 'in', desc: 'Select Input S2 (MSB)' },
      10: { name: 'B', type: 'in', desc: 'Select Input S1' },
      11: { name: 'A', type: 'in', desc: 'Select Input S0 (LSB)' },
      12: { name: 'D7', type: 'in', desc: 'Data Input 7' },
      13: { name: 'D6', type: 'in', desc: 'Data Input 6' },
      14: { name: 'D5', type: 'in', desc: 'Data Input 5' },
      15: { name: 'D4', type: 'in', desc: 'Data Input 4' },
      16: { name: 'VCC', type: 'vcc', desc: 'Positive Supply (+5V)' },
    },
    evaluate: function (inputs: Record<number, 0 | 1 | 'Z'>) {
      const strobe = inputs[7];
      if (strobe === 'Z') return { 5: 'Z', 6: 'Z' };
      if (strobe === 1) {
        // Disabled: Y=0, W=1 per TI datasheet
        return { 5: 0, 6: 1 };
      }
      const a = inputs[11], b = inputs[10], c = inputs[9];
      if (a === 'Z' || b === 'Z' || c === 'Z') return { 5: 'Z', 6: 'Z' };
      const sel = ((c as number) << 2) | ((b as number) << 1) | (a as number);
      const dMap: Record<number, number> = { 0: 4, 1: 3, 2: 2, 3: 1, 4: 15, 5: 14, 6: 13, 7: 12 };
      const selectedPin = dMap[sel];
      const val = inputs[selectedPin];
      if (val === 'Z') return { 5: 'Z', 6: 'Z' };
      return { 5: val, 6: val === 1 ? 0 : 1 };
    },
  },

  '74266': {
    name: '74266 Quad 2-Input XNOR Gate (Exclusive-NOR)',
    package: '14-Pin DIP',
    pins: 14,
    vccPin: 14,
    gndPin: 7,
    pinout: {
      1: { name: '1A', type: 'in', gate: 0, arg: 0, desc: 'Gate 1 Input A' },
      2: { name: '1B', type: 'in', gate: 0, arg: 1, desc: 'Gate 1 Input B' },
      3: { name: '1Y', type: 'out', gate: 0, desc: 'Gate 1 Output Y (Open-Collector)' },
      4: { name: '2A', type: 'in', gate: 1, arg: 0, desc: 'Gate 2 Input A' },
      5: { name: '2B', type: 'in', gate: 1, arg: 1, desc: 'Gate 2 Input B' },
      6: { name: '2Y', type: 'out', gate: 1, desc: 'Gate 2 Output Y (Open-Collector)' },
      7: { name: 'GND', type: 'gnd', desc: 'Ground Reference (0V)' },
      8: { name: '3Y', type: 'out', gate: 2, desc: 'Gate 3 Output Y (Open-Collector)' },
      9: { name: '3A', type: 'in', gate: 2, arg: 0, desc: 'Gate 3 Input A' },
      10: { name: '3B', type: 'in', gate: 2, arg: 1, desc: 'Gate 3 Input B' },
      11: { name: '4Y', type: 'out', gate: 3, desc: 'Gate 4 Output Y (Open-Collector)' },
      12: { name: '4A', type: 'in', gate: 3, arg: 0, desc: 'Gate 4 Input A' },
      13: { name: '4B', type: 'in', gate: 3, arg: 1, desc: 'Gate 4 Input B' },
      14: { name: 'VCC', type: 'vcc', desc: 'Positive Supply (+5V)' },
    },
    gates: [
      { inputs: [1, 2], output: 3, fn: (a, b) => (a === 'Z' || b === 'Z' ? 'Z' : a === b ? 1 : 0) },
      { inputs: [4, 5], output: 6, fn: (a, b) => (a === 'Z' || b === 'Z' ? 'Z' : a === b ? 1 : 0) },
      { inputs: [9, 10], output: 8, fn: (a, b) => (a === 'Z' || b === 'Z' ? 'Z' : a === b ? 1 : 0) },
      { inputs: [12, 13], output: 11, fn: (a, b) => (a === 'Z' || b === 'Z' ? 'Z' : a === b ? 1 : 0) },
    ],
  },

  '74138': {
    name: '74138 3-to-8 Line Decoder / Demultiplexer',
    package: '16-Pin DIP',
    pins: 16,
    vccPin: 16,
    gndPin: 8,
    pinout: {
      1: { name: 'A', type: 'in', desc: 'Address Select Input A (LSB)' },
      2: { name: 'B', type: 'in', desc: 'Address Select Input B' },
      3: { name: 'C', type: 'in', desc: 'Address Select Input C (MSB)' },
      4: { name: 'G2A̅', type: 'in', desc: 'Active-LOW Enable Input 2A' },
      5: { name: 'G2B̅', type: 'in', desc: 'Active-LOW Enable Input 2B' },
      6: { name: 'G1', type: 'in', desc: 'Active-HIGH Enable Input 1' },
      7: { name: 'Y7̅', type: 'out', desc: 'Active-LOW Output 7' },
      8: { name: 'GND', type: 'gnd', desc: 'Ground Reference (0V)' },
      9: { name: 'Y6̅', type: 'out', desc: 'Active-LOW Output 6' },
      10: { name: 'Y5̅', type: 'out', desc: 'Active-LOW Output 5' },
      11: { name: 'Y4̅', type: 'out', desc: 'Active-LOW Output 4' },
      12: { name: 'Y3̅', type: 'out', desc: 'Active-LOW Output 3' },
      13: { name: 'Y2̅', type: 'out', desc: 'Active-LOW Output 2' },
      14: { name: 'Y1̅', type: 'out', desc: 'Active-LOW Output 1' },
      15: { name: 'Y0̅', type: 'out', desc: 'Active-LOW Output 0' },
      16: { name: 'VCC', type: 'vcc', desc: 'Positive Supply (+5V)' },
    },
    evaluate: function (inputs: Record<number, 0 | 1 | 'Z'>) {
      const g1 = inputs[6];
      const g2a = inputs[4];
      const g2b = inputs[5];

      // Definite disable: g1 is 0 or either g2a or g2b is 1
      if (g1 === 0 || g2a === 1 || g2b === 1) {
        // When disabled, all active-LOW outputs are HIGH (1) per datasheet
        return { 15: 1, 14: 1, 13: 1, 12: 1, 11: 1, 10: 1, 9: 1, 7: 1 };
      }

      // If enable pins are floating or undetermined
      if (g1 === 'Z' || g2a === 'Z' || g2b === 'Z') {
        return { 15: 'Z', 14: 'Z', 13: 'Z', 12: 'Z', 11: 'Z', 10: 'Z', 9: 'Z', 7: 'Z' };
      }

      // Enabled condition: G1 = 1 AND G2A̅ = 0 AND G2B̅ = 0
      const a = inputs[1];
      const b = inputs[2];
      const c = inputs[3];

      if (a === 'Z' || b === 'Z' || c === 'Z') {
        return { 15: 'Z', 14: 'Z', 13: 'Z', 12: 'Z', 11: 'Z', 10: 'Z', 9: 'Z', 7: 'Z' };
      }

      const sel = ((c as number) << 2) | ((b as number) << 1) | (a as number);
      // Active-LOW outputs: selected output is 0, all others are 1
      const outPins: Record<number, number> = {
        0: 15, // Y0
        1: 14, // Y1
        2: 13, // Y2
        3: 12, // Y3
        4: 11, // Y4
        5: 10, // Y5
        6: 9,  // Y6
        7: 7,  // Y7
      };

      const result: Record<number, 0 | 1 | 'Z'> = {
        15: 1, 14: 1, 13: 1, 12: 1, 11: 1, 10: 1, 9: 1, 7: 1,
      };
      const activePin = outPins[sel];
      if (activePin) {
        result[activePin] = 0;
      }
      return result;
    },
  },
};
