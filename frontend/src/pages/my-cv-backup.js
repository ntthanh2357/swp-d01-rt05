import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { UserContext } from '../contexts/UserContext';
import { seekerProfile, seekerProfileUpdate } from '../services/seekerApi';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../css/my-cv.css';

function MyCV() {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState(null);
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    
    // File management states
    const [uploadedFiles, setUploadedFiles] = useState({
        languageCerts: [], // Chứng chỉ ngôn ngữ (IELTS/TOEFL)
        personalDocs: [],  // Hồ sơ cá nhân (CV, SOP, thư giới thiệu)
        academicDocs: []   // Các giấy tờ học tập và chứng chỉ
    });
    const [filePreview, setFilePreview] = useState(null);
    const [uploadProgress, setUploadProgress] = useState({});
    
    const [cvData, setCvData] = useState({
        bio: '',
        currentEducationLevel: '',
        fieldOfStudy: '',
        gpa: '',
        targetDegree: '',
        targetCountries: '',
        preferredLanguages: '',
        financialNeedLevel: '',
        cvUrl: ''
    });

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const response = await seekerProfile({ token: user.accessToken });
            
            if (response.status === 200) {
                setProfile(response.data);
                setCvData({
                    bio: response.data.bio || '',
                    currentEducationLevel: response.data.current_education_level || '',
                    fieldOfStudy: response.data.field_of_study || '',
                    gpa: response.data.gpa || '',
                    targetDegree: response.data.target_degree || '',
                    targetCountries: response.data.target_countries || '',
                    preferredLanguages: response.data.preferred_languages || '',
                    financialNeedLevel: response.data.financial_need_level || '',
                    cvUrl: response.data.cv_url || ''
                });
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
            toast.error('Không thể tải thông tin CV');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Kiểm tra quyền truy cập
        if (!user || !user.accessToken) {
            navigate('/auth/login');
            return;
        }

        if (user.role !== 'seeker') {
            navigate('/');
            return;
        }

        if (user.purchasedPackage !== 'premium' && user.purchasedPackage !== 'prenium') {
            toast.error('Bạn cần mua Gói Toàn diện để sử dụng tính năng MY CV');
            navigate('/payment');
            return;
        }

        fetchProfile();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCvData(prev => ({
            ...prev,
            [name]: value
        }));
    };

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

    const handleSave = async () => {
        try {
            setSaving(true);
            
            const updateData = {
                bio: cvData.bio,
                current_education_level: cvData.currentEducationLevel,
                field_of_study: cvData.fieldOfStudy,
                gpa: cvData.gpa,
                target_degree: cvData.targetDegree,
                target_countries: cvData.targetCountries,
                preferred_languages: cvData.preferredLanguages,
                financial_need_level: cvData.financialNeedLevel,
                cv_url: cvData.cvUrl
            };

            await seekerProfileUpdate({
                ...updateData,
                token: user.accessToken
            });
            
            toast.success('Cập nhật CV thành công!');
            setEditing(false);
            fetchProfile(); // Reload to get updated data
        } catch (error) {
            console.error('Error updating CV:', error);
            toast.error('Có lỗi xảy ra khi cập nhật CV');
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        setEditing(false);
        // Reset data to original values
        setCvData({
            bio: profile?.bio || '',
            currentEducationLevel: profile?.current_education_level || '',
            fieldOfStudy: profile?.field_of_study || '',
            gpa: profile?.gpa || '',
            targetDegree: profile?.target_degree || '',
            targetCountries: profile?.target_countries || '',
            preferredLanguages: profile?.preferred_languages || '',
            financialNeedLevel: profile?.financial_need_level || '',
            cvUrl: profile?.cv_url || ''
        });
    };

    if (loading) {
        return (
            <div>
                <Header />
                <div className="container my-cv-container">
                    <div className="loading-container">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Đang tải...</span>
                        </div>
                        <p className="mt-3">Đang tải thông tin CV...</p>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div>
            <Header />
            <div className="container my-cv-container">
                <div className="cv-header">
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <h2 className="page-title">
                                <i className="fas fa-file-alt me-2"></i>
                                MY CV
                            </h2>
                            <p className="text-muted">Quản lý và cập nhật thông tin CV của bạn</p>
                        </div>
                        <div>
                            <span className="badge bg-success fs-6">
                                <i className="fas fa-crown me-1"></i>
                                Gói Toàn diện
                            </span>
                        </div>
                    </div>
                </div>

                <div className="cv-content">
                    <div className="cv-section">
                        <div className="section-header">
                            <h4>
                                <i className="fas fa-user me-2"></i>
                                Thông tin cá nhân
                            </h4>
                            <div className="action-buttons">
                                {editing ? (
                                    <>
                                        <button 
                                            className="btn btn-outline-secondary me-2"
                                            onClick={handleCancel}
                                            disabled={saving}
                                        >
                                            <i className="fas fa-times me-1"></i>
                                            Hủy
                                        </button>
                                        <button 
                                            className="btn btn-primary"
                                            onClick={handleSave}
                                            disabled={saving}
                                        >
                                            {saving ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-1" role="status"></span>
                                                    Đang lưu...
                                                </>
                                            ) : (
                                                <>
                                                    <i className="fas fa-save me-1"></i>
                                                    Lưu
                                                </>
                                            )}
                                        </button>
                                    </>
                                ) : (
                                    <button 
                                        className="btn btn-outline-primary"
                                        onClick={() => setEditing(true)}
                                    >
                                        <i className="fas fa-edit me-1"></i>
                                        Chỉnh sửa
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="cv-form">
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Tự giới thiệu</label>
                                    {editing ? (
                                        <textarea
                                            className="form-control"
                                            name="bio"
                                            value={cvData.bio}
                                            onChange={handleInputChange}
                                            rows="4"
                                            placeholder="Viết vài dòng giới thiệu về bản thân..."
                                        />
                                    ) : (
                                        <div className="form-display">
                                            {cvData.bio || <span className="text-muted">Chưa cập nhật</span>}
                                        </div>
                                    )}
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Trình độ học vấn hiện tại</label>
                                    {editing ? (
                                        <select
                                            className="form-select"
                                            name="currentEducationLevel"
                                            value={cvData.currentEducationLevel}
                                            onChange={handleInputChange}
                                        >
                                            <option value="">Chọn trình độ</option>
                                            <option value="high_school">Trung học phổ thông</option>
                                            <option value="bachelor">Cử nhân</option>
                                            <option value="master">Thạc sĩ</option>
                                            <option value="phd">Tiến sĩ</option>
                                        </select>
                                    ) : (
                                        <div className="form-display">
                                            {cvData.currentEducationLevel ? (
                                                cvData.currentEducationLevel === 'high_school' ? 'Trung học phổ thông' :
                                                cvData.currentEducationLevel === 'bachelor' ? 'Cử nhân' :
                                                cvData.currentEducationLevel === 'master' ? 'Thạc sĩ' :
                                                cvData.currentEducationLevel === 'phd' ? 'Tiến sĩ' : cvData.currentEducationLevel
                                            ) : (
                                                <span className="text-muted">Chưa cập nhật</span>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Lĩnh vực chuyên môn</label>
                                    {editing ? (
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="fieldOfStudy"
                                            value={cvData.fieldOfStudy}
                                            onChange={handleInputChange}
                                            placeholder="Ví dụ: Khoa học máy tính, Kinh tế..."
                                        />
                                    ) : (
                                        <div className="form-display">
                                            {cvData.fieldOfStudy || <span className="text-muted">Chưa cập nhật</span>}
                                        </div>
                                    )}
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label className="form-label">GPA</label>
                                    {editing ? (
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            max="4"
                                            className="form-control"
                                            name="gpa"
                                            value={cvData.gpa}
                                            onChange={handleInputChange}
                                            placeholder="Ví dụ: 3.5"
                                        />
                                    ) : (
                                        <div className="form-display">
                                            {cvData.gpa || <span className="text-muted">Chưa cập nhật</span>}
                                        </div>
                                    )}
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Bằng cấp mong muốn</label>
                                    {editing ? (
                                        <select
                                            className="form-select"
                                            name="targetDegree"
                                            value={cvData.targetDegree}
                                            onChange={handleInputChange}
                                        >
                                            <option value="">Chọn bằng cấp</option>
                                            <option value="bachelor">Cử nhân</option>
                                            <option value="master">Thạc sĩ</option>
                                            <option value="phd">Tiến sĩ</option>
                                        </select>
                                    ) : (
                                        <div className="form-display">
                                            {cvData.targetDegree ? (
                                                cvData.targetDegree === 'bachelor' ? 'Cử nhân' :
                                                cvData.targetDegree === 'master' ? 'Thạc sĩ' :
                                                cvData.targetDegree === 'phd' ? 'Tiến sĩ' : cvData.targetDegree
                                            ) : (
                                                <span className="text-muted">Chưa cập nhật</span>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Quốc gia mong muốn</label>
                                    {editing ? (
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="targetCountries"
                                            value={cvData.targetCountries}
                                            onChange={handleInputChange}
                                            placeholder="Ví dụ: Mỹ, Canada, Úc..."
                                        />
                                    ) : (
                                        <div className="form-display">
                                            {cvData.targetCountries || <span className="text-muted">Chưa cập nhật</span>}
                                        </div>
                                    )}
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Ngôn ngữ ưu tiên</label>
                                    {editing ? (
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="preferredLanguages"
                                            value={cvData.preferredLanguages}
                                            onChange={handleInputChange}
                                            placeholder="Ví dụ: English, French..."
                                        />
                                    ) : (
                                        <div className="form-display">
                                            {cvData.preferredLanguages || <span className="text-muted">Chưa cập nhật</span>}
                                        </div>
                                    )}
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Mức độ cần hỗ trợ tài chính</label>
                                    {editing ? (
                                        <select
                                            className="form-select"
                                            name="financialNeedLevel"
                                            value={cvData.financialNeedLevel}
                                            onChange={handleInputChange}
                                        >
                                            <option value="">Chọn mức độ</option>
                                            <option value="low">Thấp</option>
                                            <option value="medium">Trung bình</option>
                                            <option value="high">Cao</option>
                                        </select>
                                    ) : (
                                        <div className="form-display">
                                            {cvData.financialNeedLevel ? (
                                                cvData.financialNeedLevel === 'low' ? 'Thấp' :
                                                cvData.financialNeedLevel === 'medium' ? 'Trung bình' :
                                                cvData.financialNeedLevel === 'high' ? 'Cao' : cvData.financialNeedLevel
                                            ) : (
                                                <span className="text-muted">Chưa cập nhật</span>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <div className="col-12 mb-3">
                                    <label className="form-label">Link CV (PDF/Word)</label>
                                    {editing ? (
                                        <input
                                            type="url"
                                            className="form-control"
                                            name="cvUrl"
                                            value={cvData.cvUrl}
                                            onChange={handleInputChange}
                                            placeholder="https://drive.google.com/file/..."
                                        />
                                    ) : (
                                        <div className="form-display">
                                            {cvData.cvUrl ? (
                                                <a 
                                                    href={cvData.cvUrl} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="btn btn-outline-primary btn-sm"
                                                >
                                                    <i className="fas fa-download me-1"></i>
                                                    Tải CV
                                                </a>
                                            ) : (
                                                <span className="text-muted">Chưa cập nhật</span>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

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
                            Gợi ý cải thiện CV
                        </h5>
                        <div className="tips-list">
                            <div className="tip-item">
                                <i className="fas fa-check-circle text-success me-2"></i>
                                Cập nhật đầy đủ thông tin cá nhân để tăng cơ hội được chọn
                            </div>
                            <div className="tip-item">
                                <i className="fas fa-check-circle text-success me-2"></i>
                                Upload CV dạng PDF để đảm bảo format không bị lỗi
                            </div>
                            <div className="tip-item">
                                <i className="fas fa-check-circle text-success me-2"></i>
                                Viết tự giới thiệu ngắn gọn, nổi bật điểm mạnh của bạn
                            </div>
                            <div className="tip-item">
                                <i className="fas fa-check-circle text-success me-2"></i>
                                Cập nhật GPA chính xác để tăng độ tin cậy
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
