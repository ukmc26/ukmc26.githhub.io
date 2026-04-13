// SPHERO MAX SPEED (255) IS 2 M/S IN REAL LIFE
const globalMultiplier = 0.15;

const submitBtn = document.getElementById('submitBtn');
const textInput = document.getElementById('textInput');
const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');

// Resize canvas to fit the right panel
canvas.width = window.innerWidth / 2;
canvas.height = window.innerHeight;

// Starting point at the center of the canvas
let startX = canvas.width / 2;
let startY = canvas.height / 2;

// Function to handle the "submit" button click
submitBtn.addEventListener('click', () => {
    const text = textInput.value;
    if (text) {
        const parsedCommands = parseCommands(text);
        console.log(parsedCommands); // Check the parsed result in the console
        drawOnCanvas(parsedCommands); // Draw lines based on the parsed commands
    }
});

// Function to parse the commands like roll(x, y, z) into a list of lists
function parseCommands(input) {
    const regex = /roll\((\d+),\s*(\d+),\s*(\d+)\)/g; // Matches roll(x, y, z)
    let match;
    const commands = [];

    // Extract all matches and push them into the commands array
    while ((match = regex.exec(input)) !== null) {
        const values = [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])];
        commands.push(values);
    }

    return commands;
}

// Function to draw lines on the canvas based on the parsed commands
function drawOnCanvas(commands) {
    // Clear the canvas before drawing
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Starting point (center of the canvas)
    let x = startX;
    let y = startY;

    // Loop through each command
    commands.forEach(command => {
        const [direction, force, multiplier] = command;

        // Normalize force (y) from 0-255 to 0-2
        const normalizedForce = force / 128;

        // Calculate the line length
        const lineLength = normalizedForce * 100; // You can adjust the scale here

        // Convert the direction (degrees) to radians
        const angle = Math.PI / 180 * direction - Math.PI / 2;

        // Calculate the end position of the line
        const endX = x + Math.cos(angle) * lineLength * multiplier * globalMultiplier;
        const endY = y + Math.sin(angle) * lineLength * multiplier * globalMultiplier;

        // Draw the line
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Update the current position (end of the last line)
        x = endX;
        y = endY;
    });
}