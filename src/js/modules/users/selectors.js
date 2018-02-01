import { createSelector } from "reselect";

export const getUsers = state => state.users.users;
export const getRoles = state => state.users.roles;
export const getprofiles = state => state.users.profiles;

const getRequestedContributorSlug = (state, props) =>
  props.match.params.contributor_slug;
const getRequestedIllustratorSlug = (state, props) =>
  props.match.params.illustrator_slug;
const getRequestedPhotographerSlug = (state, props) =>
  props.match.params.photographer_slug;

const getRoleFromProps = (state, props) => props.role;

export const getContributorFromSlug = createSelector(
  [getUsers, getprofiles, getRequestedContributorSlug, getRoles],
  (users, profiles, requestedContributorSlug, roles) => {
    const user = Object.values(users).find(user => {
      return user.slug === requestedContributorSlug;
    });
    if (
      user &&
      profiles.find(profile => {
        return (
          profile.userId === user.id &&
          roles[profile.roleId].title === "Contributor"
        );
      })
    ) {
      return user;
    }
  },
);

export const getIllustratorFromSlug = createSelector(
  [getUsers, getprofiles, getRequestedIllustratorSlug, getRoles],
  (users, profiles, requestedIllustratorSlug, roles) => {
    const user = Object.values(users).find(user => {
      return user.slug === requestedIllustratorSlug;
    });
    if (
      user &&
      profiles.find(profile => {
        return (
          profile.userId === user.id &&
          roles[profile.roleId].title === "Illustrator"
        );
      })
    ) {
      return user;
    }
  },
);

export const getPhotographerFromSlug = createSelector(
  [getUsers, getprofiles, getRequestedPhotographerSlug, getRoles],
  (users, profiles, requestedPhotographerSlug, roles) => {
    const user = Object.values(users).find(user => {
      return user.slug === requestedPhotographerSlug;
    });
    if (
      user &&
      profiles.find(profile => {
        return (
          profile.userId === user.id &&
          roles[profile.roleId].title === "Photographer"
        );
      })
    ) {
      return user;
    }
  },
);

/**
 * The selector returns all users for the RolePage.
 */
export const getUsersInRole = createSelector(
  [getUsers, getRoleFromProps, getprofiles],
  (users, role, profiles) => {
    return profiles.reduce((acc, profile) => {
      if (profile.roleId === role.id) {
        const user = users[profile.userId];
        acc[user.id] = user;
      }
      return acc;
    }, {});
  },
);
