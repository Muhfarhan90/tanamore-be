const tf = require("@tensorflow/tfjs-node");
let model;

// Fungsi Load Model
async function loadModel() {
  try {
    if (!model) {
      model = await tf.loadLayersModel(
        "file://src/models/modelDisease/model.json"
      );
      console.log("Disease model loaded successfully");
    }
  } catch (error) {
    console.error("Error loading model:", error.message);
    throw new Error("Failed to load model");
  }
}

// Fungsi Prediksi Penyakit
async function predict(imageBuffer) {
  try {
    // Pastikan model sudah dimuat
    if (!model) {
      await loadModel();
    }

    console.log("Starting prediction...");

    // Preprocessing gambar
    const tensor = tf.node
      .decodeImage(imageBuffer, 3) // Decode image buffer to RGB (3 channels)
      .resizeBilinear([256, 256]) // Resize to match model input dimensions
      .div(255.0) // Normalize pixel values to [0, 1]
      .expandDims(0); // Add batch dimension

    // Lakukan prediksi
    const prediction = model.predict(tensor);

    // Ekstrak skor prediksi
    const score = await prediction.data(); // Mendapatkan array skor
    const labelIndex = score.indexOf(Math.max(...score)); // Index label dengan confidence tertinggi
    const confidence = score[labelIndex] * 100; // Confidence dalam persen

    return { labelIndex, confidence };
  } catch (error) {
    console.error("Prediction error:", error.message);
    throw new Error("Failed to process prediction");
  }
}

module.exports = { predict };
