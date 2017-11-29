import React from "react";

const SectionFeaturedArticle = ({ classes, section, featuredArticle }) => {
  return (
    <div>
      <Link className={classes.featuredArticleSection} to={section.permalink}>
        {section.name === "Arts & Entertainment" ? "A&E" : section.name}
      </Link>
      <Link
        className={classes.featuredArticleTitle}
        to={`${section.permalink}/${featuredArticle.slug}`}
      >
        {featuredArticle.title}
      </Link>
      <p className={classes.featuredArticleSummary}>
        {featuredArticle.summary}
      </p>
      <Byline contributors={featuredArticle.contributors} />
      <Dateline article={featuredArticle} />
    </div>
  );
};

export default SectionFeaturedArticle;