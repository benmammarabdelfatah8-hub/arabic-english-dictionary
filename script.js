// Updated script.js

// Function to validate user input to prevent XSS
function sanitizeInput(input) {
    const element = document.createElement('div');
    element.innerText = input;
    return element.innerHTML;
}

// Error handling: Function to fetch translations with error handling
async function fetchTranslation(word) {
    try {
        const response = await fetch(`https://api.example.com/translate?word=${sanitizeInput(word)}`);
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const data = await response.json();
        return data.translation;
    } catch (error) {
        console.error('Error fetching translation:', error);
        alert('There was an error fetching the translation. Please try again later.');
        return null;
    }
}

// Example usage:
const word = 'example';
fetchTranslation(word).then(translation => {
    if (translation) {
        console.log(`Translation: ${translation}`);
    }
});