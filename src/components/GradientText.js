import React from 'react';
import { Text } from 'react-native';
import MaskedView from '@react-native-masked-view/masked-view';
import LinearGradient from 'react-native-linear-gradient';

const GradientText = (props) => {
    return (
        <MaskedView maskElement={<Text {...props} />}>
            <LinearGradient
                colors={['#1D99D6', '#79CAF1']}
                start={{x: 1, y: 1}}
                end={{x: 0, y: 0}}
            >
                <Text {...props} style={[props.style, { opacity: 0}]} />
            </LinearGradient>
        </MaskedView>
    );
};

export default GradientText;