import DataPegawai from '../models/DataPegawaiModel.js'

export const verifyUser = async(req, res, next) =>{
    if(!req.session.userId){
        return res.status(401).json({msg: "Please login to your account!"});
    }
    try {
        const pegawai = await DataPegawai.findOne({
            where: {
                id_pegawai: req.session.userId
            }
        });
        if(!pegawai) return res.status(404).json({msg: "User not found"});
        req.userId = pegawai.id;
        req.hak_akses = pegawai.hak_akses;
        next();
    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: "Internal Server Error" });
    }
}

export const adminOnly = async (req, res, next) => {
    try {
        const pegawai = await DataPegawai.findOne({
            where:{
                id_pegawai: req.session.userId
            }
        });
        if(!pegawai) return res.status(404).json({msg: "Employee data not found"});
        if(pegawai.hak_akses !== "admin") return res.status(403).json({msg: "Forbidden access"});
        next();
    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: "Internal Server Error" });
    }
}