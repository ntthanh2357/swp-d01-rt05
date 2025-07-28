import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { uploadFile } from '../services/fileApi';

function FileUploadModal({ show, onClose, category, onFileUploaded, userToken }) {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);

    const categoryNames = {
        'language_certs': 'Chứng chỉ ngôn ngữ (IELTS/TOEFL)',
        'personal_docs': 'Hồ sơ cá nhân (CV, SOP, thư giới thiệu)',
        'academic_docs': 'Các giấy tờ học tập và chứng chỉ'
    };

    const handleFileSelect = (event) => {
        const files = Array.from(event.target.files);
        validateAndAddFiles(files);
    };

    const validateAndAddFiles = (files) => {
        const validFiles = [];
        
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

            validFiles.push(file);
        }

        setSelectedFiles(prev => [...prev, ...validFiles]);
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const files = Array.from(e.dataTransfer.files);
            validateAndAddFiles(files);
        }
    };

    const removeFile = (index) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const handleUpload = async () => {
        if (selectedFiles.length === 0) {
            toast.warning('Vui lòng chọn ít nhất một file');
            return;
        }

        setUploading(true);
        let successCount = 0;

        for (const file of selectedFiles) {
            try {
                await uploadFile(file, category, userToken);
                successCount++;
            } catch (error) {
                console.error('Error uploading file:', error);
                toast.error(`Lỗi khi upload ${file.name}: ${error.response?.data?.message || error.message}`);
            }
        }

        setUploading(false);
        
        if (successCount > 0) {
            toast.success(`Đã upload thành công ${successCount} file(s)`);
            setSelectedFiles([]);
            onFileUploaded(); // Refresh file list
            onClose();
        }
    };

    const handleClose = () => {
        if (!uploading) {
            setSelectedFiles([]);
            onClose();
        }
    };

    if (!show) return null;

    return (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">
                            <i className="fas fa-cloud-upload-alt me-2"></i>
                            Upload Files - {categoryNames[category]}
                        </h5>
                        <button 
                            type="button" 
                            className="btn-close" 
                            onClick={handleClose}
                            disabled={uploading}
                        ></button>
                    </div>
                    <div className="modal-body">
                        {/* Drag & Drop Area */}
                        <div 
                            className={`upload-drop-zone ${dragActive ? 'drag-active' : ''}`}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                        >
                            <div className="text-center p-4">
                                <i className="fas fa-cloud-upload-alt fa-3x text-primary mb-3"></i>
                                <p className="mb-2">Kéo thả files vào đây hoặc</p>
                                <input
                                    type="file"
                                    id="fileInput"
                                    multiple
                                    accept=".pdf,.doc,.docx"
                                    onChange={handleFileSelect}
                                    style={{ display: 'none' }}
                                    disabled={uploading}
                                />
                                <label htmlFor="fileInput" className="btn btn-primary">
                                    <i className="fas fa-folder-open me-2"></i>
                                    Chọn Files
                                </label>
                                <small className="d-block text-muted mt-2">
                                    Hỗ trợ: PDF, DOC, DOCX (Tối đa 10MB mỗi file)
                                </small>
                            </div>
                        </div>

                        {/* Selected Files List */}
                        {selectedFiles.length > 0 && (
                            <div className="selected-files mt-4">
                                <h6>Files đã chọn ({selectedFiles.length}):</h6>
                                <div className="files-list">
                                    {selectedFiles.map((file, index) => (
                                        <div key={index} className="file-item d-flex justify-content-between align-items-center p-3 border rounded mb-2">
                                            <div className="file-info">
                                                <i className="fas fa-file-alt me-2 text-primary"></i>
                                                <span className="file-name fw-bold">{file.name}</span>
                                                <span className="file-size text-muted ms-2">({formatFileSize(file.size)})</span>
                                            </div>
                                            <button 
                                                className="btn btn-sm btn-outline-danger"
                                                onClick={() => removeFile(index)}
                                                disabled={uploading}
                                                title="Xóa file"
                                            >
                                                <i className="fas fa-times"></i>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="modal-footer">
                        <button 
                            type="button" 
                            className="btn btn-secondary"
                            onClick={handleClose}
                            disabled={uploading}
                        >
                            Hủy
                        </button>
                        <button 
                            type="button" 
                            className="btn btn-primary"
                            onClick={handleUpload}
                            disabled={uploading || selectedFiles.length === 0}
                        >
                            {uploading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                    Đang upload...
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-upload me-2"></i>
                                    Upload {selectedFiles.length} file(s)
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FileUploadModal;
