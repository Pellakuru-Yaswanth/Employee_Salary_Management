import express from 'express';
import cors from 'cors';
import session from 'express-session';
import dotenv from 'dotenv';
import db from './config/Database.js';

import SequelizeStore from 'connect-session-sequelize';
import FileUpload from 'express-fileupload';

import UserRoute from './routes/UserRoute.js';
import AuthRoute from './routes/AuthRoute.js';

const app = express();

const sessionStore = SequelizeStore(session.Store);
const store = new sessionStore({
    db: db
});

import DataPegawai from './models/DataPegawaiModel.js';
import argon2 from 'argon2';

import DataJabatan from './models/DataJabatanModel.js';
import PotonganGaji from './models/PotonganGajiModel.js';
import DataOvertime from './models/DataOvertimeModel.js';

(async() => {
    await db.sync();
    // Seed initial admin if not exists
    const adminExists = await DataPegawai.findOne({ where: { hak_akses: 'admin' } });
    if (!adminExists) {
        const hashPassword = await argon2.hash("admin123");
        const admin = await DataPegawai.create({
            nik: "1234567890123456",
            nama_pegawai: "Main Admin",
            username: "admin",
            password: hashPassword,
            jenis_kelamin: "Male",
            jabatan: "Admin",
            tanggal_masuk: "2023-01-01",
            status: "Permanent",
            photo: "default.png",
            url: "http://localhost:5000/images/default.png",
            hak_akses: "admin"
        });
        console.log("Initial admin user created: admin / admin123");

        // Seed sample positions
        await DataJabatan.create({
            nama_jabatan: "Software Engineer",
            gaji_pokok: 8000000,
            tj_transport: 1000000,
            uang_makan: 500000,
            userId: admin.id
        });
        await DataJabatan.create({
            nama_jabatan: "HR Manager",
            gaji_pokok: 7000000,
            tj_transport: 800000,
            uang_makan: 400000,
            userId: admin.id
        });

        // Seed sample deductions
        await PotonganGaji.create({ potongan: "sick", jml_potongan: 100000 });
        await PotonganGaji.create({ potongan: "unexcused", jml_potongan: 200000 });
        console.log("Sample positions and deductions created.");
    }
})();

dotenv.config();

// Middleware
app.use(session({
    secret: process.env.SESS_SECRET,
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: {
        secure: 'auto'
    }
}));

app.use(cors ({
    credentials: true,
    origin: 'http://localhost:5173'
}));


app.use(express.json());

app.use(FileUpload());
app.use(express.static("public"));

app.use(UserRoute);
app.use(AuthRoute);

store.sync();

app.listen(process.env.APP_PORT, () => {
    console.log('Server up and running...');
});