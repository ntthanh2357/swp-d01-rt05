import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import DetailScholarship from './DetailScholarship';

function DetailPage() {
    const { id } = useParams();
    const [scholarship, setScholarship] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:5000/api/scholarships/${id}`)
            .then((res) => res.json())
            .then((data) => setScholarship(data))
            .catch((err) => console.error(err));
    }, [id]);

    if (!scholarship) return <p>Đang tải...</p>;

    return (
        <div className="container my-4">
            <DetailScholarship scholarship={scholarship} />
        </div>
    );
}

export default DetailPage;
