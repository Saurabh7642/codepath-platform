const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const os = require("os");

// Create a temp output directory if it doesn't exist
const outputPath = path.join(__dirname, "temp");
if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true });
}

const executeCpp = (filePath, inputPath) => {
  const jobId = path.basename(filePath).split(".")[0];
  const isWindows = os.platform() === "win32";

  // 🔁 Use .exe on Windows, .out on Linux/Docker
  const exePath = path.join(outputPath, isWindows ? `${jobId}.exe` : `${jobId}.out`);

  // 🏃 Run command is the same for both, just points to correct binary
  const runCommand = `"${exePath}" < "${inputPath}"`;

  return new Promise((resolve, reject) => {
    // 👇 Compile + Run combined
    const compileCommand = `g++ -std=c++20 "${filePath}" -o "${exePath}" && ${runCommand}`;
    console.log("🔧 Running command:", compileCommand);

    exec(compileCommand, { shell: true }, (error, stdout, stderr) => {
      console.log("🔹 stdout:", stdout);
      console.log("🔸 stderr:", stderr);
      console.log("❗ error:", error);

      // Cleanup files afterward
      try {
        fs.unlinkSync(filePath);
        fs.unlinkSync(inputPath);
        if (fs.existsSync(exePath)) fs.unlinkSync(exePath);
      } catch (cleanupErr) {
        console.warn("🧹 Cleanup warning:", cleanupErr.message);
      }

      if (error) return reject({ error: stderr || error.message });
      if (stderr) return reject({ error: stderr });
      return resolve(stdout);
    });
  });
};

module.exports = { executeCpp };
