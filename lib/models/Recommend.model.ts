import mongoose from "mongoose";
const recommendSchema = new mongoose.Schema({
  id: { type: String, require: true },
  name: String,
  restar: {
    type: Number,
    default: 0
  }
})
const Recommend = mongoose.models.recommend || mongoose.model("Recommend", recommendSchema);
export default Recommend;