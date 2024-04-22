import { StyleSheet, Text, SafeAreaView, View, TextInput, TouchableOpacity, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import WrapperComponent from '../../../components/wrapperComponent'
import { colors, endPoints, fontFamily, fontPixel, hp, routes, wp } from '../../../services'
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import appStyles from '../../../services/utilities/appStyles';
import BackButton from '../../../components/BackOption';
import CountryDropDown from '../../../components/countryDropDown';
import { useDispatch, useSelector } from 'react-redux';
import { DaltosRapid, SaveInsertCData } from '../../../redux/Slices/userDataSlice';
import moment from 'moment';
import NetInfo from "@react-native-community/netinfo";

export default function GUARDAR(props) {
    const dispatch = useDispatch()
    const getDaltosRapid = useSelector(state => state?.userData?.daltosRapid)
    const getCountry = useSelector(state => state?.userData?.Paises)
    const Fuerza = useSelector(state => state.userData.Fuerza)
    const user = useSelector(state => state.userData.userData)
    const forwardData = useSelector(state => state.userData.forwardData)
    const puestisADisposicion = useSelector(state => state.userData.puestisADisposicion)
    const InsertCData = useSelector(state => state.userData.InsertCData)

    // Get unique oficinaR Value from GET Fuerza API
    const uniqueOffices = [...new Set(Fuerza.map(item => item.oficinaR))];

    const [adultos, setAdultos] = useState('')
    const [country, setCountry] = React.useState('')
    const [typeValue, setTypeValue] = React.useState('')
    const [input1, setInput1] = React.useState('')
    const [input2, setInput2] = React.useState('')
    const [input3, setInput3] = React.useState('')
    const [input4, setInput4] = React.useState('')
    const [input5, setInput5] = React.useState('')
    const [input6, setInput6] = React.useState('')
    const [input7, setInput7] = React.useState('')
    const [input8, setInput8] = React.useState('')
    const [input9, setInput9] = React.useState('')
    const [input10, setInput10] = React.useState('')
    const [input11, setInput11] = React.useState('')
    const [input12, setInput12] = React.useState('')

    const sendData = async () => {
        const dataObject = {
            "oficinaRepre": uniqueOffices[user?.estado - 1],
            "fecha": moment(new Date()).format('DD-MM-YY'),
            'hora': moment(new Date()).format('h:mm'),
            'nombreAgente': user?.nombre?.toUpperCase() + " " + user?.apellido?.toUpperCase(),

            'municipio': (
                forwardData?.DropDownSelected == 'Casa De Seguridad' ||
                forwardData?.DropDownSelected == 'Hotel'
            )
                ? forwardData?.customeInputSelection
                : "",
            'puntoEstra': (
                forwardData?.DropDownSelected == 'Aeropuerto' ||
                forwardData?.DropDownSelected == 'Central De AutoBuses' ||
                forwardData?.DropDownSelected == 'Carretero' ||
                forwardData?.DropDownSelected == 'Ferrocarril'
            )
                ? forwardData?.customeInputSelection
                : "",

            'nacionalidad': country,
            'iso3': country ? (getCountry.find(couny => couny.nombre_pais.toLowerCase() === country.toLowerCase())).iso3 : "",

            nationality: country ? (getCountry.find(couny => couny.nombre_pais.toLowerCase() === country.toLowerCase())).iso3 : "",

            AS_hombres: input1,
            AS_mujeresNoEmb: input2,
            AS_mujeresEmb: input3,

            AA_hombres: input4,
            AA_mujeresNoEmb: input5,
            AA_mujeresEmb: input6,

            nucleosfamiliares: adultos,

            NNA_A_hombres: input7,
            NNA_A_mujeresNoEmb: input8,
            NNA_A_mujeresEmb: input9,

            NNA_S_hombres: input10,
            NNA_S_mujeresNoEmb: input11,
            NNA_S_mujeresEmb: input12
        };

        // Create an array of all the state variables
        const inputs = [adultos, country, input1, input2, input3, input4, input5, input6, input7, input8, input9, input10, input11, input12];

        // Check if every input has a value (i.e., the value is not an empty string)
        const allFilled = inputs.every(input => input !== '');

        if (allFilled) {
            if (getDaltosRapid != null) {
                var newArray = [...getDaltosRapid]
                if (props?.route?.params?.indexKey !== undefined) {
                    newArray[props?.route?.params?.indexKey] = dataObject;
                } else {
                    newArray.push(dataObject)
                }
                dispatch(DaltosRapid(newArray))
            } else {
                dispatch(DaltosRapid([dataObject]))
            }

            props.navigation.navigate(routes.fileCheck, { selectedValue: props?.route?.params?.selectedValue, selected: props?.route?.params?.selected })

            sendDataToServer()
        }
        else {
            Alert.alert('LLENAR PARA CONTINUAR');
        }
    }

    const sendDataToServer = async () => {
        try {
            const dataObject = {
                "oficinaRepre": uniqueOffices[user?.estado - 1],
                "fecha": moment(new Date()).format('DD-MM-YY'),
                'hora': moment(new Date()).format('h:mm'),
                'nombreAgente': user?.nombre?.toUpperCase() + " " + user?.apellido?.toUpperCase(),

                'aeropuerto': forwardData?.DropDownSelected == 'Aeropuerto' ? true : false,
                'carretero': forwardData?.DropDownSelected == 'Carretero' ? true : false,
                'tipoVehic': "",
                'lineaAutobus': "",
                'numeroEcono': "",
                'placas': "",

                'vehiculoAseg': false,
                'casaSeguridad': forwardData?.DropDownSelected == 'Casa De Seguridad' ? true : false,
                'centralAutobus': forwardData?.DropDownSelected == 'Central De AutoBuses' ? true : false,

                'ferrocarril': forwardData?.DropDownSelected == 'Ferrocarril' ? true : false,
                'empresa': "",

                'hotel': forwardData?.DropDownSelected == 'Hotel' ? true : false,
                'nombreHotel': "",

                'puestosADispo': forwardData?.DropDownSelected == 'Puestos a Disposicion' ? true : false,
                'juezCalif': forwardData?.DropDownSelected == 'Puestos a Disposicion' ? puestisADisposicion.filter(item => item.id == 'Juez Calificador')[0]?.status : false,
                'reclusorio': forwardData?.DropDownSelected == 'Puestos a Disposicion' ? puestisADisposicion.filter(item => item.id == 'Reclusorio / Cereso')[0]?.status : false,
                'policiaFede': forwardData?.DropDownSelected == 'Puestos a Disposicion' ? puestisADisposicion.filter(item => item.id == 'Policia Federal')[0]?.status : false,
                'dif': forwardData?.DropDownSelected == 'Puestos a Disposicion' ? puestisADisposicion.filter(item => item.id == 'DIF')[0]?.status : false,
                'policiaEsta': forwardData?.DropDownSelected == 'Puestos a Disposicion' ? puestisADisposicion.filter(item => item.id == 'Policia Estatal')[0]?.status : false,
                'policiaMuni': forwardData?.DropDownSelected == 'Puestos a Disposicion' ? puestisADisposicion.filter(item => item.id == 'Policia Municipal')[0]?.status : false,
                'guardiaNaci': forwardData?.DropDownSelected == 'Puestos a Disposicion' ? puestisADisposicion.filter(item => item.id == 'Guardia Nacional')[0]?.status : false,
                'fiscalia': forwardData?.DropDownSelected == 'Puestos a Disposicion' ? puestisADisposicion.filter(item => item.id == 'Fiscalia')[0]?.status : false,
                'otrasAuto': forwardData?.DropDownSelected == 'Puestos a Disposicion' ? puestisADisposicion.filter(item => item.id == 'Otras autoridades')[0]?.status : false,

                'voluntarios': forwardData?.DropDownSelected == 'Voluntarios' ? true : false,
                'otro': false,

                'presuntosDelincuentes': false,
                'numPresuntosDelincuentes': 0,

                'municipio': (
                    forwardData?.DropDownSelected == 'Casa De Seguridad' ||
                    forwardData?.DropDownSelected == 'Hotel'
                )
                    ? forwardData?.customeInputSelection
                    : "",
                'puntoEstra': (
                    forwardData?.DropDownSelected == 'Aeropuerto' ||
                    forwardData?.DropDownSelected == 'Central De AutoBuses' ||
                    forwardData?.DropDownSelected == 'Carretero' ||
                    forwardData?.DropDownSelected == 'Ferrocarril'
                )
                    ? forwardData?.customeInputSelection
                    : "",

                'nacionalidad': country,
                'iso3': country ? (getCountry.find(couny => couny.nombre_pais.toLowerCase() === country.toLowerCase())).iso3 : "",
                "AS_hombres": parseInt(input1),
                "AS_mujeresNoEmb": parseInt(input2),
                "AS_mujeresEmb": parseInt(input3),
                "nucleosFamiliares": parseInt(adultos),
                "AA_hombres": parseInt(input4),
                "AA_mujeresNoEmb": parseInt(input5),
                "AA_mujeresEmb": parseInt(input6),
                "NNA_A_hombres": parseInt(input7),
                "NNA_A_mujeresNoEmb": parseInt(input8),
                "NNA_A_mujeresEmb": parseInt(input9),
                "NNA_S_hombres": parseInt(input10),
                "NNA_S_mujeresNoEmb": parseInt(input11),
                "NNA_S_mujeresEmb": parseInt(input12)
            }

            await NetInfo.fetch()
                .then(state => {
                    console.log("Net Check Response", state)
                    if (state.isConnected) {
                        var myHeaders = new Headers();
                        myHeaders.append("Content-Type", "application/json");

                        var raw = JSON.stringify([dataObject]);

                        var requestOptions = {
                            method: 'POST',
                            headers: myHeaders,
                            body: raw,
                            redirect: 'follow'
                        };

                        fetch(`${endPoints.InsertC}`, requestOptions)
                            .then(response => response.json())
                            .then(result => console.log("result", result))
                            .catch(error => console.log('error', error));
                    } else {
                        if (InsertCData != null) {
                            let newArray = [...InsertCData]
                            newArray.push(dataObject)
                            dispatch(SaveInsertCData(newArray))
                        } else {
                            dispatch(SaveInsertCData([dataObject]))
                        }
                    }
                })
                .catch((error) => {
                    console.log("Net Check error", error)
                })
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (props?.route?.params?.item) {
            setCountry(props?.route?.params?.item?.nacionalidad)
            setTypeValue(props?.route?.params?.item?.nacionalidad)
            setInput1(props?.route?.params?.item?.AS_hombres)
            setInput2(props?.route?.params?.item?.AS_mujeresNoEmb)
            setInput3(props?.route?.params?.item?.AS_mujeresEmb)
            setAdultos(props?.route?.params?.item?.nucleosfamiliares)
            setInput4(props?.route?.params?.item?.AA_hombres)
            setInput5(props?.route?.params?.item?.AA_mujeresNoEmb)
            setInput6(props?.route?.params?.item?.AA_mujeresEmb)
            setInput7(props?.route?.params?.item?.NNA_A_hombres)
            setInput8(props?.route?.params?.item?.NNA_A_mujeresNoEmb)
            setInput9(props?.route?.params?.item?.NNA_A_mujeresEmb)
            setInput10(props?.route?.params?.item?.NNA_S_hombres)
            setInput11(props?.route?.params?.item?.NNA_S_mujeresNoEmb)
            setInput12(props?.route?.params?.item?.NNA_S_mujeresEmb)
        }
    }, [])

    return (
        <WrapperComponent background={colors.white}>
            <SafeAreaView style={styles.mainContainer}>
                <BackButton />
                <KeyboardAwareScrollView keyboardShouldPersistTaps="always" showsVerticalScrollIndicator={false} contentContainerStyle={appStyles.scrollContainer}>
                    <View style={{ zIndex: 1 }}>
                        <CountryDropDown
                            placeholder={'Ingresa Nacionalidad'}
                            setCountry={(e) => setCountry(e)}
                            onTypeValue={(e) => setTypeValue(e)}
                            country={typeValue}
                        />
                        <Text style={{ textAlign: "center", marginVertical: wp(5), fontSize: fontPixel(14), color: colors.grey_Text, fontFamily: fontFamily.appTextMedium }}>{'Adultos No Acompañados'}</Text>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                            <View style={{ alignItems: "center" }}>
                                <Entypo size={40} name='man' color={colors.green} />
                                <TextInput
                                    value={input1}
                                    keyboardType='number-pad'
                                    onChangeText={(text) => setInput1(text)}
                                    placeholderTextColor={colors.gray_txt}
                                    placeholder='Hombres'
                                    style={{ width: wp(35), textAlign: "center", alignSelf: "center", height: hp(5), borderBottomWidth: 2, borderBottomColor: colors.grey_Text, fontSize: fontPixel(14), fontFamily: fontFamily.appTextMedium, color: colors.black }} />
                            </View>
                            <View style={{ alignItems: "center" }}>
                                <MaterialIcons size={40} name='woman' color={colors.green} />
                                <TextInput
                                    value={input2}
                                    keyboardType='number-pad'
                                    onChangeText={(text) => setInput2(text)}
                                    placeholderTextColor={colors.gray_txt}
                                    placeholder='Mujeres no Embarazadas'
                                    style={{ textAlign: "center", width: wp(35), alignSelf: "center", height: hp(5), borderBottomWidth: 2, borderBottomColor: colors.grey_Text, fontSize: fontPixel(10), fontFamily: fontFamily.appTextMedium, color: colors.black }} />
                            </View>

                        </View>
                        <View style={{ alignItems: "center" }}>
                            <MaterialIcons size={40} name='pregnant-woman' color={colors.green} />
                            <TextInput
                                value={input3}
                                keyboardType='number-pad'
                                onChangeText={(text) => setInput3(text)}
                                placeholderTextColor={colors.gray_txt}
                                placeholder='Mujeres Embarazada'
                                style={{ textAlign: "center", width: wp(35), alignSelf: "center", height: hp(5), borderBottomWidth: 2, borderBottomColor: colors.grey_Text, fontSize: fontPixel(10), fontFamily: fontFamily.appTextMedium, color: colors.black }} />
                        </View>
                    </View>

                    <View>
                        <Text style={{ textAlign: "center", marginVertical: wp(5), fontSize: fontPixel(14), color: colors.grey_Text, fontFamily: fontFamily.appTextMedium }}>{'Numero de Nucleos Familiares'}</Text>
                        <TextInput
                            value={adultos}
                            keyboardType='number-pad'
                            placeholder=''
                            onChangeText={(text) => {
                                setAdultos(text)

                                if (text.length === 1 && text[0] === '0') {
                                    setInput4('0')
                                    setInput5('0')
                                    setInput6('0')
                                    setInput7('0')
                                    setInput8('0')
                                    setInput9('0')
                                } else {
                                    setInput4('')
                                    setInput5('')
                                    setInput6('')
                                    setInput7('')
                                    setInput8('')
                                    setInput9('')
                                }
                                setAdultos(text)
                            }}
                            style={{ textAlign: "center", alignSelf: "center", height: hp(5), width: wp(30), borderBottomWidth: 2, borderBottomColor: colors.green, fontSize: fontPixel(16), fontFamily: fontFamily.appTextMedium, color: colors.black }} />
                        {
                            (adultos > 0) && (
                                <>
                                    <Text style={{ textAlign: "center", marginVertical: wp(5), fontSize: fontPixel(14), color: colors.grey_Text, fontFamily: fontFamily.appTextMedium }}>{'Adultos que Acompañan NNas'}</Text>
                                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                        <View style={{ alignItems: "center" }}>
                                            <Entypo size={40} name='man' color={colors.light_blue} />
                                            <TextInput
                                                value={input4}
                                                keyboardType='number-pad'
                                                onChangeText={(text) => setInput4(text)}
                                                placeholderTextColor={colors.gray_txt}
                                                placeholder='Hombres'
                                                style={{ width: wp(35), textAlign: "center", alignSelf: "center", height: hp(5), borderBottomWidth: 2, borderBottomColor: colors.grey_Text, fontSize: fontPixel(14), fontFamily: fontFamily.appTextMedium, color: colors.black }} />
                                        </View>
                                        <View style={{ alignItems: "center" }}>
                                            <MaterialIcons size={40} name='woman' color={colors.light_blue} />
                                            <TextInput
                                                value={input5}
                                                keyboardType='number-pad'
                                                onChangeText={(text) => setInput5(text)}
                                                placeholderTextColor={colors.gray_txt}
                                                placeholder='Mujeres no Embarazadas'
                                                style={{ textAlign: "center", width: wp(35), alignSelf: "center", height: hp(5), borderBottomWidth: 2, borderBottomColor: colors.grey_Text, fontSize: fontPixel(10), fontFamily: fontFamily.appTextMedium, color: colors.black }} />
                                        </View>

                                    </View>
                                    <View style={{ alignItems: "center" }}>
                                        <MaterialIcons size={40} name='pregnant-woman' color={colors.light_blue} />
                                        <TextInput
                                            value={input6}
                                            keyboardType='number-pad'
                                            onChangeText={(text) => setInput6(text)}
                                            placeholderTextColor={colors.gray_txt}
                                            placeholder='Mujeres Embarazada'
                                            style={{ textAlign: "center", width: wp(35), alignSelf: "center", height: hp(5), borderBottomWidth: 2, borderBottomColor: colors.grey_Text, fontSize: fontPixel(10), fontFamily: fontFamily.appTextMedium, color: colors.black }} />
                                    </View>
                                </>
                            )
                        }
                    </View>

                    {
                        (adultos > 0) && (
                            <View>
                                <Text style={{ textAlign: "center", marginVertical: wp(5), fontSize: fontPixel(14), color: colors.grey_Text, fontFamily: fontFamily.appTextMedium }}>{'NNAs Acompañados'}</Text>
                                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                    <View style={{ alignItems: "center" }}>
                                        <Entypo size={40} name='man' color={colors.redishColor} />
                                        <TextInput
                                            value={input7}
                                            keyboardType='number-pad'
                                            onChangeText={(text) => setInput7(text)}
                                            placeholderTextColor={colors.gray_txt}
                                            placeholder='Hombres'
                                            style={{ width: wp(35), textAlign: "center", alignSelf: "center", height: hp(5), borderBottomWidth: 2, borderBottomColor: colors.grey_Text, fontSize: fontPixel(14), fontFamily: fontFamily.appTextMedium, color: colors.black }} />
                                    </View>
                                    <View style={{ alignItems: "center" }}>
                                        <MaterialIcons size={40} name='woman' color={colors.redishColor} />
                                        <TextInput
                                            value={input8}
                                            keyboardType='number-pad'
                                            onChangeText={(text) => setInput8(text)}
                                            placeholderTextColor={colors.gray_txt}
                                            placeholder='Mujeres no Embarazadas'
                                            style={{ textAlign: "center", width: wp(35), alignSelf: "center", height: hp(5), borderBottomWidth: 2, borderBottomColor: colors.grey_Text, fontSize: fontPixel(10), fontFamily: fontFamily.appTextMedium, color: colors.black }} />
                                    </View>
                                </View>
                                <View style={{ alignItems: "center" }}>
                                    <MaterialIcons size={40} name='pregnant-woman' color={colors.redishColor} />
                                    <TextInput
                                        value={input9}
                                        keyboardType='number-pad'
                                        onChangeText={(text) => setInput9(text)}
                                        placeholderTextColor={colors.gray_txt}
                                        placeholder='Mujeres Embarazada'
                                        style={{ textAlign: "center", width: wp(35), alignSelf: "center", height: hp(5), borderBottomWidth: 2, borderBottomColor: colors.grey_Text, fontSize: fontPixel(10), fontFamily: fontFamily.appTextMedium, color: colors.black }} />
                                </View>
                            </View>
                        )
                    }

                    <View>
                        <Text style={{ textAlign: "center", marginVertical: wp(5), fontSize: fontPixel(14), color: colors.grey_Text, fontFamily: fontFamily.appTextMedium }}>{'NNAs No Acompañados'}</Text>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                            <View style={{ alignItems: "center" }}>
                                <Entypo size={40} name='man' color={colors.grey_Text} />
                                <TextInput
                                    value={input10}
                                    keyboardType='number-pad'
                                    onChangeText={(text) => setInput10(text)}
                                    placeholderTextColor={colors.gray_txt}
                                    placeholder='Hombres'
                                    style={{ width: wp(35), textAlign: "center", alignSelf: "center", height: hp(5), borderBottomWidth: 2, borderBottomColor: colors.grey_Text, fontSize: fontPixel(14), fontFamily: fontFamily.appTextMedium, color: colors.black }} />
                            </View>
                            <View style={{ alignItems: "center" }}>
                                <MaterialIcons size={40} name='woman' color={colors.grey_Text} />
                                <TextInput
                                    value={input11}
                                    keyboardType='number-pad'
                                    onChangeText={(text) => setInput11(text)}
                                    placeholderTextColor={colors.gray_txt}
                                    placeholder='Mujeres no Embarazadas'
                                    style={{ textAlign: "center", width: wp(35), alignSelf: "center", height: hp(5), borderBottomWidth: 2, borderBottomColor: colors.grey_Text, fontSize: fontPixel(10), fontFamily: fontFamily.appTextMedium, color: colors.black }} />
                            </View>
                        </View>
                        <View style={{ alignItems: "center" }}>
                            <MaterialIcons size={40} name='pregnant-woman' color={colors.grey_Text} />
                            <TextInput
                                value={input12}
                                keyboardType='number-pad'
                                onChangeText={(text) => setInput12(text)}
                                placeholderTextColor={colors.gray_txt}
                                placeholder='Mujeres Embarazada'
                                style={{ textAlign: "center", width: wp(35), alignSelf: "center", height: hp(5), borderBottomWidth: 2, borderBottomColor: colors.grey_Text, fontSize: fontPixel(10), fontFamily: fontFamily.appTextMedium, color: colors.black }} />
                        </View>
                    </View>

                    <TouchableOpacity onPress={() => sendData()} style={{ backgroundColor: colors.redishColor, margin: wp(10), alignItems: "center", justifyContent: "center", alignSelf: "center" }}>
                        <Text style={{ textAlign: "center", borderRadius: wp(2), marginVertical: wp(3), marginHorizontal: wp(5), fontSize: fontPixel(14), fontFamily: fontFamily.appTextBold }}>{'GUARDAR'}</Text>
                    </TouchableOpacity>
                </KeyboardAwareScrollView>
            </SafeAreaView>
        </WrapperComponent>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
    },
    mainTitle: {
        textAlign: 'center',
        alignSelf: "center",
        width: wp(90),
        fontSize: fontPixel(26),
        color: colors.grey_Text,
        fontFamily: fontFamily.appTextSemiBold,
    },
})

