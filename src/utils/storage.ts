import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'WORKOUT_DATA';

export const saveWorkoutData = async (data: any) => {
    try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
        console.log('Veri kaydedilemedi:', error);
    }
};

export const loadWorkoutData = async () => {
    try {
        const json = await AsyncStorage.getItem(STORAGE_KEY);
        return json != null ? JSON.parse(json) : null;
    } catch (error) {
        console.log('Veri yüklenemedi:', error);
        return null;
    }
};
