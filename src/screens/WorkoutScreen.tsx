import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Modal,
    Button,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { saveWorkoutData, loadWorkoutData } from '../utils/storage';

const daysOfWeek = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];

type Exercise = {
    name: string;
    sets: { reps: number; completed: boolean }[];
};

type WorkoutPlan = {
    [day: string]: Exercise[];
};

const WorkoutScreen = () => {
    const [workout, setWorkout] = useState<WorkoutPlan>({});
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedDay, setSelectedDay] = useState('');
    const [exerciseName, setExerciseName] = useState('');
    const [setCount, setSetCount] = useState('3');
    const [reps, setReps] = useState('10');
    const [loading, setLoading] = useState(true);
    const [expandedDays, setExpandedDays] = useState<{ [key: string]: boolean }>({});


    useEffect(() => {
        (async () => {
            const stored = await loadWorkoutData();
            if (stored) {
                setWorkout(stored);
            } else {
                const initial: WorkoutPlan = {};
                daysOfWeek.forEach(day => (initial[day] = []));
                setWorkout(initial);
            }
            setLoading(false);
        })();
    }, []);

    const toggleDay = (day: string) => {
        setExpandedDays(prev => ({
            ...prev,
            [day]: !prev[day],
        }));
    };

    const persistWorkout = (newData: WorkoutPlan) => {
        setWorkout(newData);
        saveWorkoutData(newData);
    };

    const openModal = (day: string) => {
        setSelectedDay(day);
        setExerciseName('');
        setSetCount('3');
        setReps('10');
        setModalVisible(true);
    };

    const addExercise = () => {
        if (!exerciseName.trim()) return;

        const newSets = Array.from({ length: parseInt(setCount) }, () => ({
            reps: parseInt(reps),
            completed: false,
        }));

        const updated = { ...workout };
        updated[selectedDay].push({
            name: exerciseName.trim(),
            sets: newSets,
        });

        persistWorkout(updated);
        setModalVisible(false);
    };

    const deleteExercise = (day: string, exIndex: number) => {
        const updated = { ...workout };
        updated[day].splice(exIndex, 1);
        persistWorkout(updated);
    };

    const deleteSet = (day: string, exIndex: number, setIndex: number) => {
        const updated = { ...workout };
        updated[day][exIndex].sets.splice(setIndex, 1);
        persistWorkout(updated);
    };


    const toggleSetComplete = (day: string, exIndex: number, setIndex: number) => {
        const updated = { ...workout };
        updated[day][exIndex].sets[setIndex].completed = !updated[day][exIndex].sets[setIndex].completed;
        persistWorkout(updated);
    };

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#444" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={daysOfWeek}
                keyExtractor={item => item}
                renderItem={({ item: day }) => (
                    <View style={styles.dayContainer}>
                        <TouchableOpacity onPress={() => toggleDay(day)}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Text style={styles.dayTitle}>{day}</Text>
                                <Ionicons
                                    name={expandedDays[day] ? 'chevron-up' : 'chevron-down'}
                                    size={20}
                                    color="#444"
                                />
                            </View>
                        </TouchableOpacity>

                        {expandedDays[day] && (
                            <>
                                {workout[day]?.map((exercise, exIdx) => (
                                    <View key={exIdx} style={styles.exerciseContainer}>
                                        {/* Egzersiz ve setler buraya */}
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Text style={styles.exerciseName}>{exercise.name}</Text>
                                            <TouchableOpacity onPress={() => deleteExercise(day, exIdx)}>
                                                <Ionicons name="trash" size={20} color="#e53935" />
                                            </TouchableOpacity>
                                        </View>

                                        {exercise.sets.map((set, setIdx) => (
                                            <TouchableOpacity
                                                key={setIdx}
                                                style={styles.setRow}
                                                onPress={() => toggleSetComplete(day, exIdx, setIdx)}
                                                onLongPress={() => deleteSet(day, exIdx, setIdx)}
                                            >
                                                <Ionicons
                                                    name={set.completed ? 'checkbox' : 'square-outline'}
                                                    size={22}
                                                    color={set.completed ? '#4caf50' : '#aaa'}
                                                />
                                                <Text style={styles.setText}>{set.reps} tekrar</Text>
                                            </TouchableOpacity>
                                        ))}

                                        <View style={{
                                            backgroundColor: '#e0f2f1',
                                            paddingVertical: 4,
                                            paddingHorizontal: 8,
                                            borderRadius: 8,
                                            alignSelf: 'flex-start',
                                            marginTop: 6,
                                            marginLeft: 26,
                                        }}>
                                            <Text style={{ fontSize: 12, color: '#00796b', fontWeight: '500' }}>
                                                Tamamlanan: {
                                                    Math.round(
                                                        (exercise.sets.filter(s => s.completed).length / exercise.sets.length) * 100
                                                    )
                                                }%
                                            </Text>
                                        </View>
                                    </View>
                                ))}

                                <TouchableOpacity onPress={() => openModal(day)}>
                                    <Text style={styles.addButton}>+ Egzersiz Ekle</Text>
                                </TouchableOpacity>
                            </>
                        )}
                    </View>
                )}

            />

            {/* Modal */}
            <Modal
                visible={modalVisible}
                transparent
                animationType="fade"
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <KeyboardAvoidingView
                        style={styles.modalContainer}
                        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                    >
                        <View style={styles.modalBox}>
                            <Text style={styles.modalTitle}>Egzersiz Ekle - {selectedDay}</Text>
                            <TextInput
                                placeholder="Egzersiz adı"
                                value={exerciseName}
                                onChangeText={setExerciseName}
                                style={styles.input}
                            />
                            <TextInput
                                placeholder="Set sayısı"
                                value={setCount}
                                onChangeText={setSetCount}
                                keyboardType="number-pad"
                                style={styles.input}
                            />
                            <TextInput
                                placeholder="Tekrar sayısı"
                                value={reps}
                                onChangeText={setReps}
                                keyboardType="number-pad"
                                style={styles.input}
                            />
                            <Button title="Ekle" onPress={addExercise} />
                            <Button title="İptal" color="gray" onPress={() => setModalVisible(false)} />
                        </View>
                    </KeyboardAvoidingView>
                </TouchableWithoutFeedback>
            </Modal>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f4f4',
        paddingVertical: 16,
    },
    dayContainer: {
        padding: 12,
        borderBottomWidth: 1,
        borderColor: '#ddd',
    },
    dayTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    exerciseContainer: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginVertical: 8,
        marginHorizontal: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },

    exerciseName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },

    setRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        paddingLeft: 8,
    },

    setText: {
        marginLeft: 10,
        fontSize: 16,
        color: '#444',
    },

    addButton: {
        color: 'blue',
        marginTop: 4,
        marginLeft: 8,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: '#00000080',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalBox: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        width: '85%',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    input: {
        borderWidth: 1,
        borderColor: '#aaa',
        borderRadius: 5,
        marginBottom: 10,
        paddingHorizontal: 10,
        height: 40,
    },
});

export default WorkoutScreen;
