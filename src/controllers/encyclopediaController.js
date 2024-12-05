const { v4: uuidv4 } = require("uuid");
const { predict } = require("../service/inferenceEncyclopedia.js");
const pool = require("../utils/database.js");
const classLabels = [
  "Aloe Vera",
  "Apple",
  "Areca Palm",
  "Birds Nest Fern",
  "Blueberry",
  "Cherry",
  "Chinese Evergreen",
  "Corn",
  "Dracaena",
  "Dumb Cane",
  "Elephant Ear",
  "Grape",
  "Monstera Deliciosa",
  "Peach",
  "Pepper Bell",
  "Polka Dot Plant",
  "Ponytail Palm",
  "Potato",
  "Raspberry",
  "Snake Plant",
  "Strawberry",
  "Tomato",
];

const predictPlant = async (req, res, next) => {
  try {
    const file = req.file;

    // Validasi jika file tidak ditemukan
    if (!file) {
      return res.status(400).json({
        status: "fail",
        message: "No image file provided",
      });
    }

    // Proses prediksi gambar
    const imageBuffer = file.buffer;

    // Lakukan prediksi dengan model
    const prediction = await predict(imageBuffer); // Output berupa { labelIndex, confidence }

    if (
      !prediction ||
      prediction.labelIndex === undefined ||
      prediction.confidence === undefined
    ) {
      throw new Error("Invalid prediction result from the model.");
    }

    const { labelIndex, confidence } = prediction;

    // Validasi jika label index di luar jangkauan classLabels
    if (labelIndex < 0 || labelIndex >= classLabels.length) {
      throw new Error("Invalid label index returned from model.");
    }

    const predictedPlant = classLabels[labelIndex];

    // Saran berdasarkan jenis tanaman (opsional, kustomisasi jika perlu)
    const suggestion = `Tanaman ini teridentifikasi sebagai "${predictedPlant}". Lakukan perawatan sesuai kebutuhan tanaman ini.`;

    // Membuat data prediksi untuk respons
    const predictionData = {
      id: uuidv4(),
      plant: predictedPlant,
      confidenceScore: Math.min(confidence.toFixed(2)), // Confidence dalam format persentase
      suggestion,
      createdAt: new Date().toISOString(),
    };

    // Kirim respons
    res.status(201).json({
      status: "success",
      data: predictionData,
    });
  } catch (error) {
    console.error("Prediction Error:", error.message);
    res.status(500).json({
      status: "fail",
      message: "Terjadi kesalahan dalam melakukan prediksi",
    });
  }
};

const getAllEncyclopedia = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM encyclopedias");
    res.status(200).json({
      status: "success",
      data: rows,
    });
  } catch (error) {
    console.error("Error saat mengambil data encyclopedia:", error.message);
    res.status(500).json({
      status: "fail",
      message: "Gagal mengambil data encyclopedia.",
    });
  }
};

const getEncyclopediaById = async (req, res) => {
  try {
    const { id } = req.params; // Ambil ID dari parameter URL

    // Validasi ID (opsional)
    if (!id) {
      return res.status(400).json({
        status: "fail",
        message: "ID tidak diberikan.",
      });
    }

    // Query untuk mencari data berdasarkan ID
    const [rows] = await pool.query(
      "SELECT * FROM encyclopedias WHERE id_encyclopedia = ?",
      [id]
    );

    // Periksa apakah data ditemukan
    if (rows.length === 0) {
      return res.status(404).json({
        status: "fail",
        message: `Data encyclopedia dengan ID ${id} tidak ditemukan.`,
      });
    }

    res.status(200).json({
      status: "success",
      data: rows[0], // Ambil hanya objek pertama karena ID bersifat unik
    });
  } catch (error) {
    console.error("Error saat mengambil data encyclopedia:", error.message);
    res.status(500).json({
      status: "fail",
      message: "Gagal mengambil data encyclopedia.",
    });
  }
};

const getEncyclopediaByName = async (req, res) => {
  try {
    const { name } = req.params; // Ambil nama tanaman dari query parameter

    // Validasi nama tanaman
    if (!name) {
      return res.status(400).json({
        status: "fail",
        message: "Nama tanaman tidak diberikan.",
      });
    }

    // Query untuk mencari data berdasarkan nama tanaman
    const [rows] = await pool.query(
      "SELECT * FROM encyclopedias WHERE name_plant LIKE ?",
      [`%${name}%`] // Gunakan wildcard untuk pencarian seperti
    );

    // Periksa apakah data ditemukan
    if (rows.length === 0) {
      return res.status(404).json({
        status: "fail",
        message: `Data encyclopedia untuk tanaman dengan nama '${name}' tidak ditemukan.`,
      });
    }

    res.status(200).json({
      status: "success",
      data: rows, // Bisa berupa array karena nama mungkin tidak unik
    });
  } catch (error) {
    console.error("Error saat mengambil data encyclopedia:", error.message);
    res.status(500).json({
      status: "fail",
      message: "Gagal mengambil data encyclopedia.",
    });
  }
};

module.exports = { predictPlant, getAllEncyclopedia, getEncyclopediaById, getEncyclopediaByName };
