import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../assets/colors';
import { FontAwesome } from 'react-native-vector-icons';

export default function ContactScreen() {
    const members = ['Adam Simcoe', 'Christian Do', 'Nhan Tran', 'Nhu Ly', 'Trang Nguyen'];

    return (
        <View style={styles.container}>
            <Text style={styles.title}>CONTACT US</Text>

            {/* Divider */}
            <View style={styles.divider} />

            <View style={styles.section}>
                <View style={styles.roundedItem}>
                    <FontAwesome name="phone" size={24} color={Colors.greyBlue} style={styles.icon} />
                    <Text style={styles.roundedText}>(416) 415-2000</Text>
                </View>

                <View style={styles.roundedItem}>
                    <FontAwesome name="envelope" size={24} color={Colors.greyBlue} style={styles.icon} />
                    <Text style={styles.roundedText}>contact@budgetboss.ca</Text>
                </View>

                <View style={styles.roundedItem}>
                    <FontAwesome name="map-pin" size={24} color={Colors.greyBlue} style={styles.icon} />
                    <Text style={styles.roundedText}>160 Kendal Ave{"\n"} Toronto, ON M5R 1M3</Text>
                </View>
            </View>

             {/* Divider */}
            <View style={styles.divider} />

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Members</Text>
                {members.map((member, index) => (
                    <View key={index} style={styles.roundedItem}>
                        <FontAwesome name="user" size={24} color={Colors.greyBlue} style={styles.icon} />
                        <Text style={styles.roundedText}>{member}</Text>
                    </View>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 30,
        backgroundColor: '#F5F5F5',
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        color: Colors.primaryBlue,
        marginBottom: 20,
        textAlign: 'center',
    },
    section: {
        width: '100%',
        alignItems: 'center',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.primaryBlue,
        marginBottom: 10,
        textAlign: 'center',
    },
    roundedItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: Colors.greyBlue,
        marginBottom: 10,
        width: '100%',
    },
    icon: {
        marginRight: 10,
    },
    roundedText: {
        fontSize: 16,
        color: Colors.darkBlue,
        textAlign: 'center',
    },
    divider: {
        width: '80%',
        height: 2,
        backgroundColor: Colors.lightBlue,
        marginVertical: 20,
        alignSelf: 'center',
    },
});
