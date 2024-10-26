import syncFood from "../syncData/useSyncFood"
import syncNutrients from "../syncData/useSyncNutrients"
import syncSavedWorkouts from "../syncData/useSyncSavedWorkouts"
import syncWorkouts from "../syncData/useSyncWorkouts"
import syncWorkoutsInFolders from "../syncData/useSyncWorkoutsInFolders"

const syncInformation = async () => {
    await syncFood()
    await syncNutrients()
    await syncSavedWorkouts()
    await syncWorkouts()
    syncWorkoutsInFolders()
}

export default syncInformation;