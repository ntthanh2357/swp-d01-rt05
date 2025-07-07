import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SuperBanner from '../components/Banner';
import LearnMore from '../components/LearnMore';

export default function About() {
  return (
    <>
    <Header/>
    <SuperBanner/>
    <div className="container my-5">       
      <h1 className="text-center mb-4">Về Heatwave</h1>
      
      <p>
        <strong>Heatwave</strong> là nền tảng tiên phong trong việc kết nối sinh viên với các cơ hội học bổng đa dạng và phù hợp nhất trên toàn thế giới. 
        Chúng tôi hiểu rằng việc tìm kiếm và ứng tuyển học bổng có thể là một hành trình đầy thử thách và phức tạp. Vì vậy, Heatwave ra đời với sứ mệnh giúp bạn tiếp cận nhanh chóng, chính xác và hiệu quả các nguồn tài trợ giáo dục từ các trường đại học danh tiếng, các tổ chức giáo dục hàng đầu và các quỹ học bổng uy tín.
      </p>

      <p>
        Chúng tôi kết hợp sức mạnh của công nghệ hiện đại với sự am hiểu sâu sắc về thị trường giáo dục toàn cầu để xây dựng một nền tảng thân thiện, dễ sử dụng và cá nhân hóa theo nhu cầu riêng biệt của từng sinh viên. Qua hệ thống phân tích dữ liệu thông minh, Heatwave giúp bạn lọc và lựa chọn các học bổng phù hợp dựa trên lĩnh vực học tập, trình độ, quốc gia, mức chi phí cũng như năng lực học tập và tài chính cá nhân.
      </p>

      <p>
        Đội ngũ chuyên gia tận tâm của Heatwave luôn đồng hành cùng bạn từ bước tìm hiểu, lựa chọn, đến việc chuẩn bị hồ sơ, nộp đơn và theo dõi tiến trình xét duyệt học bổng. Chúng tôi không chỉ cung cấp thông tin học bổng mà còn hỗ trợ tư vấn chiến lược ứng tuyển hiệu quả, giúp bạn nâng cao cơ hội thành công trong quá trình cạnh tranh.
      </p>

      <p>
        Bên cạnh đó, Heatwave cam kết mang đến trải nghiệm tìm kiếm học bổng minh bạch và an toàn, bảo mật thông tin cá nhân của người dùng. Các dữ liệu và kết quả phân tích được cập nhật liên tục dựa trên các thay đổi trong chính sách học bổng của các tổ chức giáo dục và các điều kiện thị trường giáo dục quốc tế.
      </p>

      <p>
        Với Heatwave, hành trình chinh phục học bổng và giấc mơ du học trở nên dễ dàng hơn bao giờ hết. Chúng tôi tự hào là người bạn đồng hành tin cậy, giúp hàng ngàn sinh viên trên thế giới tìm được “cánh cửa” bước vào các khóa học mơ ước, tạo nền tảng vững chắc cho sự nghiệp tương lai.
      </p>

      <p className="text-center fw-bold mt-5">
        Hãy để Heatwave giúp bạn biến ước mơ học tập quốc tế thành hiện thực ngay hôm nay!
      </p>
    </div>
    <LearnMore/>
    <Footer/>
    </>
  );
}

