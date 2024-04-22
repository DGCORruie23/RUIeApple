import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, wp } from '../../services';
import AntDesign from 'react-native-vector-icons/AntDesign'

const BackButton = () => {
    const navigation = useNavigation();

    return (
        <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
            <AntDesign name='arrowleft' color={colors.grey_Text} size={wp(5)} />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        padding: 10,
        marginHorizontal: 10,
        backgroundColor: 'rgba(0,0,0,0.1)',
        borderRadius: wp(5),
        width: wp(10)
    },
});

export default BackButton;
