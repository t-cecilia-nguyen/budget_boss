import React from 'react';
import { View, StyleSheet , Dimensions, Text} from 'react-native';



const HorizontalLine = ({width = '100%', style}) => {
    return (
        <View style={[ {width}, styles.line, style]}/>
    );
};

export default HorizontalLine;

const styles = StyleSheet.create({
    line: {
        height: 1, 
        backgroundColor: 'grey',         
    },
});
