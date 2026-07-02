// api/add-review.js
const fs = require('fs');
const path = require('path');

export default async function handler(req, res) {
    // Разрешаем только POST-запросы
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Метод не разрешён' });
    }

    try {
        const { name, rating, text } = req.body;

        // Проверяем данные
        if (!name || !rating || !text) {
            return res.status(400).json({ error: 'Все поля обязательны' });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({ error: 'Оценка должна быть от 1 до 5' });
        }

        // Путь к файлу reviews.json в корне проекта
        const filePath = path.join(process.cwd(), 'reviews.json');

        // Читаем существующие отзывы
        let reviews = [];
        try {
            const fileContent = fs.readFileSync(filePath, 'utf8');
            reviews = JSON.parse(fileContent);
        } catch (error) {
            // Если файла нет — создаём пустой массив
            reviews = [];
        }

        // Добавляем новый отзыв
        const newReview = {
            id: Date.now(),
            name: name.trim(),
            rating: parseInt(rating),
            text: text.trim(),
            date: new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
        };

        reviews.unshift(newReview); // Добавляем в начало

        // Сохраняем в файл
        fs.writeFileSync(filePath, JSON.stringify(reviews, null, 2), 'utf8');

        res.status(200).json({ success: true, review: newReview });

    } catch (error) {
        console.error('Ошибка:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
}
