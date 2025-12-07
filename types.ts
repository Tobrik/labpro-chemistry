
export type NavItem = 'periodic-table' | 'reaction-balancer' | 'trainer' | 'solutions' | 'molar-mass' | 'ph' | 'formulas' | 'solver' | 'thermo' | 'kinetics' | 'molecules' | 'admin';

export type ElementCategory = 
  | 'non-metal' 
  | 'noble-gas' 
  | 'alkali-metal' 
  | 'alkaline-earth-metal' 
  | 'metalloid' 
  | 'halogen' 
  | 'transition-metal' 
  | 'post-transition-metal' 
  | 'lanthanide' 
  | 'actinide';

export interface ElementData {
  number: number;
  symbol: string;
  name: string; // Russian name
  mass: number;
  category: ElementCategory;
  group: number;
  period: number;
  density?: number; // g/cm3
  state?: 'solid' | 'liquid' | 'gas';
  history?: Array<{ year: string; event: string }>;
}

export interface DetailedElementData {
  electronConfiguration: string;
  electronShells: string;
  oxidationStates: string;
  meltingPoint: string;
  boilingPoint: string;
  density: string;
  discoveryYear: string;
  description: string;
}

export interface ComparisonResult {
  text: string;
  sources: Array<{ title: string; uri: string }>;
}

export interface BalancerResult {
  balancedEquation: string;
  explanation: string;
}

export interface SolverResult {
  solution: string;
}

export interface UserProfile {
  name: string;
  level: number;
  xp: number;
  achievements: string[];
}
