import syncFood from "../syncData/useSyncFood"
import syncNutrients from "../syncData/useSyncNutrients"
import syncSavedWorkouts from "../syncData/useSyncSavedWorkouts"
import syncWorkouts from "../syncData/useSyncWorkouts"
import syncWorkoutsInFolders from "../syncData/useSyncWorkoutsInFolders"

const syncInformation = async () => {

    console.log('Syncing info...');
    await syncFood();
    await syncNutrients();
    await syncSavedWorkouts();
    await syncWorkouts();
    await syncWorkoutsInFolders();
    console.log('Synced all info!');
    
}

export default syncInformation;