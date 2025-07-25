import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { UserContext } from '../contexts/UserContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../css/my-cv.css';

function MyCV() {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    
    // File management states
    const [uploadedFiles, setUploadedFiles] = useState({
        languageCerts: [], // Chứng chỉ ngôn ngữ (IELTS/TOEFL)
        personalDocs: [],  // Hồ sơ cá nhân (CV, SOP, thư giới thiệu)
        academicDocs: []   // Các giấy tờ học tập và chứng chỉ
    });
    const [filePreview, setFilePreview] = useState(null);

    useEffect(() => {
        if (!user.isLoggedIn) {
            navigate('/auth/login');
            return;
        }

        if (user.role !== 'seeker') {
            toast.error('Chỉ seeker mới có thể truy cập trang này');
            navigate('/');
            return;
        }

        if (user.purchasedPackage !== 'premium' && user.purchasedPackage !== 'prenium') {
            toast.error('Bạn cần mua Gói Toàn diện để sử dụng tính năng MY CV');
            navigate('/payment');
            return;
        }

        setLoading(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    // File handling functions
    const handleFileUpload = async (event, category) => {
        const files = Array.from(event.target.files);
        
        for (const file of files) {
            // Validate file type
            if (!file.type.includes('pdf') && !file.type.includes('doc') && !file.type.includes('docx')) {
                toast.error(`File ${file.name} không đúng định dạng. Chỉ chấp nhận PDF, DOC, DOCX`);
                continue;
            }

            // Validate file size (max 10MB)
            if (file.size > 10 * 1024 * 1024) {
                toast.error(`File ${file.name} quá lớn. Tối đa 10MB`);
                continue;
            }

            // Create file object with preview
            const fileObj = {
                id: Date.now() + Math.random(),
                name: file.name,
                size: file.size,
                type: file.type,
                uploadDate: new Date().toISOString(),
                file: file,
                previewUrl: null
            };

            // Generate preview for images or first page of PDF
            if (file.type.includes('image')) {
                fileObj.previewUrl = URL.createObjectURL(file);
            }

            setUploadedFiles(prev => ({
                ...prev,
                [category]: [...prev[category], fileObj]
            }));

            toast.success(`Đã thêm file ${file.name}`);
        }
    };

    const handleFileDelete = (category, fileId) => {
        setUploadedFiles(prev => ({
            ...prev,
            [category]: prev[category].filter(file => file.id !== fileId)
        }));
        toast.success('Đã xóa file');
    };

    const handleFilePreview = (file) => {
        if (file.previewUrl) {
            setFilePreview(file);
        } else if (file.type.includes('pdf')) {
            // For PDF files, create object URL
            const previewUrl = URL.createObjectURL(file.file);
            setFilePreview({...file, previewUrl});
        }
    };

    const closeFilePreview = () => {
        setFilePreview(null);
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2">Đang tải thông tin CV...</p>
            </div>
        );
    }

    return (
        <div className="page-container">
            <Header />
            <div className="my-cv-container">
                <div className="cv-header">
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <h2 className="page-title mb-2">MY CV</h2>
                            <p className="text-muted mb-0">Quản lý tài liệu cá nhân</p>
                        </div>
                        <div className="cv-status">
                            <span className="badge bg-success fs-6">
                                <i className="fas fa-crown me-1"></i>
                                Gói Toàn diện
                            </span>
                        </div>
                    </div>
                </div>

                <div className="cv-content">
                    {/* Documents Management Sections */}
                    <div className="cv-section">
                        <div className="section-header">
                            <h4>
                                <i className="fas fa-certificate me-2"></i>
                                Chứng chỉ ngôn ngữ (IELTS/TOEFL)
                            </h4>
                        </div>
                        <div className="documents-section">
                            <div className="upload-area">
                                <input
                                    type="file"
                                    id="languageCerts"
                                    multiple
                                    accept=".pdf,.doc,.docx"
                                    onChange={(e) => handleFileUpload(e, 'languageCerts')}
                                    style={{ display: 'none' }}
                                />
                                <label htmlFor="languageCerts" className="upload-label">
                                    <i className="fas fa-cloud-upload-alt me-2"></i>
                                    Tải lên chứng chỉ ngôn ngữ
                                </label>
                                <small className="text-muted">Hỗ trợ: PDF, DOC, DOCX (Tối đa 10MB)</small>
                            </div>
                            <div className="files-list">
                                {uploadedFiles.languageCerts.map(file => (
                                    <div key={file.id} className="file-item">
                                        <div className="file-info">
                                            <i className="fas fa-file-alt me-2"></i>
                                            <span className="file-name">{file.name}</span>
                                            <span className="file-size">({formatFileSize(file.size)})</span>
                                        </div>
                                        <div className="file-actions">
                                            <button 
                                                className="btn btn-sm btn-outline-primary me-2"
                                                onClick={() => handleFilePreview(file)}
                                                title="Xem trước"
                                            >
                                                <i className="fas fa-eye"></i>
                                            </button>
                                            <button 
                                                className="btn btn-sm btn-outline-danger"
                                                onClick={() => handleFileDelete('languageCerts', file.id)}
                                                title="Xóa"
                                            >
                                                <i className="fas fa-trash"></i>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="cv-section">
                        <div className="section-header">
                            <h4>
                                <i className="fas fa-file-user me-2"></i>
                                Hồ sơ cá nhân (CV, SOP, thư giới thiệu)
                            </h4>
                        </div>
                        <div className="documents-section">
                            <div className="upload-area">
                                <input
                                    type="file"
                                    id="personalDocs"
                                    multiple
                                    accept=".pdf,.doc,.docx"
                                    onChange={(e) => handleFileUpload(e, 'personalDocs')}
                                    style={{ display: 'none' }}
                                />
                                <label htmlFor="personalDocs" className="upload-label">
                                    <i className="fas fa-cloud-upload-alt me-2"></i>
                                    Tải lên hồ sơ cá nhân
                                </label>
                                <small className="text-muted">CV, SOP, thư giới thiệu (PDF, DOC, DOCX - Tối đa 10MB)</small>
                            </div>
                            <div className="files-list">
                                {uploadedFiles.personalDocs.map(file => (
                                    <div key={file.id} className="file-item">
                                        <div className="file-info">
                                            <i className="fas fa-file-alt me-2"></i>
                                            <span className="file-name">{file.name}</span>
                                            <span className="file-size">({formatFileSize(file.size)})</span>
                                        </div>
                                        <div className="file-actions">
                                            <button 
                                                className="btn btn-sm btn-outline-primary me-2"
                                                onClick={() => handleFilePreview(file)}
                                                title="Xem trước"
                                            >
                                                <i className="fas fa-eye"></i>
                                            </button>
                                            <button 
                                                className="btn btn-sm btn-outline-danger"
                                                onClick={() => handleFileDelete('personalDocs', file.id)}
                                                title="Xóa"
                                            >
                                                <i className="fas fa-trash"></i>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="cv-section">
                        <div className="section-header">
                            <h4>
                                <i className="fas fa-graduation-cap me-2"></i>
                                Các giấy tờ học tập và chứng chỉ
                            </h4>
                        </div>
                        <div className="documents-section">
                            <div className="upload-area">
                                <input
                                    type="file"
                                    id="academicDocs"
                                    multiple
                                    accept=".pdf,.doc,.docx"
                                    onChange={(e) => handleFileUpload(e, 'academicDocs')}
                                    style={{ display: 'none' }}
                                />
                                <label htmlFor="academicDocs" className="upload-label">
                                    <i className="fas fa-cloud-upload-alt me-2"></i>
                                    Tải lên giấy tờ học tập
                                </label>
                                <small className="text-muted">Bằng cấp, bảng điểm, chứng chỉ (PDF, DOC, DOCX - Tối đa 10MB)</small>
                            </div>
                            <div className="files-list">
                                {uploadedFiles.academicDocs.map(file => (
                                    <div key={file.id} className="file-item">
                                        <div className="file-info">
                                            <i className="fas fa-file-alt me-2"></i>
                                            <span className="file-name">{file.name}</span>
                                            <span className="file-size">({formatFileSize(file.size)})</span>
                                        </div>
                                        <div className="file-actions">
                                            <button 
                                                className="btn btn-sm btn-outline-primary me-2"
                                                onClick={() => handleFilePreview(file)}
                                                title="Xem trước"
                                            >
                                                <i className="fas fa-eye"></i>
                                            </button>
                                            <button 
                                                className="btn btn-sm btn-outline-danger"
                                                onClick={() => handleFileDelete('academicDocs', file.id)}
                                                title="Xóa"
                                            >
                                                <i className="fas fa-trash"></i>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="cv-tips">
                        <h5>
                            <i className="fas fa-lightbulb me-2"></i>
                            Gợi ý tải lên tài liệu
                        </h5>
                        <div className="tips-list">
                            <div className="tip-item">
                                <i className="fas fa-check-circle text-success me-2"></i>
                                Chứng chỉ ngôn ngữ: IELTS, TOEFL, TOEIC với điểm số rõ ràng
                            </div>
                            <div className="tip-item">
                                <i className="fas fa-check-circle text-success me-2"></i>
                                CV: Định dạng chuẩn, đầy đủ thông tin và kinh nghiệm
                            </div>
                            <div className="tip-item">
                                <i className="fas fa-check-circle text-success me-2"></i>
                                Bằng cấp: Scan rõ nét, bảng điểm đầy đủ các học kỳ
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* File Preview Modal */}
            {filePreview && (
                <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    <i className="fas fa-eye me-2"></i>
                                    Xem trước: {filePreview.name}
                                </h5>
                                <button 
                                    type="button" 
                                    className="btn-close" 
                                    onClick={closeFilePreview}
                                ></button>
                            </div>
                            <div className="modal-body">
                                {filePreview.type.includes('pdf') ? (
                                    <iframe
                                        src={filePreview.previewUrl}
                                        width="100%"
                                        height="500px"
                                        title={filePreview.name}
                                    ></iframe>
                                ) : filePreview.previewUrl ? (
                                    <img 
                                        src={filePreview.previewUrl} 
                                        alt={filePreview.name}
                                        className="img-fluid"
                                    />
                                ) : (
                                    <div className="text-center p-4">
                                        <i className="fas fa-file-alt fa-4x text-muted mb-3"></i>
                                        <p>Không thể xem trước file này</p>
                                        <small className="text-muted">{filePreview.type}</small>
                                    </div>
                                )}
                            </div>
                            <div className="modal-footer">
                                <button 
                                    type="button" 
                                    className="btn btn-secondary"
                                    onClick={closeFilePreview}
                                >
                                    Đóng
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
            <ToastContainer />
        </div>
    );
}

export default MyCV;
