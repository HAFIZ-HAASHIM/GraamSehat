/**
 * seed-db.js
 * Script to seed pre-configured demo users directly into your live Firestore database.
 * Organise all code into clearly named folders with a comment at the top of every file.
 * Run using: npm run seed
 */

import { doc, setDoc } from 'firebase/firestore';
import { db } from './src/firebase/config.js';
import { MOCK_PATIENTS } from './src/firebase/auth.js';
import { MOCK_SCREENINGS, MOCK_FAMILY } from './src/firebase/patients.js';

async function runSeeder() {
  console.log('--------------------------------------------------');
  console.log('🚀 GraamSehat Firestore Seeder');
  console.log('--------------------------------------------------');
  console.log('Connecting to Firestore...');

  try {
    // Seed Patients
    for (const uid of Object.keys(MOCK_PATIENTS)) {
      const patientData = MOCK_PATIENTS[uid];
      const patientDocRef = doc(db, 'patients', uid);
      await setDoc(patientDocRef, patientData);
      console.log(`✅ Seeded Patient Profile: ${uid} (${patientData.name})`);

      // Seed Screenings
      const screenings = MOCK_SCREENINGS[uid] || [];
      for (const screening of screenings) {
        const screeningDocRef = doc(db, 'patients', uid, 'screenings', screening.date);
        await setDoc(screeningDocRef, screening);
      }
      console.log(`   └─ Seeded ${screenings.length} screening records`);
    }

    // Seed Family Links
    for (const primaryUID of Object.keys(MOCK_FAMILY)) {
      const members = MOCK_FAMILY[primaryUID] || [];
      for (const m of members) {
        const docRef = doc(db, 'familyLinks', primaryUID, 'members', m.memberUID);
        await setDoc(docRef, {
          memberUID: m.memberUID,
          relation: m.relation,
          addedAt: new Date().toISOString()
        });

        // reciprocal link
        const reciprocalRef = doc(db, 'familyLinks', m.memberUID, 'members', primaryUID);
        await setDoc(reciprocalRef, {
          memberUID: primaryUID,
          relation: 'Family',
          addedAt: new Date().toISOString()
        });
      }
      console.log(`✅ Seeded Family Links for: ${primaryUID}`);
    }

    console.log('--------------------------------------------------');
    console.log('🎉 Database seeding completed successfully!');
    console.log('--------------------------------------------------');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

runSeeder();
