import axios from "axios";

const BASE_URL = "http://localhost:3004/seminars";

export const fetchSeminars = async () => {
  const response = await axios.get(BASE_URL);
  return response.data;
};

export const deleteSeminar = async (id: number) => {
  await axios.delete(`${BASE_URL}/${id}`);
};

export const updateSeminar = async (seminar: {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  photo: string;
}) => {
  const response = await axios.put(`${BASE_URL}/${seminar.id}`, seminar);
  return response.data;
};
