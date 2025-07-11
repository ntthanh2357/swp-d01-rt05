import React from 'react';
import '../css/countries.css';
import { useNavigate } from 'react-router-dom';

const countries = [
    {
        name: 'United States',
        label: 'United States',
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
        title: 'United States: Global Innovation Hub',
        content: 'Study at world-renowned universities, fostering research and innovation.',
        button: 'Study in the United States'
    },
    {
        name: 'United Kingdom',
        label: 'United Kingdom',
        image: 'https://images.unsplash.com/photo-1505761671935-60b3a7427bad?auto=format&fit=crop&w=1200&q=80',
        title: 'United Kingdom: Where Tradition Meets Modernity',
        content: 'World-class education in the UK will launch your global mindset.',
        button: 'Study in the United Kingdom'
    },
    {
        name: 'Canada',
        label: 'Canada',
        image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=1200&q=80',
        title: 'Canada: Gateway to Quality Education',
        content: 'Access advanced education with reasonable costs and a safe environment.',
        button: 'Study in Canada'
    },
    {
        name: 'Australia',
        label: 'Australia',
        image: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=1200&q=80',
        title: 'Australia: Leading Academic Center',
        content: 'Experience top-tier education in a vibrant, multicultural environment.',
        button: 'Study in Australia'
    },
    {
        name: 'Ireland',
        label: 'Ireland',
        image: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=1200&q=80',
        title: 'Ireland: Knowledge and Culture Hub',
        content: 'High-quality education combined with Irish hospitality.',
        button: 'Study in Ireland'
    },
    {
        name: 'Germany',
        label: 'Germany',
        image: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=1200&q=80',
        title: 'Germany: World-Class Education',
        content: 'Germany offers world-class education and holistic development opportunities.',
        button: 'Study in Germany'
    },
];

export default function Countries() {
    const navigate = useNavigate();
    const handleStudyAbroadClick = (countryName) => {
        navigate(`/search-university?countries=${encodeURIComponent(countryName)}`);
    };
    return (
        <section className="container-fluid bg-custom-gray py-5 mt-5">
            <h3 className="fw-bold mb-2 text-center mb-4">Your Dream Study Abroad Journey Awaits</h3>
            <p className="text-muted mb-4 text-center mb-4">
                Start your academic adventure in these exciting and welcoming destinations!
            </p>
            <div className="row justify-content-center">
                {countries.map((c, idx) => (
                    <div key={idx} className="col-12 col-sm-6 col-md-4 mb-4 d-flex align-items-stretch">
                        <div
                            className="country-card country-card-sm w-100 position-relative h-100 country-card-clickable"
                            onClick={() => handleStudyAbroadClick(c.name)}
                            style={{ cursor: 'pointer' }}
                        >
                            <img src={c.image} alt={c.name} className="img-fluid rounded country-img-sm" />
                            <div className="overlay-sm country-hover-info">
                                <h6 className="text-primary fw-bold mb-1">{c.title}</h6>
                                <p className="text-white small mb-2">{c.content}</p>
                                <button className="btn btn-primary btn-sm" onClick={e => { e.stopPropagation(); handleStudyAbroadClick(c.name); }}>
                                    {c.button}
                                </button>
                            </div>
                            <div className="label-sm">{c.label}</div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}