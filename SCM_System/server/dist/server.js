"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const studentRoute_1 = __importDefault(require("./route/studentRoute"));
const compliatnRoute_1 = __importDefault(require("./route/compliatnRoute"));
const adminRoute_1 = __importDefault(require("./route/adminRoute"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const allowedOrigins = [
    'http://localhost:5173',
    'https://scm-system-fawn.vercel.app',
    process.env.FRONTEND_URL,
    process.env.ALLOWED_ORIGIN
].filter(Boolean);
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin)
            return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes('*')) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));
app.use(express_1.default.json());
const Port = process.env.PORT || 3000;
app.use('/api', studentRoute_1.default);
app.use('/api', compliatnRoute_1.default);
app.use('/api', adminRoute_1.default);
app.listen(Port, () => {
    console.log('the server is running ');
});
