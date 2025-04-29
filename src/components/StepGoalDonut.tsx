import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

interface StepGoalDonutProps {
    currentSteps: number;
    targetSteps: number;
}

const StepGoalDonut: React.FC<StepGoalDonutProps> = ({ currentSteps, targetSteps }) => {
    const progress = Math.min((currentSteps / targetSteps) * 100, 100); // İlerleme yüzdesi
    const radius = 80;
    const strokeWidth = 20;
    
    // Çevreyi hesapla
    const circumference = Math.PI * 2 * radius;

    // İlerleme için offset hesapla
    const progressOffset = circumference - (circumference * (progress / 100));

    return (
        <View style={styles.container}>
            <Svg width={100} height={100} viewBox="0 0 200 200">
                {/* Dış halka (arka plan) */}
                <Circle
                    cx="100"
                    cy="100"
                    r={radius}
                    stroke="#ddd"
                    strokeWidth={strokeWidth}
                    fill="none"
                />
                {/* İlerleme halkası */}
                <Circle
                    cx="100"
                    cy="100"
                    r={radius}
                    stroke="#4CAF50"
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeDasharray={circumference} // Çevreyi tamamla
                    strokeDashoffset={progressOffset} // İlerleme oranına göre göster
                    strokeLinecap="round"
                />
                {/* İç halka */}
                {/* <Circle
                    cx="100"
                    cy="100"
                    r={radius - strokeWidth} // İç halkayı biraz daha küçük yap
                    stroke="#fff"
                    strokeWidth={strokeWidth}
                    fill="none"
                /> */}
            </Svg>

            <View style={styles.gauge}>
                <Text style={styles.gaugeText}>{`${Math.floor(progress)}%`}</Text>
            </View>
        </View>
    );
};

export default StepGoalDonut;

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    gauge: {
        position: 'absolute',
        width: 120,
        height: 120,
        alignItems: 'center',
        justifyContent: 'center',
    },
    gaugeText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
});
