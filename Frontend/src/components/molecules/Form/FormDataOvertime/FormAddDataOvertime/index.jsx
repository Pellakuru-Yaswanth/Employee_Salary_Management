import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import Layout from '../../../../../layout';
import { Breadcrumb, ButtonOne, ButtonTwo } from '../../../../../components';
import { createDataOvertime, getMe } from '../../../../../config/redux/action';
import Swal from 'sweetalert2';
import moment from 'moment';

const FormAddDataOvertime = () => {
    const [formData, setFormData] = useState({
        nik: '',
        tanggal: moment().format('YYYY-MM-DD'),
        jam_overtime: '',
        keterangan: ''
    });
    const [workers, setWorkers] = useState([]);
    const [errors, setErrors] = useState({});

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isError, user } = useSelector((state) => state.auth);

    useEffect(() => {
        dispatch(getMe());
        fetchWorkers();
    }, [dispatch]);

    useEffect(() => {
        if (isError) navigate('/login');
        if (user && user.hak_akses !== 'admin') navigate('/dashboard');
    }, [isError, user, navigate]);

    const fetchWorkers = async () => {
        try {
            const response = await axios.get('http://localhost:5000/data_pegawai');
            setWorkers(response.data);
        } catch (error) {
            console.error('Error fetching workers:', error);
        }
    };

    const validate = () => {
        const newErrors = {};
        const { nik, tanggal, jam_overtime, keterangan } = formData;

        if (!nik) newErrors.nik = 'Worker selection is required';
        if (!tanggal) newErrors.tanggal = 'Date is required';
        if (!jam_overtime) newErrors.jam_overtime = 'Overtime hours are required';
        else if (jam_overtime < 1 || jam_overtime > 6) newErrors.jam_overtime = 'Hours must be between 1 and 6';

        if (!keterangan) newErrors.keterangan = 'Reason is required';
        else if (keterangan.length < 10) newErrors.keterangan = 'Reason must be at least 10 characters';

        const inputDate = moment(tanggal);
        const today = moment().startOf('day');
        const sevenDaysAgo = moment().subtract(7, 'days').startOf('day');

        if (inputDate.isAfter(today)) newErrors.tanggal = 'Date cannot be in the future';
        if (inputDate.isBefore(sevenDaysAgo)) newErrors.tanggal = 'Date cannot be more than 7 days in the past';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            await dispatch(createDataOvertime(formData, navigate));
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Overtime recorded successfully',
                timer: 1500
            });
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Submission Failed',
                text: error.response.data.msg
            });
        }
    };

    return (
        <Layout>
            <Breadcrumb pageName="Input Overtime" />
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark mt-6">
                <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                    <h3 className="font-medium text-black dark:text-white">Overtime Entry Form</h3>
                </div>
                <form onSubmit={handleSubmit} className="p-6.5">
                    <div className="mb-4.5">
                        <label className="mb-2.5 block text-black dark:text-white">Worker <span className="text-meta-1">*</span></label>
                        <select
                            name="nik"
                            value={formData.nik}
                            onChange={handleChange}
                            className={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input ${errors.nik ? 'border-meta-1' : ''}`}
                        >
                            <option value="">Select Worker</option>
                            {workers.map(worker => (
                                <option key={worker.id} value={worker.nik}>{worker.nama_pegawai} ({worker.nik})</option>
                            ))}
                        </select>
                        {errors.nik && <p className="text-meta-1 text-sm mt-1">{errors.nik}</p>}
                    </div>

                    <div className="mb-4.5">
                        <label className="mb-2.5 block text-black dark:text-white">Date <span className="text-meta-1">*</span></label>
                        <input
                            type="date"
                            name="tanggal"
                            value={formData.tanggal}
                            onChange={handleChange}
                            className={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input ${errors.tanggal ? 'border-meta-1' : ''}`}
                        />
                        {errors.tanggal && <p className="text-meta-1 text-sm mt-1">{errors.tanggal}</p>}
                    </div>

                    <div className="mb-4.5">
                        <label className="mb-2.5 block text-black dark:text-white">Hours (1-6) <span className="text-meta-1">*</span></label>
                        <input
                            type="number"
                            name="jam_overtime"
                            placeholder="Enter hours"
                            value={formData.jam_overtime}
                            onChange={handleChange}
                            className={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input ${errors.jam_overtime ? 'border-meta-1' : ''}`}
                        />
                        {errors.jam_overtime && <p className="text-meta-1 text-sm mt-1">{errors.jam_overtime}</p>}
                    </div>

                    <div className="mb-6">
                        <label className="mb-2.5 block text-black dark:text-white">Reason <span className="text-meta-1">*</span></label>
                        <textarea
                            rows="4"
                            name="keterangan"
                            placeholder="At least 10 characters"
                            value={formData.keterangan}
                            onChange={handleChange}
                            className={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input ${errors.keterangan ? 'border-meta-1' : ''}`}
                        ></textarea>
                        {errors.keterangan && <p className="text-meta-1 text-sm mt-1">{errors.keterangan}</p>}
                    </div>

                    <div className="flex gap-4">
                        <ButtonOne type="submit">Submit for Processing</ButtonOne>
                        <Link to="/data-overtime">
                            <ButtonTwo type="button">Cancel</ButtonTwo>
                        </Link>
                    </div>
                </form>
            </div>
        </Layout>
    );
};

export default FormAddDataOvertime;
