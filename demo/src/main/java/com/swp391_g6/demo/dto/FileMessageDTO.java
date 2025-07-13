package com.swp391_g6.demo.dto;

public class FileMessageDTO {
    private String senderId;
    private String senderName;
    private String senderRole;
    private String receiverId;
    private String message;
    private String messageType; // "image" or "document"
    private String fileUrl;
    private String fileName;
    private String fileType;
    private Long fileSize;

    // Constructors
    public FileMessageDTO() {
    }

    public FileMessageDTO(String senderId, String senderName, String senderRole, 
                         String receiverId, String message, String messageType,
                         String fileUrl, String fileName, String fileType, Long fileSize) {
        this.senderId = senderId;
        this.senderName = senderName;
        this.senderRole = senderRole;
        this.receiverId = receiverId;
        this.message = message;
        this.messageType = messageType;
        this.fileUrl = fileUrl;
        this.fileName = fileName;
        this.fileType = fileType;
        this.fileSize = fileSize;
    }

    // Getters and Setters
    public String getSenderId() {
        return senderId;
    }

    public void setSenderId(String senderId) {
        this.senderId = senderId;
    }

    public String getSenderName() {
        return senderName;
    }

    public void setSenderName(String senderName) {
        this.senderName = senderName;
    }

    public String getSenderRole() {
        return senderRole;
    }

    public void setSenderRole(String senderRole) {
        this.senderRole = senderRole;
    }

    public String getReceiverId() {
        return receiverId;
    }

    public void setReceiverId(String receiverId) {
        this.receiverId = receiverId;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getMessageType() {
        return messageType;
    }

    public void setMessageType(String messageType) {
        this.messageType = messageType;
    }

    public String getFileUrl() {
        return fileUrl;
    }

    public void setFileUrl(String fileUrl) {
        this.fileUrl = fileUrl;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getFileType() {
        return fileType;
    }

    public void setFileType(String fileType) {
        this.fileType = fileType;
    }

    public Long getFileSize() {
        return fileSize;
    }

    public void setFileSize(Long fileSize) {
        this.fileSize = fileSize;
    }

    @Override
    public String toString() {
        return "FileMessageDTO{" +
                "senderId='" + senderId + '\'' +
                ", senderName='" + senderName + '\'' +
                ", senderRole='" + senderRole + '\'' +
                ", receiverId='" + receiverId + '\'' +
                ", message='" + message + '\'' +
                ", messageType='" + messageType + '\'' +
                ", fileUrl='" + fileUrl + '\'' +
                ", fileName='" + fileName + '\'' +
                ", fileType='" + fileType + '\'' +
                ", fileSize=" + fileSize +
                '}';
    }
}