const fs = require('fs');
const path = require('path');
const { v4: uuid } = require('uuid');

const dirInputs = path.join(__dirname, 'inputs');

if (!fs.existsSync(dirInputs)) {
    fs.mkdirSync(dirInputs, { recursive: true });
}

// Creates a temporary file with user's input content
const generateInputFile = async (content) => {
    const jobID = uuid();
    const filename = `${jobID}.txt`;
    const filePath = path.join(dirInputs, filename);
    await fs.writeFileSync(filePath, content);
    return filePath;
};

module.exports = {
    generateInputFile,
};
