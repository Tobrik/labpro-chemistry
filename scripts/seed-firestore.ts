/**
 * Seed script for populating Firestore with element data.
 *
 * Usage:
 *   npx ts-node scripts/seed-firestore.ts
 *
 * Requires:
 *   - A Firebase service account JSON file (firebase-adminsdk-*.json) in project root
 *   - Or FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY env vars
 */

import * as admin from 'firebase-admin';
import { PERIODIC_ELEMENTS } from '../constants';
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

async function seedElements() {
  console.log(`Seeding ${PERIODIC_ELEMENTS.length} elements to Firestore...`);

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
    });
  }

  await batch.commit();
  console.log('Successfully seeded all elements!');
}

async function seedFormulas() {
  console.log('Seeding sample formulas...');

  const formulas = [
    { name: 'Закон Бойля-Мариотта', equation: 'P₁V₁ = P₂V₂', category: 'gas-laws' },
    { name: 'Закон Гей-Люссака', equation: 'V₁/T₁ = V₂/T₂', category: 'gas-laws' },
    { name: 'Уравнение Менделеева-Клапейрона', equation: 'PV = nRT', category: 'gas-laws' },
    { name: 'Количество вещества', equation: 'n = m/M', category: 'amount' },
    { name: 'Массовая доля', equation: 'ω = m(в-ва)/m(р-ра) × 100%', category: 'solutions' },
    { name: 'Молярная концентрация', equation: 'C = n/V', category: 'solutions' },
  ];

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
  console.log('Successfully seeded formulas!');
}

async function main() {
  try {
    await seedElements();
    await seedFormulas();
    console.log('Seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

main();
