import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const OfferCard = ({ name, service, rating, image, providerImage, FavoriteBool = false, reserve = false, Details, navigation }) => {
    const [isFavorite, setIsFavorite] = useState(FavoriteBool);

    return (
        <Card style={styles.card}>
            <TouchableOpacity onPress={() => {
                if (reserve) {
                    navigation.navigate('StatusReservation');
                } else {
                    navigation.navigate('ServiceDetails', { serviceDetails: Details });
                }
            }}>
                <Card.Cover source={image} style={styles.coverImage} resizeMode="stretch" />
                <TouchableOpacity
                    style={styles.heartIcon}
                    onPress={() => setIsFavorite(!isFavorite)}
                >
                    <Icon
                        name={isFavorite ? "heart" : "heart-outline"}
                        size={24}
                        color="#fff"
                    />
                </TouchableOpacity>
                <Card.Content style={styles.content}>
                    <View style={styles.titleContainer}>
                        <View>
                            <Title style={styles.title}>{name}</Title>
                            <Paragraph style={styles.subtitle}>{service}</Paragraph>
                        </View>
                    </View>
                    <TouchableOpacity style={styles.avatarContainer}  onPress={()=>{navigation.navigate('ProviderProfile', { provider: Details?.provider })}}>
                        <Card.Cover source={providerImage} style={styles.avatar} resizeMode="stretch" />
                    </TouchableOpacity>
                    <View style={styles.ratingContainer}>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Icon
                                key={star}
                                name={star <= rating ? 'star' : 'star-outline'}
                                size={16}
                                color={star <= rating ? '#FFC107' : '#E0E0E0'}
                            />
                        ))}
                    </View>
                </Card.Content>
            </TouchableOpacity>
        </Card>
    );
};

const styles = StyleSheet.create({
    card: {
        marginVertical: 10,
        marginHorizontal: 16,
        paddingBottom: 10,
        borderRadius: 20,
        overflow: 'hidden',
    },
    coverImage: {
        height: 170,
        width: '100%',
        margin: 0,
        padding: 0,
    },
    heartIcon: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        borderRadius: 20,
        padding: 4,
    },
    content: {
        paddingTop: 5,
        position: 'relative',
    },
    titleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: 14,
        color: '#757575',
    },
    ratingContainer: {
        flexDirection: 'row',
        marginTop: 4,
    },
    avatarContainer: {
        position: 'absolute',
        top: -34,
        right: 16,
        width: 68,
        height: 68,
        borderRadius: 20,
        overflow: 'hidden',
    },
    avatar: {
        width: '100%',
        height: '100%',
    },
});

export default OfferCard;