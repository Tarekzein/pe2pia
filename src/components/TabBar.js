import React from 'react';
import { View, TouchableOpacity, StyleSheet,Text } from 'react-native';
import GradientText from './GradientText';

const TabBar = ({ tabs, activeTab, onTabPress }) => {
    return (
        <View style={styles.tabContainer}>
            {tabs.map((tab) => (
                <TouchableOpacity
                    key={tab}
                    style={[
                        styles.tab,
                        activeTab === tab && styles.activeTab
                    ]}
                    onPress={() => onTabPress(tab)}
                >
                    {activeTab === tab ? (
                        <GradientText style={[
                            styles.tabText,
                            activeTab === tab && styles.activeTabText
                        ]}>{tab}</GradientText>
                    ) : (
                        <Text style={[
                            styles.tabText,
                            activeTab === tab && styles.activeTabText
                        ]}>{tab}</Text>
                    )}
                </TouchableOpacity>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    tabContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        paddingVertical: 5,
        gap: 10,
    },
    tab: {
        width: "auto",
        height: 28,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 42,
        borderWidth: 1,
        borderColor: '#000000',
        paddingHorizontal:20
    },
    activeTab: {
        borderWidth: 1,
        borderColor:'#1D99D6',
    },
    tabText: {
        fontFamily: 'IBM Plex Sans',
        fontWeight: '700',
        fontSize: 14,
        lineHeight: 18,
        color: '#000000',
    },
    activeTabText: {
        color: '#FFFFFF',
    },
});

export default TabBar;