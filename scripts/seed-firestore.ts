/**
 * Seed script for populating Firestore with ALL local data.
 *
 * Usage:
 *   npx ts-node scripts/seed-firestore.ts
 *
 * Requires:
 *   - A Firebase service account JSON file (firebase-adminsdk-*.json) in project root
 *   - Or FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY env vars
 *   - Or .env file with these vars (loaded via dotenv)
 */

import * as admin from 'firebase-admin';
import * as path from 'path';

// Try to load .env from project root
try {
  require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
} catch {
  // dotenv not installed, skip
}

import { PERIODIC_ELEMENTS, ATOMIC_MASSES } from '../constants';
import { ELEMENT_NAMES } from '../constants-elements-i18n';

// Initialize Firebase Admin
const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;

if (serviceAccountPath) {
  const serviceAccount = require(serviceAccountPath);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
} else if (process.env.FIREBASE_PROJECT_ID) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
} else {
  console.error('No Firebase credentials found. Set GOOGLE_APPLICATION_CREDENTIALS or FIREBASE_* env vars.');
  process.exit(1);
}

const db = admin.firestore();

// ===== ELEMENTS (118 elements with i18n names) =====
async function seedElements() {
  console.log(`\n--- Seeding ${PERIODIC_ELEMENTS.length} elements...`);

  const batch = db.batch();

  for (const element of PERIODIC_ELEMENTS) {
    const docRef = db.collection('elements').doc(element.symbol);

    const names: Record<string, string> = {
      ru: (ELEMENT_NAMES.ru as Record<string, string>)[element.symbol] || element.name,
      en: (ELEMENT_NAMES.en as Record<string, string>)[element.symbol] || element.symbol,
      kk: (ELEMENT_NAMES.kk as Record<string, string>)[element.symbol] || element.name,
    };

    batch.set(docRef, {
      number: element.number,
      symbol: element.symbol,
      names,
      mass: element.mass,
      category: element.category,
      group: element.group,
      period: element.period,
      atomicMass: ATOMIC_MASSES[element.symbol] || element.mass,
    });
  }

  await batch.commit();
  console.log(`Done: ${PERIODIC_ELEMENTS.length} elements seeded`);
}

