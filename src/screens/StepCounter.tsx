import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, SafeAreaView } from 'react-native'
import * as Pedometer from 'expo-sensors/build/Pedometer'
import { Card, Title, Paragraph } from 'react-native-paper'
import  StepGoalDonut  from '../components/StepGoalDonut' // Donut bileşenini içe aktarıyoruz

const StepCounter = () => {
    const [isPedometerAvailable, setIsPedometerAvailable] = useState<string>('checking');
    const [currentStepCount, setCurrentStepCount] = useState<number>(0);
    const [pastStepCount, setPastStepCount] = useState<number>(0);
    const [caloriesBurned, setCaloriesBurned] = useState<number>(0);

    const stepGoal = 10000; // hedef 10.000 adım
    const calorieGoal = 400; // hedef 400 kalori

    useEffect(() => {

        
        // Cihazda adım sayar var mı?
        Pedometer.isAvailableAsync().then(
            (result) => {
                setIsPedometerAvailable(String(result));
            },
            (error) => {
                setIsPedometerAvailable('Could not get isPedometerAvailable: ' + error);
            }
        );

        // Başlangıçta geçmiş adım sayısını al
        const end = new Date();
        const start = new Date();
        start.setHours(0, 0, 0, 0); // Bugünün başı

        Pedometer.getStepCountAsync(start, end).then(
            (result) => {
                setPastStepCount(result.steps)
                setCaloriesBurned(result.steps * 0.04)
            },
            (error) => {
                console.log(error);
            }
        );

        const subscription = Pedometer.watchStepCount((result) => {
            setCurrentStepCount(result.steps);
        });

        return () => {
            subscription.remove();
        };
    }, []);


    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.header}>Fitness Uygulaması</Text>

            {/* Satır (row) oluşturduk */}
            <View style={styles.grid}>
                {/* Adım Sayısı Kartı */}
                <Card style={styles.card}>
                    <Card.Content>
                        <Title>Adım Sayısı</Title>
                        <Paragraph>Bugün Atılan Adımlar: {pastStepCount}</Paragraph>
                        <Paragraph>Şu Anki Adım Sayısı: {currentStepCount}</Paragraph>
                        <StepGoalDonut currentSteps={pastStepCount} targetSteps={10000}/>
                    </Card.Content>
                </Card>

                {/* Kalori Hesaplama Kartı */}
                <Card style={styles.card}>
                    <Card.Content>
                        <Title>Kalori Hesaplama</Title>
                        <Paragraph>Bugün Yaktığınız Kalori: {caloriesBurned.toFixed(2)} kcal</Paragraph>
                    </Card.Content>
                </Card>
            </View>
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
        justifyContent: 'space-between',
        width: '100%',
    },
    card: {
        width: '48%', // Kartların genişliğini biraz daraltarak hizalamak
        marginBottom: 20,
        height: '100%',
        borderRadius: 10,
        backgroundColor: '#fff',
        padding: 15,
        elevation: 4,
    },
});
