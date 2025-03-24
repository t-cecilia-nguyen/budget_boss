import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Colors } from '../assets/colors';
import { FontAwesome6 } from '@expo/vector-icons';
import axios from 'axios';
import Toast from "react-native-toast-message";

export default function SubmitFeedbackScreen() {
    const [selectedRating, setSelectedRating] = useState(null);
    const [liked, setLiked] = useState('');
    const [message, setMessage] = useState('');

    // Rating faces
    const ratingFaces = [
        { label: 'Angry 😠', icon: 'angry' },
        { label: 'Sad 🙁', icon: 'frown' },
        { label: 'Neutral 😐', icon: 'face-meh' },
        { label: 'Happy 🙂', icon: 'face-smile' },
        { label: 'Very Happy 😄', icon: 'grin-beam' },
    ];

    // Select rating
    const ratingSelect = (index) => {
        setSelectedRating(index);
    };

    // Submit feedback
    const submit = async () => {
        // Check if rating is not selected
        if (selectedRating === null) {
            Toast.show({
                text1: "Feedback Error",
                text2: "Please rate your experience before submitting.",
                position: 'top',
                topOffset: 8,
                type: 'error',
                visibilityTime: 4000,
            });
            return;
        }
    
        // Form data
        const formData = {
            rating: ratingFaces[selectedRating]?.label,
            liked,
            message,
        };
    
        try {
            // Send POST request to Formspree
            const response = await axios.post("https://formspree.io/f/xvgzqbgz", formData, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
    
            if (response.status == 200) {
                // Success
                Toast.show({
                    text1: "Feedback received!",
                    text2: "Thank you for helping us improve.",
                    position: 'top',
                    topOffset: 8,
                    type: 'success',
                    visibilityTime: 4000,
                });
                setSelectedRating(null);
                setLiked('');
                setMessage('');
            } else {
                // Error
                alert("Failed to submit feedback. Please try again.");
            }
        } catch (error) {
            // Error
            console.error("Error submitting feedback:", error);
            alert("An error occurred.");
        }
    };    

    return (
        <View style={styles.container}>
            {/* Feedback Title */}
            <Text style={styles.title}>Share your feedback</Text>

            <View style={styles.ratingContainer}>
                {/* Rating Title */}
                <Text style={styles.ratingTitle}>Rate your experience</Text>
                {/* Rating Faces */}
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
                {/* Comment */}
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

            {/* Empty section for spacing */}
            <View style={styles.emptySection}></View>

            {/* Submit button */}
            <TouchableOpacity style={styles.button} onPress={submit}>
                <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>

            <Toast/>
        </View>
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
    emptySection: {
        flex: 1,
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
