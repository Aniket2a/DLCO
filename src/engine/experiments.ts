import { Experiment } from '../types';

export const EXPERIMENTS: Record<string, Experiment> = {
  // =========================================================================
  // THE 11 OFFICIAL DLCO EXAM PRACTICALS
  // =========================================================================

  exam1: {
    id: 'exam1',
    number: 1,
    category: 'exam',
    title: '1. Realize a Full Adder using Logic Gates',
    aim: 'To design, construct, and verify the truth table of a 1-bit Full Adder using IC 7486 (XOR), IC 7408 (AND), and IC 7432 (OR).',
    requiredIcs: ['7486', '7408', '7432'],
    socketLayout: { U1: '7486', U2: '7408', U3: '7432' },
    inputsDesc: 'Input Switches: S1 = A, S2 = B, S3 = Cin',
    outputsDesc: 'Output LEDs: L1 = SUM, L2 = CARRY_OUT',
    instructions: [
      '1. Insert IC 7486 (XOR) into U1, IC 7408 (AND) into U2, IC 7432 (OR) into U3.',
      '2. Power connections: Wire Pin 14 of U1, U2, U3 to VCC (+5V rail). Wire Pin 7 of U1, U2, U3 to GND.',
      '3. First XOR Gate (Half Sum): Wire Switch S1 (A) to U1 Pin 1; Switch S2 (B) to U1 Pin 2.',
      '4. Second XOR Gate (Final Sum): Wire U1 Pin 3 (A⊕B) to U1 Pin 4; Switch S3 (Cin) to U1 Pin 5.',
      '5. Wire U1 Pin 6 (SUM) to Output LED L1 (Terminal OP1).',
      '6. First AND Gate (A·B): Wire S1 (A) to U2 Pin 1; S2 (B) to U2 Pin 2.',
      '7. Second AND Gate (Cin·(A⊕B)): Wire U1 Pin 3 (A⊕B) to U2 Pin 4; S3 (Cin) to U2 Pin 5.',
      '8. OR Gate (Final Carry): Wire U2 Pin 3 to U3 Pin 1; U2 Pin 6 to U3 Pin 2.',
      '9. Wire U3 Pin 3 (CARRY) to Output LED L2 (Terminal OP2).',
    ],
    truthTable: [
      { A: 0, B: 0, Cin: 0, SUM: 0, CARRY: 0 },
      { A: 0, B: 0, Cin: 1, SUM: 1, CARRY: 0 },
      { A: 0, B: 1, Cin: 0, SUM: 1, CARRY: 0 },
      { A: 0, B: 1, Cin: 1, SUM: 0, CARRY: 1 },
      { A: 1, B: 0, Cin: 0, SUM: 1, CARRY: 0 },
      { A: 1, B: 0, Cin: 1, SUM: 0, CARRY: 1 },
      { A: 1, B: 1, Cin: 0, SUM: 0, CARRY: 1 },
      { A: 1, B: 1, Cin: 1, SUM: 1, CARRY: 1 },
    ],
    referenceWires: [
      { from: 'vcc:1', to: 'U1:p14' }, { from: 'gnd:1', to: 'U1:p7' },
      { from: 'vcc:3', to: 'U2:p14' }, { from: 'gnd:3', to: 'U2:p7' },
      { from: 'vcc:5', to: 'U3:p14' }, { from: 'gnd:5', to: 'U3:p7' },
      { from: 'in:1', to: 'U1:p1' }, { from: 'in:2', to: 'U1:p2' },
      { from: 'U1:p3', to: 'U1:p4' }, { from: 'in:3', to: 'U1:p5' },
      { from: 'U1:p6', to: 'out:1' },
      { from: 'in:1', to: 'U2:p1' }, { from: 'in:2', to: 'U2:p2' },
      { from: 'U1:p3', to: 'U2:p4' }, { from: 'in:3', to: 'U2:p5' },
      { from: 'U2:p3', to: 'U3:p1' }, { from: 'U2:p6', to: 'U3:p2' },
      { from: 'U3:p3', to: 'out:2' },
    ],
    viva: [
      { q: 'What is a Full Adder?', a: 'A combinational logic circuit that computes the arithmetic sum of three binary bits: augend A, addend B, and carry-in Cin.' },
      { q: 'What are the Boolean equations for Full Adder SUM and CARRY?', a: 'SUM = A ⊕ B ⊕ Cin; CARRY = (A · B) + (Cin · (A ⊕ B)).' },
      { q: 'How many Half Adders are needed to make a Full Adder?', a: 'Two Half Adders and one OR gate.' },
      { q: 'Why is IC 7486 used?', a: 'IC 7486 contains Quad 2-input XOR gates, calculating modulo-2 addition.' },
    ],
  },

  exam2: {
    id: 'exam2',
    number: 2,
    category: 'exam',
    title: '2. Design and implement a 3-bit parity generator and checker',
    aim: 'To design and implement a 3-bit parity generator (Even/Odd) and parity checker using IC 7486 (XOR) and IC 7404 (NOT).',
    requiredIcs: ['7486', '7404'],
    socketLayout: { U1: '7486', U2: '7404' },
    inputsDesc: 'Data Bits: S3 = D2, S2 = D1, S1 = D0; Transmission Parity Bit: S4 = P_in',
    outputsDesc: 'Output LEDs: L1 = Generated Even Parity, L2 = Generated Odd Parity, L3 = Parity Error Flag',
    instructions: [
      '1. Insert IC 7486 into U1 and IC 7404 into U2. Connect Pin 14 of both to VCC and Pin 7 of both to GND.',
      '2. Parity Generator: Wire S3 (D2) to U1 Pin 1; S2 (D1) to U1 Pin 2. Wire U1 Pin 3 (D2⊕D1) to U1 Pin 4.',
      '3. Wire S1 (D0) to U1 Pin 5. Output U1 Pin 6 is the Even Parity Bit (P_even = D2⊕D1⊕D0).',
      '4. Connect U1 Pin 6 to LED L1 (OP1) for Even Parity output.',
      '5. Wire U1 Pin 6 to U2 Pin 1 (NOT gate). Wire U2 Pin 2 to LED L2 (OP2) for Odd Parity output.',
      '6. Parity Checker: Wire U1 Pin 6 to U1 Pin 9; wire Switch S4 (Received Parity Bit) to U1 Pin 10.',
      '7. Wire U1 Pin 8 (Error Check = DataParity ⊕ ReceivedParity) to LED L3 (OP3). L3 lights up (1) if parity error is detected!',
    ],
    truthTable: [
      { D2: 0, D1: 0, D0: 0, P_Even: 0, P_Odd: 1 },
      { D2: 0, D1: 0, D0: 1, P_Even: 1, P_Odd: 0 },
      { D2: 0, D1: 1, D0: 0, P_Even: 1, P_Odd: 0 },
      { D2: 0, D1: 1, D0: 1, P_Even: 0, P_Odd: 1 },
      { D2: 1, D1: 0, D0: 0, P_Even: 1, P_Odd: 0 },
      { D2: 1, D1: 0, D0: 1, P_Even: 0, P_Odd: 1 },
      { D2: 1, D1: 1, D0: 0, P_Even: 0, P_Odd: 1 },
      { D2: 1, D1: 1, D0: 1, P_Even: 1, P_Odd: 0 },
    ],
    referenceWires: [
      { from: 'vcc:1', to: 'U1:p14' }, { from: 'gnd:1', to: 'U1:p7' },
      { from: 'vcc:3', to: 'U2:p14' }, { from: 'gnd:3', to: 'U2:p7' },
      { from: 'in:3', to: 'U1:p1' }, { from: 'in:2', to: 'U1:p2' },
      { from: 'U1:p3', to: 'U1:p4' }, { from: 'in:1', to: 'U1:p5' },
      { from: 'U1:p6', to: 'out:1' },
      { from: 'U1:p6', to: 'U2:p1' }, { from: 'U2:p2', to: 'out:2' },
      { from: 'U1:p6', to: 'U1:p9' }, { from: 'in:4', to: 'U1:p10' },
      { from: 'U1:p8', to: 'out:3' },
    ],
    viva: [
      { q: 'What is a parity bit and why is it used?', a: 'An extra bit appended to binary data to ensure the total number of 1s is either even or odd, enabling single-bit error detection.' },
      { q: 'What is the expression for 3-bit even parity generation?', a: 'P = D2 ⊕ D1 ⊕ D0.' },
      { q: 'How does the parity checker detect errors?', a: 'It computes the XOR sum of the received data bits and received parity bit. A non-zero result flags a transmission error.' },
    ],
  },

  exam3: {
    id: 'exam3',
    number: 3,
    category: 'exam',
    title: '3. Design and implement a 4-bit BCD-to-Excess-3 code converter',
    aim: 'To design and implement a 4-bit BCD (8421) to Excess-3 code converter using IC 7483 (4-bit binary adder).',
    requiredIcs: ['7483'],
    socketLayout: { U1: '7483' },
    inputsDesc: 'BCD Inputs: S4 = B3 (MSB), S3 = B2, S2 = B1, S1 = B0 (LSB)',
    outputsDesc: 'Excess-3 Outputs: L4 = E3 (MSB), L3 = E2, L2 = E1, L1 = E0 (LSB)',
    instructions: [
      '1. Insert IC 7483 into Socket U1. Wire Pin 5 to VCC (+5V) and Pin 12 to GND (0V).',
      '2. Connect BCD inputs to Operand A of 7483: S4 (B3) -> Pin 1 (A4); S3 (B2) -> Pin 3 (A3); S2 (B1) -> Pin 8 (A2); S1 (B0) -> Pin 10 (A1).',
      '3. Set Operand B to constant 3 (binary 0011): B4 (Pin 16) -> GND; B3 (Pin 4) -> GND; B2 (Pin 7) -> VCC; B1 (Pin 11) -> VCC.',
      '4. Connect Carry Input C0 (Pin 13) to GND (0V).',
      '5. Connect Excess-3 outputs to LEDs: S4 (Pin 15) -> LED L4 (E3); S3 (Pin 2) -> LED L3 (E2); S2 (Pin 6) -> LED L2 (E1); S1 (Pin 9) -> LED L1 (E0).',
      '6. Test all 10 valid BCD values (0000 to 1001) and observe Excess-3 output (0011 to 1100).',
    ],
    truthTable: [
      { BCD_Dec: 0, B3: 0, B2: 0, B1: 0, B0: 0, E3: 0, E2: 0, E1: 1, E0: 1, Excess3_Dec: 3 },
      { BCD_Dec: 1, B3: 0, B2: 0, B1: 0, B0: 1, E3: 0, E2: 1, E0: 0, E1: 0, Excess3_Dec: 4 },
      { BCD_Dec: 2, B3: 0, B2: 0, B1: 1, B0: 0, E3: 0, E2: 1, E1: 0, E0: 1, Excess3_Dec: 5 },
      { BCD_Dec: 3, B3: 0, B2: 0, B1: 1, B0: 1, E3: 0, E2: 1, E1: 1, E0: 0, Excess3_Dec: 6 },
      { BCD_Dec: 4, B3: 0, B2: 1, B0: 0, B1: 0, E3: 0, E2: 1, E1: 1, E0: 1, Excess3_Dec: 7 },
      { BCD_Dec: 5, B3: 0, B2: 1, B1: 0, B0: 1, E3: 1, E2: 0, E1: 0, E0: 0, Excess3_Dec: 8 },
      { BCD_Dec: 6, B3: 0, B2: 1, B1: 1, B0: 0, E3: 1, E2: 0, E1: 0, E0: 1, Excess3_Dec: 9 },
      { BCD_Dec: 7, B3: 0, B2: 1, B1: 1, B0: 1, E3: 1, E2: 0, E1: 1, E0: 0, Excess3_Dec: 10 },
      { BCD_Dec: 8, B3: 1, B2: 0, B1: 0, B0: 0, E3: 1, E2: 0, E1: 1, E0: 1, Excess3_Dec: 11 },
      { BCD_Dec: 9, B3: 1, B2: 0, B1: 0, B0: 1, E3: 1, E2: 1, E1: 0, E0: 0, Excess3_Dec: 12 },
    ],
    referenceWires: [
      { from: 'vcc:1', to: 'U1:p5' }, { from: 'gnd:1', to: 'U1:p12' },
      { from: 'in:4', to: 'U1:p1' },   // A4 = B3
      { from: 'in:3', to: 'U1:p3' },   // A3 = B2
      { from: 'in:2', to: 'U1:p8' },   // A2 = B1
      { from: 'in:1', to: 'U1:p10' },  // A1 = B0
      { from: 'gnd:2', to: 'U1:p16' }, // B4 = 0
      { from: 'gnd:2', to: 'U1:p4' },  // B3 = 0
      { from: 'vcc:2', to: 'U1:p7' },  // B2 = 1
      { from: 'vcc:2', to: 'U1:p11' }, // B1 = 1
      { from: 'gnd:3', to: 'U1:p13' }, // C0 = 0
      { from: 'U1:p15', to: 'out:4' }, // S4 -> L4
      { from: 'U1:p2', to: 'out:3' },  // S3 -> L3
      { from: 'U1:p6', to: 'out:2' },  // S2 -> L2
      { from: 'U1:p9', to: 'out:1' },  // S1 -> L1
    ],
    viva: [
      { q: 'Why is Excess-3 called an unweighted code?', a: 'Because the bit positions do not possess specific positional weights like 8-4-2-1.' },
      { q: 'Why is Excess-3 known as a self-complementing code?', a: 'Because the 9s complement of a decimal digit is directly obtained by inverting (1s complement) its Excess-3 codeword.' },
      { q: 'How does IC 7483 implement BCD to Excess-3 conversion?', a: 'By adding binary 0011 (decimal 3) to the input 4-bit BCD word.' },
    ],
  },

  exam4: {
    id: 'exam4',
    number: 4,
    category: 'exam',
    title: '4. Implement a BCD adder using IC 7483',
    aim: 'To construct and test a 1-digit BCD Adder using IC 7483 (4-bit binary adder), IC 7408 (AND), and IC 7432 (OR).',
    requiredIcs: ['7483', '7408', '7432'],
    socketLayout: { U1: '7483', U2: '7408', U3: '7432' },
    inputsDesc: 'Input Switches: S4..S1 = BCD Operand A (A3..A0); S8..S5 = BCD Operand B (B3..B0)',
    outputsDesc: 'Output LEDs: L4..L1 = BCD Sum (S3..S0); L5 = BCD Carry Out',
    instructions: [
      '1. Insert IC 7483 (U1, Adder), IC 7408 (U2, AND), and IC 7432 (U3, OR). Connect VCC and GND.',
      '   Note: For 7483 (U1), Pin 5 is VCC and Pin 12 is GND. For 7408 and 7432, Pin 14 is VCC and Pin 7 is GND.',
      '2. Wire Operand A (S4..S1) to U1: S4->p1 (A4), S3->p3 (A3), S2->p8 (A2), S1->p10 (A1).',
      '3. Wire Operand B (S8..S5) to U1: S8->p16 (B4), S7->p4 (B3), S6->p7 (B2), S5->p11 (B1).',
      '4. Connect initial carry C0 (U1 Pin 13) to GND (0V).',
      '5. BCD Correction Logic: Correction needed when binary Sum > 9, which occurs when Cout (p14) OR (S4·S3) OR (S4·S2) is 1.',
      '   - AND Gate 1: U1 Pin 15 (S4) to U2 Pin 1; U1 Pin 2 (S3) to U2 Pin 2. (Produces S4·S3 on Pin 3).',
      '   - AND Gate 2: U1 Pin 15 (S4) to U2 Pin 4; U1 Pin 6 (S2) to U2 Pin 5. (Produces S4·S2 on Pin 6).',
      '   - OR Gate 1: U2 Pin 3 to U3 Pin 1; U2 Pin 6 to U3 Pin 2. (Produces (S4·S3)+(S4·S2) on Pin 3).',
      '   - OR Gate 2: U3 Pin 3 to U3 Pin 4; U1 Pin 14 (C4) to U3 Pin 5. (Produces final BCD Carry K on Pin 6).',
      '6. Wire U3 Pin 6 (BCD Carry Out) to LED L5 (OP5).',
      '7. Wire outputs S1..S4 to Output LEDs L1..L4.',
    ],
    truthTable: [
      { A: '0010 (2)', B: '0011 (3)', Sum: '0101 (5)', BCD_Carry: 0, Valid: 'Normal' },
      { A: '0101 (5)', B: '0100 (4)', Sum: '1001 (9)', BCD_Carry: 0, Valid: 'Normal' },
      { A: '0110 (6)', B: '0111 (7)', Sum: '0011 (3)', BCD_Carry: 1, Valid: 'Corrected (+6)' },
      { A: '1000 (8)', B: '1001 (9)', Sum: '0111 (7)', BCD_Carry: 1, Valid: 'Corrected (+6)' },
    ],
    referenceWires: [
      { from: 'vcc:1', to: 'U1:p5' }, { from: 'gnd:1', to: 'U1:p12' },
      { from: 'vcc:3', to: 'U2:p14' }, { from: 'gnd:3', to: 'U2:p7' },
      { from: 'vcc:5', to: 'U3:p14' }, { from: 'gnd:5', to: 'U3:p7' },
      // Operand A
      { from: 'in:4', to: 'U1:p1' }, { from: 'in:3', to: 'U1:p3' },
      { from: 'in:2', to: 'U1:p8' }, { from: 'in:1', to: 'U1:p10' },
      // Operand B
      { from: 'in:8', to: 'U1:p16' }, { from: 'in:7', to: 'U1:p4' },
      { from: 'in:6', to: 'U1:p7' }, { from: 'in:5', to: 'U1:p11' },
      { from: 'gnd:2', to: 'U1:p13' }, // C0 = 0
      // Sum outputs
      { from: 'U1:p9', to: 'out:1' },  // S1 -> L1
      { from: 'U1:p6', to: 'out:2' },  // S2 -> L2
      { from: 'U1:p2', to: 'out:3' },  // S3 -> L3
      { from: 'U1:p15', to: 'out:4' }, // S4 -> L4
      // Carry correction logic
      { from: 'U1:p15', to: 'U2:p1' }, { from: 'U1:p2', to: 'U2:p2' },
      { from: 'U1:p15', to: 'U2:p4' }, { from: 'U1:p6', to: 'U2:p5' },
      { from: 'U2:p3', to: 'U3:p1' }, { from: 'U2:p6', to: 'U3:p2' },
      { from: 'U3:p3', to: 'U3:p4' }, { from: 'U1:p14', to: 'U3:p5' },
      { from: 'U3:p6', to: 'out:5' }, // BCD Carry Out
    ],
    viva: [
      { q: 'Why is binary addition of BCD numbers not always valid BCD?', a: 'Binary addition produces values up to 19 (including carry), whereas single BCD digits only range from 0 to 9. Intermediate states 1010 to 1111 are illegal BCD.' },
      { q: 'What is the correction rule in BCD addition?', a: 'When the binary sum exceeds 9 (or generates a binary carry), binary 0110 (decimal 6) must be added to skip the 6 invalid states.' },
      { q: 'What is the condition equation for BCD carry generation?', a: 'C_BCD = Cout + (S3 · S2) + (S3 · S1).' },
    ],
  },

  exam5: {
    id: 'exam5',
    number: 5,
    category: 'exam',
    title: '5. Design and implement a Full Adder using multiplexer IC 74153',
    aim: 'To design, construct, and verify a 1-bit Full Adder using Dual 4-to-1 Multiplexer IC 74153 and Hex Inverter IC 7404.',
    requiredIcs: ['74153', '7404'],
    socketLayout: { U1: '74153', U2: '7404' },
    inputsDesc: 'Input Switches: S2 = A (Select S1), S1 = B (Select S0), S3 = Cin',
    outputsDesc: 'Output LEDs: L1 = SUM (from 1Y), L2 = CARRY (from 2Y)',
    instructions: [
      '1. Insert IC 74153 into U1 and IC 7404 into U2. Connect VCC (Pin 16 on U1, Pin 14 on U2) and GND (Pin 8 on U1, Pin 7 on U2).',
      '2. Enable both MUX sections by connecting active-LOW strobes 1G̅ (Pin 1) and 2G̅ (Pin 15) to GND (0V).',
      '3. Connect inputs A and B to shared Select lines: Switch S2 (A) -> Pin 2 (B / S1); Switch S1 (B) -> Pin 14 (A / S0).',
      '4. Generate Cin̅: Wire Switch S3 (Cin) to U2 Pin 1 (NOT gate). Inverted output Cin̅ is at U2 Pin 2.',
      '5. MUX 1 (SUM = A ⊕ B ⊕ Cin):',
      '   - When AB=00: SUM = Cin. Wire S3 (Cin) -> U1 Pin 6 (1C0).',
      '   - When AB=01: SUM = Cin̅. Wire U2 Pin 2 (Cin̅) -> U1 Pin 5 (1C1).',
      '   - When AB=10: SUM = Cin̅. Wire U2 Pin 2 (Cin̅) -> U1 Pin 4 (1C2).',
      '   - When AB=11: SUM = Cin. Wire S3 (Cin) -> U1 Pin 3 (1C3).',
      '   - Connect U1 Pin 7 (1Y, SUM) to LED L1 (Terminal OP1).',
      '6. MUX 2 (CARRY = AB + BCin + ACin):',
      '   - When AB=00: CARRY = 0. Wire GND -> U1 Pin 10 (2C0).',
      '   - When AB=01: CARRY = Cin. Wire S3 (Cin) -> U1 Pin 11 (2C1).',
      '   - When AB=10: CARRY = Cin. Wire S3 (Cin) -> U1 Pin 12 (2C2).',
      '   - When AB=11: CARRY = 1. Wire VCC -> U1 Pin 13 (2C3).',
      '   - Connect U1 Pin 9 (2Y, CARRY) to LED L2 (Terminal OP2).',
      '7. Toggle S1 (B), S2 (A), and S3 (Cin) through all 8 binary combinations and verify the Full Adder truth table.',
    ],
    truthTable: [
      { A: 0, B: 0, Cin: 0, SUM: 0, CARRY: 0 },
      { A: 0, B: 0, Cin: 1, SUM: 1, CARRY: 0 },
      { A: 0, B: 1, Cin: 0, SUM: 1, CARRY: 0 },
      { A: 0, B: 1, Cin: 1, SUM: 0, CARRY: 1 },
      { A: 1, B: 0, Cin: 0, SUM: 1, CARRY: 0 },
      { A: 1, B: 0, Cin: 1, SUM: 0, CARRY: 1 },
      { A: 1, B: 1, Cin: 0, SUM: 0, CARRY: 1 },
      { A: 1, B: 1, Cin: 1, SUM: 1, CARRY: 1 },
    ],
    referenceWires: [
      { from: 'vcc:1', to: 'U1:p16' }, { from: 'gnd:1', to: 'U1:p8' },
      { from: 'vcc:3', to: 'U2:p14' }, { from: 'gnd:3', to: 'U2:p7' },
      { from: 'gnd:2', to: 'U1:p1' },  // 1G' = 0
      { from: 'gnd:2', to: 'U1:p15' }, // 2G' = 0
      // Select lines
      { from: 'in:2', to: 'U1:p2' },   // S1 = A
      { from: 'in:1', to: 'U1:p14' },  // S0 = B
      // Cin inverter
      { from: 'in:3', to: 'U2:p1' },   // Cin to NOT
      // MUX 1 (SUM)
      { from: 'in:3', to: 'U1:p6' },   // 1C0 = Cin
      { from: 'U2:p2', to: 'U1:p5' },  // 1C1 = Cin'
      { from: 'U2:p2', to: 'U1:p4' },  // 1C2 = Cin'
      { from: 'in:3', to: 'U1:p3' },   // 1C3 = Cin
      { from: 'U1:p7', to: 'out:1' },  // 1Y -> L1
      // MUX 2 (CARRY)
      { from: 'gnd:4', to: 'U1:p10' }, // 2C0 = 0
      { from: 'in:3', to: 'U1:p11' },  // 2C1 = Cin
      { from: 'in:3', to: 'U1:p12' },  // 2C2 = Cin
      { from: 'vcc:4', to: 'U1:p13' }, // 2C3 = 1
      { from: 'U1:p9', to: 'out:2' },  // 2Y -> L2
    ],
    viva: [
      { q: 'What is IC 74153?', a: 'A dual 4-line to 1-line data selector / multiplexer containing two separate 4:1 multiplexers sharing common select lines S0 and S1.' },
      { q: 'Why is IC 74153 well-suited for realizing a Full Adder?', a: 'Because a Full Adder has two outputs (SUM and CARRY). Both outputs can be synthesized simultaneously in a single 74153 package.' },
      { q: 'What is the role of active-LOW enable pins 1G̅ and 2G̅?', a: 'When LOW (0), normal multiplexing occurs. When HIGH (1), the output is disabled and forced LOW.' },
    ],
  },

  exam6: {
    id: 'exam6',
    number: 6,
    category: 'exam',
    title: '6. 3-bit UP Asynchronous Counter using master-slave JK flip-flop IC 7476',
    aim: 'To design, construct, and verify a 3-bit Asynchronous (Ripple) Up Counter (counts 000 to 111) using two IC 7476 master-slave JK flip-flops.',
    requiredIcs: ['7476', '7476'],
    socketLayout: { U1: '7476', U2: '7476' },
    inputsDesc: 'Clock: Manual Pulser (clk:pulse) or continuous Clock (clk:main). Reset: PR and CLR tied to VCC.',
    outputsDesc: 'Output LEDs: L1 = QA (LSB, FF0), L2 = QB (FF1), L3 = QC (MSB, FF2)',
    instructions: [
      '1. Insert two IC 7476 chips into Sockets U1 and U2.',
      '2. Power connections (VERIFIED DATASHEET PINOUT): Connect Pin 16 of U1 & U2 to VCC (+5V rail). Connect Pin 8 of U1 & U2 to GND (0V rail).',
      '3. Disable asynchronous inputs: Connect active-LOW PRE̅ and CLR̅ to VCC (+5V):',
      '   - U1: Wire Pin 4 (1PRE̅), Pin 5 (1CLR̅), Pin 12 (2PRE̅), Pin 11 (2CLR̅) to VCC.',
      '   - U2: Wire Pin 4 (1PRE̅), Pin 5 (1CLR̅) to VCC.',
      '4. Configure Toggle Mode (J=1, K=1) for all 3 flip-flops:',
      '   - U1 FF0: Wire Pin 3 (1J) and Pin 2 (1K) to VCC.',
      '   - U1 FF1: Wire Pin 13 (2J) and Pin 14 (2K) to VCC.',
      '   - U2 FF2: Wire Pin 3 (1J) and Pin 2 (1K) to VCC.',
      '5. Ripple Clock Connections for Negative-Edge Triggered UP Counting:',
      '   - Connect Clock source (clk:pulse or clk:main) to U1 Pin 1 (1CLK).',
      '   - Connect U1 Pin 6 (1Q, QA) to LED L1 (OP1) AND to U1 Pin 15 (2CLK).',
      '   - Connect U1 Pin 10 (2Q, QB) to LED L2 (OP2) AND to U2 Pin 1 (1CLK).',
      '   - Connect U2 Pin 6 (1Q, QC) to LED L3 (OP3).',
      '6. Press the PULSER button and verify the counting sequence: 000 -> 001 -> 010 -> 011 -> 100 -> 101 -> 110 -> 111 -> 000.',
    ],
    truthTable: [
      { Pulse: 0, QC: 0, QB: 0, QA: 0, Decimal: 0 },
      { Pulse: 1, QC: 0, QB: 0, QA: 1, Decimal: 1 },
      { Pulse: 2, QC: 0, QB: 1, QA: 0, Decimal: 2 },
      { Pulse: 3, QC: 0, QB: 1, QA: 1, Decimal: 3 },
      { Pulse: 4, QC: 1, QB: 0, QA: 0, Decimal: 4 },
      { Pulse: 5, QC: 1, QB: 0, QA: 1, Decimal: 5 },
      { Pulse: 6, QC: 1, QB: 1, QA: 0, Decimal: 6 },
      { Pulse: 7, QC: 1, QB: 1, QA: 1, Decimal: 7 },
      { Pulse: 8, QC: 0, QB: 0, QA: 0, Decimal: 0 },
    ],
    referenceWires: [
      // Power rails: Pin 16 = VCC, Pin 8 = GND
      { from: 'vcc:1', to: 'U1:p16' }, { from: 'gnd:1', to: 'U1:p8' },
      { from: 'vcc:3', to: 'U2:p16' }, { from: 'gnd:3', to: 'U2:p8' },
      // PRE and CLR tied HIGH (inactive)
      { from: 'vcc:2', to: 'U1:p4' }, { from: 'vcc:2', to: 'U1:p5' },
      { from: 'vcc:2', to: 'U1:p12' }, { from: 'vcc:2', to: 'U1:p11' },
      { from: 'vcc:4', to: 'U2:p4' }, { from: 'vcc:4', to: 'U2:p5' },
      // J and K tied HIGH for Toggle mode
      { from: 'vcc:5', to: 'U1:p3' }, { from: 'vcc:5', to: 'U1:p2' },
      { from: 'vcc:5', to: 'U1:p13' }, { from: 'vcc:5', to: 'U1:p14' },
      { from: 'vcc:6', to: 'U2:p3' }, { from: 'vcc:6', to: 'U2:p2' },
      // Clock & Ripple cascading
      { from: 'clk:pulse', to: 'U1:p1' },
      { from: 'U1:p6', to: 'out:1' },  // QA -> L1
      { from: 'U1:p6', to: 'U1:p15' }, // QA clocks FF1
      { from: 'U1:p10', to: 'out:2' }, // QB -> L2
      { from: 'U1:p10', to: 'U2:p1' }, // QB clocks FF2
      { from: 'U2:p6', to: 'out:3' },  // QC -> L3
    ],
    viva: [
      { q: 'Why is IC 7476 called a Master-Slave flip-flop?', a: 'It consists of two internal stages: the master responds to the input while clock is HIGH, and the slave transfers the state to outputs on the falling edge of the clock.' },
      { q: 'What is the correct DIP pinout for VCC and GND on IC 7476?', a: 'Pin 16 is VCC (+5V) and Pin 8 is GND (0V).' },
      { q: 'Why does connecting Q to the clock of the next stage create an UP counter for negative-edge flip-flops?', a: 'Because Q transitions from 1 to 0 (a negative edge) only when the current stage changes from 1 to 0, dividing the frequency by 2 and producing an ascending binary sequence.' },
    ],
  },

  exam7: {
    id: 'exam7',
    number: 7,
    category: 'exam',
    title: '7. 3-bit DOWN Asynchronous Counter using master-slave JK flip-flop IC 7476',
    aim: 'To design, construct, and verify a 3-bit Asynchronous (Ripple) Down Counter (counts 111 to 000) using IC 7476.',
    requiredIcs: ['7476', '7476'],
    socketLayout: { U1: '7476', U2: '7476' },
    inputsDesc: 'Clock: Pulser or CLK. J, K, PRE̅, CLR̅ tied to VCC.',
    outputsDesc: 'Output LEDs: L1 = QA (LSB), L2 = QB, L3 = QC (MSB)',
    instructions: [
      '1. Insert two IC 7476 chips into Sockets U1 and U2. Connect Pin 16 to VCC and Pin 8 to GND on both.',
      '2. Disable PRE̅ and CLR̅ by connecting pins 4, 5, 12, 11 of U1 and pins 4, 5 of U2 to VCC (+5V).',
      '3. Set Toggle mode (J=1, K=1): connect pins 3, 2, 13, 14 of U1 and pins 3, 2 of U2 to VCC.',
      '4. Ripple Clock Connections for Negative-Edge Triggered DOWN Counting:',
      '   - Connect Clock source to U1 Pin 1 (1CLK).',
      '   - Wire Complementary Output 1Q̅ (U1 Pin 7) to clock the next stage: U1 Pin 15 (2CLK).',
      '   - Wire Complementary Output 2Q̅ (U1 Pin 9) to clock the third stage: U2 Pin 1 (1CLK).',
      '5. Connect True Outputs Q to LEDs: U1 Pin 6 (1Q) -> LED L1 (QA); U1 Pin 10 (2Q) -> LED L2 (QB); U2 Pin 6 (1Q) -> LED L3 (QC).',
      '6. Verify down counting sequence: 111 -> 110 -> 101 -> 100 -> 011 -> 010 -> 001 -> 000 -> 111.',
    ],
    truthTable: [
      { Pulse: 0, QC: 1, QB: 1, QA: 1, Decimal: 7 },
      { Pulse: 1, QC: 1, QB: 1, QA: 0, Decimal: 6 },
      { Pulse: 2, QC: 1, QB: 0, QA: 1, Decimal: 5 },
      { Pulse: 3, QC: 1, QB: 0, QA: 0, Decimal: 4 },
      { Pulse: 4, QC: 0, QB: 1, QA: 1, Decimal: 3 },
      { Pulse: 5, QC: 0, QB: 1, QA: 0, Decimal: 2 },
      { Pulse: 6, QC: 0, QB: 0, QA: 1, Decimal: 1 },
      { Pulse: 7, QC: 0, QB: 0, QA: 0, Decimal: 0 },
      { Pulse: 8, QC: 1, QB: 1, QA: 1, Decimal: 7 },
    ],
    referenceWires: [
      { from: 'vcc:1', to: 'U1:p16' }, { from: 'gnd:1', to: 'U1:p8' },
      { from: 'vcc:3', to: 'U2:p16' }, { from: 'gnd:3', to: 'U2:p8' },
      // PRE and CLR tied HIGH
      { from: 'vcc:2', to: 'U1:p4' }, { from: 'vcc:2', to: 'U1:p5' },
      { from: 'vcc:2', to: 'U1:p12' }, { from: 'vcc:2', to: 'U1:p11' },
      { from: 'vcc:4', to: 'U2:p4' }, { from: 'vcc:4', to: 'U2:p5' },
      // J and K tied HIGH
      { from: 'vcc:5', to: 'U1:p3' }, { from: 'vcc:5', to: 'U1:p2' },
      { from: 'vcc:5', to: 'U1:p13' }, { from: 'vcc:5', to: 'U1:p14' },
      { from: 'vcc:6', to: 'U2:p3' }, { from: 'vcc:6', to: 'U2:p2' },
      // Clock input to FF0
      { from: 'clk:pulse', to: 'U1:p1' },
      // Outputs read from Q
      { from: 'U1:p6', to: 'out:1' },  // QA -> L1
      { from: 'U1:p10', to: 'out:2' }, // QB -> L2
      { from: 'U2:p6', to: 'out:3' },  // QC -> L3
      // Down counting ripple: Q_bar clocks the next stage!
      { from: 'U1:p7', to: 'U1:p15' }, // 1Q' clocks FF1
      { from: 'U1:p9', to: 'U2:p1' },  // 2Q' clocks FF2
    ],
    viva: [
      { q: 'How does clocking from Q̅ produce a Down counter?', a: 'When Q goes from 0 to 1, Q̅ undergoes a falling transition (1 to 0), which triggers the negative-edge clock of the subsequent flip-flop, creating a decremental count sequence.' },
      { q: 'What is another way to convert an Up counter to a Down counter?', a: 'By clocking from Q but observing the output signals from Q̅ instead of Q.' },
    ],
  },

  exam8: {
    id: 'exam8',
    number: 8,
    category: 'exam',
    title: '8. 3-bit DOWN Synchronous Counter using master-slave JK flip-flop IC 7476',
    aim: 'To design, construct, and verify a 3-bit Synchronous Down Counter using common clocking with IC 7476 and IC 7408 (AND gate).',
    requiredIcs: ['7476', '7476', '7408'],
    socketLayout: { U1: '7476', U2: '7476', U3: '7408' },
    inputsDesc: 'Clock: Common Clock to all flip-flops (clk:pulse).',
    outputsDesc: 'Output LEDs: L1 = QA (LSB), L2 = QB, L3 = QC (MSB)',
    instructions: [
      '1. Insert U1: 7476, U2: 7476, and U3: 7408 (AND gate). Connect Pin 16 of U1, U2 to VCC and Pin 8 to GND. Connect Pin 14 of U3 to VCC and Pin 7 to GND.',
      '2. Disable PRE̅ and CLR̅ on U1 and U2 by tying them to VCC (+5V).',
      '3. COMMON CLOCK: Connect Clock (clk:pulse) simultaneously to all 3 flip-flops: U1 Pin 1 (1CLK), U1 Pin 15 (2CLK), and U2 Pin 1 (1CLK).',
      '4. Synchronous Down Excitation Logic:',
      '   - FF0: T0 = 1. Wire U1 Pin 3 (1J) and Pin 2 (1K) to VCC (+5V).',
      '   - FF1: T1 = QA̅. Wire U1 Pin 7 (1Q̅) to U1 Pin 13 (2J) and Pin 14 (2K).',
      '   - FF2: T2 = QA̅ · QB̅. Wire U1 Pin 7 (1Q̅) to U3 Pin 1; U1 Pin 9 (2Q̅) to U3 Pin 2. Wire AND output U3 Pin 3 to U2 Pin 3 (1J) and Pin 2 (1K).',
      '5. Connect true outputs Q to LEDs: U1 Pin 6 (1Q) -> L1 (QA); U1 Pin 10 (2Q) -> L2 (QB); U2 Pin 6 (1Q) -> L3 (QC).',
      '6. Verify synchronous down-counting: 111 -> 110 -> 101 -> 100 -> 011 -> 010 -> 001 -> 000 -> 111.',
    ],
    truthTable: [
      { Pulse: 0, QC: 1, QB: 1, QA: 1, Dec: 7 },
      { Pulse: 1, QC: 1, QB: 1, QA: 0, Dec: 6 },
      { Pulse: 2, QC: 1, QB: 0, QA: 1, Dec: 5 },
      { Pulse: 3, QC: 1, QB: 0, QA: 0, Dec: 4 },
      { Pulse: 4, QC: 0, QB: 1, QA: 1, Dec: 3 },
      { Pulse: 5, QC: 0, QB: 1, QA: 0, Dec: 2 },
      { Pulse: 6, QC: 0, QB: 0, QA: 1, Dec: 1 },
      { Pulse: 7, QC: 0, QB: 0, QA: 0, Dec: 0 },
      { Pulse: 8, QC: 1, QB: 1, QA: 1, Dec: 7 },
    ],
    referenceWires: [
      { from: 'vcc:1', to: 'U1:p16' }, { from: 'gnd:1', to: 'U1:p8' },
      { from: 'vcc:3', to: 'U2:p16' }, { from: 'gnd:3', to: 'U2:p8' },
      { from: 'vcc:5', to: 'U3:p14' }, { from: 'gnd:5', to: 'U3:p7' },
      // PRE and CLR tied HIGH
      { from: 'vcc:2', to: 'U1:p4' }, { from: 'vcc:2', to: 'U1:p5' },
      { from: 'vcc:2', to: 'U1:p12' }, { from: 'vcc:2', to: 'U1:p11' },
      { from: 'vcc:4', to: 'U2:p4' }, { from: 'vcc:4', to: 'U2:p5' },
      // COMMON CLOCK to all 3 stages
      { from: 'clk:pulse', to: 'U1:p1' },
      { from: 'clk:pulse', to: 'U1:p15' },
      { from: 'clk:pulse', to: 'U2:p1' },
      // FF0: J=1, K=1
      { from: 'vcc:6', to: 'U1:p3' }, { from: 'vcc:6', to: 'U1:p2' },
      // FF1: J=QA', K=QA'
      { from: 'U1:p7', to: 'U1:p13' }, { from: 'U1:p7', to: 'U1:p14' },
      // FF2: J=QA'*QB', K=QA'*QB' via 7408 AND gate
      { from: 'U1:p7', to: 'U3:p1' }, { from: 'U1:p9', to: 'U3:p2' },
      { from: 'U3:p3', to: 'U2:p3' }, { from: 'U3:p3', to: 'U2:p2' },
      // Outputs
      { from: 'U1:p6', to: 'out:1' },  // QA -> L1
      { from: 'U1:p10', to: 'out:2' }, // QB -> L2
      { from: 'U2:p6', to: 'out:3' },  // QC -> L3
    ],
    viva: [
      { q: 'What is the main advantage of a synchronous counter over an asynchronous counter?', a: 'In synchronous counters, all flip-flops trigger simultaneously on the common clock edge, eliminating cumulative ripple delay and preventing decoding glitches.' },
      { q: 'What are the excitation equations for a 3-bit synchronous DOWN counter?', a: 'T0 = 1; T1 = QA̅; T2 = QA̅ · QB̅.' },
    ],
  },

  exam9: {
    id: 'exam9',
    number: 9,
    category: 'exam',
    title: '9. 3-bit UP Synchronous Counter using master-slave JK flip-flop IC 7476',
    aim: 'To design, construct, and verify a 3-bit Synchronous Up Counter using common clocking with IC 7476 and IC 7408 (AND gate).',
    requiredIcs: ['7476', '7476', '7408'],
    socketLayout: { U1: '7476', U2: '7476', U3: '7408' },
    inputsDesc: 'Clock: Common Clock to all flip-flops (clk:pulse).',
    outputsDesc: 'Output LEDs: L1 = QA (LSB), L2 = QB, L3 = QC (MSB)',
    instructions: [
      '1. Insert U1: 7476, U2: 7476, and U3: 7408 (AND gate). Connect VCC and GND.',
      '2. Disable PRE̅ and CLR̅ on U1 and U2 by connecting them to VCC (+5V).',
      '3. COMMON CLOCK: Connect Clock (clk:pulse) to U1 Pin 1 (1CLK), U1 Pin 15 (2CLK), and U2 Pin 1 (1CLK).',
      '4. Synchronous Up Excitation Logic:',
      '   - FF0: T0 = 1. Connect U1 Pin 3 (1J) and Pin 2 (1K) to VCC (+5V).',
      '   - FF1: T1 = QA. Connect U1 Pin 6 (1Q, QA) to U1 Pin 13 (2J) and Pin 14 (2K).',
      '   - FF2: T2 = QA · QB. Connect U1 Pin 6 (QA) to U3 Pin 1; U1 Pin 10 (QB) to U3 Pin 2.',
      '     Connect AND gate output U3 Pin 3 (QA·QB) to U2 Pin 3 (1J) and Pin 2 (1K).',
      '5. Connect outputs Q to LEDs: U1 Pin 6 -> L1 (QA); U1 Pin 10 -> L2 (QB); U2 Pin 6 -> L3 (QC).',
      '6. Verify synchronous up-counting sequence: 000 -> 001 -> 010 -> 011 -> 100 -> 101 -> 110 -> 111 -> 000.',
    ],
    truthTable: [
      { Pulse: 0, QC: 0, QB: 0, QA: 0, Dec: 0 },
      { Pulse: 1, QC: 0, QB: 0, QA: 1, Dec: 1 },
      { Pulse: 2, QC: 0, QB: 1, QA: 0, Dec: 2 },
      { Pulse: 3, QC: 0, QB: 1, QA: 1, Dec: 3 },
      { Pulse: 4, QC: 1, QB: 0, QA: 0, Dec: 4 },
      { Pulse: 5, QC: 1, QB: 0, QA: 1, Dec: 5 },
      { Pulse: 6, QC: 1, QB: 1, QA: 0, Dec: 6 },
      { Pulse: 7, QC: 1, QB: 1, QA: 1, Dec: 7 },
      { Pulse: 8, QC: 0, QB: 0, QA: 0, Dec: 0 },
    ],
    referenceWires: [
      { from: 'vcc:1', to: 'U1:p16' }, { from: 'gnd:1', to: 'U1:p8' },
      { from: 'vcc:3', to: 'U2:p16' }, { from: 'gnd:3', to: 'U2:p8' },
      { from: 'vcc:5', to: 'U3:p14' }, { from: 'gnd:5', to: 'U3:p7' },
      // PRE and CLR tied HIGH
      { from: 'vcc:2', to: 'U1:p4' }, { from: 'vcc:2', to: 'U1:p5' },
      { from: 'vcc:2', to: 'U1:p12' }, { from: 'vcc:2', to: 'U1:p11' },
      { from: 'vcc:4', to: 'U2:p4' }, { from: 'vcc:4', to: 'U2:p5' },
      // COMMON CLOCK to all 3 stages
      { from: 'clk:pulse', to: 'U1:p1' },
      { from: 'clk:pulse', to: 'U1:p15' },
      { from: 'clk:pulse', to: 'U2:p1' },
      // FF0: J=1, K=1
      { from: 'vcc:6', to: 'U1:p3' }, { from: 'vcc:6', to: 'U1:p2' },
      // FF1: J=QA, K=QA
      { from: 'U1:p6', to: 'U1:p13' }, { from: 'U1:p6', to: 'U1:p14' },
      // FF2: J=QA*QB, K=QA*QB via 7408 AND gate
      { from: 'U1:p6', to: 'U3:p1' }, { from: 'U1:p10', to: 'U3:p2' },
      { from: 'U3:p3', to: 'U2:p3' }, { from: 'U3:p3', to: 'U2:p2' },
      // Outputs
      { from: 'U1:p6', to: 'out:1' },  // QA -> L1
      { from: 'U1:p10', to: 'out:2' }, // QB -> L2
      { from: 'U2:p6', to: 'out:3' },  // QC -> L3
    ],
    viva: [
      { q: 'What is the maximum operating frequency of a synchronous counter?', a: 'f_max = 1 / (t_pd + t_gate), where t_pd is flip-flop propagation delay and t_gate is the delay of the AND gate. This is much faster than an N-stage ripple counter.' },
      { q: 'What are the excitation equations for a 3-bit synchronous UP counter?', a: 'T0 = 1; T1 = QA; T2 = QA · QB.' },
    ],
  },

  exam10: {
    id: 'exam10',
    number: 10,
    category: 'exam',
    title: '10. Design and implement a MOD-45 counter using decade counter IC 7490',
    aim: 'To design, construct, and verify a 2-digit MOD-45 Counter (counting 00 to 44 and resetting to 00 at count 45) using two IC 7490 decade counters and IC 7408 (AND gate).',
    requiredIcs: ['7490', '7490', '7408'],
    socketLayout: { U1: '7490', U2: '7490', U3: '7408' },
    inputsDesc: 'Clock: clk:pulse to U1 (Units counter). U2 (Tens counter) is cascaded from U1.',
    outputsDesc: 'Display: Units on 7-Segment A (A3..A0) & LEDs L4..L1; Tens on 7-Segment B (B3..B0) & LEDs L8..L5',
    instructions: [
      '1. Insert U1: 7490 (Units), U2: 7490 (Tens), and U3: 7408 (AND gate). Connect Pin 5 of U1 & U2 to VCC and Pin 10 to GND. Connect Pin 14 of U3 to VCC and Pin 7 to GND.',
      '2. Configure both 7490s as BCD Decade Counters: Connect QA (Pin 12) to CKB (Pin 1) on both U1 and U2.',
      '3. Tie R9(1) (Pin 6) and R9(2) (Pin 7) to GND on both U1 and U2.',
      '4. Cascade Units to Tens: Connect Units QD (U1 Pin 11) to Tens clock input CKA (U2 Pin 14).',
      '5. Connect Clock: Connect clk:pulse to Units CKA (U1 Pin 14).',
      '6. MOD-45 Reset Condition: Counter must reset when Tens = 4 (QC=1) AND Units = 5 (QC=1 AND QA=1).',
      '   - AND Gate 1: Tens QC (U2 Pin 8) to U3 Pin 1; Units QC (U1 Pin 8) to U3 Pin 2. (Produces Tens_QC · Units_QC on Pin 3).',
      '   - AND Gate 2: U3 Pin 3 to U3 Pin 4; Units QA (U1 Pin 12) to U3 Pin 5. (Produces Reset Pulse on Pin 6).',
      '   - Connect U3 Pin 6 (Reset Pulse) to R0(1) and R0(2) on both U1 (Pins 2, 3) and U2 (Pins 2, 3).',
      '7. Wire Units QA..QD to 7-Segment A (seg:a0..a3) and Tens QA..QD to 7-Segment B (seg:b0..b3).',
      '8. Pulse the clock and observe the display count from 00 to 44, then seamlessly roll over to 00 on the 45th pulse!',
    ],
    truthTable: [
      { State: 'Initial', Tens: '0 (0000)', Units: '0 (0000)', TotalCount: '00' },
      { State: 'Counting', Tens: '0 to 4', Units: '0 to 9', TotalCount: '00 to 44' },
      { State: 'At Count 45', Tens: '4 (QC=1)', Units: '5 (QC=1, QA=1)', Reset: 'Instantaneous Reset to 00' },
    ],
    referenceWires: [
      // Power rails
      { from: 'vcc:1', to: 'U1:p5' }, { from: 'gnd:1', to: 'U1:p10' },
      { from: 'vcc:3', to: 'U2:p5' }, { from: 'gnd:3', to: 'U2:p10' },
      { from: 'vcc:5', to: 'U3:p14' }, { from: 'gnd:5', to: 'U3:p7' },
      // Decade cascade QA -> CKB
      { from: 'U1:p12', to: 'U1:p1' },
      { from: 'U2:p12', to: 'U2:p1' },
      // R9 set pins grounded
      { from: 'gnd:2', to: 'U1:p6' }, { from: 'gnd:2', to: 'U1:p7' },
      { from: 'gnd:4', to: 'U2:p6' }, { from: 'gnd:4', to: 'U2:p7' },
      // Clocking
      { from: 'clk:pulse', to: 'U1:p14' }, // Clock into Units
      { from: 'U1:p11', to: 'U2:p14' },   // Units QD clocks Tens CKA
      // MOD-45 Reset logic: Tens QC (p8) AND Units QC (p8) AND Units QA (p12)
      { from: 'U2:p8', to: 'U3:p1' },
      { from: 'U1:p8', to: 'U3:p2' },
      { from: 'U3:p3', to: 'U3:p4' },
      { from: 'U1:p12', to: 'U3:p5' },
      // U3:p6 is the Reset Pulse -> connect to R0(1) and R0(2) of U1 and U2
      { from: 'U3:p6', to: 'U1:p2' }, { from: 'U3:p6', to: 'U1:p3' },
      { from: 'U3:p6', to: 'U2:p2' }, { from: 'U3:p6', to: 'U2:p3' },
      // Outputs to 7-Segment A (Units) and B (Tens)
      { from: 'U1:p12', to: 'seg:a0' }, { from: 'U1:p9', to: 'seg:a1' },
      { from: 'U1:p8', to: 'seg:a2' }, { from: 'U1:p11', to: 'seg:a3' },
      { from: 'U2:p12', to: 'seg:b0' }, { from: 'U2:p9', to: 'seg:b1' },
      { from: 'U2:p8', to: 'seg:b2' }, { from: 'U2:p11', to: 'seg:b3' },
      // Outputs to LEDs
      { from: 'U1:p12', to: 'out:1' }, { from: 'U1:p9', to: 'out:2' },
      { from: 'U1:p8', to: 'out:3' }, { from: 'U1:p11', to: 'out:4' },
      { from: 'U2:p12', to: 'out:5' }, { from: 'U2:p9', to: 'out:6' },
      { from: 'U2:p8', to: 'out:7' }, { from: 'U2:p11', to: 'out:8' },
    ],
    viva: [
      { q: 'How many states does a MOD-45 counter have?', a: '45 states, specifically from count 00 up to count 44.' },
      { q: 'Why are two 7490 ICs required?', a: 'A single 7490 can count a maximum of 10 states (0 to 9). Cascading two chips allows counting up to 100 states (00 to 99), which can be truncated to MOD-45 using reset gating.' },
      { q: 'What is the binary state for decimal 45 across both counters?', a: 'Tens = 4 (QD=0, QC=1, QB=0, QA=0) and Units = 5 (QD=0, QC=1, QB=0, QA=1).' },
    ],
  },

  exam11: {
    id: 'exam11',
    number: 11,
    category: 'exam',
    title: '11. Design and implement a MOD-16 counter using decade counter IC 7490',
    aim: 'To design, construct, and verify a 2-digit MOD-16 Counter (counting 00 to 15 and resetting at 16) using two IC 7490 decade counters and IC 7408 (AND gate).',
    requiredIcs: ['7490', '7490', '7408'],
    socketLayout: { U1: '7490', U2: '7490', U3: '7408' },
    inputsDesc: 'Clock: clk:pulse into U1 (Units). U2 (Tens) cascaded from U1.',
    outputsDesc: 'Display: Units on 7-Segment A & LEDs L1..L4; Tens on 7-Segment B & LEDs L5..L8',
    instructions: [
      '1. Insert U1: 7490 (Units), U2: 7490 (Tens), and U3: 7408 (AND gate). Connect Pin 5 of U1 & U2 to VCC and Pin 10 to GND. Connect Pin 14 of U3 to VCC and Pin 7 to GND.',
      '2. Configure both 7490s as BCD Decade Counters: Connect QA (Pin 12) to CKB (Pin 1) on both U1 and U2.',
      '3. Tie R9(1) (Pin 6) and R9(2) (Pin 7) to GND on both U1 and U2.',
      '4. Cascade Units to Tens: Connect Units QD (U1 Pin 11) to Tens CKA (U2 Pin 14). Connect clk:pulse to Units CKA (U1 Pin 14).',
      '5. MOD-16 Reset Condition: The counter counts 00 to 15 and must reset at 16 (Tens QA = 1; Units QB = 1 and QC = 1).',
      '   - AND Gate 1: Units QB (U1 Pin 9) to U3 Pin 1; Units QC (U1 Pin 8) to U3 Pin 2. (Produces Units_6 on Pin 3).',
      '   - AND Gate 2: U3 Pin 3 to U3 Pin 4; Tens QA (U2 Pin 12) to U3 Pin 5. (Produces Reset Pulse for 16 on Pin 6).',
      '   - Connect U3 Pin 6 (Reset Pulse) to R0(1) and R0(2) on both U1 (Pins 2, 3) and U2 (Pins 2, 3).',
      '6. Wire Units to 7-Segment A (seg:a0..a3) and Tens to 7-Segment B (seg:b0..b3).',
      '7. Pulse the clock and observe the display count from 00 to 15, then reset back to 00 on the 16th pulse!',
    ],
    truthTable: [
      { State: 'Initial', Tens: '0 (0000)', Units: '0 (0000)', TotalCount: '00' },
      { State: 'Counting', Tens: '0 to 1', Units: '0 to 9', TotalCount: '00 to 15' },
      { State: 'At Count 16', Tens: '1 (QA=1)', Units: '6 (QC=1, QB=1)', Reset: 'Instantaneous Reset to 00' },
    ],
    referenceWires: [
      // Power rails
      { from: 'vcc:1', to: 'U1:p5' }, { from: 'gnd:1', to: 'U1:p10' },
      { from: 'vcc:3', to: 'U2:p5' }, { from: 'gnd:3', to: 'U2:p10' },
      { from: 'vcc:5', to: 'U3:p14' }, { from: 'gnd:5', to: 'U3:p7' },
      // QA -> CKB
      { from: 'U1:p12', to: 'U1:p1' },
      { from: 'U2:p12', to: 'U2:p1' },
      // R9 pins grounded
      { from: 'gnd:2', to: 'U1:p6' }, { from: 'gnd:2', to: 'U1:p7' },
      { from: 'gnd:4', to: 'U2:p6' }, { from: 'gnd:4', to: 'U2:p7' },
      // Clocking
      { from: 'clk:pulse', to: 'U1:p14' },
      { from: 'U1:p11', to: 'U2:p14' },
      // Reset logic: Tens QA (p12) AND Units QC (p8) AND Units QB (p9)
      { from: 'U1:p9', to: 'U3:p1' },
      { from: 'U1:p8', to: 'U3:p2' },
      { from: 'U3:p3', to: 'U3:p4' },
      { from: 'U2:p12', to: 'U3:p5' },
      // Reset pulse to R0 inputs
      { from: 'U3:p6', to: 'U1:p2' }, { from: 'U3:p6', to: 'U1:p3' },
      { from: 'U3:p6', to: 'U2:p2' }, { from: 'U3:p6', to: 'U2:p3' },
      // Displays
      { from: 'U1:p12', to: 'seg:a0' }, { from: 'U1:p9', to: 'seg:a1' },
      { from: 'U1:p8', to: 'seg:a2' }, { from: 'U1:p11', to: 'seg:a3' },
      { from: 'U2:p12', to: 'seg:b0' }, { from: 'U2:p9', to: 'seg:b1' },
      { from: 'U2:p8', to: 'seg:b2' }, { from: 'U2:p11', to: 'seg:b3' },
      // LEDs
      { from: 'U1:p12', to: 'out:1' }, { from: 'U1:p9', to: 'out:2' },
      { from: 'U1:p8', to: 'out:3' }, { from: 'U1:p11', to: 'out:4' },
      { from: 'U2:p12', to: 'out:5' }, { from: 'U2:p9', to: 'out:6' },
    ],
    viva: [
      { q: 'How many states are in a MOD-16 counter?', a: '16 states (0 to 15, or 00 to 15 in BCD decimal).' },
      { q: 'What is the reset condition for MOD-16 in BCD?', a: 'When Tens = 1 (QA=1) and Units = 6 (QC=1 and QB=1), triggering the master reset R0(1)=R0(2)=1.' },
    ],
  },

  // =========================================================================
  // ADDITIONAL PRESERVED CURRICULUM PRACTICALS
  // =========================================================================

  labSubtractor: {
    id: 'labSubtractor',
    number: 12,
    category: 'additional',
    title: 'Full Subtractor (Difference & Borrow using XOR, NOT, AND, OR)',
    aim: 'To design, construct, and verify a 1-bit Full Subtractor using IC 7486 (XOR), IC 7404 (NOT), IC 7408 (AND), and IC 7432 (OR).',
    requiredIcs: ['7486', '7404', '7408', '7432'],
    socketLayout: { U1: '7486', U2: '7404', U3: '7408', U4: '7432' },
    inputsDesc: 'Input Switches: S1 = A (Minuend), S2 = B (Subtrahend), S3 = Bin (Borrow-in)',
    outputsDesc: 'Output LEDs: L1 = DIFFERENCE, L2 = BORROW_OUT',
    instructions: [
      '1. Insert U1: 7486, U2: 7404, U3: 7408, U4: 7432. Connect Pin 14 of all to VCC and Pin 7 of all to GND.',
      '2. Difference: S1(A) to U1:p1, S2(B) to U1:p2. U1:p3 to U1:p4; S3(Bin) to U1:p5. U1:p6 to LED L1 (DIFF).',
      '3. Invert A: Wire S1(A) to U2:p1. Output A̅ is at U2:p2.',
      '4. Borrow logic: U2:p2 (A̅) to U3:p1; S2(B) to U3:p2 (produces A̅·B on U3:p3).',
      '5. Invert (A⊕B): U1:p3 to U2:p3. Output (A⊕B)̅ is at U2:p4. Wire U2:p4 to U3:p4; S3(Bin) to U3:p5 (produces Bin·(A⊕B)̅ on U3:p6).',
      '6. OR Borrow terms: U3:p3 to U4:p1; U3:p6 to U4:p2. Wire U4:p3 (BORROW) to LED L2 (OP2).',
    ],
    truthTable: [
      { A: 0, B: 0, Bin: 0, DIFF: 0, BORROW: 0 },
      { A: 0, B: 0, Bin: 1, DIFF: 1, BORROW: 1 },
      { A: 0, B: 1, Bin: 0, DIFF: 1, BORROW: 1 },
      { A: 0, B: 1, Bin: 1, DIFF: 0, BORROW: 1 },
      { A: 1, B: 0, Bin: 0, DIFF: 1, BORROW: 0 },
      { A: 1, B: 0, Bin: 1, DIFF: 0, BORROW: 0 },
      { A: 1, B: 1, Bin: 0, DIFF: 0, BORROW: 0 },
      { A: 1, B: 1, Bin: 1, DIFF: 1, BORROW: 1 },
    ],
    referenceWires: [
      { from: 'vcc:1', to: 'U1:p14' }, { from: 'gnd:1', to: 'U1:p7' },
      { from: 'vcc:3', to: 'U2:p14' }, { from: 'gnd:3', to: 'U2:p7' },
      { from: 'vcc:5', to: 'U3:p14' }, { from: 'gnd:5', to: 'U3:p7' },
      { from: 'vcc:7', to: 'U4:p14' }, { from: 'gnd:7', to: 'U4:p7' },
      { from: 'in:1', to: 'U1:p1' }, { from: 'in:2', to: 'U1:p2' },
      { from: 'U1:p3', to: 'U1:p4' }, { from: 'in:3', to: 'U1:p5' },
      { from: 'U1:p6', to: 'out:1' },
      { from: 'in:1', to: 'U2:p1' },
      { from: 'U2:p2', to: 'U3:p1' }, { from: 'in:2', to: 'U3:p2' },
      { from: 'U1:p3', to: 'U2:p3' },
      { from: 'U2:p4', to: 'U3:p4' }, { from: 'in:3', to: 'U3:p5' },
      { from: 'U3:p3', to: 'U4:p1' }, { from: 'U3:p6', to: 'U4:p2' },
      { from: 'U4:p3', to: 'out:2' },
    ],
    viva: [
      { q: 'What is a Full Subtractor?', a: 'A combinational circuit that computes A - B - Bin, taking borrow-in into account.' },
      { q: 'What is the expression for Borrow Out?', a: 'Bout = A̅·B + Bin·(A ⊕ B)̅.' },
    ],
  },

  labGray3: {
    id: 'labGray3',
    number: 13,
    category: 'additional',
    title: '3-Bit Binary to Gray Code Converter',
    aim: 'To construct and test a 3-bit Binary to Gray Code Converter using IC 7486 (XOR gates).',
    requiredIcs: ['7486'],
    socketLayout: { U1: '7486' },
    inputsDesc: 'Input Switches: S3 = B2 (MSB), S2 = B1, S1 = B0 (LSB)',
    outputsDesc: 'Output LEDs: L3 = G2 (MSB), L2 = G1, L1 = G0 (LSB)',
    instructions: [
      '1. Insert IC 7486 into U1. Connect Pin 14 to VCC and Pin 7 to GND.',
      '2. G2 = B2: Wire S3 (B2) directly to LED L3 (Terminal OP3).',
      '3. G1 = B2 ⊕ B1: Wire S3 (B2) to U1 Pin 1; S2 (B1) to U1 Pin 2. Wire U1 Pin 3 to LED L2 (OP2).',
      '4. G0 = B1 ⊕ B0: Wire S2 (B1) to U1 Pin 4; S1 (B0) to U1 Pin 5. Wire U1 Pin 6 to LED L1 (OP1).',
    ],
    truthTable: [
      { B2: 0, B1: 0, B0: 0, G2: 0, G1: 0, G0: 0 },
      { B2: 0, B1: 0, B0: 1, G2: 0, G1: 0, G0: 1 },
      { B2: 0, B1: 1, B0: 0, G2: 0, G1: 1, G0: 1 },
      { B2: 0, B1: 1, B0: 1, G2: 0, G1: 1, G0: 0 },
      { B2: 1, B1: 0, B0: 0, G2: 1, G1: 1, G0: 0 },
      { B2: 1, B1: 0, B0: 1, G2: 1, G1: 1, G0: 1 },
      { B2: 1, B1: 1, B0: 0, G2: 1, G1: 0, G0: 1 },
      { B2: 1, B1: 1, B0: 1, G2: 1, G1: 0, G0: 0 },
    ],
    referenceWires: [
      { from: 'vcc:1', to: 'U1:p14' }, { from: 'gnd:1', to: 'U1:p7' },
      { from: 'in:3', to: 'out:3' },
      { from: 'in:3', to: 'U1:p1' }, { from: 'in:2', to: 'U1:p2' }, { from: 'U1:p3', to: 'out:2' },
      { from: 'in:2', to: 'U1:p4' }, { from: 'in:1', to: 'U1:p5' }, { from: 'U1:p6', to: 'out:1' },
    ],
    viva: [
      { q: 'What is a Gray code?', a: 'An unweighted binary code where two consecutive values differ in only one bit position (unit distance code).' },
      { q: 'Why is Gray code preferred in shaft position encoders?', a: 'It avoids transient false intermediate readings caused by multiple mechanical bits changing asynchronously.' },
    ],
  },

  labMux8to1: {
    id: 'labMux8to1',
    number: 14,
    category: 'additional',
    title: '8-to-1 Multiplexer Verification (IC 74151)',
    aim: 'To verify the data routing and truth table of 8-to-1 Multiplexer IC 74151.',
    requiredIcs: ['74151'],
    socketLayout: { U1: '74151' },
    inputsDesc: 'Select: S11=C, S10=B, S9=A; Strobe: S7=G̅; Data inputs: S1..S8 = D0..D7',
    outputsDesc: 'Output LEDs: L1 = True Y, L2 = Complementary W',
    instructions: [
      '1. Insert IC 74151 into U1. Connect Pin 16 to VCC and Pin 8 to GND.',
      '2. Connect Strobe G̅ (Pin 7) to GND (0V) to enable the multiplexer.',
      '3. Connect Select lines: S11 to Pin 9 (C); S10 to Pin 10 (B); S9 to Pin 11 (A).',
      '4. Connect Data lines D0..D7 to switches S1..S8 (D0=p4, D1=p3, D2=p2, D3=p1, D4=p15, D5=p14, D6=p13, D7=p12).',
      '5. Wire Output Pin 5 (Y) to LED L1 and Pin 6 (W) to LED L2.',
    ],
    truthTable: [
      { G: 1, C: 'X', B: 'X', A: 'X', Y: 0, W: 1 },
      { G: 0, C: 0, B: 0, A: 0, Y: 'D0', W: 'D0̅' },
      { G: 0, C: 0, B: 0, A: 1, Y: 'D1', W: 'D1̅' },
      { G: 0, C: 1, B: 1, A: 1, Y: 'D7', W: 'D7̅' },
    ],
    referenceWires: [
      { from: 'vcc:1', to: 'U1:p16' }, { from: 'gnd:1', to: 'U1:p8' },
      { from: 'gnd:2', to: 'U1:p7' },
      { from: 'in:11', to: 'U1:p9' }, { from: 'in:10', to: 'U1:p10' }, { from: 'in:9', to: 'U1:p11' },
      { from: 'in:1', to: 'U1:p4' }, { from: 'in:2', to: 'U1:p3' }, { from: 'in:3', to: 'U1:p2' }, { from: 'in:4', to: 'U1:p1' },
      { from: 'in:5', to: 'U1:p15' }, { from: 'in:6', to: 'U1:p14' }, { from: 'in:7', to: 'U1:p13' }, { from: 'in:8', to: 'U1:p12' },
      { from: 'U1:p5', to: 'out:1' }, { from: 'U1:p6', to: 'out:2' },
    ],
    viva: [
      { q: 'What is a multiplexer?', a: 'A combinational circuit that selects one of many input signals and forwards the selected input to a single output line.' },
      { q: 'What is the function of the Strobe G̅ input on IC 74151?', a: 'It is an active-LOW enable input. When HIGH (1), the output Y is forced LOW (0) and W is forced HIGH (1).' },
    ],
  },
};
