import cors from 'cors';
import express, { Application} from "express";
import dotenv from "dotenv";
import morgan from "morgan";

dotenv.config();


const app: Application = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

export default app;
