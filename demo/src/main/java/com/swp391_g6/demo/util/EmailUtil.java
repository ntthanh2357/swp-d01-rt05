package com.swp391_g6.demo.util;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;

@Component
public class EmailUtil {

    @Autowired
    private JavaMailSender javaMailSender;

    private void sendHtmlEmail(String toEmail, String subject, String otp, String action) {
        String htmlContent = "<div style=\"font-family: Arial, sans-serif; background: #f6f6f6; padding: 32px;\">" +
                "<div style=\"max-width: 420px; margin: auto; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px #eee; padding: 32px 24px;\">" +
                "<div style=\"text-align:center;\">" +
                "<img src=\"https://upload.wikimedia.org/wikipedia/commons/7/77/League_of_Legends_logo.svg\" alt=\"Logo\" style=\"width:48px;height:48px;margin-bottom:12px;\"/>" +
                "<h2 style=\"margin:0 0 12px 0; color:#d32f2f;\">Mã " + action + "</h2>" +
                "<p style=\"font-size:16px; color:#333;\">Đây là mã " + action.toLowerCase() + " của bạn:</p>" +
                "<div style=\"font-size:32px; letter-spacing:8px; font-weight:bold; color:#222; margin:16px 0;\">" + otp + "</div>" +
                "<p style=\"color:#888; font-size:13px;\">Mã này sẽ sớm hết hạn. Vui lòng không chia sẻ mã này cho bất kỳ ai.</p>" +
                "</div>" +
                "<hr style=\"margin:24px 0; border:none; border-top:1px solid #eee;\">" +
                "<div style=\"font-size:12px; color:#888; text-align:center;\">" +
                "Nếu bạn không yêu cầu mã này, hãy bỏ qua email này hoặc đổi mật khẩu để bảo vệ tài khoản." +
                "</div>" +
                "</div></div>";

        try {
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setTo(toEmail);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);
            javaMailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Gửi email thất bại", e);
        }
    }

    public void sendOtpEmail(String toEmail, String otp) {
        sendHtmlEmail(toEmail, "Mã Xác Thực Đăng Ký", otp, "Đăng Ký");
    }

    public void sendResetPasswordEmail(String toEmail, String otp) {
        sendHtmlEmail(toEmail, "Mã Xác Thực Đặt Lại Mật Khẩu", otp, "Đặt Lại Mật Khẩu");
    }

    public void sendUpdateProfileEmail(String toEmail, String otp) {
        sendHtmlEmail(toEmail, "Mã Xác Thực Cập Nhật Thông Tin", otp, "Cập Nhật Thông Tin");
    }
}