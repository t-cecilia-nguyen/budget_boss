import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Colors } from '../assets/colors';
import { FontAwesome6 } from '@expo/vector-icons';
import axios from 'axios';

export default function SubmitFeedbackScreen() {
    const [selectedRating, setSelectedRating] = useState(null);
    const [liked, setLiked] = useState('');
    const [message, setMessage] = useState('');

    const ratingFaces = [
        { label: 'Angry 😠', icon: 'angry' },
        { label: 'Sad 🙁', icon: 'frown' },
        { label: 'Neutral 😐', icon: 'face-meh' },
        { label: 'Happy 🙂', icon: 'face-smile' },
        { label: 'Very Happy 😄', icon: 'grin-beam' },
    ];

    const ratingSelect = (index) => {
        setSelectedRating(index);
    };

    const submit = async () => {
        if (selectedRating === null) {
            alert("Please rate your experience before submitting.");
            return;
        }
    
        const formData = {
            rating: ratingFaces[selectedRating]?.label,
            liked,
            message,
        };
    
        try {
            const response = await axios.post("https://formspree.io/f/xvgzqbgz", formData, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
    
            if (response.status == 200) {
                alert("Thank you for your feedback!");
                setSelectedRating(null);
                setLiked('');
                setMessage('');
            } else {
                alert("Failed to submit feedback. Please try again.");
            }
        } catch (error) {
            console.error("Error submitting feedback:", error);
            alert("An error occurred.");
        }
    };    

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Share your feedback</Text>

            <View style={styles.ratingContainer}>
                <Text style={styles.ratingTitle}>Rate your experience</Text>
                <View style={styles.faces}>
                    {ratingFaces.map((face, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[styles.face, selectedRating === index && styles.selectedFace]}
                            onPress={() => ratingSelect(index)}
                        >
                            <FontAwesome6 name={face.icon} size={40} color={selectedRating === index ? Colors.accentYellow : Colors.greyBlue} />
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Leave a comment (optional)</Text>
                <TextInput
                    style={styles.textArea}
                    placeholder="Enter your message here..."
                    multiline
                    numberOfLines={10}
                    value={message}
                    onChangeText={setMessage}
                />
            </View>

            <TouchableOpacity style={styles.button} onPress={submit}>
                <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#F5F5F5',
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        color: Colors.primaryBlue,
        marginBottom: 20,
        textAlign: 'center',
    },
    ratingContainer: {
        marginBottom: 20,
    },
    ratingTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.primaryBlue,
        textAlign: 'center',
        marginBottom: 10,
    },
    faces: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    face: {
        padding: 10,
    },
    selectedFace: {
        borderRadius: 10,
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.primaryBlue,
        marginBottom: 10,
    },
    textInput: {
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: Colors.greyBlue,
        fontSize: 16,
        color: Colors.darkBlue,
        height: 50,
    },
    textArea: {
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: Colors.greyBlue,
        fontSize: 16,
        color: Colors.darkBlue,
        height: 150,
        textAlignVertical: 'top',
    },
    button: {
        backgroundColor: Colors.primaryBlue,
        paddingVertical: 12,
        borderRadius: 20,
        alignItems: 'center',
        marginTop: 15,
        paddingHorizontal: 20,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
