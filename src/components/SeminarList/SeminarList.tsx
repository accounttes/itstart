import React, { useEffect, useState } from "react";
import { toast, Toaster } from "react-hot-toast"; // Импортируйте необходимые элементы
import "./SeminarList.scss"; // Импортируйте файл стилей
import EditSeminarModal from "../EditSeminarModal/EditSeminarModal";
import {
  deleteSeminar,
  fetchSeminars,
  updateSeminar,
} from "../../services/seminarService";

interface Seminar {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  photo: string;
}

const SeminarList: React.FC = () => {
  const [seminars, setSeminars] = useState<Seminar[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSeminar, setSelectedSeminar] = useState<Seminar | null>(null);

  const deleteNotifications = (ms: number) => {
    setTimeout(() => toast.dismiss(), ms);
  };

  useEffect(() => {
    const loadSeminars = async () => {
      try {
        const data = await fetchSeminars();
        setSeminars(data);
      } catch {
        setError("Ошибка при загрузке семинаров");
      } finally {
        setLoading(false);
      }
    };

    loadSeminars();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm("Вы уверены, что хотите удалить этот семинар?")) {
      toast.loading("Удаление семинара...");

      try {
        await deleteSeminar(id);
        setSeminars(seminars.filter((seminar) => seminar.id !== id));
        deleteNotifications(500);
      } catch {
        toast.error("Ошибка при удалении семинара.");
        setError("Ошибка при удалении семинара");
      }
    }
  };

  const handleSave = async (updatedSeminar: Seminar) => {
    toast.loading("Сохранение семинара...");

    try {
      const response = await updateSeminar(updatedSeminar);
      setSeminars(
        seminars.map((seminar) =>
          seminar.id === response.id ? response : seminar
        )
      );
      setSelectedSeminar(null); // Закрыть модальное окно
      deleteNotifications(500);
    } catch {
      toast.error("Ошибка при сохранении семинара.");
      setError("Ошибка при сохранении семинара");
    }
  };

  if (loading) return <div className="loading">Загрузка...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="seminars-container">
      <Toaster /> {/* Добавляем место для toast уведомлений */}
      <h1>Семинары</h1>
      {seminars && seminars.length === 0 && <span>Пусто</span>}
      <ul className="seminar-list">
        {seminars.map((seminar) => (
          <li className="seminar-item" key={seminar.id}>
            <h2 className="seminar-title">{seminar.title}</h2>
            <p className="seminar-description">{seminar.description}</p>
            <p className="seminar-date-time">
              {seminar.date} в {seminar.time}
            </p>
            <img
              src={seminar.photo}
              alt={seminar.title}
              className="seminar-photo"
            />
            <div className="seminar-buttons">
              <button
                className="seminar-button delete-button"
                onClick={() => handleDelete(seminar.id)}
              >
                Удалить
              </button>
              <button
                className="seminar-button edit-button"
                onClick={() => setSelectedSeminar(seminar)}
              >
                Редактировать
              </button>
            </div>
          </li>
        ))}
      </ul>
      {selectedSeminar && (
        <EditSeminarModal
          seminar={selectedSeminar}
          onSave={handleSave}
          onClose={() => setSelectedSeminar(null)}
        />
      )}
    </div>
  );
};

export default SeminarList;
