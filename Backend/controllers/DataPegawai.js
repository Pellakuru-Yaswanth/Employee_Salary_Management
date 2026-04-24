import DataPegawai from "../models/DataPegawaiModel.js";
import argon2 from "argon2";
import path from "path";

// menampilkan semua data Pegawai
export const getDataPegawai = async (req, res) => {
    try {
        const response = await DataPegawai.findAll({
            attributes: [
                'id', 'nik', 'nama_pegawai',
                'jenis_kelamin', 'jabatan', 'tanggal_masuk',
                'status', 'photo', 'hak_akses', 'designation'
            ]
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

// method untuk mencari data Pegawai berdasarkan ID
export const getDataPegawaiByID = async (req, res) => {
    try {
        const response = await DataPegawai.findOne({
            attributes: [
                'id', 'nik', 'nama_pegawai',
                'jenis_kelamin', 'jabatan', 'username', 'tanggal_masuk',
                'status', 'photo', 'hak_akses', 'designation'
            ],
            where: {
                id: req.params.id
            }
        });
        if (response) {
            res.status(200).json(response);
        } else {
            res.status(404).json({ msg: 'Employee data with that ID not found' })
        }
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

// method untuk mencari data pegawai berdasarkan NIK
export const getDataPegawaiByNik = async (req, res) => {
    try {
        const response = await DataPegawai.findOne({
            attributes: [
                'id', 'nik', 'nama_pegawai',
                'jenis_kelamin', 'jabatan', 'tanggal_masuk',
                'status', 'photo', 'hak_akses', 'designation'
            ],
            where: {
                nik: req.params.nik
            }
        });
        if (response) {
            res.status(200).json(response);
        } else {
            res.status(404).json({ msg: 'Employee data with that NIK not found' })
        }
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}


// method untuk mencari data pegawai berdasarkan Nama
export const getDataPegawaiByName = async (req, res) => {
    try {
        const response = await DataPegawai.findOne({
            attributes: [
                'id', 'nik', 'nama_pegawai',
                'jenis_kelamin', 'jabatan', 'tanggal_masuk',
                'status', 'photo', 'hak_akses', 'designation'
            ],
            where: {
                nama_pegawai: req.params.name
            }
        });
        if (response) {
            res.status(200).json(response);
        } else {
            res.status(404).json({ msg: 'Employee data with that Name not found' })
        }
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

//  method untuk tambah data Pegawai
export const createDataPegawai = async (req, res) => {
    const {
        nik, nama_pegawai,
        username, password, confPassword, jenis_kelamin,
        jabatan, tanggal_masuk,
        status, hak_akses, designation
    } = req.body;

    if (password !== confPassword) {
        return res.status(400).json({ msg: "Password and Confirm Password do not match" });
    }

    if (!req.files || !req.files.photo) {
        return res.status(400).json({ msg: "Photo upload failed, please re-upload photo" });
    }

    const file = req.files.photo;
    const fileSize = file.data.length;
    const ext = path.extname(file.name);
    const fileName = file.md5 + ext;
    const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
    const allowedTypes = ['.png', '.jpg', '.jpeg'];

    if (!allowedTypes.includes(ext.toLowerCase())) {
        return res.status(422).json({ msg: "Photo file format not compatible" });
    }

    if (fileSize > 2000000) {
        return res.status(422).json({ msg: "Image size must be less than 2 MB" });
    }

    file.mv(`./public/images/${fileName}`, async (err) => {
        if (err) {
            return res.status(500).json({ msg: err.message });
        }

        const hashPassword = await argon2.hash(password);

        try {
            await DataPegawai.create({
                nik: nik,
                nama_pegawai: nama_pegawai,
                username: username,
                password: hashPassword,
                jenis_kelamin: jenis_kelamin,
                jabatan: jabatan,
                tanggal_masuk: tanggal_masuk,
                status: status,
                photo: fileName,
                url: url,
                hak_akses: hak_akses,
                designation: designation
            });

            res.status(201).json({ success: true, message: "Registration Successful" });
        } catch (error) {
            console.log(error.message);
            res.status(500).json({ success: false, message: error.message });
        }
    });
};


// method untuk update data Pegawai
export const updateDataPegawai = async (req, res) => {
    const pegawai = await DataPegawai.findOne({
        where: {
            id: req.params.id
        }
    });

    if (!pegawai) return res.status(404).json({ msg: "Employee data not found" });
    const {
        nik, nama_pegawai,
        username, jenis_kelamin,
        jabatan, tanggal_masuk,
        status, hak_akses, designation
    } = req.body;

    try {
        await DataPegawai.update({
            nik: nik,
            nama_pegawai: nama_pegawai,
            username: username,
            jenis_kelamin: jenis_kelamin,
            jabatan: jabatan,
            tanggal_masuk: tanggal_masuk,
            status: status,
            hak_akses: hak_akses,
            designation: designation
        }, {
            where: {
                id: pegawai.id
            }
        });
        res.status(200).json({ msg: "Employee data successfully updated" });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
}

// Method untuk update password Pegawai
export const changePasswordAdmin = async (req, res) => {
    const pegawai = await DataPegawai.findOne({
        where: {
            id: req.params.id
        }
    });

    if (!pegawai) return res.status(404).json({ msg: "Employee data not found" });


    const { password, confPassword } = req.body;

    if (password !== confPassword) return res.status(400).json({ msg: "Password and Confirm Password do not match" });

    try {
        if (pegawai.hak_akses === "pegawai") {
            const hashPassword = await argon2.hash(password);

            await DataPegawai.update(
                {
                    password: hashPassword
                },
                {
                    where: {
                        id: pegawai.id
                    }
                }
            );

            res.status(200).json({ msg: "Employee password successfully updated" });
        } else {
            res.status(403).json({ msg: "Forbidden" });
        }
    } catch (error) {
        res.status(500).json({ msg: "Internal Server Error" });
    }
};


// method untuk delete data Pegawai
export const deleteDataPegawai = async (req, res) => {
    const pegawai = await DataPegawai.findOne({
        where: {
            id: req.params.id
        }
    });
    if (!pegawai) return res.status(404).json({ msg: "Employee data not found" });
    try {
        await DataPegawai.destroy({
            where: {
                id: pegawai.id
            }
        });
        res.status(200).json({ msg: "Employee data successfully deleted" });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
}