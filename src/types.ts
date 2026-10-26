export type LogicLevel = 0 | 1 | 'Z' | 'CONFLICT';

export type TerminalType = 'in' | 'out' | 'clk' | 'vcc' | 'gnd' | 'nc';

export interface PinDefinition {
  name: string;
  type: TerminalType;
  gate?: number;
  arg?: number;
  desc?: string;
}

export interface GateDefinition {
  inputs: number[];
  output: number;
  fn: (...args: (0 | 1 | 'Z')[]) => 0 | 1 | 'Z';
}

export interface FlipFlopState {
  q: 0 | 1;
  qBar: 0 | 1;
  lastClk: 0 | 1 | 'Z';
  masterJ?: 0 | 1;
  masterK?: 0 | 1;
  unstable?: boolean;
}

export interface IC7476State {
  ff1: FlipFlopState;
  ff2: FlipFlopState;
}

export interface IC7490State {
  qa: 0 | 1;
  b5Count: number; // 0 to 4
  lastCka: 0 | 1 | 'Z';
  lastCkb: 0 | 1 | 'Z';
}

export interface ICDefinition {
  name: string;
  package: string;
  pins: number;
  vccPin: number;
  gndPin: number;
  pinout: Record<number, PinDefinition>;
  gates?: GateDefinition[];
  initInternalState?: () => any;
  evaluate?: (inputs: Record<number, 0 | 1 | 'Z'>) => Record<number, 0 | 1 | 'Z'>;
  evaluateSequential?: (
    state: any,
    inputs: Record<number, 0 | 1 | 'Z'>,
    isClockEdge?: boolean
  ) => Record<number, 0 | 1 | 'Z'>;
}

export interface Wire {
  id: number;
  from: string;
  to: string;
  color: string;
}

export interface SocketState {
  ic: string | null;
  icState: any | null;
  isPowered: boolean;
}

export interface TrainerState {
  mainsPower: boolean;
  zoom: number;
  wireColor: string;
  selectedTerminal: string | null;
  selectedWireId: number | null;
  nextWireId: number;
  switches: Record<number, 0 | 1>;
  sockets: Record<string, SocketState>;
  wires: Wire[];
  clock: {
    running: boolean;
    frequency: number; // in Hz: 0.1, 1, 10, 100, etc.
    state: 0 | 1;
    pulseCount: number;
  };
  pulser: {
    state: 0 | 1;
  };
  nets: Record<string, string>;
  netValues: Record<string, LogicLevel>;
  netDrivers: Record<string, Array<{ tid: string; val: 0 | 1; desc: string }>>;
  pinValues: Record<string, LogicLevel>;
}

export interface ExperimentViva {
  q: string;
  a: string;
}

export interface Experiment {
  id: string;
  number: number;
  category: 'exam' | 'additional';
  title: string;
  aim: string;
  requiredIcs: string[];
  socketLayout: Record<string, string>;
  inputsDesc: string;
  outputsDesc: string;
  instructions: string[];
  truthTable: Array<Record<string, any>>;
  referenceWires: Array<{ from: string; to: string }>;
  viva: ExperimentViva[];
  testValidator?: (runSolver: (switches: Record<number, 0 | 1>, pulseEvents?: number) => any) => { passed: boolean; message: string; details?: string[] };
}

export interface DiagnosticsReport {
  power: Array<{ type: 'ok' | 'warn' | 'err' | 'info'; msg: string }>;
  signal: Array<{ type: 'ok' | 'warn' | 'err' | 'info'; msg: string }>;
  nets: Array<{ type: 'ok' | 'warn' | 'err' | 'info'; msg: string }>;
  status: 'HEALTHY' | 'CHECK' | 'ERROR';
  summary: string;
}
