import React, { useEffect, useRef } from 'react';
import { View, Modal, Text, Animated, StyleSheet } from 'react-native';

const AnimatedModal = ({ isDone, setIsDone, msg }) => {
    const scaleValue = useRef(new Animated.Value(0)).current; // Animated value for scaling

    useEffect(() => {
        if (isDone) {
            // Trigger the animation
            Animated.spring(scaleValue, {
                toValue: 1,
                friction: 3,
                useNativeDriver: true,
            }).start();

            // Close the modal after 0.7 seconds
            const timer = setTimeout(() => {
                setIsDone(false);
                scaleValue.setValue(0); // Reset the animation value for next time
            }, 700);

            // Cleanup timer if the component unmounts or isDone changes
            return () => clearTimeout(timer);
        }
    }, [isDone]);

    return (
        <Modal
            transparent={true}
            animationType="fade"
            visible={isDone}
            onRequestClose={() => setIsDone(false)}
        >
            <View style={styles.modalBackground}>
                <View style={styles.modalContainer}>
                    <Animated.View style={[styles.tickContainer, { transform: [{ scale: scaleValue }] }]}>
                        <Text style={styles.tickText}>✔</Text>
                        <Text>{msg}</Text>
                    </Animated.View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        width: 200,
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 10,
    },
    tickContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    tickText: {
        fontSize: 60,
        color: 'green',
    },
});

export default AnimatedModal;
