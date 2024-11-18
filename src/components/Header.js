import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import GradientText from './GradientText';

const Header = ({ title, onBackPress, Gradient = true, showMenu = false, onMenuPress }) => {
    return (
        <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={onBackPress}>
                {Gradient ? (
                    <Icon name="corner-down-left" size={24} color="#1D99D6" />
                ) : (
                    <Icon name="corner-down-left" size={24} color="white" />
                )}
            </TouchableOpacity>
            <View style={styles.titleContainer}>
                {Gradient ? (
                    <GradientText style={styles.headerText}>{title}</GradientText>
                ) : (
                    <Text style={styles.headerText}>{title}</Text>
                )}
            </View>
            {showMenu ? (
                <TouchableOpacity style={styles.menuButton} onPress={onMenuPress}>
                    <Icon name="more-vertical" size={24} color="#1D99D6" />
                </TouchableOpacity>
            ) : (
                <View style={styles.menuButton} />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
    },
    backButton: {
        width: 24,
    },
    titleContainer: {
        flex: 1,
        alignItems: 'center',
    },
    headerText: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: 'bold',
    },
    menuButton: {
        width: 24,
    },
});

export default Header;