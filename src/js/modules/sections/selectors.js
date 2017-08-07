import { createSelector } from 'reselect';
import { objectFilter } from '../../utils.js';

Object.filter = objectFilter;

export const getSections = (state) => state.sections.sections;
export const getSectionFromProps = (state, props) => props.section;

/**
 * The selector returns a filtered sections object which contains direct and
 *   indirect children of a target section.
 */
const getSubsectionsInSectionTree = (sections, targetSection) => {
  return Object.filter(sections, sectionTraversingUpwards => {
    while (sectionTraversingUpwards.parentSlug !== null) {
      sectionTraversingUpwards = sections[ sectionTraversingUpwards.parentSlug ];
    }
    return sectionTraversingUpwards === targetSection;
  });
};

/**
 * The selector returns a filtered sections object which contains direct
 *   children of the props-requested section,
 */
export const getDirectChildrenOfSection = createSelector(
  [ getSections, getSectionFromProps ],
  (sections, targetSection) => {
    return Object.filter(sections, section => {
      return section.parentSlug === targetSection.slug;
    })
  }
)

/**
 * The selector returns an array of all direct and indirect section children of
 *   a target section for section and subsection routing.
 */
export const getSlugsInSectionTree = createSelector(
  [ getSections, getSectionFromProps ],
  (sections, targetSection) => {
    const subsectionsInSectionTree = getSubsectionsInSectionTree(sections, targetSection)
    return [ targetSection.slug, ...Object.keys(subsectionsInSectionTree) ];
  }
);

/**
 * The selector returns a sections object in which all nested section objects
 *   contain the section's direct and indirect section children.
 */
export const getTopLevelSectionsWithDirectChildren = createSelector(
  [ getSections ],
  (sections) => {
    let topLevelSectionsWithDirectChildren = {};
    Object.keys(sections).map((sectionSlug) => {
      const targetSection = sections[ sectionSlug ];
      if (targetSection.parentSlug === null) {
        topLevelSectionsWithDirectChildren[ sectionSlug ] = {
          ...targetSection,
          subsections: Object.filter(sections, section => {
            return section.parentSlug === targetSection.slug;
          })
        };
      }
    });
    return topLevelSectionsWithDirectChildren;
  }
);

export const getSectionSlugFromId = (sections, id) => {
  for (sectionSlug in sections) {
    const section = sections[ sectionSlug ];
    if (section.id === id) {
      return section.slug;
    }
  }
};