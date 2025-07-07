import { useEffect, useState, useContext } from "react";
import moment from "moment";
import { UserContext } from "../contexts/UserContext";
import { getRegistrationStats } from "../services/userApi";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

function UserChart() {
    const { user: contextUser } = useContext(UserContext);
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await getRegistrationStats({ token: contextUser.accessToken });
                setData(res.data.map(item => ({
                    date: item.date,
                    count: item.count
                })));
            } catch (err) {
                setData([]);
            }
        };
        fetchStats();
    }, [contextUser]);

    return (
        <div style={{ width: "100%", height: 400 }}>
            <h4 className="mb-4 text-center">Biểu đồ số người đăng ký theo ngày</h4>
            <ResponsiveContainer>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="date"
                        tickFormatter={date => moment(date).format("DD/MM/YYYY")}
                    />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Line type="monotone" dataKey="count" stroke="#8884d8" />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}

export default UserChart;