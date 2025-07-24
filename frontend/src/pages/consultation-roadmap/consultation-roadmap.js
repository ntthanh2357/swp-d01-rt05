import React, { useEffect, useState, useContext, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { UserContext } from "../../contexts/UserContext";
import {
    getRoadmap,
    getRoadmapProgress,
    getSeekerStageDetails,
    updateStepDetailStatus
} from "../../services/consultationRoadmapApi";
import { seekerProfile } from "../../services/seekerApi";
import { getMyFiles } from "../../services/fileApi";
import { deleteFile } from "../../services/fileApi";
import FileUploadModal from "../../components/FileUploadModal";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import "./consultation-roadmap.css";

function ConsultationRoadmap() {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [initialLoading, setInitialLoading] = useState(true);
    const [profile, setProfile] = useState(null);
    const [roadmapData, setRoadmapData] = useState([]);
    const [progressData, setProgressData] = useState({});
    const [expandedStage, setExpandedStage] = useState(null);
    const [stageDetails, setStageDetails] = useState({});
    const [loadingDetails, setLoadingDetails] = useState({});
    const [error, setError] = useState("");
    const [stepStatuses, setStepStatuses] = useState({});
    
    // File upload modal states
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [uploadCategory, setUploadCategory] = useState('');
    const [uploadedFiles, setUploadedFiles] = useState([]);

    // Refs cho từng giai đoạn để scroll
    const stageRefs = useRef({});

    // Load files from database
    const loadFilesFromDatabase = useCallback(async () => {
        try {
            const response = await getMyFiles(user.accessToken);
            if (response.data.success) {
                const files = response.data.files;
                setUploadedFiles(files);
                
                console.log('Loaded files from database:', files);
            }
        } catch (error) {
            console.error('Error loading files:', error);
        }
    }, [user]);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const [profileResponse, roadmapResponse, progressResponse] = await Promise.all([
                seekerProfile({ token: user.accessToken }),
                getRoadmap(user.accessToken),
                getRoadmapProgress(user.accessToken)
            ]);

            if (profileResponse.data) {
                setProfile(profileResponse.data);
            }

            if (roadmapResponse.data && roadmapResponse.data.success) {
                const roadmap = roadmapResponse.data.roadmap || [];
                setRoadmapData(roadmap);
                initializeStepStatuses(roadmap);
            } else {
                setError("Không thể tải lộ trình tư vấn");
            }

            if (progressResponse.data && progressResponse.data.success) {
                setProgressData(progressResponse.data.progress || {});
            }

        } catch (error) {
            console.error("Error fetching data:", error);
            if (error.response?.status === 403) {
                setError("Bạn cần đăng nhập lại để tiếp tục");
                navigate('/auth/login');
            } else {
                setError("Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại sau.");
            }
        } finally {
            setLoading(false);
        }
    }, [user, navigate]);

    useEffect(() => {
        const initialTimeout = setTimeout(() => {
            setInitialLoading(false);
        }, 1000);

        return () => clearTimeout(initialTimeout);
    }, []);

    useEffect(() => {
        if (!initialLoading) {
            if (!user || !user.accessToken) {
                navigate('/auth/login');
                return;
            }

            fetchData();
        }
    }, [initialLoading, user, navigate, fetchData]);

    // Load files when user is available
    useEffect(() => {
        if (user && user.accessToken) {
            loadFilesFromDatabase();
        }
    }, [user, loadFilesFromDatabase]);

    // SỬA: Khởi tạo trạng thái cho từng bước chi tiết
    const initializeStepStatuses = (roadmap) => {
        const initialStatuses = {};
        roadmap.forEach(stage => {
            // Khởi tạo với trạng thái pending cho tất cả steps
            initialStatuses[stage.stepNumber] = {
                1: stage.stepNumber === 1 ? 'in_progress' : 'pending', // Step đầu tiên của stage 1 sẽ là in_progress
                2: 'pending',
                3: 'pending'
            };
        });
        setStepStatuses(initialStatuses);
    };

    // Open upload modal with step-specific category mapping
    const openUploadModal = (stageNumber, stepNumber, stepTitle) => {
        let category = null;
        
        // Map step trong giai đoạn 2 với category tương ứng
        if (stageNumber === 2) {
            switch (stepNumber) {
                case 1:
                    category = 'language_certs'; // Chứng chỉ ngôn ngữ (IELTS/TOEFL)
                    break;
                case 2:
                    category = 'personal_docs'; // Hồ sơ cá nhân (CV, SOP, thư giới thiệu)
                    break;
                case 3:
                    category = 'academic_docs'; // Các giấy tờ học tập và chứng chỉ
                    break;
                default:
                    toast.warning('Step này chưa hỗ trợ upload file');
                    return;
            }
        } else {
            toast.info('Chỉ có thể upload file cho giai đoạn 2: Chuẩn bị hồ sơ cá nhân');
            return;
        }
        
        setUploadCategory(category);
        setShowUploadModal(true);
    };

    // Get files for specific step in stage 2
    const getFilesForStep = (stageNumber, stepNumber) => {
        if (stageNumber !== 2) return [];
        
        let category = '';
        if (stepNumber === 1) category = 'language_certs';
        else if (stepNumber === 2) category = 'personal_docs';
        else if (stepNumber === 3) category = 'academic_docs';
        
        return uploadedFiles.filter(file => file.category === category);
    };

    // Delete file from roadmap
    const handleDeleteFile = async (fileId) => {
        try {
            await deleteFile(fileId, user.accessToken);
            await loadFilesFromDatabase(); // Refresh file list
            toast.success('File đã được xóa!');
        } catch (error) {
            console.error('Error deleting file:', error);
            toast.error('Lỗi khi xóa file!');
        }
    };

    // Handle file uploaded successfully
    const refreshProgress = async () => {
        try {
            const progressResponse = await getRoadmapProgress(user.accessToken);
            if (progressResponse.data && progressResponse.data.success) {
                setProgressData(progressResponse.data.progress || {});
            }
        } catch (error) {
            console.error("Error refreshing progress:", error);
        }
    };

    const handleExpandStage = async (stageNumber) => {
        const isCurrentlyExpanded = expandedStage === stageNumber;

        if (isCurrentlyExpanded) {
            setExpandedStage(null);
            return;
        }

        setExpandedStage(stageNumber);

        setTimeout(() => {
            scrollToStage(stageNumber);
        }, 100);

        if (!stageDetails[stageNumber]) {
            setLoadingDetails(prev => ({ ...prev, [stageNumber]: true }));
            try {
                const response = await getSeekerStageDetails(user.accessToken, user.userId, stageNumber);
                if (response.data && response.data.success) {
                    setStageDetails(prev => ({
                        ...prev,
                        [stageNumber]: response.data.stageDetails || []
                    }));
                }
            } catch (error) {
                console.error("Error fetching stage details:", error);
                toast.error("Không thể tải chi tiết giai đoạn");
            } finally {
                setLoadingDetails(prev => ({ ...prev, [stageNumber]: false }));
            }
        }
    };

    const scrollToStage = (stageNumber) => {
        const stageElement = stageRefs.current[stageNumber];
        if (stageElement) {
            const offset = 100;
            const elementPosition = stageElement.getBoundingClientRect().top + window.pageYOffset;
            window.scrollTo({
                top: elementPosition - offset,
                behavior: 'smooth'
            });
        }
    };

    // SỬA: Cập nhật hàm xử lý click nút trạng thái bước chi tiết - chỉ update từng bước
    const handleStepStatusClick = async (stageNumber, stepIndex) => {
        const currentStage = roadmapData.find(stage => stage.stepNumber === stageNumber);
        const currentStatus = stepStatuses[stageNumber]?.[stepIndex];

        // Chỉ cho phép đánh dấu completed nếu bước đang in_progress
        if (currentStage?.stepStatus === 'in_progress' && currentStatus === 'in_progress') {
            try {
                console.log("Marking step detail as completed:", {
                    stageNumber: stageNumber,
                    stepIndex: stepIndex,
                    status: 'completed'
                });

                // SỬA: Gọi API updateStepDetailStatus để chỉ update bước cụ thể
                const response = await updateStepDetailStatus(user.accessToken, {
                    stageNumber: stageNumber,
                    stepIndex: stepIndex,
                    status: 'completed',
                    notes: `Seeker đã xác nhận hoàn thành bước ${stepIndex} trong giai đoạn ${stageNumber}`
                });

                if (response.data && response.data.success) {
                    // Cập nhật trạng thái bước cụ thể
                    setStepStatuses(prev => ({
                        ...prev,
                        [stageNumber]: {
                            ...prev[stageNumber],
                            [stepIndex]: 'completed'
                        }
                    }));

                    toast.success("Đã hoàn thành bước thành công!");

                    // Kiểm tra xem có bước tiếp theo trong cùng stage không
                    const nextStepIndex = stepIndex + 1;
                    if (nextStepIndex <= 3) { // Giả sử mỗi stage có tối đa 3 steps
                        setStepStatuses(prev => ({
                            ...prev,
                            [stageNumber]: {
                                ...prev[stageNumber],
                                [nextStepIndex]: 'in_progress'
                            }
                        }));
                    }

                    // Kiểm tra và cập nhật trạng thái stage nếu tất cả steps đã completed
                    checkStageCompletion(stageNumber);

                    // Refresh toàn bộ roadmap data để đảm bảo sync
                    await fetchData();
                } else {
                    throw new Error(response.data?.error || "Cập nhật thất bại");
                }
            } catch (error) {
                console.error("Error updating step status:", error);
                toast.error("Có lỗi xảy ra khi cập nhật trạng thái: " +
                    (error.response?.data?.error || error.message));
            }
        }
    };

    // SỬA: Kiểm tra và cập nhật trạng thái giai đoạn
    const checkStageCompletion = (stageNumber) => {
        const stageSteps = stepStatuses[stageNumber] || {};
        const totalSteps = stageDetails[stageNumber]?.length || 3;

        // Kiểm tra tất cả bước đã hoàn thành chưa
        let allCompleted = true;
        for (let i = 1; i <= totalSteps; i++) {
            if (stageSteps[i] !== 'completed') {
                allCompleted = false;
                break;
            }
        }

        if (allCompleted) {
            // Cập nhật stage status thành completed sẽ được xử lý bởi backend
            // Và cập nhật stage tiếp theo thành in_progress
            const nextStageNumber = stageNumber + 1;
            if (nextStageNumber <= 4) { // Giả sử có 4 stages
                setStepStatuses(prev => ({
                    ...prev,
                    [nextStageNumber]: {
                        ...prev[nextStageNumber],
                        1: 'in_progress' // Bắt đầu step đầu tiên của stage tiếp theo
                    }
                }));
            }
        }
    };

    const getStepButtonText = (stageStatus, stepStatus) => {
        if (stageStatus === 'completed') return 'Đã hoàn thành';
        if (stepStatus === 'completed') return 'Đã hoàn thành';
        if (stageStatus === 'in_progress' && stepStatus === 'in_progress') return 'Xác nhận hoàn thành';
        if (stageStatus === 'pending') return 'Đang chờ';
        return 'Đang chờ';
    };

    const isStepButtonClickable = (stageStatus, stepStatus) => {
        // Chỉ cho phép click khi giai đoạn đang in_progress và bước đang in_progress
        return stageStatus === 'in_progress' && stepStatus === 'in_progress';
    };
    // SỬA: Lấy class CSS cho nút
    const getStepButtonClass = (stageStatus, stepStatus) => {
        if (stepStatus === 'completed') return 'btn btn-success btn-sm';
        if (stageStatus === 'in_progress' && stepStatus === 'in_progress') {
            return 'btn btn-primary btn-sm';
        }
        return 'btn btn-secondary btn-sm';
    };

    // Loading ban đầu
    if (initialLoading) {
        return (
            <div>
                <Header />
                <div className="container">
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <div>
                            <h5>Đang khởi tạo...</h5>
                            <p className="text-muted">Vui lòng chờ trong giây lát</p>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    // Loading dữ liệu
    if (loading) {
        return (
            <div>
                <Header />
                <div className="container">
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <div>
                            <h5>Đang tải lộ trình tư vấn...</h5>
                            <p className="text-muted">Đang lấy thông tin từ server</p>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <Header />
                <div className="container">
                    <div className="error-container">
                        <div className="alert alert-danger">
                            <h5>Có lỗi xảy ra</h5>
                            <p>{error}</p>
                            <button
                                className="btn btn-primary"
                                onClick={() => window.location.reload()}
                            >
                                Thử lại
                            </button>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    if (!roadmapData || roadmapData.length === 0) {
        return (
            <div>
                <Header />
                <div className="container">
                    <div className="error-container">
                        <div className="alert alert-info">
                            <h5>Chưa có lộ trình tư vấn</h5>
                            <p>Lộ trình tư vấn của bạn đang được chuẩn bị. Vui lòng liên hệ với tư vấn viên để được hỗ trợ.</p>
                            <button
                                className="btn btn-primary"
                                onClick={() => navigate('/seeker/user-profile')}
                            >
                                Quay lại trang cá nhân
                            </button>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    const getStatusIcon = (status) => {
        switch (status) {
            case 'completed':
                return '✓';
            case 'in_progress':
                return '⟳';
            case 'pending':
                return '○';
            default:
                return '○';
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed':
                return 'success';
            case 'in_progress':
                return 'warning';
            case 'pending':
                return 'secondary';
            default:
                return 'secondary';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'completed':
                return 'Hoàn thành';
            case 'in_progress':
                return 'Đang thực hiện';
            case 'pending':
                return 'Chưa bắt đầu';
            default:
                return 'Chưa bắt đầu';
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "Chưa có";
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN');
    };

    const formatDescription = (description) => {
        return description.split('\n').map((line, index) => (
            <div key={index} className="description-line">
                {line}
            </div>
        ));
    };

    return (
        <div>
            <Header />
            <div className="container consultation-roadmap-container">
                <div className="roadmap-header">
                    <button
                        className="btn btn-outline-secondary mb-3"
                        onClick={() => navigate('/seeker/user-profile')}
                    >
                        ← Quay lại trang cá nhân
                    </button>
                    <h2 className="page-title">Lộ trình Tư vấn Du học</h2>
                    <div className="package-info">
                        <span className="badge bg-success fs-6">
                            {profile?.purchased_package === 'basic'
                                ? 'Gói Hỗ trợ Đơn giản'
                                : 'Gói Toàn diện'}
                        </span>
                    </div>
                </div>

                <div className="roadmap-progress">
                    <div className="progress-summary">
                        <h5>Tiến độ tổng quan</h5>
                        <div className="progress mb-3">
                            <div
                                className="progress-bar progress-bar-striped progress-bar-animated"
                                style={{ width: `${progressData.progressPercentage || 0}%` }}
                            >
                                {progressData.progressPercentage || 0}%
                            </div>
                        </div>
                        <p className="text-muted">
                            {progressData.completedSteps || 0}/{progressData.totalSteps || 0} giai đoạn đã hoàn thành
                        </p>
                        {progressData.currentStep && (
                            <div className="current-step-info">
                                <small className="text-primary">
                                    <strong>Giai đoạn hiện tại:</strong> {progressData.currentStep.stepTitle}
                                </small>
                            </div>
                        )}
                    </div>
                </div>

                <div className="timeline-container">
                    {roadmapData.map((stage, index) => (
                        <div
                            key={stage.roadmapId}
                            ref={el => stageRefs.current[stage.stepNumber] = el}
                            className={`timeline-item ${stage.stepStatus} fade-in`}
                            style={{ animationDelay: `${index * 0.2}s` }}
                        >
                            <div className="timeline-marker">
                                <span className={`status-icon ${getStatusColor(stage.stepStatus)}`}>
                                    {getStatusIcon(stage.stepStatus)}
                                </span>
                            </div>
                            <div className="timeline-content">
                                <div className="step-header">
                                    <h4 className="stage-title">{stage.stepTitle}</h4>
                                    <div className="d-flex align-items-center gap-2">
                                        <span className={`badge bg-${getStatusColor(stage.stepStatus)}`}>
                                            {getStatusText(stage.stepStatus)}
                                        </span>
                                        <button
                                            className="btn btn-sm btn-outline-primary"
                                            onClick={() => handleExpandStage(stage.stepNumber)}
                                        >
                                            {expandedStage === stage.stepNumber ? '▼ Thu gọn' : '▶ Chi tiết'}
                                        </button>
                                    </div>
                                </div>

                                <div className="step-description">
                                    {formatDescription(stage.stepDescription)}
                                </div>

                                {/* Chi tiết giai đoạn khi mở rộng */}
                                {expandedStage === stage.stepNumber && (
                                    <div className="stage-details">
                                        {loadingDetails[stage.stepNumber] ? (
                                            <div className="text-center py-3">
                                                <div className="spinner-border spinner-border-sm me-2"></div>
                                                Đang tải chi tiết...
                                            </div>
                                        ) : stageDetails[stage.stepNumber] ? (
                                            <div className="detailed-steps">
                                                <h6 className="mb-3">Các bước chi tiết:</h6>
                                                {stageDetails[stage.stepNumber].map((step, stepIndex) => {
                                                    const stepNumber = stepIndex + 1;
                                                    const stepStatus = stepStatuses[stage.stepNumber]?.[stepNumber] || 'pending';

                                                    return (
                                                        <div key={stepIndex} className="detail-step-card">
                                                            <div className="detail-step-header">
                                                                <div className="d-flex align-items-center">
                                                                    <span className="step-indicator">{stepNumber}</span>
                                                                    <h6 className="step-title mb-0 flex-grow-1">{step.title}</h6>
                                                                </div>
                                                            </div>

                                                            <p className="step-description mb-2">{step.description}</p>

                                                            <div className="step-timeline">
                                                                <small className="text-muted">
                                                                    <i className="fas fa-clock me-1"></i>
                                                                    Thời gian dự kiến: {step.estimatedDuration} ngày
                                                                </small>
                                                            </div>

                                                            {/* SỬA: Nút xác nhận hoàn thành cho từng bước và nút gửi file */}
                                                            <div className="step-action d-flex gap-2 align-items-center">
                                                                <button
                                                                    className={getStepButtonClass(stage.stepStatus, stepStatus)}
                                                                    onClick={() => handleStepStatusClick(stage.stepNumber, stepNumber)}
                                                                    disabled={!isStepButtonClickable(stage.stepStatus, stepStatus)}
                                                                    title={isStepButtonClickable(stage.stepStatus, stepStatus)
                                                                        ? "Click để đánh dấu bước này đã hoàn thành"
                                                                        : "Bước này chưa thể hoàn thành"}
                                                                >
                                                                    {stepStatus === 'completed' && <i className="fas fa-check me-1"></i>}
                                                                    {stepStatus === 'in_progress' && <i className="fas fa-play me-1"></i>}
                                                                    {stepStatus === 'pending' && <i className="fas fa-clock me-1"></i>}
                                                                    {getStepButtonText(stage.stepStatus, stepStatus)}
                                                                </button>
                                                                
                                                                {/* Nút gửi file cho giai đoạn 2 */}
                                                                {stage.stepNumber === 2 && (
                                                                    <button
                                                                        className="btn btn-sm roadmap-file-btn"
                                                                        onClick={() => openUploadModal(stage.stepNumber, stepNumber, step.title)}
                                                                        title="Gửi file cho bước này"
                                                                    >
                                                                        <i className="fas fa-upload me-1"></i>
                                                                        Gửi file
                                                                    </button>
                                                                )}
                                                            </div>
                                                            
                                                            {/* Hiển thị files đã upload cho giai đoạn 2 */}
                                                            {stage.stepNumber === 2 && (() => {
                                                                const stepFiles = getFilesForStep(stage.stepNumber, stepNumber);
                                                                if (stepFiles.length > 0) {
                                                                    return (
                                                                        <div className="uploaded-files-section mt-3">
                                                                            <h6 className="files-title">
                                                                                <i className="fas fa-paperclip me-2"></i>
                                                                                Files đã gửi ({stepFiles.length})
                                                                            </h6>
                                                                            <div className="files-list">
                                                                                {stepFiles.map((file, fileIndex) => (
                                                                                    <div key={fileIndex} className="file-item d-flex align-items-center justify-content-between p-2 border rounded mb-2">
                                                                                        <div className="file-info d-flex align-items-center">
                                                                                            <i className="fas fa-file-alt me-2 text-primary"></i>
                                                                                            <div>
                                                                                                <div className="file-name">{file.originalName}</div>
                                                                                                <small className="text-muted">
                                                                                                    {new Date(file.uploadDate).toLocaleDateString('vi-VN')}
                                                                                                </small>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="file-actions">
                                                                                            <button
                                                                                                className="btn btn-sm btn-outline-danger"
                                                                                                onClick={() => handleDeleteFile(file.id)}
                                                                                                title="Xóa file"
                                                                                            >
                                                                                                <i className="fas fa-trash"></i>
                                                                                            </button>
                                                                                        </div>
                                                                                    </div>
                                                                                ))}
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                }
                                                                return null;
                                                            })()}
                                                        </div>
                                                    );
                                                })}

                                                <div className="stage-summary mt-3 p-3 bg-light rounded">
                                                    <h6 className="mb-2">
                                                        <i className="fas fa-info-circle me-2"></i>
                                                        Hướng dẫn:
                                                    </h6>
                                                    <ul className="mb-0">
                                                        <li>Hoàn thành từng bước theo thứ tự để tiến bộ trong giai đoạn</li>
                                                        <li>Chỉ có thể đánh dấu hoàn thành khi bước đang "Đang thực hiện"</li>
                                                        <li>Giai đoạn sẽ tự động chuyển sang "Hoàn thành" khi tất cả bước đã xong</li>
                                                        <li>Liên hệ tư vấn viên nếu cần hỗ trợ</li>
                                                    </ul>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-muted text-center py-3">
                                                Không có thông tin chi tiết
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className="step-details">
                                    <div className="row">
                                        <div className="col-md-6">
                                            <h6>Thông tin giai đoạn:</h6>
                                            <ul className="list-unstyled">
                                                <li><strong>Thời gian dự kiến:</strong> {stage.estimatedDurationDays} ngày</li>
                                                <li><strong>Ngày tạo:</strong> {formatDate(stage.createdAt)}</li>
                                                {stage.completedAt && (
                                                    <li><strong>Ngày hoàn thành:</strong> {formatDate(stage.completedAt)}</li>
                                                )}
                                            </ul>
                                        </div>
                                        {stage.notes && (
                                            <div className="col-md-6">
                                                <h6>Ghi chú từ tư vấn viên:</h6>
                                                <div className="alert alert-info">
                                                    {stage.notes}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="roadmap-footer">
                    <div className="support-info">
                        <h5>Cần hỗ trợ?</h5>
                        <p>Liên hệ với tư vấn viên để được hướng dẫn chi tiết cho từng giai đoạn.</p>
                        <div className="d-flex gap-2 justify-content-center">
                            <button
                                className="btn btn-primary"
                                onClick={() => toast.info("Tính năng liên hệ sẽ sớm được cập nhật!")}
                            >
                                <i className="fas fa-phone"></i> Liên hệ tư vấn viên
                            </button>
                            <button
                                className="btn btn-outline-primary"
                                onClick={refreshProgress}
                            >
                                <i className="fas fa-sync-alt"></i> Cập nhật tiến độ
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
            
            {/* File Upload Modal */}
            {showUploadModal && (
                <FileUploadModal
                    show={showUploadModal}
                    onClose={() => {
                        setShowUploadModal(false);
                        setUploadCategory('');
                    }}
                    category={uploadCategory}
                    onFileUploaded={() => {
                        // Reload files after successful upload
                        loadFilesFromDatabase();
                        toast.success('File uploaded successfully!');
                    }}
                    userToken={user?.accessToken}
                />
            )}
            
            <ToastContainer />
        </div>
    );
}

export default ConsultationRoadmap;