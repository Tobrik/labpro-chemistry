"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.balanceEquation = balanceEquation;
exports.getElementDetails = getElementDetails;
exports.compareSubstances = compareSubstances;
exports.solveProblem = solveProblem;
const generative_ai_1 = require("@google/generative-ai");
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is not set');
}
const genAI = new generative_ai_1.GoogleGenerativeAI(apiKey);
async function balanceEquation(equation) {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
    const prompt = `Balance this chemical equation: ${equation}

Return ONLY a JSON object with this exact structure:
{
  "balancedEquation": "the balanced equation",
  "explanation": "brief explanation of how it was balanced"
}`;
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
        throw new Error('Failed to parse response');
    }
    return JSON.parse(jsonMatch[0]);
}
async function getElementDetails(elementName) {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
    const prompt = `Provide detailed information about the chemical element: ${elementName}

Return ONLY a JSON object with this exact structure:
{
  "electronConfiguration": "electron configuration",
  "electronShells": "electron shell distribution",
  "oxidationStates": "common oxidation states",
  "meltingPoint": "melting point with units",
  "boilingPoint": "boiling point with units",
  "density": "density with units",
  "discoveryYear": "year of discovery",
  "description": "brief description"
}`;
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
        throw new Error('Failed to parse response');
    }
    return JSON.parse(jsonMatch[0]);
}
async function compareSubstances(substanceA, substanceB) {
    const model = genAI.getGenerativeModel({
        model: 'gemini-2.0-flash-exp',
    });
    const prompt = `Compare these two chemical substances: ${substanceA} and ${substanceB}

Provide a detailed comparison including:
- Chemical formulas
- Physical properties
- Chemical properties
- Common uses
- Key differences

Format the response in clear, readable text.`;
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    return { text };
}
async function solveProblem(problem) {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
    const prompt = `Solve this chemistry problem step by step: ${problem}

Provide:
1. Problem analysis
2. Step-by-step solution
3. Final answer
4. Brief explanation

Format the response in clear, readable text with proper formatting.`;
    const result = await model.generateContent(prompt);
    const solution = result.response.text();
    return { solution };
}
