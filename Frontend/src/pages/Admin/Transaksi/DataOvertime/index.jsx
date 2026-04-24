import { useState, useEffect } from 'react';
import moment from 'moment';
import Layout from '../../../../layout';
import { Link, useNavigate } from 'react-router-dom';
import { Breadcrumb, ButtonOne } from '../../../../components';
import { FaPlus } from 'react-icons/fa'
import { BsTrash3 } from 'react-icons/bs'
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { BiSearch } from 'react-icons/bi'
import { MdKeyboardDoubleArrowLeft, MdKeyboardDoubleArrowRight } from 'react-icons/md'
import { deleteDataOvertime, getDataOvertime, getMe } from '../../../../config/redux/action';

const ITEMS_PER_PAGE = 5;

const DataOvertime = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [filterNama, setFilterNama] = useState("");

    const { dataOvertime } = useSelector((state) => state.dataOvertime);
    const { isError, user } = useSelector((state) => state.auth);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(getDataOvertime());
        dispatch(getMe());
    }, [dispatch]);

    useEffect(() => {
        if (isError) {
            navigate('/login');
        }
        if (user && user.hak_akses !== 'admin') {
            navigate('/dashboard');
        }
    }, [isError, user, navigate]);

    const filteredData = dataOvertime.filter((item) =>
        item.nama_pegawai.toLowerCase().includes(filterNama.toLowerCase()) ||
        item.nik.includes(filterNama)
    );

    const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentData = filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const goToPrevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);
    const goToNextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);

    const onDelete = (id) => {
        Swal.fire({
            title: 'Confirmation',
            text: 'Are you sure you want to delete this entry?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                dispatch(deleteDataOvertime(id)).then(() => {
                    Swal.fire('Deleted!', 'Overtime entry has been deleted.', 'success');
                });
            }
        });
    };

    return (
        <Layout>
            <Breadcrumb pageName='Overtime Data' />

            <div className='rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1 mt-6'>
                <div className="flex justify-between items-center mb-6 flex-col md:flex-row">
                    <div className="relative flex-1 mb-4 md:mb-0">
                        <input
                            type='text'
                            placeholder='Search by name or NIK...'
                            value={filterNama}
                            onChange={(e) => setFilterNama(e.target.value)}
                            className='w-full md:w-80 rounded-lg border-[1.5px] border-stroke bg-transparent py-2 pl-10 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                        />
                        <span className='absolute left-3 top-1/2 -translate-y-1/2 text-xl'>
                            <BiSearch />
                        </span>
                    </div>
                    <Link to='/data-overtime/add'>
                        <ButtonOne>
                            <span>Add Overtime</span>
                            <FaPlus />
                        </ButtonOne>
                    </Link>
                </div>

                <div className='max-w-full overflow-x-auto'>
                    <table className='w-full table-auto'>
                        <thead>
                            <tr className='bg-gray-2 text-left dark:bg-meta-4'>
                                <th className='py-4 px-4 font-medium text-black dark:text-white'>No</th>
                                <th className='py-4 px-4 font-medium text-black dark:text-white'>NIK</th>
                                <th className='py-4 px-4 font-medium text-black dark:text-white'>Name</th>
                                <th className='py-4 px-4 font-medium text-black dark:text-white'>Date</th>
                                <th className='py-4 px-4 font-medium text-center text-black dark:text-white'>Hours</th>
                                <th className='py-4 px-4 font-medium text-black dark:text-white'>Reason</th>
                                <th className='py-4 px-4 font-medium text-black dark:text-white'>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentData.map((data, index) => (
                                <tr key={data.id} className="border-b border-[#eee] dark:border-strokedark">
                                    <td className='py-5 px-4'><p className='text-black dark:text-white'>{startIndex + index + 1}</p></td>
                                    <td className='py-5 px-4'><p className='text-black dark:text-white'>{data.nik}</p></td>
                                    <td className='py-5 px-4'><p className='text-black dark:text-white'>{data.nama_pegawai}</p></td>
                                    <td className='py-5 px-4'><p className='text-black dark:text-white'>{moment(data.tanggal).format('DD/MM/YYYY')}</p></td>
                                    <td className='py-5 px-4 text-center'><p className='text-black dark:text-white'>{data.jam_overtime}</p></td>
                                    <td className='py-5 px-4'><p className='text-black dark:text-white'>{data.keterangan}</p></td>
                                    <td className='py-5 px-4'>
                                        <button onClick={() => onDelete(data.id)} className='text-danger hover:text-red-700'>
                                            <BsTrash3 className="text-xl" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="flex justify-between items-center mt-6 flex-col md:flex-row">
                    <span className="text-sm text-gray-500 mb-4 md:mb-0">
                        Showing {startIndex + 1} to {Math.min(startIndex + ITEMS_PER_PAGE, filteredData.length)} of {filteredData.length} entries
                    </span>
                    <div className="flex space-x-2">
                        <button disabled={currentPage === 1} onClick={goToPrevPage} className="p-2 border rounded-lg disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-strokedark">
                            <MdKeyboardDoubleArrowLeft />
                        </button>
                        <span className="py-1 px-4 bg-primary text-white rounded-lg">{currentPage}</span>
                        <button disabled={currentPage === totalPages} onClick={goToNextPage} className="p-2 border rounded-lg disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-strokedark">
                            <MdKeyboardDoubleArrowRight />
                        </button>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default DataOvertime;
