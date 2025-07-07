package com.swp391_g6.demo.util;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Component;

@Component
public class EmailUtil {

    @Autowired
    private JavaMailSender javaMailSender;

    public void sendOtpEmail(String toEmail, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Xác thực đăng ký");
        message.setText("Mã xác thực của bạn là: " + otp);
        javaMailSender.send(message);
    }

    public void sendResetPasswordEmail(String toEmail, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Xác thực đặt lại mật khẩu");
        message.setText("Mã xác thực của bạn là: " + otp);
        javaMailSender.send(message);
    }

    public void sendUpdateProfileEmail(String toEmail, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Xác thực cập nhật thông tin cá nhân");
        message.setText("Mã xác thực của bạn là: " + otp);
        javaMailSender.send(message);
    }

}
