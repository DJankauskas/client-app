import React from "react";
import { Link } from 'react-router-dom'

const SectionFeaturedMedia = ({
  featuredArticle,
  featuredMedia,
  section
}) => {
  return (
      <Link to={`${section.permalink}/${featuredArticle.slug}`}>
        <figure>
          <img src={featuredMedia.attachmentUrl} />
        </figure>
      </Link>
  );
};

export default SectionFeaturedMedia;
