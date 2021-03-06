import React, { useEffect, useState } from 'react';
import { useParams, Link} from 'react-router-dom';
import PulseLoader from "react-spinners/PulseLoader"
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Pagination from 'react-bootstrap/Pagination';
import { PersonFill, Calendar, ArrowRightCircle, ChatLeftText, StarFill } from 'react-bootstrap-icons';
import * as api from '../utils/api'; 
import SortArticles from './SortArticles';
import ArticleTabs from './ArticleTabs';

const Articles = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [allArticles, setAllArticles] = useState([]);
    const [isError, setIsError] = useState(false);
    const [currPage, setCurrPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedSortBy, setSelectedSortBy] = useState("default");
    const { topic, author } = useParams();

    useEffect(() => {

        const queries = {topic, author, currPage}

        if(selectedSortBy !== "default") {
        const sortQuery = selectedSortBy.split(":")
        queries.sort_by = sortQuery[0];
        queries.order = sortQuery[1];
        }
        
        setIsLoading(true)
        setIsError(false);
        api.getArticles(queries)
        .then((dataFromApi) => {
            setAllArticles(dataFromApi.articles)
            setTotalPages(Math.ceil(dataFromApi.total_count / 9))
        })
        .catch(() => {
            setIsError(true);
            
        }).finally(() => {
          setIsLoading(false);
        });
    }, [topic, author, currPage, selectedSortBy])

  
    let active = currPage;
    let paginationItems = [];
    for (let number = 1; number <= totalPages; number++) {
    paginationItems.push(
      <Pagination.Item key={number} active={number === active} onClick={() => setCurrPage(number)}>
        {number}
      </Pagination.Item>,
    );
    }

    if (isLoading) {
      return (
        <section className="Loading-page" >
          <PulseLoader color={"#577399"}/>
        </section>
      )
    }

    return (
            <>
                {isError ? (
                <section className="ArticlesList-error">
                  <Link to="/" className="Card_container">
                  <Card >
                      <section className="Card_header">
                        <h3 className="Card_title">Sorry we can't find any articles right now</h3>
                      </section>
                      
                      <Card.Body className="Card_body">
                        <p>Please try again later</p>
                        <Button className="Card_button" 
                                variant="primary"
                     >Go back home
                        </Button>
                      </Card.Body>
                    </Card>
                  </Link>
                </section>
                ) : (
                    <section>
                    <ArticleTabs topic={topic} setCurrPage={setCurrPage}/>
                    <SortArticles selectedSortBy={selectedSortBy} setSelectedSortBy={setSelectedSortBy} />
                    <ul className="ArticlesList">
                        {allArticles.map((article, index) => {
                            let shortBody = ""; 
                            shortBody += article.body.split(" ").slice(0, 20).join(" ") + "..."

                            return (
                              <Link to={`/articles/${article.article_id}`} className="Card_container" key={article.article_id}>
                                <Card >
                                <section className="Card_header">
                                  <h3 className="Card_title">{article.title.toLowerCase()}</h3>
                                </section>
                                
                                <Card.Body className="Card_body">
                                  <section>
                                       <p className={`Card_topic Card_topic-${article.topic}`}>{article.topic}</p>
                                        <p className="Card_intro">{shortBody}</p>
                                        <p className="Card_metadata">
                                            <span role="img" aria-label="Written by"><PersonFill className="Card_metadata-icon"/></span> {article.author} 
                                            <span className="Card_metadata-date"><span role="img" aria-label="Date" className="Card_date-icon"><Calendar/></span> {new Date(article.created_at).toLocaleDateString("en-GB")}</span>
                                        </p> 
                                        <p className="Card_interactions">
                                             <span role="img" aria-label="Number of comments"><ChatLeftText className="Card_interactions-icon" /></span> {article.comment_count} 
                                            <span className="Card_interactions-starCount"> <span role="img" aria-label="Number of stars" className="Card_interactions-starIcon"><StarFill /></span> {article.votes}</span>
                                        </p> 
                                  </section>
                                  <Button className="Card_button" 
                                          variant="primary"
                                  >Read full article  <ArrowRightCircle /></Button>
                                </Card.Body>
                              </Card>
                            </Link>
                            )
                        })}
                    </ul>
                    <Pagination className="ArticlePages">{paginationItems}</Pagination>
                </section>
                )}
           </>
    );
};

export default Articles;