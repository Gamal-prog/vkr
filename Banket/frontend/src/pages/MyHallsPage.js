import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './MyHallsPage.css';

function MyHallsPage() {
  const [halls, setHalls] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMyHalls = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const currentUserId = parseInt(localStorage.getItem('userId'), 10);
        const response = await axios.get('http://127.0.0.1:8000/api/halls/', {
          headers: { Authorization: `Token ${token}` }
        });

        const filtered = response.data
          .filter(h => h.owner === currentUserId)
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)); // Сортировка: новые в начале

        setHalls(filtered);
      } catch (err) {
        console.error(err);
        setError('Ошибка при загрузке залов владельца');
      }
    };

    fetchMyHalls();
  }, []);

  const handleDelete = async (id) => {
    const confirm = window.confirm('Удалить зал?');
    if (!confirm) return;

    try {
      const token = localStorage.getItem('authToken');
      await axios.delete(`http://127.0.0.1:8000/api/halls/${id}/`, {
        headers: { Authorization: `Token ${token}` }
      });
      setHalls(prev => prev.filter(h => h.id !== id));
    } catch (err) {
      alert('Ошибка при удалении зала.');
    }
  };

  return (
    <div className="my-halls-container">
      <h2>Мои залы</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div className="hall-grid">
        {halls.length === 0 ? (
          <p>У вас пока нет залов.</p>
        ) : (
          halls.map(hall => {
            const imageUrl = hall.image?.startsWith('http')
              ? hall.image
              : `http://127.0.0.1:8000${hall.image}`;

            return (
              <div className="hall-card" key={hall.id}>
                {hall.image && (
                  <img src={imageUrl} alt={hall.name} className="hall-image" />
                )}
                <div className="hall-info">
                  <h3>{hall.name}</h3>
                  <p><strong>Адрес:</strong> {hall.address || 'Не указан'}</p>
                  <p><strong>Вместимость:</strong> {hall.capacity_min}–{hall.capacity_max}</p>
                  <div className="hall-buttons">
                    <Link to={`/halls/${hall.id}`} className="hall-link">Подробнее</Link>
                    <Link to={`/owner/halls/${hall.id}/edit`} className="edit-button">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                        <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                        <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
                      </svg>
                    </Link>
                    <button onClick={() => handleDelete(hall.id)} className="delete-button">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                        <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default MyHallsPage;
