import React, { useEffect, useState, useContext, useRef } from "react";
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

    // Refs cho từng giai đoạn để scroll
    const stageRefs = useRef({});

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
    }, [initialLoading, user, navigate]);

    const fetchData = async () => {
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

            console.log("Roadmap data:", roadmapResponse.data);
            console.log("Progress data:", progressResponse.data);
            console.log("Profile data:", profileResponse.data);

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
    };

    // SỬA: Khởi tạo trạng thái cho từng bước chi tiết
    const initializeStepStatuses = (roadmap) => {
        const initialStatuses = {};
        roadmap.forEach((stage, idx) => {
            if (stage.stepStatus === 'completed') {
                initialStatuses[stage.stepNumber] = {
                    1: 'completed',
                    2: 'completed',
                    3: 'completed',
                    stageStatus: 'completed'
                };
            } else if (stage.stepStatus === 'in_progress') {
                // Nếu backend trả về đang thực hiện thì giữ nguyên
                initialStatuses[stage.stepNumber] = {
                    1: 'in_progress',
                    2: 'pending',
                    3: 'pending',
                    stageStatus: 'in_progress'
                };
            } else {
                if (stage.stepNumber === 1) {
                    initialStatuses[stage.stepNumber] = {
                        1: 'in_progress',
                        2: 'pending',
                        3: 'pending',
                        stageStatus: 'in_progress'
                    };
                } else {
                    const prevStage = roadmap[idx - 1];
                    if (prevStage && prevStage.stepStatus === 'completed') {
                        initialStatuses[stage.stepNumber] = {
                            1: 'in_progress',
                            2: 'pending',
                            3: 'pending',
                            stageStatus: 'in_progress'
                        };
                    } else {
                        initialStatuses[stage.stepNumber] = {
                            1: 'pending',
                            2: 'pending',
                            3: 'pending',
                            stageStatus: 'pending'
                        };
                    }
                }
            }
        });
        setStepStatuses(initialStatuses);
    };

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
                const response = await updateStepDetailStatus(user.accessToken, {
                    stageNumber: stageNumber,
                    stepIndex: stepIndex,
                    status: 'completed',
                    notes: `Seeker đã xác nhận hoàn thành bước ${stepIndex} trong giai đoạn ${stageNumber}`
                });
                if (response.data && response.data.success) {
                    toast.success("Đã hoàn thành bước thành công!");
                    // Cập nhật UI tạm thời
                    setStepStatuses(prev => ({
                        ...prev,
                        [stageNumber]: {
                            ...prev[stageNumber],
                            [stepIndex]: 'completed'
                        }
                    }));
                    const nextStepIndex = stepIndex + 1;
                    if (nextStepIndex <= 3) {
                        setStepStatuses(prev => ({
                            ...prev,
                            [stageNumber]: {
                                ...prev[stageNumber],
                                [nextStepIndex]: 'in_progress'
                            }
                        }));
                    }
                    // Kiểm tra hoàn thành giai đoạn, nếu hoàn thành thì gọi fetchData để đồng bộ backend
                    checkStageCompletion(stageNumber, true);
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

    const checkStageCompletion = (stageNumber, isSyncBackend = false) => {
        const stageSteps = stepStatuses[stageNumber] || {};
        const totalSteps = stageDetails[stageNumber]?.length || 3;

        let completedCount = 0;
        for (let i = 1; i <= totalSteps; i++) {
            if (stageSteps[i] === 'completed') {
                completedCount++;
            }
        }

        if (completedCount === totalSteps) {
            setStepStatuses(prev => {
                const updated = {
                    ...prev,
                    [stageNumber]: {
                        ...prev[stageNumber],
                        stageStatus: 'completed'
                    }
                };
                const nextStageNumber = stageNumber + 1;
                if (nextStageNumber <= 4) {
                    updated[nextStageNumber] = {
                        ...prev[nextStageNumber],
                        1: 'in_progress',
                        2: prev[nextStageNumber]?.[2] || 'pending',
                        3: prev[nextStageNumber]?.[3] || 'pending',
                        stageStatus: 'in_progress'
                    };
                }
                return updated;
            });
        }
    }
    // Theo dõi trạng thái hoàn thành của các giai đoạn để tự động reload roadmap
    useEffect(() => {
        // Kiểm tra nếu bất kỳ giai đoạn nào vừa chuyển sang 'completed'
        if (!roadmapData || roadmapData.length === 0) return;
        roadmapData.forEach((stage) => {
            const localStatus = stepStatuses[stage.stepNumber]?.stageStatus;
            // Nếu localStatus là 'completed' mà backend chưa cập nhật (stage.stepStatus !== 'completed')
            if (localStatus === 'completed' && stage.stepStatus !== 'completed') {
                fetchData();
            }
        });
    }, [stepStatuses, roadmapData]);

    const getStepButtonText = (stageStatus, stepStatus) => {
        if (stepStatus === 'completed') return 'Đã hoàn thành';
        if (stageStatus === 'completed') return 'Đã hoàn thành';
        if (stageStatus === 'in_progress' && stepStatus === 'in_progress') return 'Xác nhận hoàn thành';
        if (stageStatus === 'pending') return 'Đang chờ';
        return 'Đang chờ';
    };

    const isStepButtonClickable = (stageStatus, stepStatus) => {
        return stageStatus === 'in_progress' && stepStatus === 'in_progress';
    };
    // SỬA: Lấy class CSS cho nút
    const getStepButtonClass = (stageStatus, stepStatus) => {
        if (stepStatus === 'completed' || stageStatus === 'completed') return 'btn btn-success btn-sm';
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
                                                    const stageStatus = stepStatuses[stage.stepNumber]?.stageStatus || stage.stepStatus;

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

                                                            {/* SỬA: Nút xác nhận hoàn thành cho từng bước */}
                                                            <div className="step-action">
                                                                <button
                                                                    className={getStepButtonClass(stageStatus, stepStatus)}
                                                                    onClick={() => handleStepStatusClick(stage.stepNumber, stepNumber)}
                                                                    disabled={!isStepButtonClickable(stageStatus, stepStatus)}
                                                                    title={isStepButtonClickable(stageStatus, stepStatus)
                                                                        ? "Click để đánh dấu bước này đã hoàn thành"
                                                                        : "Bước này chưa thể hoàn thành"}
                                                                >
                                                                    {stepStatus === 'completed' && <i className="fas fa-check me-1"></i>}
                                                                    {stepStatus === 'in_progress' && <i className="fas fa-play me-1"></i>}
                                                                    {stepStatus === 'pending' && <i className="fas fa-clock me-1"></i>}
                                                                    {getStepButtonText(stageStatus, stepStatus)}
                                                                </button>
                                                            </div>
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
            <ToastContainer />
        </div>
    );
}

export default ConsultationRoadmap;