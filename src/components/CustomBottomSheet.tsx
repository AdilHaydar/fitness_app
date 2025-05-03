// components/CustomBottomSheet.tsx
import React, { forwardRef, useMemo, useState } from 'react';
import { KeyboardAvoidingView  ,View, StyleSheet, TextInput, Button, TouchableWithoutFeedback, Keyboard, Text, Platform } from 'react-native';
import { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import BottomSheet from '@gorhom/bottom-sheet';

type CustomBottomSheetProps = {
    snapPoints?: string[];
    onChangeStepGoal: (stepGoal: number) => void;
};

type CustomBottomSheetForCaloriesProps = {
    snapPoints?: string[];
    onChangeCaloriesGoal: (stepGoal: number) => void;
};

const CustomBottomSheet = forwardRef<BottomSheet, CustomBottomSheetProps>(({ snapPoints, onChangeStepGoal  }, ref) => {
    const memoizedSnapPoints = useMemo(() => snapPoints || ['25%', '50%', '75%'], [snapPoints]);
    const [inputValue, setInputValue] = useState('');
    const handleSubmit = () => {
        const number = parseInt(inputValue);
        if (!isNaN(number)) {
            onChangeStepGoal(number);
        }
    };

    return (
        
        <BottomSheet
            ref={ref}
            index={-1}
            snapPoints={memoizedSnapPoints}
            enablePanDownToClose={true}
            backdropComponent={(backdropProps) => (
                <BottomSheetBackdrop
                    {...backdropProps}
                    disappearsOnIndex={-1}
                    appearsOnIndex={0}
                    opacity={0.6}
                />
            )}
        >
            <BottomSheetView style={styles.bottomSheetContent}>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}>

                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View  style={styles.inner} >
                            <View style={styles.row}>
                                <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10, paddingRight: 10 }}>
                                    Adım Hedefi Ayarla
                                </Text>
                                <TextInput
                                    style={styles.input}
                                    keyboardType="numeric"
                                    placeholder="Yeni adım hedefi girin"
                                    value={inputValue}
                                    onChangeText={setInputValue}
                                />
                            </View>
                            <View>
                                <Button title="Hedefi Ayarla" onPress={handleSubmit} />
                            </View>
                            
                        </View>
                        
                        
                    </TouchableWithoutFeedback>
                </KeyboardAvoidingView>
            </BottomSheetView>
        </BottomSheet>
        
    );
});

const CustomBottomSheetForCalories = forwardRef<BottomSheet, CustomBottomSheetForCaloriesProps>(({ snapPoints, onChangeCaloriesGoal  }, ref) => {
    const memoizedSnapPoints = useMemo(() => snapPoints || ['25%', '50%', '75%'], [snapPoints]);
    const [inputValue, setInputValue] = useState('');
    const handleSubmit = () => {
        const number = parseInt(inputValue);
        if (!isNaN(number)) {
            onChangeCaloriesGoal(number);
        }
    };

    return (
        
        <BottomSheet
            ref={ref}
            index={-1}
            snapPoints={memoizedSnapPoints}
            enablePanDownToClose={true}
            backdropComponent={(backdropProps) => (
                <BottomSheetBackdrop
                    {...backdropProps}
                    disappearsOnIndex={-1}
                    appearsOnIndex={0}
                    opacity={0.6}
                />
            )}
        >
            <BottomSheetView style={styles.bottomSheetContent}>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}>

                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View  style={styles.inner} >
                            <View style={styles.row}>
                                <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10, paddingRight: 10 }}>
                                    Kalori Hedefi Ayarla
                                </Text>
                                <TextInput
                                    style={styles.input}
                                    keyboardType="numeric"
                                    placeholder="Yeni kalori hedefi girin"
                                    value={inputValue}
                                    onChangeText={setInputValue}
                                />
                            </View>
                            <View>
                                <Button title="Hedefi Ayarla" onPress={handleSubmit} />
                            </View>
                            
                        </View>
                        
                        
                    </TouchableWithoutFeedback>
                </KeyboardAvoidingView>
            </BottomSheetView>
        </BottomSheet>
        
    );
});


export default {CustomBottomSheet, CustomBottomSheetForCalories};

const styles = StyleSheet.create({
    bottomSheetContent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    input: {
        borderWidth: 1,
        padding: 10,
        marginBottom: 10,
        borderRadius: 10,
        borderColor: '#ccc',
        width: 200,
        backgroundColor: '#fff',
        textAlign: 'center',
    },
    inner: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '100%',
    },
});
