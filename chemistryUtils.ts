import { ATOMIC_MASSES } from './constants';

// --- Types ---
export interface ChemicalComponent {
  formula: string;
  coefficient: number;
  elements: Record<string, number>; // Element symbol -> count
}

export interface Reaction {
  reactants: ChemicalComponent[];
  products: ChemicalComponent[];
}

// --- Parsing Functions ---

export const parseFormula = (formula: string): Record<string, number> => {
  const elements: Record<string, number> = {};
  const regex = /([A-Z][a-z]*)(\d*)|(\()|(\))(\d*)/g;
  const stack: Record<string, number>[] = [elements];
  let match;

  while ((match = regex.exec(formula)) !== null) {
    if (match[1]) {
      const element = match[1];
      const count = match[2] ? parseInt(match[2]) : 1;
      const current = stack[stack.length - 1];
      current[element] = (current[element] || 0) + count;
    } else if (match[3]) {
      stack.push({});
    } else if (match[4]) {
      const group = stack.pop();
      const count = match[5] ? parseInt(match[5]) : 1;
      const current = stack[stack.length - 1];
      if (group) {
        for (const [el, val] of Object.entries(group)) {
          current[el] = (current[el] || 0) + val * count;
        }
      }
    }
  }
  return elements;
};

export const getMolarMass = (elements: Record<string, number>): number => {
  let mass = 0;
  for (const [el, count] of Object.entries(elements)) {
    mass += (ATOMIC_MASSES[el] || 0) * count;
  }
  return mass;
};

// --- Balancing Algorithm (Matrix Method / Gaussian Elimination) ---

export const balanceReaction = (equationStr: string): { balanced: string; error?: string; reaction?: Reaction } => {
  try {
    const parts = equationStr.split(/->|=|→/).map(s => s.trim());
    if (parts.length !== 2) throw new Error("Неверный формат уравнения");

    // Helper to extract coefficient and formula
    const extractCoeffAndFormula = (str: string): { coeff: number; formula: string } => {
      const match = str.match(/^(\d+)(.+)$/);
      if (match) {
        return { coeff: parseInt(match[1]), formula: match[2] };
      }
      return { coeff: 1, formula: str };
    };

    const reactantsStr = parts[0].split('+').map(s => s.trim()).filter(s => s);
    const productsStr = parts[1].split('+').map(s => s.trim()).filter(s => s);

    const allFormulae = [...reactantsStr, ...productsStr].map(f => extractCoeffAndFormula(f).formula);
    const allElements = new Set<string>();

    const reactionComponents: ChemicalComponent[] = allFormulae.map(f => {
      const els = parseFormula(f);
      Object.keys(els).forEach(e => allElements.add(e));
      return { formula: f, coefficient: 0, elements: els };
    });

    const elementList = Array.from(allElements);
    const matrix: number[][] = [];

    const reactantsFormulas = reactantsStr.map(s => extractCoeffAndFormula(s).formula);
    const productsFormulas = productsStr.map(s => extractCoeffAndFormula(s).formula);

    // Build Matrix
    for (const el of elementList) {
      const row: number[] = [];
      // Reactants (positive)
      for (let i = 0; i < reactantsFormulas.length; i++) {
        row.push(reactionComponents[i].elements[el] || 0);
      }
      // Products (negative)
      for (let i = 0; i < productsFormulas.length; i++) {
        row.push(-(reactionComponents[reactantsFormulas.length + i].elements[el] || 0));
      }
      matrix.push(row);
    }

    // Solve Matrix (Gaussian Elimination)
    // This is a simplified solver for integer solutions
    const result = solveMatrix(matrix);
    
    if (!result) throw new Error("Не удалось уравнять");

    // Assign coefficients
    let resIdx = 0;
    const balancedReactants = reactantsFormulas.map((f, i) => {
      const coef = result[resIdx++];
      return (coef > 1 ? coef : '') + f;
    });
    const balancedProducts = productsFormulas.map((f, i) => {
      const coef = result[resIdx++];
      return (coef > 1 ? coef : '') + f;
    });

    return {
      balanced: `${balancedReactants.join(' + ')} → ${balancedProducts.join(' + ')}`,
      reaction: {
        reactants: reactantsFormulas.map((f, i) => ({ ...reactionComponents[i], coefficient: result[i] })),
        products: productsFormulas.map((f, i) => ({ ...reactionComponents[reactantsFormulas.length + i], coefficient: result[reactantsFormulas.length + i] }))
      }
    };

  } catch (e: any) {
    return { balanced: "", error: e.message };
  }
};

function solveMatrix(matrix: number[][]): number[] | null {
  const rows = matrix.length;
  const cols = matrix[0].length;
  
  const maxCoef = 20; 
  const numVars = cols;
  
  const check = (coefs: number[]) => {
    for (let r = 0; r < rows; r++) {
      let sum = 0;
      for (let c = 0; c < cols; c++) {
        sum += matrix[r][c] * coefs[c];
      }
      if (sum !== 0) return false;
    }
    return true;
  };

  const generate = (index: number, currentCoefs: number[]): number[] | null => {
    if (index === numVars) {
      if (currentCoefs.every(c => c === 0)) return null; 
      return check(currentCoefs) ? currentCoefs : null;
    }
    
    for (let val = 1; val <= 12; val++) {
      currentCoefs[index] = val;
      if (index === numVars - 1) {
         if (check(currentCoefs)) return currentCoefs;
      } else {
         const res = generate(index + 1, currentCoefs);
         if (res) return res;
      }
    }
    return null;
  };
  
  if (cols <= 5) {
     const res = generate(0, new Array(cols).fill(1));
     if(res) return res;
  }
  
  return null;
}

// --- Oxidation State Estimator (Heuristic) ---
export const getOxidationStates = (formula: string): Record<string, number> => {
  const elements = parseFormula(formula);
  const result: Record<string, number> = {};
  const keys = Object.keys(elements);
  
  if (keys.length === 1) return { [keys[0]]: 0 }; 
  
  if (elements['O']) result['O'] = -2;
  if (elements['H']) result['H'] = 1;
  if (elements['F']) result['F'] = -1;
  ['Li', 'Na', 'K', 'Rb', 'Cs', 'Fr'].forEach(m => { if(elements[m]) result[m] = 1; });
  ['Be', 'Mg', 'Ca', 'Sr', 'Ba', 'Ra'].forEach(m => { if(elements[m]) result[m] = 2; });

  let knownCharge = 0;
  let unknownEl = '';
  let unknownCount = 0;
  
  for(const el of keys) {
    if(result[el] !== undefined) {
      knownCharge += result[el] * elements[el];
    } else {
      if(unknownEl) return result; 
      unknownEl = el;
      unknownCount = elements[el];
    }
  }
  
  if (unknownEl) {
    result[unknownEl] = -knownCharge / unknownCount;
  }
  
  return result;
};

// --- Kinetics Helpers ---
export const calculateConcentration = (order: number, c0: number, k: number, t: number): number => {
    if (order === 0) return Math.max(0, c0 - k * t);
    if (order === 1) return c0 * Math.exp(-k * t);
    if (order === 2) return c0 / (1 + k * t * c0);
    return 0;
};
