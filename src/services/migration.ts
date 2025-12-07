/**
 * Service for migrating user data from localStorage to backend
 */

export interface LocalStorageData {
  chem_xp?: string;
}

/**
 * Check if there's any data in localStorage that needs migration
 */
export const hasLocalData = (): boolean => {
  return localStorage.getItem('chem_xp') !== null;
};

/**
 * Get all data from localStorage
 */
export const getLocalData = (): LocalStorageData => {
  return {
    chem_xp: localStorage.getItem('chem_xp') || undefined,
  };
};

/**
 * Migrate localStorage data to backend
 * Call this after successful login
 */
export const migrateLocalStorageToBackend = async (token: string): Promise<void> => {
  const localData = getLocalData();

  if (!localData.chem_xp) {
    return; // Nothing to migrate
  }

  try {
    const response = await fetch('/api/progress/migrate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        xp: parseInt(localData.chem_xp, 10) || 0,
      }),
    });

    if (response.ok) {
      // Clear localStorage after successful migration
      localStorage.removeItem('chem_xp');
      console.log('✅ Progress migrated successfully to cloud');

      // Optionally show a notification to the user
      // You can integrate with a toast notification library here
      return;
    } else {
      console.error('Failed to migrate progress:', await response.text());
    }
  } catch (error) {
    console.error('Migration failed:', error);
    // Keep localStorage data as fallback
  }
};

/**
 * Auto-migrate on login
 * Call this in AuthContext after successful authentication
 */
export const autoMigrateOnLogin = async (token: string): Promise<void> => {
  if (hasLocalData()) {
    console.log('📦 Found local data, migrating to cloud...');
    await migrateLocalStorageToBackend(token);
  }
};
