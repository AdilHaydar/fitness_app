import React, { useEffect, useState } from 'react';
import { Text, View, TextInput, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import * as Location from 'expo-location';

const SpeedTracker = () => {
    const [speed, setSpeed] = useState<number | null>(null); // m/s
    const [calories, setCalories] = useState<number>(0); // kcal
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [weight, setWeight] = useState<string>('70'); // kg (string input)
    const [tracking, setTracking] = useState(false);

    useEffect(() => {
        let lastTimestamp = Date.now();
        let locationSubscription: Location.LocationSubscription | null = null;

        const startTracking = async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Konum izni verilmedi');
                return;
            }

            locationSubscription = await Location.watchPositionAsync(
                {
                    accuracy: Location.Accuracy.Highest,
                    timeInterval: 1000,
                    distanceInterval: 1,
                },
                (location) => {
                    const currentSpeed = location.coords.speed; // m/s
                    const now = Date.now();
                    const elapsedTime = (now - lastTimestamp) / 1000; // saniye
                    lastTimestamp = now;

                    const userWeight = parseFloat(weight);
                    if (currentSpeed !== null && currentSpeed > 0 && !isNaN(userWeight)) {
                        const speedKmh = currentSpeed * 3.6;

                        // MET değeri tahmini
                        let MET = 1;
                        if (speedKmh < 5) MET = 2.0;
                        else if (speedKmh < 8) MET = 3.5;
                        else if (speedKmh < 10) MET = 7.0;
                        else MET = 10.0;

                        const hours = elapsedTime / 3600;
                        const kcal = MET * userWeight * hours;
                        setCalories((prev) => prev + kcal);
                    }

                    setSpeed(currentSpeed);
                }
            );
        };

        if (tracking) {
            startTracking();
        }

        return () => {
            locationSubscription?.remove();
        };
    }, [tracking, weight]);

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <Text style={styles.label}>Kilonuzu girin (kg):</Text>
            <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={weight}
                onChangeText={setWeight}
                placeholder="Örn: 70"
            />

            <Text style={styles.label}>Hızınız:</Text>
            <Text style={styles.value}>
                {speed !== null ? (speed * 3.6).toFixed(2) + ' km/s' : 'Hesaplanıyor...'}
            </Text>

            <Text style={styles.label}>Yakılan Kalori:</Text>
            <Text style={styles.value}>{calories.toFixed(2)} kcal</Text>

            <Text
                style={styles.button}
                onPress={() => setTracking((prev) => !prev)}
            >
                {tracking ? 'Takibi Durdur' : 'Takibi Başlat'}
            </Text>

            {errorMsg && <Text style={{ color: 'red' }}>{errorMsg}</Text>}
        </KeyboardAvoidingView>
    );
};

export default SpeedTracker;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 60,
        paddingHorizontal: 20,
        backgroundColor: '#f7f7f7',
    },
    label: {
        fontSize: 18,
        marginTop: 20,
        fontWeight: 'bold',
    },
    value: {
        fontSize: 20,
        marginTop: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: '#aaa',
        borderRadius: 8,
        padding: 10,
        marginTop: 10,
        backgroundColor: '#fff',
    },
    button: {
        marginTop: 30,
        textAlign: 'center',
        backgroundColor: '#007AFF',
        color: 'white',
        padding: 15,
        borderRadius: 10,
        fontWeight: 'bold',
    },
});
