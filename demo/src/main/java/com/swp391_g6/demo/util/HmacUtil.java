// file: src/main/java/com/swp391_g6/demo/util/HmacUtil.java

package com.swp391_g6.demo.util;

import org.apache.commons.codec.binary.Hex;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;

// Lưu ý: javax.crypto là một phần của JDK (Java Development Kit) gốc,
// không phải của Java EE, nên nó vẫn là "javax" kể cả trong môi trường Jakarta.
public class HmacUtil {
    public static String HmacSHA256(String key, String data) {
        try {
            Mac sha256_HMAC = Mac.getInstance("HmacSHA256");
            SecretKeySpec secret_key = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            sha256_HMAC.init(secret_key);
            return Hex.encodeHexString(sha256_HMAC.doFinal(data.getBytes(StandardCharsets.UTF_8)));
        } catch (Exception e) {
            throw new RuntimeException("Lỗi khi tạo chữ ký HMAC", e);
        }
    }
}