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
    Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { saveSupplementData, loadSupplementData } from '../utils/storage';

const daysOfWeek = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];

type Supplement = {
    name: string;
    dose: string;
    taken: boolean;
};

type SupplementPlan = {
    [day: string]: Supplement[];
};

const SupplementScreen = () => {
    const [supplements, setSupplements] = useState<SupplementPlan>({});
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedDay, setSelectedDay] = useState('');
    const [supplementName, setSupplementName] = useState('');
    const [dose, setDose] = useState('');
    const [loading, setLoading] = useState(true);
    const [expandedDays, setExpandedDays] = useState<{ [key: string]: boolean }>({});

    useEffect(() => {
        (async () => {
            const stored = await loadSupplementData();
            if (stored) {
                setSupplements(stored);
            } else {
                const initial: SupplementPlan = {};
                daysOfWeek.forEach(day => (initial[day] = []));
                setSupplements(initial);
            }
            setLoading(false);
        })();
    }, []);

    const persistData = (data: SupplementPlan) => {
        setSupplements(data);
        saveSupplementData(data);
    };

    const toggleDay = (day: string) => {
        setExpandedDays(prev => ({
            ...prev,
            [day]: !prev[day],
        }));
    };

    const openModal = (day: string) => {
        setSelectedDay(day);
        setSupplementName('');
        setDose('');
        setModalVisible(true);
    };

    const addSupplement = () => {
        if (!supplementName.trim() || !dose.trim()) return;

        const updated = { ...supplements };
        updated[selectedDay].push({
            name: supplementName.trim(),
            dose: dose.trim(),
            taken: false,
        });

        persistData(updated);
        setModalVisible(false);
    };

    const deleteSupplement = (day: string, index: number) => {
        const updated = { ...supplements };
        updated[day].splice(index, 1);
        persistData(updated);
    };

    const toggleTaken = (day: string, index: number) => {
        const updated = { ...supplements };
        updated[day][index].taken = !updated[day][index].taken;
        persistData(updated);
    };

    if (loading) {
        return (
            <View style={styles.centered}>
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
                            <View style={styles.dayHeader}>
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
                                {supplements[day]?.map((supplement, idx) => (
                                    <View key={idx} style={styles.supplementContainer}>
                                        <View style={styles.row}>
                                            <Text style={styles.supplementName}>
                                                {supplement.name} ({supplement.dose})
                                            </Text>
                                            <TouchableOpacity onPress={() => deleteSupplement(day, idx)}>
                                                <Ionicons name="trash" size={20} color="#e53935" />
                                            </TouchableOpacity>
                                        </View>

                                        <TouchableOpacity
                                            style={styles.checkRow}
                                            onPress={() => toggleTaken(day, idx)}
                                        >
                                            <Ionicons
                                                name={supplement.taken ? 'checkbox' : 'square-outline'}
                                                size={22}
                                                color={supplement.taken ? '#4caf50' : '#aaa'}
                                            />
                                            <Text style={styles.setText}>
                                                {supplement.taken ? 'Kullanıldı' : 'Kullanılmadı'}
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                ))}

                                <TouchableOpacity onPress={() => openModal(day)}>
                                    <Text style={styles.addButton}>+ Supplement Ekle</Text>
                                </TouchableOpacity>
                            </>
                        )}
                    </View>
                )}
            />

            {/* Modal */}
            <Modal visible={modalVisible} transparent animationType="fade">
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <KeyboardAvoidingView
                        style={styles.modalContainer}
                        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                    >
                        <View style={styles.modalBox}>
                            <Text style={styles.modalTitle}>Supplement Ekle - {selectedDay}</Text>
                            <TextInput
                                placeholder="Supplement adı"
                                value={supplementName}
                                onChangeText={setSupplementName}
                                style={styles.input}
                            />
                            <TextInput
                                placeholder="Doz (örnek: 500mg)"
                                value={dose}
                                onChangeText={setDose}
                                style={styles.input}
                            />
                            <Button title="Ekle" onPress={addSupplement} />
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
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    dayContainer: {
        padding: 12,
        borderBottomWidth: 1,
        borderColor: '#ddd',
    },
    dayHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    dayTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    supplementContainer: {
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
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    supplementName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    checkRow: {
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

export default SupplementScreen;
