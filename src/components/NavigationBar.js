import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import ActionButton from 'react-native-circular-action-menu';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';

const { width } = Dimensions.get('window');
const NAVBAR_HEIGHT = 70;
const CURVE_HEIGHT = 22;
const CIRCLE_RADIUS = 30;
const SLOPE_WIDTH = 30;
const BORDER_RADIUS = 25;

const CurvedShape = () => {
    const centerX = width / 2;
    const leftCurveStart = centerX - CIRCLE_RADIUS - SLOPE_WIDTH;
    const rightCurveEnd = centerX + CIRCLE_RADIUS + SLOPE_WIDTH;

    const d = `M${BORDER_RADIUS},0
    L${leftCurveStart},0
    Q${centerX - CIRCLE_RADIUS},0 ${centerX - CIRCLE_RADIUS},${CURVE_HEIGHT}
    A${CIRCLE_RADIUS},${CURVE_HEIGHT} 0 0,0 ${centerX + CIRCLE_RADIUS},${CURVE_HEIGHT}
    Q${centerX + CIRCLE_RADIUS},0 ${rightCurveEnd},0
    L${width - BORDER_RADIUS},0
    Q${width},0 ${width},${BORDER_RADIUS}
    L${width},${NAVBAR_HEIGHT}
    Q${width},${NAVBAR_HEIGHT} ${width - BORDER_RADIUS},${NAVBAR_HEIGHT}
    L${BORDER_RADIUS},${NAVBAR_HEIGHT}
    Q0,${NAVBAR_HEIGHT} 0,${NAVBAR_HEIGHT - BORDER_RADIUS}
    L0,${BORDER_RADIUS}
    Q0,0 ${BORDER_RADIUS},0
    Z`;

    return (
      <Svg width={width} height={NAVBAR_HEIGHT} style={styles.shadowEffect}>
          <Defs>
              <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="0" stopColor="white" stopOpacity="0.9" />
                  <Stop offset="1" stopColor="white" stopOpacity="1" />
              </LinearGradient>
          </Defs>
          <Path d={d} fill="white" />
      </Svg>
    );
};

const BottomNavBar = ({navigation}) => {
  const menuItems = [
    {icon: '', text: '', bg: 'transparent'},
    {
      icon: 'plus',
      text: 'Test',
      bg: '#eee',
      navigation: true,
      action: () => navigation.navigate('test'),
    },
    {
      icon: 'edit',
      text: 'Empty',
      bg: '#eee',
      navigation: true,
      action: () => navigation.navigate('empty'),
    },
    {icon: 'trash', text: 'Delete', navigation: false, bg: '#eee'},
    {icon: '', text: '', bg: 'transparent'},
  ];

  return (
    <View style={styles.container}>
      <CurvedShape />
      <View style={styles.content}>
        <View style={styles.iconsContainer}>
          <TouchableOpacity
            style={styles.tabItem}
            onPress={() => navigation.navigate('Home')}>
            <Icon name="home" size={24} color="black" />
            <Text style={styles.tabText}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.tabItem}
            onPress={() => navigation.navigate('Favourites')}>
            <Icon name="heart" size={24} color="black" />
            <Text style={styles.tabText}>Favorites</Text>
          </TouchableOpacity>
          <View style={styles.centerSpacing} />
          <TouchableOpacity
            style={styles.tabItem}
            onPress={() => navigation.navigate('CustomerService')}>
            <Icon name="headphones" size={24} color="black" />
            <Text style={styles.tabText}>Help</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.tabItem}
            onPress={() => navigation.navigate('Menu')}>
            <Icon name="menu" size={24} color="#1D99D6" />
            <Text style={[styles.tabText, {color: '#1D99D6'}]}>Menu</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.logoContainer}>
          <ActionButton
            buttonColor="rgba(255,255,255,1)"
            btnOutRange="rgba(255,255,255,1)"
            icon={
              <Image
                source={require('../assets/img_5.png')}
                style={styles.logoImage}
              />
            }
            radius={110}
            degrees={360}
            offsetY={-60}
            offsetX={-30}
            spacing={50}>
            {menuItems.map((item, index) => (
              <ActionButton.Item
                key={index}
                title={item.text}
                buttonColor="transparent"
                style={styles.menuItemButton}
                onPress={
                  item.navigation
                    ? item.action
                    : () => console.log(`${item.text} button pressed`)
                }>
                <View
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'row',
                    padding: '50px',
                    width: 70,
                    height: 70,
                    borderRadius: '50%',
                    shadowColor: '#737373',
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity:  0.1,
                    shadowRadius:  0.1,
                    elevation: item.bg === 'transparent' ? 0 : 11,
                    backgroundColor: item.bg,
                  }}>
                  <Icon name={item.icon} style={styles.actionButtonIcon} />
                  <Text style={styles.actionButtonText}>{item.text}</Text>
                </View>
              </ActionButton.Item>
            ))}
          </ActionButton>
        </View>
      </View>
    </View>
  );
};

// Updated Styles in the styles object

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: NAVBAR_HEIGHT,
    },
    content: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: NAVBAR_HEIGHT,
        paddingBottom: 10,
    },
    iconsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    tabItem: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabText: {
        fontSize: 12,
        marginTop: 4,
        color: 'gray', // Change text color to gray for inactive icons
    },
    centerSpacing: {
        width: 60,
    },
    centerButton: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 5,
    },
    logoImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
    },
    logoContainer: {
        position: 'absolute',
        top: -30,
        left: '50%',
        marginLeft: -35,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1,
        width: 70,
        height: 70,
        borderRadius: 35,
        shadowColor: '#737373',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.1,
        shadowRadius: 0.1,
        elevation: 11,
    },
    menuItemButton: {
        backgroundColor: 'white',
        borderRadius: 30,
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 4,
    },
    actionButtonIcon: {
        fontSize: 24,
        color: 'black',
        marginRight: 8,
    },
    actionButtonText: {
        fontSize: 16,
        color: 'black',
    },
});



export default BottomNavBar;
