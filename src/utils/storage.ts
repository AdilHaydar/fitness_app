import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'WORKOUT_DATA';
const STORAGE_KEY_SUPPLEMENT = 'SUPPLEMENT_DATA';

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

export const saveSupplementData = async (data: any) => {
    try {
        await AsyncStorage.setItem(STORAGE_KEY_SUPPLEMENT, JSON.stringify(data));
    } catch (error) {
        console.log('Veri kaydedilemedi:', error);
    }
};
export const loadSupplementData = async () => {
    try {
        const json = await AsyncStorage.getItem(STORAGE_KEY_SUPPLEMENT);
        return json != null ? JSON.parse(json) : null;
    } catch (error) {
        console.log('Veri yüklenemedi:', error);
        return null;
    }
}