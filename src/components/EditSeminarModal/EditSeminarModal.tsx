import React, { useState } from "react";
import "./EditSeminarModal.scss";

interface Seminar {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  photo: string;
}

interface Props {
  seminar: Seminar;
  onSave: (updatedSeminar: Seminar) => void;
  onClose: () => void;
}

const EditSeminarModal: React.FC<Props> = ({ seminar, onSave, onClose }) => {
  const [title, setTitle] = useState(seminar.title);
  const [description, setDescription] = useState(seminar.description);
  const [date, setDate] = useState(seminar.date);
  const [time, setTime] = useState(seminar.time);
  const [errors, setErrors] = useState<{
    title?: string;
    description?: string;
    date?: string;
    time?: string;
  }>({});

  const validate = () => {
    const newErrors: typeof errors = {};

    if (!title.trim()) {
      newErrors.title = "Название семинара не может быть пустым.";
    }

    if (!description.trim()) {
      newErrors.description = "Описание семинара не может быть пустым.";
    }

    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Установить время на полночь для сравнения
    if (selectedDate < today) {
      newErrors.date = "Дата семинара не может быть в прошлом.";
    }

    if (!time) {
      newErrors.time = "Пожалуйста, выберите время.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validate()) {
      const updatedSeminar: Seminar = {
        ...seminar,
        title,
        description,
        date,
        time,
      };
      onSave(updatedSeminar);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2 className="modal-title">Редактировать Семинар</h2>
          <button className="modal-close" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="modal-body">
          <input
            type="text"
            className={`modal-input ${errors.title ? "error" : ""}`}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Название семинара"
          />
          {errors.title && <div className="error-message">{errors.title}</div>}

          <textarea
            className={`modal-input ${errors.description ? "error" : ""}`}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Описание семинара"
          />
          {errors.description && (
            <div className="error-message">{errors.description}</div>
          )}

          <input
            type="date"
            className={`modal-input ${errors.date ? "error" : ""}`}
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          {errors.date && <div className="error-message">{errors.date}</div>}

          <input
            type="time"
            className={`modal-input ${errors.time ? "error" : ""}`}
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
          {errors.time && <div className="error-message">{errors.time}</div>}
        </div>
        <div className="modal-button-container">
          <button className="modal-button cancel-button" onClick={onClose}>
            Отмена
          </button>
          <button className="modal-button" onClick={handleSave}>
            Сохранить
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditSeminarModal;
