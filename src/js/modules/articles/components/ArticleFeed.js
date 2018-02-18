import React, { PureComponent } from "react";
import { graphql } from "react-apollo";
import gql from "graphql-tag";
import humps from "humps";
import injectSheet from "react-jss";

import ArticleList from "./ArticleList";
import { ARTICLES_PER_PAGE } from "../constants";

const ArticleFeedQuery = gql`
  query ArticleFeedQuery($section_id: ID, $offset: Int, $limit: Int) {
    latestArticles(section_id: $section_id, offset: $offset, limit: $limit) {
      id
      title
      slug
      preview
      created_at
      section {
        id
        permalink
      }
      contributors {
        first_name
        last_name
        slug
      }
      media {
        title
        media_type
        attachment_url
        medium_attachment_url
        thumb_attachment_url
      }
    }
  }
`;

const styles = {
  ArticleFeed: {
    marginBottom: "36px",
  },
  buttonContainer: {
    display: "flex",
    width: "100%",
    justifyContent: "center",
  },
  loadMoreButton: {
    background: "#9dba73",
    borderRadius: "3px",
    color: "#fff",
    fontFamily: "Canela",
    border: "none",
    padding: "12px 16px",
    fontSize: "16px",
    cursor: "pointer",
  },
};

class ArticleFeed extends PureComponent {
  constructor(props) {
    super(props);

    this.state = { isLoadMoreButtonVisible: true };
  }

  componentWillUpdate(nextProps) {
    // If no articles have loaded yet or we have already removed the load-more
    // button, we don't do anything.
    if (
      !(nextProps.latestArticles && this.props.latestArticles) ||
      !this.state.isLoadMoreButtonVisible
    ) {
      return;
    }

    // If after getting the next page of articles we still have the same
    // number of articles or the number of articles we have is not a multiple
    // of ARTICLES_PER_PAGE, we know there aren't any articles left.
    if (
      nextProps.latestArticles.length === this.props.latestArticles.length ||
      nextProps.latestArticles.length % ARTICLES_PER_PAGE !== 0
    ) {
      this.setState({ isLoadMoreButtonVisible: false });
    }
  }

  render() {
    const { classes, loading, loadMoreEntries, title = "Latest" } = this.props;

    if (loading) {
      return null;
    }

    const { isLoadMoreButtonVisible } = this.state;
    let { latestArticles } = this.props;
    latestArticles = humps.camelizeKeys(latestArticles);

    return (
      <div className={classes.ArticleFeed}>
        <ArticleList articles={latestArticles} title={title} label="Articles" />
        {isLoadMoreButtonVisible && (
          <div className={classes.buttonContainer}>
            <button
              className={classes.loadMoreButton}
              onClick={loadMoreEntries}
            >
              Load More
            </button>
          </div>
        )}
      </div>
    );
  }
}

export default graphql(ArticleFeedQuery, {
  // options uses props to compute how a query is fetched.
  options: ({ section }) => ({
    variables: {
      // ArticleFeed is both used on SectionPage's and the LatestPage.
      section_id: section ? section.id : null,

      // We start with the first {ARTICLES_PER_PAGE} articles.
      offset: 0,
      limit: ARTICLES_PER_PAGE,
    },
  }),

  // the props function intercepts the props passed to ArticleFeed and lets us
  // restructure them.
  props: ({ data: { loading, latestArticles, fetchMore } }) => ({
    loading,
    latestArticles,

    // the loadMoreEntries function uses Apollo's fetchMore function fetch more
    // articles.
    loadMoreEntries: () => {
      return fetchMore({
        variables: {
          // We update our offset to get the next page of articles.
          offset: latestArticles.length,
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          if (!fetchMoreResult) {
            return previousResult;
          }
          return {
            ...previousResult,
            latestArticles: [
              ...previousResult.latestArticles,
              ...fetchMoreResult.latestArticles,
            ],
          };
        },
      });
    },
  }),
})(injectSheet(styles)(ArticleFeed));
