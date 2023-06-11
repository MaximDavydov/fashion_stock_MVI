import React from "react";
import { Container, Card, Button } from "react-bootstrap";

import article1 from '../articles/article1.jpeg'
import article2 from '../articles/article2.jpeg'
import article3 from '../articles/article3.jpeg'

const BlogScreen = () => {
    const articles = [
        {
            id: 1,
            title: "Тенденции весны-лето 2023",
            content: "Одна из главных тенденций моды на весну-лето 2023 - это яркие и сочные цвета. В этом сезоне дизайнеры предлагают носить наряды в ярких оттенках, таких как ярко-розовый, оранжевый, синий и лаймовый. Эти цвета прекрасно подойдут для создания свежих и стильных образов.",
            image: article1,
            link: 'https://www.marieclaire.ru/moda/20-glavnykh-trendov-vesny-i-leta-2023-samyi-polnyi-gid/'
        },
        {
            id: 2,
            title: "Мода на аксессуары",
            content: "Аксессуары играют важную роль в создании модного образа. В сезоне весна-лето 2023 особенно популярны будут большие и необычные украшения. Громадные серьги, яркие браслеты и необычные колье станут отличным дополнением к вашему стилю. Не бойтесь экспериментировать с аксессуарами и создавать яркие и запоминающиеся образы.",
            image: article2,
            link: "https://www.alltime.ru/blog/?page=post&blog=watchblog&post_id=modnye-aksessuary-v-thisyear-godu-podbiraem-k-odezhde"
        },
        {
            id: 3,
            title: "Как создать стильный образ",
            content: "Создание стильного образа требует внимания к деталям. При выборе одежды стоит обращать внимание на силуэты, материалы и сочетаемость цветов. Не бойтесь экспериментировать с разными стилями и элементами, чтобы создать уникальный и стильный образ, отражающий вашу индивидуальность.",
            image: article3,
            link: "https://minikar.ru/spirituality/kak-sozdat-svoi-obraz-prostye-fishki-ot-stilistov-kotorye/"
        },
    ];

    return (
        <Container>
            <h2 className="my-4">Блог моды</h2>

            {articles.map((article) => (
                <Card key={article.id} className="mb-4">
                    <div className="card-image" style={{ backgroundImage: `url(${article.image})` }}></div>
                    <Card.Body>
                        <Card.Title>{article.title}</Card.Title>
                        <Card.Text>{article.content}</Card.Text>
                        <a href={article.link} target="_blank">
                            <Button variant="primary">Читать далее</Button>
                        </a>
                    </Card.Body>
                </Card>
            ))}
        </Container>
    );
};

export default BlogScreen;
