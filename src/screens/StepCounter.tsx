// StepCounter.tsx
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Pressable } from 'react-native';
import * as Pedometer from 'expo-sensors/build/Pedometer';
import { Card, Title, Paragraph } from 'react-native-paper';
import StepGoalDonut from '../components/StepGoalDonut';
import CustomBottomSheet from '../components/CustomBottomSheet';
import BottomSheet from '@gorhom/bottom-sheet';

const StepCounter = () => {
    const bottomSheetRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ['25%', '50%', '75%'], []);

    const handleOpenBottomSheet = useCallback(() => {
        bottomSheetRef.current?.expand();
    }, []);
    const [stepGoal, setStepGoal] = useState(10000);
    const [isPedometerAvailable, setIsPedometerAvailable] = useState<string>('checking');
    const [currentStepCount, setCurrentStepCount] = useState<number>(0);
    const [pastStepCount, setPastStepCount] = useState<number>(0);
    const [caloriesBurned, setCaloriesBurned] = useState<number>(0);


    useEffect(() => {
        Pedometer.isAvailableAsync().then(
            (result) => setIsPedometerAvailable(String(result)),
            (error) => setIsPedometerAvailable('Could not get isPedometerAvailable: ' + error)
        );

        const end = new Date();
        const start = new Date();
        start.setHours(0, 0, 0, 0);

        Pedometer.getStepCountAsync(start, end).then(
            (result) => {
                setPastStepCount(result.steps);
                setCaloriesBurned(result.steps * 0.04);
            },
            (error) => console.log(error)
        );

        const subscription = Pedometer.watchStepCount((result) => {
            setCurrentStepCount(result.steps);
        });

        return () => subscription.remove();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.header}>Fitness Uygulaması</Text>

            <View style={styles.grid}>
                <Pressable
                    onPress={handleOpenBottomSheet}
                    style={({ pressed }) => [
                        styles.card,
                        { backgroundColor: pressed ? 'lightgray' : 'white' },
                    ]}
                >
                    <Card style={{ backgroundColor: 'transparent', elevation: 0 }}>
                        <Card.Content>
                            <Title>Adım Sayısı</Title>
                            <Paragraph>Bugün Atılan Adımlar: {pastStepCount}</Paragraph>
                            <Paragraph>Şu Anki Adım Sayısı: {currentStepCount}</Paragraph>
                            <StepGoalDonut currentSteps={pastStepCount} targetSteps={stepGoal} />
                        </Card.Content>
                    </Card>
                </Pressable>

                <Card style={styles.card}>
                    <Card.Content>
                        <Title>Kalori Hesaplama</Title>
                        <Paragraph>
                            Bugün Yaktığınız Kalori: {caloriesBurned.toFixed(2)} kcal
                        </Paragraph>
                    </Card.Content>
                </Card>
            </View>

            <CustomBottomSheet ref={bottomSheetRef} snapPoints={snapPoints} onChangeStepGoal={setStepGoal} />
        </SafeAreaView>
    );
};

export default StepCounter;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#f8f8f8',
        padding: 20,
    },
    header: {
        fontSize: 30,
        marginBottom: 20,
        color: '#333',
    },
    grid: {
        marginTop: 10,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        width: '100%',
    },
    card: {
        width: '48%',
        marginBottom: 20,
        borderRadius: 10,
        backgroundColor: '#fff',
        padding: 15,
        elevation: 4,
    },
    bottomSheetContent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
