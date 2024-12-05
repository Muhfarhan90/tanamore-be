const { v4: uuidv4 } = require("uuid");
const { predict } = require("../service/inferenceDisease.js");
// const { getDiseaseInfoByName } = require("../service/inferenceDisease");
const pool = require("../utils/database.js");

const classLabels = [
  "Apple Apple scab", // 0
  "Apple Black rot", // 1
  "Apple Cedar apple rust", // 2
  "Apple healthy", // 3
  "Background without leaves", // 4
  "Blueberry healthy", // 5
  "Cherry Powdery mildew", // 6
  "Cherry healthy", // 7
  "Corn Cercospora leaf spot Gray leaf spot", // 8
  "Corn Common rust", // 9
  "Corn Northern Leaf Blight", // 10
  "Corn healthy", // 11
  "Grape Black rot", // 12
  "Grape Esca (Black Measles)", // 13
  "Grape Leaf blight (Isariopsis Leaf Spot)", // 14
  "Grape healthy", // 15
  "Orange Haunglongbing (Citrus greening)", // 16
  "Peach Bacterial spot", // 17
  "Peach healthy", // 18
  "Pepper bell Bacterial spot", // 19
  "Pepper bell healthy", // 20
  "Potato Early blight", // 21
  "Potato Late blight", // 22
  "Potato healthy", // 23
  "Raspberry healthy", // 24
  "Soybean healthy", // 25
  "Squash Powdery mildew", // 26
  "Strawberry Leaf scorch", // 27
  "Strawberry healthy", // 28
  "Tomato Bacterial spot", // 29
  "Tomato Early blight", // 30
  "Tomato Late blight", // 31
  "Tomato Leaf Mold", // 32
  "Tomato Septoria leaf spot", // 33
  "Tomato Spider mites Two-spotted spider mite", // 34
  "Tomato Target Spot", // 35
  "Tomato Tomato Yellow Leaf Curl Virus", // 36
  "Tomato Tomato mosaic virus", // 37
  "Tomato healthy", // 38
];

const predictDisease = async (req, res, next) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        status: "fail",
        message: "No image file provided",
      });
    }

    // Preprocessing gambar (opsional, bergantung pada model)
    const imageBuffer = file.buffer;

    // Lakukan prediksi menggunakan model
    const prediction = await predict(imageBuffer); // Hasil: confidence score

    if (
      !prediction ||
      prediction.labelIndex === undefined ||
      prediction.confidence === undefined
    ) {
      throw new Error("Invalid prediction result from the model.");
    }
    // Ambil hasil label dan confidence score
    const { labelIndex, confidence } = prediction;
    const predictedDisease = classLabels[labelIndex];

    // Ambil informasi penyakit dari database
    // const diseaseInfo = await getDiseaseInfoByName(predictedDisease);

    // if (!diseaseInfo) {
    //   return res.status(404).json({
    //     status: "fail",
    //     message: `No data found for disease: ${predictedDisease}`,
    //   });
    // }

    // Kembalikan hasil prediksi dan data penyakit
    res.status(200).json({
      status: "success",
      data: {
        prediction: {
          id: uuidv4(),
          name: predictedDisease,
          confidence: Math.min(confidence.toFixed(2)), // Confidence dalam persen
        },
        // diseaseInfo,
      },
    });
  } catch (error) {
    console.error("Prediction Error:", error.message);
    return res.status(400).json({
      status: "fail",
      message: "Terjadi kesalahan dalam melakukan prediksi",
    });
  }
};

const getAllDisease = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM disease");
    res.status(200).json({
      status: "success",
      data: rows,
    });
  } catch (error) {
    console.error("Error saat mengambil data penyakit:", error.message);
    res.status(500).json({
      status: "fail",
      message: "Gagal mengambil data penyakit.",
    });
  }
};
module.exports = { predictDisease, getAllDisease };
