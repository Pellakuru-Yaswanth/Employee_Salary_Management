import DataOvertime from "../models/DataOvertimeModel.js";
import DataPegawai from "../models/DataPegawaiModel.js";
import { Op } from "sequelize";
import moment from "moment";

// Get all overtime entries
export const getOvertime = async (req, res) => {
    try {
        const response = await DataOvertime.findAll();
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

// Create new overtime entry
export const createOvertime = async (req, res) => {
    const { nik, tanggal, jam_overtime, keterangan } = req.body;

    // 1. Basic Frontend-equivalent validations
    if (!nik || !tanggal || !jam_overtime || !keterangan) {
        return res.status(400).json({ msg: "All fields are required" });
    }

    if (jam_overtime < 1 || jam_overtime > 6) {
        return res.status(400).json({ msg: "Overtime hours must be between 1 and 6 hours" });
    }

    if (keterangan.length < 10) {
        return res.status(400).json({ msg: "Reason must be at least 10 characters long" });
    }

    const inputDate = moment(tanggal);
    const today = moment().startOf('day');
    const sevenDaysAgo = moment().subtract(7, 'days').startOf('day');

    if (inputDate.isAfter(today)) {
        return res.status(400).json({ msg: "Date cannot be in the future" });
    }

    if (inputDate.isBefore(sevenDaysAgo)) {
        return res.status(400).json({ msg: "Date cannot be more than 7 days in the past" });
    }

    try {
        // 2. Worker existence check
        const worker = await DataPegawai.findOne({
            where: { nik: nik }
        });

        if (!worker) {
            return res.status(404).json({ msg: "Worker not found in the system" });
        }

        // 3. Duplicate check (same worker + same date)
        const existingEntry = await DataOvertime.findOne({
            where: {
                nik: nik,
                tanggal: tanggal
            }
        });

        if (existingEntry) {
            return res.status(400).json({ msg: "An overtime entry already exists for this worker on this date" });
        }

        // 4. Monthly cap check (60 hours)
        const startOfMonth = inputDate.clone().startOf('month').format('YYYY-MM-DD');
        const endOfMonth = inputDate.clone().endOf('month').format('YYYY-MM-DD');

        const monthlyTotal = await DataOvertime.sum('jam_overtime', {
            where: {
                nik: nik,
                tanggal: {
                    [Op.between]: [startOfMonth, endOfMonth]
                }
            }
        }) || 0;

        if (monthlyTotal + parseInt(jam_overtime) > 60) {
            return res.status(400).json({ 
                msg: `Total monthly overtime would exceed the 60-hour cap (Current total: ${monthlyTotal} hours)` 
            });
        }

        // 5. Create the entry
        await DataOvertime.create({
            nik: nik,
            nama_pegawai: worker.nama_pegawai,
            tanggal: tanggal,
            jam_overtime: jam_overtime,
            keterangan: keterangan
        });

        res.status(201).json({ msg: "Overtime entry successfully recorded" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

// Delete overtime entry
export const deleteOvertime = async (req, res) => {
    try {
        const entry = await DataOvertime.findOne({
            where: { id: req.params.id }
        });

        if (!entry) return res.status(404).json({ msg: "Entry not found" });

        await DataOvertime.destroy({
            where: { id: entry.id }
        });

        res.status(200).json({ msg: "Overtime entry deleted successfully" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};
