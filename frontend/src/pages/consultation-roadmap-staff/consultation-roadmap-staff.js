import React, { useEffect, useState, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { UserContext } from "../../contexts/UserContext";
import { getPremiumSeekers } from "../../services/staffApi";
import { getSeekerStageDetails, getSeekerRoadmap } from "../../services/consultationRoadmapApi";
import { sendNotification } from "../../services/notificationApi";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import "./consultation-roadmap-staff.css";

function ConsultationRoadmapStaff() {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();
    const [initialLoading, setInitialLoading] = useState(true);
    const [loading, setLoading] = useState(true);
    const [premiumSeekers, setPremiumSeekers] = useState([]);
    const [selectedSeeker, setSelectedSeeker] = useState(null);
    const [roadmapData, setRoadmapData] = useState([]);
    const [progressData, setProgressData] = useState({});
    const [loadingRoadmap, setLoadingRoadmap] = useState(false);
    const [error, setError] = useState("");

    // States cho detail steps
    const [expandedStage, setExpandedStage] = useState(null);
    const [stageDetails, setStageDetails] = useState({});
    const [loadingDetails, setLoadingDetails] = useState({});

    // Auto-refresh cho staff
    const [autoRefresh, setAutoRefresh] = useState(true);
    const refreshIntervalRef = useRef(null);

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
            fetchPremiumSeekers();
        }
        // eslint-disable-next-line
    }, [initialLoading, user, navigate]);

    const fetchPremiumSeekers = async () => {
        try {
            if (!user || !user.accessToken) {
                navigate('/auth/login');
                return;
            }

            console.log("Fetching premium seekers...");
            const response = await getPremiumSeekers(user.accessToken);
            console.log("Premium seekers response:", response);

            let seekersData = [];
            if (response.data) {
                if (Array.isArray(response.data)) {
                    seekersData = response.data;
                } else if (response.data.data && Array.isArray(response.data.data)) {
                    seekersData = response.data.data;
                } else if (response.data.success && response.data.data && Array.isArray(response.data.data)) {
                    seekersData = response.data.data;
                } else if (typeof response.data === 'object' && !Array.isArray(response.data)) {
                    console.warn("Unexpected response structure:", response.data);
                    seekersData = [];
                }
            }

            console.log("Processed seekers data:", seekersData);
            setPremiumSeekers(seekersData);

            if (seekersData.length === 0) {
                console.log("No premium seekers found");
            }

        } catch (error) {
            console.error("Error fetching premium seekers:", error);

            let errorMessage = "Có lỗi xảy ra khi tải danh sách seekers";
            if (error.response) {
                console.error("Error response:", error.response.data);
                if (error.response.data && error.response.data.message) {
                    errorMessage = error.response.data.message;
                } else if (error.response.data && typeof error.response.data === 'string') {
                    errorMessage = error.response.data;
                }
            }

            setError(errorMessage);
            setPremiumSeekers([]);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // Auto-refresh roadmap khi có seeker được chọn
    useEffect(() => {
        if (selectedSeeker && autoRefresh) {
            const startAutoRefresh = () => {
                refreshIntervalRef.current = setInterval(() => {
                    console.log("[AUTO-REFRESH] Refreshing roadmap for seeker:", selectedSeeker.seekerId);
                    handleSelectSeeker(selectedSeeker, false);
                }, 30000);
            };

            startAutoRefresh();

            return () => {
                if (refreshIntervalRef.current) {
                    clearInterval(refreshIntervalRef.current);
                }
            };
        }
    }, [selectedSeeker, autoRefresh]);

    const handleSelectSeeker = async (seeker, showLoading = true) => {
        if (showLoading) {
            setSelectedSeeker(seeker);
            setLoadingRoadmap(true);
            setError("");
        }

        try {
            console.log("Fetching roadmap for seeker:", seeker.seekerId);
            const response = await getSeekerRoadmap(user.accessToken, seeker.seekerId);
            console.log("Roadmap response:", response);

            if (response.data && response.data.success) {
                const newRoadmapData = response.data.roadmap || [];
                const newProgressData = response.data.progress || {};

                const hasChanges = JSON.stringify(newRoadmapData) !== JSON.stringify(roadmapData) ||
                    JSON.stringify(newProgressData) !== JSON.stringify(progressData);

                if (hasChanges && !showLoading) {
                    toast.info(`🔄 Lộ trình của ${seeker.name} đã được cập nhật!`, {
                        position: "top-right",
                        autoClose: 5000,
                    });
                }

                setRoadmapData(newRoadmapData);
                setProgressData(newProgressData);
                console.log("Roadmap loaded successfully:", newRoadmapData?.length, "steps");
            } else {
                if (showLoading) {
                    setError("Seeker chưa có lộ trình tư vấn");
                    setRoadmapData([]);
                    setProgressData({});
                }
            }
        } catch (error) {
            console.error("Error fetching roadmap:", error);
            if (showLoading) {
                let errorMessage = "Có lỗi xảy ra khi tải lộ trình tư vấn";

                if (error.response) {
                    console.error("Error response data:", error.response.data);
                    if (error.response.status === 404) {
                        errorMessage = "Seeker chưa có lộ trình tư vấn. Lộ trình sẽ được tạo khi seeker truy cập lần đầu.";
                    } else if (error.response.status === 403) {
                        errorMessage = "Bạn không có quyền xem lộ trình này.";
                    } else if (error.response.data && error.response.data.error) {
                        errorMessage = error.response.data.error;
                    }
                }

                setError(errorMessage);
                setRoadmapData([]);
                setProgressData({});
            }
        } finally {
            if (showLoading) {
                setLoadingRoadmap(false);
            }
        }
    };

    const toggleAutoRefresh = () => {
        setAutoRefresh(prev => {
            const newValue = !prev;
            if (newValue) {
                toast.success("Đã bật tự động cập nhật");
            } else {
                toast.info("Đã tắt tự động cập nhật");
                if (refreshIntervalRef.current) {
                    clearInterval(refreshIntervalRef.current);
                }
            }
            return newValue;
        });
    };

    const handleManualRefresh = async () => {
        if (selectedSeeker) {
            await handleSelectSeeker(selectedSeeker, true);
            toast.success("Đã cập nhật lộ trình thành công!");
        }
    };

    const handleExpandStage = async (stageNumber) => {
        const isCurrentlyExpanded = expandedStage === stageNumber;
        if (isCurrentlyExpanded) {
            setExpandedStage(null);
            return;
        }
        setExpandedStage(stageNumber);

        if (selectedSeeker && selectedSeeker.seekerId) {
            setLoadingDetails(prev => ({ ...prev, [stageNumber]: true }));
            try {
                console.log("Fetching stage details for seeker:", user.accessToken, selectedSeeker.seekerId, "stage:", stageNumber);
                const response = await getSeekerStageDetails(
                    user.accessToken,
                    selectedSeeker.seekerId,
                    stageNumber
                );
                console.log("Stage details response:", response);
                if (response.data && response.data.success) {
                    setStageDetails(prev => ({
                        ...prev,
                        [`${selectedSeeker.seekerId}_${stageNumber}`]: response.data.stageDetails || []
                    }));
                } else {
                    toast.warning("Không thể tải chi tiết giai đoạn");
                }
            } catch (error) {
                toast.error("Không thể tải chi tiết giai đoạn");
            } finally {
                setLoadingDetails(prev => ({ ...prev, [stageNumber]: false }));
            }
        }
    };

    const handleSendNotification = async (stageNumber, stepIndex, stepTitle) => {
        if (!selectedSeeker) return;
        const message = `Nhắc nhở về bước: ${stepTitle} trong giai đoạn ${stageNumber}`;
        try {
            await sendNotification(
                selectedSeeker.seekerId,
                "Nhắc nhở hoàn thành bước",
                message,
                "roadmap",
                user.accessToken
            );
            toast.success("Đã gửi thông báo!");
        } catch (error) {
            toast.error("Gửi thông báo thất bại");
        }
    };

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
        if (!description) return null;
        return description.split('\n').map((line, index) => (
            <div key={index} className="description-line">
                {line}
            </div>
        ));
    };

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

    if (loading) {
        return (
            <div>
                <Header />
                <div className="container">
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <div>
                            <h5>Đang tải danh sách seekers...</h5>
                            <p className="text-muted">Vui lòng chờ trong giây lát</p>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div>
            <Header />
            <div className="container consultation-roadmap-staff-container">
                <div className="roadmap-header">
                    <button
                        className="btn btn-outline-secondary mb-3"
                        onClick={() => navigate('/staff/staff-dashboard')}
                    >
                        ← Quay lại Dashboard
                    </button>
                    <h2 className="page-title">Quản lý Lộ trình Tư vấn</h2>
                    <p className="text-muted">Theo dõi và hỗ trợ lộ trình tư vấn cho các seekers premium</p>

                    {selectedSeeker && (
                        <div className="d-flex justify-content-center gap-2 mt-3">
                            <button
                                className={`btn btn-sm ${autoRefresh ? 'btn-success' : 'btn-outline-secondary'}`}
                                onClick={toggleAutoRefresh}
                                title={autoRefresh ? "Tắt tự động cập nhật" : "Bật tự động cập nhật"}
                            >
                                <i className={`fas ${autoRefresh ? 'fa-pause' : 'fa-play'}`}></i>
                                {autoRefresh ? ' Tự động cập nhật' : ' Bật tự động cập nhật'}
                            </button>
                            <button
                                className="btn btn-sm btn-outline-primary"
                                onClick={handleManualRefresh}
                                title="Cập nhật thủ công"
                            >
                                <i className="fas fa-sync-alt"></i>
                                Cập nhật ngay
                            </button>
                        </div>
                    )}
                </div>

                <div className="row">
                    {/* Danh sách Seekers */}
                    <div className="col-md-4">
                        <div className="seekers-list">
                            <h5 className="mb-3">
                                <i className="fas fa-users me-2"></i>
                                Seekers Premium ({Array.isArray(premiumSeekers) ? premiumSeekers.length : 0})
                            </h5>

                            {!Array.isArray(premiumSeekers) || premiumSeekers.length === 0 ? (
                                <div className="empty-state">
                                    <div className="text-center text-muted py-4">
                                        <div className="mb-2">👥</div>
                                        {error ? (
                                            <>
                                                <div className="text-danger">Lỗi: {error}</div>
                                                <small>Vui lòng thử lại sau</small>
                                            </>
                                        ) : (
                                            <>
                                                <div>Chưa có seeker premium nào</div>
                                                <small>Seekers premium sẽ xuất hiện khi có người mua gói premium và được assign cho bạn</small>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                premiumSeekers.map((seeker, index) => (
                                    <div
                                        key={seeker.seekerId || index}
                                        className={`seeker-card ${selectedSeeker?.seekerId === seeker.seekerId ? 'active' : ''}`}
                                        onClick={() => handleSelectSeeker(seeker, true)}
                                    >
                                        <div className="seeker-avatar">
                                            {seeker.name ? seeker.name.charAt(0).toUpperCase() : 'U'}
                                        </div>
                                        <div className="seeker-info">
                                            <h6 className="seeker-name">{seeker.name || 'Chưa cập nhật'}</h6>
                                            <p className="seeker-email">{seeker.email || 'Chưa có email'}</p>
                                            <div className="d-flex justify-content-between align-items-center">
                                                <span className="seeker-package badge bg-success">Premium</span>
                                                {seeker.assignedAt && (
                                                    <small className="text-muted">
                                                        {formatDate(seeker.assignedAt)}
                                                    </small>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Lộ trình tư vấn */}
                    <div className="col-md-8">
                        {selectedSeeker ? (
                            <div className="roadmap-content">
                                <div className="seeker-header">
                                    <div className="d-flex align-items-center justify-content-between">
                                        <div>
                                            <h5>
                                                <i className="fas fa-route me-2"></i>
                                                Lộ trình của {selectedSeeker.name || 'Seeker'}
                                                {autoRefresh && (
                                                    <span className="badge bg-success ms-2" title="Đang tự động cập nhật">
                                                        <i className="fas fa-sync fa-spin"></i>
                                                    </span>
                                                )}
                                            </h5>
                                            <small className="text-muted">ID: {selectedSeeker.seekerId}</small>
                                        </div>
                                        <div className="text-end">
                                            <small className="text-muted">
                                                <i className="fas fa-envelope me-1"></i>
                                                {selectedSeeker.email}
                                            </small>
                                            {selectedSeeker.phone && (
                                                <div>
                                                    <small className="text-muted">
                                                        <i className="fas fa-phone me-1"></i>
                                                        {selectedSeeker.phone}
                                                    </small>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {loadingRoadmap ? (
                                    <div className="text-center py-4">
                                        <div className="spinner-border spinner-border-sm me-2"></div>
                                        Đang tải lộ trình...
                                    </div>
                                ) : error ? (
                                    <div className="alert alert-warning">
                                        <h6><i className="fas fa-exclamation-triangle me-2"></i>Chưa có lộ trình tư vấn</h6>
                                        <p>{error}</p>
                                        <hr />
                                        <p className="mb-0">
                                            <strong>Lưu ý:</strong> Lộ trình sẽ được tạo tự động khi seeker truy cập trang lộ trình lần đầu.
                                        </p>
                                    </div>
                                ) : roadmapData.length > 0 ? (
                                    <>
                                        {/* Progress Overview */}
                                        <div className="progress-overview">
                                            <h6><i className="fas fa-chart-line me-2"></i>Tiến độ tổng quan</h6>
                                            <div className="progress mb-2">
                                                <div
                                                    className="progress-bar progress-bar-striped"
                                                    style={{ width: `${progressData.progressPercentage || 0}%` }}
                                                >
                                                    {progressData.progressPercentage || 0}%
                                                </div>
                                            </div>
                                            <small className="text-muted">
                                                <i className="fas fa-tasks me-1"></i>
                                                {progressData.completedSteps || 0}/{progressData.totalSteps || 0} giai đoạn đã hoàn thành
                                            </small>
                                            {progressData.currentStep && (
                                                <div className="mt-2">
                                                    <small className="text-primary">
                                                        <i className="fas fa-play-circle me-1"></i>
                                                        <strong>Giai đoạn hiện tại:</strong> {progressData.currentStep.stepTitle}
                                                    </small>
                                                </div>
                                            )}
                                        </div>

                                        {/* Roadmap Timeline */}
                                        <div className="timeline-container">
                                            {roadmapData.map((stage, index) => (
                                                <div
                                                    key={stage.roadmapId}
                                                    className={`timeline-item ${stage.stepStatus} fade-in`}
                                                    style={{ animationDelay: `${index * 0.1}s` }}
                                                >
                                                    <div className="timeline-marker">
                                                        <span className={`status-icon ${getStatusColor(stage.stepStatus)}`}>
                                                            {getStatusIcon(stage.stepStatus)}
                                                        </span>
                                                    </div>
                                                    <div className="timeline-content">
                                                        <div className="step-header">
                                                            <h6 className="stage-title">{stage.stepTitle}</h6>
                                                            <div className="d-flex align-items-center gap-2">
                                                                <span className={`badge bg-${getStatusColor(stage.stepStatus)}`}>
                                                                    {getStatusText(stage.stepStatus)}
                                                                </span>
                                                                {/* SỬA: Chỉ có nút Chi tiết */}
                                                                <div className="staff-actions">
                                                                    <button
                                                                        className="btn btn-sm btn-outline-primary"
                                                                        onClick={() => handleExpandStage(stage.stepNumber)}
                                                                        title="Xem chi tiết các bước"
                                                                    >
                                                                        <i className={`fas ${expandedStage === stage.stepNumber ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
                                                                        {expandedStage === stage.stepNumber ? ' Thu gọn' : ' Chi tiết'}
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="step-description">
                                                            {formatDescription(stage.stepDescription)}
                                                        </div>

                                                        {/* Chi tiết các bước khi mở rộng */}
                                                        {expandedStage === stage.stepNumber && (
                                                            <div className="stage-details">
                                                                {loadingDetails[stage.stepNumber] ? (
                                                                    <div className="text-center py-3">
                                                                        <div className="spinner-border spinner-border-sm me-2"></div>
                                                                        Đang tải chi tiết các bước...
                                                                    </div>
                                                                ) : Array.isArray(stageDetails[`${selectedSeeker.seekerId}_${stage.stepNumber}`]) ? (
                                                                    <div className="detailed-steps">
                                                                        <h6 className="mb-3">
                                                                            <i className="fas fa-list-ol me-2"></i>
                                                                            Các bước chi tiết:
                                                                        </h6>
                                                                        {stageDetails[`${selectedSeeker.seekerId}_${stage.stepNumber}`].map((step, stepIndex) => (
                                                                            <div key={stepIndex} className="detail-step-card">
                                                                                <div className="detail-step-header" style={{ justifyContent: "space-between" }}>
                                                                                    <div className="d-flex align-items-center">
                                                                                        <span className="step-indicator">{step.stepIndex}</span>
                                                                                        <h6 className="step-title mb-0 flex-grow-1">{step.title}</h6>
                                                                                    </div>
                                                                                    <div className="step-actions" style={{ marginLeft: "auto" }}>
                                                                                        <button
                                                                                            className="btn btn-sm btn-outline-info"
                                                                                            onClick={() => handleSendNotification(stage.stepNumber, step.stepIndex, step.title)}
                                                                                            title="Gửi thông báo cho seeker về bước này"
                                                                                        >
                                                                                            <i className="fas fa-paper-plane"></i> Thông báo
                                                                                        </button>
                                                                                    </div>
                                                                                </div>
                                                                                <p className="step-description mb-2">{step.description}</p>
                                                                                <div className="step-timeline">
                                                                                    <small className="text-muted">
                                                                                        <i className="fas fa-clock me-1"></i>
                                                                                        Thời gian dự kiến: {step.estimatedDuration} ngày
                                                                                    </small>
                                                                                    <span className={`badge ms-2 bg-${getStatusColor(step.status)}`}>
                                                                                        {getStatusText(step.status)}
                                                                                    </span>
                                                                                </div>
                                                                            </div>
                                                                        ))}

                                                                        <div className="stage-summary mt-3 p-3 bg-light rounded">
                                                                            <h6 className="mb-2">
                                                                                <i className="fas fa-info-circle me-2"></i>
                                                                                Hướng dẫn cho Staff:
                                                                            </h6>
                                                                            <ul className="mb-0">
                                                                                <li>Theo dõi tiến độ của seeker trong từng bước</li>
                                                                                <li>Sử dụng nút <i className="fas fa-paper-plane"></i> để gửi thông báo nhắc nhở về bước cụ thể</li>
                                                                                <li>Chỉ seeker mới có thể đánh dấu hoàn thành các bước</li>
                                                                                <li>Hỗ trợ và tư vấn khi seeker cần giúp đỡ</li>
                                                                            </ul>
                                                                        </div>
                                                                    </div>
                                                                ) : (
                                                                    <div className="text-muted text-center py-3">
                                                                        <i className="fas fa-exclamation-circle me-2"></i>
                                                                        Không có thông tin chi tiết cho giai đoạn này
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}

                                                        <div className="step-details">
                                                            <div className="row">
                                                                <div className="col-md-6">
                                                                    <small>
                                                                        <i className="fas fa-calendar-alt me-1"></i>
                                                                        <strong>Thời gian dự kiến:</strong> {stage.estimatedDurationDays} ngày<br />
                                                                        <i className="fas fa-plus-circle me-1"></i>
                                                                        <strong>Ngày tạo:</strong> {formatDate(stage.createdAt)}
                                                                        {stage.completedAt && (
                                                                            <>
                                                                                <br />
                                                                                <i className="fas fa-check-circle me-1"></i>
                                                                                <strong>Ngày hoàn thành:</strong> {formatDate(stage.completedAt)}
                                                                            </>
                                                                        )}
                                                                    </small>
                                                                </div>
                                                                {stage.notes && (
                                                                    <div className="col-md-6">
                                                                        <small>
                                                                            <i className="fas fa-sticky-note me-1"></i>
                                                                            <strong>Ghi chú staff:</strong><br />
                                                                            <em>{stage.notes}</em>
                                                                        </small>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Staff Guidelines */}
                                        <div className="staff-guidelines mt-4">
                                            <div className="alert alert-info">
                                                <h6>
                                                    <i className="fas fa-lightbulb me-2"></i>
                                                    Hướng dẫn sử dụng cho Staff:
                                                </h6>
                                                <ul className="mb-0">
                                                    <li><strong>Xem chi tiết:</strong> Click "Chi tiết" để xem từng bước cụ thể trong giai đoạn</li>
                                                    <li><strong>Gửi thông báo:</strong> Sử dụng nút <i className="fas fa-paper-plane"></i> để nhắc nhở seeker về bước cần hoàn thành</li>
                                                    <li><strong>Tự động cập nhật:</strong> Hệ thống sẽ tự động cập nhật khi seeker hoàn thành bước</li>
                                                    <li><strong>Vai trò:</strong> Staff chỉ hỗ trợ và theo dõi, không thể đánh dấu hoàn thành cho seeker</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="empty-roadmap">
                                        <div className="text-center text-muted py-4">
                                            <div className="mb-2">📋</div>
                                            <div>Chưa có lộ trình tư vấn</div>
                                            <small>Lộ trình sẽ được tạo tự động khi seeker truy cập trang lộ trình</small>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="no-selection">
                                <div className="text-center text-muted py-5">
                                    <div className="mb-3">
                                        <i className="fas fa-mouse-pointer" style={{ fontSize: '3rem' }}></i>
                                    </div>
                                    <h5>Chọn một seeker để xem lộ trình</h5>
                                    <p>Chọn seeker từ danh sách bên trái để xem và hỗ trợ quản lý lộ trình tư vấn của họ</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
            <ToastContainer />
        </div>
    );
}

export default ConsultationRoadmapStaff;