import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import env from 'dotenv';
import userRoutes from './routes/userroutes.js';
import uploadRoutes from './routes/paperRoutes.js';
import cloudinaryRoutes from './routes/cloudinary.js';

env.config();

const app = express();
const allowedOrigins = [
    'https://gcsmart-paper.vercel.app',
    'http://localhost:8080',
    'http://localhost:3000',
    'http://localhost:5173',
    'https://gcsmart-paper.vercel.app',
];
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            console.log('❌ Blocked origin:', origin);
            callback(null, true); // Allow all origins in development
            // For production, use: callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With'],
}));

// Handle preflight requests
app.options('*', cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/upload', uploadRoutes);
app.use("/api/user", userRoutes);
app.use("/api/cloudinary", cloudinaryRoutes);

app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'API is running',
        timestamp: new Date().toISOString()
    });
});

app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error'
    });
});

const connectDB = async () => {
    try {
        console.log('Connecting to MongoDB...');
        console.log('Using connection string from .env');

        const options = {
            serverSelectionTimeoutMS: 30000,
            socketTimeoutMS: 60000,
            connectTimeoutMS: 30000,
            maxPoolSize: 10,
            minPoolSize: 2,
            retryWrites: true,
            w: 'majority',
            tls: true,
            tlsAllowInvalidCertificates: true,
            tlsAllowInvalidHostnames: true,
            family: 4,
        };

        await mongoose.connect(process.env.MONGOURI, options);

        const db = mongoose.connection.db;
        const dbName = db ? db.databaseName : 'unknown';

        console.log('MongoDB Connected Successfully');
        console.log('Database:', dbName);
        console.log('Host:', mongoose.connection.host);
        console.log('Connection State:', mongoose.connection.readyState);

        return true;
    } catch (error) {
        console.error('Connection failed:', error.message);
        return false;
    }
};

const PORT = process.env.PORT || 5000;

connectDB().then((connected) => {
    if (connected) {
        app.listen(PORT, '0.0.0.0', () => {
            console.log('Server running on port', PORT);
            console.log('http://localhost:' + PORT);
        });
    } else {
        console.error('Failed to connect to database');
        console.log('Troubleshooting:');
        console.log('4. Check IP whitelist (0.0.0.0/0 is set)');
        process.exit(1);
    }
});

process.on('SIGINT', async () => {
    console.log('Shutting down gracefully...');
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
    process.exit(0);
});

process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err);
    process.exit(1);
});