// ===== FORMULAS (full reference) =====
async function seedFormulas() {
  const formulas = [
    // Количество вещества
    { name: 'Через массу', equation: 'n = m / M', category: 'amount', description: 'n - моль, m - масса (г), M - молярная масса (г/моль)' },
    { name: 'Через объём', equation: 'n = V / Vm', category: 'amount', description: 'Vm = 22,4 л/моль при н.у.' },
    { name: 'Через число частиц', equation: 'n = N / Na', category: 'amount', description: 'Na = 6,022 * 10^23 моль^-1' },

    // Газовые законы
    { name: 'Уравнение Менделеева-Клапейрона', equation: 'PV = nRT', category: 'gas-laws', description: 'R = 8,314 Дж/(моль*К)' },
    { name: 'Закон Бойля-Мариотта', equation: 'P1*V1 = P2*V2', category: 'gas-laws', description: 'При постоянной температуре (T = const)' },
    { name: 'Закон Гей-Люссака', equation: 'V1/T1 = V2/T2', category: 'gas-laws', description: 'При постоянном давлении (P = const)' },

    // Растворы
    { name: 'Массовая доля', equation: 'w = m(в-ва) / m(р-ра) * 100%', category: 'solutions', description: 'w - массовая доля растворённого вещества' },
    { name: 'Молярная концентрация', equation: 'C = n / V', category: 'solutions', description: 'C - молярность (моль/л)' },
    { name: 'Плотность раствора', equation: 'p = m / V', category: 'solutions', description: 'p - плотность (г/мл)' },
    { name: 'Правило смешения', equation: 'm1/m2 = (w3 - w2) / (w1 - w3)', category: 'solutions', description: 'Для приготовления раствора нужной концентрации' },

    // Термодинамика и кинетика
    { name: 'Энтальпия реакции', equation: 'dH = SUM(H прод) - SUM(H реаг)', category: 'thermodynamics', description: 'Закон Гесса' },
    { name: 'Правило Вант-Гоффа', equation: 'v2 = v1 * y^((T2-T1)/10)', category: 'thermodynamics', description: 'y = 2-4' },
    { name: 'Водородный показатель', equation: 'pH = -lg[H+]', category: 'thermodynamics', description: 'pH < 7 кислая, pH = 7 нейтральная, pH > 7 щелочная' },

    // Теплота
    { name: 'Количество теплоты', equation: 'Q = c*m*dT', category: 'heat', description: 'c - удельная теплоёмкость, m - масса, dT - изменение температуры' },
    { name: 'Теплота сгорания', equation: 'Q = q*m', category: 'heat', description: 'q - удельная теплота сгорания (Дж/кг)' },

    // Электрохимия
    { name: 'Закон Фарадея', equation: 'm = (M*I*t) / (n*F)', category: 'electrochemistry', description: 'F = 96485 Кл/моль' },
    { name: 'Выход по току', equation: 'n = m(практ) / m(теор) * 100%', category: 'electrochemistry', description: 'Отношение реального выхода к теоретическому' },
    { name: 'Массовая доля металла', equation: 'w(Me) = (n*Ar(Me) / Mr(руды)) * 100%', category: 'electrochemistry', description: 'Содержание металла в руде' },

    // Стандартные энтальпии образования
    { name: 'H2O(l)', equation: '-285.8', category: 'enthalpy-data', description: 'Вода (жидкая), кДж/моль' },
    { name: 'H2O(g)', equation: '-241.8', category: 'enthalpy-data', description: 'Вода (газ), кДж/моль' },
    { name: 'CO2(g)', equation: '-393.5', category: 'enthalpy-data', description: 'Углекислый газ, кДж/моль' },
    { name: 'CO(g)', equation: '-110.5', category: 'enthalpy-data', description: 'Угарный газ, кДж/моль' },
    { name: 'NH3(g)', equation: '-45.9', category: 'enthalpy-data', description: 'Аммиак, кДж/моль' },
    { name: 'NO2(g)', equation: '+33.2', category: 'enthalpy-data', description: 'Диоксид азота, кДж/моль' },
    { name: 'SO2(g)', equation: '-296.8', category: 'enthalpy-data', description: 'Диоксид серы, кДж/моль' },
    { name: 'SO3(g)', equation: '-395.7', category: 'enthalpy-data', description: 'Триоксид серы, кДж/моль' },
    { name: 'HCl(g)', equation: '-92.3', category: 'enthalpy-data', description: 'Хлороводород, кДж/моль' },
    { name: 'NaCl(s)', equation: '-411.2', category: 'enthalpy-data', description: 'Хлорид натрия, кДж/моль' },
    { name: 'CaCO3(s)', equation: '-1206.9', category: 'enthalpy-data', description: 'Карбонат кальция, кДж/моль' },
    { name: 'Fe2O3(s)', equation: '-824.2', category: 'enthalpy-data', description: 'Оксид железа(III), кДж/моль' },
    { name: 'Al2O3(s)', equation: '-1675.7', category: 'enthalpy-data', description: 'Оксид алюминия, кДж/моль' },
    { name: 'CH4(g)', equation: '-74.8', category: 'enthalpy-data', description: 'Метан, кДж/моль' },
    { name: 'C2H5OH(l)', equation: '-277.7', category: 'enthalpy-data', description: 'Этанол (жидкий), кДж/моль' },
    { name: 'C6H12O6(s)', equation: '-1273.3', category: 'enthalpy-data', description: 'Глюкоза, кДж/моль' },
  ];

  console.log(`\n--- Seeding ${formulas.length} formulas...`);

  // Delete existing formulas first
  const existing = await db.collection('formulas').get();
  if (!existing.empty) {
    const deleteBatch = db.batch();
    existing.docs.forEach(doc => deleteBatch.delete(doc.ref));
    await deleteBatch.commit();
    console.log(`  Deleted ${existing.size} existing formulas`);
  }

  const batch = db.batch();
  for (const formula of formulas) {
    const docRef = db.collection('formulas').doc();
    batch.set(docRef, {
      ...formula,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  }

  await batch.commit();
  console.log(`Done: ${formulas.length} formulas seeded`);
}

// ===== MAIN =====
async function main() {
  console.log('Starting Firestore seed...');
  console.log(`  Project: ${process.env.FIREBASE_PROJECT_ID || '(from service account)'}`);

  try {
    await seedElements();
    await seedFormulas();

    console.log('\nAll data seeded successfully!');
    console.log('  - 118 elements (with ru/en/kk names + atomic masses)');
    console.log('  - 35 formulas (amount, gas-laws, solutions, thermo, electrochem, enthalpy data)');
    process.exit(0);
  } catch (error) {
    console.error('\nSeeding failed:', error);
    process.exit(1);
  }
}

main();
