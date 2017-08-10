import React from "react";
import { Grid } from "react-bootstrap/lib";
import injectSheet from "react-jss";

import ArticleRow from "./ArticleRow";

const styles = {
  ArticleList: {
    padding: 0,
  },
};

const ArticleList = ({ classes, articles, featuredMedia, section }) => {
  const createArticleRows = () => {
    return Object.keys(articles).map(articleSlug => {
      const article = articles[ articleSlug ];
      return <ArticleRow article={article}
                         featuredMedia={featuredMedia}
                         section={section}/>;
    })
  };
  return (
    <Grid className={classes.ArticleList}>
      {createArticleRows()}
    </Grid>
  )
};

export default injectSheet(styles)(ArticleList);