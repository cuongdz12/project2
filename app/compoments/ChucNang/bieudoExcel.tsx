"use client";
import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";

interface ChartComponentProps {
  data?: Array<{ createAt: string }>;
  visible: boolean;
}

const transformData = (data: Array<{ createAt: string }>) => {
  const dateCounts: { [key: string]: number } = {};

  data.forEach((item) => {
    const date = item.createAt.split("T")[0]; // Lấy phần ngày của createAt
    if (dateCounts[date]) {
      dateCounts[date] += 1;
    } else {
      dateCounts[date] = 1;
    }
  });

  return Object.keys(dateCounts).map((date) => ({
    name: date,
    count: dateCounts[date],
  }));
};

const ChartComponent: React.FC<ChartComponentProps> = ({
  data = [], // Cung cấp giá trị mặc định là mảng trống
  visible,
}) => {
  const [todayCount, setTodayCount] = useState<number>(0);

  useEffect(() => {
    if (visible && data.length > 0) {
      const transformedData = transformData(data);
      const today = new Date().toISOString().split("T")[0]; // Ngày hiện tại
      const todayCount =
        transformedData.find((item) => item.name === today)?.count || 0;
      setTodayCount(todayCount);
    }
  }, [data, visible]);

  if (!visible) return null;

  // Kiểm tra xem data có phải là mảng không
  const isArray = Array.isArray(data);
  const transformedData = isArray ? transformData(data) : [];

  const maxCount = Math.max(...transformedData.map((item) => item.count), 0);

  const chartData = {
    labels: transformedData.map((item) => item.name), // Chỉ sử dụng data nếu là mảng
    datasets: [
      {
        label: "Số Lượng Danh Mục",
        data: transformedData.map((item) => item.count), // Chỉ sử dụng data nếu là mảng
        backgroundColor: "#FFCC01",
        borderColor: "#FFCC01",
        borderWidth: 3,
        barThickness: 60,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: false, // Tắt tiêu đề biểu đồ mặc định
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Ngày",
        },
        // Hiển thị tất cả các ngày trên trục x nếu cần thiết
        ticks: {
          autoSkip: false, // Đảm bảo rằng tất cả các ngày đều được hiển thị
          maxRotation: 90, // Xoay nhãn ngày nếu cần thiết để tránh bị chồng chéo
        },
      },
      y: {
        title: {
          display: true,
          text: "Số lượng",
        },
        beginAtZero: true,
        ticks: {
          stepSize: 2, // Đặt khoảng cách giữa các giá trị trên trục y
          max: maxCount + 1, // Đặt giá trị tối đa trên trục y
        },
      },
    },
  };

  return (
    <div className="w-[92%] h-[65%] ml-10">
      <div className="text-center mb-4 mt-5 ">
        <h2 className="text-xl font-bold">Số Lượng Danh Mục Theo Ngày</h2>
      </div>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default ChartComponent;
