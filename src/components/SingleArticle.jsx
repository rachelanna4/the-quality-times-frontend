import React, { useEffect, useState } from 'react';
import { useParams} from 'react-router-dom';
import * as api from '../utils/api'; 

const SingleArticle = () => {
    const {article_id} = useParams()
    const [article, setArticle] = useState("")
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        setIsError(false);
        api.getSingleArticle(article_id)
        .then((articleFromApi) => {
            setArticle(articleFromApi)
        })
        .catch(() => {
            setIsError(true);
        });
    }, [article_id])


    return (
        <> 
            {isError ? (
            <section className="SingleArticle-error">
                <p>Oops! Something went wrong and we can't find the article</p>
                <p>Try again later</p>
            </section>
            ): (
            <section className="SingleArticle">
                <p>{article.title}</p>
                <p>{article.author}</p>
                <p>{new Date(article.created_at).toLocaleDateString("en-GB")}</p>
                <p>{article.body}</p>
                <p>{article.topic}</p>
                <p>{article.votes}</p>
                <p>{article.comment_count}</p>
            </section>
            )
        }
        </>
    );
};

export default SingleArticle;