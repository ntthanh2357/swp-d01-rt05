import { useEffect, useState, useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import { getStaffActivityChart } from "../services/staffApi";
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, LabelList
} from "recharts";

function StaffActivityChart() {
    const { user: contextUser } = useContext(UserContext);
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchActivityData = async () => {
            try {
                const res = await getStaffActivityChart({ token: contextUser.accessToken });
                // Chuẩn hóa dữ liệu: nếu API trả về labels/data
                if (res.data.labels && res.data.data) {
                    setData(res.data.labels.map((label, idx) => ({
                        date: label,
                        casesHandled: res.data.data[idx]
                    })));
                } else if (Array.isArray(res.data)) {
                    setData(res.data);
                } else {
                    setData([]);
                }
            } catch (err) {
                setData([]);
            }
        };
        fetchActivityData();
    }, [contextUser]);

    return (
        <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 13 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 13 }} />
                <Tooltip
                    contentStyle={{ fontSize: 14 }}
                    formatter={(value, name) =>
                        name === "casesHandled"
                            ? [`${value} case`, "Số case"]
                            : [`${value} msg`, "Tin nhắn"]
                    }
                />
                <Legend verticalAlign="top" height={30} iconType="circle" />
                <Bar
                    dataKey="casesHandled"
                    name="Số case xử lý"
                    fill="#4f8edc"
                    radius={[4, 4, 0, 0]}
                    barSize={32}
                >
                    <LabelList dataKey="casesHandled" position="top" fill="#222" fontSize={13} />
                </Bar>
                {/* Nếu muốn thêm số tin nhắn, bỏ comment dòng dưới */}
                {/* <Bar
                    dataKey="messagesSent"
                    name="Tin nhắn gửi"
                    fill="#b3c6e7"
                    radius={[4, 4, 0, 0]}
                    barSize={20}
                >
                    <LabelList dataKey="messagesSent" position="top" fill="#555" fontSize={12} />
                </Bar> */}
            </BarChart>
        </ResponsiveContainer>
    );
}

export default StaffActivityChart;